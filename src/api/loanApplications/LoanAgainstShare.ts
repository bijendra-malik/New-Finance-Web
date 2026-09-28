import axiosInstance from "../axiosInstance";
import type { ApplyResponse, ApplicationsResponse } from "./shared";

// ── Types (aligned with the backend's LoanAgainstShare document) ──────────────────────────────

export interface LoanAgainstShareApplication {

  _id: string;
  fullName: string; mobile: string; email: string; dob: string; panNumber: string;
  state: string; city: string; pincode: string; residenceStatus: string;
  shareCompanyName: string; valueOfOneShare: number; quantityOfShare: number; totalShareValue: number;
  employmentType: string;
  companyName?: string; companyType?: string; monthlyNetSalary?: number; salaryReceivedAs?: string; salaryBankName?: string;
  businessName?: string; businessType?: string;
  gstNumber?: string; companyPanNumber?: string; natureOfBusiness?: string; industryType?: string; subIndustry?: string;
  businessEstablishedDate?: string; transactionBankName?: string; transactionBanks?: string[];
  lastYearTurnover?: number; last2YearsTurnover?: number;
  lastYearNetIncome?: number; last2YearsNetIncome?: number;
  profession?: string;
  currentYearTurnover?: number; priorYearTurnover?: number;
  currentYearNetIncome?: number; previousYearNetIncome?: number;
  businessState?: string; businessCity?: string; businessPincode?: string; businessPlaceStatus?: string;
  loanAmount: number; loanTenure: number;
  existingEMI: number; existingLoanAmount: number;
  existingBanks: string[]; otherBankList?: string[];
  existingLoanTypes: string[]; otherLoanList?: string[];
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

/** Body accepted by POST /loan-against-share/apply (everything except server-set fields). */
export type LoanAgainstSharePayload = Omit<LoanAgainstShareApplication, "_id" | "status" | "createdAt" | "updatedAt">;

// ── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Submit LoanAgainstShare application.
 * POST /loan-against-share/apply
 * Requires: Authorization: Bearer <token>
 */
export const applyLoanAgainstShare = async (
  payload: LoanAgainstSharePayload
): Promise<ApplyResponse<LoanAgainstShareApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<LoanAgainstShareApplication>>(
    "/loan-against-share/apply",
    payload
  );
  return response.data;
};

/**
 * Fetch all LoanAgainstShare applications for the logged-in user.
 * GET /loan-against-share/applications
 * Requires: Authorization: Bearer <token>
 */
export const fetchLoanAgainstShareApplications = async (): Promise<ApplicationsResponse<LoanAgainstShareApplication>> => {
  const response = await axiosInstance.get<ApplicationsResponse<LoanAgainstShareApplication>>(
    "/loan-against-share/applications"
  );
  return response.data;
};
