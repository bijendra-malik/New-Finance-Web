import axiosInstance from "../axiosInstance";
import type { ApplyResponse, ApplicationsResponse } from "./shared";

// ── Types (aligned with the backend's GoldLoan document) ──────────────────────────────

export interface GoldLoanApplication {

  _id: string;
  fullName: string; mobile: string; email: string; dob: string; panNumber: string;
  state: string; city: string; pincode: string; residenceStatus: string;
  typeOfLoan: string; goldCarats: string; goldWeight: number;
  jewelryGoldWeight?: number; jewelryStoneWeight?: number;
  jewelryOtherMaterials?: { name: string; weight: number }[];
  collateralPropertyMarketValue: number;
  employmentType: string;
  companyName?: string; companyType?: string; monthlyNetSalary?: number; salaryReceivedAs?: string; salaryBankName?: string;
  businessName?: string; businessType?: string;
  gstNumber?: string; companyPanNumber?: string; natureOfBusiness?: string; industryType?: string; subIndustry?: string;
  businessEstablishedDate?: string; transactionBankName?: string | { displayName: string; banks: string[] }; transactionBanks?: string[];
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
  /** Server-set product label, e.g. "Gold Loan". */
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

/** Body accepted by POST /gold-loan/apply (everything except server-set fields). */
export type GoldLoanPayload = Omit<GoldLoanApplication, "_id" | "status" | "createdAt" | "updatedAt">;

// ── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Submit GoldLoan application.
 * POST /gold-loan/apply
 * Requires: Authorization: Bearer <token>
 */
export const applyGoldLoan = async (
  payload: GoldLoanPayload
): Promise<ApplyResponse<GoldLoanApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<GoldLoanApplication>>(
    "/gold-loan/apply",
    payload
  );
  return response.data;
};

/**
 * Fetch all GoldLoan applications for the logged-in user.
 * GET /gold-loan/applications
 * Requires: Authorization: Bearer <token>
 */
export const fetchGoldLoanApplications = async (): Promise<ApplicationsResponse<GoldLoanApplication>> => {
  const response = await axiosInstance.get<ApplicationsResponse<GoldLoanApplication>>(
    "/gold-loan/applications"
  );
  return response.data;
};
