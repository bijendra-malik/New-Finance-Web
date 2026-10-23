import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import { LoanAgainstPropertyStatus } from "../../../../components/form/LoanStatusView";
import type { LoanAgainstPropertyApplication } from "./components/ApplicationForm";

const LoanAgainstPropertyDashboard = createLoanDashboard<LoanAgainstPropertyApplication>({
  productName: "Loan Against Property",
  icon: "🏢",
  Form: ApplicationForm,
  Status: LoanAgainstPropertyStatus,
});

export default LoanAgainstPropertyDashboard;
