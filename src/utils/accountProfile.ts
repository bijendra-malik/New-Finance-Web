// Account profile storage The account created from the header panel is kept in localStorage so both the header and the shared loan-application form can read it synchronously.

export type Role = "Customer" | "Franchise";

export interface AccountProfile {
  name: string;
  role: Role;
  country: string;
  countryIso: string;
  phone: string;
  email: string;
  /** Optional: collected later at the loan sign-up / OTP step. */
  dob?: string;
  pan?: string;
}

export const PROFILE_KEY = "indexia_account";
export const SESSION_KEY = "indexia_account_session";
export const LANGUAGE_KEY = "indexia_language";

/** The stored account record, whether or not anyone is signed in on it. */
export const readAccountRecord = (): AccountProfile | null => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AccountProfile;
    return parsed?.name ? parsed : null;
  } catch {
    return null;
  }
};

/** Signing out ends the session but keeps the record, so Sign In can restore it. */
export const endSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const startSession = (): void => {
  localStorage.setItem(SESSION_KEY, "1");
};

/** The account the visitor is currently signed in to — null when signed out. */
export const readStoredProfile = (): AccountProfile | null => {
  if (!localStorage.getItem(SESSION_KEY)) return null;
  return readAccountRecord();
};

export const writeStoredProfile = (profile: AccountProfile): void => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  startSession();
};

/** Forgets the account entirely (used when the visitor asks to be removed). */
export const clearStoredProfile = (): void => {
  localStorage.removeItem(PROFILE_KEY);
  endSession();
};

/**
 * Adds details captured after the account was created (the loan sign-up step
 * collects DOB and PAN) without disturbing the role, location or contact data.
 */
export const mergeAccountDetails = (details: Partial<AccountProfile>): void => {
  const record = readAccountRecord();
  if (!record) return;
  const merged = { ...record };
  (Object.keys(details) as (keyof AccountProfile)[]).forEach((key) => {
    const value = details[key];
    if (typeof value === "string" && value.trim()) {
      (merged as Record<string, string>)[key] = value.trim();
    }
  });
  localStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
  startSession();
};

export const readStoredLanguage = (): string => {
  try {
    return localStorage.getItem(LANGUAGE_KEY) || "en";
  } catch {
    return "en";
  }
};

export const writeStoredLanguage = (code: string): void => {
  localStorage.setItem(LANGUAGE_KEY, code);
};

/** Personal-details fields a signed-in applicant has already supplied. */
export type LockableField =
  | "fullName" | "mobile" | "email" | "dob" | "panNumber"
  | "state" | "city" | "pincode";

/**
 * Maps a stored profile onto the loan application's personal-details fields.
 * Anything blank or missing is left out, so the applicant still fills it in.
 * The phone is reduced to its last 10 digits to drop any country code.
 */
export const accountFieldDefaults = (
  profile: AccountProfile | null,
): Partial<Record<LockableField, string>> => {
  if (!profile) return {};
  const candidates: [LockableField, string][] = [
    ["fullName", profile.name?.trim() ?? ""],
    ["mobile", (profile.phone ?? "").replace(/\D/g, "").slice(-10)],
    ["email", profile.email?.trim() ?? ""],
    ["dob", profile.dob?.trim() ?? ""],
    ["panNumber", (profile.pan ?? "").replace(/\s/g, "").toUpperCase()],
  ];
  return candidates.reduce<Partial<Record<LockableField, string>>>((acc, [key, value]) => {
    if (value) acc[key] = value;
    return acc;
  }, {});
};

/**
 * The signed-in customer record the backend itself validates against
 * (`verify-otp` / `GET /auth/customer/profile`).
 *
 * This is the authoritative source for a loan application's identity fields:
 * `POST /customer/loan-apply` rejects the submission when the email does not
 * match the account on file, so the form must send what the account holds —
 * not what was typed into the eligibility popup. The API returns `dob` as an
 * ISO timestamp, which is trimmed to the `YYYY-MM-DD` the date field wants.
 */
export const apiUserFieldDefaults = (
  user: { name?: string; mobile?: string; email?: string; dob?: string; panNumber?: string } | null,
): Partial<Record<LockableField, string>> => {
  if (!user) return {};
  const candidates: [LockableField, string][] = [
    ["fullName", user.name?.trim() ?? ""],
    ["mobile", (user.mobile ?? "").replace(/\D/g, "").slice(-10)],
    ["email", user.email?.trim() ?? ""],
    ["dob", (user.dob ?? "").trim().slice(0, 10)],
    ["panNumber", (user.panNumber ?? "").replace(/\s/g, "").toUpperCase()],
  ];
  return candidates.reduce<Partial<Record<LockableField, string>>>((acc, [key, value]) => {
    if (value) acc[key] = value;
    return acc;
  }, {});
};