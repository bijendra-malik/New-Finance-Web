import axiosInstance from "./axiosInstance";
import { registerUser } from "./auth";

// ── Types ────────────────────────────────────────────────────────────────────────

export interface RegisterFranchisePayload {
  role: "Franchise";
  name: string;
  mobile: string;
  email: string;
  continent: string;
  country: string;
}

export interface RegisterFranchiseResponse {
  success: boolean;
  message: string;
  /** The registered franchisee (returned by the backend when the call succeeds). */
  franchise?: {
    _id: string;
    name: string;
    mobile: string;
    email: string;
    isVerified: boolean;
    role: string;
    continent: string;
    country: string;
    isActive: boolean;
  };
}

export interface FranchiseProfileResponse {
  success: boolean;
  franchise?: {
    _id: string;
    name: string;
    mobile: string;
    email: string;
    role: string;
    continent: string;
    country: string;
    isActive: boolean;
    isVerified: boolean;
    /** The franchise status surfaced by the profile endpoint. */
    franchiseStatus?: "Pending" | "Active" | "Suspended" | string;
  };
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
  franchise?: {
    _id: string;
    name: string;
    mobile: string;
    email: string;
    isVerified: boolean;
    role: string;
    continent: string;
    country: string;
    isActive: boolean;
  };
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
 * POST /auth/register
 */
export const registerFranchise = async (
  payload: RegisterFranchisePayload,
): Promise<RegisterFranchiseResponse> => {
  // Reuse the shared /auth/register endpoint via auth.ts.
  const result = await registerUser(payload);
  return result as RegisterFranchiseResponse;
};

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
