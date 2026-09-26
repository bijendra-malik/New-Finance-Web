import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import LoanStatus from "./components/LoanStatus";
import type { ODCCLimitApplication } from "./components/ApplicationForm";

const ODCCLimitDashboard = () => (
  <DashboardShell<ODCCLimitApplication>
    productName="OD / CC Limit"
    icon="🏦"
    stats={[["Max Limit", "₹5 Crores"], ["Rate", "From 10.5%"], ["Renewal", "Up to 5 yrs"]]}
    applicationDesc="Fill your limit details"
    renderForm={({ userName, userEmail, onSubmit }) => (
      <ApplicationForm userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
    )}
    renderStatus={({ applicationId, isSubmitted, submittedApp }) => (
      <LoanStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default ODCCLimitDashboard;
