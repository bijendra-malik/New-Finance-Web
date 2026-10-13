// Franchise customer registry + franchise-initiated loan applications.
//
// Endpoints (all authenticated with the user bearer token):
//   POST /franchise/customer/register          — register a new client
//   GET  /franchise/customers                  — every client under this franchise
//   POST /franchise/customer/:slug/applyloan   — apply on a client's behalf
//                                                 (slug e.g. "personal")
//   GET  /franchise/customer/:id/loans         — a client's loans
//   GET  /franchise/customer/:id/loans/:applicationNo — one loan's status
//   GET  /franchise/status                     — this franchise's agreement status
//
// If the backend changes a path or payload shape, change only this module.

import axios from "axios";
import axiosInstance from "./axiosInstance";

// ── Types ────────────────────────────────────────────────────────────────────

/** The eight fields POST /franchise/customer/register requires. */
export interface FranchiseCustomerPayload {
  fullName: string;
  mobile: string;
  panNumber: string;
  dob: string;
  email: string;
  state: string;
  city: string;
  pincode: string;
}

/** A registered client of the franchise. */
export interface FranchiseCustomer extends FranchiseCustomerPayload {
  _id: string;
  franchiseId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FranchiseCustomersResponse {
  success: boolean;
  message?: string;
  data?: FranchiseCustomer[];
}

export interface RegisterCustomerResponse {
  success: boolean;
  message?: string;
  data?: FranchiseCustomer;
}

/** A loan filed by the franchise on a client's behalf. */
export interface FranchiseCustomerLoan {
  _id: string;
  applicationNo?: string;
  loanType?: string;
  status?: string;
  loanAmount?: number;
  createdAt?: string;
  [key: string]: unknown;
}

export interface CustomerLoansResponse {
  success: boolean;
  message?: string;
  data?: FranchiseCustomerLoan[];
}

export interface FranchiseStatusResponse {
  success: boolean;
  message?: string;
  status?: string;
  franchiseStatus?: string;
}

/**
 * Backend path segment for each portal product key. The personal-loan slug is
 * confirmed ("personal"); the rest follow the same one-word pattern and are
 * mapped here so a mismatch is a one-line fix.
 */
const PRODUCT_SLUGS: Record<string, string> = {
  "personal-loan": "personal",
  "business-loan": "business",
  "home-loan": "home",
  "loan-against-property": "lap",
  "balance-transfer": "balance-transfer",
  "project-loan": "project",
  "vehicle-loan": "vehicle",
  "education-loan": "education",
  "credit-card": "credit-card",
  "commercial-purchase": "commercial-purchase",
  "working-capital": "working-capital",
  "lease-rental-discounting": "lrd",
  "od-cc-limit": "od-cc-limit",
  "loan-against-share": "las",
  "film-funding": "film-funding",
  npa: "npa",
  "gold-loan": "gold",
  fdi: "fdi",
};

export const productSlug = (productKey: string): string =>
  PRODUCT_SLUGS[productKey] ?? productKey;

// ── Shared response unwrap ───────────────────────────────────────────────────

type DataEnvelope = { success: boolean; message?: string; data?: unknown };

const unwrap = <T>(
  res: { data?: DataEnvelope },
  fallback: string,
): { ok: true; data: T } | { ok: false, message: string } => {
  const body = res.data;
  if (!body) return { ok: false, message: fallback };
  if (body.success && body.data !== undefined && body.data !== null) {
    return { ok: true, data: body.data as T };
  }
  return { ok: false, message: body.message || fallback };
};

/**
 * Read a list out of an endpoint's `data` payload.
 *
 * The franchise service wraps collections under their own key — the client's loans
 * arrive as `data.applications` — so the named key is preferred and a bare array is
 * still accepted, which keeps the portal working if a list endpoint is flattened.
 */
const unwrapList = <T>(
  res: { data?: DataEnvelope },
  keys: readonly string[],
  fallback: string,
): { ok: true; items: T[] } | { ok: false; message: string } => {
  const unwrapped = unwrap<unknown>(res, fallback);
  if (!unwrapped.ok) return { ok: false, message: unwrapped.message };
  const payload = unwrapped.data;
  if (Array.isArray(payload)) return { ok: true, items: payload as T[] };
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of keys) {
      const value = record[key];
      if (Array.isArray(value)) return { ok: true, items: value as T[] };
    }
  }
  return { ok: false, message: fallback };
};

// ── API calls ────────────────────────────────────────────────────────────────

/**
 * Register a new client for this franchise.
 * POST /franchise/customer/register
 */
export const registerFranchiseCustomer = async (
  payload: FranchiseCustomerPayload,
): Promise<{ ok: true; customer: FranchiseCustomer | null; message: string } | { ok: false; message: string }> => {
  try {
    const res = await axiosInstance.post<RegisterCustomerResponse>(
      "/franchise/customer/register",
      payload,
    );
    const unwrapped = unwrap<FranchiseCustomer | { customer?: FranchiseCustomer } | undefined>(
      res,
      "The customer was registered.",
    );
    if (!unwrapped.ok) return { ok: false, message: unwrapped.message };
    const registered = unwrapped.data;
    // The registered record may arrive directly or wrapped under `customer`; its
    // `_id` is what every later call files against (franchiseCustomerId, :ID).
    const customer =
      registered && typeof registered === "object" && "_id" in registered
        ? (registered as FranchiseCustomer)
        : ((registered as { customer?: FranchiseCustomer } | undefined)?.customer ?? null);
    return { ok: true, customer, message: res.data?.message || "Customer registered." };
  } catch (err) {
    return { ok: false, message: franchisePortalError(err, "Could not register the customer.") };
  }
};

/**
 * Every client registered under this franchise.
 * GET /franchise/customers
 */
export const fetchFranchiseCustomers = async (): Promise<
  { ok: true; customers: FranchiseCustomer[] } | { ok: false; message: string }
> => {
  try {
    const res = await axiosInstance.get<FranchiseCustomersResponse>("/franchise/customers");
    const unwrapped = unwrapList<FranchiseCustomer>(res, ["customers"], "No customers were returned.");
    if (!unwrapped.ok) return { ok: false, message: unwrapped.message };
    return { ok: true, customers: unwrapped.items };
  } catch (err) {
    return { ok: false, message: franchisePortalError(err, "Could not load your customers.") };
  }
};

/**
 * Apply for a loan on a client's behalf.
 * POST /franchise/customer/:slug/applyloan
 */
export const applyFranchiseCustomerLoan = async <TPayload extends object>(
  productKey: string,
  payload: TPayload & { franchiseCustomerId: string },
): Promise<{ ok: true; data: FranchiseCustomerLoan } | { ok: false; message: string }> => {
  try {
    const res = await axiosInstance.post<{ success: boolean; message?: string; data?: FranchiseCustomerLoan }>(
      `/franchise/customer/${productSlug(productKey)}/applyloan`,
      payload,
    );
    const unwrapped = unwrap<FranchiseCustomerLoan>(res, "Submission failed.");
    if (!unwrapped.ok) return { ok: false, message: unwrapped.message };
    return { ok: true, data: unwrapped.data };
  } catch (err) {
    return { ok: false, message: franchisePortalError(err, "Submission failed. Please try again.") };
  }
};

/**
 * A client's loans. `customerId` is the client's registry `_id` (the same value
 * sent as `franchiseCustomerId` when filing), and each row's `applicationNo` is
 * what the status endpoint takes back.
 *
 * GET /franchise/customer/:id/loans — the rows arrive under `data.applications`.
 */
export const fetchCustomerLoans = async (
  customerId: string,
): Promise<{ ok: true; loans: FranchiseCustomerLoan[] } | { ok: false; message: string }> => {
  try {
    const res = await axiosInstance.get<CustomerLoansResponse>(
      `/franchise/customer/${encodeURIComponent(customerId)}/loans`,
    );
    const unwrapped = unwrapList<FranchiseCustomerLoan>(
      res,
      ["applications", "loans"],
      "No loans were returned.",
    );
    if (!unwrapped.ok) return { ok: false, message: unwrapped.message };
    return { ok: true, loans: unwrapped.items };
  } catch (err) {
    return { ok: false, message: franchisePortalError(err, "Could not load this client's loans.") };
  }
};

/**
 * One loan application's status.
 * GET /franchise/customer/:id/loans/:applicationNo
 *
 * `applicationNo` is the application number reported by the client's loan list.
 */
export const fetchCustomerLoanStatus = async (
  customerId: string,
  applicationNo: string,
): Promise<{ ok: true; loan: FranchiseCustomerLoan } | { ok: false; message: string }> => {
  try {
    const res = await axiosInstance.get<CustomerLoansResponse>(
      `/franchise/customer/${encodeURIComponent(customerId)}/loans/${encodeURIComponent(applicationNo)}`,
    );
    const unwrapped = unwrap<FranchiseCustomerLoan | FranchiseCustomerLoan[] | { applications?: FranchiseCustomerLoan[] }>(
      res,
      "The loan status was not returned.",
    );
    if (!unwrapped.ok) return { ok: false, message: unwrapped.message };
    const payload = unwrapped.data;
    const first = Array.isArray(payload)
      ? payload[0]
      : payload && typeof payload === "object" && Array.isArray(payload.applications)
        ? payload.applications[0]
        : payload;
    if (!first) return { ok: false, message: "The loan status was not returned." };
    return { ok: true, loan: first };
  } catch (err) {
    return { ok: false, message: franchisePortalError(err, "Could not load the loan status.") };
  }
};

/**
 * This franchise's agreement status, straight from the backend.
 * GET /franchise/status
 */
export const fetchFranchiseStatus = async (): Promise<
  { ok: true; status: string } | { ok: false; message: string }
> => {
  try {
    const res = await axiosInstance.get<FranchiseStatusResponse>("/franchise/status");
    const body = res.data;
    let status = body?.franchiseStatus;
    if (body?.success && typeof status === "string" && status.trim()) {
      if (status.trim().toLowerCase() === "none") {
        status = "";
      }
      return { ok: true, status: status.trim() };
    }
    return { ok: false, message: body?.message || "The franchise status was not reported." };
  } catch (err) {
    return { ok: false, message: franchisePortalError(err, "Could not load your franchise status.") };
  }
};

// ── Errors ───────────────────────────────────────────────────────────────────

/** Shared error surface for franchise portal calls. */
export const franchisePortalError = (
  err: unknown,
  fallback = "The franchise service could not complete this request.",
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    if (status === 401) return "Your franchise session expired. Sign in again and retry.";
    if (status === 403) return "This franchise account is not permitted to do that right now.";
    const data = err.response?.data as { message?: unknown } | undefined;
    if (data && typeof data.message === "string" && data.message.trim()) return data.message;
    if (status) return `The franchise service responded with an error (${status}).`;
    return "Could not reach the franchise service. Check your connection and try again.";
  }
  if (err && typeof err === "object" && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return fallback;
};
