import ApplicationDetails from "../../shared/ApplicationDetails";
import LoanStatusShell from "../../shared/LoanStatusShell";
import { buildProductSections } from "./receiptSections";
import { fetchEducationLoanApplications } from "../../../../../api/loanApplications";
import type { EducationLoanApplication } from "./ApplicationForm";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: EducationLoanApplication | null;
}

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => (
  <LoanStatusShell<EducationLoanApplication>
    applicationId={applicationId}
    isSubmitted={isSubmitted}
    submittedApp={submittedApp}
    emptyMessage="Submit your education loan application to track its status here."
    fetcher={fetchEducationLoanApplications}
    renderApp={app => (
      <ApplicationDetails
        sections={buildProductSections(app)}
        contact={{ mobile: app.mobile, email: app.email }}
      />
    )}
  />
);

export default LoanStatus;
