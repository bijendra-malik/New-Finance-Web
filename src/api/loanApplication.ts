import axiosInstance from "./axiosInstance";

// ── Types (aligned with the backend's PersonalLoan document) ─────────────────

export interface PersonalLoanPayload {
  loanAmount: number;
  loanTenure: number; // months
  employmentType: string;
  companyName?: string;
  companyType?: string;
  monthlySalary?: number;
  salaryReceivedAs?: string;
  salaryBankName?: string;
  existingEMI: number;
  existingLoanAmount: number;
  existingBanks: string[];
  otherBankList?: string[];
  existingLoanTypes: string[];
  otherLoanList?: string[];
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  panNumber: string;
  state: string;
  city: string;
  pincode: string;
  residenceStatus: string;
}

export interface PersonalLoanApplication {
  _id: string;
  user?: string;
  loanType?: string;
  loanAmount: number;
  loanTenure: number;
  employmentType: string;
  companyName?: string;
  companyType?: string;
  monthlySalary?: number;
  salaryReceivedAs?: string;
  salaryBankName?: string;
  existingEMI: number;
  existingLoanAmount: number;
  existingBanks: string[];
  otherBankList?: string[];
  existingLoanTypes: string[];
  otherLoanList?: string[];
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  panNumber: string;
  state: string;
  city: string;
  pincode: string;
  residenceStatus: string;
  status: "Submitted" | "Pending" | "Under Review" | "Approved" | "Rejected" | "Disbursed";
  createdAt: string;
  updatedAt: string;
}

export interface ApplyResponse {
  success: boolean;
  data: PersonalLoanApplication;
}

export interface ApplicationsResponse {
  success: boolean;
  data: PersonalLoanApplication[];
}

// ── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Submit personal loan application.
 * POST /personal-loan/apply
 * Requires: Authorization: Bearer <token>
 */
export const applyPersonalLoan = async (
  payload: PersonalLoanPayload
): Promise<ApplyResponse> => {
  const response = await axiosInstance.post<ApplyResponse>(
    "/personal-loan/apply",
    payload
  );
  return response.data;
};

/**
 * Fetch all personal loan applications for the logged-in user.
 * GET /personal-loan/applications
 * Requires: Authorization: Bearer <token>
 */
export const fetchPersonalLoanApplications = async (): Promise<ApplicationsResponse> => {
  const response = await axiosInstance.get<ApplicationsResponse>(
    "/personal-loan/applications"
  );
  return response.data;
};

// ── Business Loan ─────────────────────────────────────────────────────────────

export interface BusinessLoanPayload {
  loanAmount: number;
  loanTenure: number; // months
  employmentType: string;
  // Self Employed - Business branch
  businessName?: string;
  businessType?: string;
  gstNumber?: string;
  companyPanNumber?: string;
  natureOfBusiness?: string;
  industryType?: string;
  subIndustry?: string;
  businessEstablishedDate?: string;
  transactionBankName?: string;
  transactionBanks?: string[];
  lastYearTurnover?: number;
  last2YearsTurnover?: number;
  lastYearNetIncome?: number;
  last2YearsNetIncome?: number;
  // Self Employed - Professional branch
  profession?: string;
  currentYearTurnover?: number;
  priorYearTurnover?: number;
  currentYearNetIncome?: number;
  previousYearNetIncome?: number;
  // Business location (both self-employed branches)
  businessState?: string;
  businessCity?: string;
  businessPincode?: string;
  businessPlaceStatus?: string;
  existingEMI: number;
  existingLoanAmount: number;
  existingBanks: string[];
  otherBankList?: string[];
  existingLoanTypes: string[];
  otherLoanList?: string[];
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  panNumber: string;
  state: string;
  city: string;
  pincode: string;
  residenceStatus: string;
}

export interface BusinessLoanApplication {
  _id: string;
  user?: string;
  loanType?: string;
  loanAmount: number;
  loanTenure: number;
  employmentType: string;
  businessName?: string;
  businessType?: string;
  gstNumber?: string;
  companyPanNumber?: string;
  natureOfBusiness?: string;
  industryType?: string;
  subIndustry?: string;
  businessEstablishedDate?: string;
  transactionBankName?: string;
  transactionBanks?: string[];
  lastYearTurnover?: number;
  last2YearsTurnover?: number;
  lastYearNetIncome?: number;
  last2YearsNetIncome?: number;
  profession?: string;
  currentYearTurnover?: number;
  priorYearTurnover?: number;
  currentYearNetIncome?: number;
  previousYearNetIncome?: number;
  businessState?: string;
  businessCity?: string;
  businessPincode?: string;
  businessPlaceStatus?: string;
  existingEMI: number;
  existingLoanAmount: number;
  existingBanks: string[];
  existingBanksOther?: string[];
  otherBankList?: string[];
  existingLoanTypes: string[];
  existingLoanTypesOther?: string[];
  otherLoanList?: string[];
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  panNumber: string;
  state: string;
  city: string;
  pincode: string;
  residenceStatus: string;
  status: "Submitted" | "Pending" | "Under Review" | "Approved" | "Rejected" | "Disbursed";
  createdAt: string;
  updatedAt: string;
}

export interface BusinessLoanApplyResponse {
  success: boolean;
  data: BusinessLoanApplication;
}

export interface BusinessLoanApplicationsResponse {
  success: boolean;
  data: BusinessLoanApplication[];
}

/**
 * Submit business loan application.
 * POST /business-loan/apply
 * Requires: Authorization: Bearer <token>
 */
export const applyBusinessLoan = async (
  payload: BusinessLoanPayload
): Promise<BusinessLoanApplyResponse> => {
  const response = await axiosInstance.post<BusinessLoanApplyResponse>(
    "/business-loan/apply",
    payload
  );
  return response.data;
};

/**
 * Fetch all business loan applications for the logged-in user.
 * GET /business-loan/applications
 * Requires: Authorization: Bearer <token>
 */
export const fetchBusinessLoanApplications = async (): Promise<BusinessLoanApplicationsResponse> => {
  const response = await axiosInstance.get<BusinessLoanApplicationsResponse>(
    "/business-loan/applications"
  );
  return response.data;
};
