import { postLoanApplication } from "./shared";
import type { ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation } from "./shared";

// ── Types (aligned with the backend's BalanceTransfer document) ──────────────────────────────

export interface BalanceTransferApplication extends ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation {
  _id: string;
  balanceTransferType: string;
  balanceTransferTypeOther?: string;
  currentPropertyValue?: number;
  topUpAmount?: number;
  employmentType: string;
  loanAmount: number;
  loanTenure: number;
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

export type BalanceTransferPayload = Omit<BalanceTransferApplication, "_id" | "status" | "createdAt" | "updatedAt"> & { product: "balanceTransfer" };

// ── API Call ────────────────────────────────────────────────────────────────

export const applyBalanceTransfer = (payload: BalanceTransferPayload) =>
  postLoanApplication<BalanceTransferApplication>(payload);
