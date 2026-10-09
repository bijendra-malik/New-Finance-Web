// Manages idle → submitting → success → submitted lifecycle shared by loan and franchise forms.

import { useState, useCallback } from "react";

type SubmissionPhase = "idle" | "submitting" | "success" | "submitted" | "error";

interface UseSubmissionStateReturn {
  phase: SubmissionPhase;
  isSubmitting: boolean;
  submitted: boolean;
  successMessage: string | null;
  apiError: string | null;
  /** Begins a submission — sets submitting, clears prior messages. */
  start: () => void;
  /** Call on successful POST — records the success message and moves to success. */
  succeed: (message?: string) => void;
  /** Call on failed POST or validation gate — records the error message. */
  fail: (message: string) => void;
  /** Moves form into terminal "submitted" phase after the receipt view is shown. */
  markDone: () => void;
  /** Resets everything back to idle — used by "submit another" flows. */
  reset: () => void;
}

export const useSubmissionState = (
  initialSuccessMessage?: string,
): UseSubmissionStateReturn => {
  const [phase, setPhase] = useState<SubmissionPhase>("idle");
  const [successMessage, setSuccessMessage] = useState<string | null>(
    initialSuccessMessage ?? null,
  );
  const [apiError, setApiError] = useState<string | null>(null);

  const isSubmitting = phase === "submitting";
  const submitted = phase === "success" || phase === "submitted";

  const start = useCallback(() => {
    setPhase("submitting");
    setSuccessMessage(null);
    setApiError(null);
  }, []);

  const succeed = useCallback(
    (message?: string) => {
      setPhase("success");
      setSuccessMessage(message ?? null);
      setApiError(null);
    },
    [],
  );

  const fail = useCallback((message: string) => {
    setPhase("error");
    setApiError(message);
    setSuccessMessage(null);
  }, []);

  const markDone = useCallback(() => {
    if (phase !== "success") return;
    setPhase("submitted");
    setSuccessMessage(null);
  }, [phase]);

  const reset = useCallback(() => {
    setPhase("idle");
    setSuccessMessage(null);
    setApiError(null);
  }, []);

  return {
    phase,
    isSubmitting,
    submitted,
    successMessage,
    apiError,
    start,
    succeed,
    fail,
    markDone,
    reset,
  };
};

export default useSubmissionState;
