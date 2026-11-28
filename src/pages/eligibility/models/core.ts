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
export const PROJECT_MIN_CONTRIBUTION = 0.2;
export const WC_MARGIN = 0.25;
export const WC_TURNOVER_REQUIREMENT = 0.25;
export const WC_BANK_SHARE = 0.75;
export const WC_TURNOVER_NORM = WC_TURNOVER_REQUIREMENT * WC_BANK_SHARE;

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
    hint?: string;
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
      label: "Property Current Market Value",
      ltv: 0.8,
    },
  },
  {
    key: "lap", label: "Loan Against Property", family: "term", roi: 10.5, maxTenureMonths: 120,
    asset: {
      field: "propertyValue",
      label: "Property Current Market Value",
      ltv: 0.65,
      ltvByType: { Residential: 0.8, Commercial: 0.7, Industrial: 0.65 },
      ltvForOtherType: 0.7,
      cityAdjustment: { A: 0, B: 0.05, C: 0.1 },
    },
  },
  {
    key: "vehicleLoan", label: "Vehicle Loan", family: "term", roi: 8, maxTenureMonths: 60,
    asset: { field: "vehiclePrice", label: "On-Road Vehicle Price", ltv: 0.9 },
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

// ── Routes ────────────────────────────────────────────────────────────────────

export const productSlug = (product: ProductSpec): string =>
  product.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export const productBySlug = (slug: string | undefined): ProductSpec | null =>
  slug ? (PRODUCTS.find((product) => productSlug(product) === slug) ?? null) : null;

export const productPath = (key: string): string =>
  `/eligibility-calculator/${productSlug(productByKey(key))}`;

export interface Cap {
  key: "foir" | "asset" | "gold" | "turnover" | "mpbf" | "lease" | "cost" | "dscr" | "drawing" | "lender";
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
    grossLimit?: number;
    existingLimit?: number;
  };
  gold?: { value: number; ltv: number; netWeight: number };
  credit?: { score: number; band: string; foirCap: number };
  share?: { value: number; ltv: number; gross?: number; existingExposure?: number };
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

export const roundTo = (value: number, step: number) => Math.max(0, Math.floor(value / step) * step);

export const money = (value: number) =>
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

export const holding = (headlineLabel: string, message: string, suggestions: string[]): EligibilityOutcome => ({
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
