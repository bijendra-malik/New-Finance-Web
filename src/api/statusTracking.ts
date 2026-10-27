import axiosInstance from "./axiosInstance";

export interface CustomerStatusOtpRequest {
  customerId: string;
  panNumber: string;
  mobile: string;
}

export interface FranchiseStatusOtpRequest {
  panNumber: string;
  mobile: string;
}

export interface StatusOtpVerifyRequest {
  mobile: string;
  otp: string;
}

export interface StatusOtpSentResponse {
  success: boolean;
  message: string;
  mobileMasked?: string;
  nextStep?: string;
}

// ── Customer (loan application) status ─────────────────────────────────────────

export interface CustomerStatusTimelineEntry {
  step?: string;
  at?: string;
}

export interface CustomerStatusApplication {
  _id?: string;
  applicationNo?: string;
  applicationNumber?: string;
  product?: string;
  loanType?: string;
  productName?: string;
  loanAmount?: number | null;
  franchiseCode?: string | null;
  status?: string;
  stage?: string;
  stageKey?: string;
  step?: number;
  stages?: string[];
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  statusUpdatedAt?: string;
  decisionAt?: string | null;
  adminNote?: string;
  timeline?: CustomerStatusTimelineEntry[];
  details?: Record<string, unknown> | null;
  message?: string;
}

export interface CustomerStatusResponse {
  success: boolean;
  message?: string;
  customer?: {
    customerId?: string;
    name?: string;
    mobileMasked?: string;
    panNumber?: string;
    panMasked?: string;
    email?: string;
  };
  total?: number;
  byStatus?: Record<string, number>;
  stages?: string[];
  applications?: CustomerStatusApplication[];
  loans?: CustomerStatusApplication[];
  customerStatus?: string;
  status?: string;
  appliedAt?: string;
  updatedAt?: string;
}

// ── Franchise application status ───────────────────────────────────────────────

export interface FranchiseStatusLookupResponse {
  success: boolean;
  message?: string;
  franchise?: {
    franchiseId?: string;
    franchiseeCode?: string;
    name?: string;
    mobileMasked?: string;
  };
  franchiseStatus?: string;
  canLogin?: boolean;
  appliedAt?: string;
  updatedAt?: string;
}

// ── Calls ──────────────────────────────────────────────────────────────────────

/** POST /customer/status/request-otp — verifies customer ID + PAN + mobile, then sends an OTP. */
export const requestCustomerStatusOtp = async (
  payload: CustomerStatusOtpRequest,
): Promise<StatusOtpSentResponse> => {
  const response = await axiosInstance.post<StatusOtpSentResponse>(
    "/customer/status/request-otp",
    payload,
  );
  return response.data;
};

/** POST /customer/status — the customer's applications, once the OTP is verified. */
export const verifyCustomerStatusOtp = async (
  payload: StatusOtpVerifyRequest,
): Promise<CustomerStatusResponse> => {
  const response = await axiosInstance.post<CustomerStatusResponse>(
    "/customer/status",
    payload,
  );
  return response.data;
};

/** POST /franchise/status/request-otp — verifies mobile + PAN, then sends an OTP. */
export const requestFranchiseStatusOtp = async (
  payload: FranchiseStatusOtpRequest,
): Promise<StatusOtpSentResponse> => {
  const response = await axiosInstance.post<StatusOtpSentResponse>(
    "/franchise/status/request-otp",
    payload,
  );
  return response.data;
};

/** POST /franchise/status — the franchise application status, once the OTP is verified. */
export const verifyFranchiseStatusOtp = async (
  payload: StatusOtpVerifyRequest,
): Promise<FranchiseStatusLookupResponse> => {
  const response = await axiosInstance.post<FranchiseStatusLookupResponse>(
    "/franchise/status",
    payload,
  );
  return response.data;
};
