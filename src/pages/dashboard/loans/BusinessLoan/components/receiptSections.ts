import { buildSuccessSections } from "../../../../../components/form/successSections";
import type { BusinessLoanApplication } from "../../../../../api/loanApplications/businessLoan";

export const buildProductSections = (app: BusinessLoanApplication) => buildSuccessSections(app);
