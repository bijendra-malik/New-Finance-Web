import axiosInstance from "../axiosInstance";
import type { ApplyResponse, ApplicationsResponse } from "./shared";

// ── Types (aligned with the backend's CreditCard document) ──────────────────────────────

export interface CreditCardApplication {

  _id: string;
  fullName: string; mobile: string; email: string; dob: string; panNumber: string;
  state: string; city: string; pincode: string; residenceStatus: string;
  hasActiveCard?: string; applyForBank?: string;
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
  existingEMI: number; existingLoanAmount: number;
  existingBanks: string[]; otherBankList?: string[];
  existingLoanTypes: string[]; otherLoanList?: string[];
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

/** Body accepted by POST /credit-card/apply (everything except server-set fields). */
export type CreditCardPayload = Omit<CreditCardApplication, "_id" | "status" | "createdAt" | "updatedAt">;

// ── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Submit CreditCard application.
 * POST /credit-card/apply
 * Requires: Authorization: Bearer <token>
 */
export const applyCreditCard = async (
  payload: CreditCardPayload
): Promise<ApplyResponse<CreditCardApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<CreditCardApplication>>(
    "/credit-card/apply",
    payload
  );
  return response.data;
};

/**
 * Fetch all CreditCard applications for the logged-in user.
 * GET /credit-card/applications
 * Requires: Authorization: Bearer <token>
 */
export const fetchCreditCardApplications = async (): Promise<ApplicationsResponse<CreditCardApplication>> => {
  const response = await axiosInstance.get<ApplicationsResponse<CreditCardApplication>>(
    "/credit-card/applications"
  );
  return response.data;
};
