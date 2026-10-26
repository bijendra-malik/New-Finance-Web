import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import type { LoanAgainstShareApplication } from "./components/ApplicationForm";

const LoanAgainstShareDashboard = createLoanDashboard<LoanAgainstShareApplication>({
  productName: "Loan Against Share",
  icon: "📈",
  Form: ApplicationForm,
});

export default LoanAgainstShareDashboard;
