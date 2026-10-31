import { postLoanApplication } from "./shared";
import type { ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation } from "./shared";

// ── Types (aligned with the backend's LoanAgainstShare document) ──────────────────────────────

export interface LoanAgainstShareApplication extends ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation {
  _id: string;
  shareCompanyName: string;
  valueOfOneShare: number;
  quantityOfShare: number;
  totalShareValue: number;
  employmentType: string;
  loanAmount: number;
  loanTenure: number;
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

export type LoanAgainstSharePayload = Omit<LoanAgainstShareApplication, "_id" | "status" | "createdAt" | "updatedAt"> & { product: "loanAgainstShare" };

// ── API Call ────────────────────────────────────────────────────────────────

export const applyLoanAgainstShare = (payload: LoanAgainstSharePayload) =>
  postLoanApplication<LoanAgainstShareApplication>(payload);
