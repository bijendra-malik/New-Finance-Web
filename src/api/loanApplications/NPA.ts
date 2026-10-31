import { postLoanApplication } from "./shared";
import type { ApplicantDetails, ExistingLoanAmounts, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation } from "./shared";

// ── Types (aligned with the backend's NPA document) ──────────────────────────────

export interface NPAApplication extends ApplicantDetails, ExistingLoanAmounts, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation {
  _id: string;
  collateralPropertyType: string;
  collateralPropertyTypeOther?: string;
  collateralPropertyMarketValue: number;
  collateralPropertyAge: number;
  collateralPropertyState: string;
  collateralPropertyCity: string;
  collateralPropertyPincode: string;
  npaStatus: string;
  npaStatusOther?: string;
  otsOfferAmount?: number;
  npaPrincipalLoanAmount: number;
  npaCurrentOutstandingAmount: number;
  employmentType: string;
  loanAmount: number;
  loanTenure: number;
  existingBanksNpa: string[];
  existingBanksNpaOther?: string[];
  existingBanksNonNpa: string[];
  existingBanksNonNpaOther?: string[];
  existingLoanTypesNpa: string[];
  existingLoanTypesNpaOther?: string[];
  existingLoanTypesNonNpa: string[];
  existingLoanTypesNonNpaOther?: string[];
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

export type NPAPayload = Omit<NPAApplication, "_id" | "status" | "createdAt" | "updatedAt"> & { product: "npaLoan" };

// ── API Call ────────────────────────────────────────────────────────────────

export const applyNPA = (payload: NPAPayload) =>
  postLoanApplication<NPAApplication>(payload);
