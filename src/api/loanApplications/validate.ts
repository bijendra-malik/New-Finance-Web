import { MOBILE_REGEX, PAN_REGEX, PINCODE_REGEX, EMAIL_REGEX } from "../../utils/validation";

export interface ApplicationValidationResult {
  ok: boolean;
  errors: string[];
}

const NUMERIC_FIELDS = new Set<string>([
  "loanAmount", "loanTenure", "monthlyNetSalary", "monthlySalary",
  "existingEMI", "existingLoanAmount",
  "collateralPropertyMarketValue", "collateralPropertyAge",
  "buyingPropertyMarketValue", "buyingPropertyAge",
  "leasePropertyMarketValue", "leasePropertyAge", "leasePropertyDuration",
  "monthlyLeaseIncome", "totalLeaseAmount",
  "totalProjectCost", "ownInvestment", "ownInvestmentAmount",
  "otsOfferAmount", "npaPrincipalLoanAmount", "npaCurrentOutstandingAmount",
  "companyEvaluationValue", "equityShareOffered",
  "valueOfOneShare", "quantityOfShare", "totalShareValue",
  "goldWeight", "jewelryGoldWeight", "jewelryStoneWeight", "jewelryOtherMaterialWeight",
  "lastYearTurnover", "last2YearsTurnover", "lastYearNetIncome", "last2YearsNetIncome",
  "currentYearTurnover", "priorYearTurnover", "currentYearNetIncome", "previousYearNetIncome",
  "courseDuration",
]);

/** Fields that must be arrays of strings when present. */
const STRING_ARRAY_FIELDS = new Set<string>([
  "existingBanks", "existingBanksOther", "otherBankList",
  "existingLoanTypes", "existingLoanTypesOther", "otherLoanList",
  "transactionBanks", "filmLanguages", "starCastNames",
]);

/** Fields that must be parseable date strings when present. */
const DATE_FIELDS = new Set<string>(["dob", "businessEstablishedDate", "createdAt", "updatedAt"]);

/** Personal block present on every product's application. */
const REQUIRED_PERSONAL = [
  "fullName", "mobile", "email", "dob", "panNumber", "state", "city", "pincode", "residenceStatus",
] as const;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const isDateString = (v: unknown): boolean =>
  typeof v === "string" && !Number.isNaN(new Date(v).getTime());

/** "Multiple Transaction Banks" comes as a string OR a { displayName, banks } object. */
const isTxnBank = (v: unknown): boolean => {
  if (typeof v === "string") return true;
  if (!isRecord(v)) return false;
  const { displayName, banks } = v;
  if (displayName !== undefined && typeof displayName !== "string") return false;
  if (banks !== undefined && !(Array.isArray(banks) && banks.every(b => typeof b === "string"))) return false;
  return true;
};

const toFiniteNumber = (v: unknown): number | null => {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string" && /^\d+(\.\d+)?$/.test(v.trim())) return parseFloat(v.trim());
  return null;
};

/** Validates one application object against the API format. Collects ALL problems, not just the first. */
export const validateApplication = (raw: unknown): ApplicationValidationResult => {
  const errors: string[] = [];
  if (!isRecord(raw)) return { ok: false, errors: ["application must be an object"] };
  const app = raw;

  // ── Envelope ──
  if (typeof app._id !== "string" || !app._id.trim()) errors.push("_id: non-empty string required");
  if (typeof app.user !== "string") errors.push("user: string required");
  if (typeof app.loanType !== "string" || !app.loanType.trim()) errors.push("loanType: non-empty string required");
  if (typeof app.employmentType !== "string" || !app.employmentType.trim()) errors.push("employmentType: non-empty string required");
  if (typeof app.status !== "string" || !app.status.trim()) errors.push("status: non-empty string required");
  if (!isDateString(app.createdAt)) errors.push("createdAt: parseable date string required");
  if (app.updatedAt !== undefined && !isDateString(app.updatedAt)) errors.push("updatedAt: parseable date string required");

  // ── Personal details (common to every product) ──
  for (const key of REQUIRED_PERSONAL) {
    const v = app[key];
    if (typeof v !== "string" || !v.trim()) { errors.push(`${key}: non-empty string required`); continue; }
    if (key === "mobile" && !MOBILE_REGEX.test(v)) errors.push(`mobile: expected 10 digits, got "${v}"`);
    if (key === "email" && !EMAIL_REGEX.test(v)) errors.push(`email: invalid format "${v}"`);
    if (key === "panNumber" && !PAN_REGEX.test(v.toUpperCase())) errors.push(`panNumber: invalid PAN "${v}"`);
    if (key === "pincode" && !PINCODE_REGEX.test(v)) errors.push(`pincode: expected 6-digit pincode, got "${v}"`);
  }

  // ── Typed + free-form fields ──
  for (const [key, value] of Object.entries(app)) {
    if (key === "sections") continue; // redundant grouped copy of the flat fields — allowed, not read
    if (key === "transactionBankName") {
      if (value !== undefined && value !== null && !isTxnBank(value)) {
        errors.push("transactionBankName: expected string or { displayName?, banks? }");
      }
      continue;
    }
    if (NUMERIC_FIELDS.has(key)) {
      if (value === undefined || value === null) continue; // absent/optional
      const n = toFiniteNumber(value);
      if (n === null) { errors.push(`${key}: expected non-negative number, got ${JSON.stringify(value)}`); continue; }
      if (n < 0) errors.push(`${key}: must be >= 0, got ${n}`);
      continue;
    }
    if (STRING_ARRAY_FIELDS.has(key)) {
      if (value !== undefined && value !== null && !(Array.isArray(value) && value.every(x => typeof x === "string"))) {
        errors.push(`${key}: expected an array of strings`);
      }
      continue;
    }
    if (DATE_FIELDS.has(key)) {
      if (value !== undefined && value !== null && !isDateString(value)) errors.push(`${key}: parseable date string required`);
      continue;
    }
    // Any other key must be a primitive or a string array — catches nested objects/arrays of the wrong shape drifting in from the backend.
    const okPrimitive = value === null || value === undefined || ["string", "number", "boolean"].includes(typeof value);
    const okArray = Array.isArray(value) && value.every(x => typeof x === "string");
    if (!okPrimitive && !okArray) errors.push(`${key}: unexpected value type`);
  }

  return { ok: errors.length === 0, errors };
};

/** Returns a type-preserved copy with numeric strings coerced to numbers, or null when the record is invalid. */
export const sanitizeApplication = <T>(raw: unknown): T | null => {
  if (!validateApplication(raw).ok || !isRecord(raw)) return null;
  const out: Record<string, unknown> = { ...raw };
  for (const key of NUMERIC_FIELDS) {
    if (key in out) {
      const n = toFiniteNumber(out[key]);
      if (n !== null) out[key] = n;
    }
  }
  return out as T;
};

/** Filters a GET /{product}/applications list, keeping only well-formed records. */
export const sanitizeApplicationList = <T>(data: unknown): { valid: T[]; invalid: number } => {
  const list = Array.isArray(data) ? data : [];
  const valid: T[] = [];
  let invalid = 0;
  for (const item of list) {
    const app = sanitizeApplication<T>(item);
    if (app) valid.push(app); else invalid++;
  }
  return { valid, invalid };
};
