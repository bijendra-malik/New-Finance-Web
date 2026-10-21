/**
 * Product identifiers used by the UI mapped to their public URL slug.
 *
 * The OTP API receives the object key (for example, `educationLoan`) at
 * POST /auth/:loanKey. URL slugs are retained for links and display routing.
 */
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
  "Loan Against Share": "loanAgainstShare",
  "Gold Loan": "goldLoan",
  FDI: "fdiLoan",
  NPA: "npaLoan",
};

/** Returns the canonical LOAN_SLUGS key to send to the OTP API. */
export const loanKeyFor = (product: string): LoanKey | null =>
  product in LOAN_SLUGS
    ? (product as LoanKey)
    : LOAN_KEY_ALIASES[product] ?? null;
