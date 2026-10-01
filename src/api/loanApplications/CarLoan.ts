import axiosInstance from "../axiosInstance";
import type { ApplyResponse, ApplicationsResponse } from "./shared";

// ── Types (aligned with the backend's CarLoan document) ──────────────────────────────

export interface CarLoanApplication {

  _id: string;
  fullName: string; mobile: string; email: string; dob: string; panNumber: string;
  state: string; city: string; pincode: string; residenceStatus: string;
  vehicleType?: string; transmissionType?: string; manufacturer?: string; model?: string; fuelType?: string; vehiclePurchaseType?: string;
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
  /** Server-set product label, e.g. "Vehicle Loan". */
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

/** Body accepted by POST /car-loan/apply (everything except server-set fields). */
export type CarLoanPayload = Omit<CarLoanApplication, "_id" | "status" | "createdAt" | "updatedAt">;

// ── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Submit CarLoan application.
 * POST /car-loan/apply
 * Requires: Authorization: Bearer <token>
 */
export const applyCarLoan = async (
  payload: CarLoanPayload
): Promise<ApplyResponse<CarLoanApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<CarLoanApplication>>(
    "/car-loan/apply",
    payload
  );
  return response.data;
};

/**
 * Fetch all CarLoan applications for the logged-in user.
 * GET /car-loan/applications
 * Requires: Authorization: Bearer <token>
 */
export const fetchCarLoanApplications = async (): Promise<ApplicationsResponse<CarLoanApplication>> => {
  const response = await axiosInstance.get<ApplicationsResponse<CarLoanApplication>>(
    "/car-loan/applications"
  );
  return response.data;
};
