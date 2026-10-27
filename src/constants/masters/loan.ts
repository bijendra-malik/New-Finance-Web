// Loan-specific master lists: existing-loan types and per-loan tenure options.
import { OTHER_OPTION } from "./common";
export const MORE_THAN_TENURE_OPTION = -1;

export const EXISTING_LOAN_TYPES = [
  "Personal loan", "Business loan", "Home loan", "Vehicle loan", "Working Capital",
  "Project Loan", "OD/CC", "Loan against share", "Gold loan", OTHER_OPTION,
] as const;

/** Personal loans: 7 years is the market ceiling (SBI and Axis 7 years, HDFC 6). */
export const PERSONAL_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7] as const;
export const PERSONAL_LOAN_MAX_TENURE_YEARS = 7;

/** Unsecured business loans: 5 years (Axis and Kotak both cap at 5). */
export const BUSINESS_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5] as const;
export const BUSINESS_LOAN_MAX_TENURE_YEARS = 10;

/** Home loans: up to 30 years (SBI / HDFC). */
export const HOME_LOAN_TENURE_YEARS = [5, 10, 15, 20, 25, 30] as const;
export const HOME_LOAN_MAX_TENURE_YEARS = 30;

/** Loan against property: 1–20 years (Axis 20, HDFC 15). */
export const LOAN_AGAINST_PROPERTY_TENURE_YEARS = [3, 5, 10, 15, 20] as const;
export const LOAN_AGAINST_PROPERTY_MAX_TENURE_YEARS = 20;

/** MSME project loans: up to 10 years (SBI UDAAN 120 months). */
export const PROJECT_LOAN_TENURE_YEARS = [3, 5, 7, 10] as const;
export const PROJECT_LOAN_MAX_TENURE_YEARS = 10;

/** New-car loans: 7 years for conventional cars (8 only for select EVs). */
export const VEHICLE_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export const VEHICLE_LOAN_MAX_TENURE_YEARS = 8;

/** Education loans: up to 15 years (SBI / Axis). */
export const EDUCATION_LOAN_TENURE_YEARS = [3, 5, 7, 10, 15] as const;
export const EDUCATION_LOAN_MAX_TENURE_YEARS = 15;

/** Working-capital term loans: 1–5 years (SBI ECLGS WCTL 5 years, HDFC 48 months). */
export const WORKING_CAPITAL_TENURE_YEARS = [1, 2, 3, 4, 5] as const;
export const WORKING_CAPITAL_MAX_TENURE_YEARS = 5;

/** Commercial property purchase: 3–20 years (ICICI 240 months, L&T Finance 3–20). */
export const COMMERCIAL_PURCHASE_TENURE_YEARS = [3, 5, 10, 15, 20] as const;
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

/** Gold loans: 6 months to 4 years (Kotak 4 years, SBI/Axis 36 months). */
export const GOLD_LOAN_TENURE_YEARS = [1, 2, 3, 4] as const;
export const GOLD_LOAN_MAX_TENURE_YEARS = 4;

/** FDI-linked funding: RBI's ECB rules set a 3-year minimum average maturity and no maximum, so 15 years covers the long end of typical foreign funding. */
export const FDI_TENURE_YEARS = [3, 5, 7, 10, 15] as const;
export const FDI_MIN_TENURE_YEARS = 3;
export const FDI_MAX_TENURE_YEARS = 15;

/** Balance transfer follows the home-loan ceiling: up to 30 years. */
export const BALANCE_TRANSFER_TENURE_YEARS = [5, 10, 15, 20, 25, 30] as const;
export const BALANCE_TRANSFER_MAX_TENURE_YEARS = 30;

/** OD/CC: renewed yearly in market practice, repaid over up to 20 years (SBI 12–240 months, Axis 10 years) */
export const ODCC_TENURE_YEARS = [1, 2, 3, 5, 10, 15, 20] as const;
export const ODCC_MIN_TENURE_YEARS = 1;
export const ODCC_MAX_TENURE_YEARS = 20;

/** Film production funding follows the project's cash flow; 5 years. */
export const FILM_LOAN_TENURE_YEARS = [1, 2, 3, 5] as const;
export const FILM_LOAN_MAX_TENURE_YEARS = 5;

export interface LoanAmountRange {
  min: number;
}

export const LOAN_AMOUNT_RANGES = {
  personal: { min: 50_000 },
  business: { min: 100_000 },
  home: { min: 300_000 },
  loanAgainstProperty: { min: 500_000 },
  balanceTransfer: { min: 300_000 },
  project: { min: 100_000 },
  vehicle: { min: 100_000 },
  education: { min: 50_000 },
  workingCapital: { min: 100_000 },
  commercialPurchase: { min: 300_000 },
  leaseRental: { min: 50_000 },
  loanAgainstShare: { min: 25_000 },
  gold: { min: 10_000 },
  npa: { min: 100_000 },
  odCc: { min: 100_000 },
  fdi: { min: 100_000_000 },
  film: { min: 10_000_000 },
} as const satisfies Record<string, LoanAmountRange>;
