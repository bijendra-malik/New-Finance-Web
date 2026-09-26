import { buildSuccessSections } from "../../../../../components/form/successSections";
import type { LoanAgainstShareApplication } from "./ApplicationForm";

export const buildProductSections = (app: LoanAgainstShareApplication) =>
  buildSuccessSections(app, {
    productSection: {
      title: "Share Portfolio Details",
      rows: [
        { label: "Share Company", value: app.shareCompanyName },
        { label: "Value of One Share", value: app.valueOfOneShare ? `₹${app.valueOfOneShare.toLocaleString("en-IN")}` : undefined },
        { label: "Quantity", value: app.quantityOfShare ? app.quantityOfShare.toLocaleString("en-IN") : undefined },
        { label: "Total Portfolio Value", value: app.totalShareValue ? `₹${app.totalShareValue.toLocaleString("en-IN")}` : undefined },
      ],
    },

  });
