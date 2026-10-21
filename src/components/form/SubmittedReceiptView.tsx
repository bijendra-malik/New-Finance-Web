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
}: SubmittedReceiptViewProps<TApplication>) => (
  <div className="max-w-3xl mx-auto space-y-5">
    <SubmittedReceiptBanner onBack={onBack} />
    <SubmissionSuccess
      refNo={app._id.slice(-10).toUpperCase()}
      fullId={app._id}
      createdAt={app.createdAt}
      productName={productName}
      applicantName={app.fullName}
      mobile={app.mobile}
      email={app.email}
      sections={buildSections(app)}
    />
    {/* The customer is verified and signed in at this point, so the score check
        can run as the next step after a submitted application. */}
    <CreditScoreGate product={productName} />
  </div>
);

export default SubmittedReceiptView;
