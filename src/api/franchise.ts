import axiosInstance from "./axiosInstance";

export interface FranchiseAccount {
  _id?: string;
  name?: string;
  mobile?: string;
  email?: string;
  isVerified?: boolean;
  role?: string;
  continent?: string;
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  franchiseStatus?: string;
  panNumber?: string;
  dob?: string;
  package?: string;
  plan?: {
    plan?: string;
    code?: string;
    name?: string;
    durationMonths?: number;
    fee?: number;
    currency?: string;
    gstPercent?: number;
    gstAmount?: number;
    totalWithGst?: number;
    renewalFee?: number;
    renewalNote?: string;
  },
  businessDetails?: {
    businessName?: string;
    businessType?: string;
    gstNumber?: string;
    address?: string;
    yearsInBusiness?: string;
  };
  franchiseId?: string;
  franchiseAppliedAt?: string;
  franchiseApprovedAt?: string;
  franchiseRejectedAt?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface FranchiseCustomer {
  _id?: string;
  franchise?: string;
  franchiseCode?: string;
  fullName?: string;
  mobile?: string;
  panNumber?: string;
  dob?: string;
  email?: string;
  state?: string;
  city?: string;
  pincode?: string;
  isVerified?: boolean;
  verifiedAt?: string | null;
}

// POST /franchise/entry
export interface FranchiseEntryPayload {
  name?: string;
  email?: string;
  mobile?: string;
  dob?: string;
  panNumber?: string;
  continent?: string;
  country?: string;
  planCode?: string;
  businessName?: string;
  businessType?: string;
  gstNumber?: string;
  address?: string;
  yearsInBusiness?: string;
}

// POST /franchise/entry response
export interface FranchiseEntryResponse {
  success: boolean;
  message: string;
  mobileMasked?: string;
}

// POST /franchise/entry/verify
export interface FranchiseVerifyOTPPayload {
  mobile: string;
  otp: string;
}

// POST /franchise/entry/verify response
export interface FranchiseVerifyOTPResponse {
  success: boolean;
  message: string;
  token: string;
  franchiseId?: string;
  plan: {
    code?: string;
    name?: string;
    fee?: number;
  };
  user: FranchiseAccount;
}

// GET /franchise/status response
export interface FranchiseStatusResponse {
  success: boolean;
  message: string;
  franchiseStatus?: string;
  canLogin?: boolean;
}

// GET /franchise/profile response
export interface FranchiseProfileResponse {
  success: boolean;
  franchiseStatus?: string;
  franchise: FranchiseAccount;
}

// GET /franchise/plans
export interface FranchisePlansResponse {
  success: boolean;
  bestValueCode?: string;
  bestValueIsPinned?: boolean;
  selectedPlanCode?: string;
  plans: {
    _id?: string;
    code?: string;
    currency?: string;
    durationMonths?: number;
    features?: string[];
    fee?: number;
    gstPercent?: number;
    isActive?: boolean;
    isBestValue?: boolean;
    name?: string;
    renewalFee?: number;
    renewalNote?: string;
    sortOrder?: number;
    validityLabel?: string;
  }[];
}
// POST /franchise/login
export interface FranchiseLoginPayload {
  franchiseId: string;
  password: string;
}

export interface FranchiseLoginResponse {
  success: boolean;
  message: string;
  token?: string;
  franchise?: FranchiseAccount;
}

// POST /franchise/customer/register
export interface FranchiseCustomerRegisterPayload {
  fullName: string;
  mobile: string;
  panNumber: string;
  dob: string;
  email: string;
  state: string;
  city: string;
  pincode: string;
}

export interface FranchiseCustomerRegisterResponse {
  success: boolean;
  message: string;
  data?: FranchiseCustomer;
}

// POST /franchise/customer/verify-otp
export interface FranchiseCustomerVerifyOTPPayload {
  franchiseCustomerId: string;
  otp: string;
}

export interface FranchiseCustomerVerifyOTPResponse {
  success: boolean;
  message: string;
  customer?: FranchiseCustomer;
}

// ── API calls ───────────────────────────────────────────────────────────────────

export const registerFranchise = async (
  payload: FranchiseEntryPayload,
): Promise<FranchiseEntryResponse> => {
  const response = await axiosInstance.post<FranchiseEntryResponse>(
    "/franchise/entry",
    payload,
  );
  return response.data;
};

export const verifyFranchiseOTP = async (
  payload: FranchiseVerifyOTPPayload,
): Promise<FranchiseVerifyOTPResponse> => {
  const response = await axiosInstance.post<FranchiseVerifyOTPResponse>(
    "/franchise/entry/verify",
    payload,
  );
  return response.data;
};

export const fetchFranchiseStatus = async (): Promise<FranchiseStatusResponse> => {
  const response = await axiosInstance.get<FranchiseStatusResponse>(
    "/franchise/status",
  );
  return response.data;
};

export const fetchFranchiseProfile = async (): Promise<FranchiseProfileResponse> => {
  const response = await axiosInstance.get<FranchiseProfileResponse>(
    "/franchise/profile",
  );
  return response.data;
};

export const fetchFranchisePlans = async (): Promise<FranchisePlansResponse> => {
  const response = await axiosInstance.get<FranchisePlansResponse>(
    "/franchise/plans",
  );
  return response.data;
}

export const loginFranchise = async (
  payload: FranchiseLoginPayload,
): Promise<FranchiseLoginResponse> => {
  const response = await axiosInstance.post<FranchiseLoginResponse>(
    "/franchise/login",
    payload,
  );
  return response.data;
};

export const registerFranchiseCustomer = async (
  payload: FranchiseCustomerRegisterPayload,
): Promise<FranchiseCustomerRegisterResponse> => {
  const response = await axiosInstance.post<FranchiseCustomerRegisterResponse>(
    "/franchise/customer/register",
    payload,
  );
  return response.data;
};

export const verifyFranchiseCustomerOTP = async (
  payload: FranchiseCustomerVerifyOTPPayload,
): Promise<FranchiseCustomerVerifyOTPResponse> => {
  const response = await axiosInstance.post<FranchiseCustomerVerifyOTPResponse>(
    "/franchise/customer/verify-otp",
    payload,
  );
  return response.data;
};
