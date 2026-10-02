import axiosInstance from "../axiosInstance";
import type { ApplyResponse, ApplicationsResponse } from "./shared";

// ── Types (aligned with the backend's ProjectLoan document) ──────────────────────────────

export interface ProjectLoanApplication {

  _id: string;
  fullName: string; mobile: string; email: string; dob: string; panNumber: string;
  state: string; city: string; pincode: string; residenceStatus: string;
  projectType: string;
  projectTypeOther?: string; totalProjectCost: number;
  projectStartDate: string; projectCompletionDate: string; ownInvestment: number;
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
  /** Server-set product label, e.g. "Project Loan". */
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

/** Body accepted by POST /project-loan/apply (everything except server-set fields). */
export type ProjectLoanPayload = Omit<ProjectLoanApplication, "_id" | "status" | "createdAt" | "updatedAt">;

// ── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Submit ProjectLoan application.
 * POST /project-loan/apply
 * Requires: Authorization: Bearer <token>
 */
export const applyProjectLoan = async (
  payload: ProjectLoanPayload
): Promise<ApplyResponse<ProjectLoanApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<ProjectLoanApplication>>(
    "/project-loan/apply",
    payload
  );
  return response.data;
};

/**
 * Fetch all ProjectLoan applications for the logged-in user.
 * GET /project-loan/applications
 * Requires: Authorization: Bearer <token>
 */
export const fetchProjectLoanApplications = async (): Promise<ApplicationsResponse<ProjectLoanApplication>> => {
  const response = await axiosInstance.get<ApplicationsResponse<ProjectLoanApplication>>(
    "/project-loan/applications"
  );
  return response.data;
};
