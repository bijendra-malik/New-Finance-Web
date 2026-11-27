import { tenureText } from "./term";
import type { Cap, EligibilityOutcome, ModelFamily, ProductSpec } from "./core";
import { DSCR_MIN, MIN_LOAN, creditRefusal, emiForPrincipal, holding, money, roundTo } from "./core";

// ── Lease rental discounting ──────────────────────────────────────────────────

export const LRD_LTV_MIN = 0.5;
export const LRD_LTV_MAX = 0.9;
export const LRD_DEFAULT_LTV = 0.7;
export const LRD_ROI = 10.5;
export const LRD_TENURE_YEARS = 10;
export const LRD_DEFAULT_DEDUCTION = 0.1;
export const LRD_DEFAULT_COVERAGE = 0.7;

export const presentValueOfAnnuity = (payment: number, annualRate: number, months: number): number => {
  if (payment <= 0 || months <= 0) return 0;
  const monthlyRate = annualRate / 1200;
  if (monthlyRate <= 0) return payment * months;
  return (payment * (1 - Math.pow(1 + monthlyRate, -months))) / monthlyRate;
};

export interface LrdInput {
  product: ProductSpec;
  roi?: number;
  monthlyRent: number;
  leaseMonths: number;
  propertyValue: number;
  repaymentMonths: number;
  ltvPercent?: number;
  deductionPct?: number;
  coveragePct?: number;
  creditScore?: number;
  lenderLimit?: number;
}

export const lrdEligibility = (input: LrdInput): EligibilityOutcome => {
  const { product } = input;
  const refusal = creditRefusal(input.creditScore, "Indicative lease rental loan");
  if (refusal) return refusal;

  const roi =
    input.roi !== undefined && Number.isFinite(input.roi) && input.roi >= 0 ? input.roi : product.roi;
  const rent = Math.max(0, input.monthlyRent);
  const leaseMonths = Math.max(0, Math.round(input.leaseMonths));
  const propertyValue = Math.max(0, input.propertyValue);
  const ltv = Math.min(LRD_LTV_MAX, Math.max(LRD_LTV_MIN, (input.ltvPercent || LRD_DEFAULT_LTV * 100) / 100));
  const months = Math.min(
    Math.max(0, Math.round(input.repaymentMonths)),
    leaseMonths,
    product.maxTenureMonths,
  );

  if (rent <= 0 || leaseMonths <= 0 || propertyValue <= 0 || months <= 0) {
    return holding(
      "Indicative lease rental loan",
      "Add the rent your tenant pays, the lease left to run and the property's market value, and we will value that rental stream.",
      [
        "Only a registered lease with a creditworthy tenant is discounted.",
        "Rent is discounted for the time value of money, not added up as it stands.",
      ],
    );
  }

  const deduction = Math.min(50, Math.max(0, input.deductionPct ?? LRD_DEFAULT_DEDUCTION * 100)) / 100;
  const coverage = Math.min(100, Math.max(20, input.coveragePct ?? LRD_DEFAULT_COVERAGE * 100)) / 100;
  const netRent = rent * (1 - deduction);
  const supportedEmi = netRent * coverage;
  const annualRent = rent * 12;
  const discountedRent = presentValueOfAnnuity(supportedEmi, roi, leaseMonths);
  const rentalLimit = roundTo(discountedRent, 1000);
  const propertyLimit = roundTo(propertyValue * ltv, 1000);
  const lenderLimit = Math.max(0, input.lenderLimit ?? 0);
  const caps: Cap[] = [
    { key: "lease", label: `Rent after ${Math.round(deduction * 100)}% deduction at ${Math.round(coverage * 100)}% coverage`, value: rentalLimit },
    { key: "asset", label: `${Math.round(ltv * 100)}% of the property value`, value: propertyLimit },
  ];
  if (lenderLimit > 0) {
    caps.push({ key: "lender", label: "Lender's maximum limit", value: roundTo(lenderLimit, 1000) });
  }
  const value = Math.min(...caps.map((cap) => cap.value));
  const binding = caps.reduce((lowest, cap) => (cap.value < lowest.value ? cap : lowest)).label;
  const emi = emiForPrincipal(value, roi, months);
  const lease = {
    rent,
    annualRent,
    leaseMonths,
    propertyValue,
    ltv,
    discountedRent,
    rentalLimit,
    propertyLimit,
    netRent,
    supportedEmi,
    interest: Math.max(0, Math.round(emi * months - value)),
  };
  if (value < MIN_LOAN) {
    return {
      ...holding(
        "Indicative lease rental loan",
        `On this rent, lease and property the limit comes to under ${money(MIN_LOAN)}, the smallest most lenders will sanction.`,
        ["A longer lease, a higher rent or a more valuable property supports a larger loan."],
      ),
      roi,
      months,
      lease,
    };
  }

  return {
    eligible: true,
    headline: value,
    headlineLabel: "Indicative lease rental loan",
    monthly: Math.round(emi),
    monthlyLabel: "Monthly EMI",
    roi,
    months,
    caps,
    binding,
    foir: {
      used: netRent > 0 ? emi / netRent : 0,
      headroom: Math.max(0, supportedEmi - emi),
      income: netRent,
      existing: 0,
    },
    message: `Rent of ${money(rent)} a month less a ${Math.round(deduction * 100)}% deduction leaves ${money(netRent)}; at ${Math.round(coverage * 100)}% coverage the EMI can be ${money(supportedEmi)}, which discounts to ${money(rentalLimit)} over the remaining lease at ${roi}% p.a. The ${money(propertyValue)} property caps lending at ${money(propertyLimit)}${lenderLimit > 0 ? `, and the lender's scheme caps it at ${money(lenderLimit)}` : ""}, so the estimate is ${money(value)}, repayable at about ${money(emi)} a month over ${tenureText(months)}.`,
    suggestions: [],
    lease,
  };
};

export const formulaFor = (family: ModelFamily): string => {
  switch (family) {
    case "education":
      return "Loan = course fees + hostel and living costs + other eligible expenses − scholarships − margin money";
    case "project":
      return "Loan = min(project cost − promoter contribution, principal serviced by projected cash flow at a " + `${DSCR_MIN}× DSCR)`;
    case "commercial":
      return "Loan = min(repayment capacity at the assumed FOIR, property value × LTV, DSCR limit on the rent)";
    case "turnover":
      return "Turnover method: limit = turnover × 18.75% · Working-capital method: requirement = current assets − current liabilities, financed = requirement × (1 − margin %) · Limit = min(turnover norm, financed requirement, lender cap)";
    case "wc":
      return "Turnover method: requirement = turnover × 25%, bank finance = requirement × 75% (18.75% of turnover) · Drawing power = eligible stock + eligible receivables − margin − deductions · Limit = min(turnover norm, drawing power)";
    case "lrd":
      return "Net rent = rent × (1 − deduction) · Supported EMI = net rent × coverage · Loan = min(present value of that EMI over the remaining lease, property value × LTV)"
    case "share":
      return "Loan = market value of approved shares × LTV (50%)";
    case "gold":
      return "Value = net weight × today's rate for the selected purity · Loan = value × LTV (85% ≤ ₹2.5L, 80% ≤ ₹5L, 75% above)";
    default:
      return "Loan = present value of the affordable EMI at the product rate and tenure";
  }
};
