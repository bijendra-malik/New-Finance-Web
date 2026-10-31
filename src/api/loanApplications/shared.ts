import axiosInstance from "../axiosInstance";

export type LoanApplicationStatus = "Submitted";

/** POST /customer/loan-apply → single saved application. */
export interface ApplyResponse<T> {
  success: boolean;
  data: T;
}

export const postLoanApplication = async <TApplication>(
  payload: object,
): Promise<ApplyResponse<TApplication>> => {
  const response = await axiosInstance.post<ApplyResponse<TApplication>>(
    "/customer/loan-apply",
    payload,
  );
  return response.data;
};

// ── Field groups shared by the product documents ─────────────────────────────

/** Identity + residence, captured by PersonalDetailsSection on every product. */
export interface ApplicantDetails {
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  panNumber: string;
  state: string;
  city: string;
  pincode: string;
  residenceStatus: string;
}

/** Existing EMI / loan amount, captured by ExistingLoanExposureSection. */
export interface ExistingLoanAmounts {
  existingEMI: number;
  existingLoanAmount: number;
}

/** Banks and loan types already held, captured by ExistingLoanExposureSection. */
export interface ExistingLoanPortfolio {
  existingBanks: string[];
  otherBankList?: string[];
  existingLoanTypes: string[];
  otherLoanList?: string[];
}

/** Salaried branch of IncomeDetailsSection. */
export interface SalariedEmploymentDetails {
  companyName?: string;
  companyType?: string;
  monthlyNetSalary?: number;
  salaryReceivedAs?: string;
  salaryBankName?: string;
}

/** Registration details of the applicant's business or practice. */
export interface BusinessIdentity {
  businessName?: string;
  businessType?: string;
  gstNumber?: string;
  companyPanNumber?: string;
  natureOfBusiness?: string;
  industryType?: string;
  subIndustry?: string;
}

/** Establishment date, banking relationship and turnover of the business. */
export interface BusinessFinancials {
  businessEstablishedDate?: string;
  transactionBankName?: string | { displayName: string; banks: string[] };
  transactionBanks?: string[];
  lastYearTurnover?: number;
  last2YearsTurnover?: number;
  lastYearNetIncome?: number;
  last2YearsNetIncome?: number;
  profession?: string;
  currentYearTurnover?: number;
  priorYearTurnover?: number;
  currentYearNetIncome?: number;
  previousYearNetIncome?: number;
}

/** Where the business or practice is located. */
export interface BusinessLocation {
  businessState?: string;
  businessCity?: string;
  businessPincode?: string;
  businessPlaceStatus?: string;
}

/** Server-assigned fields every saved application document carries. */
export interface LoanDocumentMeta {
  _id: string;
  loanType?: string;
  status: LoanApplicationStatus;
  createdAt: string;
  updatedAt?: string;
}
