import { Link } from "react-router-dom";
import { Check, Clock, ShieldCheck, TrendingUp } from "lucide-react";
import PageBanner from "../components/common/PageBanner";
import useSEO from "../hooks/useSEO";
import { DEFAULT_ELIGIBILITY_PATH } from "./eligibility/routes";

interface Pointer {
  title: string;
  copy: string;
  action: string;
}

const POINTERS: Pointer[] = [
  {
    title: "Pay every EMI and card bill on time",
    copy:
      "Payment history carries the most weight in every credit score model. A single 30-day late payment can pull the score down and stay on your report for years.",
    action:
      "Set an auto-debit or a reminder for each due date, and pay at least the minimum on every card even in a tight month.",
  },
  {
    title: "Keep credit utilisation below 30%",
    copy:
      "Using most of your available limit looks risky to lenders, even when you pay on time. The share of limit you use matters as much as the repayment itself.",
    action:
      "Pay card balances in full before the statement date, spread spending across cards, or ask for a limit increase without spending more.",
  },
  {
    title: "Clear overdue amounts before applying again",
    copy:
      "Unpaid dues, bounced EMIs and written-off accounts are the fastest way to be declined. Lenders see the outstanding status, not just the amount.",
    action:
      "Pay the overdue amount in full and ask the lender for a no-dues or closure letter once the account is squared off.",
  },
  {
    title: "Avoid settling a loan where you can",
    copy:
      "A loan marked “settled” or “written off” stays on your report as a negative remark, even after you have paid the agreed amount.",
    action:
      "If you cannot pay in full, negotiate a repayment plan and get the lender to report the account as “closed” rather than “settled”.",
  },
  {
    title: "Do not open several new accounts at once",
    copy:
      "Every loan or card application usually triggers a hard enquiry. Many enquiries in a short window signal that you are short of credit.",
    action:
      "Apply only where you actually need credit, and space applications at least three to six months apart.",
  },
  {
    title: "Keep your oldest credit line open",
    copy:
      "The length of your credit history helps your score, so closing an old card can shorten it and raise your utilisation at the same time.",
    action:
      "Keep long-held cards active with a small recurring spend and an auto-pay mandate instead of closing them.",
  },
  {
    title: "Check your credit report for errors",
    copy:
      "Reports often carry duplicate accounts, closed loans still shown as open, or late payments recorded against the wrong person.",
    action:
      "Download your report from each bureau, list the incorrect entries, and raise a dispute with the bureau and the lender with supporting proof.",
  },
  {
    title: "Use a secured card or a small loan to rebuild",
    copy:
      "A thin file with no credit history can score poorly even with a healthy income. A small, well-repaid credit line proves you can handle debt.",
    action:
      "Start with a fixed-deposit-backed card, keep usage low, and repay in full for at least six months.",
  },
  {
    title: "Be consistent for at least six months",
    copy:
      "Scores move on recent behaviour. One clean month rarely changes a band, but a sustained record of on-time payments does.",
    action:
      "Track the score monthly, keep every account current, and reapply only once the report is clean for a few billing cycles.",
  },
];

const ImproveCreditScorePage = () => {
  useSEO({
    title: "How to Improve Your Credit Score",
    description:
      "Practical steps that actually improve your credit score — payment history, credit utilisation, clearing dues, fixing report errors and rebuilding with secured credit.",
    path: "/how-to-improve-credit-score",
  });

  return (
    <>
      <PageBanner
        breadcrumb="Improve Your Credit Score"
        title="How to improve your"
        highlight="credit score"
        tagline="Small, consistent habits — not shortcuts."
      />

      <main className="bg-white">
        <section className="px-6 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-5xl">
            <header className="max-w-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--brand-navy)">
                For a declined application
              </p>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-3xl">
                What actually moves your score
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                There is no legitimate way to jump a score overnight. The points below are the
                factors credit bureaus actually weigh, and each one is something you can start on
                this month. Most improvements show up within three to six months — corrected
                report errors can show up sooner.
              </p>
            </header>

            <ol className="mt-10 space-y-4">
              {POINTERS.map((pointer, index) => (
                <li
                  key={pointer.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-teal) 100%)",
                      }}
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
                        {pointer.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-600">{pointer.copy}</p>
                      <p className="mt-3 flex gap-2 rounded-xl bg-slate-50 p-3 text-[12.5px] leading-5 text-slate-600">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-(--brand-teal)"
                          strokeWidth={3}
                          aria-hidden="true"
                        />
                        <span>{pointer.action}</span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: TrendingUp,
                  title: "Payment history",
                  copy: "The largest single factor — keep it spotless.",
                },
                {
                  icon: ShieldCheck,
                  title: "Low utilisation",
                  copy: "Stay under 30% of your available limit.",
                },
                {
                  icon: Clock,
                  title: "Give it time",
                  copy: "Allow 3–6 clean months before reapplying.",
                },
              ].map(({ icon: Icon, title, copy }) => (
                <div key={title} className="rounded-2xl border border-slate-200 p-4">
                  <Icon className="h-5 w-5 text-(--brand-teal)" aria-hidden="true" />
                  <p className="mt-2 text-sm font-bold text-slate-800">{title}</p>
                  <p className="mt-1 text-[12.5px] leading-5 text-slate-500">{copy}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl bg-slate-50 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Next step
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Once your report shows a clean repayment record, check the band your score falls
                in, then estimate the amount you may qualify for before filing a fresh
                application.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Link
                  to="/know-your-score"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-[12.5px] font-bold text-white transition hover:brightness-110"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-teal) 100%)",
                  }}
                >
                  Check your score band
                </Link>
                <Link
                  to={DEFAULT_ELIGIBILITY_PATH}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-[12.5px] font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Check loan eligibility
                </Link>
              </div>
            </div>

            <p className="mt-6 text-[11px] leading-5 text-slate-400">
              This page is general information, not financial advice. Your score is calculated by
              credit bureaus, and lender decisions depend on their own policy and the rest of your
              profile.
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default ImproveCreditScorePage;
