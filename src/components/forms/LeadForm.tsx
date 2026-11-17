import { useState } from "react";
import { type LeadFieldConfig, validateTel, validateEmail } from "../ui/LeadFormConfig";
import { advanceOnEnter } from "../../utils/enterToNext";

/**
 * Shared lead/enquiry form used by Franchise Login, Be An Associate and Contact pages.
 * With `onSubmit` the values are sent to the backend; without it the form only
 * validates and shows its success state.
 */

interface LeadFormProps {
  fields: LeadFieldConfig[];
  submitLabel: string;
  successTitle: string;
  successMessage: string;
  /** Return a string to replace the success message with the API's own text. */
  onSubmit?: (values: Record<string, string>) => Promise<string | void>;
  /** Text shown if the submission is refused. */
  submitErrorMessage?: string;
}

const inputBase =
  "w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)] transition";

const LeadForm = ({
  fields, submitLabel, successTitle, successMessage, onSubmit, submitErrorMessage,
}: LeadFormProps) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // The API's own confirmation, shown instead of the static copy when it sends one.
  const [resultMessage, setResultMessage] = useState("");

  const setField = (name: string, v: string) => {
    setValues((p) => ({ ...p, [name]: v }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    for (const f of fields) {
      if (f.required && !values[f.name]?.trim()) {
        e[f.name] = `${f.label} is required`;
        continue;
      }
      if (f.type === "tel" && values[f.name]) {
        const tel = validateTel(values[f.name]);
        if (tel) e[f.name] = tel;
        continue;
      }
      if (f.type === "email" && values[f.name]) {
        const email = validateEmail(values[f.name]);
        if (email) e[f.name] = email;
        continue;
      }
      if (f.minLength && (values[f.name]?.trim().length ?? 0) > 0 && (values[f.name]?.trim().length ?? 0) < f.minLength) {
        e[f.name] = `${f.label} must be at least ${f.minLength} characters`;
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    ev.preventDefault();
    if (!validate()) return;
    if (!onSubmit) {
      setSubmitted(true);
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const message = await onSubmit(values);
      if (typeof message === "string" && message.trim()) setResultMessage(message.trim());
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : submitErrorMessage || "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-(--brand-teal)">
          <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-800">{successTitle}</h3>
        <p className="mx-auto text-sm leading-relaxed text-gray-500">
          {resultMessage || successMessage}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={advanceOnEnter} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.half === false ? "md:col-span-2" : ""}>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              {f.label} {f.required && <span className="text-red-500">*</span>}
            </label>

            {f.type === "textarea" ? (
              <textarea
                rows={4}
                value={values[f.name] ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
                placeholder={f.placeholder}
                className={`${inputBase} resize-y ${errors[f.name] ? "border-red-400" : "border-slate-300"}`}
              />
            ) : f.type === "select" ? (
              <select
                value={values[f.name] ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
                className={`${inputBase} ${errors[f.name] ? "border-red-400" : "border-slate-300"}`}
              >
                <option value="">{f.placeholder ?? "Select an option"}</option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                type={f.type ?? "text"}
                value={values[f.name] ?? ""}
                onChange={(e) =>
                  setField(f.name, f.type === "tel" ? e.target.value.replace(/\D/g, "") : e.target.value)
                }
                placeholder={f.placeholder}
                maxLength={f.type === "tel" ? 10 : undefined}
                className={`${inputBase} ${errors[f.name] ? "border-red-400" : "border-slate-300"}`}
              />
            )}

            {errors[f.name] && <p className="mt-1 text-xs text-red-500">{errors[f.name]}</p>}
          </div>
        ))}
      </div>

      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          <span aria-hidden="true" className="shrink-0">⚠️</span>
          <span>{submitError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg py-3 text-sm font-bold text-white transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-teal) 100%)" }}
      >
        {submitting ? "Sending…" : submitLabel}
      </button>
    </form>
  );
};

export default LeadForm;
