// Loan-specific master lists: existing-loan types and per-loan tenure options.
import { OTHER_OPTION } from "./common";
export const MORE_THAN_TENURE_OPTION = -1;

export const EXISTING_LOAN_TYPES = [
  "Personal loan", "Business loan", "Home loan", "Vehicle loan", "Working Capital",
  "Project Loan", "OD/CC", "Loan against share", "Gold loan", OTHER_OPTION,
] as const;

/** Personal loans: 7 years is the final ceiling (SBI 7, ICICI 84 months). */
export const PERSONAL_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7] as const;
export const PERSONAL_LOAN_MAX_TENURE_YEARS = 7;

/** Unsecured business loans: 60 months is the common market ceiling. */
export const BUSINESS_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5] as const;
export const BUSINESS_LOAN_MAX_TENURE_YEARS = 5;

/** Home loans: up to 30 years (SBI / HDFC). */
export const HOME_LOAN_TENURE_YEARS = [5, 10, 15, 20, 25, 30] as const;
export const HOME_LOAN_MAX_TENURE_YEARS = 30;

/** Loan against property: up to 20 years (Tata Capital / Axis Finance). */
export const LOAN_AGAINST_PROPERTY_TENURE_YEARS = [3, 5, 10, 15, 20] as const;
export const LOAN_AGAINST_PROPERTY_MAX_TENURE_YEARS = 20;

/** MSME project loans: up to 10 years (SBI UDAAN 120 months). */
export const PROJECT_LOAN_TENURE_YEARS = [3, 5, 7, 10] as const;
export const PROJECT_LOAN_MAX_TENURE_YEARS = 10;

/** New-car loans: 7 years for conventional cars (8 only for select EVs). */
export const VEHICLE_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7] as const;
export const VEHICLE_LOAN_MAX_TENURE_YEARS = 7;

/** Education loans: up to 15 years (SBI / Axis). */
export const EDUCATION_LOAN_TENURE_YEARS = [3, 5, 7, 10, 15] as const;
export const EDUCATION_LOAN_MAX_TENURE_YEARS = 15;

/** Working-capital term loans: up to 4 years (HDFC 48 months). */
export const WORKING_CAPITAL_TENURE_YEARS = [1, 2, 3, 4] as const;
export const WORKING_CAPITAL_MAX_TENURE_YEARS = 4;

/** Commercial property purchase: up to 20 years (ICICI 240 months). */
export const COMMERCIAL_PURCHASE_TENURE_YEARS = [5, 10, 15, 20] as const;
export const COMMERCIAL_PURCHASE_MAX_TENURE_YEARS = 20;

/** Lease rental discounting: 10 years or the residual lease, whichever is lower. */
export const LEASE_RENTAL_TENURE_YEARS = [3, 5, 7, 10] as const;
export const LEASE_RENTAL_MAX_TENURE_YEARS = 10;

/** Loan against shares: up to 6 years (72-month structured facility). */
export const LOAN_AGAINST_SHARE_TENURE_YEARS = [1, 2, 3, 5, 6] as const;
export const LOAN_AGAINST_SHARE_MAX_TENURE_YEARS = 6;

/** NPA resolution / takeover: case-specific; 5 years is a practical cap. */
export const NPA_TENURE_YEARS = [1, 2, 3, 5] as const;
export const NPA_MAX_TENURE_YEARS = 5;

/** Gold loans: up to 3 years (HDFC 42 months, SBI 36 months). */
export const GOLD_LOAN_TENURE_YEARS = [1, 2, 3] as const;
export const GOLD_LOAN_MAX_TENURE_YEARS = 3;

/** FDI-linked funding: short structured facility; 5 years. */
export const FDI_TENURE_YEARS = [1, 2, 3, 5] as const;
export const FDI_MAX_TENURE_YEARS = 5;

/** Balance transfer follows the home-loan ceiling: up to 30 years. */
export const BALANCE_TRANSFER_TENURE_YEARS = [5, 10, 15, 20, 25, 30] as const;
export const BALANCE_TRANSFER_MAX_TENURE_YEARS = 30;

/** OD/CC limits are renewed annually; 3 years covers a dropline review cycle. */
export const ODCC_TENURE_YEARS = [1, 2, 3] as const;
export const ODCC_MAX_TENURE_YEARS = 3;

/** Film production funding follows the project's cash flow; 5 years. */
export const FILM_LOAN_TENURE_YEARS = [1, 2, 3, 5] as const;
export const FILM_LOAN_MAX_TENURE_YEARS = 5;
