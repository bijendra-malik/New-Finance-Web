import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import type { NPAApplication } from "./components/ApplicationForm";

const NPADashboard = createLoanDashboard<NPAApplication>({
  productName: "NPA Resolution",
  icon: "⚠️",
  applicationDesc: "Fill your NPA account details",
  Form: ApplicationForm,
});

export default NPADashboard;
