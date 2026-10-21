import axiosInstance from "./axiosInstance";

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
  draftId?: string;
  data?: { draftId?: string } | null;
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
  isActive: boolean;
  continent?: string;
  country?: string;
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

export const requestLoanApplyOTP = async (
  loanKey: string,
  payload: RegistrationPayload,
): Promise<AuthActionResponse> => {
  const response = await axiosInstance.post<AuthActionResponse>(
    `/auth/${loanKey}`,
    payload,
    { withCredentials: true },
  );
  return response.data;
};

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

export const registerUser = register;

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

// ── Login (POST /auth/login/…) ─────────────────────────────────────────────

export interface LoginPayload {
  mobile: string;
}

/** POST /auth/login/request-otp — sign-in OTP; no registration payload. */
export const requestLoginOTP = async (
  payload: LoginPayload,
): Promise<AuthActionResponse> => {
  const response = await axiosInstance.post<AuthActionResponse>(
    "/auth/login/request-otp",
    payload,
    { withCredentials: true },
  );
  return response.data;
};

/** POST /auth/login/verify-otp — completes the sign-in, returns the session. */
export const verifyLoginOTP = async (
  payload: VerifyOTPPayload,
): Promise<VerifyOTPResponse> => {
  const response = await axiosInstance.post<VerifyOTPResponse>(
    "/auth/login/verify-otp",
    payload,
    { withCredentials: true },
  );
  return response.data;
};

/** The draft id a register response carries, normalised to a non-empty string. */
export const draftIdFromRegister = (
  response: AuthActionResponse,
): string | null => {
  const id = response.draftId ?? response.data?.draftId;
  return typeof id === "string" && id.trim() ? id.trim() : null;
};

export const fetchProfile = async (): Promise<ProfileResponse> => {
  const response = await axiosInstance.get<ProfileResponse>("/auth/customer/profile");
  return response.data;
};
