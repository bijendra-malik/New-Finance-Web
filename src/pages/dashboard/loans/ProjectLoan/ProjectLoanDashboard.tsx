import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import type { ProjectLoanApplication } from "./components/ApplicationForm";

const ProjectLoanDashboard = createLoanDashboard<ProjectLoanApplication>({
  productName: "Project Loan",
  icon: "🏗️",
  Form: ApplicationForm,
});

export default ProjectLoanDashboard;
