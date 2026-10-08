// Franchise partner session storage.
//
// The franchisor portal is a separate identity from the retail customer session
// that AuthProvider keeps under "token"/"user". Franchise credentials therefore
// live under their own keys, so signing in as a franchise partner never disturbs
// a customer login and vice versa.
//
// The session is written the moment /franchise/login succeeds. `name`, `mobile`
// and `email` are filled in later by the dashboard from
// GET /auth/franchise/profile, because the login response only carries the
// franchisee ID and token.

export const FRANCHISE_SESSION_KEY = "indexia_franchise_session";
export const FRANCHISE_TOKEN_KEY = "indexia_franchise_token";

export interface FranchiseSession {
  /** The franchisee ID issued by the backend, e.g. "FRN000003". */
  franchiseId: string;
  /** Identity confirmed by the profile endpoint, when it could be loaded. */
  name?: string;
  mobile?: string;
  email?: string;
  /** Agreement status reported by the profile endpoint. */
  franchiseStatus?: string;
  isVerified?: boolean;
  /** Region on the franchise record. */
  continent?: string;
  country?: string;
}

/** The signed-in franchisee, or null when there is no franchise session. */
export const readFranchiseSession = (): FranchiseSession | null => {
  try {
    const raw = localStorage.getItem(FRANCHISE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FranchiseSession;
    return parsed?.franchiseId ? parsed : null;
  } catch {
    return null;
  }
};

/** Bearer token for franchise endpoints; null when signed out. */
export const readFranchiseToken = (): string | null =>
  localStorage.getItem(FRANCHISE_TOKEN_KEY);

export const isFranchiseSignedIn = (): boolean =>
  Boolean(readFranchiseSession() && readFranchiseToken());

export const saveFranchiseSession = (
  session: FranchiseSession,
  token: string,
): void => {
  localStorage.setItem(FRANCHISE_SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(FRANCHISE_TOKEN_KEY, token);
};

/**
 * Records profile details captured after sign-in without dropping the fields the
 * login response already gave us.
 */
export const mergeFranchiseProfile = (
  details: Partial<FranchiseSession>,
): FranchiseSession | null => {
  const session = readFranchiseSession();
  if (!session) return null;
  const merged: FranchiseSession = { ...session };
  // Named fields rather than a generic key loop, so each assignment stays type-checked.
  const textFields = [
    "franchiseId",
    "name",
    "mobile",
    "email",
    "franchiseStatus",
    "continent",
    "country",
  ] as const satisfies readonly (keyof FranchiseSession)[];
  textFields.forEach((key) => {
    const value = details[key];
    if (typeof value === "string" && value.trim()) merged[key] = value.trim();
  });
  if (typeof details.isVerified === "boolean") merged.isVerified = details.isVerified;
  localStorage.setItem(FRANCHISE_SESSION_KEY, JSON.stringify(merged));
  return merged;
};

/** Ends the franchise session only — the customer session is left untouched. */
export const clearFranchiseSession = (): void => {
  localStorage.removeItem(FRANCHISE_SESSION_KEY);
  localStorage.removeItem(FRANCHISE_TOKEN_KEY);
};
