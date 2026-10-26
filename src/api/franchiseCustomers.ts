// Franchise customer registry + franchise-initiated loan applications.
//
// Endpoints (all authenticated with the user bearer token):
//   POST /franchise/customer/register          — register a new client
//   GET  /franchise/customer                   — every client under this franchise
//   GET  /franchise/customer/:id               — one client's registered details
//   POST /franchise/customer/:slug/applyloan   — apply on a client's behalf
//                                                 (slug e.g. "personal")
//   POST /franchise/customer/:id/loans         — a client's loans
//   GET  /franchise/customer/:id/loans/:applicationNo — one loan's status
//   GET  /franchise/customer/:id/draft         — a client's in-progress application draft
//   DELETE /franchise/customer/:id/draft       — discard that draft
//   GET  /franchise/loans                      — every loan filed by this franchise
//   GET  /franchise/status                     — this franchise's agreement status
//
// If the backend changes a path or payload shape, change only this module.

import axios from "axios";
import axiosInstance from "./axiosInstance";
import { getApiFieldErrors, type ApiFieldErrors } from "../utils/apiError";
import type { CreditScoreResponse } from "./customer";

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
  isVerified?: boolean;
  verifiedAt?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FranchiseCustomersResponse {
  success: boolean;
  message?: string;
  data?: FranchiseCustomer[] | { customers?: FranchiseCustomer[] };
  customers?: FranchiseCustomer[];
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
  data?: FranchiseCustomerLoan[] |
  {
    applications?: FranchiseCustomerLoan[];
    loans?: FranchiseCustomerLoan[]
  };
}

export interface FranchiseLoanListResponse {
  success: boolean;
  message?: string;
  data?: FranchiseCustomerLoan[] |
  {
    applications?: FranchiseCustomerLoan[];
    loans?: FranchiseCustomerLoan[]
  };
  loans?: FranchiseCustomerLoan[];
  applications?: FranchiseCustomerLoan[];
}

export interface FranchiseCustomerDetailsResponse {
  success: boolean;
  message?: string;
  data?: FranchiseCustomer |
  {
    customer?: FranchiseCustomer
  };
  customer?: FranchiseCustomer;
}

export interface FranchiseStatusResponse {
  success: boolean;
  message?: string;
  status?: string;
  franchiseStatus?: string;
}

/** The draft application a franchise is filing for one client. */
export interface FranchiseCustomerDraft {
  draftId?: string;
  _id?: string;
  product?: string;
  loanKey?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface FranchiseCustomerDraftResponse {
  success: boolean;
  message?: string;
  data?: FranchiseCustomerDraft | { draft?: FranchiseCustomerDraft } | null;
  draft?: FranchiseCustomerDraft;
}

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

const unwrapList = <T>(
  res: { data?: unknown },
  keys: readonly string[],
  fallback: string,
): { ok: true; items: T[] } | { ok: false; message: string } => {
  const body = res.data as Record<string, unknown> | undefined;
  if (!body) return { ok: false, message: fallback };

  const candidates: unknown[] = [body, body.data];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return { ok: true, items: candidate as T[] };
    if (candidate && typeof candidate === "object") {
      const record = candidate as Record<string, unknown>;
      for (const key of keys) {
        const value = record[key];
        if (Array.isArray(value)) return { ok: true, items: value as T[] };
      }
    }
  }

  const message = typeof body.message === "string" && body.message.trim() ? body.message : fallback;
  return { ok: false, message };
};

const unwrapObject = <T>(
  res: { data?: unknown },
  keys: readonly string[],
  fallback: string,
): { ok: true; item: T } | { ok: false; message: string } => {
  const body = res.data as Record<string, unknown> | undefined;
  if (!body) return { ok: false, message: fallback };

  const data =
    body.data && typeof body.data === "object" && !Array.isArray(body.data)
      ? (body.data as Record<string, unknown>)
      : undefined;
  const candidates: unknown[] = [data?.customer, body.customer, data, body];
  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) continue;
    const record = candidate as Record<string, unknown>;
    if (keys.some((key) => record[key] !== undefined && record[key] !== null)) {
      return { ok: true, item: candidate as T };
    }
  }

  const message = typeof body.message === "string" && body.message.trim() ? body.message : fallback;
  return { ok: false, message };
};

// ── API calls ────────────────────────────────────────────────────────────────

/**
 * Register a new client for this franchise.
 * POST /franchise/customer/register
 */
export const registerFranchiseCustomer = async (
  payload: FranchiseCustomerPayload,
): Promise<
  | { ok: true; customer: FranchiseCustomer | null; message: string }
  | { ok: false; message: string; fieldErrors: ApiFieldErrors }
> => {
  try {
    const res = await axiosInstance.post<RegisterCustomerResponse>(
      "/franchise/customer/register",
      payload,
    );
    const unwrapped = unwrap<FranchiseCustomer | { customer?: FranchiseCustomer } | undefined>(
      res,
      "The customer was registered.",
    );
    if (!unwrapped.ok) return { ok: false, message: unwrapped.message, fieldErrors: {} };
    const registered = unwrapped.data;
    const customer =
      registered && typeof registered === "object" && "_id" in registered
        ? (registered as FranchiseCustomer)
        : ((registered as { customer?: FranchiseCustomer } | undefined)?.customer ?? null);
    return { ok: true, customer, message: res.data?.message || "Customer registered." };
  } catch (err) {
    return {
      ok: false,
      message: franchisePortalError(err, "Could not register the customer."),
      fieldErrors: getApiFieldErrors(err),
    };
  }
};

export interface FranchiseCustomerOtpRequestPayload {
  mobile: string;
}

export interface FranchiseCustomerOtpVerifyPayload {
  mobile: string;
  otp: string;
}

export const requestFranchiseCustomerVerifyOtp = async (
  payload: FranchiseCustomerOtpRequestPayload,
): Promise<{ ok: true; message: string } | { ok: false; message: string }> => {
  try {
    const res = await axiosInstance.post<{ success?: boolean; message?: string }>(
      "/franchise/customer/verify-otp",
      payload,
    );
    const body = res.data;
    if (body?.success !== false) {
      return { ok: true, message: body?.message || "OTP sent successfully." };
    }
    return { ok: false, message: body?.message || "Could not send OTP." };
  } catch (err) {
    return { ok: false, message: franchisePortalError(err, "Could not send OTP.") };
  }
};

/**
 * Verify OTP for franchise customer.
 * POST /franchise/customer/verify-otp
 */
export const verifyFranchiseCustomerOtp = async (
  payload: FranchiseCustomerOtpVerifyPayload,
): Promise<
  | { ok: true; customer?: FranchiseCustomer | null; message: string }
  | { ok: false; message: string }
> => {
  try {
    const res = await axiosInstance.post<{ success?: boolean; message?: string; data?: FranchiseCustomer | { customer?: FranchiseCustomer } }>(
      "/franchise/customer/verify-otp",
      payload,
    );
    const body = res.data;
    if (body?.success !== false) {
      const data = body?.data;
      const customer =
        data && typeof data === "object" && "_id" in data
          ? (data as FranchiseCustomer)
          : ((data as { customer?: FranchiseCustomer } | undefined)?.customer ?? null);
      return { ok: true, customer, message: body?.message || "OTP verified successfully." };
    }
    return { ok: false, message: body?.message || "Invalid OTP." };
  } catch (err) {
    return { ok: false, message: franchisePortalError(err, "Invalid OTP.") };
  }
};

/**
 * Every client registered under this franchise.
 * GET /franchise/customer
 */
export const fetchFranchiseCustomers = async (): Promise<
  { ok: true; customers: FranchiseCustomer[] } | { ok: false; message: string }
> => {
  try {
    const res = await axiosInstance.get<FranchiseCustomersResponse>("/franchise/customer");
    const unwrapped = unwrapList<FranchiseCustomer>(res, ["customers"], "No customers were returned.");
    if (!unwrapped.ok) return { ok: false, message: unwrapped.message };
    return { ok: true, customers: unwrapped.items };
  } catch (err) {
    return { ok: false, message: franchisePortalError(err, "Could not load your customers.") };
  }
};

/**
 * One client's registered details.
 * GET /franchise/customer/:id
 */
export const fetchFranchiseCustomer = async (
  customerId: string,
): Promise<{ ok: true; customer: FranchiseCustomer } | { ok: false; message: string }> => {
  try {
    const res = await axiosInstance.get<FranchiseCustomerDetailsResponse>(
      `/franchise/customer/${encodeURIComponent(customerId)}`,
    );
    const unwrapped = unwrapObject<FranchiseCustomer>(
      res,
      ["fullName", "mobile", "panNumber", "_id"],
      "The customer details were not returned.",
    );
    if (!unwrapped.ok) return { ok: false, message: unwrapped.message };
    return { ok: true, customer: unwrapped.item };
  } catch (err) {
    return { ok: false, message: franchisePortalError(err, "Could not load this customer's details.") };
  }
};

/**
 * A client's loans. `customerId` is the client's registry `_id` (the same value
 * sent as `franchiseCustomerId` when filing), and each row's `applicationNo` is
 * what the status endpoint takes back.
 *
 * POST /franchise/customer/:id/loans — the rows arrive under `data.applications`
 * or `data.loans`.
 */
export const fetchCustomerLoans = async (
  customerId: string,
): Promise<{ ok: true; loans: FranchiseCustomerLoan[] } | { ok: false; message: string }> => {
  try {
    const res = await axiosInstance.get<CustomerLoansResponse>(
      `/franchise/customer/${encodeURIComponent(customerId)}/loans`
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
 * Every loan filed by this franchise, across all of its clients.
 * GET /franchise/loans
 */
export const fetchFranchiseLoans = async (): Promise<
  { ok: true; loans: FranchiseCustomerLoan[] } | { ok: false; message: string }
> => {
  try {
    const res = await axiosInstance.get<FranchiseLoanListResponse>("/franchise/loans");
    const unwrapped = unwrapList<FranchiseCustomerLoan>(
      res,
      ["loans", "applications"],
      "No loans were returned.",
    );
    if (!unwrapped.ok) return { ok: false, message: unwrapped.message };
    return { ok: true, loans: unwrapped.items };
  } catch (err) {
    return { ok: false, message: franchisePortalError(err, "Could not load your franchise's loans.") };
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

/**
 * A client's in-progress application draft, if one is open.
 * GET /franchise/customer/:id/draft
 *
 * A missing draft is reported as `ok: true` with `draft: null` — that is the
 * expected "nothing saved yet" answer, not a failure.
 */
export const fetchFranchiseCustomerDraft = async (
  customerId: string,
): Promise<
  | { ok: true; draft: FranchiseCustomerDraft | null }
  | { ok: false; message: string }
> => {
  try {
    const res = await axiosInstance.get<FranchiseCustomerDraftResponse>(
      `/franchise/customer/${encodeURIComponent(customerId)}/draft`,
    );
    const body = res.data;
    if (body?.success === false) {
      return { ok: false, message: body.message || "The draft could not be loaded." };
    }
    const payload = body?.data;
    const record =
      payload && typeof payload === "object" && !Array.isArray(payload)
        ? (payload as Record<string, unknown>)
        : undefined;
    const candidate =
      (record && "draft" in record ? record.draft : undefined) ??
      body?.draft ??
      payload ??
      null;
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      return { ok: true, draft: null };
    }
    return { ok: true, draft: candidate as FranchiseCustomerDraft };
  } catch (err) {
    return { ok: false, message: franchisePortalError(err, "Could not load this client's draft.") };
  }
};

/**
 * Discard a client's in-progress application draft.
 * DELETE /franchise/customer/:id/draft
 */
export const deleteFranchiseCustomerDraft = async (
  customerId: string,
): Promise<{ ok: true; message: string } | { ok: false; message: string }> => {
  try {
    const res = await axiosInstance.delete<{ success?: boolean; message?: string }>(
      `/franchise/customer/${encodeURIComponent(customerId)}/draft`,
    );
    const body = res.data;
    if (body?.success === false) {
      return { ok: false, message: body.message || "The draft could not be discarded." };
    }
    return { ok: true, message: body?.message || "The draft was discarded." };
  } catch (err) {
    return { ok: false, message: franchisePortalError(err, "Could not discard this client's draft.") };
  }
};

/**
 * The step that turns a franchise application into a submitted one.
 * POST /franchise/customer/:id/credit-score
 */
export const submitFranchiseCreditScore = async (
  customerId: string,
  draftId: string,
  creditScore: number,
): Promise<CreditScoreResponse> => {
  const res = await axiosInstance.post<CreditScoreResponse>(
    `/franchise/customer/${encodeURIComponent(customerId)}/credit-score`,
    { draftId, creditScore, franchiseCustomerId: customerId },
  );
  return res.data;
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
