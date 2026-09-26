import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import LoanStatus from "./components/LoanStatus";
import type { BusinessLoanApplication } from "../../../../api/loanApplications";

const BusinessLoanDashboard = () => (
  <DashboardShell<BusinessLoanApplication>
    productName="Business Loan"
    icon="🏢"
    stats={[["Max Amount", "₹5 Crores"], ["Rate", "From 12%"], ["Tenure", "Up to 10 yrs"]]}
    renderForm={({ userName, userEmail, onSubmit }) => (
      <ApplicationForm userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
    )}
    renderStatus={({ applicationId, isSubmitted, submittedApp }) => (
      <LoanStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default BusinessLoanDashboard;
