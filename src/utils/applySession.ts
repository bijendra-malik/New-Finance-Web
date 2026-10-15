const PENDING_KEY = "applySessionPending";

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

/** Drops an unsubmitted apply session — token, cached profile and marker. */
export const dropApplySession = (): void => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem(PENDING_KEY);
  } catch {
    // Storage unavailable — the AuthProvider logout still clears React state.
  }
};
