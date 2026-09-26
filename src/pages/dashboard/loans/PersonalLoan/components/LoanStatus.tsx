import type { PersonalLoanApplication } from "../../../../../api/loanApplications";
import LoanStatusShell, { ContactNote } from "../../shared/LoanStatusShell";
import { LoanSummaryCard, ApplicantDetailsCard, ExistingObligationsCard } from "../../shared/LoanStatusSections";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: PersonalLoanApplication | null;
}

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => {
  const app = submittedApp ?? undefined;

  return (
    <LoanStatusShell applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={app}>
      {app && (
        <>
          <LoanSummaryCard
            app={app}
            extraTiles={[
              { label: "Employment", value: app.employmentType ?? "—" },
              { label: "Residence",  value: app.residenceStatus ?? "—" },
            ]}
          />
          <ApplicantDetailsCard app={app} />
          <ExistingObligationsCard app={app} />
          <ContactNote mobile={app.mobile} email={app.email} />
        </>
      )}
    </LoanStatusShell>
  );
};

export default LoanStatus;
