import { buildSuccessSections } from "../../../../../components/form/successSections";
import type { CreditCardApplication } from "./ApplicationForm";

export const buildProductSections = (app: CreditCardApplication) =>
  buildSuccessSections(app, {
    extraLoanRows: [
      { label: "Preferred Bank", value: app.applyForBank },
      { label: "Existing Active Card", value: app.hasActiveCard },
    ],

  });
