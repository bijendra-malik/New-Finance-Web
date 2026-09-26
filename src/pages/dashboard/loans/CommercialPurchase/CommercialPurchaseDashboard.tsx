import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import LoanStatus from "./components/LoanStatus";
import type { CommercialPurchaseApplication } from "./components/ApplicationForm";

const CommercialPurchaseDashboard = () => (
  <DashboardShell<CommercialPurchaseApplication>
    productName="Commercial Purchase"
    icon="🏬"
    stats={[["Max Amount", "₹15 Crores"], ["Rate", "From 9.5%"], ["Tenure", "Up to 15 yrs"]]}
    renderForm={({ userName, userEmail, onSubmit }) => (
      <ApplicationForm userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
    )}
    renderStatus={({ applicationId, isSubmitted, submittedApp }) => (
      <LoanStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default CommercialPurchaseDashboard;
