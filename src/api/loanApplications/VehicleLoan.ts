import { postLoanApplication } from "./shared";
import type { ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation } from "./shared";

// ── Types (aligned with the backend's VehicleLoan document) ──────────────────────────────
export interface VehicleLoanApplication extends ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation {
  _id: string;
  vehicleType?: string;
  vehicleTypeOther?: string;
  transmissionType?: string;
  transmissionTypeOther?: string;
  manufacturer?: string;
  model?: string;
  fuelType?: string;
  vehiclePurchaseType?: string;
  vehiclePurchaseTypeOther?: string;
  employmentType: string;
  loanAmount: number;
  loanTenure: number;
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}
export type VehicleLoanPayload = Omit<VehicleLoanApplication, "_id" | "status" | "createdAt" | "updatedAt"> & { product: "vehicleLoan" };

// ── API Call ────────────────────────────────────────────────────────────────

export const applyVehicleLoan = (payload: VehicleLoanPayload) =>
  postLoanApplication<VehicleLoanApplication>(payload);
