import { useState } from "react";
import { Link } from "react-router-dom";
import { submitCreditScore, type CreditScoreResponse } from "../../api/customer";
import { submitFranchiseCreditScore } from "../../api/franchiseCustomers";
import { readFranchiseFiling } from "../../api/franchiseFiling";
import { getApiErrorMessage } from "../../utils/apiError";
import { asRecord } from "../../utils/objects";
import {
  clearPendingCreditScoreDraft,
  formatReapplyDate,
  franchiseDraftOwner,
  rememberSubmittedApplication,
  readPendingCreditScoreDraft,
  remainingCreditScoreWindow,
} from "../../utils/applicationFlowState";
import { clearApplySessionPending } from "../../utils/applySession";
import { useAuth } from "../../context/authContext";
import { THEME as C } from "../../constants/theme";
import { BAND_META, SCORE_MAX, SCORE_MIN, bandForScore, isValidScore } from "./creditScoreEvaluation";

type Result = { eligible: boolean };

interface CreditScoreGateProps {
  product?: string;
  dashboardPath?: string;
  onFinalized?: () => void;
  onDiscard?: () => void;
}

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

const ANALYZING_MS = 5000;
const pause = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const spinner = (
  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const CreditScoreGate = ({ product, dashboardPath, onFinalized, onDiscard }: CreditScoreGateProps) => {
  const { user } = useAuth();
  const productLabel = product?.trim() || "this loan";
  const [rawScore, setRawScore] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [reapplyFrom, setReapplyFrom] = useState("");
  const typedScore = Number(rawScore);
  const typedIsValid = rawScore.trim() !== "" && isValidScore(typedScore);

  const franchiseFiling = readFranchiseFiling();
  const franchisePending = franchiseFiling
    ? readPendingCreditScoreDraft(franchiseDraftOwner(franchiseFiling.customerId))
    : null;
  const franchiseMode = Boolean(franchiseFiling && franchisePending);
  const pendingDraft = franchisePending ?? readPendingCreditScoreDraft(user?._id);
  const draftingWindow = pendingDraft ? remainingCreditScoreWindow(pendingDraft.createdAt) : null;

  const submitScore = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rawScore.trim()) return setError("Enter the score shown on your credit report");
    if (!isValidScore(typedScore)) return setError(`Enter a whole-number score between ${SCORE_MIN} and ${SCORE_MAX}`);
    if (!pendingDraft) return setError("We could not find this application. Please start your application again.");
    if (draftingWindow?.expired) return setError("This application draft has expired. Please start your application again.");

    setError("");
    setSubmitting(true);
    const startedAt = Date.now();
    try {
      const response = franchiseMode && franchiseFiling
        ? await submitFranchiseCreditScore(franchiseFiling.customerId, pendingDraft.draftId, typedScore)
        : await submitCreditScore(pendingDraft.draftId, typedScore);
      const remaining = ANALYZING_MS - (Date.now() - startedAt);
      if (remaining > 0) await pause(remaining);

      const eligible = eligibilityFrom(response);
      if (eligible == null) {
        setError(response.message?.trim() || "We could not confirm your eligibility. Please try again.");
        return;
      }
      const decidedAt = new Date().toISOString();
      rememberSubmittedApplication(
        pendingDraft.ownerId,
        pendingDraft.loanKey,
        decidedAt,
        eligible ? "eligible" : "rejected",
      );
      if (!eligible) setReapplyFrom(formatReapplyDate(decidedAt));
      clearPendingCreditScoreDraft();
      clearApplySessionPending();
      setResult({ eligible });
      onFinalized?.();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "We could not check your eligibility. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    if (result.eligible) {
      return (
        <section aria-labelledby="eligibility-result-title" className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
          <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${C.teal}, ${C.navy})` }} />
          <div className="p-5 sm:p-7">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white" aria-hidden="true">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">After analyzing your details</p>
                  <h2 id="eligibility-result-title" className="mt-1 text-xl font-extrabold text-emerald-950 sm:text-2xl">
                    Your application is eligible for this loan
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-emerald-900">
                    We are pleased to inform you that your application is eligible for this loan.
                    We have forwarded it to the banks and NBFCs with which you are most compatible
                    and which offer you the highest chances of disbursement.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">What happens next</p>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">
                These lenders will review your application and contact you on your registered
                mobile number or email with the next steps. Please keep your KYC and income
                documents ready for verification.
              </p>
            </div>

            {!franchiseMode && (
              <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/applications"
                className="rounded-xl px-5 py-2.5 text-[12.5px] font-bold text-white shadow-sm transition hover:brightness-110"
                style={{ background: `linear-gradient(135deg, ${C.teal} 0%, ${C.navy} 100%)` }}
              >
                Track my application
              </Link>
              {dashboardPath && (
                <Link
                  to={dashboardPath}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[12.5px] font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Back to dashboard
                </Link>
              )}
            </div>
            )}
            {franchiseMode && (
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  to="/franchisor-dashboard?section=loans"
                  className="rounded-xl px-5 py-2.5 text-[12.5px] font-bold text-white shadow-sm transition hover:brightness-110"
                  style={{ background: `linear-gradient(135deg, ${C.teal} 0%, ${C.navy} 100%)` }}
                >
                  Track my application
                </Link>
                <p className="w-full text-[12.5px] leading-6 text-slate-600">
                  The application has been submitted through your franchise. Track it from the
                  All Loans panel of your franchise dashboard once the lenders respond.
                </p>
              </div>
            )}
          </div>
        </section>
      );
    }

    return (
      <section aria-labelledby="eligibility-result-title" className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
        <div className="p-5 sm:p-7">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white" aria-hidden="true">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-red-700">After analyzing your details</p>
                <h2 id="eligibility-result-title" className="mt-1 text-xl font-extrabold text-red-950 sm:text-2xl">
                  Your application is not eligible at this time
                </h2>
                <p className="mt-2 text-sm leading-6 text-red-900">
                  We regret to inform you that your application is not eligible for a loan at this
                  moment. This decision follows an assessment of your details and your credit score.
                  {reapplyFrom
                    ? ` A fresh application can be submitted after a 30-day cooling-off period — from ${reapplyFrom}.`
                    : " A fresh application can be submitted after a 30-day cooling-off period."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Before you apply again</p>
            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              Clearing existing dues and keeping your repayments on time can strengthen a future
              application. You can also explore a different loan product that better matches your
              current profile.
            </p>
          </div>

          {dashboardPath && (
            <div className="mt-5">
              <Link
                to={dashboardPath}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[12.5px] font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Back to dashboard
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (submitting) {
    return (
      <section aria-labelledby="credit-score-analyzing-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div role="status" aria-live="polite" className="flex flex-col items-center py-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: C.teal14, color: C.teal }}>
            {spinner}
          </span>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-wider" style={{ color: C.teal }}>
            Analyzing your details
          </p>
          <h2 id="credit-score-analyzing-title" className="mt-1 text-xl font-extrabold" style={{ color: C.dark }}>
            Checking your loan eligibility...
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-6" style={{ color: C.gray }}>
            We are matching your application and credit score against the banks and NBFCs that
            best fit your profile. This will only take a moment.
          </p>
          <p className="mt-3 rounded-full px-3 py-1 text-[11.5px] font-bold" style={{ background: C.navy14, color: C.navy }}>
            Please do not close this window
          </p>
        </div>
      </section>
    );
  }

  if (!pendingDraft) {
    return (
      <section aria-labelledby="credit-score-empty-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 id="credit-score-empty-title" className="text-lg font-extrabold" style={{ color: C.dark }}>
          No application is awaiting a credit check
        </h2>
        <p className="mt-1 text-[12.5px] leading-6" style={{ color: C.gray }}>
          Your application may already have been finalised, or the draft was not saved. Start a
          new application from the loan page to check your eligibility.
        </p>
        {dashboardPath && (
          <Link
            to={dashboardPath}
            className="mt-4 inline-flex rounded-xl px-4 py-2.5 text-[12.5px] font-bold text-white transition hover:brightness-110"
            style={{ background: C.navy }}
          >
            Go to the application form
          </Link>
        )}
      </section>
    );
  }

  if (draftingWindow?.expired) {
    return (
      <section aria-labelledby="credit-score-expired-title" className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 id="credit-score-expired-title" className="text-lg font-extrabold text-red-900">
          This application draft has expired
        </h2>
        <p className="mt-1 text-[12.5px] leading-6 text-red-800">
          The 24-hour window for your saved {productLabel} application has ended. Please start
          your application again.
        </p>
        {dashboardPath && (
          <Link
            to={dashboardPath}
            className="mt-4 inline-flex rounded-xl px-4 py-2.5 text-[12.5px] font-bold text-white transition hover:brightness-110"
            style={{ background: C.navy }}
          >
            Start a new application
          </Link>
        )}
      </section>
    );
  }

  return (
    <section aria-labelledby="credit-score-gate-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 id="credit-score-gate-title" className="text-lg font-extrabold text-(--brand-navy)">Last step to complete your application form</h2>
            <h3 className="text-md font-bold text-(--brand-navy)">Kindly enter your credit score</h3>
          <p className="mt-1 text-[12.5px] leading-6 text-slate-500">
            Your credit score could be entered only once, so please check it before submitting.
          </p>
        </div>
        {onDiscard && (
          <button
            type="button"
            onClick={onDiscard}
            className="shrink-0 cursor-pointer rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider text-red-700 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            Discard
          </button>
        )}
      </div>
      <form onSubmit={(event) => void submitScore(event)} noValidate className="mt-5">
        <label htmlFor="credit-score-input" className="block text-xs font-bold uppercase tracking-wide text-slate-500">Your credit score</label>
        <div className="mt-1.5 flex flex-col gap-3 sm:flex-row sm:items-start">
          <input id="credit-score-input" type="text" inputMode="numeric" autoComplete="off" maxLength={3} value={rawScore}
            disabled={submitting}
            onChange={(event) => { setRawScore(event.target.value.replace(/\D/g, "").slice(0, 3)); setError(""); }} placeholder="***"
            aria-invalid={error ? true : undefined} aria-describedby={error ? "credit-score-error" : "credit-score-hint"}
            className="w-full rounded-xl border px-4 py-3 text-center text-2xl font-extrabold tracking-widest text-(--brand-navy) disabled:cursor-not-allowed disabled:bg-slate-100 sm:w-40"
            style={{ borderColor: error ? "#fca5a5" : "#cbd5e1", background: error ? "#fef2f2" : "#fff" }} />
          <div className="min-w-0 flex-1">
            {error ? <p id="credit-score-error" role="alert" className="text-xs font-semibold text-red-600">{error}</p> : <p id="credit-score-hint" className="text-[12px] leading-5 text-slate-500">Between {SCORE_MIN} and {SCORE_MAX}. It cannot be changed after submission.</p>}
            {typedIsValid && <p className="mt-1.5 text-[12px] font-semibold" style={{ color: BAND_META[bandForScore(typedScore)].color }}>This is {BAND_META[bandForScore(typedScore)].label} score.</p>}
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
