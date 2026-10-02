import { buildSuccessSections, resolveOther } from "../../../../../components/form/successSections";
import type { BalanceTransferApplication } from "./ApplicationForm";

export const buildProductSections = (app: BalanceTransferApplication) =>
  buildSuccessSections(app, {
    extraLoanRows: [
      { label: "Transfer Type", value: resolveOther(app.balanceTransferType, app.balanceTransferTypeOther) },
      { label: "Current Property Value", value: app.currentPropertyValue ? `₹${app.currentPropertyValue.toLocaleString("en-IN")}` : undefined },
      { label: "Top-up Amount", value: app.topUpAmount ? `₹${app.topUpAmount.toLocaleString("en-IN")}` : undefined },
    ],

  });
