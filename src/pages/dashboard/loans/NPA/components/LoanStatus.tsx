import ApplicationDetails from "../../shared/ApplicationDetails";
import LoanStatusShell from "../../shared/LoanStatusShell";
import { buildProductSections } from "./receiptSections";
import { fetchNPAApplications } from "../../../../../api/loanApplications";
import type { NPAApplication } from "./ApplicationForm";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: NPAApplication | null;
}

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => (
  <LoanStatusShell<NPAApplication>
    applicationId={applicationId}
    isSubmitted={isSubmitted}
    submittedApp={submittedApp}
    emptyMessage="Submit your NPA application to track its status here."
    fetcher={fetchNPAApplications}
    renderApp={app => (
      <ApplicationDetails
        sections={buildProductSections(app)}
        contact={{ mobile: app.mobile, email: app.email }}
      />
    )}
  />
);

export default LoanStatus;
