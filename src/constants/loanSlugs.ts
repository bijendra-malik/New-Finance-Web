// UI product names, canonical backend keys, URL-safe slugs
export const LOAN_SLUGS = {
  personal: "personal-loan",
  business: "business-loan",
  home: "home-loan",
  lap: "loan-against-property",
  balanceTransfer: "balance-transfer",
  vehicleLoan: "vehicle-loan",
  creditCard: "credit-card",
  educationLoan: "education-loan",
  projectLoan: "project-loan",
  commercialPurchase: "commercial-purchase",
  leaseRentalDiscounting: "lease-rental-discounting",
  workingCapital: "working-capital",
  filmFunding: "film-funding",
  odCcLimit: "od-cc-limit",
  loanAgainstShare: "loan-against-share",
  goldLoan: "gold-loan",
  fdiLoan: "fdi",
  npaLoan: "npa",
} as const;

export type LoanKey = keyof typeof LOAN_SLUGS;

const LOAN_LABELS: Readonly<Record<LoanKey, string>> = {
  personal: "Personal Loan",
  business: "Business Loan",
  home: "Home Loan",
  lap: "Loan Against Property",
  balanceTransfer: "Balance Transfer",
  vehicleLoan: "Vehicle Loan",
  creditCard: "Credit Card",
  educationLoan: "Education Loan",
  projectLoan: "Project Loan",
  commercialPurchase: "Commercial Purchase",
  leaseRentalDiscounting: "Lease Rental Discounting",
  workingCapital: "Working Capital",
  filmFunding: "Film Funding",
  odCcLimit: "OD CC Limit",
  loanAgainstShare: "Loan Against Share",
  goldLoan: "Gold Loan",
  fdiLoan: "FDI",
  npaLoan: "NPA",
};

const LOAN_KEY_ALIASES: Readonly<Record<string, LoanKey>> = {
  "Personal Loan": "personal",
  "Business Loan": "business",
  "Home Loan": "home",
  "Loan Against Property": "lap",
  "Balance Transfer": "balanceTransfer",
  "Vehicle Loan": "vehicleLoan",
  "Education Loan": "educationLoan",
  "Credit Card": "creditCard",
  "Premium Credit Cards": "creditCard",
  "Project Loan": "projectLoan",
  "Commercial Purchase": "commercialPurchase",
  "Commercial Purchase Loan": "commercialPurchase",
  "Working Capital": "workingCapital",
  "Working Capital Loan": "workingCapital",
  "Lease Rental Discounting": "leaseRentalDiscounting",
  "Film Funding": "filmFunding",
  "OD CC Limit": "odCcLimit",
  "OD / CC Limit": "odCcLimit",
  "Loan Against Share": "loanAgainstShare",
  "Gold Loan": "goldLoan",
  FDI: "fdiLoan",
  NPA: "npaLoan",
  "NPA Resolution": "npaLoan",
};

/** Returns the canonical LOAN_SLUGS key to send to the OTP API. */
export const loanKeyFor = (product: string): LoanKey | null =>
  product in LOAN_SLUGS
    ? (product as LoanKey)
    : LOAN_KEY_ALIASES[product] ?? null;

/** Display label for a canonical loan key. */
export const loanLabelFor = (loanKey: string | null | undefined): string | null =>
  loanKey && loanKey in LOAN_LABELS ? LOAN_LABELS[loanKey as LoanKey] : null;
