export const SCORE_MIN = 300;
export const SCORE_MAX = 900;

export type CreditBand = "poor" | "average" | "good" | "veryGood" | "excellent";

export interface BandMeta {
  label: string;
  shortLabel: string;
  range: [number, number];
  segment: [number, number];
  color: string;
  bg: string;
  border: string;
  blurb: string;
}

export const BAND_META: Record<CreditBand, BandMeta> = {
  poor: {
    label: "a Poor",
    shortLabel: "Poor",
    range: [300, 600],
    segment: [300, 600],
    color: "#b91c1c",
    bg: "rgba(185,28,28,0.08)",
    border: "rgba(185,28,28,0.35)",
    blurb: "Lenders see this as a higher-risk profile. Clearing dues and paying on time moves this band fastest.",
  },
  average: {
    label: "an Average",
    shortLabel: "Average",
    range: [601, 700],
    segment: [600, 700],
    color: "#a16207",
    bg: "rgba(161,98,7,0.08)",
    border: "rgba(161,98,7,0.35)",
    blurb: "Some lenders may ask for extra documents or a co-applicant at this band.",
  },
  good: {
    label: "a Good",
    shortLabel: "Good",
    range: [701, 749],
    segment: [700, 750],
    color: "#0369a1",
    bg: "rgba(3,105,161,0.08)",
    border: "rgba(3,105,161,0.35)",
    blurb: "Most lenders treat this as a low-risk profile with standard terms.",
  },
  veryGood: {
    label: "a Very Good",
    shortLabel: "Very Good",
    range: [750, 799],
    segment: [750, 800],
    color: "#0e7490",
    bg: "rgba(14,116,144,0.08)",
    border: "rgba(14,116,144,0.35)",
    blurb: "A strong profile — most lenders offer competitive terms without extra conditions.",
  },
  excellent: {
    label: "an Excellent",
    shortLabel: "Excellent",
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
  if (score >= BAND_META.veryGood.segment[0]) return "veryGood";
  if (score >= BAND_META.good.segment[0]) return "good";
  if (score >= BAND_META.average.segment[0]) return "average";
  return "poor";
};

export interface ScoreRating {
  label: string;
  color: string;
  tip: string;
}

export const ratingForScore = (score: number): ScoreRating => {
  const meta = BAND_META[bandForScore(score)];
  return { label: meta.shortLabel, color: meta.color, tip: meta.blurb };
};

export const isValidScore = (value: number): boolean =>
  Number.isInteger(value) && value >= SCORE_MIN && value <= SCORE_MAX;
