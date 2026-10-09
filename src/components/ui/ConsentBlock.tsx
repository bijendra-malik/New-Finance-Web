// ConsentBlock — terms-of-use checkbox, API error banner and the submit
// button. Extracted so loan submission forms and franchise forms share one
// consent/submit block instead of re-declaring it.

import { TERMS_OF_USE_URL, PRIVACY_POLICY_URL } from "../../constants/legalLinks";
import { THEME as C } from "../../constants/theme";
import { cx } from "../ui/cx";

interface ConsentBlockProps {
  agreed: boolean;
  onAgreedChange: (next: boolean) => void;
  apiError?: string;
  submitAttempted?: boolean;
  invalidCount?: number;
  isSubmitting?: boolean;
  submitted?: boolean;
  submitLabel?: string;
}

const spinner = (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export const ConsentBlock = ({
  agreed,
  onAgreedChange,
  apiError = "",
  submitAttempted = false,
  invalidCount = 0,
  isSubmitting = false,
  submitted = false,
  submitLabel,
}: ConsentBlockProps) => {
  const showError =
    !!apiError || (submitAttempted && invalidCount > 0);
  const errorMsg = apiError ?? `${invalidCount} field${invalidCount === 1 ? " is" : "s are"} invalid — fix the highlighted fields to submit.`;

  return (
    <>
      <label className="flex items-start gap-2.5 mb-5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => onAgreedChange(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded shrink-0"
          style={{ accentColor: C.teal }}
        />
        <span className="text-xs" style={{ color: C.gray }}>
          By continuing, you agree to Indexia Finance{" "}
          <a
            href={TERMS_OF_USE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
            style={{ color: C.navy }}
          >
            Terms of Use
          </a>{" "}
          and{" "}
          <a
            href={PRIVACY_POLICY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
            style={{ color: C.navy }}
          >
            Privacy Policy
          </a>
          .
        </span>
      </label>

      {showError && (
        <div
          className="rounded-(--form-field-radius) px-4 py-3 text-sm flex gap-2 items-start mb-5"
          style={{
            background: "var(--form-error-bg)",
            border: "1px solid var(--form-error-border)",
            color: "var(--form-error-text)",
          }}
        >
          <span className="shrink-0 mt-0.5">⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || submitted}
        className={cx(
          "w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-70 flex items-center justify-center gap-2 hover:shadow-lg hover:opacity-90",
          submitted ? "opacity-80" : ""
        )}
        style={{
          background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`,
        }}
      >
        {isSubmitting ? (
          <>{spinner}Submitting…</>
        ) : submitted ? (
          "✓ Application Already Submitted"
        ) : (
          submitLabel ?? "✓ Submit Application"
        )}
      </button>
    </>
  );
};

export default ConsentBlock;
