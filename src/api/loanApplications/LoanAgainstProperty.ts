import { postLoanApplication } from "./shared";
import type { ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation } from "./shared";

// ── Types (aligned with the backend's LoanAgainstProperty document) ──────────────────────────────

export interface LoanAgainstPropertyApplication extends ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation {
  _id: string;
  collateralPropertyType: string;
  collateralPropertyTypeOther?: string;
  collateralPropertyMarketValue: number;
  collateralPropertyAge: number;
  collateralPropertyState: string;
  collateralPropertyCity: string;
  collateralPropertyPincode: string;
  employmentType: string;
  loanAmount: number;
  loanTenure: number;
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

export type LoanAgainstPropertyPayload = Omit<LoanAgainstPropertyApplication, "_id" | "status" | "createdAt" | "updatedAt"> & { product: "lap" };

// ── API Call ────────────────────────────────────────────────────────────────

export const applyLoanAgainstProperty = (payload: LoanAgainstPropertyPayload) =>
  postLoanApplication<LoanAgainstPropertyApplication>(payload);
