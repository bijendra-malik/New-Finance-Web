import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import LoanStatus from "./components/LoanStatus";
import type { EducationLoanApplication } from "./components/ApplicationForm";

const EducationLoanDashboard = () => (
  <DashboardShell<EducationLoanApplication>
    productName="Education Loan"
    icon="🎓"
    stats={[["Max Amount", "₹1.5 Crores"], ["Rate", "From 9%"], ["Tenure", "Up to 15 yrs"]]}
    renderForm={({ userName, userEmail, onSubmit }) => (
      <ApplicationForm userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
    )}
    renderStatus={({ applicationId, isSubmitted, submittedApp }) => (
      <LoanStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default EducationLoanDashboard;
