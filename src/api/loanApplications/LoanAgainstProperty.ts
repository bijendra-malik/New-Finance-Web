import axiosInstance from "../axiosInstance";
import type { ApplyResponse } from "./shared";

// ── Types (aligned with the backend's LoanAgainstProperty document) ──────────────────────────────

export interface LoanAgainstPropertyApplication {

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
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

export type LoanAgainstPropertyPayload = Omit<LoanAgainstPropertyApplication, "_id" | "status" | "createdAt" | "updatedAt"> & { product: "lap" };

// ── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Submit LoanAgainstProperty application.
 * POST /customer/loan-apply
 * Requires: Authorization: Bearer <token>
 */
export const applyLoanAgainstProperty = async (
  payload: LoanAgainstPropertyPayload
): Promise<ApplyResponse<LoanAgainstPropertyApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<LoanAgainstPropertyApplication>>(
    "/customer/loan-apply",
    payload
  );
  return response.data;
};

