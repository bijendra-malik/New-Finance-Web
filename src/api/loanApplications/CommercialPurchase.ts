import { postLoanApplication } from "./shared";
import type { ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation } from "./shared";

// ── Types (aligned with the backend's CommercialPurchase document) ──────────────────────────────

export interface CommercialPurchaseApplication extends ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation {
  _id: string;
  buyingPropertyType: string;
  buyingPropertyTypeOther?: string;
  buyingPropertyMarketValue: number;
  buyingPropertyAge: number;
  buyingPropertyState: string;
  buyingPropertyCity: string;
  buyingPropertyPincode: string;
  employmentType: string;
  loanAmount: number;
  loanTenure: number;
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

export type CommercialPurchasePayload = Omit<CommercialPurchaseApplication, "_id" | "status" | "createdAt" | "updatedAt"> & { product: "commercialPurchase" };

// ── API Call ────────────────────────────────────────────────────────────────

export const applyCommercialPurchase = (payload: CommercialPurchasePayload) =>
  postLoanApplication<CommercialPurchaseApplication>(payload);
