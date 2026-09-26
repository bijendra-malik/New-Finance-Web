import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import LoanStatus from "./components/LoanStatus";
import type { LoanAgainstPropertyApplication } from "./components/ApplicationForm";

const LoanAgainstPropertyDashboard = () => (
  <DashboardShell<LoanAgainstPropertyApplication>
    productName="Loan Against Property"
    icon="🏢"
    stats={[["Max Amount", "₹5 Crores"], ["Rate", "From 9%"], ["Tenure", "Up to 20 yrs"]]}
    renderForm={({ userName, userEmail, onSubmit }) => (
      <ApplicationForm userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
    )}
    renderStatus={({ applicationId, isSubmitted, submittedApp }) => (
      <LoanStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default LoanAgainstPropertyDashboard;
