import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ScoreDial from "../loan-eligibility/ScoreDial";
import {
  SCORE_MAX,
  SCORE_MIN,
  bandForScore,
  ratingForScore,
  type CreditBand,
} from "../loan-eligibility/creditScoreEvaluation";

const COMPARISON_BY_BAND: Record<CreditBand, number> = {
  poor: 12,
  average: 31,
  good: 48,
  excellent: 72,
};

const TARGET_SCORE = 750;
const progressForScore = (score: number) =>
  (score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN);

// ── Label icon definitions (static, icons don't need translation) ─────────────
const labelIcons = {
  paymentHistory: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="var(--brand-navy)" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ageType: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="var(--brand-navy)" strokeWidth="2">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  ),
  utilization: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 2 A10 10 0 0 1 22 12 L12 12 Z" fill="var(--brand-navy)" opacity="0.85" />
      <path d="M12 2 A10 10 0 1 0 22 12 L12 12 Z" fill="var(--brand-teal-20)" />
      <circle cx="12" cy="12" r="10" stroke="var(--brand-navy)" fill="none" strokeWidth="1.5" />
      <line x1="12" y1="12" x2="12" y2="2" stroke="var(--brand-navy)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="22" y2="12" stroke="var(--brand-navy)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  totalBalances: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="var(--brand-navy)" strokeWidth="2">
      <path d="M12 3l7 7H5l7-7z" strokeLinejoin="round" />
      <rect x="5" y="10" width="14" height="11" rx="1" />
      <path d="M9 21v-6h6v6" strokeLinejoin="round" />
    </svg>
  ),
  recentBehavior: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="var(--brand-navy)" strokeWidth="2">
      <polyline points="2,17 7,12 11,15 16,9 22,13" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="2" y1="20" x2="22" y2="20" strokeLinecap="round" />
    </svg>
  ),
  availableCredit: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="var(--brand-navy)" strokeWidth="2">
      <rect x="2" y="6" width="20" height="13" rx="2" />
      <path d="M2 10h20" strokeLinecap="round" />
      <circle cx="7" cy="15" r="1.5" fill="var(--brand-navy)" />
    </svg>
  ),
};

// ── Label config (plain English text + tooltip) ────────────────────────
const labelDefs: { text: string; tip: string; side: "left" | "right"; iconKey: keyof typeof labelIcons }[] = [
  { text: "Payment History",         tip: "Your track record of on-time bill & EMI payments",                          side: "left",  iconKey: "paymentHistory"  },
  { text: "Age & Type of Credit",    tip: "Length of your credit history and variety of credit types",                side: "left",  iconKey: "ageType"         },
  { text: "% of Credit Utilization", tip: "How much of your available credit limit you are currently using",          side: "left",  iconKey: "utilization"     },
  { text: "Total Balances/Debt",     tip: "Total outstanding amount across all your loans and credit cards",          side: "right", iconKey: "totalBalances"   },
  { text: "Recent Credit Behavior",  tip: "New credit applications and recent account openings",                      side: "right", iconKey: "recentBehavior"  },
  { text: "Available Credit",        tip: "Total credit limit minus current outstanding balance",                     side: "right", iconKey: "availableCredit" },
];

// ── LabelItem with tooltip ────────────────────────────────────────────────────
const LabelItem = ({
  text,
  tip,
  iconKey,
  align,
}: {
  text: string;
  tip: string;
  iconKey: keyof typeof labelIcons;
  align: "left" | "right";
}) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className={`relative flex items-center gap-2 cursor-pointer group ${align === "left" ? "justify-end" : "justify-start"}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {align === "left" && (
        <span className="text-xs text-slate-600 font-medium text-right leading-tight transition-colors duration-200 group-hover:text-(--brand-navy)">
          {text}
        </span>
      )}

      <div
        className="shrink-0 w-9 h-9 rounded-full bg-white flex items-center justify-center transition-all duration-300 cursor-pointer"
        style={{
          boxShadow: show
            ? "0 0 0 3px rgba(74,144,217,0.35), 0 2px 8px rgba(0,0,0,0.12)"
            : "0 1px 4px rgba(0,0,0,0.1)",
          transform: show ? "translateY(-6px)" : "translateY(0px)",
        }}
      >
        {labelIcons[iconKey]}
      </div>

      {align === "right" && (
        <span className="text-xs text-slate-600 font-medium leading-tight transition-colors duration-200 group-hover:text-(--brand-navy)">
          {text}
        </span>
      )}

      {/* Tooltip */}
      {show && (
        <div
          className={`absolute z-20 bg-slate-800 text-white text-[11px] leading-tight rounded-lg px-3 py-2 w-44 shadow-xl pointer-events-none ${
            align === "left" ? "right-full mr-3 top-1/2 -translate-y-1/2" : "left-full ml-3 top-1/2 -translate-y-1/2"
          }`}
        >
          {tip}
          <div
            className={`absolute top-1/2 -translate-y-1/2 border-4 border-transparent ${
              align === "left"
                ? "-right-2 border-l-slate-800"
                : "-left-2 border-r-slate-800"
            }`}
          />
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const CreditScore = () => {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(TARGET_SCORE);
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setStarted(true);
        observer.disconnect();
      },
      { threshold: 0.3 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleProgressChange = useCallback((progress: number) => {
    setStarted(true);
    setScore(Math.round(SCORE_MIN + progress * (SCORE_MAX - SCORE_MIN)));
  }, []);

  const { label: ratingLabel, tip: ratingTip } = ratingForScore(score);
  const comparison = COMPARISON_BY_BAND[bandForScore(score)];

  const leftLabels  = labelDefs.filter((l) => l.side === "left");
  const rightLabels = labelDefs.filter((l) => l.side === "right");

  return (
    <section
      ref={sectionRef}
      className="section-shell w-full overflow-visible border-t border-slate-200/70 bg-(--surface-tint) px-4 sm:px-6"
    >

      {/* Heading */}
      <p className="section-eyebrow mb-2 text-center">Credit health</p>
      <h2 className="mx-auto max-w-2xl text-center text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl md:text-4xl">
        Get Your <span style={{ color: "var(--brand-navy)" }}>Credit Score</span> and Report
      </h2>
      <p className="mt-2 text-center text-sm text-slate-500">
        Powered by TransUnion · Updated instantly · No impact on score
      </p>

      {/* Main card */}
      <div className="max-w-3xl mx-auto flex flex-col items-center">

        {/* Gauge row */}
        <div className="relative w-full flex items-center justify-center">

          {/* LEFT labels */}
          <div className="hidden sm:flex flex-col gap-5 items-end mr-4 w-44 shrink-0">
            {leftLabels.map((l) => (
              <LabelItem key={l.text} text={l.text} tip={l.tip} iconKey={l.iconKey} align="left" />
            ))}
          </div>

          {/* Score dial */}
          <ScoreDial
            progress={started ? progressForScore(score) : 0}
            label={ratingLabel}
            tip={ratingTip}
            caption={`Better than ${comparison}% of users`}
            interactive
            onProgressChange={handleProgressChange}
          />

          {/* RIGHT labels */}
          <div className="hidden sm:flex flex-col gap-5 items-start ml-4 w-44 shrink-0">
            {rightLabels.map((l) => (
              <LabelItem key={l.text} text={l.text} tip={l.tip} iconKey={l.iconKey} align="right" />
            ))}
          </div>
        </div>

        {/* Mobile labels */}
        <div className="mt-6 grid w-full grid-cols-2 gap-3 px-4 sm:hidden">
          {labelDefs.map((l) => (
            <div key={l.text} className="flex items-center gap-2">
              <div className="shrink-0 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center">
                {labelIcons[l.iconKey]}
              </div>
              <span className="text-xs text-slate-600 font-medium leading-tight">{l.text}</span>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <Link
          to="/know-your-score"
          className="mt-9 flex w-full max-w-xs items-center justify-center rounded-xl bg-(--brand-navy) px-6 py-3 text-center text-sm font-bold text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-(--brand-navy-deep) hover:shadow-md active:scale-[.99] md:text-base"
        >
          Know Your Score
        </Link>

        {/* Disclaimer */}
        <p className="mt-1 text-[11px] text-slate-400 text-center max-w-xs mb-4">
          Checking your own credit score doesn't affect it.
        </p>

        <Link
          to="/how-to-improve-credit-score"
          className="mt-3 text-[12.5px] font-bold text-(--brand-navy) underline decoration-(--brand-teal) decoration-2 underline-offset-4 transition-colors hover:text-(--brand-teal) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-44) rounded"
        >
          How to improve your credit score →
        </Link>
      </div>
    </section>
  );
};

export default CreditScore;
