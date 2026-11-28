import { monthsToMaturity, type ProductSpec } from "./models";
import { ALL_EMPLOYMENT_TYPES, SALARIED, SELF_EMPLOYMENT } from "../../constants/masters";

export const OCCUPATIONS = ALL_EMPLOYMENT_TYPES;
export const BUSINESS_OCCUPATIONS = SELF_EMPLOYMENT;
export const INCOME_COPY: Record<string, { label: string; hint: string }> = {
  [SALARIED]: { label: "Monthly Net Income", hint: "Take Home Salary After Deduction" },
  ...Object.fromEntries(
    SELF_EMPLOYMENT.map((type) => [
      type,
      { label: "Annual net profit", hint: "Net Profit After Tax Deduction" },
    ]),
  ),
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
  lrdLenderLimit: string;
  eduFees: string;
  eduHostel: string;
  eduOther: string;
  eduScholarship: string;
  eduMargin: string;
  projectCost: string;
  projectContribution: string;
  projectCashFlow: string;
  commercialRent: string;
  existingEmi: string;
  propertyValue: string;
  turnover: string;
  vehiclePrice: string;
  commercialCoApplicant: string;
  wcCurrentAssets: string;
  wcCurrentLiabilities: string;
  odMode: "turnover" | "drawingPower";
  odMargin: string;
  wcMethod: "turnover" | "workingCapital";
  wcLenderLimit: string;
  wcExistingLimit: string;
  goldGrams: string;
  goldCarat: number;
  goldRate: string;
  stock: string;
  debtors: string;
  otherCurrentLiabilities: string;
  odLenderLimit: string;
  odExistingLimit: string;
  creditScore: string;
  shareValue: string;
  shareLenderLimit: string;
  shareExposure: string;
  fullName: string;
  mobile: string;
  email: string;
  authorized: boolean;
}

export const INITIAL_FORM: FormState = {
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
  lrdLenderLimit: "",
  commercialCoApplicant: "",
  wcCurrentAssets: "",
  wcCurrentLiabilities: "",
  odMode: "turnover",
  odMargin: "",
  wcMethod: "turnover",
  wcLenderLimit: "",
  wcExistingLimit: "",
  eduFees: "",
  eduHostel: "",
  eduOther: "",
  eduScholarship: "",
  eduMargin: "",
  projectCost: "",
  projectContribution: "",
  projectCashFlow: "",
  commercialRent: "",
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
  odLenderLimit: "",
  odExistingLimit: "",
  creditScore: "",
  shareValue: "",
  shareLenderLimit: "",
  shareExposure: "",
  fullName: "",
  mobile: "",
  email: "",
  authorized: false,
};

export const placeholderWith = (hint?: string, placeholder?: string): string | undefined =>
  hint ?? placeholder;

export const SERIF = { fontFamily: "var(--font-serif)" } as const;

export const fieldClass = (hasError?: string) =>
  `w-full rounded-xl border bg-(--surface-muted) px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-(--brand-teal) focus:ring-(--brand-teal-33)"
  }`;
