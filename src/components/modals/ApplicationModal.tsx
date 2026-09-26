import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, verifyOTP } from "../../api/auth";
import { useAuth } from "../../context/authContext";
import { getApiErrorMessage } from "../../utils/apiError";

// ── Loan type → dashboard route ───────────────────────────────────────────────

const dashboardRoutes: Record<string, string> = {
  "Personal Loan":            "/dashboard/personalloan",
  "Business Loan":            "/dashboard/businessloan",
  "Home Loan":                "/dashboard/homeloan",
  "Car Loan":                 "/dashboard/carloan",
  "Education Loan":           "/dashboard/educationloan",
  "Loan Against Property":    "/dashboard/loanagainstproperty",
  "Balance Transfer":         "/dashboard/balancetransfer",
  "Credit Card":              "/dashboard/creditcard",
  "Premium Credit Cards":     "/dashboard/creditcard",
  "Project Loan":             "/dashboard/projectloan",
  "Commercial Purchase":      "/dashboard/commercialpurchase",
  "Commercial Purchase Loan": "/dashboard/commercialpurchase",
  "Working Capital":          "/dashboard/workingcapital",
  "Working Capital Loan":     "/dashboard/workingcapital",
  "Lease Rental Discounting": "/dashboard/leaserental",
  "Film Funding":             "/dashboard/filmfunding",
  "OD CC Limit":               "/dashboard/odcclimit",
  "Loan Against Share":        "/dashboard/loanagainstshare",
  "NPA":                       "/dashboard/npa",
  "Gold Loan":                 "/dashboard/goldloan",
  "FDI":                       "/dashboard/fdi",
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

type AuthMode = "signin" | "signup";
type Step     = "details" | "otp";

// ── Component ─────────────────────────────────────────────────────────────────

const ApplicationModal = ({
  isOpen,
  onClose,
  productName = "Personal Loan",
}: ApplicationModalProps) => {
  const { login, isLoggedIn } = useAuth();
  const navigate  = useNavigate();

  // Already logged in — skip signup/OTP entirely, jump straight to the loan detail page.
  // `navigate` and `onClose` are stable in practice; they're listed so the
  // linter can verify, and re-running this effect is harmless (same redirect).
  useEffect(() => {
    if (isOpen && isLoggedIn) {
      navigate(dashboardRoutes[productName] ?? "/dashboard/personalloan");
      onClose();
    }
  }, [isOpen, isLoggedIn, productName, navigate, onClose]);

  // ── Mode & Step ───────────────────────────────────────────────────────────
  const [mode, setMode] = useState<AuthMode>("signup");
  const [step, setStep] = useState<Step>("details");

  // ── Sign Up fields ────────────────────────────────────────────────────────
  const [signup, setSignup] = useState({ name: "", phone: "", email: "" });
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  // ── Sign In fields ────────────────────────────────────────────────────────
  const [signinPhone, setSigninPhone] = useState("");
  const [signinPhoneError, setSigninPhoneError] = useState("");

  // ── OTP ───────────────────────────────────────────────────────────────────
  const [otp, setOtp]           = useState("");
  const [otpError, setOtpError] = useState("");

  // ── Shared loading / error ────────────────────────────────────────────────
  const [isSending,   setIsSending]   = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [apiError,    setApiError]    = useState("");
  const [resendMsg,   setResendMsg]   = useState("");

  if (!isOpen || isLoggedIn) return null;

  const isBusy   = isSending || isVerifying;
  const mobile   = mode === "signup" ? signup.phone : signinPhone;

  // ── Reset ─────────────────────────────────────────────────────────────────

  const resetAll = () => {
    setMode("signup");
    setStep("details");
    setSignup({ name: "", phone: "", email: "" });
    setSignupErrors({});
    setSigninPhone("");
    setSigninPhoneError("");
    setOtp("");
    setOtpError("");
    setApiError("");
    setResendMsg("");
  };

  const handleClose = () => {
    if (isBusy) return;
    resetAll();
    onClose();
  };

  const switchMode = (m: AuthMode) => {
    setMode(m);
    setStep("details");
    setApiError("");
    setOtp("");
    setOtpError("");
    setResendMsg("");
  };

  // ── Validate sign-up fields ───────────────────────────────────────────────

  const validateSignup = () => {
    const e: Record<string, string> = {};
    if (!signup.name.trim())  e.name  = "Name is required";
    if (!signup.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(signup.phone)) e.phone = "Enter valid 10-digit number";
    if (!signup.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signup.email)) e.email = "Enter valid email";
    setSignupErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateSignin = () => {
    if (!signinPhone.trim()) { setSigninPhoneError("Phone is required"); return false; }
    if (!/^\d{10}$/.test(signinPhone)) { setSigninPhoneError("Enter valid 10-digit number"); return false; }
    setSigninPhoneError("");
    return true;
  };

  // ── Step 1 — Send OTP ─────────────────────────────────────────────────────

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && !validateSignup()) return;
    if (mode === "signin" && !validateSignin()) return;

    setIsSending(true);
    setApiError("");
    try {
      if (mode === "signup") {
        await registerUser({ name: signup.name, mobile: signup.phone, email: signup.email });
      } else {
        await loginUser({ mobile: signinPhone });
      }
      setStep("otp");
    } catch (err) {
      setApiError(getApiErrorMessage(err, "Failed to send OTP. Please try again."));
    } finally {
      setIsSending(false);
    }
  };

  // ── Step 2 — Verify OTP → login → navigate ────────────────────────────────

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim())              { setOtpError("Please enter the OTP"); return; }
    if (!/^\d{4,8}$/.test(otp))  { setOtpError("Enter a valid OTP"); return; }

    setIsVerifying(true);
    setOtpError("");
    try {
      const res = await verifyOTP({ mobile, otp: otp.trim() });
      login(res.token, res.user);
      resetAll();
      onClose();
      navigate(dashboardRoutes[productName] ?? "/dashboard/personalloan");
    } catch (err) {
      setOtpError(getApiErrorMessage(err, "Invalid OTP. Please try again."));
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────

  const handleResend = async () => {
    setIsResending(true);
    setOtpError("");
    setResendMsg("");
    try {
      if (mode === "signup") {
        await registerUser({ name: signup.name, mobile: signup.phone, email: signup.email });
      } else {
        await loginUser({ mobile: signinPhone });
      }
      setResendMsg("OTP resent successfully!");
      setTimeout(() => setResendMsg(""), 3000);
    } catch (err) {
      setOtpError(getApiErrorMessage(err, "Failed to resend OTP."));
    } finally {
      setIsResending(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* ── Header ── */}
          <div
            className="px-6 py-5 relative"
            style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" }}
          >
            <button
              onClick={handleClose}
              disabled={isBusy}
              aria-label="Close"
              className="absolute top-4 right-4 text-white/70 hover:text-white disabled:opacity-40 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Product name */}
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
              {productName}
            </p>
            <h2 className="text-xl font-bold text-white">
              {step === "details"
                ? mode === "signup" ? "Create your account" : "Welcome back"
                : "Verify your number"}
            </h2>
            <p className="text-sm text-blue-100 mt-0.5">
              {step === "details"
                ? mode === "signup"
                  ? "Sign up to apply for this loan"
                  : "Sign in to continue your application"
                : `Enter the OTP sent to +91 ${mobile}`}
            </p>

            {/* Step pills */}
            <div className="flex items-center gap-2 mt-4">
              {[
                mode === "signup" ? "Details" : "Mobile",
                "Verify OTP",
              ].map((label, i) => {
                const active = i === 0 ? step === "details" : step === "otp";
                const done   = i === 0 && step === "otp";
                return (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? "bg-green-400 text-white" : active ? "bg-white text-blue-600" : "bg-white/20 text-white/50"}`}>
                      {done ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs ${active ? "text-white font-semibold" : "text-white/50"}`}>{label}</span>
                    {i === 0 && <div className={`h-px w-5 transition-all ${step === "otp" ? "bg-white/60" : "bg-white/20"}`} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Body ── */}
          <div className="px-6 py-6">

            {/* Sign In / Sign Up tab switcher — only on details step */}
            {step === "details" && (
              <div className="flex rounded-xl border border-slate-200 p-1 mb-6 bg-slate-50">
                {(["signup", "signin"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                      mode === m
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {m === "signup" ? "✨ Sign Up" : "🔑 Sign In"}
                  </button>
                ))}
              </div>
            )}

            {/* API-level error */}
            {apiError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 flex gap-2 items-start">
                <span className="shrink-0">⚠️</span>
                <span>{apiError}</span>
              </div>
            )}

            {/* ── SIGN UP — details step ── */}
            {step === "details" && mode === "signup" && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <Field
                  label="Full Name" type="text" name="name"
                  value={signup.name}
                  onChange={(v) => { setSignup((p) => ({ ...p, name: v })); setSignupErrors((p) => ({ ...p, name: "" })); }}
                  placeholder="As per your ID card"
                  error={signupErrors.name} disabled={isSending}
                />
                <Field
                  label="Mobile Number" type="tel" name="phone"
                  value={signup.phone}
                  onChange={(v) => { setSignup((p) => ({ ...p, phone: v.replace(/\D/g, "") })); setSignupErrors((p) => ({ ...p, phone: "" })); }}
                  placeholder="10-digit mobile number"
                  maxLength={10} error={signupErrors.phone} disabled={isSending}
                />
                <Field
                  label="Email Address" type="email" name="email"
                  value={signup.email}
                  onChange={(v) => { setSignup((p) => ({ ...p, email: v })); setSignupErrors((p) => ({ ...p, email: "" })); }}
                  placeholder="your@email.com"
                  error={signupErrors.email} disabled={isSending}
                />

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={handleClose} disabled={isSending}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 disabled:opacity-50 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSending}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-70 flex items-center justify-center gap-2 transition"
                    style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" }}>
                    {isSending ? <><Spinner /> Sending OTP...</> : "Send OTP →"}
                  </button>
                </div>

                <p className="text-xs text-slate-400 text-center">
                  Already have an account?{" "}
                  <button type="button" onClick={() => switchMode("signin")} className="text-blue-600 font-semibold hover:underline">
                    Sign In
                  </button>
                </p>
              </form>
            )}

            {/* ── SIGN IN — details step ── */}
            {step === "details" && mode === "signin" && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="text-center mb-2">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 mb-3">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500">Enter your registered mobile number</p>
                </div>

                <Field
                  label="Mobile Number" type="tel" name="signinPhone"
                  value={signinPhone}
                  onChange={(v) => { setSigninPhone(v.replace(/\D/g, "")); setSigninPhoneError(""); }}
                  placeholder="10-digit registered mobile"
                  maxLength={10} error={signinPhoneError} disabled={isSending}
                />

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={handleClose} disabled={isSending}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 disabled:opacity-50 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSending}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-70 flex items-center justify-center gap-2 transition"
                    style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" }}>
                    {isSending ? <><Spinner /> Sending OTP...</> : "Send OTP →"}
                  </button>
                </div>

                <p className="text-xs text-slate-400 text-center">
                  New user?{" "}
                  <button type="button" onClick={() => switchMode("signup")} className="text-blue-600 font-semibold hover:underline">
                    Create account
                  </button>
                </p>
              </form>
            )}

            {/* ── OTP step (same for both modes) ── */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 mb-3">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18h3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500">One-time password sent to</p>
                  <p className="text-base font-bold text-slate-900">+91 {mobile}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Enter OTP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
                    placeholder="• • • • • •"
                    disabled={isVerifying}
                    maxLength={8}
                    autoFocus
                    className={`w-full px-4 py-3 border rounded-lg text-xl tracking-[0.4em] text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-slate-100 ${otpError ? "border-red-400" : "border-slate-300"}`}
                  />
                  {otpError  && <p className="text-xs text-red-500 mt-1 text-center">{otpError}</p>}
                  {resendMsg && <p className="text-xs text-green-600 mt-1 text-center font-medium">{resendMsg}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || otp.length < 4}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-70 flex items-center justify-center gap-2 transition"
                  style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" }}
                >
                  {isVerifying ? <><Spinner /> Verifying...</> : "✓ Verify & Continue"}
                </button>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => { setStep("details"); setOtp(""); setOtpError(""); setResendMsg(""); setApiError(""); }}
                    disabled={isVerifying}
                    className="text-sm text-slate-500 hover:text-slate-700 disabled:opacity-40 transition"
                  >
                    ← Change details
                  </button>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending || isVerifying}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-40 flex items-center gap-1 transition"
                  >
                    {isResending ? <><Spinner small /> Resending...</> : "Resend OTP"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// ── Field ─────────────────────────────────────────────────────────────────────

const Field = ({
  label, type, name, value, onChange, placeholder, error, disabled, maxLength,
}: {
  label: string; type: string; name: string; value: string;
  onChange: (v: string) => void; placeholder: string;
  error?: string; disabled?: boolean; maxLength?: number;
}) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
      {label} <span className="text-red-500">*</span>
    </label>
    <input
      type={type} name={name} value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} disabled={disabled} maxLength={maxLength}
      className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-slate-100 disabled:cursor-not-allowed ${error ? "border-red-400" : "border-slate-300"}`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// ── Spinner ───────────────────────────────────────────────────────────────────

const Spinner = ({ small }: { small?: boolean }) => (
  <svg className={`${small ? "w-3 h-3" : "w-4 h-4"} animate-spin shrink-0`} fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export default ApplicationModal;
