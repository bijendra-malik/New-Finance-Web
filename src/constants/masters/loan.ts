import { OTHER_OPTION } from "./common";
export const MORE_THAN_TENURE_OPTION = -1;

export const EXISTING_LOAN_TYPES = [
  "Personal loan", "Business loan", "Home loan", "Vehicle loan", "Working Capital",
  "Project Loan", "OD/CC", "Loan against share", "Gold loan", OTHER_OPTION,
] as const;

export const PERSONAL_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7] as const;
export const PERSONAL_LOAN_MAX_TENURE_YEARS = 7;

export const BUSINESS_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5] as const;
export const BUSINESS_LOAN_MAX_TENURE_YEARS = 10;

export const HOME_LOAN_TENURE_YEARS = [5, 10, 15, 20, 25, 30] as const;
export const HOME_LOAN_MAX_TENURE_YEARS = 30;

export const LOAN_AGAINST_PROPERTY_TENURE_YEARS = [3, 5, 10, 15, 20, 25, 30] as const;
export const LOAN_AGAINST_PROPERTY_MAX_TENURE_YEARS = 30;

export const PROJECT_LOAN_TENURE_YEARS = [3, 5, 7, 10] as const;
export const PROJECT_LOAN_MAX_TENURE_YEARS = 10;

export const VEHICLE_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export const VEHICLE_LOAN_MAX_TENURE_YEARS = 8;

export const EDUCATION_LOAN_TENURE_YEARS = [3, 5, 7, 10, 15] as const;
export const EDUCATION_LOAN_MAX_TENURE_YEARS = 15;

export const WORKING_CAPITAL_TENURE_YEARS = [1, 2, 3, 4, 5] as const;
export const WORKING_CAPITAL_MAX_TENURE_YEARS = 5;

export const COMMERCIAL_PURCHASE_TENURE_YEARS = [3, 5, 10, 15, 20] as const;
export const COMMERCIAL_PURCHASE_MAX_TENURE_YEARS = 20;

export const LEASE_RENTAL_TENURE_YEARS = [3, 5, 7, 10] as const;
export const LEASE_RENTAL_MAX_TENURE_YEARS = 10;

export const LOAN_AGAINST_SHARE_TENURE_YEARS = [1, 2, 3, 5, 6] as const;
export const LOAN_AGAINST_SHARE_MAX_TENURE_YEARS = 6;

export const NPA_TENURE_YEARS = [1, 2, 3, 5] as const;
export const NPA_MAX_TENURE_YEARS = 5;

export const GOLD_LOAN_TENURE_YEARS = [1, 2, 3, 4] as const;
export const GOLD_LOAN_MAX_TENURE_YEARS = 4;

export const FDI_TENURE_YEARS = [3, 5, 7, 10, 15] as const;
export const FDI_MIN_TENURE_YEARS = 3;
export const FDI_MAX_TENURE_YEARS = 15;

export const BALANCE_TRANSFER_TENURE_YEARS = [5, 10, 15, 20, 25, 30] as const;
export const BALANCE_TRANSFER_MAX_TENURE_YEARS = 30;

export const ODCC_TENURE_YEARS = [1, 2, 3, 5, 10, 15, 20] as const;
export const ODCC_MIN_TENURE_YEARS = 1;
export const ODCC_MAX_TENURE_YEARS = 20;

export const FILM_LOAN_TENURE_YEARS = [1, 2, 3, 5] as const;
export const FILM_LOAN_MAX_TENURE_YEARS = 5;

export interface LoanAmountRange {
  min: number;
}

export const LOAN_AMOUNT_RANGES = {
  personal: { min: 50_000 },
  business: { min: 100_000 },
  home: { min: 300_000 },
  loanAgainstProperty: { min: 300_000 },
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
