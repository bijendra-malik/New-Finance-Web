import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import type { BalanceTransferApplication } from "./components/ApplicationForm";

const BalanceTransferDashboard = createLoanDashboard<BalanceTransferApplication>({
  productName: "Balance Transfer",
  icon: "🔄",
  Form: ApplicationForm,
});

export default BalanceTransferDashboard;
