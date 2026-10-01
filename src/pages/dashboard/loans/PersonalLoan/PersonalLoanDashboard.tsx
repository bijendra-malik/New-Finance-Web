import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import { PersonalLoanStatus } from "../../../../components/form/LoanStatusView";
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
      <PersonalLoanStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default PersonalLoanDashboard;
