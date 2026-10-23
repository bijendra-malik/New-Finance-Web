import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import { ProjectLoanStatus } from "../../../../components/form/LoanStatusView";
import type { ProjectLoanApplication } from "./components/ApplicationForm";

const ProjectLoanDashboard = createLoanDashboard<ProjectLoanApplication>({
  productName: "Project Loan",
  icon: "🏗️",
  Form: ApplicationForm,
  Status: ProjectLoanStatus,
});

export default ProjectLoanDashboard;
