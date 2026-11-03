import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarClock,
  Check,
  CreditCard,
  Gauge,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import PageBanner from "../components/common/PageBanner";
import {
  BAND_META,
  SCORE_MAX,
  SCORE_MIN,
  bandForScore,
  isValidScore,
  type CreditBand,
} from "../components/loan-eligibility/creditScoreEvaluation";
import useSEO from "../hooks/useSEO";

const BAND_ORDER: CreditBand[] = ["poor", "average", "good", "excellent"];

const BAND_LABEL: Record<CreditBand, string> = {
  poor: "Poor",
  average: "Average",
  good: "Good",
  excellent: "Excellent",
};

const BANDS = BAND_ORDER.map((key) => ({
  key,
  ...BAND_META[key],
}));

const NEXT_STEPS: Record<CreditBand, string[]> = {
  poor: [
    "Clear overdue EMIs or credit-card dues first.",
    "Keep credit utilisation below 30% and avoid new applications for a few months.",
  ],
  average: [
    "Pay every EMI and card bill on time for the next few months.",
    "Reduce outstanding balances before applying, and consider a co-applicant.",
  ],
  good: [
    "Compare offers from a few lenders before choosing.",
    "Keep your existing EMIs comfortable relative to your income.",
  ],
  excellent: [
    "Ask lenders to match or beat the best rate you are offered.",
    "Apply selectively — several enquiries at once can still affect your profile.",
  ],
};

const FACTORS = [
  {
    icon: CalendarClock,
    title: "Payment history",
    copy: "On-time EMI and credit-card payments carry the most weight.",
  },
  {
    icon: Gauge,
    title: "Credit utilisation",
    copy: "Using a smaller share of your available limit signals lower risk.",
  },
  {
    icon: TrendingUp,
    title: "Credit age",
    copy: "A longer record of well-managed credit helps your score.",
  },
  {
    icon: CreditCard,
    title: "New credit",
    copy: "Several recent applications can make lenders more cautious.",
  },
];

const FAQS = [
  {
    question: "Does this page check my credit report?",
    answer:
      "No. It only uses the score you enter. We do not pull a credit-bureau report, and entering a score here does not affect it.",
  },
  {
    question: "What is considered a good credit score?",
    answer:
      "As a general guide, 700 and above is good and 800 and above is excellent. Lender cut-offs vary by loan product and by the rest of your profile.",
  },
  {
    question: "Where can I find my credit score?",
    answer:
      "Your bank or credit-card app often shows it, or you can find it in a credit-bureau report. Use the latest three-digit score you have.",
  },
  {
    question: "Can I apply with a lower score?",
    answer:
      "It may still be possible, though the options can be narrower. A co-applicant, a secured product, or additional documents can sometimes help.",
  },
];

const scorePercent = (score: number) =>
  ((score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100;

const ScoreScale = ({ score }: { score: number | null }) => {
  const activeBand = score !== null ? bandForScore(score) : null;

  return (
    <div>
      <div
        className="relative"
        role="img"
        aria-label="Credit score bands: Poor 300 to 600, Average 601 to 700, Good 701 to 800, Excellent 801 to 900"
      >
        <div className="flex h-2.5 overflow-hidden rounded-full">
          {BANDS.map((band) => (
            <div
              key={band.key}
              style={{
                width: `${((band.segment[1] - band.segment[0]) / (SCORE_MAX - SCORE_MIN)) * 100}%`,
                backgroundColor: band.color,
              }}
            />
          ))}
        </div>

        {score !== null && (
          <span
            aria-hidden="true"
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow-md"
            style={{
              left: `${scorePercent(score)}%`,
              backgroundColor: activeBand ? BAND_META[activeBand].color : "#334155",
            }}
          />
        )}
      </div>

      <div className="mt-2 flex justify-between text-[10px] font-semibold text-slate-400">
        <span>{SCORE_MIN}</span>
        <span>{SCORE_MAX}</span>
      </div>

      <div className="mt-1 flex text-[10px] font-bold">
        {BANDS.map((band) => (
          <span
            key={band.key}
            className="text-center"
            style={{
              width: `${((band.segment[1] - band.segment[0]) / (SCORE_MAX - SCORE_MIN)) * 100}%`,
              color: band.color,
            }}
          >
            {BAND_LABEL[band.key]}
          </span>
        ))}
      </div>
    </div>
  );
};

const KnowYourScorePage = () => {
  useSEO({
    title: "Know Your Credit Score — Free Score Band Check",
    description:
      "Enter your credit score to see the band it falls in, what lenders may think, and practical next steps. Free, private, and no impact on your score.",
    path: "/know-your-score",
  });

  const [score, setScore] = useState("");
  const parsedScore = Number(score);
  const hasScore = score.length > 0;
  const isValid = hasScore && isValidScore(parsedScore);
  const band = isValid ? bandForScore(parsedScore) : null;
  const meta = band ? BAND_META[band] : null;
  const showError = hasScore && !isValid && score.length >= 3;

  return (
    <>
      <PageBanner
        breadcrumb="Know Your Score"
        title="Know Your"
        highlight="Score"
        tagline="A clear check. A clear next step."
      />

      <main>
        {/* ── Score checker ───────────────────────────────────────────────── */}
        <section className="bg-white px-6 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-6xl">
            <header className="mb-8 max-w-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--brand-navy)">
                Free score band check
              </p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-4xl">
                Enter your score. See what it means.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Use the score from your latest credit report. We&apos;ll show the band it falls
                in and the next step that makes sense for your profile.
              </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
              {/* Input card */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_-24px_rgba(6,106,156,0.35)] sm:p-8">
                  <div className="flex items-center gap-2 text-(--brand-navy)">
                    <Gauge className="h-5 w-5" aria-hidden="true" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em]">
                      Score check
                    </p>
                  </div>

                  <label
                    htmlFor="credit-score-entry"
                    className="mt-5 block text-sm font-bold text-slate-800"
                  >
                    Enter your credit score
                  </label>

                  <div className="relative mt-2">
                    <input
                      id="credit-score-entry"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={3}
                      value={score}
                      onChange={(event) => {
                        setScore(event.target.value.replace(/\D/g, "").slice(0, 3));
                      }}
                      placeholder="e.g. 750"
                      aria-invalid={showError || undefined}
                      aria-describedby={showError ? "score-error" : "score-hint"}
                      className={`w-full rounded-2xl border-2 bg-white px-5 py-4 pr-20 text-4xl font-extrabold tracking-tight outline-none transition ${
                        showError
                          ? "border-red-300 text-red-900 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 text-(--brand-navy) focus:border-(--brand-teal) focus:ring-4 focus:ring-(--brand-teal-20)"
                      }`}
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400"
                    >
                      / 900
                    </span>
                  </div>

                  {showError ? (
                    <p
                      id="score-error"
                      role="alert"
                      className="mt-2 text-xs font-semibold text-red-600"
                    >
                      Enter a whole-number score between {SCORE_MIN} and {SCORE_MAX}.
                    </p>
                  ) : (
                    <p id="score-hint" className="mt-2 text-xs leading-5 text-slate-400">
                      Use the three-digit score shown on your latest credit report.
                    </p>
                  )}

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Where to find it
                    </p>
                    <ol className="mt-3 space-y-2.5">
                      {[
                        "Open your bank or credit-card app, or your latest credit report.",
                        "Find the three-digit score shown there.",
                        "Enter it above to see your band and next steps.",
                      ].map((step, index) => (
                        <li
                          key={step}
                          className="flex gap-2.5 text-[12.5px] leading-5 text-slate-500"
                        >
                          <span
                            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--brand-teal)/10 text-[10px] font-bold text-(--brand-navy)"
                            aria-hidden="true"
                          >
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <p className="mt-5 flex gap-2 rounded-2xl bg-slate-50 p-3.5 text-[11px] leading-5 text-slate-500">
                    <ShieldCheck
                      className="mt-0.5 h-4 w-4 shrink-0 text-(--brand-teal)"
                      aria-hidden="true"
                    />
                    This page only uses the number you enter. It does not pull your credit
                    report or affect your score.
                  </p>
                </div>
              </div>

              {/* Result card */}
              <div className="lg:col-span-7">
                <p className="sr-only" aria-live="polite">
                  {meta && band
                    ? `Score ${parsedScore}. ${BAND_LABEL[band]} band. ${meta.blurb}`
                    : ""}
                </p>
                {meta && band ? (
                  <div
                    className="flex h-full flex-col rounded-3xl border p-6 sm:p-8"
                    style={{ borderColor: meta.border, backgroundColor: meta.bg }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                          Your result
                        </p>
                        <div className="mt-1 flex flex-wrap items-end gap-3">
                          <span
                            className="text-6xl font-extrabold leading-none tracking-tight"
                            style={{ color: meta.color }}
                          >
                            {parsedScore}
                          </span>
                          <span
                            className="mb-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white"
                            style={{ backgroundColor: meta.color }}
                          >
                            {BAND_LABEL[band]}
                          </span>
                        </div>
                      </div>
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/60"
                        style={{ color: meta.color }}
                        aria-hidden="true"
                      >
                        <ShieldCheck className="h-5 w-5" />
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-700">{meta.blurb}</p>

                    <div className="mt-6">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        What to do next
                      </p>
                      <ul className="mt-2 space-y-2">
                        {NEXT_STEPS[band].map((step) => (
                          <li
                            key={step}
                            className="flex gap-2 text-[12.5px] leading-5 text-slate-600"
                          >
                            <Check
                              className="mt-0.5 h-3.5 w-3.5 shrink-0"
                              style={{ color: meta.color }}
                              strokeWidth={3}
                              aria-hidden="true"
                            />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto pt-6">
                      <ScoreScale score={parsedScore} />
                    </div>

                    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                      <Link
                        to="/eligibility-calculator"
                        className="group inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[12.5px] font-bold text-white transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-44) focus-visible:ring-offset-1"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-teal) 100%)",
                        }}
                      >
                        Estimate my eligibility
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                      <Link
                        to="/contact"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 text-[12.5px] font-bold text-slate-700 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
                      >
                        Talk to a specialist
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full min-h-90 flex-col justify-between rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 sm:p-8">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Your result
                      </p>
                      <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-800">
                        Your band will appear here.
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Enter a score from {SCORE_MIN} to {SCORE_MAX} to see what it means for
                        your loan options and what to do next.
                      </p>
                    </div>
                    <div className="mt-8">
                      <ScoreScale score={null} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Score factors ──────────────────────────────────────────────── */}
        <section className="bg-slate-50 px-6 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-6xl">
            <header className="max-w-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--brand-navy)">
                What moves the needle
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                What lenders look at.
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                A credit score is a snapshot, not a verdict. These are the habits that shape it
                over time.
              </p>
            </header>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FACTORS.map(({ icon: Icon, title, copy }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(6,106,156,0.04)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--brand-teal)/10 text-(--brand-navy)">
                    <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-sm font-bold text-slate-800">{title}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-5 text-slate-500">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────────────── */}
        <section className="bg-white px-6 py-12 md:px-8 md:py-16">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <header>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--brand-navy)">
                Good to know
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                Questions, answered.
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                A score is one part of your application. If you are unsure what fits your
                profile, our team can help you work through the options.
              </p>
            </header>

            <div className="space-y-3">
              {FAQS.map(({ question, answer }) => (
                <details
                  key={question}
                  className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-slate-300 open:shadow-[0_8px_24px_-18px_rgba(6,106,156,0.45)]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-slate-800 [&::-webkit-details-marker]:hidden">
                    {question}
                    <span
                      aria-hidden="true"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg leading-none text-slate-500 transition group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 pr-8 text-[12.5px] leading-6 text-slate-500">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Closing CTA ────────────────────────────────────────────────── */}
        <section className="bg-[#f0f9ff] px-6 py-12 md:px-8 md:py-16">
          <div
            className="mx-auto flex max-w-6xl flex-col gap-6 overflow-hidden rounded-3xl px-6 py-8 text-white sm:px-10 md:flex-row md:items-center md:justify-between"
            style={{
              background:
                "linear-gradient(135deg, #06364c 0%, #075a79 55%, #0b7a78 100%)",
            }}
          >
            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
                Next step
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
                Turn your score into a plan.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
                Estimate what you may qualify for, compare the options, and apply only when the
                numbers make sense.
              </p>
            </div>
            <Link
              to="/eligibility-calculator"
              className="relative inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-(--brand-navy) transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-yellow)"
            >
              Estimate my eligibility
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default KnowYourScorePage;
