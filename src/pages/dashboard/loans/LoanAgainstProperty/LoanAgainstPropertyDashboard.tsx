import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import type { LoanAgainstPropertyApplication } from "./components/ApplicationForm";

const LoanAgainstPropertyDashboard = createLoanDashboard<LoanAgainstPropertyApplication>({
  productName: "Loan Against Property",
  icon: "🏢",
  Form: ApplicationForm,
});

export default LoanAgainstPropertyDashboard;
