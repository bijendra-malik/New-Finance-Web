import axiosInstance from "../axiosInstance";
import type { ApplyResponse, ApplicationsResponse } from "./shared";

// ── Types (aligned with the backend's NPA document) ──────────────────────────────

export interface NPAApplication {

  _id: string;
  fullName: string; mobile: string; email: string; dob: string; panNumber: string;
  state: string; city: string; pincode: string; residenceStatus: string;
  collateralPropertyType: string;
  collateralPropertyTypeOther?: string; collateralPropertyMarketValue: number; collateralPropertyAge: number;
  collateralPropertyState: string; collateralPropertyCity: string; collateralPropertyPincode: string;
  npaStatus: string; npaStatusOther?: string; otsOfferAmount?: number;
  npaPrincipalLoanAmount: number; npaCurrentOutstandingAmount: number;
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
  existingBanksNpa: string[]; existingBanksNpaOther?: string[];
  existingBanksNonNpa: string[]; existingBanksNonNpaOther?: string[];
  existingLoanTypesNpa: string[]; existingLoanTypesNpaOther?: string[];
  existingLoanTypesNonNpa: string[]; existingLoanTypesNonNpaOther?: string[];
  /** Server-set product label, e.g. "NPA". */
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

/** Body accepted by POST /npa/apply (everything except server-set fields). */
export type NPAPayload = Omit<NPAApplication, "_id" | "status" | "createdAt" | "updatedAt">;

// ── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Submit NPA application.
 * POST /npa/apply
 * Requires: Authorization: Bearer <token>
 */
export const applyNPA = async (
  payload: NPAPayload
): Promise<ApplyResponse<NPAApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<NPAApplication>>(
    "/npa/apply",
    payload
  );
  return response.data;
};

/**
 * Fetch all NPA applications for the logged-in user.
 * GET /npa/applications
 * Requires: Authorization: Bearer <token>
 */
export const fetchNPAApplications = async (): Promise<ApplicationsResponse<NPAApplication>> => {
  const response = await axiosInstance.get<ApplicationsResponse<NPAApplication>>(
    "/npa/applications"
  );
  return response.data;
};
