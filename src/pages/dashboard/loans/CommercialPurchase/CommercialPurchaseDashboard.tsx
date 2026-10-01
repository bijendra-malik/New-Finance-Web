import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import { CommercialPurchaseStatus } from "../../../../components/form/LoanStatusView";
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
      <CommercialPurchaseStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default CommercialPurchaseDashboard;
