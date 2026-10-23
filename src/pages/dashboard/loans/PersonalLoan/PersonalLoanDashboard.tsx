import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import { PersonalLoanStatus } from "../../../../components/form/LoanStatusView";
import type { PersonalLoanApplication } from "../../../../api/loanApplications";

const PersonalLoanDashboard = createLoanDashboard<PersonalLoanApplication>({
  productName: "Personal Loan",
  icon: "💳",
  Form: ApplicationForm,
  Status: PersonalLoanStatus,
});

export default PersonalLoanDashboard;
