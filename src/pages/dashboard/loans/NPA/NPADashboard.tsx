import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import { NPAStatus } from "../../../../components/form/LoanStatusView";
import type { NPAApplication } from "./components/ApplicationForm";

const NPADashboard = createLoanDashboard<NPAApplication>({
  productName: "NPA Resolution",
  icon: "⚠️",
  applicationDesc: "Fill your NPA account details",
  Form: ApplicationForm,
  Status: NPAStatus,
});

export default NPADashboard;
