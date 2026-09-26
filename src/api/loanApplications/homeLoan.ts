import axiosInstance from "../axiosInstance";
import type { ApplyResponse, ApplicationsResponse, LoanApplicationStatus } from "./shared";

// ── Home Loan ─────────────────────────────────────────────────────────────────
// Aligned with the backend's HomeLoan document (POST /home-loan/apply,
// GET /home-loan/applications). transactionBankName is a plain string for a
// single bank, or an object for "Multiple Transaction Banks".

export interface HomeLoanTransactionBank {
  displayName: string;
  banks: string[];
}

export interface HomeLoanPayload {
  loanAmount: number;
  loanTenure: number;
  buyingPropertyType?: string;
  buyingPropertyAge?: number;
  buyingPropertyState?: string;
  buyingPropertyCity?: string;
  buyingPropertyPincode?: string;
  employmentType: string;
  companyName?: string;
  companyType?: string;
  monthlyNetSalary?: number;
  salaryReceivedAs?: string;
  salaryBankName?: string;
  businessName?: string;
  businessType?: string;
  gstNumber?: string;
  companyPanNumber?: string;
  natureOfBusiness?: string;
  industryType?: string;
  subIndustry?: string;
  businessEstablishedDate?: string;
  transactionBankName?: string | HomeLoanTransactionBank;
  transactionBankOther?: string;
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
  otherBankList: string[];
  existingLoanTypes: string[];
  otherLoanList: string[];
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

export interface HomeLoanApplication extends HomeLoanPayload {
  _id: string;
  user?: string;
  loanType?: string;
  status: LoanApplicationStatus;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Submit home loan application.
 * POST /home-loan/apply
 * Requires: Authorization: Bearer <token>
 */
export const applyHomeLoan = async (
  payload: HomeLoanPayload
): Promise<ApplyResponse<HomeLoanApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<HomeLoanApplication>>(
    "/home-loan/apply",
    payload
  );
  return response.data;
};

/**
 * Fetch all home loan applications for the logged-in user.
 * GET /home-loan/applications
 * Requires: Authorization: Bearer <token>
 */
export const fetchHomeLoanApplications = async (): Promise<ApplicationsResponse<HomeLoanApplication>> => {
  const response = await axiosInstance.get<ApplicationsResponse<HomeLoanApplication>>(
    "/home-loan/applications"
  );
  return response.data;
};
