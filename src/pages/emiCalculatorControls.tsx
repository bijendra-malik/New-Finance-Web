
// ── Styled range slider ────────────────────────────────────────────────────────
export function Slider({
  value, min, max, step, onChange, color,
}: { value: number; min: number; max: number; step: number; onChange: (n: number) => void; color: string }) {
  const pct = max === min ? 0 : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  return (
    <input
      type="range"
      min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="emi-slider w-full cursor-pointer"
      style={{
        "--fill": `${pct}%`,
        "--track-color": color,
      } as React.CSSProperties}
    />
  );
}
