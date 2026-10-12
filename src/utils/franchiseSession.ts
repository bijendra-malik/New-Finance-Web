// Franchise partner session storage. Credentials live under the same keys as a
// retail customer session, because the franchise portal now authenticates with the
// user bearer token (token) rather than a separate franchise token.
//
// The remaining helpers are a hyper-local convenience layer on top of localStorage:
// they keep the UI shape of a franchise session consistent for components that still
// render from `readFranchiseSession()`, but they never touch a separate FRANCHISE_*
// key and they never issue their own bearer token.

export const FRANCHISE_SESSION_KEY = "indexia_franchise_session";
// FRANCHISE_TOKEN_KEY is retired — the franchise portal no longer stores its own
// bearer token. Do not add new readers of it; the auth layer already uses "token".
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

/**
 * This helper is retired alongside the separate franchise token. The franchise
 * portal no longer stores its own bearer token, and the auth layer already uses
 * "token". Callers that only need to know whether a local franchise session shape
 * exists should use `readFranchiseSession()` instead.
 */
export const readFranchiseToken = (): string | null =>
  localStorage.getItem(FRANCHISE_TOKEN_KEY);

export const isFranchiseSignedIn = (): boolean =>
  Boolean(readFranchiseSession() && localStorage.getItem("token"));

/**
 * Store the franchise session shape locally.
 *
 * The `token` argument is kept for backward compatibility with existing call sites,
 * but it is intentionally unused: the franchise portal no longer stores a separate
 * franchise bearer token. The portal now authenticates with the shared user token
 * (localStorage key `token`), so this helper only persists the session metadata.
 */
/**
 * Store the franchise session shape locally.
 *
 * The token argument exists only for backward compatibility with existing call
 * sites. The franchise portal no longer stores a separate franchise bearer token,
 * so this helper only persists the session metadata under `FRANCHISE_SESSION_KEY`.
 */
export const saveFranchiseSession = (
  session: FranchiseSession,
  _token: string, // eslint-disable-line @typescript-eslint/no-unused-vars
): void => {
  localStorage.setItem(FRANCHISE_SESSION_KEY, JSON.stringify(session));
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
  // FRANCHISE_TOKEN_KEY is no longer the franchise bearer token, but keep the
  // removal here for backward compatibility with any leftover key on older devices.
  localStorage.removeItem(FRANCHISE_TOKEN_KEY);
};
