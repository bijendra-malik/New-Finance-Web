import { formatINR } from "../../../../../utils/formatters";
import { buildSuccessSections, resolveOther } from "../../../../../components/form/successSections";
import type { BalanceTransferApplication } from "../../../../../api/loanApplications/BalanceTransfer";

export const buildProductSections = (app: BalanceTransferApplication) =>
  buildSuccessSections(app, {
    extraLoanRows: [
      { label: "Transfer Type", value: resolveOther(app.balanceTransferType, app.balanceTransferTypeOther) },
      { label: "Current Property Value", value: app.currentPropertyValue ? formatINR(app.currentPropertyValue) : undefined },
      { label: "Top-up Amount", value: app.topUpAmount ? formatINR(app.topUpAmount) : undefined },
    ],

  });
