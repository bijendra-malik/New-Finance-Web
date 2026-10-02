import axiosInstance from "../axiosInstance";
import type { ApplyResponse, ApplicationsResponse } from "./shared";

// ── Types (aligned with the backend's EducationLoan document) ──────────────────────────────

export interface EducationLoanApplication {

  _id: string;
  fullName: string; mobile: string; email: string; dob: string; panNumber?: string;
  state: string; city: string; pincode: string; residenceStatus: string;
  parentRelationship: string;
  parentRelationshipOther?: string; parentFullName: string; parentMobile: string; parentEmail: string;
  parentDob: string; parentPanNumber: string;
  parentState: string; parentCity: string; parentPincode: string; parentResidenceStatus: string; parentResidenceStatusOther?: string;
  educationCountry: string;
  educationCountryOther?: string; fieldOfStudy: string; fieldOfStudyOther?: string; courseName: string; university: string; instituteName: string;
  enrollmentStatus: string;
  enrollmentStatusOther?: string; courseDuration: number; educationCost: number;
  employmentType: string;
  companyName?: string; companyType?: string; monthlySalary?: number; salaryReceivedAs?: string; salaryBankName?: string;
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
  /** Server-set product label, e.g. "Education Loan". */
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

/** Body accepted by POST /education-loan/apply (everything except server-set fields). */
export type EducationLoanPayload = Omit<EducationLoanApplication, "_id" | "status" | "createdAt" | "updatedAt">;

// ── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Submit EducationLoan application.
 * POST /education-loan/apply
 * Requires: Authorization: Bearer <token>
 */
export const applyEducationLoan = async (
  payload: EducationLoanPayload
): Promise<ApplyResponse<EducationLoanApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<EducationLoanApplication>>(
    "/education-loan/apply",
    payload
  );
  return response.data;
};

/**
 * Fetch all EducationLoan applications for the logged-in user.
 * GET /education-loan/applications
 * Requires: Authorization: Bearer <token>
 */
export const fetchEducationLoanApplications = async (): Promise<ApplicationsResponse<EducationLoanApplication>> => {
  const response = await axiosInstance.get<ApplicationsResponse<EducationLoanApplication>>(
    "/education-loan/applications"
  );
  return response.data;
};
