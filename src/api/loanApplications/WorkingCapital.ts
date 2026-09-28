import axiosInstance from "../axiosInstance";
import type { ApplyResponse, ApplicationsResponse } from "./shared";

// ── Types (aligned with the backend's WorkingCapital document) ──────────────────────────────

export interface WorkingCapitalApplication {

  _id: string;
  fullName: string; mobile: string; email: string; dob: string; panNumber: string;
  state: string; city: string; pincode: string; residenceStatus: string;
  collateralPropertyType: string; collateralPropertyMarketValue: number; collateralPropertyAge: number;
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
  /** Server-set product label, e.g. "Working Capital". */
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

/** Body accepted by POST /working-capital/apply (everything except server-set fields). */
export type WorkingCapitalPayload = Omit<WorkingCapitalApplication, "_id" | "status" | "createdAt" | "updatedAt">;

// ── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Submit WorkingCapital application.
 * POST /working-capital/apply
 * Requires: Authorization: Bearer <token>
 */
export const applyWorkingCapital = async (
  payload: WorkingCapitalPayload
): Promise<ApplyResponse<WorkingCapitalApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<WorkingCapitalApplication>>(
    "/working-capital/apply",
    payload
  );
  return response.data;
};

/**
 * Fetch all WorkingCapital applications for the logged-in user.
 * GET /working-capital/applications
 * Requires: Authorization: Bearer <token>
 */
export const fetchWorkingCapitalApplications = async (): Promise<ApplicationsResponse<WorkingCapitalApplication>> => {
  const response = await axiosInstance.get<ApplicationsResponse<WorkingCapitalApplication>>(
    "/working-capital/applications"
  );
  return response.data;
};
