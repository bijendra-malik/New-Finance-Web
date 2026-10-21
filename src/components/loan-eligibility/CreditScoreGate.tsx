import { useEffect, useState } from "react";
import { fetchCreditScore } from "../../api/customer";
import { getApiErrorMessage } from "../../utils/apiError";
import { loanKeyFor } from "../../constants/loanSlugs";
import { getDraftId } from "../../utils/applySession";
import CreditScoreGauge from "./CreditScoreGauge";
import {
  BAND_META,
  SCORE_MAX,
  SCORE_MIN,
  VERDICT_META,
  bandForScore,
  evaluateCreditScore,
  isValidScore,
  normalizeBand,
  type CreditScoreEvaluation,
} from "./creditScoreEvaluation";

type Phase = "entry" | "evaluating" | "verdict";

interface BureauNote {
  tone: "info" | "warn" | "error";
  message: string;
}

const NOTE_STYLE: Record<BureauNote["tone"], { background: string; borderColor: string; color: string }> = {
  info: { background: "var(--brand-teal-14)", borderColor: "var(--brand-teal-33)", color: "var(--brand-dark)" },
  warn: { background: "#fffbeb", borderColor: "#fde68a", color: "#92400e" },
  error: { background: "#fef2f2", borderColor: "#fecaca", color: "#991b1b" },
};

/**
 * The step that follows a submitted application: the customer enters the score
 * from their credit report, we evaluate it against the lender cut-offs, and the
 * verdict is shown with the band meter. The bureau endpoint is offered as a
 * shortcut to fill the field, never as the only way in.
 */
const CreditScoreGate = ({ product }: { product?: string }) => {
  const productLabel = product?.trim() || "this loan";
  const [phase, setPhase] = useState<Phase>("entry");
  const [rawScore, setRawScore] = useState("");
  const [error, setError] = useState("");
  const [pendingScore, setPendingScore] = useState<number | null>(null);
  const [evaluation, setEvaluation] = useState<CreditScoreEvaluation | null>(null);
  const [bureauNote, setBureauNote] = useState<BureauNote | null>(null);
  const [fetchingBureau, setFetchingBureau] = useState(false);

  // A short "evaluating" beat, so the verdict does not appear as if it was
  // already decided before the customer finished typing.
  useEffect(() => {
    if (phase !== "evaluating" || pendingScore == null) return;
    const timer = setTimeout(() => {
      setEvaluation(evaluateCreditScore(pendingScore, productLabel));
      setPhase("verdict");
    }, 1200);
    return () => clearTimeout(timer);
  }, [phase, pendingScore, productLabel]);

  const typedScore = Number(rawScore);
  const typedIsValid = rawScore.trim() !== "" && isValidScore(typedScore);

  const submitScore = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rawScore.trim()) {
      setError("Enter the score shown on your credit report");
      return;
    }
    if (!isValidScore(typedScore)) {
      setError(`Enter a score between ${SCORE_MIN} and ${SCORE_MAX}`);
      return;
    }
    setError("");
    setPendingScore(typedScore);
    setPhase("evaluating");
  };

  const fillFromBureau = async () => {
    setFetchingBureau(true);
    setBureauNote(null);
    try {
      // POST /customer/credit-score is sent with the draftId the register call
      // opened. The product arrives here as a display label, so an unrecognised
      // one falls back to the most recently registered draft — which belongs to
      // the flow that just submitted.
      const draftId =
        (product ? getDraftId(loanKeyFor(product)) : null) ?? getDraftId();
      const data = await fetchCreditScore(draftId);
      const band = normalizeBand(data.band);
      if (data.score != null && isValidScore(Math.round(data.score))) {
        const score = Math.round(data.score);
        setRawScore(String(score));
        setError("");
        setBureauNote({
          tone: "info",
          message:
            data.message?.trim() ||
            `We filled in ${score} from your bureau record — you can still change it before checking.`,
        });
      } else {
        setBureauNote({
          tone: "warn",
          message:
            data.message?.trim() ||
            (band
              ? `Your bureau reported the ${BAND_META[band].label} band (${BAND_META[band].range[0]}–${BAND_META[band].range[1]}) but no numeric score. Enter the number from your credit report.`
              : "Your bureau did not share a score. Enter the number from your credit report."),
        });
      }
    } catch (err) {
      const signedOut = (err as { response?: { status?: number } })?.response?.status === 401;
      setBureauNote({
        tone: signedOut ? "warn" : "error",
        message: signedOut
          ? "Your session ended before we could check the bureau. Enter your score manually, or verify your mobile again and retry."
          : getApiErrorMessage(err, "We could not reach the credit bureau. Enter your score manually."),
      });
    } finally {
      setFetchingBureau(false);
    }
  };

  if (phase === "evaluating") {
    return (
      <section
        aria-busy="true"
        aria-live="polite"
        className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-(--brand-teal-14)">
          <span
            className="h-6 w-6 animate-spin rounded-full border-2 border-(--brand-teal-33) border-t-(--brand-teal)"
            aria-hidden="true"
          />
        </div>
        <h2 className="mt-4 text-lg font-extrabold text-(--brand-navy)">Evaluating your application…</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Checking a score of {pendingScore} against the cut-offs our lenders use for {productLabel}.
        </p>
        <div className="mx-auto mt-5 h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-(--brand-teal)" />
        </div>
      </section>
    );
  }

  if (phase === "verdict" && evaluation) {
    const verdict = VERDICT_META[evaluation.verdict];
    const band = BAND_META[evaluation.band];
    return (
      <section aria-labelledby="credit-verdict-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div
          role="status"
          className="rounded-xl border p-5"
          style={{ background: verdict.bg, borderColor: verdict.border }}
        >
          <div className="flex items-start gap-4">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-black text-white"
              style={{ background: verdict.color }}
              aria-hidden="true"
            >
              {verdict.icon}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: verdict.color }}>
                {verdict.label}
              </p>
              <h2 id="credit-verdict-title" className="mt-1 text-xl font-extrabold" style={{ color: verdict.color }}>
                {evaluation.headline}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{evaluation.detail}</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Your score</p>
            <p className="text-xs font-semibold" style={{ color: band.color }}>
              {band.label} band
            </p>
          </div>
          <p className="mt-1 flex items-end gap-2">
            <span className="text-4xl font-extrabold leading-none" style={{ color: band.color }}>
              {evaluation.score}
            </span>
            <span className="pb-0.5 text-xs font-semibold text-slate-400">/ {SCORE_MAX}</span>
          </p>
          <CreditScoreGauge score={evaluation.score} band={evaluation.band} />
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">What happens next</p>
          <ul className="mt-2 space-y-2">
            {evaluation.steps.map((step) => (
              <li key={step} className="flex gap-2 text-[12.5px] leading-6 text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: verdict.color }} aria-hidden="true" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-4 text-[11px] leading-5 text-slate-400">
          This check uses the score you entered and is indicative only. Final approval, amount and rate are decided by the
          lender after verification.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setPhase("entry");
              setEvaluation(null);
              setPendingScore(null);
            }}
            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
          >
            Change my score
          </button>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="credit-score-gate-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-4">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-navy))" }}
          aria-hidden="true"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13a9 9 0 0118 0M12 13l4-3" />
          </svg>
        </span>
        <div>
          <h2 id="credit-score-gate-title" className="text-lg font-extrabold text-(--brand-navy)">
            One last step: your credit score
          </h2>
          <p className="mt-1 max-w-md text-[12.5px] leading-6 text-slate-500">
            Enter the score from your credit report so we can tell you whether {productLabel} is within reach — and what to
            do next if it is not.
          </p>
        </div>
      </div>

      <form onSubmit={submitScore} noValidate className="mt-5">
        <label htmlFor="credit-score-input" className="block text-xs font-bold uppercase tracking-wide text-slate-500">
          Your credit score
        </label>
        <div className="mt-1.5 flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="sm:w-40">
            <input
              id="credit-score-input"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={3}
              value={rawScore}
              onChange={(event) => {
                setRawScore(event.target.value.replace(/\D/g, "").slice(0, 3));
                setError("");
              }}
              placeholder="750"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "credit-score-error" : "credit-score-hint"}
              className="w-full rounded-xl border px-4 py-3 text-center text-2xl font-extrabold tracking-widest text-(--brand-navy) transition focus:outline-none focus:ring-2 focus:ring-(--brand-teal-44)"
              style={{ borderColor: error ? "#fca5a5" : "#cbd5e1", background: error ? "#fef2f2" : "#fff" }}
            />
          </div>
          <div className="min-w-0 flex-1">
            {error ? (
              <p id="credit-score-error" role="alert" className="text-xs font-semibold text-red-600">
                {error}
              </p>
            ) : (
              <p id="credit-score-hint" className="text-[12px] leading-5 text-slate-500">
                Between {SCORE_MIN} and {SCORE_MAX}. Check your score for free with any bureau — it does not drop when you
                check it yourself.
              </p>
            )}
            {typedIsValid && (
              <p className="mt-1.5 text-[12px] font-semibold" style={{ color: BAND_META[bandForScore(typedScore)].color }}>
                That is the {BAND_META[bandForScore(typedScore)].label} band ({BAND_META[bandForScore(typedScore)].range[0]}–
                {BAND_META[bandForScore(typedScore)].range[1]}).
              </p>
            )}
          </div>
        </div>

        {bureauNote && (
          <p
            className="mt-4 rounded-xl border px-4 py-3 text-[12.5px] font-semibold leading-6"
            style={NOTE_STYLE[bureauNote.tone]}
          >
            {bureauNote.message}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-44)"
            style={{ background: "linear-gradient(135deg, var(--brand-teal) 0%, var(--brand-navy) 100%)" }}
          >
            Check my eligibility
          </button>
          <button
            type="button"
            onClick={() => void fillFromBureau()}
            disabled={fetchingBureau}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-xs font-bold text-(--brand-navy) transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33) disabled:cursor-not-allowed disabled:opacity-60"
          >
            {fetchingBureau && (
              <span
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-(--brand-teal-33) border-t-(--brand-teal)"
                aria-hidden="true"
              />
            )}
            {fetchingBureau ? "Checking bureau…" : "Use my bureau score"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreditScoreGate;
