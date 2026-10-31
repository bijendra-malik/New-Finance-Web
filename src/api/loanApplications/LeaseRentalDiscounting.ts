import { postLoanApplication } from "./shared";
import type { ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation } from "./shared";

// ── Types (aligned with the backend's LeaseRental document) ──────────────────────────────

export interface LeaseRentalApplication extends ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation {
  _id: string;
  monthlyLeaseIncome: number;
  totalLeaseAmount: number;
  leasePropertyDuration: number;
  leasePropertyMarketValue: number;
  leasePropertyAge: number;
  leasePropertyState: string;
  leasePropertyCity: string;
  leasePropertyPincode: string;
  employmentType: string;
  loanAmount: number;
  loanTenure: number;
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

export type LeaseRentalPayload = Omit<LeaseRentalApplication, "_id" | "status" | "createdAt" | "updatedAt"> & { product: "leaseRentalDiscounting" };

// ── API Call ────────────────────────────────────────────────────────────────

export const applyLeaseRental = (payload: LeaseRentalPayload) =>
  postLoanApplication<LeaseRentalApplication>(payload);
