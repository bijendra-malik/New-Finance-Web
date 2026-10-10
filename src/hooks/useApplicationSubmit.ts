import { useCallback, useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "../utils/apiError";
import { emitApplicationSubmitted } from "../utils/applicationEvents";

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
  showFormAfterSubmit: boolean;
  setShowFormAfterSubmit: (show: boolean) => void;
  handleSubmit: (e: { preventDefault: () => void }) => Promise<void>;
}

export const useApplicationSubmit = <TApplication extends { _id: string }>({
  computeErrors, markAllTouched, agreed, submit, onSubmitSuccess,
}: UseApplicationSubmitArgs<TApplication>): UseApplicationSubmitResult<TApplication> => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<TApplication | null>(null);
  const [showFormAfterSubmit, setShowFormAfterSubmit] = useState(false);

  const computeRef = useRef(computeErrors);
  const markRef = useRef(markAllTouched);
  const submitRef = useRef(submit);
  const agreedRef = useRef(agreed);
  const successRef = useRef(onSubmitSuccess);

  // Keep the latest props in refs after each render — writing them during render
  // is not allowed by the react-hooks rules.
  useEffect(() => {
    computeRef.current = computeErrors;
    markRef.current = markAllTouched;
    submitRef.current = submit;
    agreedRef.current = agreed;
    successRef.current = onSubmitSuccess;
  });

  const handleSubmit = useCallback(async (e: { preventDefault: () => void }) => {
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
    setIsSubmitting(true); setApiError("");
    try {
      const app = await submitRef.current();
      setSubmittedApp(app); setSubmitted(true);
      successRef.current?.(app._id, app);
      // The header chip and /applications pick the new one up immediately.
      emitApplicationSubmitted();
    } catch (err) {
      setApiError(getApiErrorMessage(err, "Submission failed. Please try again."));
    } finally { setIsSubmitting(false); }
  }, []);

  return { isSubmitting, apiError, setApiError, submitAttempted, submitted, submittedApp, showFormAfterSubmit, setShowFormAfterSubmit, handleSubmit };
};
