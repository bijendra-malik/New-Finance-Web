import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import LoanStatus from "./components/LoanStatus";
import type { WorkingCapitalApplication } from "./components/ApplicationForm";

const WorkingCapitalDashboard = () => (
  <DashboardShell<WorkingCapitalApplication>
    productName="Working Capital"
    icon="💹"
    stats={[["Max Amount", "₹10 Crores"], ["Rate", "From 11.5%"], ["Tenure", "Up to 10 yrs"]]}
    renderForm={({ userName, userEmail, onSubmit }) => (
      <ApplicationForm userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
    )}
    renderStatus={({ applicationId, isSubmitted, submittedApp }) => (
      <LoanStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default WorkingCapitalDashboard;
