import axiosInstance from "../axiosInstance";
import type { ApplyResponse, ApplicationsResponse } from "./shared";

// ── Types (aligned with the backend's FilmLoan document) ──────────────────────────────

export interface FilmLoanApplication {

  _id: string;
  fullName: string; mobile: string; email: string; dob: string; panNumber: string;
  state: string; city: string; pincode: string; residenceStatus: string;
  employmentType: string; businessName?: string; businessType?: string;
  gstNumber?: string; companyPanNumber?: string;
  businessEstablishedDate?: string; transactionBankName?: string | { displayName: string; banks: string[] }; transactionBanks?: string[];
  lastYearTurnover?: number; last2YearsTurnover?: number;
  lastYearNetIncome?: number; last2YearsNetIncome?: number;
  profession?: string;
  currentYearTurnover?: number; priorYearTurnover?: number;
  currentYearNetIncome?: number; previousYearNetIncome?: number;
  businessState?: string; businessCity?: string; businessPincode?: string; businessPlaceStatus?: string;
  filmComesUnder: string;
  filmLanguages: string[]; starCastNames: string[];
  totalProjectCost: number; ownInvestmentAmount: number;
  loanAmount: number; loanTenure: number;
  existingEMI: number; existingLoanAmount: number;
  existingBanks: string[]; otherBankList?: string[];
  existingLoanTypes: string[]; otherLoanList?: string[];
  /** Server-set product label, e.g. "Film Funding". */
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

/** Body accepted by POST /film-funding/apply (everything except server-set fields). */
export type FilmLoanPayload = Omit<FilmLoanApplication, "_id" | "status" | "createdAt" | "updatedAt">;

// ── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Submit FilmLoan application.
 * POST /film-funding/apply
 * Requires: Authorization: Bearer <token>
 */
export const applyFilmLoan = async (
  payload: FilmLoanPayload
): Promise<ApplyResponse<FilmLoanApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<FilmLoanApplication>>(
    "/film-funding/apply",
    payload
  );
  return response.data;
};

/**
 * Fetch all FilmLoan applications for the logged-in user.
 * GET /film-funding/applications
 * Requires: Authorization: Bearer <token>
 */
export const fetchFilmLoanApplications = async (): Promise<ApplicationsResponse<FilmLoanApplication>> => {
  const response = await axiosInstance.get<ApplicationsResponse<FilmLoanApplication>>(
    "/film-funding/applications"
  );
  return response.data;
};
