import { tenureText } from "./term";
import type { Cap, EligibilityOutcome, ProductSpec } from "./core";
import { DSCR_MIN, MIN_LOAN, creditRefusal, emiForPrincipal, holding, money, principalForEmi, roundTo } from "./core";

// ── Project loans ─────────────────────────────────────────────────────────────

interface ProjectInput {
  product: ProductSpec;
  roi?: number;
  months: number;
  projectCost: number;
  promoterContribution: number;
  monthlyCashFlow: number;
  dscr?: number;
  creditScore?: number;
}

export const projectEligibility = (input: ProjectInput): EligibilityOutcome => {
  const { product } = input;
  const refusal = creditRefusal(input.creditScore, "Indicative project loan");
  if (refusal) return refusal;
  const roi =
    input.roi !== undefined && Number.isFinite(input.roi) && input.roi >= 0 ? input.roi : product.roi;
  const months = Math.min(product.maxTenureMonths, Math.max(0, Math.round(input.months)));
  const cost = Math.max(0, input.projectCost);
  const contribution = Math.max(0, input.promoterContribution);
  const cashFlow = Math.max(0, input.monthlyCashFlow);

  if (cost <= 0) {
    return holding(
      "Indicative project loan",
      "Add the total project cost and the promoter contribution, and we will work out the debt the project can carry.",
      ["Project cost covers land, construction, plant and machinery, and pre-operative expenses."],
    );
  }

  if (contribution >= cost) {
    return holding(
      "Indicative project loan",
      `A ${money(contribution)} promoter contribution covers the whole ${money(cost)} project, so there is nothing left to finance.`,
      ["Lenders still expect the promoters to fund part of the project, so check the numbers you entered."],
    );
  }

  const dscr = Math.min(3, Math.max(1, input.dscr ?? DSCR_MIN));
  const financeable = roundTo(cost - contribution, 1000);
  const caps: Cap[] = [
    { key: "cost", label: "Project cost − promoter contribution", value: financeable },
  ];
  if (cashFlow > 0 && months > 0) {
    caps.push({
      key: "dscr",
      label: `DSCR of ${dscr}× on projected cash flow`,
      value: roundTo(principalForEmi(cashFlow / dscr, roi, months), 1000),
    });
  }
  const loan = Math.min(...caps.map((cap) => cap.value));
  const binding = caps.reduce((lowest, cap) => (cap.value < lowest.value ? cap : lowest)).label;
  const emi = emiForPrincipal(loan, roi, months);

  if (loan < MIN_LOAN) {
    return {
      ...holding(
        "Indicative project loan",
        `On these figures the project supports less than ${money(MIN_LOAN)}, below the smallest project loan lenders sanction.`,
        ["A larger debt requirement or stronger projected cash flow supports a bigger loan."],
      ),
      caps,
      binding,
      roi,
      months,
    };
  }

  return {
    eligible: true,
    headline: loan,
    headlineLabel: "Indicative project loan",
    monthly: Math.round(emi),
    monthlyLabel: "Monthly EMI",
    roi,
    months,
    caps,
    binding,
    foir: null,
    message:
      cashFlow > 0
        ? `A ${money(cost)} project with ${money(contribution)} of promoter funds needs ${money(cost - contribution)}; projected cash flow of ${money(cashFlow)} a month supports ${money(loan)} at a ${dscr}× DSCR.`
        : `A ${money(cost)} project with ${money(contribution)} of promoter funds needs ${money(loan)}, repayable over ${tenureText(months)}. Add projected cash flow to test the DSCR.`,
    suggestions: [],
  };
};

