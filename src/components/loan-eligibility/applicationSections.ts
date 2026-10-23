import { buildSuccessSections, fmtINR, isBlank } from "../form/successSections";
import type { SuccessRow, SuccessSection } from "../form/successSections";
import { loanKeyFor, type LoanKey } from "../../constants/loanSlugs";

import * as personalReceipts from "../../pages/dashboard/loans/PersonalLoan/components/receiptSections";
import * as businessReceipts from "../../pages/dashboard/loans/BusinessLoan/components/receiptSections";
import * as homeReceipts from "../../pages/dashboard/loans/HomeLoan/components/receiptSections";
import * as loanAgainstPropertyReceipts from "../../pages/dashboard/loans/LoanAgainstProperty/components/receiptSections";
import * as balanceTransferReceipts from "../../pages/dashboard/loans/BalanceTransfer/components/receiptSections";
import * as projectReceipts from "../../pages/dashboard/loans/ProjectLoan/components/receiptSections";
import * as vehicleReceipts from "../../pages/dashboard/loans/VehicleLoan/components/receiptSections";
import * as educationReceipts from "../../pages/dashboard/loans/EducationLoan/components/receiptSections";
import * as creditCardReceipts from "../../pages/dashboard/loans/CreditCard/components/receiptSections";
import * as commercialPurchaseReceipts from "../../pages/dashboard/loans/CommercialPurchase/components/receiptSections";
import * as workingCapitalReceipts from "../../pages/dashboard/loans/WorkingCapital/components/receiptSections";
import * as leaseRentalReceipts from "../../pages/dashboard/loans/LeaseRentalDiscounting/components/receiptSections";
import * as odccReceipts from "../../pages/dashboard/loans/ODCCLimit/components/receiptSections";
import * as loanAgainstShareReceipts from "../../pages/dashboard/loans/LoanAgainstShare/components/receiptSections";
import * as filmReceipts from "../../pages/dashboard/loans/FilmLoan/components/receiptSections";
import * as npaReceipts from "../../pages/dashboard/loans/NPA/components/receiptSections";
import * as goldReceipts from "../../pages/dashboard/loans/GoldLoan/components/receiptSections";
import * as fdiReceipts from "../../pages/dashboard/loans/FDI/components/receiptSections";

type ApplicationRecord = Record<string, unknown>;
type SectionBuilder = (app: ApplicationRecord) => SuccessSection[];

const asBuilder = (builder: (app: never) => SuccessSection[]): SectionBuilder =>
  builder as unknown as SectionBuilder;

const PRODUCT_BUILDERS: Partial<Record<LoanKey, SectionBuilder>> = {
  personal: asBuilder(personalReceipts.buildProductSections),
  business: asBuilder(businessReceipts.buildProductSections),
  home: asBuilder(homeReceipts.buildProductSections),
  lap: asBuilder(loanAgainstPropertyReceipts.buildProductSections),
  balanceTransfer: asBuilder(balanceTransferReceipts.buildProductSections),
  projectLoan: asBuilder(projectReceipts.buildProductSections),
  vehicleLoan: asBuilder(vehicleReceipts.buildProductSections),
  educationLoan: asBuilder(educationReceipts.buildProductSections),
  creditCard: asBuilder(creditCardReceipts.buildProductSections),
  commercialPurchase: asBuilder(commercialPurchaseReceipts.buildProductSections),
  workingCapital: asBuilder(workingCapitalReceipts.buildProductSections),
  leaseRentalDiscounting: asBuilder(leaseRentalReceipts.buildProductSections),
  odCcLimit: asBuilder(odccReceipts.buildProductSections),
  loanAgainstShare: asBuilder(loanAgainstShareReceipts.buildProductSections),
  filmFunding: asBuilder(filmReceipts.buildProductSections),
  npaLoan: asBuilder(npaReceipts.buildProductSections),
  goldLoan: asBuilder(goldReceipts.buildProductSections),
  fdiLoan: asBuilder(fdiReceipts.buildProductSections),
};

const hasVisibleRows = (section: SuccessSection): boolean =>
  section.rows.some((row) => !row.omit && (row.force || !isBlank(row.value)));

const hasAnyRows = (sections: SuccessSection[]): boolean =>
  sections.some(hasVisibleRows);

const looksLikeApplication = (record: ApplicationRecord): boolean =>
  typeof record.fullName === "string" &&
  record.fullName.trim() !== "" &&
  (typeof record.mobile === "string" || typeof record.email === "string");

const META_KEYS = new Set([
  "_id", "id", "__v", "__t", "createdAt", "updatedAt", "status", "nextStep",
  "draft", "draftId", "product", "userId", "creditScore", "score", "band",
  "eligible", "isEligible",
]);

const SENSITIVE_KEY = /(password|passcode|token|secret|mpin)/i;
const MONEY_KEY = /(amount|salary|income|turnover|emi|value|price)/i;

const KNOWN_LABELS: Record<string, string> = {
  fullName: "Full Name",
  dob: "Date of Birth",
  panNumber: "PAN Number",
  mobile: "Mobile",
  email: "Email",
  residenceStatus: "Residence Status",
  employmentType: "Employment Type",
  monthlySalary: "Monthly Salary",
  monthlyNetSalary: "Monthly Net Salary",
  gstNumber: "GST Number",
  companyPanNumber: "Company PAN",
  transactionBankName: "Transaction Bank",
  existingEMI: "Existing Total EMI",
  existingBanks: "Existing Banks",
  existingLoanTypes: "Existing Loan Types",
  loanAmount: "Loan Amount",
  loanTenure: "Tenure",
};

const labelFor = (key: string): string =>
  KNOWN_LABELS[key] ??
  key
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const readableValue = (key: string, value: unknown): string | undefined => {
  if (typeof value === "string") return value.trim() || undefined;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return undefined;
    return MONEY_KEY.test(key) && value > 0 ? fmtINR(value) : String(value);
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    const parts = value
      .map((entry) => readableValue(key, entry))
      .filter((entry): entry is string => Boolean(entry));
    return parts.length > 0 ? parts.join(", ") : undefined;
  }
  if (value && typeof value === "object") {
    const named = value as Record<string, unknown>;
    const candidate = named.displayName ?? named.name ?? named.label ?? named.value;
    return typeof candidate === "string" ? candidate.trim() || undefined : undefined;
  }
  return undefined;
};

const genericSections = (application: ApplicationRecord): SuccessSection[] => {
  const rows: SuccessRow[] = [];
  for (const [key, value] of Object.entries(application)) {
    if (META_KEYS.has(key) || SENSITIVE_KEY.test(key)) continue;
    const text = readableValue(key, value);
    if (!text) continue;
    rows.push({ label: labelFor(key), value: text });
  }
  return rows.length > 0 ? [{ title: "Recorded Application Details", rows }] : [];
};

export const buildApplicationSections = (
  application: ApplicationRecord | null | undefined,
  productName: string,
): SuccessSection[] => {
  if (!application) return [];

  const productKey =
    loanKeyFor(productName) ??
    (typeof application.product === "string" ? loanKeyFor(application.product) : null);

  if (looksLikeApplication(application)) {
    const builder = productKey ? PRODUCT_BUILDERS[productKey] : undefined;
    if (builder) {
      const sections = builder(application);
      if (hasAnyRows(sections)) return sections;
    }

    const commonSections = buildSuccessSections(
      application as unknown as Parameters<typeof buildSuccessSections>[0],
    );
    if (hasAnyRows(commonSections)) return commonSections;
  }

  return genericSections(application);
};
