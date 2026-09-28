import axiosInstance from "../axiosInstance";
import type { ApplyResponse, ApplicationsResponse } from "./shared";

// ── Types (aligned with the backend's BalanceTransfer document) ──────────────────────────────

export interface BalanceTransferApplication {

  _id: string;
  fullName: string; mobile: string; email: string; dob: string; panNumber: string;
  state: string; city: string; pincode: string; residenceStatus: string;
  balanceTransferType: string; currentPropertyValue?: number; topUpAmount?: number;
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
  /** Server-set product label, e.g. "Balance Transfer". */
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

/** Body accepted by POST /balance-transfer/apply (everything except server-set fields). */
export type BalanceTransferPayload = Omit<BalanceTransferApplication, "_id" | "status" | "createdAt" | "updatedAt">;

// ── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Submit BalanceTransfer application.
 * POST /balance-transfer/apply
 * Requires: Authorization: Bearer <token>
 */
export const applyBalanceTransfer = async (
  payload: BalanceTransferPayload
): Promise<ApplyResponse<BalanceTransferApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<BalanceTransferApplication>>(
    "/balance-transfer/apply",
    payload
  );
  return response.data;
};

/**
 * Fetch all BalanceTransfer applications for the logged-in user.
 * GET /balance-transfer/applications
 * Requires: Authorization: Bearer <token>
 */
export const fetchBalanceTransferApplications = async (): Promise<ApplicationsResponse<BalanceTransferApplication>> => {
  const response = await axiosInstance.get<ApplicationsResponse<BalanceTransferApplication>>(
    "/balance-transfer/applications"
  );
  return response.data;
};
