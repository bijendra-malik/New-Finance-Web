/** Donut chart and styled range slider for the EMI calculator. */
import { T, serif } from "./emiCalculatorData";

/** Principal vs interest donut with a centre label. */
export function DonutChart({ principal, interest }: { principal: number; interest: number }) {
  const total = principal + interest;
  const pct = total === 0 ? 0 : principal / total;
  const r = 62;
  const stroke = 20;
  const c = 2 * Math.PI * r;
  const principalLen = c * pct;

  return (
    <div className="relative" style={{ width: 176, height: 176 }}>
      <svg viewBox="0 0 176 176" width="176" height="176">
        <circle cx="88" cy="88" r={r} fill="none" stroke={T.rustSoft} strokeWidth={stroke} />
        <circle
          cx="88" cy="88" r={r} fill="none"
          stroke={T.emerald} strokeWidth={stroke}
          strokeDasharray={`${principalLen} ${c - principalLen}`}
          strokeLinecap="round"
          transform="rotate(-90 88 88)"
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
      </svg>
      {/* The donut sits on the navy results panel, so its labels use light ink. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] font-semibold tracking-wide" style={{ color: T.onNavyMuted }}>Principal</span>
        <span className="text-xl font-bold text-white" style={serif}>{(pct * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
}

// ── Styled range slider ────────────────────────────────────────────────────────
export function Slider({
  value, min, max, step, onChange, color,
}: { value: number; min: number; max: number; step: number; onChange: (n: number) => void; color: string }) {
  // A typed value can sit outside the slider range (the input is not clamped),
  // so keep the fill inside the track instead of blowing past it.
  const pct = max === min ? 0 : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  return (
    <input
      type="range"
      min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="emi-slider w-full cursor-pointer"
      style={{
        // CSS custom properties must be cast — React's CSSProperties type only knows fixed property names.
        "--fill": `${pct}%`,
        "--track-color": color,
      } as React.CSSProperties}
    />
  );
}
