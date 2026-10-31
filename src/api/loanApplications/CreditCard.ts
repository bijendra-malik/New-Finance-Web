import { postLoanApplication } from "./shared";
import type { ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation } from "./shared";

// ── Types (aligned with the backend's CreditCard document) ──────────────────────────────

export interface CreditCardApplication extends ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation {
  _id: string;
  hasActiveCard?: string;
  applyForBank?: string;
  applyForBankOther?: string;
  employmentType: string;
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

export type CreditCardPayload = Omit<CreditCardApplication, "_id" | "status" | "createdAt" | "updatedAt"> & { product: "creditCard" };

// ── API Call ────────────────────────────────────────────────────────────────

export const applyCreditCard = (payload: CreditCardPayload) =>
  postLoanApplication<CreditCardApplication>(payload);
