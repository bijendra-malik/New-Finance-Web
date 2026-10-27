import type { ReactNode } from "react";
import { FORM } from "../../constants/formStyles";
import { MORE_THAN_TENURE_OPTION } from "../../constants/masters";
import type { SuccessSection } from "./successSections";
import { ConsentAndSubmit } from "./SubmitSection";
import FormPageHeader from "./FormPageHeader";
import ApplicationReviewModal from "./ApplicationReviewModal";
import CreditScoreGate from "../loan-eligibility/CreditScoreGate";

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
  values: object;
  buildSections: (app: TApplication) => SuccessSection[];
  reviewOpen: boolean;
  onConfirmReview: () => void;
  onCancelReview: () => void;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => void;
  agreed: boolean;
  onAgreedChange: (next: boolean) => void;
  apiError: string;
  submitAttempted: boolean;
  invalidCount: number;
  isSubmitting: boolean;
  children: ReactNode;
}

const EDIT_TARGETS: Readonly<Record<string, readonly string[]>> = {
  "Loan Requirement": ["loanAmount"],
  "Employment & Income": ["employmentType"],
  "Existing Loan Obligations": ["existingEMI"],
  "Loan Amount": ["loanAmount"],
  "Tenure": ["loanTenureYears"],
  "Residence": ["state"],
  "Pincode": ["pincode"],
  "Residence Status": ["residenceStatus"],
  "Employment Type": ["employmentType"],
  "Company Name": ["companyName", "businessName"],
  "Company Type": ["companyType", "businessType"],
  "Monthly Net Salary": ["monthlyNetSalary"],
  "Salary Received As": ["salaryReceivedAs"],
  "Salary Bank": ["salaryBankName"],
  "Existing Total EMI": ["existingEMI"],
  "Existing Loan Amount": ["existingLoanAmount"],
  "Existing Banks": ["existingBanks"],
  "Existing Loan Types": ["existingLoanTypes"],
  "Property Type": ["buyingPropertyType", "collateralPropertyType"],
  "Vehicle Type": ["vehicleType"],
  "Manufacturer": ["manufacturer"],
  "Model": ["model"],
};

const asNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const toPreviewRecord = (values: Record<string, unknown>): Record<string, unknown> => {
  const selectedYears = Number(values.loanTenureYears);
  const years = selectedYears === MORE_THAN_TENURE_OPTION
    ? Number(values.loanTenureYearsCustom)
    : selectedYears;
  const loanTenure = Number.isFinite(years) && years > 0 ? years : undefined;
  const transactionBanks = Array.isArray(values.transactionBanks) ? values.transactionBanks : [];
  const multipleBanks = values.transactionBankName === "Multiple Transaction Banks";

  return {
    ...values,
    loanTenure,
    existingEMI: asNumber(values.existingEMI) ?? 0,
    existingLoanAmount: asNumber(values.existingLoanAmount) ?? 0,
    transactionBankName: multipleBanks && transactionBanks.length > 0
      ? transactionBanks.join(", ")
      : values.transactionBankName,
  };
};

const LoanApplicationFormShell = <TApplication extends SubmittedApplication>({
  productName,
  headline,
  application,
  submitted,
  values,
  buildSections,
  reviewOpen,
  onConfirmReview,
  onCancelReview,
  onSubmit,
  agreed,
  onAgreedChange,
  apiError,
  submitAttempted,
  invalidCount,
  isSubmitting,
  children,
}: LoanApplicationFormShellProps<TApplication>) => {
  if (submitted && application) {
    return (
      <div className={`${FORM.maxWidth} mx-auto space-y-5`}>
        <div
          className="rounded-(--form-card-radius) px-5 py-4"
          style={{ background: "var(--brand-teal-14)", border: "1px solid var(--brand-teal-33)" }}
          role="status"
        >
          <p className="text-sm font-bold text-(--brand-dark)">✓ Application details have been saved</p>
          <p className="mt-0.5 text-xs text-(--brand-gray)">
            Your application has been saved. Complete the credit-score step below — your details
            can no longer be edited.
          </p>
        </div>
        <CreditScoreGate product={productName} />
      </div>
    );
  }

  const preview = toPreviewRecord(values as Record<string, unknown>);
  const previewSections = buildSections(preview as unknown as TApplication);
  const loanAmount = asNumber(preview.loanAmount);
  const tenureYears = asNumber(preview.loanTenure);
  const applicantName = typeof preview.fullName === "string" ? preview.fullName : undefined;

  const handleEditSection = (section: SuccessSection) => {
    const candidates = [section.title, ...section.rows.map((row) => row.label)]
      .flatMap((label) => EDIT_TARGETS[label] ?? []);
    onCancelReview();
    window.setTimeout(() => {
      const target = candidates
        .map((id) => document.getElementById(id))
        .find((element): element is HTMLElement => Boolean(element));
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      target?.querySelector<HTMLElement>("input, select, textarea, button")?.focus({ preventScroll: true });
    }, 80);
  };

  return (
    <>
      <form className={`${FORM.maxWidth} mx-auto`} onSubmit={onSubmit} noValidate>
        <FormPageHeader headline={headline} />
        {children}
        <ConsentAndSubmit
          agreed={agreed}
          onAgreedChange={onAgreedChange}
          apiError={apiError}
          submitAttempted={submitAttempted}
          invalidCount={invalidCount}
          isSubmitting={isSubmitting}
          submitLabel="Proceed"
        />
      </form>

      <ApplicationReviewModal
        open={reviewOpen}
        productName={productName}
        sections={previewSections}
        applicantName={applicantName}
        loanAmount={loanAmount}
        tenureYears={tenureYears}
        busy={isSubmitting}
        error={apiError}
        onCancel={onCancelReview}
        onEditSection={handleEditSection}
        onConfirm={onConfirmReview}
      />
    </>
  );
};

export default LoanApplicationFormShell;
