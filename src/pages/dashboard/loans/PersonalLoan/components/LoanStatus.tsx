import ApplicationDetails from "../../shared/ApplicationDetails";
import LoanStatusShell from "../../shared/LoanStatusShell";
import { buildProductSections } from "./receiptSections";
import { fetchPersonalLoanApplications } from "../../../../../api/loanApplications";
import type { PersonalLoanApplication } from "../../../../../api/loanApplications";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: PersonalLoanApplication | null;
}

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => (
  <LoanStatusShell<PersonalLoanApplication>
    applicationId={applicationId}
    isSubmitted={isSubmitted}
    submittedApp={submittedApp}
    emptyMessage="Submit your personal loan application to track its status here."
    fetcher={fetchPersonalLoanApplications}
    renderApp={app => (
      <ApplicationDetails
        sections={buildProductSections(app)}
        contact={{ mobile: app.mobile, email: app.email }}
      />
    )}
  />
);

export default LoanStatus;
