import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import { WorkingCapitalStatus } from "../../../../components/form/LoanStatusView";
import type { WorkingCapitalApplication } from "./components/ApplicationForm";

const WorkingCapitalDashboard = createLoanDashboard<WorkingCapitalApplication>({
  productName: "Working Capital",
  icon: "💹",
  Form: ApplicationForm,
  Status: WorkingCapitalStatus,
});

export default WorkingCapitalDashboard;
