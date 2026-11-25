import { monthsToMaturity, type ProductSpec } from "./models";

export const OCCUPATIONS = ["Salaried", "Self-Employed", "Business Owner"] as const;
export const BUSINESS_OCCUPATIONS = ["Self-Employed", "Business Owner"] as const;
export const INCOME_COPY: Record<string, { label: string; hint: string }> = {
  Salaried: { label: "Monthly income", hint: "Take-home after deductions" },
  "Self-Employed": { label: "Monthly net profit", hint: "Profit after business expenses, from your P&L" },
  "Business Owner": { label: "Monthly net profit", hint: "Profit after business expenses, from your P&L" },
};
export const LAP_PROPERTY_TYPES = ["Residential", "Commercial", "Industrial", "Other"] as const;
export const LAP_CITIES = [
  { value: "A", label: "Category A (metro)" },
  { value: "B", label: "Category B (large city)" },
  { value: "C", label: "Category C (smaller town)" },
] as const;
export const LAP_USAGES = ["Self-occupied", "Rented out"] as const;

export const CARATS = [24, 22, 20, 18] as const;

export const num = (value: string): number => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

export const optionalNum = (value: string): number | undefined => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

export const maxTenureFor = (product: ProductSpec, age: number, occupation: string): number => {
  if (product.family === "gold") return 12;
  return Math.max(12, Math.min(product.maxTenureMonths, monthsToMaturity(age, product, occupation) || 12));
};

export interface FormState {
  product: string;
  occupation: string;
  dob: string;
  monthlyIncome: string;
  lapPropertyType: string;
  lapPropertyOther: string;
  lapCity: string;
  lapUsage: string;
  lapRent: string;
  lapExistingLoan: string;
  lrdRent: string;
  lrdLeaseYears: string;
  lrdPropertyValue: string;
  lrdLtv: string;
  vehicleDownPayment: string;
  eduFees: string;
  eduHostel: string;
  eduOther: string;
  eduScholarship: string;
  eduMargin: string;
  projectCost: string;
  projectContribution: string;
  projectCashFlow: string;
  commercialRent: string;
  wcAssessment: string;
  wcMargin: string;
  existingEmi: string;
  propertyValue: string;
  turnover: string;
  vehiclePrice: string;
  vehicleFoir: string;
  vehicleLtv: string;
  commercialCoApplicant: string;
  commercialFoir: string;
  commercialLtv: string;
  projectDscr: string;
  wcCurrentAssets: string;
  wcCurrentLiabilities: string;
  odMode: "turnover" | "drawingPower";
  odMargin: string;
  wcMethod: "turnover" | "drawingPower";
  lrdDeduction: string;
  lrdCoverage: string;
  goldGrams: string;
  goldCarat: number;
  goldRate: string;
  stock: string;
  debtors: string;
  otherCurrentLiabilities: string;
  creditScore: string;
  shareValue: string;
  fullName: string;
  mobile: string;
  email: string;
  authorized: boolean;
}

export const INITIAL_FORM: FormState = {
  product: "personal",
  occupation: "Salaried",
  dob: "",
  monthlyIncome: "",
  lapPropertyType: "Residential",
  lapPropertyOther: "",
  lapCity: "A",
  lapUsage: "Self-occupied",
  lapRent: "",
  lapExistingLoan: "",
  lrdRent: "",
  lrdLeaseYears: "",
  lrdPropertyValue: "",
  lrdLtv: "",
  vehicleDownPayment: "",
  vehicleFoir: "",
  vehicleLtv: "",
  commercialCoApplicant: "",
  commercialFoir: "",
  commercialLtv: "",
  projectDscr: "",
  wcCurrentAssets: "",
  wcCurrentLiabilities: "",
  odMode: "turnover",
  odMargin: "",
  wcMethod: "turnover",
  lrdDeduction: "",
  lrdCoverage: "",
  eduFees: "",
  eduHostel: "",
  eduOther: "",
  eduScholarship: "",
  eduMargin: "",
  projectCost: "",
  projectContribution: "",
  projectCashFlow: "",
  commercialRent: "",
  wcAssessment: "",
  wcMargin: "",
  existingEmi: "",
  propertyValue: "",
  turnover: "",
  vehiclePrice: "",
  goldGrams: "",
  goldCarat: 22,
  goldRate: "",
  stock: "",
  debtors: "",
  otherCurrentLiabilities: "",
  creditScore: "",
  shareValue: "",
  fullName: "",
  mobile: "",
  email: "",
  authorized: false,
};

export const SERIF = { fontFamily: "var(--font-serif)" } as const;

export const fieldClass = (hasError?: string) =>
  `w-full rounded-xl border bg-(--surface-muted) px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-(--brand-teal) focus:ring-(--brand-teal-33)"
  }`;
