import type { FDIApplication } from "./ApplicationForm";
import LoanStatusShell, { ContactNote, StatusCard, StatusRow } from "../../shared/LoanStatusShell";
import { LoanSummaryCard, ApplicantDetailsCard, ExistingObligationsCard } from "../../shared/LoanStatusSections";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: FDIApplication | null;
}

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => {
  const app = submittedApp ?? undefined;

  return (
    <LoanStatusShell
      applicationId={applicationId}
      isSubmitted={isSubmitted}
      submittedApp={app}
      emptyMessage="Submit your loan application to track its status here."
    >
      {app && (
        <>
          <LoanSummaryCard
            app={app}
          />

          <StatusCard title="Fund Against Details" accent="#26ae90">

          <div className="space-y-3">
            <div className="space-y-3">
              {([ ["Fund Against", app?.collateralPropertyType??"—"], ...(app?.collateralPropertyType==="Company Valuation" ? [ ["Company Valuation", `₹${(app?.companyEvaluationValue??0).toLocaleString("en-IN")}`], ["Equity Partner", app?.interestedInEquityPartner??"—"], ...(app?.interestedInEquityPartner==="Yes" ? [ ["Equity Share Offered", `${app?.equityShareOffered??0}%`], ] : []), ] : []), ["Market Value", `₹${(app?.collateralPropertyMarketValue??0).toLocaleString("en-IN")}`], ["Property Age", `${app?.collateralPropertyAge??0} years`], ["City", `${app?.collateralPropertyCity??""}, ${app?.collateralPropertyState??""}`], ["Pincode", app?.collateralPropertyPincode??"—"], ]).map(([l, v]) => (
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
