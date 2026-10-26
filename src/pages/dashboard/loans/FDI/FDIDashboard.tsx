import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import type { FDIApplication } from "./components/ApplicationForm";

const FDIDashboard = createLoanDashboard<FDIApplication>({
  productName: "FDI",
  icon: "🌐",
  Form: ApplicationForm,
});

export default FDIDashboard;
