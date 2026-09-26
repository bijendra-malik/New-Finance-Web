import LoanStatusShell from "../../shared/LoanStatusShell";
import ApplicationDetails from "../../shared/ApplicationDetails";
import { buildProductSections } from "./receiptSections";
import type { ODCCLimitApplication } from "./ApplicationForm";
interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: ODCCLimitApplication | null;
}

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => {
  const app = submittedApp ?? undefined;

  return (
    <LoanStatusShell
      applicationId={applicationId}
      isSubmitted={isSubmitted}
      submittedApp={app}
      emptyMessage="Submit your OD / CC limit application to track its status here."
    >
      {app && <ApplicationDetails sections={buildProductSections(app)} contact={{ mobile: app.mobile, email: app.email }} />}
    </LoanStatusShell>
  );
};

export default LoanStatus;
