import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import type { HomeLoanApplication } from "../../../../api/loanApplications";

const HomeLoanDashboard = createLoanDashboard<HomeLoanApplication>({
  productName: "Home Loan",
  icon: "🏠",
  Form: ApplicationForm,
});

export default HomeLoanDashboard;
