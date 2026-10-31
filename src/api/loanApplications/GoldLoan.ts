import { postLoanApplication } from "./shared";
import type { ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation } from "./shared";

// ── Types (aligned with the backend's GoldLoan document) ──────────────────────────────

export interface GoldLoanApplication extends ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation {
  _id: string;
  typeOfLoan: string;
  typeOfLoanOther?: string;
  goldCarats: string;
  goldCaratsOther?: string;
  goldWeight: number;
  jewelryGoldWeight?: number;
  jewelryStoneWeight?: number;
  jewelryOtherMaterials?: { name: string; weight: number }[];
  collateralPropertyMarketValue: number;
  employmentType: string;
  loanAmount: number;
  loanTenure: number;
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

export type GoldLoanPayload = Omit<GoldLoanApplication, "_id" | "status" | "createdAt" | "updatedAt"> & { product: "goldLoan" };

// ── API Call ────────────────────────────────────────────────────────────────

export const applyGoldLoan = (payload: GoldLoanPayload) =>
  postLoanApplication<GoldLoanApplication>(payload);
