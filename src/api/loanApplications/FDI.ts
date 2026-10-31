import { postLoanApplication } from "./shared";
import type { ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, BusinessIdentity, BusinessFinancials, BusinessLocation } from "./shared";

// ── Types (aligned with the backend's FDI document) ──────────────────────────────

export interface FDIApplication extends ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, BusinessIdentity, BusinessFinancials, BusinessLocation {
  _id: string;
  collateralPropertyType: string;
  collateralPropertyTypeOther?: string;
  collateralPropertyMarketValue: number;
  collateralPropertyAge: number;
  collateralPropertyState: string;
  collateralPropertyCity: string;
  collateralPropertyPincode: string;
  companyEvaluationValue?: number;
  interestedInEquityPartner?: string;
  equityShareOffered?: number;
  employmentType: string;
  loanAmount: number;
  loanTenure: number;
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

export type FDIPayload = Omit<FDIApplication, "_id" | "status" | "createdAt" | "updatedAt"> & { product: "fdiLoan" };

// ── API Call ────────────────────────────────────────────────────────────────

export const applyFDI = (payload: FDIPayload) =>
  postLoanApplication<FDIApplication>(payload);
