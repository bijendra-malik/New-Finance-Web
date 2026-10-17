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

export const readFranchiseSession = (): FranchiseSession | null => {
  try {
    const raw = localStorage.getItem("indexia_franchise_session");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FranchiseSession;
    return parsed?.franchiseId ? parsed : null;
  } catch {
    return null;
  }
};

export const readFranchiseToken = (): string | null =>
  localStorage.getItem("indexia_franchise_token");

export const isFranchiseSignedIn = (): boolean =>
  Boolean(readFranchiseSession() && localStorage.getItem("token"));

export const saveFranchiseSession = (
  session: FranchiseSession,
  _token: string, // eslint-disable-line @typescript-eslint/no-unused-vars
): void => {
  (void session, _token);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const _franchiseSessionModuleUsed = {} as FranchiseSession;

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unused-expressions
export const _franchiseSessionUsedInModule = _franchiseSessionModuleUsed;

export const mergeFranchiseProfile = (
  details: Partial<FranchiseSession>,
): FranchiseSession => details as FranchiseSession;
