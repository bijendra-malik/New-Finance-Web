import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getApiErrorMessage } from "../utils/apiError";

interface ResumedApplicationState {
  resumeApplication?: Record<string, unknown>;
}

interface UseApplicationSubmitArgs<TApplication> {
  computeErrors: () => object;
  markAllTouched: (keys: string[]) => void;
  agreed: boolean;
  submit: () => Promise<TApplication>;
  onSubmitSuccess?: (id: string, app: TApplication) => void;
}

interface UseApplicationSubmitResult<TApplication> {
  isSubmitting: boolean;
  apiError: string;
  setApiError: (message: string) => void;
  submitAttempted: boolean;
  submitted: boolean;
  submittedApp: TApplication | null;
  /** True while the final review panel is open, before anything is sent. */
  reviewOpen: boolean;
  handleSubmit: (e: { preventDefault: () => void }) => void;
  confirmReview: () => Promise<void>;
  cancelReview: () => void;
}

export const useApplicationSubmit = <TApplication extends { _id?: string }>({
  computeErrors, markAllTouched, agreed, submit, onSubmitSuccess,
}: UseApplicationSubmitArgs<TApplication>): UseApplicationSubmitResult<TApplication> => {
  const { state } = useLocation();
  const resumedApplication = (state as ResumedApplicationState | null)?.resumeApplication;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(Boolean(resumedApplication));
  const [submittedApp, setSubmittedApp] = useState<TApplication | null>(
    resumedApplication ? resumedApplication as TApplication : null,
  );
  const [reviewOpen, setReviewOpen] = useState(false);

  const computeRef = useRef(computeErrors);
  const markRef = useRef(markAllTouched);
  const submitRef = useRef(submit);
  const agreedRef = useRef(agreed);
  const successRef = useRef(onSubmitSuccess);
  // Guards against a double click racing two submissions before React re-renders.
  const submittingRef = useRef(false);

  // Keep the latest props in refs after each render — writing them during render
  // is not allowed by the react-hooks rules.
  useEffect(() => {
    computeRef.current = computeErrors;
    markRef.current = markAllTouched;
    submitRef.current = submit;
    agreedRef.current = agreed;
    successRef.current = onSubmitSuccess;
  });

  /** The form's submit button only validates; the final review panel follows. */
  const handleSubmit = useCallback((e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!agreedRef.current) { setApiError("Please accept the Terms of Use and Privacy Policy to continue."); return; }
    const errs = computeRef.current() as Record<string, string>;
    if (Object.keys(errs).length > 0) {
      markRef.current(Object.keys(errs));
      setSubmitAttempted(true); setApiError("");
      document.getElementById(Object.keys(errs)[0])?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitAttempted(false);
    setApiError("");
    setReviewOpen(true);
  }, []);

  /** Files the application, only after the applicant confirms the review. */
  const confirmReview = useCallback(async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true); setApiError("");
    try {
      const app = await submitRef.current();
      const savedDraft = (app ?? {}) as TApplication;
      setSubmittedApp(savedDraft); setSubmitted(true); setReviewOpen(false);
      successRef.current?.(savedDraft._id ?? "", savedDraft);
    } catch (err) {
      setApiError(getApiErrorMessage(err, "Submission failed. Please try again."));
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }, []);

  const cancelReview = useCallback(() => {
    if (submittingRef.current) return;
    setApiError("");
    setReviewOpen(false);
  }, []);

  return {
    isSubmitting, apiError, setApiError, submitAttempted, submitted, submittedApp,
    reviewOpen, handleSubmit, confirmReview, cancelReview,
  };
};
