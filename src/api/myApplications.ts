// One view across every loan product's GET /{product}/applications endpoint.
// Each product keeps its own collection, so this module fans out with
// allSettled: a product the backend has not deployed (or that the customer has
// never touched) must not blank out the rest.

import {
  fetchBalanceTransferApplications,
  fetchBusinessLoanApplications,
  fetchCarLoanApplications,
  fetchCommercialPurchaseApplications,
  fetchCreditCardApplications,
  fetchEducationLoanApplications,
  fetchFDIApplications,
  fetchFilmLoanApplications,
  fetchGoldLoanApplications,
  fetchHomeLoanApplications,
  fetchLeaseRentalApplications,
  fetchLoanAgainstPropertyApplications,
  fetchLoanAgainstShareApplications,
  fetchNPAApplications,
  fetchODCCLimitApplications,
  fetchPersonalLoanApplications,
  fetchProjectLoanApplications,
  fetchWorkingCapitalApplications,
} from "./loanApplications";
import type { ApplicationsResponse } from "./loanApplications/shared";

/** Fields every product document carries; the rest is product-specific detail. */
export interface MyApplication {
  _id: string;
  /** Stable product key, e.g. "personal-loan". */
  productKey: string;
  /** Display name, e.g. "Personal Loan". */
  productName: string;
  status: string;
  createdAt: string;
  loanAmount?: number;
  /** The route that leads back to this product's dashboard, when one exists. */
  dashboardPath?: string;
}

interface ProductSource {
  key: string;
  name: string;
  dashboardPath?: string;
  fetch: () => Promise<ApplicationsResponse<{ _id: string; status?: string; createdAt: string; loanAmount?: number }>>;
}

// Same order as the site's loan nav, so the page reads top-to-bottom like the menu.
const SOURCES: ProductSource[] = [
  { key: "personal-loan", name: "Personal Loan", dashboardPath: "/dashboard/personalloan", fetch: fetchPersonalLoanApplications as ProductSource["fetch"] },
  { key: "business-loan", name: "Business Loan", dashboardPath: "/dashboard/businessloan", fetch: fetchBusinessLoanApplications as ProductSource["fetch"] },
  { key: "home-loan", name: "Home Loan", dashboardPath: "/dashboard/homeloan", fetch: fetchHomeLoanApplications as ProductSource["fetch"] },
  { key: "loan-against-property", name: "Loan Against Property", dashboardPath: "/dashboard/loanagainstproperty", fetch: fetchLoanAgainstPropertyApplications as ProductSource["fetch"] },
  { key: "balance-transfer", name: "Balance Transfer", dashboardPath: "/dashboard/balancetransfer", fetch: fetchBalanceTransferApplications as ProductSource["fetch"] },
  { key: "project-loan", name: "Project Loan", dashboardPath: "/dashboard/projectloan", fetch: fetchProjectLoanApplications as ProductSource["fetch"] },
  { key: "vehicle-loan", name: "Vehicle Loan", dashboardPath: "/dashboard/carloan", fetch: fetchCarLoanApplications as ProductSource["fetch"] },
  { key: "education-loan", name: "Education Loan", dashboardPath: "/dashboard/educationloan", fetch: fetchEducationLoanApplications as ProductSource["fetch"] },
  { key: "credit-card", name: "Credit Card", dashboardPath: "/dashboard/creditcard", fetch: fetchCreditCardApplications as ProductSource["fetch"] },
  { key: "commercial-purchase", name: "Commercial Purchase", dashboardPath: "/dashboard/commercialpurchase", fetch: fetchCommercialPurchaseApplications as ProductSource["fetch"] },
  { key: "working-capital", name: "Working Capital", dashboardPath: "/dashboard/workingcapital", fetch: fetchWorkingCapitalApplications as ProductSource["fetch"] },
  { key: "lease-rental-discounting", name: "Lease Rental Discounting", dashboardPath: "/dashboard/leaserental", fetch: fetchLeaseRentalApplications as ProductSource["fetch"] },
  { key: "od-cc-limit", name: "OD CC Limit", dashboardPath: "/dashboard/odcclimit", fetch: fetchODCCLimitApplications as ProductSource["fetch"] },
  { key: "loan-against-share", name: "Loan Against Share", dashboardPath: "/dashboard/loanagainstshare", fetch: fetchLoanAgainstShareApplications as ProductSource["fetch"] },
  { key: "film-funding", name: "Film Funding", dashboardPath: "/dashboard/filmfunding", fetch: fetchFilmLoanApplications as ProductSource["fetch"] },
  { key: "npa", name: "NPA", dashboardPath: "/dashboard/npa", fetch: fetchNPAApplications as ProductSource["fetch"] },
  { key: "gold-loan", name: "Gold Loan", dashboardPath: "/dashboard/goldloan", fetch: fetchGoldLoanApplications as ProductSource["fetch"] },
  { key: "fdi", name: "FDI", dashboardPath: "/dashboard/fdi", fetch: fetchFDIApplications as ProductSource["fetch"] },
];

/**
 * Every application the signed-in customer has submitted, newest first.
 * Rejections are skipped so one missing endpoint cannot fail the whole list.
 */
export const fetchMyApplications = async (): Promise<MyApplication[]> => {
  const settled = await Promise.allSettled(SOURCES.map((source) => source.fetch()));
  const rows: MyApplication[] = [];
  settled.forEach((result, index) => {
    if (result.status !== "fulfilled" || !result.value?.success) return;
    const source = SOURCES[index];
    for (const app of result.value.data ?? []) {
      if (!app?._id) continue;
      rows.push({
        _id: app._id,
        productKey: source.key,
        productName: source.name,
        status: app.status?.trim() || "Submitted",
        createdAt: app.createdAt,
        loanAmount: app.loanAmount,
        dashboardPath: source.dashboardPath,
      });
    }
  });
  return rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
