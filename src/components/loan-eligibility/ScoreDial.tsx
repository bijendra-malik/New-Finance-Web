import { useEffect, useId, useRef, useState } from "react";
import { Info } from "lucide-react";
import { SCORE_MAX, SCORE_MIN } from "./creditScoreEvaluation";

// ── Dial geometry ─────────────────────────────────────────────────────────────
const CX = 160;
const CY = 152;
const SVG_W = 320;
const SVG_H = 262;
const R_OUTER = 116;
const STROKE = 20;
const GAUGE_START = -220;
const GAUGE_END = 40;
const GAUGE_SWEEP = GAUGE_END - GAUGE_START;
const NEEDLE_COLOR = "#94a3b8";
const HUB_RADIUS = 10;
const EASE = 0.05;

const SCORE_TOP = 75;
const BAND_TOP = 166;

// ── Color stops ───────────────────────────────────────────────────────────────
const COLOR_STOPS: [string, number][] = [
  ["#c11f1f", 0.0],
  ["#e03a1d", 0.16],
  ["#ef7a12", 0.32],
  ["#f2b418", 0.45],
  ["#e8d02a", 0.55],
  ["#8fc65c", 0.60],
  ["#63c08a", 0.64],
  ["#26ae90", 0.69],
  ["#189b7f", 0.85],
  ["#0d7d68", 1.0],
];

const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
const hexToRgb = (h: string) => ({
  r: parseInt(h.slice(1, 3), 16),
  g: parseInt(h.slice(3, 5), 16),
  b: parseInt(h.slice(5, 7), 16),
});
const shadeColor = (hex: string, factor = 0.65): string => {
  const { r, g, b } = hexToRgb(hex);
  return `#${[r, g, b]
    .map((c) => Math.round(c * factor).toString(16).padStart(2, "0"))
    .join("")}`;
};
const interpolateColor = (t: number): string => {
  const clamped = Math.max(0, Math.min(1, t));
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const [c1, f1] = COLOR_STOPS[i];
    const [c2, f2] = COLOR_STOPS[i + 1];
    if (clamped >= f1 && clamped <= f2) {
      const lt = (clamped - f1) / (f2 - f1);
      const a = hexToRgb(c1), b = hexToRgb(c2);
      return `#${lerp(a.r, b.r, lt).toString(16).padStart(2, "0")}${lerp(a.g, b.g, lt).toString(16).padStart(2, "0")}${lerp(a.b, b.b, lt).toString(16).padStart(2, "0")}`;
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
const ARC_START_COLOR = interpolateColor(0);
const START_CAP = polar(CX, CY, R_OUTER, GAUGE_START);
const SEGMENTS = 140;
const SEGMENT_STEP = GAUGE_SWEEP / SEGMENTS;
const buildGradientArc = (fill: number) => {
  const count = Math.round(fill * SEGMENTS);
  return Array.from({ length: count }, (_, i) => {
    const f0 = i / SEGMENTS;
    const start = GAUGE_START + f0 * GAUGE_SWEEP;
    const end = Math.min(GAUGE_END, start + SEGMENT_STEP * 1.6);
    return {
      path: arcPath(start, end),
      color: interpolateColor(f0 + 0.5 / SEGMENTS),
    };
  });
};

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(
    () => window.matchMedia(REDUCED_MOTION).matches
  );

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
};

export interface ScoreDialProps {
  progress: number;
  value?: number | null;
  label: string;
  accent?: string;
  tip?: string;
  caption?: string;
}

const ScoreDial = ({
  progress,
  value,
  label,
  accent,
  tip,
  caption,
}: ScoreDialProps) => {
  const uid = useId().replace(/:/g, "");
  const arcGlowId = `score-arc-glow-${uid}`;
  const markerGlowId = `score-marker-glow-${uid}`;
  const markerShadowId = `score-marker-shadow-${uid}`;

  const target = Math.max(0, Math.min(1, progress));
  const [fill, setFill] = useState(0);
  const [tipOpen, setTipOpen] = useState(false);
  const fillRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();
  // Reduced motion jumps straight to the score instead of sweeping to it.
  const shownFill = reducedMotion ? target : fill;

  useEffect(() => {
    if (reducedMotion) {
      fillRef.current = target;
      return;
    }

    let raf = 0;
    const tick = () => {
      const current = fillRef.current;
      const delta = target - current;
      if (Math.abs(delta) < 0.0004) {
        fillRef.current = target;
        setFill(target);
        return;
      }
      const next = current + delta * EASE;
      fillRef.current = next;
      setFill(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reducedMotion]);

  const needleAngle = GAUGE_START + shownFill * GAUGE_SWEEP;
  const gradientSegs = buildGradientArc(shownFill);
  const marker = polar(CX, CY, R_OUTER, needleAngle);
  const scoreValue =
    value === undefined
      ? Math.round(SCORE_MIN + shownFill * (SCORE_MAX - SCORE_MIN))
      : value;
  const accentColor = accent ?? interpolateColor(shownFill);

  const needleTip = polar(CX, CY, R_OUTER - 12, needleAngle);
  const needleReach = R_OUTER - 12;
  const needleDir = {
    x: (needleTip.x - CX) / needleReach,
    y: (needleTip.y - CY) / needleReach,
  };
  const needleHalfWidth = 5.5;
  const needlePerp = { x: -needleDir.y * needleHalfWidth, y: needleDir.x * needleHalfWidth };
  const needleBase = { x: CX + needleDir.x * HUB_RADIUS, y: CY + needleDir.y * HUB_RADIUS };
  const needlePoints = [
    `${(needleBase.x + needlePerp.x).toFixed(2)},${(needleBase.y + needlePerp.y).toFixed(2)}`,
    `${needleTip.x.toFixed(2)},${needleTip.y.toFixed(2)}`,
    `${(needleBase.x - needlePerp.x).toFixed(2)},${(needleBase.y - needlePerp.y).toFixed(2)}`,
  ].join(" ");

  return (
    <div className="relative w-full max-w-[320px] shrink-0">
      <div className="relative">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full overflow-visible"
          role="img"
          aria-label={`Credit score gauge from ${SCORE_MIN} to ${SCORE_MAX}, showing ${scoreValue ?? "no score yet"}, rated ${label}.`}
        >
          <defs>
            <filter id={arcGlowId} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <filter id={markerGlowId} x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <filter id={markerShadowId} x="-150%" y="-150%" width="400%" height="400%">
              <feDropShadow dx="0" dy="1" stdDeviation="3" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Empty track */}
          <path
            d={arcPath(GAUGE_START, GAUGE_END)}
            fill="none" stroke="#d5e5f1"
            strokeWidth={STROKE} strokeLinecap="round"
          />

          {/* Coloured bloom under the filled arc */}
          <g filter={`url(#${arcGlowId})`} opacity="0.5">
            {gradientSegs.map(({ path, color }, i) => (
              <path key={`bloom-${i}`} d={path} fill="none" stroke={color} strokeWidth={STROKE} strokeLinecap="butt" />
            ))}
          </g>

          {/* Gradient arc segments */}
          {gradientSegs.map(({ path, color }, i) => (
            <path key={i} d={path} fill="none" stroke={color} strokeWidth={STROKE} strokeLinecap="butt" />
          ))}
          {shownFill > 0 && (
            <circle cx={START_CAP.x} cy={START_CAP.y} r={STROKE / 2} fill={ARC_START_COLOR} />
          )}

          {/* Needle sweeping with the arc */}
          {shownFill > 0 && (
            <polygon
              points={needlePoints}
              fill={NEEDLE_COLOR}
              opacity="0.9"
              stroke={NEEDLE_COLOR}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          )}

          {/* Hub the needle pivots on */}
          <circle cx={CX} cy={CY} r={HUB_RADIUS} fill="#ffffff" filter={`url(#${markerShadowId})`} />
          <circle cx={CX} cy={CY} r="4.5" fill={accentColor} />

          {/* White marker on the arc */}
          <circle cx={marker.x} cy={marker.y} r="18" fill={accentColor} opacity="0.3" filter={`url(#${markerGlowId})`} />
          <circle cx={marker.x} cy={marker.y} r="10" fill="#ffffff" filter={`url(#${markerShadowId})`} />

          {/* Scale ends, sitting beside the caps in the open gap */}
          <text x="252" y="245" textAnchor="start" fontSize="13" fontWeight="600" fill="#94a3b8">
            {SCORE_MIN}
          </text>
          <text x="252" y="67" textAnchor="start" fontSize="13" fontWeight="600" fill="#94a3b8">
            {SCORE_MAX}
          </text>
        </svg>

        {/* Score, above the pivot */}
        <div
          className="pointer-events-none absolute inset-x-0 flex flex-col items-center"
          style={{ top: `${(SCORE_TOP / SVG_H) * 100}%` }}
        >
          <span
            className="text-[56px] font-bold leading-none tabular-nums"
            style={{
              color: accentColor,
              fontFamily: "var(--font-serif)",
            }}
          >
            {scoreValue === null ? "—" : scoreValue}
          </span>
        </div>

        {/* Band and comparison, below the pivot */}
        <div
          className="pointer-events-none absolute inset-x-0 flex flex-col items-center"
          style={{ top: `${(BAND_TOP / SVG_H) * 100}%` }}
        >
          <span className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Your credit score is
          </span>

          <div className="relative flex items-center gap-1.5">
            <span
              className="rounded-full px-3 py-1 text-sm font-bold text-white shadow-[0_1px_2px_rgba(15,23,42,0.12)]"
              style={{ backgroundColor: shadeColor(accentColor) }}
            >
              {label}
            </span>

            {tip && (
              <button
                type="button"
                aria-label={`What the ${label} band means`}
                aria-expanded={tipOpen}
                onMouseEnter={() => setTipOpen(true)}
                onMouseLeave={() => setTipOpen(false)}
                onFocus={() => setTipOpen(true)}
                onBlur={() => setTipOpen(false)}
                onClick={() => setTipOpen((open) => !open)}
                className="pointer-events-auto flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-[#3b9dff] transition-colors hover:text-[#6fb8ff]"
              >
                <Info className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
              </button>
            )}

            {tip && tipOpen && (
              <div className="absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 rounded-xl bg-white px-3 py-2 text-[11px] font-medium leading-relaxed text-slate-700 shadow-xl ring-1 ring-black/5">
                {tip}
              </div>
            )}
          </div>

          {caption && (
            <p className="mt-2 text-[10px] font-semibold text-(--brand-navy)">{caption}</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default ScoreDial;
