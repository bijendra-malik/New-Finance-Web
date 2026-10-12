import axiosInstance from "./axiosInstance";

// ── Types ────────────────────────────────────────────────────────────────────

export interface RegisteredAccount {
  _id: string;
  name: string;
  mobile: string;
  email: string;
  isVerified: boolean;
  role: string;
  continent: string;
  country: string;
  isActive: boolean;
}

export interface RegisterPayload {
  name: string;
  mobile: string;
  email: string;
  role: string;
  continent: string;
  country: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  franchise?: RegisteredAccount;
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
  franchiseStatus?: string;
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

export interface ApplyRegisterPayload {
  product: string;
  dob: string;
  panNumber: string;
}

/** API values accepted by POST /customer/apply-register. */
const APPLY_REGISTER_PRODUCTS: Readonly<Record<string, string>> = {
  personal: "personal",
  personalloan: "personal",
  business: "business",
  businessloan: "business",
  home: "home",
  homeloan: "home",
  commercialpurchase: "commercialPurchase",
  commercialpurchaseloan: "commercialPurchase",
  lap: "lap",
  loanagainstproperty: "lap",
  workingcapital: "workingCapital",
  workingcapitalloan: "workingCapital",
  odcclimit: "odCcLimit",
  odcc: "odCcLimit",
  loanagainstshare: "loanAgainstShare",
  las: "loanAgainstShare",
  filmfunding: "filmFunding",
  fdi: "fdiLoan",
  fdiloan: "fdiLoan",
  foreigndirectinvestmentfdi: "fdiLoan",
  leaserentaldiscounting: "leaseRentalDiscounting",
  lrd: "leaseRentalDiscounting",
  balancetransfer: "balanceTransfer",
  projectloan: "projectLoan",
  vehicleloan: "vehicleLoan",
  educationloan: "educationLoan",
  goldloan: "goldLoan",
  npa: "npaLoan",
  npaloan: "npaLoan",
  nparesolutionloan: "npaLoan",
  creditcard: "creditCard",
  premiumcreditcards: "creditCard",
};

const toApplyRegisterProduct = (product: string): string => {
  const key = product.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const value = APPLY_REGISTER_PRODUCTS[key];
  if (!value) throw new Error(`Unsupported loan product: ${product}`);
  return value;
};

export interface ApplyRegisterResponse {
  success: boolean;
  message: string;
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
    payload,
    { withCredentials: true }
  );
  return response.data;
};

export const applyRegister = async (
  payload: ApplyRegisterPayload
): Promise<ApplyRegisterResponse> => {
  const response = await axiosInstance.post<ApplyRegisterResponse>(
    "/customer/apply-register",
    { ...payload, product: toApplyRegisterProduct(payload.product) }
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
 * POST /auth/verify-otp
 */
export const verifyOTP = async (
  payload: VerifyOTPPayload
): Promise<VerifyOTPResponse> => {
  const response = await axiosInstance.post<VerifyOTPResponse>(
    "/auth/verify-otp",
    payload,
    { withCredentials: true }
  );
  return response.data;
};

/**
 * Fetch authenticated user profile (requires token in localStorage).
 * GET /auth/customer/profile
 */
export const fetchProfile = async (): Promise<ProfileResponse> => {
  const response = await axiosInstance.get<ProfileResponse>("/auth/customer/profile");
  return response.data;
};
