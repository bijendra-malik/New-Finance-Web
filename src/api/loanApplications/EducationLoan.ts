import { postLoanApplication } from "./shared";
import type { ExistingLoanAmounts, ExistingLoanPortfolio, BusinessIdentity, BusinessFinancials, BusinessLocation } from "./shared";

// ── Types (aligned with the backend's EducationLoan document) ──────────────────────────────

export interface EducationLoanApplication extends ExistingLoanAmounts, ExistingLoanPortfolio, BusinessIdentity, BusinessFinancials, BusinessLocation {
  _id: string;
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  panNumber?: string;
  state: string;
  city: string;
  pincode: string;
  residenceStatus: string;
  parentRelationship: string;
  parentRelationshipOther?: string;
  parentFullName: string;
  parentMobile: string;
  parentEmail: string;
  parentDob: string;
  parentPanNumber: string;
  parentState: string;
  parentCity: string;
  parentPincode: string;
  parentResidenceStatus: string;
  parentResidenceStatusOther?: string;
  educationCountry: string;
  educationCountryOther?: string;
  fieldOfStudy: string;
  fieldOfStudyOther?: string;
  courseName: string;
  university: string;
  instituteName: string;
  enrollmentStatus: string;
  enrollmentStatusOther?: string;
  courseDuration: number;
  educationCost: number;
  employmentType: string;
  companyName?: string;
  companyType?: string;
  monthlySalary?: number;
  salaryReceivedAs?: string;
  salaryBankName?: string;
  loanAmount: number;
  loanTenure: number;
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

export type EducationLoanPayload = Omit<EducationLoanApplication, "_id" | "status" | "createdAt" | "updatedAt"> & { product: "educationLoan" };

// ── API Call ────────────────────────────────────────────────────────────────

export const applyEducationLoan = (payload: EducationLoanPayload) =>
  postLoanApplication<EducationLoanApplication>(payload);
