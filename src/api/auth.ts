import axiosInstance from "./axiosInstance";

// ── Types ────────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  name: string;
  mobile: string;
  email: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface LoginPayload {
  mobile: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPPayload {
  mobile: string;
  otp: string;
}

export interface ApiUser {
  _id: string;
  name: string;
  mobile: string;
  email: string;
  isVerified: boolean;
  role: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  token: string;
  user: ApiUser;
}

export interface ProfileResponse {
  success: boolean;
  user: ApiUser;
}

// ── API Calls ────────────────────────────────────────────────────────────────

/**
 * Register a new user and send OTP.
 * POST /auth/register
 */
export const registerUser = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  const response = await axiosInstance.post<RegisterResponse>(
    "/auth/register",
    payload
  );
  return response.data;
};

/**
 * Send OTP to an existing user's mobile for login.
 * POST /auth/login
 */
export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    "/auth/login",
    payload
  );
  return response.data;
};

/**
 * Verify OTP and receive JWT token + user data.
 * POST /auth/login/verify
 */
export const verifyOTP = async (
  payload: VerifyOTPPayload
): Promise<VerifyOTPResponse> => {
  const response = await axiosInstance.post<VerifyOTPResponse>(
    "/auth/login/verify",
    payload
  );
  return response.data;
};

/**
 * Fetch authenticated user profile (requires token in localStorage).
 * GET /auth/profile
 */
export const fetchProfile = async (): Promise<ProfileResponse> => {
  const response = await axiosInstance.get<ProfileResponse>("/auth/profile");
  return response.data;
};
