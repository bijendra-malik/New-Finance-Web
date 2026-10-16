const PENDING_KEY = "applySessionPending";
const ENTRY_KEY = "applyEntryIdentity";

/** The identity registered at loan entry — POST /auth/{loanSlug}. */
export interface ApplyEntryIdentity {
  mobile: string;
  fullName: string;
  email: string;
  dob: string;
  panNumber: string;
}

/** Marks the current token as belonging to an in-progress application. */
export const markApplySessionPending = (): void => {
  try {
    localStorage.setItem(PENDING_KEY, "1");
  } catch {
    // Storage unavailable (private mode) — the session simply lives on.
  }
};

export const isApplySessionPending = (): boolean => {
  try {
    return localStorage.getItem(PENDING_KEY) === "1";
  } catch {
    return false;
  }
};

export const clearApplySessionPending = (): void => {
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {
    // Nothing to clear.
  }
};

/**
 * Remembers the identity a successful loan entry registered, so the
 * application form submits exactly what the backend verified. A later
 * re-registration overwrites it with the refreshed details (the same moment
 * the token is refreshed), and signing in as a different mobile can never
 * read it back — see readApplyEntryIdentity.
 */
export const saveApplyEntryIdentity = (identity: ApplyEntryIdentity): void => {
  try {
    localStorage.setItem(ENTRY_KEY, JSON.stringify(identity));
  } catch {
    // Storage unavailable — the form falls back to the signed-in account.
  }
};

/**
 * The loan-entry identity for the customer who is currently signed in, or null
 * when there is none: nothing stored, a missing/blank field, or a record that
 * belongs to a different mobile than the live session.
 */
export const readApplyEntryIdentity = (): Partial<ApplyEntryIdentity> | null => {
  try {
    const raw = localStorage.getItem(ENTRY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ApplyEntryIdentity;
    const userRaw = localStorage.getItem("user");
    const sessionMobile = userRaw
      ? ((JSON.parse(userRaw) as { mobile?: string }).mobile ?? "").replace(/\D/g, "").slice(-10)
      : "";
    if (!sessionMobile || parsed?.mobile !== sessionMobile) return null;
    const identity: Partial<ApplyEntryIdentity> = { mobile: sessionMobile };
    if (parsed.fullName?.trim()) identity.fullName = parsed.fullName;
    if (parsed.email?.trim()) identity.email = parsed.email;
    if (parsed.dob?.trim()) identity.dob = parsed.dob;
    if (parsed.panNumber?.trim()) identity.panNumber = parsed.panNumber;
    return Object.keys(identity).length > 0 ? identity : null;
  } catch {
    return null;
  }
};

/** Drops an unsubmitted apply session — token, cached profile and marker. */
export const dropApplySession = (): void => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem(PENDING_KEY);
    localStorage.removeItem(ENTRY_KEY);
  } catch {
    // Storage unavailable — the AuthProvider logout still clears React state.
  }
};
