import type { LoanAgainstShareApplication } from "./ApplicationForm";
import LoanStatusShell, { ContactNote, StatusCard, StatusRow } from "../../shared/LoanStatusShell";
import { LoanSummaryCard, ApplicantDetailsCard, ExistingObligationsCard } from "../../shared/LoanStatusSections";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: LoanAgainstShareApplication | null;
}

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => {
  const app = submittedApp ?? undefined;

  return (
    <LoanStatusShell
      applicationId={applicationId}
      isSubmitted={isSubmitted}
      submittedApp={app}
      emptyMessage="Submit your loan against share application to track its status here."
    >
      {app && (
        <>
          <LoanSummaryCard
            app={app}
          />

          <StatusCard title="Share Details" accent="#26ae90">

          <div className="space-y-3">
            <div className="space-y-3">
              {([ ["Company", app?.shareCompanyName??"—"], ["Value / Share", `₹${(app?.valueOfOneShare??0).toLocaleString("en-IN")}`], ["Quantity", String(app?.quantityOfShare??0)], ["Total Share Value",`₹${(app?.totalShareValue??0).toLocaleString("en-IN")}`], ]).map(([l, v]) => (
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
