import { buildSuccessSections } from "../../../../../components/form/successSections";
import type { NPAApplication } from "./ApplicationForm";

export const buildProductSections = (app: NPAApplication) =>
  buildSuccessSections(app, {
    extraLoanRows: [
      { label: "NPA Status", value: app.npaStatus === "Other" ? app.npaStatusOther : app.npaStatus },
      { label: "OTS Offer Amount", value: app.otsOfferAmount ? `₹${app.otsOfferAmount.toLocaleString("en-IN")}` : undefined },
    ],
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
    extraSections: [{
      title: "NPA Account Details",
      rows: [
        { label: "Principal Loan Amount", value: app.npaPrincipalLoanAmount ? `₹${app.npaPrincipalLoanAmount.toLocaleString("en-IN")}` : undefined },
        { label: "Current Outstanding", value: app.npaCurrentOutstandingAmount ? `₹${app.npaCurrentOutstandingAmount.toLocaleString("en-IN")}` : undefined },
        { label: "NPA Banks", value: app.existingBanksNpa?.length ? [...app.existingBanksNpa, ...(app.existingBanksNpaOther ?? [])].join(", ") : undefined },
        { label: "Non-NPA Banks", value: app.existingBanksNonNpa?.length ? [...app.existingBanksNonNpa, ...(app.existingBanksNonNpaOther ?? [])].join(", ") : undefined },
      ],
    }],

  });
