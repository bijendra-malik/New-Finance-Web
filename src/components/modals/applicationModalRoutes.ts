import { loanRouteFor } from "../../constants/loanRoutes";

/** Loan type → dashboard route, keyed by the marketing name. */
const dashboardRoutes: Readonly<Record<string, string>> = {
  "Personal Loan": "/dashboard/personalloan",
  "Business Loan": "/dashboard/businessloan",
  "Home Loan": "/dashboard/homeloan",
  "Vehicle Loan": "/dashboard/Vehicleloan",
  "Education Loan": "/dashboard/educationloan",
  "Loan Against Property": "/dashboard/loanagainstproperty",
  "Balance Transfer": "/dashboard/balancetransfer",
  "Credit Card": "/dashboard/creditcard",

  "Premium Credit Cards": "/dashboard/creditcard",
  "Project Loan": "/dashboard/projectloan",
  "Commercial Purchase": "/dashboard/commercialpurchase",
  "Commercial Purchase Loan": "/dashboard/commercialpurchase",
  "Working Capital": "/dashboard/workingcapital",
  "Working Capital Loan": "/dashboard/workingcapital",
  "Lease Rental Discounting": "/dashboard/leaserental",
  "Film Funding": "/dashboard/filmfunding",
  "OD CC Limit": "/dashboard/odcclimit",
  "Loan Against Share": "/dashboard/loanagainstshare",
  NPA: "/dashboard/npa",
  "Gold Loan": "/dashboard/goldloan",
  FDI: "/dashboard/fdi",
};

/** The dashboard route for a product, or undefined when it has none yet. */
export const resolveDashboardPath = (productKey: string): string | undefined =>
  loanRouteFor(productKey)?.dashboard ?? dashboardRoutes[productKey];
