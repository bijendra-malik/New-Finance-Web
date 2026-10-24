// Credit-score bands: how an entered score maps to a lender-acceptable band.
// Kept free of React so the rules stay readable and testable on their own.

export const SCORE_MIN = 300;
export const SCORE_MAX = 900;

export type CreditBand = "poor" | "average" | "good" | "excellent";

export interface BandMeta {
  label: string;
  /** Typical score range for the band, as lenders describe it. */
  range: [number, number];
  /** Where the band starts and ends on the 300–900 track. */
  segment: [number, number];
  color: string;
  bg: string;
  border: string;
  blurb: string;
}

// Ordered low → high so the meter reads left to right.
export const BAND_ORDER: CreditBand[] = ["poor", "average", "good", "excellent"];

export const BAND_META: Record<CreditBand, BandMeta> = {
  poor: {
    label: "Poor",
    range: [300, 600],
    segment: [300, 600],
    color: "#b91c1c",
    bg: "rgba(185,28,28,0.08)",
    border: "rgba(185,28,28,0.35)",
    blurb: "Lenders see this as a higher-risk profile. Clearing dues and paying on time moves this band fastest.",
  },
  average: {
    label: "Average",
    range: [601, 700],
    segment: [600, 700],
    color: "#a16207",
    bg: "rgba(161,98,7,0.08)",
    border: "rgba(161,98,7,0.35)",
    blurb: "Some lenders may ask for extra documents or a co-applicant at this band.",
  },
  good: {
    label: "Good",
    range: [701, 800],
    segment: [700, 800],
    color: "#0369a1",
    bg: "rgba(3,105,161,0.08)",
    border: "rgba(3,105,161,0.35)",
    blurb: "Most lenders treat this as a low-risk profile with standard terms.",
  },
  excellent: {
    label: "Excellent",
    range: [801, 900],
    segment: [800, 900],
    color: "#0f766e",
    bg: "rgba(15,118,110,0.08)",
    border: "rgba(15,118,110,0.35)",
    blurb: "The widest lender acceptance and the best rate offers available.",
  },
};

export const bandForScore = (score: number): CreditBand => {
  if (score >= BAND_META.excellent.segment[0]) return "excellent";
  if (score >= BAND_META.good.segment[0]) return "good";
  if (score >= BAND_META.average.segment[0]) return "average";
  return "poor";
};

/** True when the value is a whole score a credit bureau could actually report. */
export const isValidScore = (value: number): boolean =>
  Number.isInteger(value) && value >= SCORE_MIN && value <= SCORE_MAX;
