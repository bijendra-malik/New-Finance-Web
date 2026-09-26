import { buildSuccessSections } from "../../../../../components/form/successSections";
import type { LoanAgainstPropertyApplication } from "./ApplicationForm";

export const buildProductSections = (app: LoanAgainstPropertyApplication) =>
  buildSuccessSections(app, {
    productSection: {
      title: "Collateral Property Details",
      rows: [
        { label: "Property Type", value: app.collateralPropertyType },
        { label: "Market Value", value: app.collateralPropertyMarketValue ? `₹${app.collateralPropertyMarketValue.toLocaleString("en-IN")}` : undefined },
        { label: "Property Age", value: app.collateralPropertyAge ? `${app.collateralPropertyAge.toLocaleString("en-IN")} years` : undefined },
        { label: "Location", value: [app.collateralPropertyCity, app.collateralPropertyState].filter(Boolean).join(", ") || undefined },
        { label: "Pincode", value: app.collateralPropertyPincode },
      ],
    },

  });
