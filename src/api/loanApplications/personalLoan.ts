import axiosInstance from "../axiosInstance";
import type { ApplyResponse, LoanApplicationStatus } from "./shared";

// ── Types (aligned with the backend's PersonalLoan document) ──────────────────

export interface PersonalLoanPayload {
  product: "personal";
  loanAmount: number;
  loanTenure: number; // years
  employmentType: string;
  companyName?: string;
  companyType?: string;
  companyTypeOther?: string;
  monthlySalary?: number;
  salaryReceivedAs?: string;
  salaryReceivedAsOther?: string;
  salaryBankName?: string;
  salaryBankNameOther?: string;
  existingEMI: number;
  existingLoanAmount: number;
  existingBanks: string[];
  otherBankList?: string[];
  existingLoanTypes: string[];
  otherLoanList?: string[];
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  panNumber: string;
  state: string;
  city: string;
  pincode: string;
  residenceStatus: string;
  residenceStatusOther?: string;
}

export interface PersonalLoanApplication {
  _id: string;
  user?: string;
  loanType?: string;
  loanAmount: number;
  loanTenure: number;
  employmentType: string;
  companyName?: string;
  companyType?: string;
  monthlySalary?: number;
  salaryReceivedAs?: string;
  salaryBankName?: string;
  existingEMI: number;
  existingLoanAmount: number;
  existingBanks: string[];
  otherBankList?: string[];
  existingLoanTypes: string[];
  otherLoanList?: string[];
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  panNumber: string;
  state: string;
  city: string;
  pincode: string;
  residenceStatus: string;
  status: LoanApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

// ── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Submit personal loan application.
 * POST /customer/loan-apply
 * Requires: Authorization: Bearer <token>
 */
export const applyPersonalLoan = async (
  payload: PersonalLoanPayload
): Promise<ApplyResponse<PersonalLoanApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<PersonalLoanApplication>>(
    "/customer/loan-apply",
    payload
  );
  return response.data;
};

