import { useState } from "react";
import { submitCreditScore, type CreditScoreResponse } from "../../api/customer";
import { getApiErrorMessage } from "../../utils/apiError";
import {
  clearPendingCreditScoreDraft,
  emitApplicationSubmitted,
  rememberSubmittedApplication,
  readPendingCreditScoreDraft,
  remainingCreditScoreWindow,
} from "../../utils/applicationFlowState";
import { loanKeyFor } from "../../constants/loanSlugs";
import { clearApplySessionPending } from "../../utils/applySession";
import { useAuth } from "../../context/authContext";
import type { SuccessSection } from "../form/successSections";
import ApplicationConfirmation from "./ApplicationConfirmation";
import { buildApplicationSections } from "./applicationSections";
import { BAND_META, SCORE_MAX, SCORE_MIN, bandForScore, isValidScore } from "./creditScoreEvaluation";

type Result = { eligible: boolean; message: string; application: Record<string, unknown> | null };

interface CreditScoreGateProps {
  product?: string;
  sections?: SuccessSection[];
  dashboardPath?: string;
  onFinalized?: () => void;
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;

const eligibilityFrom = (response: CreditScoreResponse): boolean | null => {
  const candidates = [asRecord(response), asRecord(response.data), asRecord(response.application)];
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (typeof candidate.eligible === "boolean") return candidate.eligible;
    if (typeof candidate.isEligible === "boolean") return candidate.isEligible;
    const status = typeof candidate.status === "string" ? candidate.status.toLowerCase() : "";
    if (["eligible", "approved", "submitted"].includes(status)) return true;
    if (["ineligible", "not eligible", "rejected", "declined"].includes(status)) return false;
  }
  return null;
};

const applicationFrom = (response: CreditScoreResponse): Record<string, unknown> | null => {
  const direct = asRecord(response.application);
  if (direct) return direct;
  const data = asRecord(response.data);
  const nested = asRecord(data?.application);
  if (nested) return nested;
  if (data) return data;
  // Some responses place the finalized document alongside the verdict itself.
  const root = asRecord(response);
  return root && (typeof root.fullName === "string" || typeof root._id === "string") ? root : null;
};

/** Completes a saved draft; the backend owns the eligibility decision. */
const CreditScoreGate = ({ product, sections, dashboardPath, onFinalized }: CreditScoreGateProps) => {
  const { user } = useAuth();
  const productLabel = product?.trim() || "this loan";
  const [rawScore, setRawScore] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const typedScore = Number(rawScore);
  const typedIsValid = rawScore.trim() !== "" && isValidScore(typedScore);

  const submitScore = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rawScore.trim()) return setError("Enter the score shown on your credit report");
    if (!isValidScore(typedScore)) return setError(`Enter a whole-number score between ${SCORE_MIN} and ${SCORE_MAX}`);

    const pendingDraft = readPendingCreditScoreDraft(user?._id);
    const productKey = product ? loanKeyFor(product) : null;
    if (!pendingDraft || (productKey && pendingDraft.loanKey !== productKey)) {
      return setError("We could not find this application draft. Please start your application again.");
    }
    if (remainingCreditScoreWindow(pendingDraft.createdAt).expired) {
      clearPendingCreditScoreDraft();
      return setError("This application draft has expired. Please start your application again.");
    }

    setError("");
    setSubmitting(true);
    try {
      const response = await submitCreditScore(pendingDraft.draftId, typedScore);
      const eligible = eligibilityFrom(response);
      if (eligible == null) {
        setError(response.message?.trim() || "We could not confirm your eligibility. Please try again.");
        return;
      }
      setResult({
        eligible,
        application: applicationFrom(response),
        message: response.message?.trim() || (eligible
          ? "Your application has been submitted successfully."
          : "You are not eligible for this application at the moment."),
      });
      if (eligible) {
        rememberSubmittedApplication(pendingDraft.ownerId, pendingDraft.loanKey, new Date().toISOString());
        clearPendingCreditScoreDraft();
        clearApplySessionPending();
        emitApplicationSubmitted();
        onFinalized?.();
      }
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "We could not check your eligibility. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    if (result.eligible) {
      return (
        <ApplicationConfirmation
          productName={productLabel}
          application={result.application}
          sections={sections ?? buildApplicationSections(result.application, productLabel)}
          creditScore={typedScore}
          band={bandForScore(typedScore)}
          message={result.message}
          dashboardPath={dashboardPath}
        />
      );
    }

    return (
      <section aria-labelledby="eligibility-result-title" className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-red-700">Not eligible</p>
          <h2 id="eligibility-result-title" className="mt-1 text-2xl font-extrabold text-red-900">We can’t submit this application yet</h2>
          <p className="mt-2 text-sm leading-6 text-red-800">{result.message}</p>
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-600">You can improve your score and try again later. Your application has not been submitted.</p>
        <button type="button" onClick={() => setResult(null)} className="mt-5 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">Change credit score</button>
      </section>
    );
  }

  return (
    <section aria-labelledby="credit-score-gate-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 id="credit-score-gate-title" className="text-lg font-extrabold text-(--brand-navy)">One last step: your credit score</h2>
      <p className="mt-1 max-w-md text-[12.5px] leading-6 text-slate-500">Enter the score from your credit report and check your eligibility.</p>
      <form onSubmit={(event) => void submitScore(event)} noValidate className="mt-5">
        <label htmlFor="credit-score-input" className="block text-xs font-bold uppercase tracking-wide text-slate-500">Your credit score</label>
        <div className="mt-1.5 flex flex-col gap-3 sm:flex-row sm:items-start">
          <input id="credit-score-input" type="text" inputMode="numeric" autoComplete="off" maxLength={3} value={rawScore}
            onChange={(event) => { setRawScore(event.target.value.replace(/\D/g, "").slice(0, 3)); setError(""); }} placeholder="***"
            aria-invalid={error ? true : undefined} aria-describedby={error ? "credit-score-error" : "credit-score-hint"}
            className="w-full rounded-xl border px-4 py-3 text-center text-2xl font-extrabold tracking-widest text-(--brand-navy) sm:w-40"
            style={{ borderColor: error ? "#fca5a5" : "#cbd5e1", background: error ? "#fef2f2" : "#fff" }} />
          <div className="min-w-0 flex-1">
            {error ? <p id="credit-score-error" role="alert" className="text-xs font-semibold text-red-600">{error}</p> : <p id="credit-score-hint" className="text-[12px] leading-5 text-slate-500">Between {SCORE_MIN} and {SCORE_MAX}.</p>}
            {typedIsValid && <p className="mt-1.5 text-[12px] font-semibold" style={{ color: BAND_META[bandForScore(typedScore)].color }}>This is the {BAND_META[bandForScore(typedScore)].label} score.</p>}
          </div>
        </div>
        <button type="submit" disabled={submitting} className="mt-5 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-60" style={{ background: "linear-gradient(135deg, var(--brand-teal) 0%, var(--brand-navy) 100%)" }}>
          {submitting ? "Checking eligibility…" : "Check eligibility & submit"}
        </button>
      </form>
    </section>
  );
};

export default CreditScoreGate;
