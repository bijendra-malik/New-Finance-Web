// Loan-specific master lists: existing-loan types and per-loan tenure options.
import { OTHER_OPTION } from "./common";

export const EXISTING_LOAN_TYPES = [
  "Personal loan", "Business loan", "Home loan", "Car loan", "Working Capital",
  "Project Loan", "OD/CC", "Loan against share", "Gold loan", OTHER_OPTION,
] as const;

export const PERSONAL_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7] as const;

export const BUSINESS_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const HOME_LOAN_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
] as const;

export const LOAN_AGAINST_PROPERTY_TENURE_YEARS = [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
] as const;

export const PROJECT_LOAN_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;

export const CAR_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7] as const;

export const EDUCATION_LOAN_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;

export const WORKING_CAPITAL_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const COMMERCIAL_PURCHASE_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;

export const LEASE_RENTAL_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;

export const LOAN_AGAINST_SHARE_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7] as const;

export const NPA_TENURE_YEARS = [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
] as const;

export const GOLD_LOAN_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
] as const;

export const FDI_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
] as const;
