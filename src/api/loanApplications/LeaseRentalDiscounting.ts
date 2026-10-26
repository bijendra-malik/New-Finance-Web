import axiosInstance from "../axiosInstance";
import type { ApplyResponse } from "./shared";

// ── Types (aligned with the backend's LeaseRental document) ──────────────────────────────

export interface LeaseRentalApplication {

  _id: string;
  fullName: string; mobile: string; email: string; dob: string; panNumber: string;
  state: string; city: string; pincode: string; residenceStatus: string;
  monthlyLeaseIncome: number; totalLeaseAmount: number;
  leasePropertyDuration: number; leasePropertyMarketValue: number; leasePropertyAge: number;
  leasePropertyState: string; leasePropertyCity: string; leasePropertyPincode: string;
  employmentType: string;
  companyName?: string; companyType?: string; monthlyNetSalary?: number; salaryReceivedAs?: string; salaryBankName?: string;
  businessName?: string; businessType?: string;
  gstNumber?: string; companyPanNumber?: string; natureOfBusiness?: string; industryType?: string; subIndustry?: string;
  businessEstablishedDate?: string; transactionBankName?: string | { displayName: string; banks: string[] }; transactionBanks?: string[];
  lastYearTurnover?: number; last2YearsTurnover?: number;
  lastYearNetIncome?: number; last2YearsNetIncome?: number;
  profession?: string;
  currentYearTurnover?: number; priorYearTurnover?: number;
  currentYearNetIncome?: number; previousYearNetIncome?: number;
  businessState?: string; businessCity?: string; businessPincode?: string; businessPlaceStatus?: string;
  loanAmount: number; loanTenure: number;
  existingEMI: number; existingLoanAmount: number;
  existingBanks: string[]; otherBankList?: string[];
  existingLoanTypes: string[]; otherLoanList?: string[];
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

export type LeaseRentalPayload = Omit<LeaseRentalApplication, "_id" | "status" | "createdAt" | "updatedAt"> & { product: "leaseRentalDiscounting" };

// ── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Submit LeaseRentalDiscounting application.
 * POST /customer/loan-apply
 * Requires: Authorization: Bearer <token>
 */
export const applyLeaseRental = async (
  payload: LeaseRentalPayload
): Promise<ApplyResponse<LeaseRentalApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<LeaseRentalApplication>>(
    "/customer/loan-apply",
    payload
  );
  return response.data;
};

