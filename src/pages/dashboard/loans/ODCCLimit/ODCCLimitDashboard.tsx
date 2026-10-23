import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import { ODCCLimitStatus } from "../../../../components/form/LoanStatusView";
import type { ODCCLimitApplication } from "./components/ApplicationForm";

const ODCCLimitDashboard = createLoanDashboard<ODCCLimitApplication>({
  productName: "OD / CC Limit",
  icon: "🏦",
  applicationDesc: "Fill your limit details",
  Form: ApplicationForm,
  Status: ODCCLimitStatus,
});

export default ODCCLimitDashboard;
