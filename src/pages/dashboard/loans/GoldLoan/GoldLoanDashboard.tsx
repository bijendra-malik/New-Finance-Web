import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import { GoldLoanStatus } from "../../../../components/form/LoanStatusView";
import type { GoldLoanApplication } from "./components/ApplicationForm";

const GoldLoanDashboard = createLoanDashboard<GoldLoanApplication>({
  productName: "Gold Loan",
  icon: "🪙",
  Form: ApplicationForm,
  Status: GoldLoanStatus,
});

export default GoldLoanDashboard;
