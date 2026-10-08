import type { ReactNode } from "react";
import { FORM } from "../../constants/formStyles";
import type { SuccessSection } from "./successSections";
import SubmittedReceiptView from "./SubmittedReceiptView";
import { ConsentAndSubmit, SubmittedFormBanner } from "./SubmitSection";
import FormPageHeader from "./FormPageHeader";

/** Identity fields every submitted application carries. */
export interface SubmittedApplication {
  _id: string;
  createdAt: string;
  fullName: string;
  mobile: string;
  email: string;
}

interface LoanApplicationFormShellProps<TApplication extends SubmittedApplication> {
  productName: string;
  headline: string;
  application: TApplication | null;
  submitted: boolean;
  showFormAfterSubmit: boolean;
  onShowForm: (show: boolean) => void;
  buildSections: (app: TApplication) => SuccessSection[];
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => void;
  agreed: boolean;
  onAgreedChange: (next: boolean) => void;
  apiError: string;
  submitAttempted: boolean;
  invalidCount: number;
  isSubmitting: boolean;
  children: ReactNode;
}

/**
 * Owns everything the 18 loan forms repeat verbatim: the receipt view switch,
 * the form element, the "already submitted" banner, the page header and the
 * consent/submit block. Product fields come in as children.
 */
const LoanApplicationFormShell = <TApplication extends SubmittedApplication>({
  productName,
  headline,
  application,
  submitted,
  showFormAfterSubmit,
  onShowForm,
  buildSections,
  onSubmit,
  agreed,
  onAgreedChange,
  apiError,
  submitAttempted,
  invalidCount,
  isSubmitting,
  children,
}: LoanApplicationFormShellProps<TApplication>) => {
  if (submitted && application && !showFormAfterSubmit) {
    return (
      <SubmittedReceiptView
        app={application}
        productName={productName}
        buildSections={buildSections}
        onBack={() => onShowForm(true)}
      />
    );
  }

  return (
    <form className={`${FORM.maxWidth} mx-auto`} onSubmit={onSubmit} noValidate>
      {submitted && application && (
        <SubmittedFormBanner
          refNo={application._id.slice(-10).toUpperCase()}
          onViewReceipt={() => onShowForm(false)}
        />
      )}
      <FormPageHeader headline={headline} />
      {children}
      <ConsentAndSubmit
        agreed={agreed}
        onAgreedChange={onAgreedChange}
        apiError={apiError}
        submitAttempted={submitAttempted}
        invalidCount={invalidCount}
        isSubmitting={isSubmitting}
        submitted={submitted}
      />
    </form>
  );
};

export default LoanApplicationFormShell;
