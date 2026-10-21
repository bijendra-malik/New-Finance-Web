import { useId, useState } from "react";
import {
  BAND_META,
  BAND_ORDER,
  SCORE_MAX,
  SCORE_MIN,
  type CreditBand,
} from "./creditScoreEvaluation";

interface CreditScoreGaugeProps {
  score: number;
  /** The customer's band for this score. */
  band: CreditBand;
  /** Extra explanation for the customer's own band, usually from the API. */
  description?: string;
}

/** Position of a score on the 300–900 track. */
const positionOf = (value: number): number =>
  ((Math.min(SCORE_MAX, Math.max(SCORE_MIN, value)) - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100;

/**
 * The segmented 300–900 meter with the customer's score marked. The band chips
 * are the interactive part: pick any band to read what it means for a lender.
 */
const CreditScoreGauge = ({ score, band, description }: CreditScoreGaugeProps) => {
  const [picked, setPicked] = useState<CreditBand | null>(null);
  const panelId = useId();
  const activeBand = picked ?? band;
  const activeMeta = BAND_META[activeBand];
  const markerLeft = positionOf(score);

  return (
    <div>
      <div className="relative mt-4">
        <div
          role="meter"
          aria-valuemin={SCORE_MIN}
          aria-valuemax={SCORE_MAX}
          aria-valuenow={score}
          aria-valuetext={`${score} out of ${SCORE_MAX}, ${BAND_META[band].label} band`}
          className="flex h-3 w-full overflow-hidden rounded-full ring-1 ring-slate-200"
        >
          {BAND_ORDER.map((segmentBand) => {
            const [from, to] = BAND_META[segmentBand].segment;
            const width = positionOf(to) - positionOf(from);
            const isActive = activeBand === segmentBand;
            return (
              <span
                key={segmentBand}
                aria-hidden="true"
                className="h-full transition-all duration-300 ease-out"
                style={{
                  width: `${width}%`,
                  background: BAND_META[segmentBand].color,
                  opacity: isActive ? 1 : 0.55,
                  boxShadow: isActive ? "inset 0 0 0 2px rgba(255,255,255,0.9)" : undefined,
                }}
              />
            );
          })}
        </div>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
          style={{
            // Clamp to half the dot so it never spills outside the track.
            left: `clamp(10px, ${markerLeft}%, calc(100% - 10px))`,
            background: BAND_META[band].color,
            transition: "left 600ms cubic-bezier(0.22,1,0.36,1)",
          }}
        />

        <div className="mt-1.5 flex justify-between text-[10.5px] font-semibold text-slate-400">
          <span>{SCORE_MIN}</span>
          <span>{SCORE_MAX}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {BAND_ORDER.map((option) => {
          const optionMeta = BAND_META[option];
          const isSelected = activeBand === option;
          const isYours = band === option;
          // The customer's own band keeps its colour even while another band is
          // being explored, so the chips stay readable at a glance.
          const style = isSelected
            ? { background: optionMeta.bg, borderColor: optionMeta.color, color: optionMeta.color }
            : isYours
              ? { background: "#fff", borderColor: optionMeta.border, color: optionMeta.color }
              : { background: "#fff", borderColor: "#e2e8f0", color: "#64748b" };
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              aria-controls={`${panelId}-detail`}
              onClick={() => setPicked(option)}
              className="rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all duration-200 hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-44)"
              style={style}
            >
              {optionMeta.label}
              {isYours && <span className="ml-1 font-medium opacity-80">· you</span>}
            </button>
          );
        })}
      </div>

      <div
        id={`${panelId}-detail`}
        aria-live="polite"
        className="mt-3 rounded-xl border p-4"
        style={{ background: activeMeta.bg, borderColor: activeMeta.border }}
      >
        <p className="text-sm font-bold" style={{ color: activeMeta.color }}>
          {`${activeMeta.label} band · ${activeMeta.range[0]}–${activeMeta.range[1]}`}
        </p>
        <p className="mt-1.5 text-[12.5px] leading-6 text-slate-600">
          {activeBand === band && description?.trim() ? description : activeMeta.blurb}
        </p>
      </div>
    </div>
  );
};

export default CreditScoreGauge;
