import type { FilmLoanApplication } from "./ApplicationForm";
import LoanStatusShell, { ContactNote, StatusCard, StatusRow } from "../../shared/LoanStatusShell";
import { LoanSummaryCard, ApplicantDetailsCard, ExistingObligationsCard } from "../../shared/LoanStatusSections";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: FilmLoanApplication | null;
}

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => {
  const app = submittedApp ?? undefined;

  return (
    <LoanStatusShell
      applicationId={applicationId}
      isSubmitted={isSubmitted}
      submittedApp={app}
      emptyMessage="Submit your funding application to track its status here."
    >
      {app && (
        <>
          <LoanSummaryCard
            title="Funding Details"
            app={app}
          />

          <StatusCard title="Business Details" accent="#26ae90">

          <div className="space-y-3">
            <div className="space-y-3">
              {([ ["Business Name", app?.businessName??app?.profession??"—"], ["Turnover", `₹${(app?.lastYearTurnover??app?.currentYearTurnover??0).toLocaleString("en-IN")}`], ]).map(([l, v]) => (
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
