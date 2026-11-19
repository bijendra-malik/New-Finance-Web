import { createPortal } from "react-dom";
import Button from "../ui/Button";
import CaptchaField from "../ui/CaptchaField";
import ApplicationDetailsStep from "./ApplicationDetailsStep";
import ApplicationOtpStep from "./ApplicationOtpStep";
import { useApplicationModalForm } from "./useApplicationModalForm";
import type { ApplicationModalProps } from "./applicationModalHelpers";

// ── Component ──────────────────────────────────────────────────────────────────

const ApplicationModal = (props: ApplicationModalProps) => {
  const form = useApplicationModalForm(props);
  const {
    navigate,
    productName,
    loanKey,
    mode,
    isLoginMode,
    step,
    apiError,
    blockedNotice,
    setBlockedNotice,
    alreadyRegistered,
    mobile,
    captcha,
    captchaOpen,
    setCaptchaOpen,
    captchaBusy,
    confirmSecurityCheck,
    handleClose,
    switchMode,
  } = form;

  if (!props.isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop — above the header (z-55) */}
      <div
        className="fixed inset-0 bg-black/70 z-90 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal — single-card eligibility gateway */}
      <div className="fixed inset-0 z-110 flex items-center justify-center p-3 sm:p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="apply-modal-title"
          className="w-full max-w-xl min-w-0 flex flex-col shadow-2xl rounded-2xl overflow-hidden bg-white max-h-[92vh]"
        >

          {/* ── Header band — navy, single column: the Sign up / Sign in panel ── */}
          <div className="relative shrink-0 overflow-hidden bg-linear-to-br from-(--brand-navy) via-(--brand-dark) to-(--brand-navy-deep) text-white">
            <div className="h-1 w-full bg-(--brand-teal)" />
            <div className="px-5 py-3.5 sm:px-6 sm:py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {/* Sign up / Sign in — the panel's mode switch. */}
                  <div role="tablist" aria-label="Sign up or sign in"
                    className="inline-flex rounded-full bg-white/10 p-1">
                    {([["signup", "Register New Account"], ["signin", "LogIn"]] as const).map(([m, label]) => (
                      <button
                        key={m}
                        type="button"
                        role="tab"
                        aria-selected={mode === m}
                        onClick={() => switchMode(m)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/70 ${
                          mode === m ? "bg-(--brand-teal) text-white" : "text-white/70 hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <h2 id="apply-modal-title" className="mt-1.5 text-lg sm:text-xl font-extrabold tracking-tight">
                    {mode === "signin" ? "Welcome back" : loanKey ? productName : "Create your account"}
                  </h2>
                  <p className="mt-0.5 text-xs sm:text-sm text-white/70">
                    {mode === "signin"
                      ? `Login with the mobile number registered with us. To create a new account, switch to Register New Account above.`
                      : "Add your contact and identity details to start your application."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close"
                  className="shrink-0 rounded-lg border border-white/25 bg-white/10 p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/70 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Step rail */}
              <ol className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">

                {[
                  { label: isLoginMode ? "Your number" : "Your details", state: step === "otp" ? "done" : "active" },
                  { label: "Verify mobile", state: step === "otp" ? "active" : "todo" },
                  { label: isLoginMode ? "Application Form" : "Application form", state: "todo" },
                ].map((s, i, arr) => (
                  <li key={s.label} className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1
                      text-[11px] font-bold uppercase tracking-wider transition-all
                      ${s.state === "active"
                        ? "bg-(--brand-teal) text-white shadow-(--brand-teal-44)"
                        : s.state === "done"
                          ? "bg-white/20 text-white border border-white/25"
                          : "bg-white/10 text-white/55 border border-white/15"}`}>
                      {s.state !== "todo" && (
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {i + 1}. {s.label}
                    </span>
                    {i < arr.length - 1 && (
                      <span aria-hidden className="text-white/30 text-xs">→</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex-1 w-full min-w-0 min-h-0 flex flex-col bg-white overflow-hidden">

            {/* Body (scrolls when taller than the card) */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-3.5 md:px-6 md:py-4">

              {/* API-level error */}
              {apiError && (
                <div className="mb-4 bg-(--form-error-bg) border border-red-200 rounded-lg px-4 py-3
                  text-sm text-red-600 flex gap-2.5 items-start">
                  <span className="shrink-0 text-base">⚠️</span>
                  <span>{apiError}</span>
                </div>
              )}

              {/* An earlier application for this product still blocks a new one. */}
              {blockedNotice && (
                <div
                  role="status"
                  className={`mb-4 rounded-xl border px-4 py-3 ${
                    blockedNotice.kind === "rejected"
                      ? "border-amber-200 bg-amber-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p
                    className={`text-xs font-bold uppercase tracking-wider ${
                      blockedNotice.kind === "rejected" ? "text-amber-700" : "text-slate-500"
                    }`}
                  >                      {blockedNotice.title}
                    </p>
                  <p
                    className={`mt-1 text-sm leading-6 ${
                      blockedNotice.kind === "rejected" ? "text-amber-900" : "text-slate-700"
                    }`}
                  >
                    {blockedNotice.body}
                  </p>
                  {blockedNotice.detail && (
                    <p
                      className={`mt-1.5 text-xs leading-5 ${
                        blockedNotice.kind === "rejected" ? "text-amber-800" : "text-slate-500"
                      }`}
                    >
                      {blockedNotice.detail}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className="rounded-lg font-semibold"
                      onClick={() => {
                        setBlockedNotice(null);
                        if (step === "otp") form.setStep("details");
                      }}
                    >
                      Got it
                    </Button>
                    <Button
                      variant="ghost"
                      className="rounded-lg font-semibold"
                      onClick={() => {
                        setBlockedNotice(null);
                        handleClose();
                        navigate("/applications");
                      }}
                    >
                      View my applications
                    </Button>
                    {blockedNotice.kind === "rejected" && (
                      <Button
                        variant="ghost"
                        className="rounded-lg font-semibold"
                        onClick={() => {
                          setBlockedNotice(null);
                          handleClose();
                          navigate("/how-to-improve-credit-score");
                        }}
                      >
                        How to improve your credit score
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Feature 1 — the number is already registered, so the panel has
                  switched itself to LogIn. Informational only: the shift needs no
                  click, and the tab pills above still allow going back. */}
              {alreadyRegistered && (
                <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Already in our system</p>
                  <p className="mt-1 text-sm text-emerald-800">
                    This mobile number is already registered with us, so we have moved you to
                    sign in. The OTP for {productName} has been sent to this number — enter it
                    below to continue.
                  </p>
                </div>
              )}

              {/* Capture applicant identity before opening the loan form. */}
              {step === "details" && <ApplicationDetailsStep form={form} />}

              {/* Step 2 — the OTP from POST /auth/{loanKey} (apply) or
                  POST /auth/login/request-otp (sign-in). A refused application
                  is told when the API reopens it, so the OTP form itself is
                  withheld while that notice stands. */}
              {step === "otp" && blockedNotice?.kind !== "rejected" && <ApplicationOtpStep form={form} />}

            </div>
          </div>
        </div>
      </div>

      {/* Security check — asked after the details, before the OTP is sent. */}
      {captchaOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-sm"
            style={{ zIndex: 115 }}
            onClick={() => { setCaptchaOpen(false); captcha.clearError(); captcha.clearVerification(); }}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 120 }}>
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="apply-security-check-title"
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="px-5 pt-5">
                <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-(--brand-navy)">
                  Before you continue
                </p>
                <h3 id="apply-security-check-title" className="mt-1 text-lg font-extrabold text-slate-900">
                  Security Check
                </h3>
                <p className="mt-1 text-[12.5px] leading-5 text-slate-600">
                  Your details are filled in. Answer the question below and we will send the OTP to
                  +91 {mobile.replace(/\D/g, "").slice(-10)}.
                </p>
              </div>

              <div className="mt-4 px-5">
                <CaptchaField captcha={captcha} idPrefix="apply-captcha" />
              </div>

              <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => { setCaptchaOpen(false); captcha.clearError(); captcha.clearVerification(); }}
                  disabled={captchaBusy}
                  className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33) disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void confirmSecurityCheck()}
                  disabled={captchaBusy || captcha.loading}
                  className="cursor-pointer rounded-lg px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33) disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, var(--brand-teal), var(--brand-navy))" }}
                >
                  {captchaBusy ? "Checking…" : "Continue"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>,
    document.body
  );
};

export default ApplicationModal;
