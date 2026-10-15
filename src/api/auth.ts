import axiosInstance from "./axiosInstance";

/** Alias kept for backwards compatibility with franchise.ts */
export type RegisterPayload = RegistrationPayload;

/** Alias kept for backwards compatibility with franchise.ts */
export type RegisterResponse = AuthActionResponse;

export interface RegistrationPayload {
  name: string;
  email: string;
  mobile: string;
  dob: string;
  panNumber: string;
  continent: string;
  country: string;
}

export interface AuthActionResponse {
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
  franchiseStatus?: string;
  continent?: string;
  country?: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

/** Alias kept for backwards compatibility with franchise.ts */
export type RegisteredAccount = ApiUser;

export interface VerifyOTPResponse {
  success: boolean;
  token: string;
  user: ApiUser;
}

export interface ProfileResponse {
  success: boolean;
  user: ApiUser;
}

/** Register a new customer account and send its verification OTP. POST /auth/register */
export const register = async (
  payload: RegistrationPayload,
): Promise<AuthActionResponse> => {
  const response = await axiosInstance.post<AuthActionResponse>(
    "/auth/register",
    payload,
    { withCredentials: true },
  );
  return response.data;
};

/** Alias kept for backwards compatibility with franchise.ts */
export const registerUser = register;

/** Verify the OTP and receive the customer bearer token. POST /auth/verify-otp */
export const verifyOTP = async (
  payload: VerifyOTPPayload,
): Promise<VerifyOTPResponse> => {
  const response = await axiosInstance.post<VerifyOTPResponse>(
    "/auth/verify-otp",
    payload,
    { withCredentials: true },
  );
  return response.data;
};

/** Fetch the authenticated customer profile. GET /auth/customer/profile */
export const fetchProfile = async (): Promise<ProfileResponse> => {
  const response = await axiosInstance.get<ProfileResponse>("/auth/customer/profile");
  return response.data;
};
