import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import { LoanAgainstShareStatus } from "../../../../components/form/LoanStatusView";
import type { LoanAgainstShareApplication } from "./components/ApplicationForm";

const LoanAgainstShareDashboard = createLoanDashboard<LoanAgainstShareApplication>({
  productName: "Loan Against Share",
  icon: "📈",
  Form: ApplicationForm,
  Status: LoanAgainstShareStatus,
});

export default LoanAgainstShareDashboard;
