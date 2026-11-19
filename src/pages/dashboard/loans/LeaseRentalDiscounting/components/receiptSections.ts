import { formatINR } from "../../../../../utils/formatters";
import { buildSuccessSections } from "../../../../../components/form/successSections";
import type { LeaseRentalApplication } from "../../../../../api/loanApplications/LeaseRentalDiscounting";

export const buildProductSections = (app: LeaseRentalApplication) =>
  buildSuccessSections(app, {
    productSection: {
      title: "Leased Property Details",
      rows: [
        { label: "Monthly Lease Rental", value: app.monthlyLeaseIncome ? formatINR(app.monthlyLeaseIncome) : undefined },
        { label: "Total Lease Amount", value: app.totalLeaseAmount ? formatINR(app.totalLeaseAmount) : undefined },
        { label: "Lease Duration", value: app.leasePropertyDuration ? `${app.leasePropertyDuration.toLocaleString("en-IN")} years` : undefined },
        { label: "Market Value", value: app.leasePropertyMarketValue ? formatINR(app.leasePropertyMarketValue) : undefined },
        { label: "Property Age", value: app.leasePropertyAge ? `${app.leasePropertyAge.toLocaleString("en-IN")} years` : undefined },
        { label: "Location", value: [app.leasePropertyCity, app.leasePropertyState].filter(Boolean).join(", ") || undefined },
        { label: "Pincode", value: app.leasePropertyPincode },
      ],
    },

  });
