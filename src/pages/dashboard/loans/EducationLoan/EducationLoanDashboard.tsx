import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import { EducationLoanStatus } from "../../../../components/form/LoanStatusView";
import type { EducationLoanApplication } from "./components/ApplicationForm";

const EducationLoanDashboard = createLoanDashboard<EducationLoanApplication>({
  productName: "Education Loan",
  icon: "🎓",
  Form: ApplicationForm,
  Status: EducationLoanStatus,
});

export default EducationLoanDashboard;
