import { LOAN_SLUGS, loanKeyFor } from "./loanSlugs";
import type { LoanKey } from "./loanSlugs";

interface LoanRouteEntry {
  label: string;
  detail: string;
  dashboard: string;
  documents: string;
}

export const LOAN_ROUTES: Readonly<Record<LoanKey, LoanRouteEntry>> = {
  personal: {
    label: "Personal Loan",
    detail: "/showdetails/personal-loan",
    dashboard: "/dashboard/personalloan",
    documents: "/requireddocument/personal-loan",
  },
  business: {
    label: "Business Loan",
    detail: "/showdetails/business-loan",
    dashboard: "/dashboard/businessloan",
    documents: "/requireddocument/business-loan",
  },
  home: {
    label: "Home Loan",
    detail: "/showdetails/home-loan",
    dashboard: "/dashboard/homeloan",
    documents: "/requireddocument/home-loan",
  },
  lap: {
    label: "Loan Against Property",
    detail: "/showdetails/loanAP-loan",
    dashboard: "/dashboard/loanagainstproperty",
    documents: "/requireddocument/loan-against-property",
  },
  balanceTransfer: {
    label: "Balance Transfer",
    detail: "/showdetails/balance-loan",
    dashboard: "/dashboard/balancetransfer",
    documents: "/requireddocument/balance-transfer",
  },
  vehicleLoan: {
    label: "Vehicle Loan",
    detail: "/showdetails/vehicle-loan",
    dashboard: "/dashboard/Vehicleloan",
    documents: "/requireddocument/vehicle-loan",
  },
  creditCard: {
    label: "Credit Card",
    detail: "/showdetails/credit-card",
    dashboard: "/dashboard/creditcard",
    documents: "/requireddocument/credit-card",
  },
  educationLoan: {
    label: "Education Loan",
    detail: "/showdetails/education-loan",
    dashboard: "/dashboard/educationloan",
    documents: "/requireddocument/education-loan",
  },
  projectLoan: {
    label: "Project Loan",
    detail: "/showdetails/project-loan",
    dashboard: "/dashboard/projectloan",
    documents: "/requireddocument/project-loan",
  },
  commercialPurchase: {
    label: "Commercial Purchase",
    detail: "/showdetails/commercial-purchase",
    dashboard: "/dashboard/commercialpurchase",
    documents: "/requireddocument/commercial-purchase",
  },
  leaseRentalDiscounting: {
    label: "Lease Rental Discounting",
    detail: "/showdetails/lease-rental",
    dashboard: "/dashboard/leaserental",
    documents: "/requireddocument/lease-rental",
  },
  workingCapital: {
    label: "Working Capital",
    detail: "/showdetails/working-capital",
    dashboard: "/dashboard/workingcapital",
    documents: "/requireddocument/working-capital",
  },
  filmFunding: {
    label: "Film Funding",
    detail: "/showdetails/film-funding",
    dashboard: "/dashboard/filmfunding",
    documents: "/requireddocument/film-funding",
  },
  odCcLimit: {
    label: "OD CC Limit",
    detail: "/showdetails/od-cc-limit",
    dashboard: "/dashboard/odcclimit",
    documents: "/requireddocument/od-cc-limit",
  },
  loanAgainstShare: {
    label: "Loan Against Share",
    detail: "/showdetails/loan-against-share",
    dashboard: "/dashboard/loanagainstshare",
    documents: "/requireddocument/loan-against-share",
  },
  goldLoan: {
    label: "Gold Loan",
    detail: "/showdetails/gold-loan",
    dashboard: "/dashboard/goldloan",
    documents: "/requireddocument/gold-loan",
  },
  fdiLoan: {
    label: "FDI",
    detail: "/showdetails/fdi",
    dashboard: "/dashboard/fdi",
    documents: "/requireddocument/fdi",
  },
  npaLoan: {
    label: "NPA",
    detail: "/showdetails/npa",
    dashboard: "/dashboard/npa",
    documents: "/requireddocument/npa",
  },
};

const KEY_BY_SLUG = Object.fromEntries(
  Object.entries(LOAN_SLUGS).map(([key, slug]) => [slug, key]),
) as Readonly<Record<string, LoanKey>>;

export const loanRouteFor = (product: string): LoanRouteEntry | null => {
  const key =
    product in LOAN_ROUTES
      ? (product as LoanKey)
      : loanKeyFor(product) ?? KEY_BY_SLUG[product] ?? null;
  return key ? LOAN_ROUTES[key] : null;
};

export const loanLabelFor = (key: string | null | undefined): string | null =>
  key && key in LOAN_ROUTES ? LOAN_ROUTES[key as LoanKey].label : null;
