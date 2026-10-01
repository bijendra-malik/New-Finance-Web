import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import { GoldLoanStatus } from "../../../../components/form/LoanStatusView";
import type { GoldLoanApplication } from "./components/ApplicationForm";

const GoldLoanDashboard = () => (
  <DashboardShell<GoldLoanApplication>
    productName="Gold Loan"
    icon="🪙"
    stats={[["Max Amount", "₹50 Lakhs"], ["Rate", "From 7%"], ["Tenure", "Up to 10 yrs"]]}
    renderForm={({ userName, userEmail, onSubmit }) => (
      <ApplicationForm userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
    )}
    renderStatus={({ applicationId, isSubmitted, submittedApp }) => (
      <GoldLoanStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default GoldLoanDashboard;
