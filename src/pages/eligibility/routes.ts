import { productPath } from "./models";

const PRODUCT_BY_LOAN_KEY: Readonly<Record<string, string>> = {
  personal: "personal",
  business: "business",
  home: "home",
  lap: "lap",
  vehicleLoan: "vehicleLoan",
  educationLoan: "educationLoan",
  projectLoan: "projectLoan",
  commercialPurchase: "commercialPurchase",
  workingCapital: "workingCapital",
  leaseRentalDiscounting: "leaseRentalDiscounting",
  odCcLimit: "odCcLimit",
  goldLoan: "goldLoan",
  loanAgainstShare: "loanAgainstShares",
};

export const eligibilityPathForLoanKey = (key: string | null | undefined): string | null => {
  const product = key ? PRODUCT_BY_LOAN_KEY[key] : undefined;
  return product ? productPath(product) : null;
};

export const DEFAULT_ELIGIBILITY_PATH = productPath("personal");
