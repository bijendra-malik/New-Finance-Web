import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import LoanStatus from "./components/LoanStatus";
import type { NPAApplication } from "./components/ApplicationForm";

const NPADashboard = () => (
  <DashboardShell<NPAApplication>
    productName="NPA Resolution"
    icon="⚠️"
    stats={[["Max Amount", "₹5 Crores"], ["Support", "Dedicated RM"], ["Timeline", "Within 30 days"]]}
    applicationDesc="Fill your NPA account details"
    renderForm={({ userName, userEmail, onSubmit }) => (
      <ApplicationForm userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
    )}
    renderStatus={({ applicationId, isSubmitted, submittedApp }) => (
      <LoanStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default NPADashboard;
