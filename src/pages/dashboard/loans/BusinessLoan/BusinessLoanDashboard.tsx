import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import { BusinessLoanStatus } from "../../../../components/form/LoanStatusView";
import type { BusinessLoanApplication } from "../../../../api/loanApplications";

const BusinessLoanDashboard = createLoanDashboard<BusinessLoanApplication>({
  productName: "Business Loan",
  icon: "🏢",
  Form: ApplicationForm,
  Status: BusinessLoanStatus,
});

export default BusinessLoanDashboard;
