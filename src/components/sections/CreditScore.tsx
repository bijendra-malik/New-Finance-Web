import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// ── Gauge geometry ────────────────────────────────────────────────────────────
const CX = 160;
const CY = 170;
const SVG_W = 320;
const SVG_H = 320;
const R_OUTER = 115;
const STROKE  = 22;
const GAUGE_START = -220;
const GAUGE_END   =  40;
const GAUGE_SWEEP = GAUGE_END - GAUGE_START; // 260°

// CIBIL range: 300–900
const CIBIL_MIN = 300;
const CIBIL_MAX = 900;
const TARGET_SCORE = 750; // exactly 750 shown in center

// Position 750 in the 300–900 range → (750-300)/(900-300) = 75%
const TARGET_PCT = ((TARGET_SCORE - CIBIL_MIN) / (CIBIL_MAX - CIBIL_MIN)) * 100;

// ── Color stops ───────────────────────────────────────────────────────────────
const COLOR_STOPS: [string, number][] = [
  ["#e74c3c", 0.00],
  ["#e67e22", 0.20],
  ["#f1c40f", 0.40],
  ["#a8d150", 0.58],
  ["#26ae90", 0.75],
  ["#1abc9c", 1.00],
];

const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
const hexToRgb = (h: string) => ({
  r: parseInt(h.slice(1, 3), 16),
  g: parseInt(h.slice(3, 5), 16),
  b: parseInt(h.slice(5, 7), 16),
});
const interpolateColor = (t: number): string => {
  const clamped = Math.max(0, Math.min(1, t));
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const [c1, f1] = COLOR_STOPS[i];
    const [c2, f2] = COLOR_STOPS[i + 1];
    if (clamped >= f1 && clamped <= f2) {
      const lt = (clamped - f1) / (f2 - f1);
      const a = hexToRgb(c1), b = hexToRgb(c2);
      return `#${lerp(a.r,b.r,lt).toString(16).padStart(2,"0")}${lerp(a.g,b.g,lt).toString(16).padStart(2,"0")}${lerp(a.b,b.b,lt).toString(16).padStart(2,"0")}`;
    }
  }
  return COLOR_STOPS[COLOR_STOPS.length - 1][0];
};

// ── SVG arc helpers ───────────────────────────────────────────────────────────
const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};
const arcPath = (startDeg: number, endDeg: number, r = R_OUTER) => {
  const s = polar(CX, CY, r, startDeg);
  const e = polar(CX, CY, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
};
const SEGMENTS = 80;
const buildGradientArc = (fill: number) => {
  const count = Math.round(fill * SEGMENTS);
  return Array.from({ length: count }, (_, i) => {
    const f0 = i / SEGMENTS;
    const f1 = (i + 1) / SEGMENTS;
    return {
      path: arcPath(GAUGE_START + f0 * GAUGE_SWEEP, GAUGE_START + f1 * GAUGE_SWEEP),
      color: interpolateColor(f0),
    };
  });
};

// ── Rating helper — uses translation keys ─────────────────────────────────────
const getRatingKey = (p: number): { key: string; color: string; comparison: number } => {
  if (p < 40) return { key: "creditScore.ratings.poor",      color: "#e74c3c", comparison: 12 };
  if (p < 55) return { key: "creditScore.ratings.fair",      color: "#e67e22", comparison: 31 };
  if (p < 70) return { key: "creditScore.ratings.good",      color: "#f1c40f", comparison: 52 };
  if (p < 85) return { key: "creditScore.ratings.veryGood",  color: "#26ae90", comparison: 68 };
  return             { key: "creditScore.ratings.excellent",  color: "#1abc9c", comparison: 73 };
};

// ── Label icon definitions (static, icons don't need translation) ─────────────
const labelIcons = {
  paymentHistory: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#4a90d9" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ageType: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#4a90d9" strokeWidth="2">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  ),
  utilization: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 2 A10 10 0 0 1 22 12 L12 12 Z" fill="#4a90d9" opacity="0.85" />
      <path d="M12 2 A10 10 0 1 0 22 12 L12 12 Z" fill="#d0e8f8" />
      <circle cx="12" cy="12" r="10" stroke="#4a90d9" fill="none" strokeWidth="1.5" />
      <line x1="12" y1="12" x2="12" y2="2" stroke="#4a90d9" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="22" y2="12" stroke="#4a90d9" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  totalBalances: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#4a90d9" strokeWidth="2">
      <path d="M12 3l7 7H5l7-7z" strokeLinejoin="round" />
      <rect x="5" y="10" width="14" height="11" rx="1" />
      <path d="M9 21v-6h6v6" strokeLinejoin="round" />
    </svg>
  ),
  recentBehavior: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#4a90d9" strokeWidth="2">
      <polyline points="2,17 7,12 11,15 16,9 22,13" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="2" y1="20" x2="22" y2="20" strokeLinecap="round" />
    </svg>
  ),
  availableCredit: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#4a90d9" strokeWidth="2">
      <rect x="2" y="6" width="20" height="13" rx="2" />
      <path d="M2 10h20" strokeLinecap="round" />
      <circle cx="7" cy="15" r="1.5" fill="#4a90d9" />
    </svg>
  ),
};

// ── Label keys config ─────────────────────────────────────────────────────────
const labelKeys: { textKey: string; tipKey: string; side: "left" | "right"; iconKey: keyof typeof labelIcons }[] = [
  { textKey: "creditScore.labels.paymentHistory",  tipKey: "creditScore.labels.paymentHistoryTip",  side: "left",  iconKey: "paymentHistory"  },
  { textKey: "creditScore.labels.ageType",         tipKey: "creditScore.labels.ageTypeTip",         side: "left",  iconKey: "ageType"         },
  { textKey: "creditScore.labels.utilization",     tipKey: "creditScore.labels.utilizationTip",     side: "left",  iconKey: "utilization"     },
  { textKey: "creditScore.labels.totalBalances",   tipKey: "creditScore.labels.totalBalancesTip",   side: "right", iconKey: "totalBalances"   },
  { textKey: "creditScore.labels.recentBehavior",  tipKey: "creditScore.labels.recentBehaviorTip",  side: "right", iconKey: "recentBehavior"  },
  { textKey: "creditScore.labels.availableCredit", tipKey: "creditScore.labels.availableCreditTip", side: "right", iconKey: "availableCredit" },
];

// ── LabelItem with tooltip ────────────────────────────────────────────────────
const LabelItem = ({
  textKey,
  tipKey,
  iconKey,
  align,
}: {
  textKey: string;
  tipKey: string;
  iconKey: keyof typeof labelIcons;
  align: "left" | "right";
}) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  return (
    <div
      className={`relative flex items-center gap-2 cursor-pointer group ${align === "left" ? "justify-end" : "justify-start"}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {align === "left" && (
        <span className="text-xs text-slate-600 font-medium text-right leading-tight transition-colors duration-200 group-hover:text-[#006699]">
          {t(textKey)}
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
        <span className="text-xs text-slate-600 font-medium leading-tight transition-colors duration-200 group-hover:text-[#006699]">
          {t(textKey)}
        </span>
      )}

      {/* Tooltip */}
      {show && (
        <div
          className={`absolute z-20 bg-slate-800 text-white text-[11px] leading-tight rounded-lg px-3 py-2 w-44 shadow-xl pointer-events-none ${
            align === "left" ? "right-full mr-3 top-1/2 -translate-y-1/2" : "left-full ml-3 top-1/2 -translate-y-1/2"
          }`}
        >
          {t(tipKey)}
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
  const { t } = useTranslation();

  const [animPct, setAnimPct]     = useState(0);
  const [started, setStarted]     = useState(false);
  const [done, setDone]           = useState(false);
  const [pulse, setPulse]         = useState(false);
  const sectionRef                = useRef<HTMLElement>(null);
  const rafRef                    = useRef<number | null>(null);
  const startRef                  = useRef<number | null>(null);
  const DURATION = 2400;

  // Start animation only when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [started]);

  // Count-up animation
  useEffect(() => {
    if (!started) return;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed  = ts - startRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setAnimPct(Math.round(eased * TARGET_PCT));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDone(true);
        setPulse(true);
        setTimeout(() => setPulse(false), 1200);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [started]);

  const arcFill      = animPct / 100;
  const gradientSegs = buildGradientArc(arcFill);
  const needleColor  = interpolateColor(arcFill);
  // Map animPct (0–100%) back to CIBIL 300–900 range
  const actualScore  = Math.round(CIBIL_MIN + (animPct / 100) * (CIBIL_MAX - CIBIL_MIN));

  const { key: ratingKey, color: ratingColor, comparison } = getRatingKey(animPct);
  const ratingText = t(ratingKey);

  const needleAngle = GAUGE_START + arcFill * GAUGE_SWEEP;
  const nTip   = polar(CX, CY, R_OUTER - 8, needleAngle);
  const nBase1 = { x: CX - 5, y: CY + 6 };
  const nBase2 = { x: CX + 5, y: CY + 6 };

  const leftLabels  = labelKeys.filter((l) => l.side === "left");
  const rightLabels = labelKeys.filter((l) => l.side === "right");

  return (
    <section ref={sectionRef} className="w-full bg-[#e8f4fb]/0 py-8 md:py-16 px-0 overflow-visible border-t border-gray-200">

      {/* ── Heading ── */}
      <h2 className="text-center md:text-3xl sm:text-2xl font-bold text-slate-700 uppercase tracking-wide mb-2">
        {t("creditScore.heading")}{" "}
        <span style={{ color: "#006699" }}>{t("creditScore.headingHighlight")}</span>{" "}
        {t("creditScore.headingEnd")}
      </h2>
      <p className="text-center text-sm text-slate-400 mb-2">
        {t("creditScore.powered")}
      </p>

      {/* ── Main card ── */}
      <div className="max-w-3xl mx-auto flex flex-col items-center">

        {/* Gauge row */}
        <div className="relative w-full flex items-center justify-center">

          {/* LEFT labels */}
          <div className="hidden sm:flex flex-col gap-5 items-end mr-4 w-44 shrink-0">
            {leftLabels.map((l) => (
              <LabelItem key={l.textKey} textKey={l.textKey} tipKey={l.tipKey} iconKey={l.iconKey} align="left" />
            ))}
          </div>

          {/* SVG Gauge */}
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width={SVG_W} height={SVG_H} className="shrink-0 overflow-visible">
            {/* Outer glow ring when done */}
            {done && (
              <circle
                cx={CX} cy={CY} r={R_OUTER + 14}
                fill="none" stroke={ratingColor} strokeWidth="3"
                opacity={pulse ? "0.35" : "0.1"}
                style={{ transition: "opacity 0.6s ease" }}
              />
            )}

            {/* Grey track */}
            <path
              d={arcPath(GAUGE_START, GAUGE_END)}
              fill="none" stroke="#cde0f0"
              strokeWidth={STROKE} strokeLinecap="round"
            />

            {/* Gradient arc segments */}
            {gradientSegs.map(({ path, color }, i) => (
              <path key={i} d={path} fill="none" stroke={color} strokeWidth={STROKE} strokeLinecap="butt" />
            ))}

            {/* Tip glow when done */}
            {done && (
              <circle
                cx={nTip.x} cy={nTip.y} r="6"
                fill={needleColor}
                opacity={pulse ? "0.6" : "0.2"}
                style={{ transition: "opacity 0.6s ease" }}
              />
            )}

            {/* Needle */}
            <polygon
              points={`${nTip.x},${nTip.y} ${nBase1.x},${nBase1.y} ${nBase2.x},${nBase2.y}`}
              fill={needleColor} opacity="0.95"
            />
            <circle cx={CX} cy={CY} r="10" fill="#334155" />
            <circle cx={CX} cy={CY} r="5"  fill="#fff" />

            {/* Score — shows animating count, snaps to exact 750 when done */}
            <text
              x={CX} y={CY - 14}
              textAnchor="middle" fontSize="52" fontWeight="bold"
              fill={ratingColor} fontFamily="Georgia, serif"
            >
              {done ? TARGET_SCORE : actualScore}
            </text>

            {/* CIBIL range: 300 on left end, 900 on right end */}
            <text x={CX - 102} y={CY + 100} textAnchor="middle" fontSize="10" fill="#999" fontWeight="500">300</text>
            <text x={CX + 102} y={CY + 100} textAnchor="middle" fontSize="10" fill="#999" fontWeight="500">900</text>

            {/* Sub label */}
            <text x={CX} y={CY + 16} textAnchor="middle" fontSize="11" fill="#777">
              {t("creditScore.yourScoreIs")}
            </text>

            {/* Rating pill */}
            <rect x={CX - 46} y={CY + 22} width="92" height="22" rx="11" fill={ratingColor} opacity="0.15" />
            <text x={CX} y={CY + 37} textAnchor="middle" fontSize="13" fontWeight="bold" fill={ratingColor}>
              {ratingText}
            </text>

            {/* Comparison badge — fades in when done */}
            {done && (
              <>
                <rect x={CX - 68} y={CY + 50} width="136" height="20" rx="10" fill="#006699" opacity="0.1" />
                <text x={CX} y={CY + 64} textAnchor="middle" fontSize="10" fill="#006699" fontWeight="600">
                  {t("creditScore.betterThan", { percent: comparison })}
                </text>
              </>
            )}
          </svg>

          {/* RIGHT labels */}
          <div className="hidden sm:flex flex-col gap-5 items-start ml-4 w-44 shrink-0">
            {rightLabels.map((l) => (
              <LabelItem key={l.textKey} textKey={l.textKey} tipKey={l.tipKey} iconKey={l.iconKey} align="right" />
            ))}
          </div>
        </div>

        {/* Mobile labels */}
        <div className="sm:hidden grid grid-cols-2 gap-3 w-full mt-6 px-10">
          {labelKeys.map((l) => (
            <div key={l.textKey} className="flex items-center gap-2">
              <div className="shrink-0 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center">
                {labelIcons[l.iconKey]}
              </div>
              <span className="text-xs text-slate-600 font-medium leading-tight">{t(l.textKey)}</span>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <a
          href="#"
          className="mt-10 block w-full max-w-xs text-center font-bold text-white text-sm md:text-xl mb-2 py-2 rounded-md cursor-pointer select-none"
          style={{
            background: "#006699",
            transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
            boxShadow: "0 2px 8px rgba(0,102,153,0.25)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "#066a9c";
            el.style.transform = "translateY(-2px)";
            el.style.boxShadow = "0 6px 18px rgba(23,162,134,0.4)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "#006699";
            el.style.transform = "translateY(0)";
            el.style.boxShadow = "0 2px 8px rgba(0,102,153,0.25)";
          }}
        >
          {t("creditScore.knowYourScore")}
        </a>

        {/* Disclaimer */}
        <p className="mt-1 text-[11px] text-slate-400 text-center max-w-xs mb-4">
          {t("creditScore.disclaimer")}
        </p>
      </div>
    </section>
  );
};

export default CreditScore;
