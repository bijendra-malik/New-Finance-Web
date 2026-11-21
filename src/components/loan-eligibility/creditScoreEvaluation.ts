export const SCORE_MIN = 300;
export const SCORE_MAX = 900;

export type CreditBand = "poor" | "average" | "good" | "excellent";

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
    range: [300, 549],
    segment: [300, 550],
    color: "#b91c1c",
    bg: "rgba(185,28,28,0.08)",
    border: "rgba(185,28,28,0.35)",
    blurb:
      "Indicates late payments, defaults, or high credit risk, making new credit harder to get.",
  },
  average: {
    label: "an Average",
    shortLabel: "Average",
    range: [550, 649],
    segment: [550, 650],
    color: "#a16207",
    bg: "rgba(161,98,7,0.08)",
    border: "rgba(161,98,7,0.35)",
    blurb:
      "Signals past repayment strain, higher credit utilization, or a thin file; lenders may charge higher interest or require collateral/guarantors.",
  },
  good: {
    label: "a Good",
    shortLabel: "Good",
    range: [650, 749],
    segment: [650, 750],
    color: "#0369a1",
    bg: "rgba(3,105,161,0.08)",
    border: "rgba(3,105,161,0.35)",
    blurb:
      "Often considered moderate to good depending on the lender and bureau; approval may still be possible, though terms or interest rates can vary.",
  },
  excellent: {
    label: "an Excellent",
    shortLabel: "Excellent",
    range: [750, 900],
    segment: [750, 900],
    color: "#0f766e",
    bg: "rgba(15,118,110,0.08)",
    border: "rgba(15,118,110,0.35)",
    blurb:
      "Generally viewed as strong creditworthiness across major Indian bureaus (CIBIL, Experian, CRIF High Mark, Equifax), helping with faster approvals and lower interest rates.",
  },
};

export const bandForScore = (score: number): CreditBand => {
  if (score >= BAND_META.excellent.segment[0]) return "excellent";
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
