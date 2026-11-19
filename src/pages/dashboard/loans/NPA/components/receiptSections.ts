import { formatINR } from "../../../../../utils/formatters";
import { buildSuccessSections, fmtList, resolveOther } from "../../../../../components/form/successSections";
import type { NPAApplication } from "../../../../../api/loanApplications/NPA";

export const buildProductSections = (app: NPAApplication) =>
  buildSuccessSections(app, {
    extraLoanRows: [
      { label: "NPA Status", value: resolveOther(app.npaStatus, app.npaStatusOther) },
      { label: "OTS Offer Amount", value: app.otsOfferAmount ? formatINR(app.otsOfferAmount) : undefined },
    ],
    productSection: {
      title: "Collateral Property Details",
      rows: [
        { label: "Property Type", value: resolveOther(app.collateralPropertyType, app.collateralPropertyTypeOther) },
        { label: "Market Value", value: app.collateralPropertyMarketValue ? formatINR(app.collateralPropertyMarketValue) : undefined },
        { label: "Property Age", value: app.collateralPropertyAge ? `${app.collateralPropertyAge.toLocaleString("en-IN")} years` : undefined },
        { label: "Location", value: [app.collateralPropertyCity, app.collateralPropertyState].filter(Boolean).join(", ") || undefined },
        { label: "Pincode", value: app.collateralPropertyPincode },
      ],
    },
    extraSections: [{
      title: "NPA Account Details",
      rows: [
        { label: "Principal Loan Amount", value: app.npaPrincipalLoanAmount ? formatINR(app.npaPrincipalLoanAmount) : undefined },
        { label: "Current Outstanding", value: app.npaCurrentOutstandingAmount ? formatINR(app.npaCurrentOutstandingAmount) : undefined },
        { label: "NPA Banks", value: fmtList([...(app.existingBanksNpa ?? []), ...(app.existingBanksNpaOther ?? [])]), force: true },
        { label: "Non-NPA Banks", value: fmtList([...(app.existingBanksNonNpa ?? []), ...(app.existingBanksNonNpaOther ?? [])]), force: true },
        { label: "Existing Loan Types (NPA)", value: fmtList([...(app.existingLoanTypesNpa ?? []), ...(app.existingLoanTypesNpaOther ?? [])]), force: true },
        { label: "Existing Loan Types (Non NPA)", value: fmtList([...(app.existingLoanTypesNonNpa ?? []), ...(app.existingLoanTypesNonNpaOther ?? [])]), force: true },
      ],
    }],

  });
