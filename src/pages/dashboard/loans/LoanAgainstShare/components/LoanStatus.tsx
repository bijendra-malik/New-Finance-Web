import ApplicationDetails from "../../shared/ApplicationDetails";
import LoanStatusShell from "../../shared/LoanStatusShell";
import { buildProductSections } from "./receiptSections";
import { fetchLoanAgainstShareApplications } from "../../../../../api/loanApplications";
import type { LoanAgainstShareApplication } from "./ApplicationForm";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: LoanAgainstShareApplication | null;
}

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => (
  <LoanStatusShell<LoanAgainstShareApplication>
    applicationId={applicationId}
    isSubmitted={isSubmitted}
    submittedApp={submittedApp}
    emptyMessage="Submit your loan against share application to track its status here."
    fetcher={fetchLoanAgainstShareApplications}
    renderApp={app => (
      <ApplicationDetails
        sections={buildProductSections(app)}
        contact={{ mobile: app.mobile, email: app.email }}
      />
    )}
  />
);

export default LoanStatus;
