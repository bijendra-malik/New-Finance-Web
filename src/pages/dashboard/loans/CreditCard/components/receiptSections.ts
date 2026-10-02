import { buildSuccessSections, resolveOther } from "../../../../../components/form/successSections";
import type { CreditCardApplication } from "./ApplicationForm";

export const buildProductSections = (app: CreditCardApplication) =>
  buildSuccessSections(app, {
    extraLoanRows: [
      { label: "Preferred Bank", value: resolveOther(app.applyForBank, app.applyForBankOther) },
      { label: "Existing Active Card", value: app.hasActiveCard },
    ],

  });
