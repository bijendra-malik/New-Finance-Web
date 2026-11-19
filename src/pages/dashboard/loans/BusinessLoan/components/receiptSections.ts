import { buildSuccessSections } from "../../../../../components/form/successSections";
import type { BusinessLoanApplication } from "../../../../../api/loanApplications/BusinessLoan";

export const buildProductSections = (app: BusinessLoanApplication) => buildSuccessSections(app);
