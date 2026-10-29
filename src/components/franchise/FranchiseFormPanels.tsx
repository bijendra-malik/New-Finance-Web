import { Link } from "react-router-dom";
import Button from "../ui/Button";
import OtpEntryPanel from "../status/OtpEntryPanel";
import { FRANCHISE_EMAIL } from "./franchiseData";
import type { FranchisePlan } from "./franchiseData";
import type { FranchiseFormValues } from "./franchiseFormConfig";

/**
 * The form's three terminal states — shown instead of the field grid once the
 * application has been submitted, is waiting on an OTP, or has handed off to email.
 * They live apart from the form so the form file can stay about filling fields in.
 */

interface SubmittedPanelProps {
  values: FranchiseFormValues;
  selectedPlan?: FranchisePlan;
  franchisorLoginEnabled: boolean;
  /** The API-result modal, rendered alongside the confirmation. */
  popup: React.ReactNode;
}

/** Franchisee application received — credentials follow once the team approves. */
export const SubmittedPanel = ({
  values,
  selectedPlan,
  franchisorLoginEnabled,
  popup,
}: SubmittedPanelProps) => (
  <>
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-(--brand-teal)">
        <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-bold text-slate-800">Application submitted</h3>
      <p className="mx-auto text-sm leading-relaxed text-slate-600">
        Your mobile number is verified and your franchise application has been received. Our team
        will review your details — once approved, sign in with your{" "}
        <strong>franchisee ID and the PAN number from this application</strong>.
      </p>

      <dl className="mx-auto mt-6 space-y-1.5 rounded-xl border border-emerald-200 bg-white p-4 text-left text-[12.5px]">
        {[
          ["Applicant", values.fullName],
          ["Business", values.businessName],
          ["PAN", values.pan],
          ["Location", `${values.city}, ${values.state} — ${values.pincode}`],
          ["Plan", selectedPlan ? `${selectedPlan.duration} — ${selectedPlan.fee}` : "—"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-slate-400">{k}</dt>
            <dd className="text-right font-semibold text-slate-700">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {franchisorLoginEnabled ? (
        <Link
          to="/franchise-login"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-white transition-all duration-200 hover:shadow-lg"
          style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))" }}
        >
          Go to Franchisee Login →
        </Link>
        ) : (
        <span
          aria-disabled="true"
          title="Sign in to access the franchisee portal"
          className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-white/60"
          style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))", opacity: 0.6 }}
        >
          Go to Franchisee Login →
        </span>
        )}
      </div>
    </div>
    {popup}
  </>
);

interface EnquiryReadyPanelProps {
  values: FranchiseFormValues;
  mailtoHref: string;
  onSubmitAnother: () => void;
}

/** Non-franchisee enquiry: the email draft is open, the applicant sends it themselves. */
export const EnquiryReadyPanel = ({ values, mailtoHref, onSubmitAnother }: EnquiryReadyPanelProps) => (
  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center">
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-(--brand-teal)">
      <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <h3 className="mb-2 text-xl font-bold text-slate-800">Details Ready to Send</h3>
    <p className="mx-auto text-sm leading-relaxed text-slate-600">
      Your email app has been opened with all the details filled in and addressed to{" "}
      <a href={`mailto:${FRANCHISE_EMAIL}`} className="font-semibold text-(--brand-navy) hover:underline">
        {FRANCHISE_EMAIL}
      </a>
      . Send that email and our franchise team will review your details and get in touch.
    </p>

    <dl className="mx-auto mt-6 space-y-1.5 rounded-xl border border-emerald-200 bg-white p-4 text-left text-[12.5px]">
      {[
        ["Name", values.fullName],
        ["PAN", values.pan],
        ["Mobile", values.mobile],
        ["Email", values.email],
        ["Location", `${values.city}, ${values.state}`],
      ].map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4">
          <dt className="text-slate-400">{k}</dt>
          <dd className="text-right font-semibold text-slate-700">{v}</dd>
        </div>
      ))}
    </dl>

    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      <a
        href={mailtoHref}
        className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
        style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))" }}
      >
        Open the email again
      </a>
      <Button variant="outline" size="md" onClick={onSubmitAnother}>
        Submit another enquiry
      </Button>
    </div>
  </div>
);

interface OtpStagePanelProps {
  maskedMobile?: string;
  otp: string;
  onOtpChange: (value: string) => void;
  otpError?: string;
  apiError?: string;
  notice?: string;
  busy: boolean;
  resending: boolean;
  onVerify: (event: React.FormEvent<HTMLFormElement>) => void;
  onResend: () => void;
  onChangeDetails: () => void;
}

/** Shown after the entry call accepts the application but the mobile is not confirmed yet. */
export const OtpStagePanel = ({
  maskedMobile,
  otp,
  onOtpChange,
  otpError,
  apiError,
  notice,
  busy,
  resending,
  onVerify,
  onResend,
  onChangeDetails,
}: OtpStagePanelProps) => (
  <div className="rounded-2xl border border-slate-200 bg-white px-5 py-7 sm:px-7">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--brand-teal)">Verify your mobile</p>
    <h3 className="mt-2 text-xl font-extrabold text-(--brand-navy)">One step left — confirm your OTP</h3>
    <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
      Your application has been received. Enter the OTP sent to your registered mobile number to verify your franchisee access.
    </p>
    <div className="mt-5">
      <OtpEntryPanel
        idPrefix="ff-apply"
        maskedMobile={maskedMobile}
        otp={otp}
        onOtpChange={onOtpChange}
        otpError={otpError}
        apiError={apiError}
        notice={notice}
        busy={busy}
        resending={resending}
        onVerify={onVerify}
        onResend={onResend}
        onChangeDetails={onChangeDetails}
        verifyLabel="Verify application"
      />
    </div>
  </div>
);