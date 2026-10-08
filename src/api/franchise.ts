import axiosInstance from "./axiosInstance";
import { registerUser } from "./auth";
import type { RegisterPayload, RegisterResponse, RegisteredAccount } from "./auth";

// ── Types ────────────────────────────────────────────────────────────────────────

/**
 * Franchise registration is the shared /auth/register call with the franchise
 * role, so the payload and response reuse the auth module's types instead of
 * restating the endpoint's contract here.
 */
export type RegisterFranchisePayload = RegisterPayload & { role: "Franchise" };
export type RegisterFranchiseResponse = RegisterResponse;

/** The franchise account record returned by the franchise endpoints. */
export interface FranchiseAccount extends RegisteredAccount {
  /** The franchise status surfaced by the profile endpoint. */
  franchiseStatus?: "Pending" | "Active" | "Suspended" | string;
}

export interface FranchiseProfileResponse {
  success: boolean;
  franchise?: FranchiseAccount;
}

export interface ApplyFranchisePayload {
  panNumber: string;
  state: string;
  city: string;
  package: string;
  pincode: string;
  businessName: string;
  businessType: string;
  gstNumber: string;
  address: string;
  yearsInBusiness: string;
}

export interface ApplyFranchiseResponse {
  success: boolean;
  message: string;
  franchiseStatus: string;
  franchise?: RegisteredAccount;
}

export interface FranchiseLoginPayload {
  /** The franchisee ID as issued by the backend, e.g. "FRN000003". */
  franchiseId: string;
  /** Password as issued to the franchisee. */
  password: string;
}

export interface FranchiseLoginResponse {
  success: boolean;
  message: string;
  /** Filled by the backend on success so the caller can distinguish auth failure from unknown-user. */
  franchiseId?: string;
  token?: string;
}

// ── API calls ───────────────────────────────────────────────────────────────────

/**
 * Register a new franchise user and (on the backend) send any required verification OTP.
 *
 * This is the shared POST /auth/register endpoint, called through auth.ts — the
 * franchise difference is the `role` field, not a second endpoint.
 */
export const registerFranchise = async (
  payload: RegisterFranchisePayload,
): Promise<RegisterFranchiseResponse> => registerUser(payload);

/**
 * Fetch the authenticated franchise profile (requires a bearer token in the request).
 * GET /auth/franchise/profile
 */
export const fetchFranchiseProfile = async (): Promise<FranchiseProfileResponse> => {
  const response = await axiosInstance.get<FranchiseProfileResponse>(
    "/auth/franchise/profile",
  );
  return response.data;
};

/**
 * Submit a franchise application.
 * POST /franchise/apply
 */
export const applyFranchise = async (
  payload: ApplyFranchisePayload,
): Promise<ApplyFranchiseResponse> => {
  const response = await axiosInstance.post<ApplyFranchiseResponse>(
    "/franchise/apply",
    payload,
  );
  return response.data;
};

/**
 * Login a franchise user with the issued franchise ID and password.
 * POST /franchise/login
 */
export const loginFranchise = async (
  payload: FranchiseLoginPayload,
): Promise<FranchiseLoginResponse> => {
  const response = await axiosInstance.post<FranchiseLoginResponse>(
    "/franchise/login",
    payload,
    { withCredentials: true },
  );
  return response.data;
};
