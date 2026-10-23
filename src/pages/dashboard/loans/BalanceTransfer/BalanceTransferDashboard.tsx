import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import { BalanceTransferStatus } from "../../../../components/form/LoanStatusView";
import type { BalanceTransferApplication } from "./components/ApplicationForm";

const BalanceTransferDashboard = createLoanDashboard<BalanceTransferApplication>({
  productName: "Balance Transfer",
  icon: "🔄",
  Form: ApplicationForm,
  Status: BalanceTransferStatus,
});

export default BalanceTransferDashboard;
