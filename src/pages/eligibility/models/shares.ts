import { tenureText } from "./term";
import type { Cap, EligibilityOutcome, ProductSpec } from "./core";
import { FOIR_CAP, MIN_HEADROOM, creditRefusal, emiForPrincipal, holding, money, principalForEmi, roundTo } from "./core";

// ── Loan against shares ───────────────────────────────────────────────────────

/** Default funding against pledged shares; RBI caps individual loans at 60%. */
export const SHARE_LTV = 0.5;
const SHARE_LTV_MAX = 0.6;
const SHARE_LTV_MIN = 0.2;
const MIN_SHARE_LOAN = 25_000;

interface ShareInput {
  product: ProductSpec;
  roi?: number;
  marketValue: number;
  monthlyIncome: number;
  existingEmi: number;
  months: number;
  creditScore?: number;
  ltvPct?: number;
  lenderLimit?: number;
  existingExposure?: number;
}

export const shareEligibility = (input: ShareInput): EligibilityOutcome => {
  const { product, monthlyIncome: income, existingEmi: existing } = input;
  const refusal = creditRefusal(input.creditScore, "Indicative loan against shares");
  if (refusal) return refusal;
  const roi = input.roi && input.roi > 0 ? input.roi : product.roi;
  const months = Math.max(6, Math.min(product.maxTenureMonths, Math.round(input.months) || product.maxTenureMonths));
  const value = Math.max(0, input.marketValue);

  if (value <= 0) {
    return holding(
      "Indicative loan against shares",
      "Add the market value of the shares you will pledge to see the limit they support.",
      ["Only approved, fully paid-up listed shares are accepted as security."],
    );
  }

  const ltv = Math.min(SHARE_LTV_MAX, Math.max(SHARE_LTV_MIN, (input.ltvPct ?? SHARE_LTV * 100) / 100));
  const lenderLimit = Math.max(0, input.lenderLimit ?? 0);
  const exposure = Math.max(0, input.existingExposure ?? 0);

  const caps: Cap[] = [
    { key: "asset", label: `Pledged shares × ${Math.round(ltv * 100)}%`, value: roundTo(value * ltv, 1000) },
  ];

  if (lenderLimit > 0) {
    caps.push({ key: "lender", label: "Lender's maximum limit", value: roundTo(lenderLimit, 1000) });
  }

  if (income > 0) {
    const headroom = Math.max(0, income * FOIR_CAP - existing);
    const capacity = roundTo(principalForEmi(headroom, roi, months), 1000);
    if (capacity > 0) caps.push({ key: "foir", label: "Repayment capacity", value: capacity });
  }

  const grossLoan = Math.min(...caps.map((cap) => cap.value));
  const loan = Math.max(0, grossLoan - exposure);
  const binding = caps.reduce((lowest, cap) => (cap.value < lowest.value ? cap : lowest)).label;
  const emi = emiForPrincipal(loan, roi, months);

  if (existing > 0 && income <= 0) {
    return holding(
      "Indicative loan against shares",
      "You have other EMIs on record but no income — add your Monthly Net Income so we can weigh them, or clear the EMI field.",
      ["Lenders check that the total EMI bill, including this loan, fits within your income."],
    );
  }

  if (income > 0 && income * FOIR_CAP - existing < MIN_HEADROOM) {
    return holding(
      "Indicative loan against shares",
      existing > 0
        ? `Other EMIs of ${money(existing)} already use up the ${money(income * FOIR_CAP)} of income a lender will count, so this loan cannot be serviced.`
        : "This income does not leave enough room for a new EMI.",
      [
        "Closing or part-pre-paying an existing loan frees up room for a share-backed loan.",
        "Leave the income and EMI fields blank to value the loan on the shares alone.",
      ],
    );
  }

  if (loan < MIN_SHARE_LOAN) {
    return {
      ...holding(
        "Indicative loan against shares",
        exposure > 0 && grossLoan >= MIN_SHARE_LOAN
          ? `These shares support ${money(grossLoan)}, and ${money(exposure)} of existing exposure is already drawn against them.`
          : `A ${money(value)} holding at ${Math.round(ltv * 100)}% LTV supports less than the ${money(MIN_SHARE_LOAN)} most lenders will sanction.`,
        ["Pledge a larger holding, or add a Monthly Net Income so repayment capacity sets the limit."],
      ),
      caps,
      binding,
      roi: roi,
      months,
      share: { value, ltv, gross: grossLoan, existingExposure: exposure },
    };
  }

  return {
    eligible: true,
    headline: loan,
    headlineLabel: "Indicative loan against shares",
    monthly: Math.round(emi),
    monthlyLabel: "Monthly EMI",
    roi: roi,
    months,
    caps,
    binding,
    foir: income > 0
      ? { used: (existing + emi) / income, headroom: Math.max(0, income * FOIR_CAP - existing - emi), income, existing }
      : null,
    message:
      exposure > 0
        ? `Shares worth ${money(value)} at a ${Math.round(ltv * 100)}% LTV support ${money(grossLoan)}; after ${money(exposure)} of existing exposure, ${money(loan)} remains, repayable over ${tenureText(months)}.`
        : `Shares worth ${money(value)} at a ${Math.round(ltv * 100)}% LTV support ${money(loan)}, repayable over ${tenureText(months)}.`,
    suggestions: [],
    share: { value, ltv, gross: grossLoan, existingExposure: exposure },
  };
};

