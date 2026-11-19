import { buildSuccessSections, resolveOther } from "../../../../../components/form/successSections";
import type { CreditCardApplication } from "../../../../../api/loanApplications/CreditCard";

export const buildProductSections = (app: CreditCardApplication) =>
  buildSuccessSections(app, {
    loanSectionTitle: "Credit Card Requirement",
    extraLoanRows: [
      { label: "Preferred Bank", value: resolveOther(app.applyForBank, app.applyForBankOther) },
      { label: "Existing Active Card", value: app.hasActiveCard },
    ],

  });
