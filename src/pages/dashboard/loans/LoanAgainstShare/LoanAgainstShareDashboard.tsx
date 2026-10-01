import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import { LoanAgainstShareStatus } from "../../../../components/form/LoanStatusView";
import type { LoanAgainstShareApplication } from "./components/ApplicationForm";

const LoanAgainstShareDashboard = () => (
  <DashboardShell<LoanAgainstShareApplication>
    productName="Loan Against Share"
    icon="📈"
    stats={[["Max Amount", "₹5 Crores"], ["Rate", "From 10.5%"], ["Tenure", "Up to 7 yrs"]]}
    renderForm={({ userName, userEmail, onSubmit }) => (
      <ApplicationForm userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
    )}
    renderStatus={({ applicationId, isSubmitted, submittedApp }) => (
      <LoanAgainstShareStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default LoanAgainstShareDashboard;
