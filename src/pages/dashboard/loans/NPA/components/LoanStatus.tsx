import type { NPAApplication } from "./ApplicationForm";
import LoanStatusShell, { StatusCard, StatusRow, ContactNote } from "../../shared/LoanStatusShell";
import { LoanSummaryCard, ApplicantDetailsCard, ExistingObligationsCard } from "../../shared/LoanStatusSections";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: NPAApplication | null;
}

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => {
  const app = submittedApp ?? undefined;

  return (
    <LoanStatusShell
      applicationId={applicationId}
      isSubmitted={isSubmitted}
      submittedApp={app}
      emptyMessage="Submit your NPA application to track its status here."
    >
      {app && (
        <>
          <LoanSummaryCard
            title="Settlement Details"
            app={app}
            extraTiles={[
              { label: "Employment", value: app.employmentType ?? "—" },
              { label: "Residence",  value: app.residenceStatus ?? "—" },
            ]}
          />

          <StatusCard title="Collateral Property Details" accent="#26ae90">
            <div className="space-y-3">
              {[
                ["Property Type", app.collateralPropertyType ?? "—"],
                ["Market Value",  `₹${(app.collateralPropertyMarketValue ?? 0).toLocaleString("en-IN")}`],
                ["Property Age",  `${app.collateralPropertyAge ?? 0} years`],
                ["City",          `${app.collateralPropertyCity ?? ""}, ${app.collateralPropertyState ?? ""}`],
                ["Pincode",       app.collateralPropertyPincode ?? "—"],
              ].map(([l, v]) => <StatusRow key={l} label={l} value={v} />)}
            </div>
          </StatusCard>

          <ApplicantDetailsCard app={app} />
          <ExistingObligationsCard
            app={app}
            extraBanks={app.existingBanksNonNpa ?? []}
          />
          <ContactNote mobile={app.mobile} email={app.email} />
        </>
      )}
    </LoanStatusShell>
  );
};

export default LoanStatus;
