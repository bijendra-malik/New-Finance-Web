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

export const dropApplySession = (): void => {
  clearApplySessionPending();
};
