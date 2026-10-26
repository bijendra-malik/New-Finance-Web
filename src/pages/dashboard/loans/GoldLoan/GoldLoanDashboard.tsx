import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import type { GoldLoanApplication } from "./components/ApplicationForm";

const GoldLoanDashboard = createLoanDashboard<GoldLoanApplication>({
  productName: "Gold Loan",
  icon: "🪙",
  Form: ApplicationForm,
});

export default GoldLoanDashboard;
