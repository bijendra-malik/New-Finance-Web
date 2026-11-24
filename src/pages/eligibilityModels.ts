export type ModelFamily = "term" | "gold" | "wc" | "share";
export type AssetField = "propertyValue" | "turnover" | "vehiclePrice";

export const FOIR_CAP = 0.7;
export const MIN_HEADROOM = 500;
export const MIN_LOAN = 50_000;
export const MIN_GOLD_LOAN = 10_000;
export const TURNOVER_METHOD_CAP = 5_00_00_000;

export const STOCK_MARGIN = 0.25;
export const DEBTOR_MARGIN = 0.3;

export const GOLD_LTV_SLABS = [
  { upTo: 2_50_000, ltv: 0.85 },
  { upTo: 5_00_000, ltv: 0.8 },
  { upTo: Number.POSITIVE_INFINITY, ltv: 0.75 },
] as const;

export interface ProductSpec {
  key: string;
  label: string;
  family: ModelFamily;
  roi: number;
  maxTenureMonths: number;
  asset?: { field: AssetField; label: string; hint: string; ltv: number };
  unsecured?: boolean;
}

export const PRODUCTS: readonly ProductSpec[] = [
  { key: "personal", label: "Personal Loan", family: "term", roi: 12, maxTenureMonths: 60, unsecured: true },
  {
    key: "business", label: "Business Loan", family: "term", roi: 14, maxTenureMonths: 60, unsecured: true,
    asset: { field: "turnover", label: "Annual Business Turnover", hint: "Up to 20% of annual turnover", ltv: 0.2 },
  },
  {
    key: "home", label: "Home Loan", family: "term", roi: 8, maxTenureMonths: 360,
    asset: { field: "propertyValue", label: "Property Value", hint: "Up to 90% of the property value", ltv: 0.9 },
  },
  {
    key: "lap", label: "Loan Against Property", family: "term", roi: 10.5, maxTenureMonths: 120,
    asset: { field: "propertyValue", label: "Property Value", hint: "Up to 65% of the property value", ltv: 0.65 },
  },
  {
    key: "vehicleLoan", label: "Vehicle Loan", family: "term", roi: 8, maxTenureMonths: 60,
    asset: { field: "vehiclePrice", label: "On-Road Vehicle Price", hint: "Up to 90% of the on-road price", ltv: 0.9 },
  },
  { key: "educationLoan", label: "Education Loan", family: "term", roi: 6, maxTenureMonths: 120, unsecured: true },
  {
    key: "projectLoan", label: "Project Loan", family: "term", roi: 10.5, maxTenureMonths: 60,
    asset: { field: "turnover", label: "Annual Business Turnover", hint: "Up to 25% of annual turnover", ltv: 0.25 },
  },
  {
    key: "commercialPurchase", label: "Commercial Purchase", family: "term", roi: 12, maxTenureMonths: 120,
    asset: { field: "turnover", label: "Annual Business Turnover", hint: "Up to 25% of annual turnover", ltv: 0.25 },
  },
  {
    key: "workingCapital", label: "Working Capital", family: "term", roi: 12.5, maxTenureMonths: 120,
    asset: { field: "turnover", label: "Annual Business Turnover", hint: "Up to 20% of annual turnover", ltv: 0.2 },
  },
  { key: "leaseRentalDiscounting", label: "Lease Rental Discounting", family: "term", roi: 12.5, maxTenureMonths: 120 },
  { key: "odCcLimit", label: "OD / CC Limit", family: "wc", roi: 10, maxTenureMonths: 12 },
  { key: "goldLoan", label: "Gold Loan", family: "gold", roi: 9, maxTenureMonths: 12 },
  { key: "loanAgainstShares", label: "Loan Against Shares", family: "share", roi: 11, maxTenureMonths: 120 },
];

export const productByKey = (key: string): ProductSpec =>
  PRODUCTS.find((product) => product.key === key) ?? (PRODUCTS.find((product) => product.key === "personal") as ProductSpec);

export interface Cap {
  key: "foir" | "asset" | "gold" | "turnover" | "mpbf";
  label: string;
  value: number;
}

export interface EligibilityOutcome {
  eligible: boolean;
  headline: number;
  headlineLabel: string;
  monthly: number;
  monthlyLabel: string;
  roi: number;
  months: number;
  caps: Cap[];
  binding: string | null;
  foir: { used: number; headroom: number; income: number; existing: number } | null;
  message: string;
  suggestions: string[];
  workCapital?: {
    turnoverLimit: number;
    mpbf: number;
    mpbfMethodI: number;
    mpbfMethodII: number;
    drawingPower: number;
    usable: number;
    currentRatio: number;
    currentRatioRequired: number;
  };
  gold?: { value: number; ltv: number; netWeight: number };
  credit?: { score: number; band: string; foirCap: number };
  share?: { value: number; ltv: number };
}

// ── Money maths ───────────────────────────────────────────────────────────────

export const principalForEmi = (emi: number, annualRate: number, months: number): number => {
  if (months <= 0 || emi <= 0) return 0;
  const r = annualRate / 1200;
  if (r === 0) return emi * months;
  const growth = Math.pow(1 + r, months);
  return (emi * (growth - 1)) / (r * growth);
};

export const emiForPrincipal = (principal: number, annualRate: number, months: number): number => {
  if (months <= 0 || principal <= 0) return 0;
  const r = annualRate / 1200;
  if (r === 0) return principal / months;
  const growth = Math.pow(1 + r, months);
  return (principal * r * growth) / (growth - 1);
};

const roundTo = (value: number, step: number) => Math.max(0, Math.floor(value / step) * step);

const money = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

export const goldLtvFor = (value: number): number => {
  if (value <= 0) return 0;
  const slab = GOLD_LTV_SLABS.find(({ upTo, ltv }) => value * ltv <= upTo);
  return slab ? slab.ltv : 0.75;
};

export const retirementAgeFor = (occupation: string): number =>
  occupation === "Salaried" ? 60 : 65;

export const monthsToRetirement = (age: number, occupation: string): number =>
  Math.max(0, (retirementAgeFor(occupation) - age) * 12);

const holding = (headlineLabel: string, message: string, suggestions: string[]): EligibilityOutcome => ({
  eligible: false,
  headline: 0,
  headlineLabel,
  monthly: 0,
  monthlyLabel: "Monthly EMI",
  roi: 0,
  months: 0,
  caps: [],
  binding: null,
  foir: null,
  message,
  suggestions,
});

// ── Credit score policy (unsecured loans) ─────────────────────────────────────

export const CREDIT_SCORE_FLOOR = 650;

export interface CreditPolicy {
  band: string;
  foirCap: number;
  eligible: boolean;
}

export const creditPolicyFor = (score: number): CreditPolicy | null => {
  if (!Number.isFinite(score) || score <= 0) return null;
  if (score >= 750) return { band: "750 and above, excellent", foirCap: 0.65, eligible: true };
  if (score >= 700) return { band: "700 to 749, good", foirCap: 0.55, eligible: true };
  if (score >= CREDIT_SCORE_FLOOR) return { band: "650 to 699, fair", foirCap: 0.45, eligible: true };
  return { band: `under ${CREDIT_SCORE_FLOOR}`, foirCap: 0, eligible: false };
};

// ── Term loans ────────────────────────────────────────────────────────────────

export interface TermInput {
  product: ProductSpec;
  roi?: number;
  monthlyIncome: number;
  existingEmi: number;
  age: number;
  occupation: string;
  tenureMonths: number;
  assetValue: number;
  creditScore?: number;
}

export const termEligibility = (input: TermInput): EligibilityOutcome => {
  const { product, monthlyIncome: income, existingEmi: existing, age, occupation } = input;
  const roi = input.roi && input.roi > 0 ? input.roi : product.roi;
  const credit = product.unsecured ? creditPolicyFor(input.creditScore ?? 0) : null;

  if (product.unsecured && !credit) {
    return holding(
      "Indicative loan amount",
      "Unsecured loans are assessed on your credit bureau score, so add that first.",
      ["A score of 750 or above usually gets the widest repayment room and the best rate."],
    );
  }

  if (credit && !credit.eligible) {
    return holding(
      "Indicative loan amount",
      `A score of ${Math.round(input.creditScore ?? 0)} sits below the ${CREDIT_SCORE_FLOOR} most lenders need for an unsecured loan.`,
      [
        "Clear overdue dues, keep card utilisation under 30% and check the report for errors.",
        "A secured loan on property, gold or shares is judged on the asset rather than the score.",
        "A co-applicant with a stronger bureau record can carry the application.",
      ],
    );
  }

  const foirCap = credit ? credit.foirCap : FOIR_CAP;
  const emiCap = income * foirCap;
  const headroom = Math.max(0, emiCap - existing);
  const months = Math.min(product.maxTenureMonths, input.tenureMonths, monthsToRetirement(age, occupation));

  if (income <= 0) {
    return holding(
      "Indicative loan amount",
      "Add your net monthly income and we will estimate the loan you can service.",
      ["Include only the take-home amount that reaches your bank account."],
    );
  }

  if (headroom < MIN_HEADROOM) {
    return holding(
      "Indicative loan amount",
      existing > 0
        ? `Your existing EMIs of ${money(existing)} use up the income lenders will count, leaving no room for a new one.`
        : "This income does not leave enough room for a new EMI.",
      [
        "Closing or part-pre-paying an existing loan frees up EMI headroom.",
        "A co-applicant's income can be added to the household capacity.",
      ],
    );
  }

  if (months < 12) {
    return holding(
      "Indicative loan amount",
      `Repayment has to end by age ${retirementAgeFor(occupation)}, which leaves less than a year of tenure.`,
      ["A younger co-applicant extends the repayment period lenders will allow."],
    );
  }

  const capacity = principalForEmi(headroom, roi, months);
  const caps: Cap[] = [{ key: "foir", label: "Repayment capacity", value: roundTo(capacity, 1000) }];

  if (product.asset && input.assetValue > 0) {
    caps.push({
      key: "asset",
      label: `${product.asset.label.replace("Annual ", "")} × ${Math.round(product.asset.ltv * 100)}%`,
      value: roundTo(input.assetValue * product.asset.ltv, 1000),
    });
  }

  const loan = Math.min(...caps.map((cap) => cap.value));
  const binding = caps.reduce((lowest, cap) => (cap.value < lowest.value ? cap : lowest)).label;
  const emi = emiForPrincipal(loan, roi, months);

  if (loan < MIN_LOAN) {
    return {
      ...holding(
        "Indicative loan amount",
        `On these figures the limit comes to under ${money(MIN_LOAN)}, the smallest most lenders will sanction.`,
        product.asset
          ? [`Declare a higher ${product.asset.label.toLowerCase()}, or add a co-applicant's income.`]
          : ["Adding a co-applicant's income raises the shared EMI headroom."],
      ),
      caps,
      binding,
      months,
      roi: roi,
    };
  }

  return {
    eligible: true,
    headline: loan,
    headlineLabel: "Indicative loan amount",
    monthly: Math.round(emi),
    monthlyLabel: "Monthly EMI",
    roi: roi,
    months,
    caps,
    binding,
    foir: {
      used: income > 0 ? (existing + emi) / income : 0,
      headroom: Math.max(0, headroom - emi),
      income,
      existing,
    },
    credit: credit ? { score: Math.round(input.creditScore ?? 0), band: credit.band, foirCap } : undefined,
    message: `You can service about ${money(loan)} at ${roi}% p.a. over ${tenureText(months)}.`,
    suggestions: [],
  };
};

export const tenureText = (months: number): string => {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (rest) parts.push(`${rest} ${rest === 1 ? "month" : "months"}`);
  return parts.join(" ") || "0 months";
};

// ── Gold loans ────────────────────────────────────────────────────────────────

export interface GoldInput {
  product: ProductSpec;
  roi?: number;
  grams: number;
  ratePerGram: number;
  months: number;
  monthlyIncome: number;
  existingEmi: number;
}

export const goldEligibility = (input: GoldInput): EligibilityOutcome => {
  const { product, grams, ratePerGram, monthlyIncome: income, existingEmi: existing } = input;
  const roi = input.roi && input.roi > 0 ? input.roi : product.roi;
  const months = Math.max(1, Math.min(12, Math.round(input.months) || 12));
  const netWeight = Math.max(0, grams);

  if (netWeight <= 0 || ratePerGram <= 0) {
    return holding(
      "Indicative gold loan",
      "Add the net weight of the jewellery and today's rate for its purity to value the pledge.",
      ["Net weight is gross weight minus stones, beads, thread and lac."],
    );
  }

  const value = netWeight * ratePerGram;
  const ltv = goldLtvFor(value);
  const ltvCap = roundTo(value * ltv, 1000);

  const caps: Cap[] = [{ key: "gold", label: `Gold value × ${Math.round(ltv * 100)}%`, value: ltvCap }];

  if (income > 0) {
    const headroom = Math.max(0, income * FOIR_CAP - existing);
    const capacity = roundTo(principalForEmi(headroom, roi, months), 1000);
    if (capacity > 0) caps.push({ key: "foir", label: "Repayment capacity", value: capacity });
  }

  const loan = Math.min(...caps.map((cap) => cap.value));
  const binding = caps.reduce((lowest, cap) => (cap.value < lowest.value ? cap : lowest)).label;
  const emi = emiForPrincipal(loan, roi, months);
  const foir = income > 0
    ? { used: (existing + emi) / income, headroom: Math.max(0, income * FOIR_CAP - existing - emi), income, existing }
    : null;

  if (loan < MIN_GOLD_LOAN) {
    return {
      ...holding(
        "Indicative gold loan",
        `This pledge values at ${money(value)}, which supports less than the ${money(MIN_GOLD_LOAN)} minimum gold loan.`,
        ["Pledge additional ornaments or check the rate per gram you entered."],
      ),
      caps,
      binding,
      roi: roi,
      months,
      gold: { value, ltv, netWeight },
      foir,
    };
  }

  return {
    eligible: true,
    headline: loan,
    headlineLabel: "Indicative gold loan",
    monthly: Math.round(emi),
    monthlyLabel: "Monthly EMI",
    roi: roi,
    months,
    caps,
    binding,
    foir,
    message: `${Math.round(netWeight)} g of gold values at ${money(value)}; RBI's ${Math.round(ltv * 100)}% LTV allows ${money(loan)}.`,
    suggestions: [],
    gold: { value, ltv, netWeight },
  };
};

// ── OD / CC working capital ───────────────────────────────────────────────────

export interface WorkingCapitalInput {
  product: ProductSpec;
  roi?: number;
  turnover: number;
  stock: number;
  debtors: number;
  otherCurrentLiabilities: number;
}

export const workingCapitalEligibility = (input: WorkingCapitalInput): EligibilityOutcome => {
  const { product, turnover } = input;
  const roi = input.roi && input.roi > 0 ? input.roi : product.roi;
  const stock = Math.max(0, input.stock);
  const debtors = Math.max(0, input.debtors);
  const otherCurrentLiabilities = Math.max(0, input.otherCurrentLiabilities);
  const currentAssets = stock + debtors;
  const workingCapitalGap = currentAssets - otherCurrentLiabilities;

  const turnoverLimit = roundTo(turnover * 0.2, 1000);
  const mpbfMethodI = roundTo(Math.max(0, 0.75 * workingCapitalGap), 1000);
  const mpbfMethodII = roundTo(Math.max(0, 0.75 * currentAssets - otherCurrentLiabilities), 1000);
  const mpbf = Math.min(mpbfMethodI, mpbfMethodII);
  const hasBalanceSheet = currentAssets > 0 || otherCurrentLiabilities > 0;

  if (turnover <= 0) {
    return holding(
      "Indicative OD / CC limit",
      "Projected annual turnover is the starting point for a working-capital limit.",
      ["Use the turnover you expect in the next 12 months, not last year's audited figure."],
    );
  }

  const withinTurnoverMethod = turnover <= TURNOVER_METHOD_CAP;
  const caps: Cap[] = [];

  if (withinTurnoverMethod) caps.push({ key: "turnover", label: "Turnover method (20%)", value: turnoverLimit });
  if (hasBalanceSheet && mpbf > 0) caps.push({ key: "mpbf", label: "MPBF (Tandon, 75%)", value: mpbf });

  if (caps.length === 0) {
    return holding(
      "Indicative OD / CC limit",
      `Above ${money(TURNOVER_METHOD_CAP)} of turnover, lenders move to an MPBF or cash-budget assessment — add your stock and debtors.`,
      ["Enter current assets and other current liabilities to run the MPBF method."],
    );
  }

  const limit = Math.min(...caps.map((cap) => cap.value));
  const binding = caps.reduce((lowest, cap) => (cap.value < lowest.value ? cap : lowest)).label;
  const drawingPower = roundTo(stock * (1 - STOCK_MARGIN) + debtors * (1 - DEBTOR_MARGIN), 1000);
  const usable = Math.min(drawingPower, limit);
  const currentRatio = currentAssets / (otherCurrentLiabilities + limit || 1);
  const monthlyInterest = Math.round(usable * (roi / 1200));

  if (limit < MIN_LOAN) {
    return {
      ...holding(
        "Indicative OD / CC limit",
        `These figures support less than ${money(MIN_LOAN)}, below the smallest working-capital limit banks open.`,
        ["A higher projected turnover, or stronger current assets, lifts both the turnover norm and MPBF."],
      ),
      caps,
      binding,
      roi: roi,
      months: 12,
      workCapital: {
        turnoverLimit,
        mpbf,
        mpbfMethodI,
        mpbfMethodII,
        drawingPower,
        usable,
        currentRatio,
        currentRatioRequired: 1.33,
      },
    };
  }

  return {
    eligible: true,
    headline: limit,
    headlineLabel: "Indicative sanctioned limit",
    monthly: monthlyInterest,
    monthlyLabel: "Interest at full draw",
    roi: roi,
    months: 12,
    caps,
    binding,
    foir: null,
    message: `A ${money(limit)} limit is supported by a ${money(turnover)} turnover; ${money(usable)} can be drawn today against stock and debtors.`,
    suggestions:
      currentRatio < 1.33
        ? ["A current ratio below 1.33:1 usually needs more long-term funds in the business before sanction."]
        : [],
    workCapital: {
      turnoverLimit,
      mpbf,
      mpbfMethodI,
      mpbfMethodII,
      drawingPower,
      usable,
      currentRatio,
      currentRatioRequired: 1.33,
    },
  };
};

// ── Loan against shares ───────────────────────────────────────────────────────

export const SHARE_LTV = 0.5;
export const MIN_SHARE_LOAN = 25_000;

export interface ShareInput {
  product: ProductSpec;
  roi?: number;
  marketValue: number;
  monthlyIncome: number;
  existingEmi: number;
  months: number;
}

export const shareEligibility = (input: ShareInput): EligibilityOutcome => {
  const { product, monthlyIncome: income, existingEmi: existing } = input;
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

  const caps: Cap[] = [
    { key: "asset", label: `Share value × ${Math.round(SHARE_LTV * 100)}%`, value: roundTo(value * SHARE_LTV, 1000) },
  ];

  if (income > 0) {
    const headroom = Math.max(0, income * FOIR_CAP - existing);
    const capacity = roundTo(principalForEmi(headroom, roi, months), 1000);
    if (capacity > 0) caps.push({ key: "foir", label: "Repayment capacity", value: capacity });
  }

  const loan = Math.min(...caps.map((cap) => cap.value));
  const binding = caps.reduce((lowest, cap) => (cap.value < lowest.value ? cap : lowest)).label;
  const emi = emiForPrincipal(loan, roi, months);

  if (loan < MIN_SHARE_LOAN) {
    return {
      ...holding(
        "Indicative loan against shares",
        `A ${money(value)} holding at ${Math.round(SHARE_LTV * 100)}% LTV supports less than the ${money(MIN_SHARE_LOAN)} most lenders will sanction.`,
        ["Pledge a larger holding, or add a monthly income so repayment capacity sets the limit."],
      ),
      caps,
      binding,
      roi: roi,
      months,
      share: { value, ltv: SHARE_LTV },
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
    message: `Shares worth ${money(value)} at a ${Math.round(SHARE_LTV * 100)}% LTV support ${money(loan)}, repayable over ${tenureText(months)}.`,
    suggestions: [],
    share: { value, ltv: SHARE_LTV },
  };
};

export const formulaFor = (family: ModelFamily): string => {
  switch (family) {
    case "share":
      return "Loan = market value of approved shares × LTV (50%)";
    case "gold":
      return "Value = net weight × today's rate for the selected purity · Loan = value × LTV (85% ≤ ₹2.5L, 80% ≤ ₹5L, 75% above)";
    case "wc":
      return "Turnover limit = 20% of turnover · MPBF = min(75% × WC gap, 75% × current assets − other CL) · Drawing power on paid stock and eligible debtors";
    default:
      return "Loan = present value of the affordable EMI at the product rate and tenure";
  }
};
