import axiosInstance from "../axiosInstance";
import type { ApplyResponse, ApplicationsResponse } from "./shared";

// ── Types (aligned with the backend's ODCCLimit document) ──────────────────────────────

export interface ODCCLimitApplication {

  _id: string;
  fullName: string; mobile: string; email: string; dob: string; panNumber: string;
  state: string; city: string; pincode: string; residenceStatus: string;
  collateralPropertyType: string;
  collateralPropertyTypeOther?: string; collateralPropertyMarketValue: number; collateralPropertyAge: number;
  collateralPropertyState: string; collateralPropertyCity: string; collateralPropertyPincode: string;
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
  /** Server-set product label, e.g. "OD CC Limit". */
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

/** Body accepted by POST /od-cc-limit/apply (everything except server-set fields). */
export type ODCCLimitPayload = Omit<ODCCLimitApplication, "_id" | "status" | "createdAt" | "updatedAt">;

// ── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Submit ODCCLimit application.
 * POST /od-cc-limit/apply
 * Requires: Authorization: Bearer <token>
 */
export const applyODCCLimit = async (
  payload: ODCCLimitPayload
): Promise<ApplyResponse<ODCCLimitApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<ODCCLimitApplication>>(
    "/od-cc-limit/apply",
    payload
  );
  return response.data;
};

/**
 * Fetch all ODCCLimit applications for the logged-in user.
 * GET /od-cc-limit/applications
 * Requires: Authorization: Bearer <token>
 */
export const fetchODCCLimitApplications = async (): Promise<ApplicationsResponse<ODCCLimitApplication>> => {
  const response = await axiosInstance.get<ApplicationsResponse<ODCCLimitApplication>>(
    "/od-cc-limit/applications"
  );
  return response.data;
};
