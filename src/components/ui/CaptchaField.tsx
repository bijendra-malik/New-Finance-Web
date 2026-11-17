import type { CaptchaState } from "../../hooks/useCaptcha";
import CaptchaQuestion from "./CaptchaQuestion";

interface CaptchaFieldProps {
  captcha: CaptchaState;
  idPrefix?: string;
  className?: string;
}

const CaptchaField = ({ captcha, idPrefix = "captcha", className = "" }: CaptchaFieldProps) => {
  const { challenge, answer, setAnswer, error, loading, verifying, refresh } = captcha;
  const inputId = `${idPrefix}-answer`;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wide text-slate-700">
          Security Check <span className="ml-0.5 text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={refresh}
          disabled={verifying}
          className="cursor-pointer text-[11px] font-bold text-(--brand-navy) underline underline-offset-2 transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Loading…" : "New question"}
        </button>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="grid h-11 min-w-24 shrink-0 place-items-center overflow-hidden rounded-lg border border-slate-300 bg-slate-50 px-3">
          {loading ? (
            <span className="text-[11px] font-semibold text-slate-400">Loading…</span>
          ) : challenge?.question ? (
            <CaptchaQuestion question={challenge.question} className="tracking-wider" />
          ) : (
            <button
              type="button"
              onClick={refresh}
              className="cursor-pointer text-[11px] font-bold text-red-600 underline underline-offset-2"
            >
              Reload
            </button>
          )}
        </div>

        <input
          id={inputId}
          name="captchaAnswer"
          type="text"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Enter the answer"
          autoComplete="off"
          spellCheck={false}
          inputMode="numeric"
          disabled={verifying || loading}
          aria-invalid={error ? true : undefined}
          className={`min-w-0 flex-1 rounded-lg border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100 ${
            error ? "border-red-400" : "border-slate-300"
          }`}
        />
      </div>

      <p className="mt-1 text-[11px] text-slate-500">Type the answer to the question shown.</p>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default CaptchaField;
