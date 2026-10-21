// An "apply session" is the token a signed-out visitor gets while they file one
// application. It is disposable: leaving the dashboard without submitting must
// drop it, so a half-finished session never keeps holding a token.
//
// The pending flag lives in sessionStorage (per tab, cleared on tab close)
// because it only describes the current apply flow.
const APPLY_SESSION_PENDING_KEY = "indexia_apply_session_pending";

export const markApplySessionPending = (): void => {
  try {
    sessionStorage.setItem(APPLY_SESSION_PENDING_KEY, "1");
  } catch {
    // ignore storage errors so a full browser does not break the apply flow
  }
};

export const isApplySessionPending = (): boolean => {
  try {
    return sessionStorage.getItem(APPLY_SESSION_PENDING_KEY) === "1";
  } catch {
    return false;
  }
};

export const clearApplySessionPending = (): void => {
  try {
    sessionStorage.removeItem(APPLY_SESSION_PENDING_KEY);
  } catch {
    // ignore storage errors so a full browser does not break the apply flow
  }
};

/**
 * Drop the disposable apply session. The caller signs out separately, which is
 * what removes the token and user record.
 */
export const dropApplySession = (): void => {
  clearApplySessionPending();
};
