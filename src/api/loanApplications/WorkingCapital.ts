import { postLoanApplication } from "./shared";
import type { ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation } from "./shared";

// ── Types (aligned with the backend's WorkingCapital document) ──────────────────────────────

export interface WorkingCapitalApplication extends ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation {
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

export type WorkingCapitalPayload = Omit<WorkingCapitalApplication, "_id" | "status" | "createdAt" | "updatedAt"> & { product: "workingCapital" };

// ── API Call ────────────────────────────────────────────────────────────────

export const applyWorkingCapital = (payload: WorkingCapitalPayload) =>
  postLoanApplication<WorkingCapitalApplication>(payload);
