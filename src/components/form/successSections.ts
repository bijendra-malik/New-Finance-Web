export interface SuccessRow {
  label: string;
  value?: string | number | null;
  omit?: boolean;
  force?: boolean;
}

export interface SuccessSection {
  title: string;
  rows: SuccessRow[];
}

export interface SubmissionSuccessProps {
  refNo: string;
  fullId?: string;
  createdAt?: string;
  productName: string;
  applicantName?: string;
  mobile?: string;
  email?: string;
  sections: SuccessSection[];
}

const dash = "—";

export const fmtINR = (n: number | undefined | null, opts?: Intl.NumberFormatOptions) =>
  `₹${(n ?? 0).toLocaleString("en-IN", opts)}`;

export const isBlank = (v?: string | number | null) =>
  v === undefined || v === null || String(v).trim() === "" || String(v).trim() === "0";

export const fmtText = (v?: string | number | null) => (isBlank(v) ? dash : String(v).trim());

export const fmtDate = (v?: string | null) => {
  if (!v) return dash;
  const opts = { day: "numeric", month: "short", year: "numeric" } as const;
  const asLocal = (d: Date) => (isNaN(d.getTime()) ? dash : d.toLocaleDateString("en-IN", opts));
  if (v.includes("T")) return asLocal(new Date(v));
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v.trim());
  if (m) return asLocal(new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return asLocal(new Date(v));
};

export const fmtDateTime = (v?: string | null) => {
  if (!v) return dash;
  const d = new Date(v);
  return isNaN(d.getTime()) ? dash : d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

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

export const fmtList = (arr?: string[] | null) => (arr && arr.length > 0 ? arr.join(", ") : dash);

const resolveTxnBank = (
  name?: string | { displayName?: string; banks?: string[] },
  other?: string
): string | undefined => {
  if (other && other.trim()) return other.trim();
  if (name && typeof name === "object") {
    const list = name.banks ?? [];
    if (name.displayName === "Multiple Transaction Banks")
      return list.length > 0 ? fmtList(list) : undefined;
    return name.displayName?.trim() || undefined;
  }
  if (!name || !name.trim() || name === "Multiple Transaction Banks") return undefined;
  return name.trim();
};

export const stripOther = (arr?: string[] | null) => (arr ?? []).filter(v => v !== "Other");

interface CommonApp {
  fullName: string; mobile: string; email: string; dob: string; panNumber?: string;
  state?: string; city?: string; pincode?: string; residenceStatus?: string; residenceStatusOther?: string;
  employmentType: string;
  companyName?: string; companyType?: string; companyTypeOther?: string;
  monthlyNetSalary?: number; salaryReceivedAs?: string; salaryBankName?: string;
  businessName?: string; businessType?: string; businessTypeOther?: string;
  gstNumber?: string; companyPanNumber?: string;
  natureOfBusiness?: string; natureOfBusinessOther?: string; industryType?: string; industryTypeOther?: string; subIndustry?: string;
  businessEstablishedDate?: string;
  transactionBankName?: string | { displayName?: string; banks?: string[] };
  transactionBanks?: string[];
  transactionBankOther?: string;
  lastYearTurnover?: number; last2YearsTurnover?: number;
  lastYearNetIncome?: number; last2YearsNetIncome?: number;
  profession?: string; professionOther?: string;
  currentYearTurnover?: number; priorYearTurnover?: number;
  currentYearNetIncome?: number; previousYearNetIncome?: number;
  businessState?: string; businessCity?: string; businessPincode?: string; businessPlaceStatus?: string; businessPlaceStatusOther?: string;
  loanAmount?: number; loanTenure?: number;
  existingEMI?: number; existingLoanAmount?: number;
  existingBanks?: string[]; existingBanksOther?: string[];
  existingLoanTypes?: string[]; existingLoanTypesOther?: string[];
  monthlySalary?: number; otherBankList?: string[]; otherLoanList?: string[];
}

export interface SuccessSectionOptions {
  loanSectionTitle?: string;
  amountLabel?: string;
  extraLoanRows?: SuccessRow[];
  productSection?: Pick<SuccessSection, "title" | "rows">;
  extraSections?: SuccessSection[];
}

const SALARIED = "Salaried";

export const resolveOther = (main: string | undefined, other: string | undefined): string | undefined => {
  if (main && main !== "Other") return main;
  const t = (other ?? "").trim();
  return t ? t : main;
};

export const buildSuccessSections = (app: CommonApp, opts: SuccessSectionOptions = {}): SuccessSection[] => {
  const sections: SuccessSection[] = [];

  // ── 1. Loan Requirement ──────────────────────────────────────────────
  sections.push({
    title: opts.loanSectionTitle ?? "Loan Requirement",
    rows: [
      ...(app.loanAmount != null ? [{ label: opts.amountLabel ?? "Loan Amount", value: fmtINR(app.loanAmount) }] : []),
      ...(app.loanTenure != null ? [{ label: "Tenure", value: fmtTenure(app.loanTenure) }] : []),
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
      { label: "Residence Status", value: resolveOther(app.residenceStatus, app.residenceStatusOther) },
    ],
  });

  // ── 4. Employment & Income ───────────────────────────────────────────
  const isSalaried = app.employmentType === SALARIED;
  const employment: SuccessRow[] = [{ label: "Employment Type", value: app.employmentType }];

  if (isSalaried) {
    employment.push(
      { label: "Company Name", value: app.companyName },
      { label: "Company Type", value: resolveOther(app.companyType, app.companyTypeOther) },
      { label: "Monthly Net Salary", value: (app.monthlyNetSalary ?? app.monthlySalary) ? fmtINR(app.monthlyNetSalary ?? app.monthlySalary) : undefined },
      { label: "Salary Received As", value: app.salaryReceivedAs },
      { label: "Salary Bank", value: app.salaryBankName },
    );
  } else if (app.employmentType === "Self Employed - Business") {
    employment.push(
      { label: "Business Name", value: app.businessName },
      { label: "Business Type", value: resolveOther(app.businessType, app.businessTypeOther) },
      { label: "GST Number", value: app.gstNumber },
      { label: "Company PAN", value: app.companyPanNumber },
      { label: "Nature of Business", value: resolveOther(app.natureOfBusiness, app.natureOfBusinessOther) },
      { label: "Industry Type", value: [resolveOther(app.industryType, app.industryTypeOther), app.subIndustry].filter(Boolean).join(" — ") || undefined },
      ...(app.businessEstablishedDate ? [{ label: "Established On", value: fmtDate(app.businessEstablishedDate) }] : []),
      ...(resolveTxnBank(app.transactionBankName, app.transactionBankOther)
        ? [{ label: "Transaction Bank", value: resolveTxnBank(app.transactionBankName, app.transactionBankOther) as string }]
        : []),
      { label: "Last Year Turnover", value: app.lastYearTurnover != null ? fmtINR(app.lastYearTurnover) : undefined, force: true },
      { label: "Last 2 Years Turnover", value: app.last2YearsTurnover != null ? fmtINR(app.last2YearsTurnover) : undefined, force: true },
      { label: "Last Year Net Income", value: app.lastYearNetIncome != null ? fmtINR(app.lastYearNetIncome) : undefined, force: true },
      { label: "Last 2 Years Net Income", value: app.last2YearsNetIncome != null ? fmtINR(app.last2YearsNetIncome) : undefined, force: true },
      { label: "Business Location", value: [app.businessCity, app.businessState].filter(Boolean).join(", ") || undefined },
      { label: "Business Pincode", value: app.businessPincode },
      { label: "Business Place Status", value: resolveOther(app.businessPlaceStatus, app.businessPlaceStatusOther) },
    );
  } else if (app.employmentType === "Self Employed - Professional") {
    employment.push(
      { label: "Profession", value: resolveOther(app.profession, app.professionOther) },
      { label: "GST Number", value: app.gstNumber },
      { label: "Company PAN", value: app.companyPanNumber },
      ...(resolveTxnBank(app.transactionBankName, app.transactionBankOther)
        ? [{ label: "Transaction Bank", value: resolveTxnBank(app.transactionBankName, app.transactionBankOther) as string }]
        : []),
      { label: "Current Year Turnover", value: app.currentYearTurnover != null ? fmtINR(app.currentYearTurnover) : undefined, force: true },
      { label: "Current Year Net Income", value: app.currentYearNetIncome != null ? fmtINR(app.currentYearNetIncome) : undefined, force: true },
      { label: "Previous Year Turnover", value: app.priorYearTurnover != null ? fmtINR(app.priorYearTurnover) : undefined, force: true },
      { label: "Previous Year Net Income", value: app.previousYearNetIncome != null ? fmtINR(app.previousYearNetIncome) : undefined, force: true },
      { label: "Business Location", value: [app.businessCity, app.businessState].filter(Boolean).join(", ") || undefined },
      { label: "Business Pincode", value: app.businessPincode },
      { label: "Business Place Status", value: resolveOther(app.businessPlaceStatus, app.businessPlaceStatusOther) },
    );
  }
  sections.push({ title: "Employment & Income", rows: employment });

  // ── 5. Existing Loan Obligations ─────────────────────────────────────
  const banks = stripOther([...(app.existingBanks ?? []), ...(app.existingBanksOther ?? app.otherBankList ?? [])]);
  const loanTypes = stripOther([...(app.existingLoanTypes ?? []), ...(app.existingLoanTypesOther ?? app.otherLoanList ?? [])]);

  const collectsBanks = app.existingBanks != null || app.otherBankList != null;
  const collectsLoanTypes = app.existingLoanTypes != null || app.otherLoanList != null;
  sections.push({
    title: "Existing Loan Obligations",
    rows: [
      { label: "Existing Total EMI", value: fmtINR(app.existingEMI), force: true },
      ...(collectsBanks ? [{ label: "Existing Banks", value: fmtList(banks) }] : []),
      { label: "Existing Loan Amount", value: fmtINR(app.existingLoanAmount), force: true },
      ...(collectsLoanTypes ? [{ label: "Existing Loan Types", value: fmtList(loanTypes) }] : []),
    ],
  });

  // ── 6. Caller-supplied custom sections ──────────────────────────────
  if (opts.extraSections) sections.push(...opts.extraSections);

  return sections;
};
