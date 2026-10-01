import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import { LeaseRentalStatus } from "../../../../components/form/LoanStatusView";
import type { LeaseRentalApplication } from "./components/ApplicationForm";

const LeaseRentalDiscountingDashboard = () => (
  <DashboardShell<LeaseRentalApplication>
    productName="Lease Rental Discounting"
    icon="📃"
    stats={[["Max Amount", "₹2 Crores"], ["Rate", "From 10%"], ["Tenure", "Up to 15 yrs"]]}
    renderForm={({ userName, userEmail, onSubmit }) => (
      <ApplicationForm userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
    )}
    renderStatus={({ applicationId, isSubmitted, submittedApp }) => (
      <LeaseRentalStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default LeaseRentalDiscountingDashboard;
