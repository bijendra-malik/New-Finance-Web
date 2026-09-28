import axiosInstance from "../axiosInstance";
import type { ApplyResponse, ApplicationsResponse } from "./shared";

// ── Types (aligned with the backend's FDI document) ──────────────────────────────

export interface FDIApplication {

  _id: string;
  fullName: string; mobile: string; email: string; dob: string; panNumber: string;
  state: string; city: string; pincode: string; residenceStatus: string;
  collateralPropertyType: string; collateralPropertyMarketValue: number; collateralPropertyAge: number;
  collateralPropertyState: string; collateralPropertyCity: string; collateralPropertyPincode: string;
  companyEvaluationValue?: number; interestedInEquityPartner?: string; equityShareOffered?: number;
  employmentType: string;
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
  /** Server-set product label, e.g. "FDI". */
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

/** Body accepted by POST /fdi/apply (everything except server-set fields). */
export type FDIPayload = Omit<FDIApplication, "_id" | "status" | "createdAt" | "updatedAt">;

// ── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Submit FDI application.
 * POST /fdi/apply
 * Requires: Authorization: Bearer <token>
 */
export const applyFDI = async (
  payload: FDIPayload
): Promise<ApplyResponse<FDIApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<FDIApplication>>(
    "/fdi/apply",
    payload
  );
  return response.data;
};

/**
 * Fetch all FDI applications for the logged-in user.
 * GET /fdi/applications
 * Requires: Authorization: Bearer <token>
 */
export const fetchFDIApplications = async (): Promise<ApplicationsResponse<FDIApplication>> => {
  const response = await axiosInstance.get<ApplicationsResponse<FDIApplication>>(
    "/fdi/applications"
  );
  return response.data;
};
