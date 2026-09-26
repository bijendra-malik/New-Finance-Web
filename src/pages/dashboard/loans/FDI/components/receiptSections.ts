import { buildSuccessSections } from "../../../../../components/form/successSections";
import type { FDIApplication } from "./ApplicationForm";

export const buildProductSections = (app: FDIApplication) =>
  buildSuccessSections(app, {
    amountLabel: "Fund Amount",
    productSection: {
      title: "Security Details",
      rows: [
        { label: "Fund Against", value: app.collateralPropertyType },
        { label: "Company Valuation", value: app.companyEvaluationValue ? `₹${app.companyEvaluationValue.toLocaleString("en-IN")}` : undefined },
        { label: "Interested in Equity Partner", value: app.interestedInEquityPartner },
        { label: "Equity Share Offered", value: app.equityShareOffered ? `${app.equityShareOffered.toLocaleString("en-IN")} %` : undefined },
        { label: "Location", value: [app.collateralPropertyCity, app.collateralPropertyState].filter(Boolean).join(", ") || undefined },
        { label: "Pincode", value: app.collateralPropertyPincode },
      ],
    },

  });
