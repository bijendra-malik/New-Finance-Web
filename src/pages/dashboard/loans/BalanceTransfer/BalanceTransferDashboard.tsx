import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import { BalanceTransferStatus } from "../../../../components/form/LoanStatusView";
import type { BalanceTransferApplication } from "./components/ApplicationForm";

const BalanceTransferDashboard = () => (
  <DashboardShell<BalanceTransferApplication>
    productName="Balance Transfer"
    icon="🔄"
    stats={[["Max Amount", "₹5 Crores"], ["Rate", "From 8.5%"], ["Tenure", "Up to 30 yrs"]]}
    renderForm={({ userName, userEmail, onSubmit }) => (
      <ApplicationForm userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
    )}
    renderStatus={({ applicationId, isSubmitted, submittedApp }) => (
      <BalanceTransferStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default BalanceTransferDashboard;
