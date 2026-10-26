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
export const BUSINESS_LOAN_MAX_TENURE_YEARS = 5;

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
export const VEHICLE_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7] as const;
export const VEHICLE_LOAN_MAX_TENURE_YEARS = 7;

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

/** Rupee bounds for one product's Required Loan Amount field. */
export interface LoanAmountRange {
  min: number;
  max: number;
}

export const LOAN_AMOUNT_RANGES = {
  /** ICICI from ₹50,000 up to ₹50 lakh; SBI ₹1 lakh–₹50 lakh. */
  personal: { min: 50_000, max: 5_000_000 },
  /** Tata Capital ₹1 lakh–₹1 crore; HDFC up to ₹1 crore unsecured. */
  business: { min: 100_000, max: 10_000_000 },
  /** Axis starts at ₹3 lakh; mainstream bank ceilings are ₹10 crore. */
  home: { min: 300_000, max: 100_000_000 },
  /** Axis starts at ₹5 lakh; SBI caps at ₹5 crore, ICICI's calculator at ₹25 crore. */
  loanAgainstProperty: { min: 500_000, max: 100_000_000 },
  /** Axis starts at ₹3 lakh; the ceiling is the outstanding loan. */
  balanceTransfer: { min: 300_000, max: 50_000_000 },
  /** SBI MSME UDAAN sanctions up to ₹50 crore. */
  project: { min: 100_000, max: 500_000_000 },
  /** Lenders fund up to 100% of the car's value; ₹2 crore covers the luxury segment. */
  vehicle: { min: 100_000, max: 20_000_000 },
  /** Axis starts at ₹50,000; ICICI ₹2 crore India, ₹3 crore abroad. */
  education: { min: 50_000, max: 30_000_000 },
  /** SIDBI STEP caps at ₹3 crore; sector schemes go higher. */
  workingCapital: { min: 100_000, max: 100_000_000 },
  /** L&T Finance starts at ₹3 lakh; SBI commercial real estate up to ₹50 crore. */
  commercialPurchase: { min: 300_000, max: 500_000_000 },
  /** SBI Rent Plus: starts at ₹50,000, ₹7.5 crore metro ceiling. */
  leaseRental: { min: 50_000, max: 75_000_000 },
  /** ICICI starts at ₹25,000, HDFC at ₹30,000; equity-backed loans cap at ₹1 crore. */
  loanAgainstShare: { min: 25_000, max: 10_000_000 },
  /** Manappuram advertises from ₹10,000; Bank of Baroda ₹75 lakh per borrower. */
  gold: { min: 10_000, max: 10_000_000 },
  /** NPA resolution is case-specific; no published market range. */
  npa: { min: 100_000, max: 50_000_000 },
  /** RBL drop-line OD up to ₹15 crore; SBI commercial real estate to ₹50 crore. */
  odCc: { min: 100_000, max: 150_000_000 },
  /** No published floor; institutional funding tickets start near ₹10 crore. ECB size limits run to about US$1bn (10K CR). */
  fdi: { min: 100_000_000, max: 100_000_000_000 },
  /** No current lender quote for film funding; unchanged internal cap. */
  film: { min: 10_000_000, max: 50_000_000 },
} as const satisfies Record<string, LoanAmountRange>;
