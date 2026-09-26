import type { ProjectLoanApplication } from "./ApplicationForm";
import LoanStatusShell, { ContactNote, StatusCard, StatusRow } from "../../shared/LoanStatusShell";
import { LoanSummaryCard, ApplicantDetailsCard, ExistingObligationsCard } from "../../shared/LoanStatusSections";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: ProjectLoanApplication | null;
}

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => {
  const app = submittedApp ?? undefined;

  return (
    <LoanStatusShell
      applicationId={applicationId}
      isSubmitted={isSubmitted}
      submittedApp={app}
      emptyMessage="Submit your project loan application to track its status here."
    >
      {app && (
        <>
          <LoanSummaryCard
            app={app}
          />

          <StatusCard title="Project Timeline" accent="#26ae90">

          <div className="space-y-3">
            <div className="space-y-3">
              {([ ["Start Date", app?.projectStartDate?new Date(app?.projectStartDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"—"], ["Completion Date", app?.projectCompletionDate?new Date(app?.projectCompletionDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"—"], ["Own Investment", `₹${(app?.ownInvestment??0).toLocaleString("en-IN")}`], ]).map(([l, v]) => (
                <StatusRow key={l} label={l} value={v} />
              ))}
            </div>
          </div>
          </StatusCard>
          <ApplicantDetailsCard app={app} />
          <ExistingObligationsCard app={app} />
          <ContactNote mobile={app.mobile} email={app.email} />
        </>
      )}
    </LoanStatusShell>
  );
};

export default LoanStatus;
