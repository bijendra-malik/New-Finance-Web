import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import type { EducationLoanApplication } from "./components/ApplicationForm";

const EducationLoanDashboard = createLoanDashboard<EducationLoanApplication>({
  productName: "Education Loan",
  icon: "🎓",
  Form: ApplicationForm,
});

export default EducationLoanDashboard;
