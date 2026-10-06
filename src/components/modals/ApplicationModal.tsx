import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import type { RegisterPayload } from "../../api/auth";
import { registerUser, loginUser, verifyOTP } from "../../api/auth";
import { useAuth } from "../../context/authContext";
import { getApiErrorMessage } from "../../utils/apiError";
import { mergeAccountDetails, readStoredProfile } from "../../utils/accountProfile";
import { PAN_REGEX, isAtLeastAge, latestDobForAge } from "../../utils/validation";
import { applyRegister } from "../../api/auth";

// ── Loan type → dashboard route ───────────────────────────────────────────────

const dashboardRoutes: Record<string, string> = {
  "Personal Loan":            "/dashboard/personalloan",
  "Business Loan":            "/dashboard/businessloan",
  "Home Loan":                "/dashboard/homeloan",
  "Vehicle Loan":             "/dashboard/carloan",
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

// ── Inline icons (brand panel) ─────────────────────────────────────────────────

const IconAmount = () => (
  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconDocs = () => (
  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const IconFast = () => (
  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ── Inline Spinner ─────────────────────────────────────────────────────────────

const Spinner = ({ small }: { small?: boolean }) => (
  <svg className={`${small ? "w-3.5 h-3.5" : "w-4 h-4"} animate-spin shrink-0`} fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

// ── Reusable Field ─────────────────────────────────────────────────────────────

const Field = ({
  label, type, name, value, onChange, placeholder, error, disabled,
  maxLength, max, extraCls = "",
}: {
  label: string; type: string; name: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
  error?: string; disabled?: boolean; maxLength?: number; max?: string; extraCls?: string;
}) => (
  <div>
    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-(--form-dark)">
      {label} <span className="text-red-500 ml-0.5">*</span>
    </label>
    <input
      type={type} name={name} value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} disabled={disabled} maxLength={maxLength} max={max}
      className={`w-full px-3.5 py-2.5 border border-(--form-field-border) rounded-lg text-sm transition-all
        focus:outline-none focus:ring-2 focus:ring-(--brand-teal-20) focus:border-(--brand-teal)
        disabled:bg-(--form-field-bg-disabled) disabled:cursor-not-allowed ${extraCls}
        ${error ? "border-red-400" : ""}`}
      style={error ? { borderColor: "#ef4444" } : undefined}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// ── Component ──────────────────────────────────────────────────────────────────

const ApplicationModal = ({
  isOpen,
  onClose,
  productName = "Personal Loan",
}: ApplicationModalProps) => {
  const { login, isLoggedIn } = useAuth();
  const navigate  = useNavigate();
  const account = useMemo(() => readStoredProfile(), []);
  const lockedFromAccount = useMemo(
    () => ({
      name: account?.name?.trim() ?? "",
      mobile: (account?.phone ?? "").replace(/\D/g, "").slice(-10),
      email: account?.email?.trim() ?? "",
    }),
    [account]
  );
  const hasLockedContact =
    !!lockedFromAccount.name || !!lockedFromAccount.mobile || !!lockedFromAccount.email;

  // Already logged in — skip signup/OTP entirely, jump straight to the loan detail page.
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
  const [signup, setSignup] = useState(() => {
    const stored = readStoredProfile();
    return {
      name: stored?.name ?? "",
      phone: (stored?.phone ?? "").replace(/\D/g, "").slice(-10),
      email: stored?.email ?? "",
      dob: stored?.dob ?? "",
      pan: (stored?.pan ?? "").toUpperCase(),
    };
  });
  const registerPayload = useMemo<RegisterPayload>(() => ({
    name: signup.name,
    mobile: signup.phone,
    email: signup.email,
    role: "Customer",
    continent: "Asia",
    country: "India",
  }), [signup.name, signup.phone, signup.email]);
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

  // Freeze the page behind the popup, so only the popup's own areas scroll.
  // (Renders nothing once logged in — don't hold the lock then.)
  useEffect(() => {
    if (!isOpen || isLoggedIn) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen, isLoggedIn]);

  if (!isOpen || isLoggedIn) return null;

  const isBusy   = isSending || isVerifying;
  const mobile   = mode === "signup" ? signup.phone : signinPhone;

  // ── Reset ─────────────────────────────────────────────────────────────────

  const resetAll = () => {
    setMode("signup");
    setStep("details");
    setSignup({
      name: account?.name ?? "",
      phone: (account?.phone ?? "").replace(/\D/g, "").slice(-10),
      email: account?.email ?? "",
      dob: account?.dob ?? "",
      pan: (account?.pan ?? "").toUpperCase(),
    });
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
    if (!lockedFromAccount.name) {
      if (!signup.name.trim()) e.name = "Name is required";
    }
    if (!lockedFromAccount.mobile) {
      if (!signup.phone.trim()) e.phone = "Phone is required";
      else if (!/^\d{10}$/.test(signup.phone)) e.phone = "Enter valid 10-digit number";
    }
    if (!lockedFromAccount.email) {
      if (!signup.email.trim()) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signup.email)) e.email = "Enter valid email";
    }
    if (!signup.dob) e.dob = "Date of birth is required";
    else if (!isAtLeastAge(signup.dob, 21)) e.dob = "You must be at least 21 years old to apply for a loan";
    if (!signup.pan.trim()) e.pan = "PAN is required";
    else if (!PAN_REGEX.test(signup.pan)) e.pan = "Enter a valid PAN, e.g. ABCDE1234F";
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

  const handleSendOtp = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    if (mode === "signup" && !validateSignup()) return;
    if (mode === "signin" && !validateSignin()) return;

    setIsSending(true);
    setApiError("");
    try {
      if (mode === "signup") {
        await registerUser(registerPayload);
        mergeAccountDetails({ dob: signup.dob, pan: signup.pan });
        await          applyRegister({
          product: productName,
          dob: signup.dob,
          panNumber: signup.pan,
        });
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

  const handleVerifyOtp = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
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
        await registerUser(registerPayload);
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

  // ── Progress pill active key ────────────────────────────────────────────

  const progressActive = step === "details"
    ? mode === "signup" ? "account" : "signin"
    : "otp";

  // ── Render ────────────────────────────────────────────────────────────────

  // Portalled to <body>: an ancestor with its own stacking context (e.g. the
  // hero's `absolute z-10` wrapper) would otherwise trap the popup under the
  // header, no matter how high its z-index is.
  return createPortal(
    <>
      {/* Backdrop — above the header (z-55) */}
      <div
        className="fixed inset-0 bg-black/50 z-90 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal — 2-panel: brand (left) + form (right). Sits above the header. */}
      <div className="fixed inset-0 z-110 flex items-center justify-center p-3 sm:p-4">
        <div className="auth-popup-card w-full max-w-4xl min-w-0 flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden">

          {/* LEFT PANEL — Brand / marketing (navy gradient) */}
          <div
            className="relative w-full md:w-80 shrink-0 flex flex-col justify-between
              bg-linear-to-br from-(--brand-navy) via-(--brand-dark) to-(--brand-navy-deep)
              shadow-xl overflow-hidden"
            style={{
              /* subtle top-edge teal highlight */
              boxShadow: "0 0 0 1px rgba(38,174,144,0.25), 0 20px 60px -20px rgba(0,0,0,0.6)",
            }}
          >
            {/* Top accent bar — brand teal */}
            <div className="h-1 w-full bg-(--brand-teal)" />

            {/* Top padding + inner content */}
            <div className="flex flex-col justify-between flex-1 p-4 sm:p-5 md:px-8 md:py-6 text-white overflow-y-auto overscroll-contain">

              {/* Top: product badge */}
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                    text-[10px] font-bold uppercase tracking-wider bg-(--brand-yellow) text-(--brand-dark)
                    shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                    Apply Now
                  </span>
                  <h3 className="mt-2 text-sm font-bold text-(--brand-yellow)
                    uppercase tracking-[0.18em] leading-tight">
                    {productName}
                  </h3>
              </div>

              {/* Brand panel body — visual feature cards */}
              <div className="mt-3 mb-3 md:mt-5 md:mb-6 flex flex-col gap-2 md:gap-3">
                {/* Big headline */}
                <p className="text-lg sm:text-xl md:text-4xl font-extrabold leading-[1.15] tracking-tight
                  text-white drop-shadow-sm">
                  Get{" "}
                  <span className="text-(--brand-yellow)">funds</span>{" "}
                  when you need them
                </p>
                <p className="hidden md:block text-sm leading-relaxed text-white/70 max-w-[50ch]">
                  Fast approval, minimal paperwork. <br />
                  Apply in minutes and get a decision quickly.
                </p>

                {/* Feature pills — icon + text, teal-tinted backgrounds.
                    Hidden on small screens so the brand panel stays short. */}
                <div className="hidden md:grid grid-cols-1 gap-2.5 mt-1">
                  {[
                    { icon: <IconAmount />, title: "Quick disbursal",
                      desc: "Funds credited to your account once approved" },
                    { icon: <IconDocs />, title: "Minimal documents",
                      desc: "PAN, Aadhaar & a few details is all it takes" },
                    { icon: <IconFast />, title: "Apply in minutes",
                      desc: "No branch visit — start & finish online" },
                  ].map((f, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl px-4 py-3.5
                        bg-white/10 backdrop-blur-[2px] border border-white/10"
                    >
                      <div className="shrink-0 mt-0.5 rounded-lg bg-(--brand-teal)
                        bg-opacity-20 p-2 text-(--brand-teal)">
                        {f.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{f.title}</p>
                        <p className="text-xs mt-0.5 text-white/65 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spacer pushes the progress pill to the bottom */}
              <div className="flex-1" />

              {/* Progress pill — states which step is active */}
              <div className="flex items-center gap-2">
                {[
                  { key: "account",  label: "Account",  active: progressActive === "account" },
                  { key: "otp",      label: "OTP",      active: progressActive === "otp" },
                ].map((p, i) => (
                  <div key={p.key} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                      transition-all ${p.active
                        ? "bg-(--brand-teal) text-white shadow-(--brand-teal-44)"
                        : "bg-white/15 text-white/50"}`}>
                      {p.active ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"
                          viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      ) : i + 1}
                    </div>
                    <span className={`text-xs font-semibold tracking-wide ${p.active
                      ? "text-white"
                      : "text-white/45"}`}>{p.label}</span>
                    {i === 0 && <div className={`h-px w-5 transition-all ${progressActive === "otp" ? "bg-white/35" : "bg-white/10"}`} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
            RIGHT PANEL — Form card
            ═══════════════════════════════════════════════════════════════════ */}
          <div className="flex-1 w-full min-w-0 min-h-0 flex flex-col bg-white overflow-hidden">

            {/* Thin teal top edge */}
            <div className="h-1 w-full shrink-0 bg-(--brand-teal)" />

            {/* ── Body (scrolls when taller than the card) ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 md:px-7 md:py-6">

              {/* Title — mirrors the brand panel */}
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-(--brand-navy)
                  bg-(--brand-navy-14) px-2 py-0.5 rounded-full text-center">
                  {productName}
                </p>
                <h2 className="text-lg font-bold text-(--form-dark) mt-1.5 text-center">
                  {step === "details"
                    ? mode === "signup" ? "Create your account" : "Welcome back"
                    : "Verify your number"}
                </h2>
                <p className="text-xs text-(--brand-gray) mt-0.5 text-center">
                  {step === "details"
                    ? mode === "signup"
                      ? "Sign up to apply for this loan"
                      : "Sign in to continue your application"
                    : `Enter the OTP sent to +91 ${mobile}`}
                </p>
              </div>

              {/* API-level error */}
              {apiError && (
                <div className="mb-4 bg-(--form-error-bg) border border-red-200 rounded-lg px-4 py-3
                  text-sm text-red-600 flex gap-2.5 items-start">
                  <span className="shrink-0 text-base">⚠️</span>
                  <span>{apiError}</span>
                </div>
              )}

              {/* ── Sign In / Sign Up tab switcher — details step ── */}
              {step === "details" && (
                <div className="flex rounded-xl border border-slate-200 p-0.5 mb-5 bg-slate-50" role="tablist">
                  {(["signup", "signin"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      role="tab"
                      aria-selected={mode === m}
                      onClick={() => switchMode(m)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all
                        ${mode === m
                          ? "bg-white text-(--brand-navy) shadow-sm"
                          : "text-slate-500 hover:text-slate-700 hover:bg-white/50"}`}
                    >
                      {m === "signup" ? "✨ Sign Up" : "🔑 Sign In"}
                    </button>
                  ))}
                </div>
              )}

              {/* ── SIGN UP — details step ── */}
              {step === "details" && mode === "signup" && (
                <form onSubmit={handleSendOtp} className="space-y-3.5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <Field
                      label="Full Name" type="text" name="name"
                      value={signup.name}
                      onChange={(v) => { setSignup((p) => ({ ...p, name: v })); setSignupErrors((p) => ({ ...p, name: "" })); }}
                      placeholder="As per your ID card"
                      error={signupErrors.name} disabled={isSending || !!lockedFromAccount.name}
                    />
                    <Field
                      label="Mobile Number" type="tel" name="phone"
                      value={signup.phone}
                      onChange={(v) => { setSignup((p) => ({ ...p, phone: v.replace(/\D/g, "") })); setSignupErrors((p) => ({ ...p, phone: "" })); }}
                      placeholder="10-digit mobile number"
                      maxLength={10} error={signupErrors.phone} disabled={isSending || !!lockedFromAccount.mobile}
                    />
                    <div className="sm:col-span-2">
                      <Field
                        label="Email Address" type="email" name="email"
                        value={signup.email}
                        onChange={(v) => { setSignup((p) => ({ ...p, email: v })); setSignupErrors((p) => ({ ...p, email: "" })); }}
                        placeholder="your@email.com"
                        error={signupErrors.email} disabled={isSending || !!lockedFromAccount.email}
                      />
                    </div>
                  </div>

                  {hasLockedContact && (
                    <p className="-mt-2 text-xs text-slate-400">
                      🔒 Name, mobile and email were filled when you created your account.
                    </p>
                  )}

                  {/* DOB + PAN — de-emphasized (only editable fields, from PAN card) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-1">
                    <Field
                      label="Date of Birth" type="date" name="dob"
                      value={signup.dob}
                      max={latestDobForAge(21)}
                      onChange={(v) => { setSignup((p) => ({ ...p, dob: v })); setSignupErrors((p) => ({ ...p, dob: "" })); }}
                      error={signupErrors.dob} disabled={isSending}
                      extraCls="opacity-80"
                    />
                    <Field
                      label="PAN Number" type="text" name="pan"
                      value={signup.pan}
                      maxLength={10}
                      onChange={(v) => { setSignup((p) => ({ ...p, pan: v.toUpperCase().replace(/[^A-Z0-9]/g, "") })); setSignupErrors((p) => ({ ...p, pan: "" })); }}
                      placeholder="ABCDE1234F"
                      error={signupErrors.pan} disabled={isSending}
                      extraCls="uppercase tracking-wider"
                    />
                  </div>

                  {/* Subtle note — these come from PAN card */}
                  <p className="text-xs text-slate-400 -mt-1">
                    DOB &amp; PAN must match your PAN card.
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={handleClose} disabled={isSending}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-600
                        border border-slate-300 hover:bg-slate-50 disabled:opacity-50 transition
                        focus:outline-none focus:ring-2 focus:ring-slate-200">
                      Cancel
                    </button>
                    <button type="submit" disabled={isSending}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-70
                        flex items-center justify-center gap-2 transition
                        focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)
                        from-(--brand-navy) to-(--brand-dark) hover:from-(--brand-dark)
                        hover:to-(--brand-navy-deep) shadow-(--brand-navy-44)"
                      style={{ background: "linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-dark) 100%)" }}>
                      {isSending ? <><Spinner /> Sending OTP...</> : "Send OTP →"}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 text-center">
                    Already have an account?{" "}
                    <button type="button" onClick={() => switchMode("signin")}
                      className="text-(--brand-navy) font-semibold hover:underline">
                      Sign In
                    </button>
                  </p>
                </form>
              )}

              {/* ── SIGN IN — details step ── */}
              {step === "details" && mode === "signin" && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full
                      bg-(--brand-navy-14) mb-3 border border-(--brand-navy-22)">
                      <svg className="w-6 h-6 text-(--brand-navy)" fill="none" stroke="currentColor"
                        strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
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

                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={handleClose} disabled={isSending}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-600
                        border border-slate-300 hover:bg-slate-50 disabled:opacity-50 transition
                        focus:outline-none focus:ring-2 focus:ring-slate-200">
                      Cancel
                    </button>
                    <button type="submit" disabled={isSending}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-70
                        flex items-center justify-center gap-2 transition
                        focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)
                        from-(--brand-navy) to-(--brand-dark) hover:from-(--brand-dark)
                        hover:to-(--brand-navy-deep) shadow-(--brand-navy-44)"
                      style={{ background: "linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-dark) 100%)" }}>
                      {isSending ? <><Spinner /> Sending OTP...</> : "Send OTP →"}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 text-center">
                    New user?{" "}
                    <button type="button" onClick={() => switchMode("signup")}
                      className="text-(--brand-navy) font-semibold hover:underline">
                      Create account
                    </button>
                  </p>
                </form>
              )}

              {/* ── OTP step (same for both modes) ── */}
              {step === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full
                      bg-(--brand-navy-14) mb-3 border border-(--brand-navy-22)">
                      <svg className="w-6 h-6 text-(--brand-navy)" fill="none" stroke="currentColor"
                        strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18h3" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-500">One-time password sent to</p>
                    <p className="text-base font-bold text-slate-900">+91 {mobile}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
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
                      className={`w-full px-4 py-3.5 border rounded-lg text-xl tracking-[0.4em]
                        text-center font-bold transition disabled:bg-slate-100
                        focus:outline-none focus:ring-2 focus:ring-(--brand-teal-20) focus:border-(--brand-teal)
                        ${otpError ? "border-red-400" : "border-slate-300"}`}
                      style={otpError ? { borderColor: "#ef4444" } : undefined}
                    />
                    {otpError  && <p className="text-xs text-red-500 mt-1 text-center">{otpError}</p>}
                    {resendMsg && <p className="text-xs text-green-600 mt-1 text-center font-medium">{resendMsg}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying || otp.length < 4}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-70
                      flex items-center justify-center gap-2 transition
                      from-(--brand-navy) to-(--brand-dark) hover:from-(--brand-dark)
                      hover:to-(--brand-navy-deep) shadow-(--brand-navy-44)
                      focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
                    style={{ background: "linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-dark) 100%)" }}
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
                      className="text-sm text-(--brand-navy) hover:text-(--brand-navy-deep)
                        font-medium disabled:opacity-40 flex items-center gap-1 transition">
                      {isResending ? <><Spinner small /> Resending...</> : "Resend OTP"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ApplicationModal;
