/**
 * Shared success-layer module: types, formatting helpers, the section
 * builder, and (via re-export) the SubmissionSuccess component.
 * Helpers live in this .ts file so component files stay fast-refresh clean.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SuccessRow {
  label: string;
  /** Cell value; may be pre-formatted by the caller (₹ amounts, joined lists…). */
  value?: string | number | null;
  /** Hide the row entirely when true (used for conditional product fields). */
  omit?: boolean;
  force?: boolean;
}

export interface SuccessSection {
  title: string;
  rows: SuccessRow[];
}

export interface SubmissionSuccessProps {
  /** 10-char uppercase reference shown in the badge, e.g. "A1B2C3D4E5". */
  refNo: string;
  /** Full Mongo id, rendered as the receipt number. */
  fullId?: string;
  /** ISO timestamp of submission. */
  createdAt?: string;
  /** Product line of the application, e.g. "Personal Loan". */
  productName: string;
  /** Applicant full name for the at-a-glance strip. */
  applicantName?: string;
  /** Contact details echoed back to the applicant. */
  mobile?: string;
  email?: string;
  sections: SuccessSection[];
}

// ── Formatting helpers ────────────────────────────────────────────────────────

const dash = "—";

/** ₹-formatted Indian numbering, tolerant of undefined. */
export const fmtINR = (n: number | undefined | null, opts?: Intl.NumberFormatOptions) =>
  `₹${(n ?? 0).toLocaleString("en-IN", opts)}`;

export const isBlank = (v?: string | number | null) =>
  v === undefined || v === null || String(v).trim() === "" || String(v).trim() === "0";

/** Generic text fallback: blank → —. */
export const fmtText = (v?: string | number | null) => (isBlank(v) ? dash : String(v).trim());

/** Date-only string (yyyy-mm-dd) → "12 Mar 1998". */
export const fmtDate = (v?: string | null) => {
  if (!v) return dash;
  const d = new Date(v + "T00:00:00");
  return isNaN(d.getTime()) ? dash : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/** Full ISO timestamp → "12 Mar 2026, 4:30 pm". */
export const fmtDateTime = (v?: string | null) => {
  if (!v) return dash;
  const d = new Date(v);
  return isNaN(d.getTime()) ? dash : d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
};

/** Number + unit → "5 years", tolerating blank. */
export const fmtQty = (n: number | undefined | null, unit: string) =>
  n === undefined || n === null || isNaN(n) || n === 0 ? dash : `${n.toLocaleString("en-IN")} ${unit}`;

export const fmtTenure = (months?: number | null) => {
  if (months === undefined || months === null || isNaN(months) || months <= 0) return dash;
  if (months % 12 === 0) {
    const years = months / 12;
    return `${years.toLocaleString("en-IN")} ${years === 1 ? "year" : "years"}`;
  }
  return `${months.toLocaleString("en-IN")} months`;
};

/** Joins a string list → "a, b, c", tolerating empty. */
export const fmtList = (arr?: string[] | null) => (arr && arr.length > 0 ? arr.join(", ") : dash);

/** Transaction bank display: the backend may not persist the individual banks list,
 *  so fall back to the stored name itself ("Multiple Transaction Banks"). */
export const fmtTxnBank = (name?: string, banks?: string[]) =>
  name === "Multiple Transaction Banks" && banks && banks.length > 0 ? fmtList(banks) : fmtText(name);

/** The backend merges custom entries into the arrays; drop the "Other" sentinel for display. */
export const stripOther = (arr?: string[] | null) => (arr ?? []).filter(v => v !== "Other");

// ── Section builder ───────────────────────────────────────────────────────────

/**
 * Shared builder that assembles the standard acknowledgement sections
 * (Loan Requirement, Applicant, Employment & Income, Existing Obligations)
 * from any loan application object. Product-specific rows/sections are
 * injected by each form via opts.
 */

// Structural subset satisfied by every *Application interface across forms.
interface CommonApp {
  fullName: string; mobile: string; email: string; dob: string; panNumber?: string;
  state?: string; city?: string; pincode?: string; residenceStatus?: string;
  employmentType: string;
  companyName?: string; companyType?: string;
  monthlyNetSalary?: number; salaryReceivedAs?: string; salaryBankName?: string;
  businessName?: string; businessType?: string;
  gstNumber?: string; companyPanNumber?: string;
  natureOfBusiness?: string; industryType?: string; subIndustry?: string;
  businessEstablishedDate?: string; transactionBankName?: string; transactionBanks?: string[];
  lastYearTurnover?: number; last2YearsTurnover?: number;
  lastYearNetIncome?: number; last2YearsNetIncome?: number;
  profession?: string;
  currentYearTurnover?: number; priorYearTurnover?: number;
  currentYearNetIncome?: number; previousYearNetIncome?: number;
  businessState?: string; businessCity?: string; businessPincode?: string; businessPlaceStatus?: string;
  // Credit Card applications carry no amount/tenure, hence optional.
  loanAmount?: number; loanTenure?: number;
  existingEMI?: number; existingLoanAmount?: number;
  existingBanks?: string[]; existingBanksOther?: string[];
  existingLoanTypes?: string[]; existingLoanTypesOther?: string[];
  // PersonalLoan backend naming variants.
  monthlySalary?: number; otherBankList?: string[]; otherLoanList?: string[];
}

export interface SuccessSectionOptions {
  /** Overrides the default section title (e.g. "Card Requirement"). */
  loanSectionTitle?: string;
  /** Overrides the default "Loan Amount" label (e.g. "Fund Amount"). */
  amountLabel?: string;
  /** Extra rows appended at the end of the Loan Requirement section. */
  extraLoanRows?: SuccessRow[];
  /** Rows for a dedicated product-specific section (property, vehicle, gold…). */
  productSection?: Pick<SuccessSection, "title" | "rows">;
  /** Fully custom additional sections (parent details, NPA banking…), rendered after the standard ones. */
  extraSections?: SuccessSection[];
}

const SALARIED = "Salaried";

export const buildSuccessSections = (app: CommonApp, opts: SuccessSectionOptions = {}): SuccessSection[] => {
  const sections: SuccessSection[] = [];

  // ── 1. Loan Requirement ──────────────────────────────────────────────
  sections.push({
    title: opts.loanSectionTitle ?? "Loan Requirement",
    rows: [
      ...(app.loanAmount !== undefined ? [{ label: opts.amountLabel ?? "Loan Amount", value: fmtINR(app.loanAmount) }] : []),
      ...(app.loanTenure !== undefined ? [{ label: "Tenure", value: fmtTenure(app.loanTenure) }] : []),
      ...(opts.extraLoanRows ?? []),
    ],
  });

  // ── 2. Product-specific section (property, vehicle, gold, film…) ─────
  if (opts.productSection) sections.push(opts.productSection);

  // ── 3. Applicant Details ─────────────────────────────────────────────
  sections.push({
    title: "Applicant Details",
    rows: [
      { label: "Full Name", value: app.fullName },
      { label: "Date of Birth", value: fmtDate(app.dob) },
      { label: "PAN Number", value: app.panNumber ? String(app.panNumber).toUpperCase() : undefined },
      { label: "Mobile", value: app.mobile ? `+91 ${app.mobile}` : undefined },
      { label: "Email", value: app.email },
      { label: "Residence", value: [app.city, app.state].filter(Boolean).join(", ") || undefined },
      { label: "Pincode", value: app.pincode },
      { label: "Residence Status", value: app.residenceStatus },
    ],
  });

  // ── 4. Employment & Income ───────────────────────────────────────────
  const isSalaried = app.employmentType === SALARIED;
  const employment: SuccessRow[] = [{ label: "Employment Type", value: app.employmentType }];

  if (isSalaried) {
    employment.push(
      { label: "Company Name", value: app.companyName },
      { label: "Company Type", value: app.companyType },
      { label: "Monthly Net Salary", value: (app.monthlyNetSalary ?? app.monthlySalary) ? fmtINR(app.monthlyNetSalary ?? app.monthlySalary) : undefined },
      { label: "Salary Received As", value: app.salaryReceivedAs },
      { label: "Salary Bank", value: app.salaryBankName },
    );
  } else if (app.employmentType === "Self Employed - Business") {
    employment.push(
      { label: "Business Name", value: app.businessName },
      { label: "Business Type", value: app.businessType },
      { label: "GST Number", value: app.gstNumber },
      { label: "Company PAN", value: app.companyPanNumber },
      { label: "Nature of Business", value: app.natureOfBusiness },
      { label: "Industry Type", value: [app.industryType, app.subIndustry].filter(Boolean).join(" — ") || undefined },
      { label: "Established On", value: fmtDate(app.businessEstablishedDate) },
      { label: "Transaction Bank", value: fmtTxnBank(app.transactionBankName, app.transactionBanks) },
      { label: "Last Year Turnover", value: app.lastYearTurnover !== undefined ? fmtINR(app.lastYearTurnover) : undefined, force: true },
      { label: "Last 2 Years Turnover", value: app.last2YearsTurnover !== undefined ? fmtINR(app.last2YearsTurnover) : undefined, force: true },
      { label: "Last Year Net Income", value: app.lastYearNetIncome !== undefined ? fmtINR(app.lastYearNetIncome) : undefined, force: true },
      { label: "Last 2 Years Net Income", value: app.last2YearsNetIncome !== undefined ? fmtINR(app.last2YearsNetIncome) : undefined, force: true },
      { label: "Business Location", value: [app.businessCity, app.businessState].filter(Boolean).join(", ") || undefined },
      { label: "Business Pincode", value: app.businessPincode },
      { label: "Business Place Status", value: app.businessPlaceStatus },
    );
  } else if (app.employmentType === "Self Employed - Professional") {
    employment.push(
      { label: "Profession", value: app.profession },
      { label: "GST Number", value: app.gstNumber },
      { label: "Company PAN", value: app.companyPanNumber },
      { label: "Transaction Bank", value: fmtTxnBank(app.transactionBankName, app.transactionBanks) },
      { label: "Current Year Turnover", value: app.currentYearTurnover !== undefined ? fmtINR(app.currentYearTurnover) : undefined, force: true },
      { label: "Current Year Net Income", value: app.currentYearNetIncome !== undefined ? fmtINR(app.currentYearNetIncome) : undefined, force: true },
      { label: "Previous Year Turnover", value: app.priorYearTurnover !== undefined ? fmtINR(app.priorYearTurnover) : undefined, force: true },
      { label: "Previous Year Net Income", value: app.previousYearNetIncome !== undefined ? fmtINR(app.previousYearNetIncome) : undefined, force: true },
      { label: "Business Location", value: [app.businessCity, app.businessState].filter(Boolean).join(", ") || undefined },
      { label: "Business Pincode", value: app.businessPincode },
      { label: "Business Place Status", value: app.businessPlaceStatus },
    );
  }
  sections.push({ title: "Employment & Income", rows: employment });

  // ── 5. Existing Loan Obligations ─────────────────────────────────────
  const banks = stripOther([...(app.existingBanks ?? []), ...(app.existingBanksOther ?? app.otherBankList ?? [])]);
  const loanTypes = stripOther([...(app.existingLoanTypes ?? []), ...(app.existingLoanTypesOther ?? app.otherLoanList ?? [])]);

  // Always shown: the forms instruct "Fill 0 if you have no existing loans",
  // so 0 is the user's entry, not an omission. force keeps ₹0 rows visible.
  sections.push({
    title: "Existing Loan Obligations",
    rows: [
      { label: "Existing Total EMI", value: fmtINR(app.existingEMI), force: true },
      { label: "Existing Loan Amount", value: fmtINR(app.existingLoanAmount), force: true },
      { label: "Existing Banks", value: fmtList(banks) },
      { label: "Existing Loan Types", value: fmtList(loanTypes) },
    ],
  });

  // ── 6. Caller-supplied custom sections ──────────────────────────────
  if (opts.extraSections) sections.push(...opts.extraSections);

  return sections;
};
