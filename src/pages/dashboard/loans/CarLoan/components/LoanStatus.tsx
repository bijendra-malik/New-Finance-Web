import type { CarLoanApplication } from "./ApplicationForm";
import LoanStatusShell, { StatusCard, StatusRow, ContactNote } from "../../shared/LoanStatusShell";
import { LoanSummaryCard, ApplicantDetailsCard, ExistingObligationsCard } from "../../shared/LoanStatusSections";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: CarLoanApplication | null;
}

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => {
  const app = submittedApp ?? undefined;

  return (
    <LoanStatusShell
      applicationId={applicationId}
      isSubmitted={isSubmitted}
      submittedApp={app}
      emptyMessage="Submit your vehicle loan application to track its status here."
    >
      {app && (
        <>
          <LoanSummaryCard
            app={app}
            extraTiles={[
              { label: "Employment", value: app.employmentType ?? "—" },
              { label: "Residence",  value: app.residenceStatus ?? "—" },
            ]}
          />

          <StatusCard title="Vehicle Details" accent="#26ae90">
            <div className="space-y-3">
              {[
                ["Vehicle Type",  app.vehicleType ?? "—"],
                ["Transmission",  app.transmissionType ?? "—"],
                ["Manufacturer",  app.manufacturer ?? "—"],
                ["Model",         app.model ?? "—"],
                ["Purchase Type", app.vehiclePurchaseType ?? "—"],
              ].map(([l, v]) => <StatusRow key={l} label={l} value={v} />)}
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
