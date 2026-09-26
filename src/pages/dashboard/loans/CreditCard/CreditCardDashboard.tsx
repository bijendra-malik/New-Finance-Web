import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import LoanStatus from "./components/LoanStatus";
import type { CreditCardApplication } from "./components/ApplicationForm";

const CreditCardDashboard = () => (
  <DashboardShell<CreditCardApplication>
    productName="Credit Card"
    icon="💳"
    stats={[["Cashback", "Up to 5%"], ["Annual Fee", "₹0 - ₹999"], ["Approval", "In 48 hrs"]]}
    applicationDesc="Fill your card details"
    renderForm={({ userName, userEmail, onSubmit }) => (
      <ApplicationForm userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
    )}
    renderStatus={({ applicationId, isSubmitted, submittedApp }) => (
      <LoanStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default CreditCardDashboard;
