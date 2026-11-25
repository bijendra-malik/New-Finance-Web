export type ModelFamily =
  | "term"
  | "gold"
  | "wc"
  | "share"
  | "lrd"
  | "education"
  | "project"
  | "commercial"
  | "turnover";
export type AssetField = "propertyValue" | "turnover" | "vehiclePrice";

export const FOIR_CAP = 0.7;
export const EDUCATION_FOIR_CAP = 0.7;
export const VEHICLE_FOIR = 0.5;
export const VEHICLE_LTV = 0.9;
export const MIN_HEADROOM = 500;
export const MIN_LOAN = 50_000;
export const MIN_GOLD_LOAN = 10_000;
export const TURNOVER_METHOD_CAP = 5_00_00_000;

export const STOCK_MARGIN = 0.25;
export const DEBTOR_MARGIN = 0.3;
export const RENTAL_HAIRCUT = 0.75;

export const DSCR_MIN = 1.25;
export const COMMERCIAL_LTV = 0.7;
export const WC_ASSESSMENT_PCT = 0.2;
export const WC_TURNOVER_REQUIREMENT = 0.25;
export const WC_BANK_SHARE = 0.75;
export const WC_TURNOVER_NORM = WC_TURNOVER_REQUIREMENT * WC_BANK_SHARE;

export const HOME_LTV_SLABS = [
  { upTo: 30_00_000, ltv: 0.9 },
  { upTo: 75_00_000, ltv: 0.8 },
  { upTo: Number.POSITIVE_INFINITY, ltv: 0.75 },
] as const;

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
  maturityAge?: number;
  asset?: {
    field: AssetField;
    label: string;
    hint: string;
    ltv: number;
    ltvSlabs?: readonly { upTo: number; ltv: number }[];
    ltvByType?: Readonly<Record<string, number>>;
    ltvForOtherType?: number;
    cityAdjustment?: Readonly<Record<string, number>>;
  };
  unsecured?: boolean;
}

export const PRODUCTS: readonly ProductSpec[] = [
  { key: "personal", label: "Personal Loan", family: "term", roi: 12, maxTenureMonths: 60, unsecured: true },
  { key: "business", label: "Business Loan", family: "term", roi: 14, maxTenureMonths: 60, unsecured: true },
  {
    key: "home", label: "Home Loan", family: "term", roi: 8, maxTenureMonths: 360, maturityAge: 70,
    asset: {
      field: "propertyValue",
      label: "Property Market Value",
      hint: "Up to 90% of the property market value",
      ltv: 0.9,
      ltvSlabs: HOME_LTV_SLABS,
    },
  },
  {
    key: "lap", label: "Loan Against Property", family: "term", roi: 10.5, maxTenureMonths: 120,
    asset: {
      field: "propertyValue",
      label: "Property Market Value",
      hint: "Up to 65% of the property market value",
      ltv: 0.65,
      ltvByType: { Residential: 0.8, Commercial: 0.7, Industrial: 0.65 },
      ltvForOtherType: 0.7,
      cityAdjustment: { A: 0, B: 0.05, C: 0.1 },
    },
  },
  {
    key: "vehicleLoan", label: "Vehicle Loan", family: "term", roi: 8, maxTenureMonths: 60,
    asset: { field: "vehiclePrice", label: "On-Road Vehicle Price", hint: "Up to 90% of the on-road price", ltv: 0.9 },
  },
  { key: "educationLoan", label: "Education Loan", family: "education", roi: 6, maxTenureMonths: 120, unsecured: true },
  { key: "projectLoan", label: "Project Loan", family: "project", roi: 10.5, maxTenureMonths: 60 },
  { key: "commercialPurchase", label: "Commercial Purchase", family: "commercial", roi: 12, maxTenureMonths: 120 },
  { key: "workingCapital", label: "Working Capital", family: "turnover", roi: 12.5, maxTenureMonths: 12 },
  { key: "leaseRentalDiscounting", label: "Lease Rental Discounting", family: "lrd", roi: 10.5, maxTenureMonths: 120 },
  { key: "odCcLimit", label: "OD / CC Limit", family: "wc", roi: 10, maxTenureMonths: 12 },
  { key: "goldLoan", label: "Gold Loan", family: "gold", roi: 9, maxTenureMonths: 12 },
  { key: "loanAgainstShares", label: "Loan Against Shares", family: "share", roi: 11, maxTenureMonths: 120 },
];

export const productByKey = (key: string): ProductSpec =>
  PRODUCTS.find((product) => product.key === key) ?? (PRODUCTS.find((product) => product.key === "personal") as ProductSpec);

export interface Cap {
  key: "foir" | "asset" | "gold" | "turnover" | "mpbf" | "lease" | "cost" | "dscr" | "drawing";
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
  lease?: {
    rent: number;
    annualRent: number;
    leaseMonths: number;
    propertyValue: number;
    ltv: number;
    discountedRent: number;
    rentalLimit: number;
    propertyLimit: number;
    netRent?: number;
    supportedEmi?: number;
    interest: number;
  };
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

export const assetLtvFor = (
  asset: NonNullable<ProductSpec["asset"]>,
  value: number,
  type?: string,
  city?: string,
): number => {
  let ltv = asset.ltv;
  if (type && asset.ltvByType) {
    ltv =
      asset.ltvByType[type] ??
      asset.ltvForOtherType ??
      Math.min(...Object.values(asset.ltvByType));
  }
  if (asset.ltvSlabs && value > 0) {
    const slab = asset.ltvSlabs.find(({ upTo, ltv: slabLtv }) => value * slabLtv <= upTo);
    if (slab) ltv = slab.ltv;
  }
  if (city && asset.cityAdjustment) ltv -= asset.cityAdjustment[city] ?? 0;
  return Math.max(0.3, ltv);
};

export const goldLtvFor = (value: number): number => {
  if (value <= 0) return 0;
  const slab = GOLD_LTV_SLABS.find(({ upTo, ltv }) => value * ltv <= upTo);
  return slab ? slab.ltv : 0.75;
};

export const retirementAgeFor = (occupation: string): number =>
  occupation === "Salaried" ? 60 : 65;

export const monthsToRetirement = (age: number, occupation: string): number =>
  Math.max(0, (retirementAgeFor(occupation) - age) * 12);

export const maturityAgeFor = (product: ProductSpec, occupation: string): number =>
  product.maturityAge ?? retirementAgeFor(occupation);

export const monthsToMaturity = (age: number, product: ProductSpec, occupation: string): number =>
  Math.max(0, (maturityAgeFor(product, occupation) - age) * 12);

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
  securedFoirCap: number;
  eligible: boolean;
}

export const creditPolicyFor = (score: number): CreditPolicy | null => {
  if (!Number.isFinite(score) || score <= 0) return null;
  if (score >= 750) return { band: "750 and above, excellent", foirCap: 0.65, securedFoirCap: 0.7, eligible: true };
  if (score >= 700) return { band: "700 to 749, good", foirCap: 0.55, securedFoirCap: 0.65, eligible: true };
  if (score >= CREDIT_SCORE_FLOOR) return { band: "650 to 699, fair", foirCap: 0.45, securedFoirCap: 0.6, eligible: true };
  return { band: `under ${CREDIT_SCORE_FLOOR}`, foirCap: 0, securedFoirCap: 0, eligible: false };
};

export const creditRefusal = (
  score: number | undefined,
  headlineLabel: string,
): EligibilityOutcome | null => {
  const policy = creditPolicyFor(score ?? 0);
  if (!policy) {
    return holding(
      headlineLabel,
      "Add your credit bureau score and we will estimate the loan you can service.",
      ["A score of 750 or above usually gets the widest repayment room and the best rate."],
    );
  }
  if (!policy.eligible) {
    return holding(
      headlineLabel,
      `A score of ${Math.round(score ?? 0)} sits below the ${CREDIT_SCORE_FLOOR} most lenders need to sanction a loan.`,
      [
        "Clear overdue dues, keep card utilisation under 30% and check the report for errors.",
        "A secured loan on property, gold or shares is judged on the asset rather than the score.",
      ],
    );
  }
  return null;
};

// ── Term loans ────────────────────────────────────────────────────────────────

export interface TermInput {
  product: ProductSpec;
  roi?: number;
  monthlyIncome: number;
  existingEmi: number;
  foirPct?: number;
  ltvPct?: number;
  assetType?: string;
  cityCategory?: string;
  existingLoanOnAsset?: number;
  rentalIncome?: number;
  age: number;
  occupation: string;
  tenureMonths: number;
  assetValue: number;
  downPayment?: number;
  creditScore?: number;
}

export const termEligibility = (input: TermInput): EligibilityOutcome => {
  const { product, monthlyIncome, existingEmi, age, occupation } = input;
  const isVehicle = product.key === "vehicleLoan";
  const rental = Math.max(0, input.rentalIncome ?? 0) * RENTAL_HAIRCUT;
  const income = monthlyIncome + rental;
  const existing = existingEmi;
  const roi = input.roi && input.roi > 0 ? input.roi : product.roi;
  const credit = creditPolicyFor(input.creditScore ?? 0);

  if (!credit) {
    return holding(
      "Indicative loan amount",
      "Add your credit bureau score and we will estimate the loan you can service.",
      ["A score of 750 or above usually gets the widest repayment room and the best rate."],
    );
  }

  if (!credit.eligible) {
    return holding(
      "Indicative loan amount",
      `A score of ${Math.round(input.creditScore ?? 0)} sits below the ${CREDIT_SCORE_FLOOR} most lenders need to sanction a loan.`,
      [
        "Clear overdue dues, keep card utilisation under 30% and check the report for errors.",
        "A secured loan on property, gold or shares is judged on the asset rather than the score.",
      ],
    );
  }

  const vehicleFoirPct = Math.min(80, Math.max(20, input.foirPct ?? VEHICLE_FOIR * 100));
  const foirCap = isVehicle
    ? vehicleFoirPct / 100
    : product.unsecured
      ? credit.foirCap
      : credit.securedFoirCap;
  const emiCap = income * foirCap;
  const headroom = Math.max(0, emiCap - existing);
  const months = Math.min(product.maxTenureMonths, input.tenureMonths, monthsToMaturity(age, product, occupation));

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
      ],
    );
  }

  if (months <= 0) {
    return holding(
      "Indicative loan amount",
      `Repayment has to end by age ${maturityAgeFor(product, occupation)}, and at your age there is no tenure left.`,
      ["Most lenders will not sanction a fresh loan of this type at your age."],
    );
  }

  if (months < 12) {
    return holding(
      "Indicative loan amount",
      `Repayment has to end by age ${maturityAgeFor(product, occupation)}, which leaves less than a year of tenure.`,
      ["A smaller loan amount can still be repaid within the time left."],
    );
  }

  const capacity = principalForEmi(headroom, roi, months);
  const caps: Cap[] = [{ key: "foir", label: "Repayment capacity", value: roundTo(capacity, 1000) }];

  if (product.asset && input.assetValue > 0) {
    const vehicleLtvPct = Math.min(100, Math.max(50, input.ltvPct ?? VEHICLE_LTV * 100));
    const effectiveLtv = isVehicle
      ? vehicleLtvPct / 100
      : assetLtvFor(product.asset, input.assetValue, input.assetType, input.cityCategory);
    let secured = Math.max(0, input.assetValue * effectiveLtv - Math.max(0, input.existingLoanOnAsset ?? 0));
    let assetLabel = `${product.asset.label.replace("Annual ", "")} × ${Math.round(effectiveLtv * 100)}%`;
    if (product.asset.field === "vehiclePrice") {
      const afterDownPayment = Math.max(0, input.assetValue - Math.max(0, input.downPayment ?? 0));
      if (afterDownPayment < secured) {
        secured = afterDownPayment;
        assetLabel = "On-road price less down payment";
      }
    }
    caps.push({
      key: "asset",
      label: assetLabel,
      value: roundTo(secured, 1000),
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
          ? [`Declare a higher ${product.asset.label.toLowerCase()}.`]
          : ["A smaller loan amount brings the EMI within reach."],
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
  creditScore?: number;
}

export const goldEligibility = (input: GoldInput): EligibilityOutcome => {
  const { product, grams, ratePerGram, monthlyIncome: income, existingEmi: existing } = input;
  const refusal = creditRefusal(input.creditScore, "Indicative gold loan");
  if (refusal) return refusal;
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

  if (existing > 0 && income <= 0) {
    return holding(
      "Indicative gold loan",
      "You have other EMIs on record but no income — add your monthly income so we can weigh them, or clear the EMI field.",
      ["Lenders check that the total EMI bill, including this loan, fits within your income."],
    );
  }

  if (income > 0 && income * FOIR_CAP - existing < MIN_HEADROOM) {
    return holding(
      "Indicative gold loan",
      existing > 0
        ? `Other EMIs of ${money(existing)} already use up the ${money(income * FOIR_CAP)} of income a lender will count, so this loan cannot be serviced.`
        : "This income does not leave enough room for a new EMI.",
      [
        "Closing or part-pre-paying an existing loan frees up room for a gold loan.",
        "Leave the income and EMI fields blank to value the loan on the gold alone.",
      ],
    );
  }

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
  /** Borrower's margin deducted from drawing power. */
  margin?: number;
  /** Defaults to the turnover method; drawing power is the stricter alternative. */
  mode?: "turnover" | "drawingPower";
  creditScore?: number;
}

export const workingCapitalEligibility = (input: WorkingCapitalInput): EligibilityOutcome => {
  const { product, turnover } = input;
  const refusal = creditRefusal(input.creditScore, "Indicative drawing power");
  if (refusal) return refusal;
  const roi = input.roi && input.roi > 0 ? input.roi : product.roi;
  const stock = Math.max(0, input.stock);
  const debtors = Math.max(0, input.debtors);
  const otherCurrentLiabilities = Math.max(0, input.otherCurrentLiabilities);
  const currentAssets = stock + debtors;
  const workingCapitalGap = currentAssets - otherCurrentLiabilities;

  const margin = Math.max(0, input.margin ?? 0);
  const mode = input.mode === "drawingPower" ? "drawingPower" : "turnover";
  const turnoverLimit = roundTo(turnover * WC_TURNOVER_NORM, 1000);
  const drawingPower = roundTo(
    Math.max(0, stock * (1 - STOCK_MARGIN) + debtors * (1 - DEBTOR_MARGIN) - margin),
    1000,
  );
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

  if (mode === "drawingPower" && !hasBalanceSheet) {
    return holding(
      "Indicative OD / CC limit",
      "The drawing-power method needs the stock and receivables the bank can charge.",
      ["Add your stock and payments due from customers, or switch back to the turnover method."],
    );
  }

  const caps: Cap[] = [
    { key: "turnover", label: `Turnover method (${Math.round(WC_TURNOVER_NORM * 10000) / 100}%)`, value: turnoverLimit },
  ];
  if (mode === "drawingPower") {
    caps.push({ key: "drawing", label: "Drawing power on stock and receivables", value: drawingPower });
  }

  const limit = Math.min(...caps.map((cap) => cap.value));
  const binding = caps.reduce((lowest, cap) => (cap.value < lowest.value ? cap : lowest)).label;
  const usable = hasBalanceSheet ? Math.min(drawingPower, limit) : limit;
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
    message:
      mode === "drawingPower"
        ? `The ${money(limit)} limit is the lower of the turnover norm (${money(turnoverLimit)}) and the ${money(drawingPower)} drawing power on stock and receivables after ${money(margin)} of margin.`
        : `A ${money(limit)} limit is ${Math.round(WC_TURNOVER_NORM * 10000) / 100}% of your ${money(turnover)} turnover${hasBalanceSheet ? `, with ${money(usable)} drawable against stock and debtors` : ""}.`,
    suggestions: [
      ...(hasBalanceSheet && currentRatio < 1.33
        ? ["A current ratio below 1.33:1 usually needs more long-term funds in the business before sanction."]
        : []),
      ...(!withinTurnoverMethod
        ? [`Above ${money(TURNOVER_METHOD_CAP)} of turnover the turnover norm is only indicative; banks usually assess such cases on MPBF or a cash budget.`]
        : []),
    ],
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
  creditScore?: number;
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

  if (existing > 0 && income <= 0) {
    return holding(
      "Indicative loan against shares",
      "You have other EMIs on record but no income — add your monthly income so we can weigh them, or clear the EMI field.",
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

// ── Education loans ───────────────────────────────────────────────────────────

export interface EducationInput {
  product: ProductSpec;
  roi?: number;
  months: number;
  courseFees: number;
  hostelCost: number;
  otherCost: number;
  scholarships: number;
  marginMoney: number;
  coApplicantIncome?: number;
  existingEmi?: number;
  creditScore?: number;
}

export const educationEligibility = (input: EducationInput): EligibilityOutcome => {
  const { product } = input;
  const refusal = creditRefusal(input.creditScore, "Indicative education loan");
  if (refusal) return refusal;
  const roi =
    input.roi !== undefined && Number.isFinite(input.roi) && input.roi >= 0 ? input.roi : product.roi;
  const months = Math.min(product.maxTenureMonths, Math.max(0, Math.round(input.months)));
  const fees = Math.max(0, input.courseFees);
  const hostel = Math.max(0, input.hostelCost);
  const other = Math.max(0, input.otherCost);
  const scholarships = Math.max(0, input.scholarships);
  const margin = Math.max(0, input.marginMoney);
  const cost = fees + hostel + other;

  if (cost <= 0) {
    return holding(
      "Indicative education loan",
      "Add the course fees for the programme, and any hostel or other eligible costs, and we will work out what can be borrowed.",
      [
        "Tuition, hostel and living costs count when they are part of the course.",
        "Scholarships and the margin your family funds are deducted before the loan is worked out.",
      ],
    );
  }

  if (months <= 0) {
    return holding(
      "Indicative education loan",
      "There is no repayment tenure left for this applicant.",
      ["Lenders need the loan repaid within the tenure they allow for education loans."],
    );
  }

  const claim = Math.max(0, cost - scholarships);
  const value = roundTo(Math.max(0, claim - margin), 1000);

  const income = Math.max(0, input.coApplicantIncome ?? 0);
  const existing = Math.max(0, input.existingEmi ?? 0);
  const headroom = income > 0 ? Math.max(0, income * EDUCATION_FOIR_CAP - existing) : 0;
  const capacity = income > 0 ? roundTo(principalForEmi(headroom, roi, months), 1000) : 0;

  const caps: Cap[] = [
    { key: "cost", label: "Course cost less scholarships and margin", value },
  ];
  if (income > 0) {
    caps.unshift({
      key: "foir",
      label: "Repayment capacity",
      value: capacity,
    });
  }

  if (value < MIN_LOAN) {
    return {
      ...holding(
        "Indicative education loan",
        `Scholarships and margin cover most of this ${money(cost)} cost, leaving less than the ${money(MIN_LOAN)} most lenders will sanction.`,
        ["A larger loan can still be arranged against a longer course or additional eligible expenses."],
      ),
      roi,
      months,
    };
  }

  if (income > 0 && capacity < MIN_LOAN) {
    return {
      ...holding(
        "Indicative education loan",
        existing > 0
          ? `The co-applicant's existing EMIs of ${money(existing)} use up the income lenders will count, leaving no room for a new education loan.`
          : `The co-applicant's ${money(income)} income leaves too little EMI room for the ${money(MIN_LOAN)} most lenders will sanction over ${tenureText(months)}.`,
        [
          "Closing or part-pre-paying an existing loan frees up EMI headroom.",
          "A longer repayment tenure after the moratorium lowers the EMI and raises the limit.",
        ],
      ),
      caps,
      binding: "Repayment capacity",
      roi,
      months,
      foir: {
        used: income > 0 ? (existing + emiForPrincipal(capacity, roi, months)) / income : 0,
        headroom,
        income,
        existing,
      },
    };
  }

  const loan = Math.min(...caps.map((cap) => cap.value));
  const binding = caps.reduce((lowest, cap) => (cap.value < lowest.value ? cap : lowest)).label;
  const emi = emiForPrincipal(loan, roi, months);

  return {
    eligible: true,
    headline: loan,
    headlineLabel: "Indicative education loan",
    monthly: Math.round(emi),
    monthlyLabel: "Monthly EMI",
    roi,
    months,
    caps,
    binding,
    foir: income > 0
      ? {
          used: (existing + emi) / income,
          headroom: Math.max(0, income * EDUCATION_FOIR_CAP - existing - emi),
          income,
          existing,
        }
      : null,
    message: income > 0
      ? `A ${money(cost)} course less ${money(scholarships)} of scholarships and ${money(margin)} of margin leaves ${money(value)}; the co-applicant's income supports ${money(capacity)}, so the estimate is ${money(loan)}, repayable over ${tenureText(months)}.`
      : `A course costing ${money(cost)} less ${money(scholarships)} of scholarships and ${money(margin)} of margin supports about ${money(loan)}, repayable over ${tenureText(months)}.`,
    suggestions: [],
  };
};

// ── Project loans ─────────────────────────────────────────────────────────────

export interface ProjectInput {
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

// ── Commercial purchase ───────────────────────────────────────────────────────

export interface CommercialInput {
  product: ProductSpec;
  roi?: number;
  months: number;
  propertyValue: number;
  monthlyRent: number;
  monthlyIncome: number;
  existingEmi: number;
  coApplicantIncome?: number;
  foirPct?: number;
  ltvPct?: number;
  creditScore?: number;
}

/** Loan = min(property value × LTV, DSCR limit on the rent, repayment capacity). */
export const commercialEligibility = (input: CommercialInput): EligibilityOutcome => {
  const { product } = input;
  const refusal = creditRefusal(input.creditScore, "Indicative commercial property loan");
  if (refusal) return refusal;
  const roi =
    input.roi !== undefined && Number.isFinite(input.roi) && input.roi >= 0 ? input.roi : product.roi;
  const months = Math.min(product.maxTenureMonths, Math.max(0, Math.round(input.months)));
  const propertyValue = Math.max(0, input.propertyValue);
  const rent = Math.max(0, input.monthlyRent);
  const coApplicant = Math.max(0, input.coApplicantIncome ?? 0);
  const income = Math.max(0, input.monthlyIncome) + coApplicant;
  const existing = Math.max(0, input.existingEmi);
  const ltv = Math.min(0.9, Math.max(0.3, (input.ltvPct ?? COMMERCIAL_LTV * 100) / 100));
  const foirCap = Math.min(0.9, Math.max(0.2, (input.foirPct ?? FOIR_CAP * 100) / 100));
  const caps: Cap[] = [];

  if (propertyValue > 0) {
    caps.push({
      key: "asset",
      label: `Property value × ${Math.round(ltv * 100)}%`,
      value: roundTo(propertyValue * ltv, 1000),
    });
  }
  if (rent > 0 && months > 0) {
    caps.push({
      key: "dscr",
      label: `DSCR of ${DSCR_MIN}× on the rent`,
      value: roundTo(principalForEmi(rent / DSCR_MIN, roi, months), 1000),
    });
  }
  if (income > 0 && months > 0) {
    const headroom = Math.max(0, income * foirCap - existing);
    if (headroom > 0) {
      caps.push({
        key: "foir",
        label: `Repayment capacity at ${Math.round(foirCap * 100)}% FOIR`,
        value: roundTo(principalForEmi(headroom, roi, months), 1000),
      });
    }
  }

  if (caps.length === 0) {
    return holding(
      "Indicative commercial property loan",
      "Add the property's market value, and ideally the rent it earns, to see what it can support.",
      ["Rent is tested against a debt-service cover ratio before a commercial property is financed."],
    );
  }

  const loan = Math.min(...caps.map((cap) => cap.value));
  const binding = caps.reduce((lowest, cap) => (cap.value < lowest.value ? cap : lowest)).label;
  const emi = emiForPrincipal(loan, roi, months);

  if (loan < MIN_LOAN) {
    return {
      ...holding(
        "Indicative commercial property loan",
        `These figures support less than ${money(MIN_LOAN)}, below the smallest loan lenders sanction on commercial property.`,
        ["A more valuable property or stronger rent supports a larger loan."],
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
    headlineLabel: "Indicative commercial property loan",
    monthly: Math.round(emi),
    monthlyLabel: "Monthly EMI",
    roi,
    months,
    caps,
    binding,
    foir:
      income > 0
        ? { used: (existing + emi) / income, headroom: Math.max(0, income * foirCap - existing - emi), income, existing }
        : null,
    message:
      rent > 0
        ? `A ${money(propertyValue)} commercial property at ${Math.round(ltv * 100)}% LTV and ${money(rent)} of monthly rent supports about ${money(loan)} at ${roi}% p.a. over ${tenureText(months)}.`
        : `A ${money(propertyValue)} commercial property at ${Math.round(ltv * 100)}% LTV supports about ${money(loan)} over ${tenureText(months)}. Add the rent to test the DSCR.`,
    suggestions: [],
  };
};

// ── Working capital (turnover method) ─────────────────────────────────────────

export interface TurnoverInput {
  product: ProductSpec;
  roi?: number;
  turnover: number;
  assessmentPct: number;
  margin: number;
  /** Eligible current assets (inventory + receivables) for the balance-sheet method. */
  currentAssets?: number;
  /** Trade creditors and other current liabilities. */
  currentLiabilities?: number;
  /** Defaults to the turnover method; drawing power caps it at the balance-sheet gap. */
  mode?: "turnover" | "drawingPower";
  creditScore?: number;
}

/** Requirement = turnover × assessment percentage; the loan is that requirement less the borrower's margin. */
export const turnoverEligibility = (input: TurnoverInput): EligibilityOutcome => {
  const { product } = input;
  const refusal = creditRefusal(input.creditScore, "Indicative working capital limit");
  if (refusal) return refusal;
  const roi =
    input.roi !== undefined && Number.isFinite(input.roi) && input.roi >= 0 ? input.roi : product.roi;
  const turnover = Math.max(0, input.turnover);
  const pct = input.assessmentPct > 0 ? Math.min(100, input.assessmentPct) : WC_ASSESSMENT_PCT * 100;
  const margin = Math.max(0, input.margin);

  if (turnover <= 0) {
    return holding(
      "Indicative working capital limit",
      "Projected annual turnover is the starting point for a working-capital limit.",
      ["Use the turnover you expect in the next 12 months, not last year's audited figure."],
    );
  }

  const requirement = turnover * (pct / 100);
  const mode = input.mode === "drawingPower" ? "drawingPower" : "turnover";

  // Turnover method gives the bank's assessed limit; a balance sheet gives the
  // borrowing requirement: (current assets − current liabilities) − margin.
  const currentAssets = Math.max(0, input.currentAssets ?? 0);
  const currentLiabilities = Math.max(0, input.currentLiabilities ?? 0);
  const hasBalanceSheet = currentAssets > 0 || currentLiabilities > 0;
  const gap = Math.max(0, currentAssets - currentLiabilities);
  const assessed = roundTo(Math.max(0, requirement - margin), 1000);
  const borrowing = roundTo(Math.max(0, gap - margin), 1000);

  if (mode === "drawingPower" && !hasBalanceSheet) {
    return holding(
      "Indicative working capital limit",
      "The drawing-power method needs your current assets and current liabilities.",
      ["Add eligible current assets and current liabilities, or switch back to the turnover method."],
    );
  }

  const value = mode === "drawingPower" ? Math.min(assessed, borrowing) : assessed;

  const caps: Cap[] = [
    { key: "turnover", label: `${Math.round(pct * 100) / 100}% of turnover, less margin`, value: assessed },
  ];
  if (mode === "drawingPower") {
    caps.push({ key: "drawing", label: "Current assets − current liabilities, less margin", value: borrowing });
  }
  const binding = caps.reduce((lowest, cap) => (cap.value < lowest.value ? cap : lowest)).label;

  if (value < MIN_LOAN) {
    return {
      ...holding(
        "Indicative working capital limit",
        hasBalanceSheet
          ? `A ${money(gap)} gap between current assets and liabilities, less ${money(margin)} of margin, supports less than the ${money(MIN_LOAN)} banks open.`
          : `A ${money(requirement)} requirement less ${money(margin)} of margin leaves less than the ${money(MIN_LOAN)} banks open.`,
        ["A lower borrower's margin or a higher projected turnover lifts the limit."],
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
      mode === "drawingPower"
        ? `Current assets of ${money(currentAssets)} less ${money(currentLiabilities)} of current liabilities leave a ${money(gap)} gap; after ${money(margin)} of margin that is ${money(borrowing)}, against a turnover-based limit of ${money(assessed)}, so the limit is ${money(value)}.`
        : `A ${money(turnover)} turnover at ${Math.round(pct * 100) / 100}% needs ${money(requirement)} of working capital; after ${money(margin)} of margin, about ${money(value)} can be financed.`,
    suggestions: [],
  };
};

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
  ltvPercent: number;
  deductionPct?: number;
  coveragePct?: number;
  creditScore?: number;
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
  const value = Math.min(rentalLimit, propertyLimit);
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
  const caps: Cap[] = [
    { key: "lease", label: `Rent after ${Math.round(deduction * 100)}% deduction at ${Math.round(coverage * 100)}% coverage`, value: rentalLimit },
    { key: "asset", label: `${Math.round(ltv * 100)}% of the property value`, value: propertyLimit },
  ];
  const binding = rentalLimit <= propertyLimit ? caps[0].label : caps[1].label;

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
    message: `Rent of ${money(rent)} a month less a ${Math.round(deduction * 100)}% deduction leaves ${money(netRent)}; at ${Math.round(coverage * 100)}% coverage the EMI can be ${money(supportedEmi)}, which discounts to ${money(rentalLimit)} over the remaining lease at ${roi}% p.a. The ${money(propertyValue)} property caps lending at ${money(propertyLimit)}, so the estimate is ${money(value)}, repayable at about ${money(emi)} a month over ${tenureText(months)}.`,
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
      return `Turnover method: requirement = turnover × ${Math.round(WC_ASSESSMENT_PCT * 10000) / 100}%, less margin · Drawing power = current assets − current liabilities − margin · Limit = min(turnover norm, drawing power)`;
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
