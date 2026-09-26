import type { LeaseRentalApplication } from "./ApplicationForm";
import LoanStatusShell, { ContactNote, StatusCard, StatusRow } from "../../shared/LoanStatusShell";
import { LoanSummaryCard, ApplicantDetailsCard, ExistingObligationsCard } from "../../shared/LoanStatusSections";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: LeaseRentalApplication | null;
}

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => {
  const app = submittedApp ?? undefined;

  return (
    <LoanStatusShell
      applicationId={applicationId}
      isSubmitted={isSubmitted}
      submittedApp={app}
      emptyMessage="Submit your lease rental discounting application to track its status here."
    >
      {app && (
        <>
          <LoanSummaryCard
            app={app}
          />

          <StatusCard title="Lease Property Details" accent="#26ae90">

          <div className="space-y-3">
            <div className="space-y-3">
              {([ ["Market Value", `₹${(app?.leasePropertyMarketValue??0).toLocaleString("en-IN")}`], ["Duration", `${app?.leasePropertyDuration??0} years`], ["Age", `${app?.leasePropertyAge??0} years`], ["City", `${app?.leasePropertyCity??""}, ${app?.leasePropertyState??""}`], ["Pincode", app?.leasePropertyPincode??"—"], ]).map(([l, v]) => (
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
