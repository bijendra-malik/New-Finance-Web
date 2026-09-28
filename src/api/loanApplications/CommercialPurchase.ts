import axiosInstance from "../axiosInstance";
import type { ApplyResponse, ApplicationsResponse } from "./shared";

// ── Types (aligned with the backend's CommercialPurchase document) ──────────────────────────────

export interface CommercialPurchaseApplication {

  _id: string;
  fullName: string; mobile: string; email: string; dob: string; panNumber: string;
  state: string; city: string; pincode: string; residenceStatus: string;
  buyingPropertyType: string; buyingPropertyMarketValue: number; buyingPropertyAge: number;
  buyingPropertyState: string; buyingPropertyCity: string; buyingPropertyPincode: string;
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

/** Body accepted by POST /commercial-purchase/apply (everything except server-set fields). */
export type CommercialPurchasePayload = Omit<CommercialPurchaseApplication, "_id" | "status" | "createdAt" | "updatedAt">;

// ── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Submit CommercialPurchase application.
 * POST /commercial-purchase/apply
 * Requires: Authorization: Bearer <token>
 */
export const applyCommercialPurchase = async (
  payload: CommercialPurchasePayload
): Promise<ApplyResponse<CommercialPurchaseApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<CommercialPurchaseApplication>>(
    "/commercial-purchase/apply",
    payload
  );
  return response.data;
};

/**
 * Fetch all CommercialPurchase applications for the logged-in user.
 * GET /commercial-purchase/applications
 * Requires: Authorization: Bearer <token>
 */
export const fetchCommercialPurchaseApplications = async (): Promise<ApplicationsResponse<CommercialPurchaseApplication>> => {
  const response = await axiosInstance.get<ApplicationsResponse<CommercialPurchaseApplication>>(
    "/commercial-purchase/applications"
  );
  return response.data;
};
