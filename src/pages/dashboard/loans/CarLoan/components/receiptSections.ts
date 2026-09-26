import { buildSuccessSections } from "../../../../../components/form/successSections";
import type { CarLoanApplication } from "./ApplicationForm";

export const buildProductSections = (app: CarLoanApplication) =>
  buildSuccessSections(app, {
    productSection: {
      title: "Vehicle Details",
      rows: [
        { label: "Vehicle Type", value: app.vehicleType },
        { label: "Transmission", value: app.transmissionType },
        { label: "Manufacturer", value: app.manufacturer },
        { label: "Model", value: app.model },
        { label: "Purchase Type", value: app.vehiclePurchaseType },
      ],
    },

  });
