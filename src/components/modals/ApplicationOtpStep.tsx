import Button from "../ui/Button";
import CodeBoxes from "../ui/CodeBoxes";
import type { ApplicationModalForm } from "./useApplicationModalForm";

/** Step 2 — the mobile OTP verify screen (apply or sign-in). */
const ApplicationOtpStep = ({ form }: { form: ApplicationModalForm }) => {
  const {
    isLoginMode,
    productName,
    mobile,
    otp,
    setOtp,
    otpError,
    setOtpError,
    otpBusy,
    resendNotice,
    setResendNotice,
    resending,
    handleOtpVerify,
    handleOtpResend,
    setStep,
  } = form;

  return (
    <form onSubmit={handleOtpVerify} className="space-y-3.5" noValidate>
      {!isLoginMode && (
        <div className="rounded-xl border border-(--brand-navy-22) bg-(--brand-navy-14) px-4 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Product</p>
          <p className="mt-0.5 text-sm font-bold text-slate-800">{productName}</p>
        </div>
      )}

      <div className="text-center pt-1">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-(--brand-navy-22) bg-(--brand-navy-14)">
          <svg className="h-6 w-6 text-(--brand-navy)" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18h3" />
          </svg>
        </div>
        <p className="text-sm text-slate-500">One-time password sent to</p>
        <p className="text-base font-bold text-slate-900">+91 {mobile}</p>
      </div>

      <div>
        <label htmlFor="apply-otp-0" className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-(--form-dark)">
          Enter OTP <span className="text-red-500 ml-0.5">*</span>
        </label>
        <CodeBoxes
          idPrefix="apply-otp"
          label="Enter OTP"
          value={otp}
          onChange={(v) => { setOtp(v); setOtpError(""); }}
          autoFocus
          disabled={otpBusy}
          invalid={Boolean(otpError)}
        />
        {otpError && <p className="mt-1 text-xs font-medium text-red-500">{otpError}</p>}
        {resendNotice && <p className="mt-1 text-[11px] font-medium text-emerald-600">{resendNotice}</p>}
      </div>

      <div className="flex gap-3 pt-1">
        <Button
          variant="outline"
          className="flex-1 rounded-lg font-semibold"
          disabled={otpBusy}
          onClick={() => { setStep("details"); setOtp(""); setOtpError(""); setResendNotice(""); }}
        >
          ← Back
        </Button>
        <Button type="submit" className="flex-1 rounded-lg font-semibold" loading={otpBusy}>
          {otpBusy
            ? "Verifying…"
            : isLoginMode
              ? "Verify & Sign In →"
              : "Verify & Continue →"}
        </Button>
      </div>

      <p className="text-center text-xs text-slate-400">
        Didn&apos;t get it?{" "}
        <button
          type="button"
          onClick={handleOtpResend}
          disabled={resending || otpBusy}
          className="font-semibold text-(--brand-navy) hover:underline disabled:opacity-40 cursor-pointer"
        >
          {resending ? "Resending…" : "Resend OTP"}
        </button>
      </p>
    </form>
  );
};

export default ApplicationOtpStep;
