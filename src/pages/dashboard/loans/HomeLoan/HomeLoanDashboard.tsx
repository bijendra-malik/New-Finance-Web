import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import { HomeLoanStatus } from "../../../../components/form/LoanStatusView";
import type { HomeLoanApplication } from "../../../../api/loanApplications";

const HomeLoanDashboard = createLoanDashboard<HomeLoanApplication>({
  productName: "Home Loan",
  icon: "🏠",
  Form: ApplicationForm,
  Status: HomeLoanStatus,
});

export default HomeLoanDashboard;
