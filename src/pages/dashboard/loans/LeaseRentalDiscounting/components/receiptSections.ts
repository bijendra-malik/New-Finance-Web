import { buildSuccessSections } from "../../../../../components/form/successSections";
import type { LeaseRentalApplication } from "./ApplicationForm";

export const buildProductSections = (app: LeaseRentalApplication) =>
  buildSuccessSections(app, {
    productSection: {
      title: "Leased Property Details",
      rows: [
        { label: "Monthly Lease Rental", value: app.monthlyLeaseIncome ? `₹${app.monthlyLeaseIncome.toLocaleString("en-IN")}` : undefined },
        { label: "Total Lease Amount", value: app.totalLeaseAmount ? `₹${app.totalLeaseAmount.toLocaleString("en-IN")}` : undefined },
        { label: "Lease Duration", value: app.leasePropertyDuration ? `${app.leasePropertyDuration.toLocaleString("en-IN")} years` : undefined },
        { label: "Market Value", value: app.leasePropertyMarketValue ? `₹${app.leasePropertyMarketValue.toLocaleString("en-IN")}` : undefined },
        { label: "Property Age", value: app.leasePropertyAge ? `${app.leasePropertyAge.toLocaleString("en-IN")} years` : undefined },
        { label: "Location", value: [app.leasePropertyCity, app.leasePropertyState].filter(Boolean).join(", ") || undefined },
        { label: "Pincode", value: app.leasePropertyPincode },
      ],
    },

  });
