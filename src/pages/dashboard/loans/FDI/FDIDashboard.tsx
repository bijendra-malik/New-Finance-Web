import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import { FDIStatus } from "../../../../components/form/LoanStatusView";
import type { FDIApplication } from "./components/ApplicationForm";

const FDIDashboard = createLoanDashboard<FDIApplication>({
  productName: "FDI",
  icon: "🌐",
  Form: ApplicationForm,
  Status: FDIStatus,
});

export default FDIDashboard;
