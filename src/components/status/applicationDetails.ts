import type { CustomerStatusApplication } from "../../api/statusTracking";
import { formatInr } from "./statusFormat";

export interface ApplicationDetailRow {
  label: string;
  value: string;
}

export interface ApplicationDetailGroup {
  title: string;
  rows: ApplicationDetailRow[];
}

/** Rupee amounts. */
const CURRENCY = new Set([
  "loanAmount", "monthlySalary", "existingEMI", "existingLoanAmount",
  "buyingPropertyMarketValue", "collateralPropertyMarketValue", "currentPropertyValue", "topUpAmount",
  "leasePropertyMarketValue", "monthlyLeaseIncome", "totalLeaseAmount",
  "lastYearTurnover", "last2YearsTurnover", "lastYearNetIncome", "last2YearsNetIncome",
  "currentYearTurnover", "priorYearTurnover", "currentYearNetIncome", "previousYearNetIncome",
  "totalProjectCost", "ownInvestment", "ownInvestmentAmount", "educationCost",
  "valueOfOneShare", "totalShareValue", "npaPrincipalLoanAmount", "npaCurrentOutstandingAmount",
]);

/** Whole years. */
const YEARS = new Set([
  "loanTenure", "courseDuration", "collateralPropertyAge", "buyingPropertyAge", "leasePropertyDuration",
]);

/** Dates shown as a day, not a timestamp. */
const DATES = new Set([
  "dob", "businessEstablishedDate", "projectStartDate", "projectCompletionDate", "creditScoreCheckedAt",
]);

/** Multi-value fields shown as a comma-separated list. */
const LISTS = new Set(["filmLanguages", "starCastNames", "existingBanks", "existingLoanTypes"]);

const LABELS: Readonly<Record<string, string>> = {
  // Loan requirement
  loanAmount: "Loan amount",
  loanTenure: "Tenure",
  creditScore: "Credit score",
  creditEligible: "Credit check",
  creditScoreCheckedAt: "Credit score checked",
  // Employment & income
  employmentType: "Employment type",
  profession: "Profession",
  professionOther: "Profession (other)",
  companyName: "Company name",
  companyType: "Company type",
  businessName: "Business name",
  businessType: "Business type",
  monthlySalary: "Monthly income",
  salaryReceivedAs: "Salary received as",
  salaryBankName: "Salary bank",
  natureOfBusiness: "Nature of business",
  industryType: "Industry type",
  subIndustry: "Sub-industry",
  gstNumber: "GST number",
  companyPanNumber: "Company PAN",
  businessEstablishedDate: "Established on",
  transactionBankName: "Transaction bank",
  lastYearTurnover: "Last year turnover",
  last2YearsTurnover: "Last 2 years turnover",
  lastYearNetIncome: "Last year net income",
  last2YearsNetIncome: "Last 2 years net income",
  currentYearTurnover: "Current year turnover",
  priorYearTurnover: "Previous year turnover",
  currentYearNetIncome: "Current year net income",
  previousYearNetIncome: "Previous year net income",
  businessState: "Business state",
  businessCity: "Business city",
  businessPincode: "Business pincode",
  businessPlaceStatus: "Business place status",
  existingEMI: "Existing total EMI",
  existingLoanAmount: "Existing loan amount",
  existingBanks: "Existing banks",
  existingLoanTypes: "Existing loan types",
  // Property, collateral & lease
  buyingPropertyType: "Property being bought",
  buyingPropertyMarketValue: "Property market value",
  buyingPropertyAge: "Property age",
  buyingPropertyState: "Property state",
  buyingPropertyCity: "Property city",
  buyingPropertyPincode: "Property pincode",
  collateralPropertyType: "Collateral property type",
  collateralPropertyMarketValue: "Collateral market value",
  collateralPropertyAge: "Collateral age",
  collateralPropertyState: "Collateral state",
  collateralPropertyCity: "Collateral city",
  collateralPropertyPincode: "Collateral pincode",
  currentPropertyValue: "Current property value",
  topUpAmount: "Top-up amount",
  balanceTransferType: "Balance transfer type",
  monthlyLeaseIncome: "Monthly lease income",
  totalLeaseAmount: "Total lease amount",
  leasePropertyDuration: "Lease duration",
  leasePropertyMarketValue: "Lease property market value",
  leasePropertyAge: "Lease property age",
  leasePropertyState: "Lease property state",
  leasePropertyCity: "Lease property city",
  leasePropertyPincode: "Lease property pincode",
  // Product specifics
  typeOfLoan: "Type of loan",
  goldCarats: "Gold purity (carats)",
  goldWeight: "Gold weight (grams)",
  vehicleType: "Vehicle type",
  manufacturer: "Manufacturer",
  model: "Model",
  fuelType: "Fuel type",
  transmissionType: "Transmission",
  vehiclePurchaseType: "Purchase type",
  educationCountry: "Study country",
  fieldOfStudy: "Field of study",
  courseName: "Course",
  university: "University",
  instituteName: "Institute",
  enrollmentStatus: "Enrolment status",
  courseDuration: "Course duration",
  educationCost: "Education cost",
  projectType: "Project type",
  totalProjectCost: "Total project cost",
  projectStartDate: "Project starts",
  projectCompletionDate: "Project completes",
  ownInvestment: "Own investment",
  ownInvestmentAmount: "Own investment",
  shareCompanyName: "Share company",
  valueOfOneShare: "Value per share",
  quantityOfShare: "Number of shares",
  totalShareValue: "Total share value",
  npaStatus: "NPA status",
  npaPrincipalLoanAmount: "Original loan amount",
  npaCurrentOutstandingAmount: "Current outstanding",
  filmComesUnder: "Film comes under",
  filmLanguages: "Film languages",
  starCastNames: "Star cast",
  hasActiveCard: "Existing active card",
  applyForBank: "Preferred bank",
  // Applicant
  fullName: "Full name",
  dob: "Date of birth",
  panNumber: "PAN number",
  mobile: "Mobile",
  email: "Email",
  residenceStatus: "Residence status",
  residenceStatusOther: "Residence status (other)",
  city: "City",
  state: "State",
  pincode: "Pincode",
};

/** Groups in the order they are shown; only the ones with data are rendered. */
const GROUPS: { title: string; keys: string[] }[] = [
  {
    title: "Loan requirement",
    keys: ["loanAmount", "loanTenure", "creditScore", "creditEligible", "creditScoreCheckedAt"],
  },
  {
    title: "Employment & income",
    keys: [
      "employmentType", "profession", "professionOther",
      "companyName", "companyType", "businessName", "businessType",
      "monthlySalary", "salaryReceivedAs", "salaryBankName",
      "natureOfBusiness", "industryType", "subIndustry", "gstNumber", "companyPanNumber",
      "businessEstablishedDate", "transactionBankName",
      "lastYearTurnover", "last2YearsTurnover", "lastYearNetIncome", "last2YearsNetIncome",
      "currentYearTurnover", "priorYearTurnover", "currentYearNetIncome", "previousYearNetIncome",
      "businessState", "businessCity", "businessPincode", "businessPlaceStatus",
      "existingEMI", "existingLoanAmount", "existingBanks", "existingLoanTypes",
    ],
  },
  {
    title: "Property & collateral",
    keys: [
      "buyingPropertyType", "buyingPropertyMarketValue", "buyingPropertyAge",
      "buyingPropertyState", "buyingPropertyCity", "buyingPropertyPincode",
      "collateralPropertyType", "collateralPropertyMarketValue", "collateralPropertyAge",
      "collateralPropertyState", "collateralPropertyCity", "collateralPropertyPincode",
      "currentPropertyValue", "topUpAmount", "balanceTransferType",
      "monthlyLeaseIncome", "totalLeaseAmount", "leasePropertyDuration", "leasePropertyMarketValue",
      "leasePropertyAge", "leasePropertyState", "leasePropertyCity", "leasePropertyPincode",
    ],
  },
  {
    title: "Product details",
    keys: [
      "typeOfLoan", "goldCarats", "goldWeight",
      "vehicleType", "manufacturer", "model", "fuelType", "transmissionType", "vehiclePurchaseType",
      "educationCountry", "fieldOfStudy", "courseName", "university", "instituteName",
      "enrollmentStatus", "courseDuration", "educationCost",
      "projectType", "totalProjectCost", "projectStartDate", "projectCompletionDate", "ownInvestment",
      "shareCompanyName", "valueOfOneShare", "quantityOfShare", "totalShareValue",
      "npaStatus", "npaPrincipalLoanAmount", "npaCurrentOutstandingAmount",
      "filmComesUnder", "filmLanguages", "starCastNames", "ownInvestmentAmount",
      "hasActiveCard", "applyForBank",
    ],
  },
  {
    title: "Applicant",
    keys: ["fullName", "dob", "panNumber", "mobile", "email", "residenceStatus", "residenceStatusOther", "city", "state", "pincode"],
  },
];

const titleCase = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[._]+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());

const labelFor = (key: string): string => LABELS[key] ?? titleCase(key);

const formatDay = (value: string): string | undefined => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const formatValue = (key: string, raw: unknown): string | undefined => {
  if (raw === null || raw === undefined) return undefined;
  if (typeof raw === "boolean") return raw ? "Yes" : "No";
  if (Array.isArray(raw)) {
    const items = raw.filter((item): item is string => typeof item === "string" && item.trim() !== "");
    return items.length ? items.join(", ") : undefined;
  }
  if (typeof raw === "number") {
    if (!Number.isFinite(raw)) return undefined;
    if (CURRENCY.has(key)) return formatInr(raw);
    if (YEARS.has(key)) return `${raw} ${raw === 1 ? "year" : "years"}`;
    return String(raw);
  }
  const text = String(raw).trim();
  if (!text) return undefined;
  if (CURRENCY.has(key)) {
    const amount = Number(text.replace(/[^\d.]/g, ""));
    return Number.isFinite(amount) ? formatInr(amount) : text;
  }
  if (YEARS.has(key)) {
    const years = Number(text);
    return Number.isFinite(years) ? `${years} ${years === 1 ? "year" : "years"}` : text;
  }
  if (DATES.has(key)) return formatDay(text);
  if (LISTS.has(key)) return text.split(",").map((part) => part.trim()).filter(Boolean).join(", ") || undefined;
  // A lone zero is how the feed reports "nothing here" for optional text fields.
  if (text === "0" && !CURRENCY.has(key)) return undefined;
  return text;
};

/** The application's submitted fields, grouped and formatted for display. */
export const applicationDetailGroups = (
  app: CustomerStatusApplication,
): ApplicationDetailGroup[] => {
  const details = app.details && typeof app.details === "object" && !Array.isArray(app.details)
    ? app.details
    : {};
  const groups: ApplicationDetailGroup[] = [];
  for (const group of GROUPS) {
    const rows: ApplicationDetailRow[] = [];
    for (const key of group.keys) {
      const value = formatValue(key, details[key]);
      if (value) rows.push({ label: labelFor(key), value });
    }
    if (rows.length > 0) groups.push({ title: group.title, rows });
  }
  return groups;
};

/** The stages an application moves through, and where it currently stands. */
export interface ApplicationProgress {
  stages: string[];
  /** Index of the stage reached; -1 when the application was rejected. */
  reached: number;
  rejected: boolean;
}

const DEFAULT_STAGES = ["Application Submitted", "Under Review", "Approved"];

export const applicationProgress = (app: CustomerStatusApplication): ApplicationProgress => {
  const rejected = /reject|declin/i.test(app.status ?? "") || app.stageKey === "rejected";
  const stages = app.stages?.length ? app.stages : DEFAULT_STAGES;
  const step = typeof app.step === "number" && app.step > 0 ? app.step : 1;
  return {
    stages,
    reached: rejected ? 0 : Math.min(step, stages.length) - 1,
    rejected,
  };
};
