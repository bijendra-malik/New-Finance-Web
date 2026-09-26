import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import LoanStatus from "./components/LoanStatus";
import type { CarLoanApplication } from "./components/ApplicationForm";

const CarLoanDashboard = () => (
  <DashboardShell<CarLoanApplication>
    productName="Vehicle Loan"
    icon="🚗"
    stats={[["Max Amount", "₹1 Crore"], ["Rate", "From 8.5%"], ["Tenure", "Up to 7 yrs"]]}
    renderForm={({ userName, userEmail, onSubmit }) => (
      <ApplicationForm userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
    )}
    renderStatus={({ applicationId, isSubmitted, submittedApp }) => (
      <LoanStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default CarLoanDashboard;
