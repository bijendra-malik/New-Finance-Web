import { postLoanApplication } from "./shared";
import type { ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, BusinessIdentity, BusinessLocation, LoanApplicationStatus } from "./shared";

// ── Business Loan ─────────────────────────────────────────────────────────────

export interface BusinessLoanPayload {
  product: "business";
  loanAmount: number;
  loanTenure: number;
  employmentType: string;
  // Self Employed - Business branch
  businessName?: string;
  businessType?: string;
  businessTypeOther?: string;
  gstNumber?: string;
  companyPanNumber?: string;
  natureOfBusiness?: string;
  natureOfBusinessOther?: string;
  industryType?: string;
  industryTypeOther?: string;
  subIndustry?: string;
  businessEstablishedDate?: string;
  transactionBankName?: string;
  transactionBanks?: string[];
  lastYearTurnover?: number;
  last2YearsTurnover?: number;
  lastYearNetIncome?: number;
  last2YearsNetIncome?: number;
  // Self Employed - Professional branch
  profession?: string;
  professionOther?: string;
  currentYearTurnover?: number;
  priorYearTurnover?: number;
  currentYearNetIncome?: number;
  previousYearNetIncome?: number;
  // Business location (both self-employed branches)
  businessState?: string;
  businessCity?: string;
  businessPincode?: string;
  businessPlaceStatus?: string;
  businessPlaceStatusOther?: string;
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
  transactionBankOther?: string;
}

export interface BusinessLoanApplication extends ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, BusinessIdentity, BusinessLocation {
  _id: string;
  user?: string;
  loanType?: string;
  loanAmount: number;
  loanTenure: number;
  employmentType: string;
  businessEstablishedDate?: string;
  transactionBankName?: string;
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
  existingBanksOther?: string[];
  existingLoanTypesOther?: string[];
  status: LoanApplicationStatus;
  createdAt: string;
  updatedAt: string;
}
// ── API Call ────────────────────────────────────────────────────────────────

export const applyBusinessLoan = (payload: BusinessLoanPayload) =>
  postLoanApplication<BusinessLoanApplication>(payload);
