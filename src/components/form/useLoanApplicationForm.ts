import { useState } from "react";
import { useApplicationSubmit } from "../../hooks/useApplicationSubmit";
import { useTouchedErrors } from "../../hooks/useTouchedErrors";
import type { SubmittedApplication } from "./LoanApplicationFormShell";

interface LoanApplicationFormArgs<TApplication extends SubmittedApplication, TValues extends object> {
  form: TValues;
  setForm: React.Dispatch<React.SetStateAction<TValues>>;
  computeErrors: (draft: TValues) => Partial<Record<string, string>>;
  submit: () => Promise<TApplication>;
  onSubmit?: (id: string, app: TApplication) => void;
}

/**
 * The plumbing every product form repeats: agreed checkbox, touched-field
 * errors, review/submit state, and the props that state feeds to
 * `LoanApplicationFormShell`. Product-specific fields, validation and payload
 * stay in the form.
 */
export const useLoanApplicationForm = <TApplication extends SubmittedApplication, TValues extends object>({
  form,
  setForm,
  computeErrors,
  submit,
  onSubmit,
}: LoanApplicationFormArgs<TApplication, TValues>) => {
  const [agreed, setAgreed] = useState(false);

  const allErrors = computeErrors(form) as Partial<Record<Extract<keyof TValues, string>, string>>;
  const { errors, touch, markAllTouched, untouch } = useTouchedErrors<Extract<keyof TValues, string>>(allErrors);

  const {
    isSubmitting, apiError, submitAttempted, submitted, submittedApp,
    reviewOpen, handleSubmit, confirmReview, cancelReview,
  } = useApplicationSubmit<TApplication>({
    computeErrors: () => computeErrors(form),
    markAllTouched,
    agreed,
    submit,
    onSubmitSuccess: onSubmit,
  });

  const set = (field: Extract<keyof TValues, string>, value: TValues[keyof TValues]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    touch(field);
  };

  return {
    set,
    errors,
    allErrors,
    agreed,
    setAgreed,
    touch,
    untouch,
    markAllTouched,
    shellProps: {
      application: submittedApp,
      submitted,
      values: form,
      reviewOpen,
      onConfirmReview: () => void confirmReview(),
      onCancelReview: cancelReview,
      onSubmit: handleSubmit,
      agreed,
      onAgreedChange: setAgreed,
      apiError,
      submitAttempted,
      invalidCount: Object.keys(allErrors).length,
      isSubmitting,
    },
  };
};
