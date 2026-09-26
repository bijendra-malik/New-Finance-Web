import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import LoanStatus from "./components/LoanStatus";
import type { ProjectLoanApplication } from "./components/ApplicationForm";

const ProjectLoanDashboard = () => (
  <DashboardShell<ProjectLoanApplication>
    productName="Project Loan"
    icon="🏗️"
    stats={[["Max Amount", "₹25 Crores"], ["Rate", "From 11%"], ["Tenure", "Up to 15 yrs"]]}
    renderForm={({ userName, userEmail, onSubmit }) => (
      <ApplicationForm userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
    )}
    renderStatus={({ applicationId, isSubmitted, submittedApp }) => (
      <LoanStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default ProjectLoanDashboard;
