import { buildSuccessSections } from "../../../../../components/form/successSections";
import type { GoldLoanApplication } from "./ApplicationForm";

export const buildProductSections = (app: GoldLoanApplication) =>
  buildSuccessSections(app, {
    productSection: {
      title: "Gold Details",
      rows: [
        { label: "Type of Loan", value: app.typeOfLoan },
        { label: "Gold Purity (Karat)", value: app.goldCarats },
        { label: "Gold Weight", value: app.goldWeight ? `${app.goldWeight.toLocaleString("en-IN")} g` : undefined },
        { label: "Stone Weight", value: app.typeOfLoan === "Jewellery" && app.jewelryStoneWeight ? `${app.jewelryStoneWeight.toLocaleString("en-IN")} g` : undefined },
        { label: "Other Materials", value: app.typeOfLoan === "Jewellery" && app.jewelryOtherMaterials?.length
          ? app.jewelryOtherMaterials.map(m => `${m.name}: ${m.weight.toLocaleString("en-IN")} g`).join(", ")
          : undefined },
        { label: "Market Value", value: app.collateralPropertyMarketValue ? `₹${app.collateralPropertyMarketValue.toLocaleString("en-IN")}` : undefined },
      ],
    },

  });
