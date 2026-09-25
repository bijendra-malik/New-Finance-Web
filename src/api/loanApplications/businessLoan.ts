import axiosInstance from "../axiosInstance";
import type { ApplyResponse, ApplicationsResponse } from "./shared";

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

/**
 * Submit business loan application.
 * POST /business-loan/apply
 * Requires: Authorization: Bearer <token>
 */
export const applyBusinessLoan = async (
  payload: BusinessLoanPayload
): Promise<ApplyResponse<BusinessLoanApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<BusinessLoanApplication>>(
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
export const fetchBusinessLoanApplications = async (): Promise<ApplicationsResponse<BusinessLoanApplication>> => {
  const response = await axiosInstance.get<ApplicationsResponse<BusinessLoanApplication>>(
    "/business-loan/applications"
  );
  return response.data;
};
