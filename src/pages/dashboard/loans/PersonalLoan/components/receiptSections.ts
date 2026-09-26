import { buildSuccessSections } from "../../../../../components/form/successSections";
import type { PersonalLoanApplication } from "../../../../../api/loanApplications";

export const buildProductSections = (app: PersonalLoanApplication) =>
  buildSuccessSections(app, {
    amountLabel: "Loan Amount" 
  });
