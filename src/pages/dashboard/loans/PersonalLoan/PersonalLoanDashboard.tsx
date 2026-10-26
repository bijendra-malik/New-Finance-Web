import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import type { PersonalLoanApplication } from "../../../../api/loanApplications";

const PersonalLoanDashboard = createLoanDashboard<PersonalLoanApplication>({
  productName: "Personal Loan",
  icon: "💳",
  Form: ApplicationForm,
});

export default PersonalLoanDashboard;
