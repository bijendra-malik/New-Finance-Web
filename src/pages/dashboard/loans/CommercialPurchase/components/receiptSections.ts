import { buildSuccessSections } from "../../../../../components/form/successSections";
import type { CommercialPurchaseApplication } from "./ApplicationForm";

export const buildProductSections = (app: CommercialPurchaseApplication) =>
  buildSuccessSections(app, {
    productSection: {
      title: "Property Details",
      rows: [
        { label: "Property Type", value: app.buyingPropertyType },
        { label: "Market Value", value: app.buyingPropertyMarketValue ? `₹${app.buyingPropertyMarketValue.toLocaleString("en-IN")}` : undefined },
        { label: "Property Age", value: app.buyingPropertyAge ? `${app.buyingPropertyAge.toLocaleString("en-IN")} years` : undefined },
        { label: "Location", value: [app.buyingPropertyCity, app.buyingPropertyState].filter(Boolean).join(", ") || undefined },
        { label: "Pincode", value: app.buyingPropertyPincode },
      ],
    },

  });
