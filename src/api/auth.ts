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
  loanSlug: string,
  payload: RegistrationPayload,
): Promise<AuthActionResponse> => {
  const response = await axiosInstance.post<AuthActionResponse>(
    `/auth/${loanSlug}`,
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

export const fetchProfile = async (): Promise<ProfileResponse> => {
  const response = await axiosInstance.get<ProfileResponse>("/auth/customer/profile");
  return response.data;
};
