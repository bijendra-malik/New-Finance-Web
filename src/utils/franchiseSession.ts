export interface FranchiseSession {
  franchiseId: string;
  name?: string;
  mobile?: string;
  email?: string;
  franchiseStatus?: string;
  isVerified?: boolean;
  continent?: string;
  country?: string;
}

const SESSION_KEY = "indexia_franchise_session";
const FRANCHISE_TOKEN_KEY = "indexia_franchise_token";

const readValue = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeValue = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore storage errors so a full browser does not break the sign-in flow
  }
};

const removeValue = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore storage errors so a full browser does not break the sign-in flow
  }
};

export const readFranchiseSession = (): FranchiseSession | null => {
  const raw = readValue(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as FranchiseSession;
    return parsed?.franchiseId ? parsed : null;
  } catch {
    return null;
  }
};

export const readFranchiseToken = (): string | null => readValue(FRANCHISE_TOKEN_KEY);

export const isFranchiseSignedIn = (): boolean =>
  Boolean(readFranchiseSession() && readValue("token"));

export const saveFranchiseSession = (session: FranchiseSession, token: string): void => {
  writeValue(SESSION_KEY, JSON.stringify(session));
  writeValue(FRANCHISE_TOKEN_KEY, token);
};

/**
 * Merge fresh profile details from the backend into the stored session and
 * write the result back, so the portal keeps showing the latest agreement
 * status after a refresh.
 */
export const mergeFranchiseProfile = (details: Partial<FranchiseSession>): FranchiseSession => {
  const merged = { ...readFranchiseSession(), ...details } as FranchiseSession;
  writeValue(SESSION_KEY, JSON.stringify(merged));
  return merged;
};

/** Sign out of the franchise portal: forget both the session and its token. */
export const clearStoredFranchiseSession = (): void => {
  removeValue(SESSION_KEY);
  removeValue(FRANCHISE_TOKEN_KEY);
};
