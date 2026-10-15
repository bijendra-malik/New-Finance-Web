import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import { VehicleLoanStatus } from "../../../../components/form/LoanStatusView";
import type { VehicleLoanApplication } from "./components/ApplicationForm";

const VehicleLoanDashboard = () => (
  <DashboardShell<VehicleLoanApplication>
    productName="Vehicle Loan"
    icon="🚗"
    stats={[["Max Amount", "₹1 Crore"], ["Rate", "From 8.5%"], ["Tenure", "Up to 7 yrs"]]}
    renderForm={({ userName, userEmail, onSubmit }) => (
      <ApplicationForm userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
    )}
    renderStatus={({ applicationId, isSubmitted, submittedApp }) => (
      <VehicleLoanStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default VehicleLoanDashboard;
