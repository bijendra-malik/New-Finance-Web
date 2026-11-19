import { clearSubmittedApplications, clearPendingCreditScoreDraft } from "./applicationFlowState";
import { clearAllCredentials } from "./credentialStorage";
import { clearStoredFranchiseSession } from "./franchiseSession";
import { resetSessionCaches } from "./sessionReset";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "./authStorageKeys";

export { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "./authStorageKeys";

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
