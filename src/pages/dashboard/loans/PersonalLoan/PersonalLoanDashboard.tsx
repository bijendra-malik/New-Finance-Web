import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import LoanStatus from "./components/LoanStatus";
import type { PersonalLoanApplication } from "../../../../api/loanApplications";

const PersonalLoanDashboard = () => (
  <DashboardShell<PersonalLoanApplication>
    productName="Personal Loan"
    icon="💳"
    stats={[["Max Amount", "₹50 Lakhs"], ["Rate", "From 10.5%"], ["Tenure", "Up to 84 mo"]]}
    renderForm={({ userName, userEmail, onSubmit }) => (
      <ApplicationForm userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
    )}
    renderStatus={({ applicationId, isSubmitted, submittedApp }) => (
      <LoanStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default PersonalLoanDashboard;
