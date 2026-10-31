import { postLoanApplication } from "./shared";
import type { ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, BusinessFinancials, BusinessLocation } from "./shared";

// ── Types (aligned with the backend's FilmLoan document) ──────────────────────────────

export interface FilmLoanApplication extends ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, BusinessFinancials, BusinessLocation {
  _id: string;
  employmentType: string;
  businessName?: string;
  businessType?: string;
  gstNumber?: string;
  companyPanNumber?: string;
  filmComesUnder: string;
  filmComesUnderOther?: string;
  filmLanguages: string[];
  starCastNames: string[];
  totalProjectCost: number;
  ownInvestmentAmount: number;
  loanAmount: number;
  loanTenure: number;
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

export type FilmLoanPayload = Omit<FilmLoanApplication, "_id" | "status" | "createdAt" | "updatedAt"> & { product: "filmFunding" };

// ── API Call ────────────────────────────────────────────────────────────────

export const applyFilmLoan = (payload: FilmLoanPayload) =>
  postLoanApplication<FilmLoanApplication>(payload);
