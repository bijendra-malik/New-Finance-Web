// Credit-score bands and the eligibility verdict the post-submission check shows.
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

export const normalizeBand = (raw?: string): CreditBand | null => {
  const normalized = (raw ?? "").toLowerCase().trim();
  if (!normalized) return null;
  if (BAND_ORDER.includes(normalized as CreditBand)) return normalized as CreditBand;
  if (normalized.startsWith("excellent")) return "excellent";
  if (normalized.startsWith("good")) return "good";
  if (normalized.startsWith("average") || normalized.startsWith("fair")) return "average";
  if (normalized.startsWith("poor") || normalized.startsWith("low") || normalized.startsWith("bad")) return "poor";
  return null;
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

export type VerdictKey = "eligible" | "likely" | "review" | "not-eligible";

export interface VerdictMeta {
  label: string;
  headline: string;
  color: string;
  bg: string;
  border: string;
  icon: string;
}

export const VERDICT_META: Record<VerdictKey, VerdictMeta> = {
  eligible: {
    label: "Eligible",
    headline: "You're eligible for this loan",
    color: "#0f766e",
    bg: "#ecfdf5",
    border: "#6ee7b7",
    icon: "✓",
  },
  likely: {
    label: "Likely eligible",
    headline: "You're likely to be eligible",
    color: "#0369a1",
    bg: "#f0f9ff",
    border: "#bae6fd",
    icon: "✓",
  },
  review: {
    label: "Needs a review",
    headline: "Your application needs a closer look",
    color: "#a16207",
    bg: "#fffbeb",
    border: "#fde68a",
    icon: "!",
  },
  "not-eligible": {
    label: "Not eligible yet",
    headline: "This score is below our cut-off",
    color: "#b91c1c",
    bg: "#fef2f2",
    border: "#fecaca",
    icon: "✕",
  },
};

export interface CreditScoreEvaluation {
  score: number;
  band: CreditBand;
  verdict: VerdictKey;
  headline: string;
  detail: string;
  steps: string[];
}

/**
 * Turns an entered score into a verdict. Thresholds are the ones shown to
 * customers: 750+ is a strong match, 700–749 is usually accepted, 650–699 needs
 * underwriting, and anything lower falls short of the lender cut-off.
 */
export const evaluateCreditScore = (score: number, product = "this loan"): CreditScoreEvaluation => {
  const band = bandForScore(score);
  const bandLabel = BAND_META[band].label;

  if (score >= 750) {
    return {
      score,
      band,
      verdict: "eligible",
      headline: VERDICT_META.eligible.headline,
      detail: `A score of ${score} sits in the ${bandLabel} band — a strong match for ${product} across our lender panel.`,
      steps: [
        "Our team will call you within one working day to confirm the offer.",
        "Keep your PAN, address proof and last three salary slips ready.",
        "Avoid applying with several lenders at once — it can pull your score down.",
      ],
    };
  }

  if (score >= 700) {
    return {
      score,
      band,
      verdict: "likely",
      headline: VERDICT_META.likely.headline,
      detail: `At ${score} (${bandLabel} band), most lenders will consider your application, though the rate may be slightly higher than the best advertised one.`,
      steps: [
        "Expect a call from our team to confirm which lender fits your profile.",
        "A co-applicant with a higher score can improve the terms you are offered.",
        "Bring your latest salary slips and bank statements to the call.",
      ],
    };
  }

  if (score >= 650) {
    return {
      score,
      band,
      verdict: "review",
      headline: VERDICT_META.review.headline,
      detail: `A score of ${score} (${bandLabel} band) means lenders may ask for a co-applicant, a larger down payment or extra documents before approving ${product}.`,
      steps: [
        "Our team will review your application and tell you what else is needed.",
        "Adding a co-applicant with a stronger score usually helps at this band.",
        "Clear any overdue card or loan payments before the review call.",
      ],
    };
  }

  return {
    score,
    band,
    verdict: "not-eligible",
    headline: VERDICT_META["not-eligible"].headline,
    detail: `A score of ${score} (${bandLabel} band) is below the cut-off our lenders usually approve for ${product}.`,
    steps: [
      "Pay every EMI and card bill on time for the next six months.",
      "Bring card utilisation below 30% of your limit.",
      "Avoid new loan applications for a few months, then check your score again.",
    ],
  };
};
