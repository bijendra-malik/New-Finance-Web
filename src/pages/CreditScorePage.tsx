import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CreditScoreGate from "../components/loan-eligibility/CreditScoreGate";
import { FORM } from "../constants/formStyles";
import { THEME as C } from "../constants/theme";
import useSEO from "../hooks/useSEO";
import { useAuth } from "../context/authContext";
import { deleteLoanApplyDraft } from "../api/customer";
import { getApiErrorMessage } from "../utils/apiError";
import {
  clearPendingCreditScoreDraft,
  readPendingCreditScoreDraft,
  remainingCreditScoreWindow,
} from "../utils/applicationFlowState";
import { clearApplySessionPending } from "../utils/applySession";
import { loanKeyFor } from "../constants/loanSlugs";

export interface CreditScorePageState {
  product?: string;
  requestedProduct?: string;
  from?: string;
}

const CreditScorePage = () => {
  const { state } = useLocation();
  const { product, requestedProduct, from } = (state ?? {}) as CreditScorePageState;
  const { user } = useAuth();
  const productLabel = product?.trim();
  const [finalized, setFinalized] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [discardOpen, setDiscardOpen] = useState(false);
  const [discardNotice, setDiscardNotice] = useState("");
  const [discarding, setDiscarding] = useState(false);
  const pendingDraft = readPendingCreditScoreDraft(user?._id);
  const deadline = pendingDraft
    ? remainingCreditScoreWindow(pendingDraft.createdAt, now)
    : null;
  const requestedLoanKey = requestedProduct ? loanKeyFor(requestedProduct) : null;
  const isOtherLoanRedirect = Boolean(
    pendingDraft && requestedLoanKey && requestedLoanKey !== pendingDraft.loanKey,
  );

  useEffect(() => {
    if (!pendingDraft || deadline?.expired) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [pendingDraft, deadline?.expired]);

  useSEO({
    title: "Check Your Credit Score",
    description:
      "Check your credit score against the cut-offs our lenders use, see the band it falls in, and find out what to do next. Free, instant, and it never affects your score.",
    path: "/credit-score",
  });

  const handleDiscard = async () => {
    if (discarding || !pendingDraft?.draftId) return;
    setDiscarding(true);
    setDiscardNotice("");
    try {
      await deleteLoanApplyDraft(pendingDraft.draftId);
      clearPendingCreditScoreDraft();
      clearApplySessionPending();
      setDiscardOpen(false);
    } catch (err) {
      setDiscardNotice(
        getApiErrorMessage(err, "The application could not be discarded. Please try again."),
      );
    } finally {
      setDiscarding(false);
    }
  };

  const timeRemaining = deadline
    ? [
      Math.floor(deadline.remainingMs / 3_600_000),
      Math.floor((deadline.remainingMs % 3_600_000) / 60_000),
      Math.floor((deadline.remainingMs % 60_000) / 1_000),
    ].map((part) => String(part).padStart(2, "0")).join(":")
    : null;

  return (
    <div className="min-h-screen mt-(--header-h) px-4 py-8 md:py-12" style={{ background: FORM.pageBg }}>
      <div className="mx-auto max-w-3xl">
        {!finalized && from && (
          <Link
            to={from}
            state={pendingDraft?.application ? { resumeApplication: pendingDraft.application } : undefined}
            className="inline-flex items-center gap-1.5 text-xs font-bold transition hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-44) rounded"
            style={{ color: C.navy }}
          >
            <span aria-hidden="true">←</span> Back to dashboard
          </Link>
        )}

        {!finalized && (
          <header className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.teal }}>
              Credit health check
            </p>
            {pendingDraft && deadline && (
              <section
                aria-label="Application completion deadline"
                className="mt-3 rounded-xl border px-4 py-3"
                style={{
                  borderColor: deadline.expired ? "#fecaca" : "var(--brand-teal-33)",
                  background: deadline.expired ? "#fef2f2" : "var(--brand-teal-08)",
                }}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-extrabold" style={{ color: deadline.expired ? "#b91c1c" : C.dark }}>
                      {deadline.expired ? "Application draft expired" : "Complete your application"}
                    </p>
                    <p className="mt-0.5 text-xs leading-5" style={{ color: C.gray }}>
                      {deadline.expired
                        ? "The 24-hour window for this saved application has ended."
                        : "Your submitted form is saved. Enter your credit score before the deadline."}
                    </p>
                  </div>
                  {!deadline.expired && (
                    <div className="shrink-0 rounded-lg bg-white px-3 py-2 text-center shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Time remaining</p>
                      <p className="font-mono text-xl font-extrabold tracking-wide" style={{ color: C.navy }}>{timeRemaining}</p>
                    </div>
                  )}
                </div>
              </section>
            )}
            {isOtherLoanRedirect && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900" role="status">
                You have a pending {productLabel} application. Complete or discard it before applying for {requestedProduct}.
              </div>
            )}
            <h1 className="mt-1 text-2xl font-extrabold md:text-3xl" style={{ color: C.dark }}>
              Check your credit score
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6" style={{ color: C.gray }}>
              {productLabel
                ? `Your ${productLabel} details are saved. Enter your credit score to check eligibility and submit the application.`
                : "Enter your credit score to check eligibility and submit your application."}
            </p>
          </header>
        )}

        <CreditScoreGate
          product={productLabel}
          dashboardPath={from}
          onFinalized={() => setFinalized(true)}
          onDiscard={
            pendingDraft && !deadline?.expired
              ? () => { setDiscardNotice(""); setDiscardOpen(true); }
              : undefined
          }
        />
      </div>
      {discardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" role="presentation">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="discard-application-title"
            className="w-full rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <p className="text-xs font-extrabold uppercase tracking-widest text-red-600">Permanent action</p>
            <h2 id="discard-application-title" className="mt-1 text-xl font-extrabold text-slate-900">Discard this application?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Once discarded, all application data will be permanently deleted. You will need to fill in the form again if you decide to apply for the same loan.
            </p>
            {discardNotice && <p role="alert" className="mt-3 text-xs font-semibold text-red-600">{discardNotice}</p>}
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setDiscardOpen(false)} disabled={discarding} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
                Keep application
              </button>
              <button
                type="button"
                onClick={() => void handleDiscard()}
                disabled={discarding}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {discarding ? "Discarding…" : "Discard application"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default CreditScorePage;
