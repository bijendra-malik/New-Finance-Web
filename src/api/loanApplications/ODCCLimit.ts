import { postLoanApplication } from "./shared";
import type { ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation } from "./shared";

// ── Types (aligned with the backend's ODCCLimit document) ──────────────────────────────

export interface ODCCLimitApplication extends ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation {
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

export type ODCCLimitPayload = Omit<ODCCLimitApplication, "_id" | "status" | "createdAt" | "updatedAt"> & { product: "odCcLimit" };

// ── API Call ────────────────────────────────────────────────────────────────

export const applyODCCLimit = (payload: ODCCLimitPayload) =>
  postLoanApplication<ODCCLimitApplication>(payload);
