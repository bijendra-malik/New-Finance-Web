import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { CaptchaState } from "../../hooks/useCaptcha";
import CaptchaQuestion from "./CaptchaQuestion";
import { cx } from "./cx";

interface CaptchaFieldProps {
  captcha: CaptchaState;
  idPrefix?: string;
  className?: string;
}

const ShieldMark = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M12 3l7 3v5.5c0 4.5-3 7.9-7 9.5-4-1.6-7-5-7-9.5V6l7-3z" />
    <path d="M9.2 12.2l2 2 3.6-3.9" />
  </svg>
);

const ReloadIcon = ({ spinning }: { spinning: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cx("h-3.5 w-3.5", spinning && "animate-spin")}
    aria-hidden="true"
  >
    <path d="M20 11a8 8 0 1 0-2.3 6.3" />
    <path d="M20 4v7h-7" />
  </svg>
);

const Spinner = ({ light = false }: { light?: boolean }) => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke={light ? "#ffffff" : "var(--brand-teal)"}
      strokeWidth="2.5"
      opacity="0.3"
    />
    <path
      d="M21 12a9 9 0 0 0-9-9"
      stroke={light ? "#ffffff" : "var(--brand-teal)"}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const CaptchaField = ({ captcha, idPrefix = "captcha", className = "" }: CaptchaFieldProps) => {
  const { challenge, answer, setAnswer, error, verified, loading, verifying, refresh, clearError } =
    captcha;
  const [open, setOpen] = useState(false);
  const inputId = `${idPrefix}-answer`;
  const helpId = `${idPrefix}-help`;
  const titleId = `${idPrefix}-question-title`;

  const close = () => {
    setOpen(false);
    clearError();
  };

  const tick = () => {
    if (verified) return;
    clearError();
    setOpen(true);
  };

  const freshQuestion = () => refresh();

  const submitAnswer = async () => {
    if (verifying) return;
    const problem = await captcha.verify();
    if (problem) return;
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopImmediatePropagation();
      event.preventDefault();
      setOpen(false);
      clearError();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, clearError]);

  return (
    <div className={cx("w-full max-w-[320px]", className)}>
      {/* The tick box itself */}
      <div className="flex items-center justify-between gap-3 rounded-[3px] border border-[#d3d3d3] bg-[#f9f9f9] py-3 pl-3.5 pr-3 shadow-[0_0_4px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          role="checkbox"
          aria-checked={verified}
          onClick={tick}
          className="flex min-w-0 cursor-pointer items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
        >
          <span className="relative flex h-6.5 w-6.5 shrink-0 items-center justify-center">
            <span
              className={cx(
                "h-6.5 w-6.5 rounded-xs border-2 bg-white transition",
                verified ? "border-(--brand-teal)" : "border-[#c1c1c1]",
              )}
            />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cx(
                "pointer-events-none absolute h-4 w-4 text-(--brand-teal) transition",
                verified ? "scale-100 opacity-100" : "scale-50 opacity-0",
              )}
              aria-hidden="true"
            >
              <path d="M5 12.5l4.5 4.5L19 7" />
            </svg>
            {verifying && (
              <span className="absolute inset-0 flex items-center justify-center rounded-xs bg-white">
                <Spinner />
              </span>
            )}
          </span>
          <span className="truncate text-[14px] leading-5 text-slate-800">
            {verified ? "Verified" : "I'm not a robot"}
          </span>
        </button>

        <div className="flex shrink-0 flex-col items-center gap-0.5 text-[#9aa0a6]" aria-hidden="true">
          <ShieldMark />
          <span className="text-[7.5px] leading-none tracking-tight">Privacy · Terms</span>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-1.5 text-[11px] font-semibold text-[#d93025]">
          {error}
        </p>
      )}

      {/* The question, in its own dialog once the box is ticked */}
      {open &&
        createPortal(
          <>
            <div
              className="fixed inset-0 bg-black/55 backdrop-blur-sm"
              style={{ zIndex: 200 }}
              onClick={close}
            />
            <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 201 }}>
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
              >
                <div className="border-b border-[#e0e0e0] bg-[#f9f9f9] px-5 py-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Security Check
                  </p>
                  <h2 id={titleId} className="mt-0.5 text-[17px] font-extrabold text-slate-900">
                    Are you a robot?
                  </h2>
                  <p className="mt-0.5 text-[12px] leading-5 text-slate-500">
                    Answer the question below to prove you are human.
                  </p>
                </div>

                <div className="px-5 py-4">
                  <div
                    className={cx(
                      "flex h-14 items-center justify-center rounded-[3px] border bg-[#f9f9f9] px-3",
                      error ? "border-[#e0a0a0]" : "border-[#e0e0e0]",
                    )}
                  >
                    {loading ? (
                      <span className="h-3.5 w-24 animate-pulse rounded-full bg-slate-200" aria-hidden="true" />
                    ) : challenge?.question ? (
                      <CaptchaQuestion question={challenge.question} className="text-[17px] tracking-[0.2em]" />
                    ) : (
                      <button
                        type="button"
                        onClick={freshQuestion}
                        className="cursor-pointer text-[11.5px] font-semibold text-red-600 underline underline-offset-2"
                      >
                        Reload question
                      </button>
                    )}
                  </div>

                  <label htmlFor={inputId} className="mt-3 block text-[11px] font-semibold text-slate-500">
                    Your answer
                  </label>
                  <input
                    id={inputId}
                    name="captchaAnswer"
                    type="text"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    onKeyDown={(event) => { if (event.key === "Enter") void submitAnswer(); }}
                    placeholder="Type the answer"
                    autoComplete="off"
                    spellCheck={false}
                    inputMode="numeric"
                    autoFocus
                    disabled={verifying || loading}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? helpId : undefined}
                    className={cx(
                      "mt-1.5 h-11 w-full rounded-[3px] border bg-white px-3 text-center font-mono text-[15px] font-bold tracking-[0.3em] text-slate-800 transition focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100",
                      error
                        ? "border-[#d93025] focus:border-[#d93025]"
                        : "border-[#d3d3d3] focus:border-(--brand-teal)",
                    )}
                  />

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p
                      id={helpId}
                      role={error ? "alert" : undefined}
                      className={cx(
                        "text-[11px]",
                        error ? "font-semibold text-[#d93025]" : "text-slate-400",
                      )}
                    >
                      {error || (verifying ? "Checking…" : "Type the answer shown above.")}
                    </p>
                    <button
                      type="button"
                      onClick={freshQuestion}
                      disabled={verifying || loading}
                      aria-label="Try again with a new question"
                      className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-[11px] font-semibold text-slate-400 transition hover:text-(--brand-navy) disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ReloadIcon spinning={loading} />
                      Try again
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-[#e0e0e0] px-5 py-3">
                  <button
                    type="button"
                    onClick={close}
                    disabled={verifying}
                    className="cursor-pointer rounded-md border border-slate-300 bg-white px-3.5 py-2 text-[12px] font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void submitAnswer()}
                    disabled={verifying || loading}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-[12px] font-bold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ background: "var(--brand-navy)" }}
                  >
                    {verifying && <Spinner light />}
                    {verifying ? "Checking…" : "Verify"}
                  </button>
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
};

export default CaptchaField;
