import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import type { WorkingCapitalApplication } from "./components/ApplicationForm";

const WorkingCapitalDashboard = createLoanDashboard<WorkingCapitalApplication>({
  productName: "Working Capital",
  icon: "💹",
  Form: ApplicationForm,
});

export default WorkingCapitalDashboard;
