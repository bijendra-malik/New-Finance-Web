import { buildSuccessSections, resolveOther } from "../../../../../components/form/successSections";
import type { CarLoanApplication } from "./ApplicationForm";

export const buildProductSections = (app: CarLoanApplication) =>
  buildSuccessSections(app, {
    productSection: {
      title: "Vehicle Details",
      rows: [
        { label: "Vehicle Type", value: resolveOther(app.vehicleType, app.vehicleTypeOther) },
        { label: "Transmission", value: resolveOther(app.transmissionType, app.transmissionTypeOther) },
        { label: "Manufacturer", value: app.manufacturer },
        { label: "Model", value: app.model },
        { label: "Fuel Type", value: app.fuelType },
        { label: "Purchase Type", value: resolveOther(app.vehiclePurchaseType, app.vehiclePurchaseTypeOther) },
      ],
    },

  });
