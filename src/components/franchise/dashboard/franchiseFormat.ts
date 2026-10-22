// Display helpers for the franchisee dashboard.
//
// The franchise service returns loan rows with slightly different field names
// across endpoints (a client's loans, the franchise-wide loan list and the
// single-application status), so every read goes through a tolerant accessor
// instead of assuming one shape. Unknown values render as an em dash rather
// than "undefined" in the UI.

import type { FranchiseCustomerLoan } from "../../../api/franchiseCustomers";

type Row = Record<string, unknown>;

const asRecord = (value: unknown): Row | null =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Row) : null;

const pickString = (record: Row | null, keys: readonly string[]): string | undefined => {
  if (!record) return undefined;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return undefined;
};

const pickNumber = (record: Row | null, keys: readonly string[]): number | undefined => {
  if (!record) return undefined;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value.replace(/[^\d.-]/g, ""));
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return undefined;
};

const customerRecord = (loan: Row): Row | null =>
  asRecord(loan.customer) ?? asRecord(loan.customerDetails) ?? asRecord(loan.applicant);

/** Product label for a loan row. */
export const loanProductName = (loan: FranchiseCustomerLoan): string => {
  const row = loan as Row;
  return pickString(row, ["loanType", "loanName", "product", "productName", "type"]) ?? "Loan application";
};

/** The application number the status endpoint takes back. */
export const loanApplicationNo = (loan: FranchiseCustomerLoan): string => {
  const row = loan as Row;
  return (
    pickString(row, ["applicationNo", "applicationNumber", "applicationId", "referenceNo"]) ??
    loan._id
  );
};

export const loanStatus = (loan: FranchiseCustomerLoan): string => {
  const row = loan as Row;
  return pickString(row, ["status", "applicationStatus", "loanStatus", "stage"]) ?? "Pending";
};

export const loanAmount = (loan: FranchiseCustomerLoan): number | undefined => {
  const row = loan as Row;
  return pickNumber(row, ["loanAmount", "amount", "requestedAmount", "loanValue", "loan_amount"]);
};

export const loanSubmittedAt = (loan: FranchiseCustomerLoan): string | undefined => {
  const row = loan as Row;
  return pickString(row, ["createdAt", "submittedAt", "appliedAt", "created_on", "date"]);
};

export const loanUpdatedAt = (loan: FranchiseCustomerLoan): string | undefined => {
  const row = loan as Row;
  return pickString(row, ["updatedAt", "lastUpdated", "statusUpdatedAt", "modifiedAt"]);
};

export const loanCustomerName = (loan: FranchiseCustomerLoan): string | undefined => {
  const row = loan as Row;
  return (
    pickString(row, ["customerName", "applicantName", "fullName"]) ??
    pickString(customerRecord(row), ["fullName", "name"])
  );
};

export const loanCustomerMobile = (loan: FranchiseCustomerLoan): string | undefined => {
  const row = loan as Row;
  return (
    pickString(row, ["customerMobile", "mobile"]) ??
    pickString(customerRecord(row), ["mobile", "mobileNumber"])
  );
};

export const loanCustomerEmail = (loan: FranchiseCustomerLoan): string | undefined => {
  const row = loan as Row;
  return (
    pickString(row, ["customerEmail", "email"]) ??
    pickString(customerRecord(row), ["email"])
  );
};

/** The registry `_id` behind a loan row, used for the status endpoint. */
export const loanCustomerId = (loan: FranchiseCustomerLoan): string | undefined => {
  const row = loan as Row;
  const direct = pickString(row, ["franchiseCustomerId", "customerId", "franchise_customer_id"]);
  if (direct) return direct;
  if (typeof row.customer === "string" && row.customer.trim()) return row.customer.trim();
  return pickString(customerRecord(row), ["_id", "id"]);
};

export const loanRemark = (loan: FranchiseCustomerLoan): string | undefined => {
  const row = loan as Row;
  return pickString(row, ["remarks", "remark", "statusMessage", "message", "note", "description"]);
};

// ── Dates and money ─────────────────────────────────────────────────────────

const EMDASH = "—";

/** Rupees with Indian digit grouping, e.g. 1250000 → ₹12,50,000. */
export const formatRupees = (value?: number | null): string =>
  typeof value === "number" && Number.isFinite(value)
    ? `₹${Math.round(value).toLocaleString("en-IN")}`
    : EMDASH;

/** Compact rupee label for tiles, e.g. 1250000 → ₹12.5L. */
export const formatRupeesCompact = (value?: number | null): string => {
  if (typeof value !== "number" || !Number.isFinite(value)) return EMDASH;
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(value >= 100000000 ? 0 : 2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(value >= 1000000 ? 0 : 1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${Math.round(value)}`;
};

export const formatDate = (value?: string | null): string => {
  if (!value) return EMDASH;
  // Date-only values are calendar dates, not instants: parse them in local time
  // so a timezone behind UTC cannot shift the displayed day.
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return EMDASH;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export const dateValue = (value?: string | null): number => {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};

export const sortLoansNewestFirst = (loans: FranchiseCustomerLoan[]): FranchiseCustomerLoan[] =>
  [...loans].sort((a, b) => dateValue(loanSubmittedAt(b)) - dateValue(loanSubmittedAt(a)));

export const fullNameInitials = (name?: string): string =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "FP";

// ── Status presentation ─────────────────────────────────────────────────────

export interface StatusTone {
  bg: string;
  border: string;
  text: string;
  dot: string;
}

/** Colour family for a status string, matched loosely so backend wording can vary. */
export const statusTone = (status?: string): StatusTone => {
  const normalized = (status ?? "").trim().toLowerCase().replace(/[_-]+/g, " ");

  if (/disburs|sanction|approv|complete|closed|active|success/.test(normalized)) {
    return { bg: "#e9f7f2", border: "#bde6d8", text: "#0f766e", dot: "#26ae90" };
  }
  if (/reject|declin|cancel|fail|expired/.test(normalized)) {
    return { bg: "#fef2f2", border: "#f5c6c6", text: "#b3261e", dot: "#ef4444" };
  }
  if (/pending|submit|review|process|progress|new|hold|await/.test(normalized)) {
    return { bg: "#fff8e6", border: "#f2e2b6", text: "#8a5a00", dot: "#e0a800" };
  }
  return { bg: "var(--brand-navy-14)", border: "var(--brand-navy-22)", text: "var(--brand-navy)", dot: "var(--brand-navy)" };
};

const IN_PROGRESS = /pending|submit|review|process|progress|new|hold|await/;
const POSITIVE = /disburs|sanction|approv|complete|closed|active|success/;

export const isLoanInProgress = (loan: FranchiseCustomerLoan): boolean =>
  IN_PROGRESS.test(loanStatus(loan).toLowerCase());

export const isLoanPositive = (loan: FranchiseCustomerLoan): boolean =>
  POSITIVE.test(loanStatus(loan).toLowerCase());
