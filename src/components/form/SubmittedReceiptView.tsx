import { useState } from "react";
import type { SuccessSection } from "./successSections";
import SubmissionSuccess from "./SubmissionSuccess";
import { SubmittedReceiptBanner } from "./SubmitSection";
import CreditScoreGate from "../loan-eligibility/CreditScoreGate";

interface SubmittedReceiptViewProps<TApplication> {
  app: TApplication;
  productName: string;
  buildSections: (app: TApplication) => SuccessSection[];
  onBack: () => void;
}

const SubmittedReceiptView = <TApplication extends { _id: string; createdAt: string; fullName: string; mobile: string; email: string }>({
  app, productName, buildSections, onBack,
}: SubmittedReceiptViewProps<TApplication>) => {
  const [finalized, setFinalized] = useState(false);
  const filedSections = app.fullName ? buildSections(app) : undefined;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {!finalized && <SubmittedReceiptBanner onBack={onBack} />}
      {!finalized && (
        <SubmissionSuccess
          refNo={app._id.slice(-10).toUpperCase()}
          fullId={app._id}
          createdAt={app.createdAt}
          productName={productName}
          applicantName={app.fullName}
          mobile={app.mobile}
          email={app.email}
          sections={filedSections ?? buildSections(app)}
        />
      )}
      <CreditScoreGate
        product={productName}
        sections={filedSections}
        onFinalized={() => setFinalized(true)}
      />
    </div>
  );
};

export default SubmittedReceiptView;
