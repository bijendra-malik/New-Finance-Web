import ApplicationDetails from "../../shared/ApplicationDetails";
import LoanStatusShell from "../../shared/LoanStatusShell";
import { buildProductSections } from "./receiptSections";
import { fetchODCCLimitApplications } from "../../../../../api/loanApplications";
import type { ODCCLimitApplication } from "./ApplicationForm";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: ODCCLimitApplication | null;
}

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => (
  <LoanStatusShell<ODCCLimitApplication>
    applicationId={applicationId}
    isSubmitted={isSubmitted}
    submittedApp={submittedApp}
    emptyMessage="Submit your OD / CC limit application to track its status here."
    fetcher={fetchODCCLimitApplications}
    renderApp={app => (
      <ApplicationDetails
        sections={buildProductSections(app)}
        contact={{ mobile: app.mobile, email: app.email }}
      />
    )}
  />
);

export default LoanStatus;
