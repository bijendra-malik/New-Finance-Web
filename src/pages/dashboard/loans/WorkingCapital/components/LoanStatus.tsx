import ApplicationDetails from "../../shared/ApplicationDetails";
import LoanStatusShell from "../../shared/LoanStatusShell";
import { buildProductSections } from "./receiptSections";
import { fetchWorkingCapitalApplications } from "../../../../../api/loanApplications";
import type { WorkingCapitalApplication } from "./ApplicationForm";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: WorkingCapitalApplication | null;
}

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => (
  <LoanStatusShell<WorkingCapitalApplication>
    applicationId={applicationId}
    isSubmitted={isSubmitted}
    submittedApp={submittedApp}
    emptyMessage="Submit your working capital application to track its status here."
    fetcher={fetchWorkingCapitalApplications}
    renderApp={app => (
      <ApplicationDetails
        sections={buildProductSections(app)}
        contact={{ mobile: app.mobile, email: app.email }}
      />
    )}
  />
);

export default LoanStatus;
