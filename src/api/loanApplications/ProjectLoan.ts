import { postLoanApplication } from "./shared";
import type { ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation } from "./shared";

// ── Types (aligned with the backend's ProjectLoan document) ──────────────────────────────

export interface ProjectLoanApplication extends ApplicantDetails, ExistingLoanAmounts, ExistingLoanPortfolio, SalariedEmploymentDetails, BusinessIdentity, BusinessFinancials, BusinessLocation {
  _id: string;
  projectType: string;
  projectTypeOther?: string;
  totalProjectCost: number;
  projectStartDate: string;
  projectCompletionDate: string;
  ownInvestment: number;
  employmentType: string;
  loanAmount: number;
  loanTenure: number;
  loanType?: string;
  status: "Submitted";
  createdAt: string;
  updatedAt?: string;
}

export type ProjectLoanPayload = Omit<ProjectLoanApplication, "_id" | "status" | "createdAt" | "updatedAt"> & { product: "projectLoan" };

// ── API Call ────────────────────────────────────────────────────────────────

export const applyProjectLoan = (payload: ProjectLoanPayload) =>
  postLoanApplication<ProjectLoanApplication>(payload);
