import DashboardShell from "../shared/DashboardShell";
import ApplicationForm from "./components/ApplicationForm";
import LoanStatus from "./components/LoanStatus";
import type { FilmLoanApplication } from "./components/ApplicationForm";

const FilmLoanDashboard = () => (
  <DashboardShell<FilmLoanApplication>
    productName="Film Funding"
    icon="🎬"
    stats={[["Max Amount", "₹5 Crores"], ["Rate", "From 12%"], ["Tenure", "Up to 10 yrs"]]}
    applicationDesc="Fill your funding details"
    renderForm={({ userName, userEmail, onSubmit }) => (
      <ApplicationForm userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
    )}
    renderStatus={({ applicationId, isSubmitted, submittedApp }) => (
      <LoanStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
    )}
  />
);

export default FilmLoanDashboard;
