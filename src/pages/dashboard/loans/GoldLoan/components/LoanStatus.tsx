import type { GoldLoanApplication } from "./ApplicationForm";
import LoanStatusShell, { ContactNote, StatusCard, StatusRow } from "../../shared/LoanStatusShell";
import { LoanSummaryCard, ApplicantDetailsCard, ExistingObligationsCard } from "../../shared/LoanStatusSections";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: GoldLoanApplication | null;
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

          <StatusCard title="Collateral Details" accent="#26ae90">

          <div className="space-y-3">
            <div className="space-y-3">
              {([ ["Type of Loan", app?.typeOfLoan??"—"], ["Gold Karat", app?.goldCarats??"—"], ...(app?.typeOfLoan==="Jewellery" ? [ ["Gold Weight", `${app?.jewelryGoldWeight??0} g`], ["Stone Weight", `${app?.jewelryStoneWeight??0} g`], ...(app?.jewelryOtherMaterials?.length ? [ ["Other Material Weight", app?.jewelryOtherMaterials.map(m=>`${m.name}: ${m.weight}g`).join(", ")], ] : []), ] : []), ["Market Value", `₹${(app?.collateralPropertyMarketValue??0).toLocaleString("en-IN")}`], ]).map(([l, v]) => (
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
