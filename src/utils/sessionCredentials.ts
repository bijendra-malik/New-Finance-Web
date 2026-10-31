import { clearSubmittedApplications, clearPendingCreditScoreDraft } from "./applicationFlowState";
import { clearAllCredentials } from "./credentialStorage";
import { clearStoredFranchiseSession } from "./franchiseSession";
import { resetSessionCaches } from "./sessionReset";

export const AUTH_TOKEN_KEY = "token";
export const AUTH_USER_KEY = "user";

const removeKey = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore storage errors so a locked-down browser does not break sign-out
  }
};

export const purgeSessionCredentials = (): void => {
  removeKey(AUTH_TOKEN_KEY);
  removeKey(AUTH_USER_KEY);
  clearStoredFranchiseSession();
  clearPendingCreditScoreDraft();
  clearSubmittedApplications();
  clearAllCredentials();
  resetSessionCaches();
};
