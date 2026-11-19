import { formatINR } from "../../../../../utils/formatters";
import { buildSuccessSections, resolveOther } from "../../../../../components/form/successSections";
import type { FDIApplication } from "../../../../../api/loanApplications/FDI";

export const buildProductSections = (app: FDIApplication) =>
  buildSuccessSections(app, {
    amountLabel: "Fund Amount",
    productSection: {
      title: "Security Details",
      rows: [
        { label: "Fund Against", value: resolveOther(app.collateralPropertyType, app.collateralPropertyTypeOther) },
        { label: "Company Valuation", value: app.companyEvaluationValue ? formatINR(app.companyEvaluationValue) : undefined },
        { label: "Interested in Equity Partner", value: app.interestedInEquityPartner },
        { label: "Equity Share Offered", value: app.equityShareOffered ? `${app.equityShareOffered.toLocaleString("en-IN")} %` : undefined },
        { label: "Location", value: [app.collateralPropertyCity, app.collateralPropertyState].filter(Boolean).join(", ") || undefined },
        { label: "Pincode", value: app.collateralPropertyPincode },
      ],
    },

  });
