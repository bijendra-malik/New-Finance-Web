import axiosInstance from "./axiosInstance";
import { registerUser } from "./auth";
import type { RegisterPayload, RegisterResponse, RegisteredAccount } from "./auth";

export type RegisterFranchisePayload = RegisterPayload & { role: "Franchise" };
export type RegisterFranchiseResponse = RegisterResponse;

/**
 * The franchise account record returned by the franchise endpoints.
 *
 * The backend profile call wraps the account under `user`, so the response shape
 * stays explicit here instead of being inferred from the auth module's account type.
 */
export interface FranchiseAccount {
  _id?: string;
  name?: string;
  mobile?: string;
  email?: string;
  isVerified?: boolean;
  role?: string;
  continent?: string;
  country?: string;
  isActive?: boolean;
  lastLogin?: string;
  franchiseStatus?: string;
  panNumber?: string;
  state?: string;
  city?: string;
  pincode?: string;
  package?: string;
  createdAt?: string;
  updatedAt?: string;
  franchiseId?: string;
  businessDetails?: {
    businessName?: string;
    businessType?: string;
    gstNumber?: string;
    address?: string;
    yearsInBusiness?: string;
  };
}

export interface FranchiseProfileResponse {
  success: boolean;
  message?: string;
  user?: FranchiseAccount;
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
  franchiseId: string;
  password: string;
}

export interface FranchiseLoginResponse {
  success: boolean;
  message: string;
  franchiseId?: string;
  token?: string;
  /** Agreement status when the backend reports it on a successful sign-in. */
  franchiseStatus?: string;
  /** Verification flag when the backend reports it on a successful sign-in. */
  isVerified?: boolean;
}

// ── API calls ───────────────────────────────────────────────────────────────────

/**
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
