import type { BalanceTransferApplication } from "./ApplicationForm";
import LoanStatusShell, { ContactNote } from "../../shared/LoanStatusShell";
import { LoanSummaryCard, ApplicantDetailsCard, ExistingObligationsCard } from "../../shared/LoanStatusSections";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: BalanceTransferApplication | null;
}

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => {
  const app = submittedApp ?? undefined;

  return (
    <LoanStatusShell
      applicationId={applicationId}
      isSubmitted={isSubmitted}
      submittedApp={app}
      emptyMessage="Submit your balance transfer application to track its status here."
    >
      {app && (
        <>
          <LoanSummaryCard
            title="Transfer Details"
            app={app}
          />
          <ApplicantDetailsCard app={app} />
          <ExistingObligationsCard app={app} pillSource="loanTypes" />
          <ContactNote mobile={app.mobile} email={app.email} />
        </>
      )}
    </LoanStatusShell>
  );
};

export default LoanStatus;
