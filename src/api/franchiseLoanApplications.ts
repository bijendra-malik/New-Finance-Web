// Franchise-initiated loan applications.
//
// A franchisor filling a form on a customer's behalf authenticates the loan-apply
// call with the user bearer token (token). The shared axiosInstance now attaches
// that token to every request, so this module does not need its own axios instance
// or a separate franchise session key.
// Every submit also carries the franchisor's identity so the backend can keep
// an audit trail of who entered the application. The field name matches the
// backend's expected wire format (franchisorId on the payload). If the backend
// later changes that contract, change only this file.

import axios from "axios";
import {
  readFranchiseSession,
  type FranchiseSession,
} from "../utils/franchiseSession";

// The franchise bearer-token client now lives in ./franchiseClient and is
// shared with the customer-registry module; the interceptors (token attach +
// 401 clear) are configured there.

/**
 * Customer identity the franchisor is applying on behalf of.
 * These are the fields most loan-apply payloads already include, so the
 * franchisor form collects them and they are passed through unchanged.
 */
export interface FranchiseCustomerIdentity {
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  panNumber: string;
  state: string;
  city: string;
  pincode: string;
  residenceStatus: string;
  residenceStatusOther?: string;
}

/**
 * The session of the franchisor submitting the application.
 */
export interface FranchiseSubmitContext {
  session: FranchiseSession;
  /** Stable franchisee ID, e.g. "FRN000003". */
  franchiseId: string;
}

/** Map the stored franchise session onto a submit context. */
export const franchiseSubmitContext = (): FranchiseSubmitContext | null => {
  const session = readFranchiseSession();
  if (!session?.franchiseId) return null;
  return { session, franchiseId: session.franchiseId };
};

/**
 * Build a POST body from a product payload plus the franchisor identity.
 * The spread order keeps the product-specific fields first so that a backend
 * that ignores unknown fields still receives everything it expects; the
 * franchisor fields are appended last and ignored silently where the backend
 * does not yet model them.
 */
export const attachFranchiseContext = <TPayload extends object>(
  payload: TPayload,
  ctx: FranchiseSubmitContext,
): TPayload & { franchisorId: string; franchiseeName?: string; franchiseeMobile?: string } => {
  const out = payload as Record<string, unknown> & {
    franchisorId: string;
    franchiseeName?: string;
    franchiseeMobile?: string;
  };
  out.franchisorId = ctx.franchiseId;
  if (ctx.session.name?.trim()) out.franchiseeName = ctx.session.name.trim();
  if (ctx.session.mobile?.trim()) out.franchiseeMobile = ctx.session.mobile.trim();
  return out as TPayload & {
    franchisorId: string;
    franchiseeName?: string;
    franchiseeMobile?: string;
  };
};

type ApplyFn<TPayload> = (payload: TPayload) => Promise<{
  success: boolean;
  data: { _id: string; status: string; createdAt: string };
}>;

/**
 * Wrap a product's apply fn so it runs through the franchise client and
 * carries the franchisor identity.
 */
export const wrapFranchiseApply = <TPayload extends object>(
  apply: ApplyFn<TPayload>,
  ctx: FranchiseSubmitContext,
): ApplyFn<TPayload> => {
  return (payload) => apply(attachFranchiseContext(payload, ctx));
};

/** Shared error surface for franchise-initiated applies. */
export interface FranchiseApplyError {
  readonly message: string;
  readonly code?: string;
}

export const franchiseApplyError = (
  err: unknown,
  fallback = "Submission failed. Please try again.",
): FranchiseApplyError => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data;
    if (status === 401) {
      return { message: "Your franchise session expired. Sign in again and try submitting.", code: "FRANCHISE_SESSION_EXPIRED" };
    }
    if (status === 403) {
      return { message: "This franchise account is not permitted to submit applications right now.", code: "FRANCHISE_NOT_PERMITTED" };
    }
    if (data && typeof data === "object" && "message" in data) {
      const msg = (data as { message?: unknown }).message;
      if (typeof msg === "string" && msg.trim()) return { message: msg, code: String(status) };
    }
    return { message: `The loan service responded with an error (${status}).`, code: String(status) };
  }
  if (err && typeof err === "object" && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string" && msg.trim()) return { message: msg };
  }
  return { message: fallback };
};
