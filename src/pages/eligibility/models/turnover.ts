import type { Cap, EligibilityOutcome, ProductSpec } from "./core";
import { MIN_LOAN, WC_MARGIN, WC_TURNOVER_NORM, creditRefusal, holding, money, roundTo } from "./core";

// ── Working capital loan ──────────────────────────────────────────────────────

export interface TurnoverInput {
  product: ProductSpec;
  roi?: number;
  turnover: number;
  assessmentPct?: number;
  marginPct?: number;
  currentAssets?: number;
  currentLiabilities?: number;
  mode?: "turnover" | "workingCapital";
  lenderLimit?: number;
  existingLimit?: number;
  creditScore?: number;
}

/**
 * Turnover method: limit = turnover × assessment percentage.
 * Working-capital method: requirement = current assets − current liabilities,
 * financed amount = requirement × (1 − margin %).
 * Either way the lowest cap wins and existing facilities are deducted.
 */
export const turnoverEligibility = (input: TurnoverInput): EligibilityOutcome => {
  const { product } = input;
  const refusal = creditRefusal(input.creditScore, "Indicative working capital limit");
  if (refusal) return refusal;
  const roi =
    input.roi !== undefined && Number.isFinite(input.roi) && input.roi >= 0 ? input.roi : product.roi;
  const turnover = Math.max(0, input.turnover);
  const pct =
    input.assessmentPct && input.assessmentPct > 0
      ? Math.min(100, input.assessmentPct)
      : WC_TURNOVER_NORM * 100;
  const marginPct = Math.min(100, Math.max(0, input.marginPct ?? WC_MARGIN * 100));

  if (turnover <= 0) {
    return holding(
      "Indicative working capital limit",
      "Projected annual turnover is the starting point for a working-capital limit.",
      ["Use the turnover you expect in the next 12 months, not last year's audited figure."],
    );
  }

  const mode = input.mode === "workingCapital" ? "workingCapital" : "turnover";
  const currentAssets = Math.max(0, input.currentAssets ?? 0);
  const currentLiabilities = Math.max(0, input.currentLiabilities ?? 0);
  const hasBalanceSheet = currentAssets > 0 || currentLiabilities > 0;
  const gap = Math.max(0, currentAssets - currentLiabilities);
  const turnoverLimit = roundTo(turnover * (pct / 100), 1000);
  // Working capital requirement less the borrower's margin contribution.
  const financed = roundTo(gap * (1 - marginPct / 100), 1000);
  const lenderLimit = Math.max(0, input.lenderLimit ?? 0);
  const existingLimit = Math.max(0, input.existingLimit ?? 0);

  if (mode === "workingCapital" && !hasBalanceSheet) {
    return holding(
      "Indicative working capital limit",
      "The working-capital method needs your eligible current assets and current liabilities.",
      ["Add both figures, or switch back to the turnover method."],
    );
  }

  const caps: Cap[] = [
    { key: "turnover", label: `${Math.round(pct * 100) / 100}% of turnover`, value: turnoverLimit },
  ];
  if (mode === "workingCapital") {
    caps.push({
      key: "drawing",
      label: `Current assets − current liabilities, less ${Math.round(marginPct * 100) / 100}% margin`,
      value: financed,
    });
  }
  if (lenderLimit > 0) {
    caps.push({ key: "lender", label: "Lender's maximum limit", value: roundTo(lenderLimit, 1000) });
  }

  const grossLimit = Math.min(...caps.map((cap) => cap.value));
  const value = Math.max(0, grossLimit - existingLimit);
  const binding = caps.reduce((lowest, cap) => (cap.value < lowest.value ? cap : lowest)).label;
  const existingNote =
    existingLimit > 0
      ? ` After ${money(existingLimit)} of existing working-capital limits, ${money(value)} remains available.`
      : "";

  if (value < MIN_LOAN) {
    return {
      ...holding(
        "Indicative working capital limit",
        mode === "workingCapital"
          ? `A ${money(gap)} gap between current assets and liabilities, less a ${Math.round(marginPct * 100) / 100}% margin, supports less than the ${money(MIN_LOAN)} banks open.`
          : `A ${money(turnoverLimit)} limit on this turnover leaves less than the ${money(MIN_LOAN)} banks open after existing facilities.`,
        ["A lower margin, a higher projected turnover or a larger working-capital gap lifts the limit."],
      ),
      caps,
      binding,
      roi,
      months: 12,
    };
  }

  return {
    eligible: true,
    headline: value,
    headlineLabel: "Indicative working capital limit",
    monthly: Math.round(value * (roi / 1200)),
    monthlyLabel: "Interest at full draw",
    roi,
    months: 12,
    caps,
    binding,
    foir: null,
    message:
      (mode === "workingCapital"
        ? `Current assets of ${money(currentAssets)} less ${money(currentLiabilities)} of current liabilities leave a ${money(gap)} gap; after a ${Math.round(marginPct * 100) / 100}% margin that is ${money(financed)}, against a ${money(turnoverLimit)} turnover-based limit`
        : `A ${money(turnover)} turnover at ${Math.round(pct * 100) / 100}% supports ${money(turnoverLimit)}`) +
      (caps.length > 1 ? `. ${binding} binds it.` : ".") +
      existingNote,
    suggestions: [],
  };
};
