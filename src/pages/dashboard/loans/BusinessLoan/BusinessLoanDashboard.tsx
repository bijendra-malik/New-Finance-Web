import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import type { BusinessLoanApplication } from "../../../../api/loanApplications";

const BusinessLoanDashboard = createLoanDashboard<BusinessLoanApplication>({
  productName: "Business Loan",
  icon: "🏢",
  Form: ApplicationForm,
});

export default BusinessLoanDashboard;
