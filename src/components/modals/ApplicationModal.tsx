import { useState, useEffect } from "react";
import { EMAIL_REGEX, MOBILE_REGEX, NAME_REGEX, PAN_REGEX, earliestDobForAge, isAtLeastAge, isAtMostAge, latestDobForAge } from "../../utils/validation";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useSetApplicantPrefill } from "../../context/applicantPrefillContext";
import { useAuth } from "../../context/authContext";
import {
  requestLoanApplyOTP,
  requestLoginOTP,
  verifyLoginOTP,
  verifyOTP,
  type AuthActionResponse,
} from "../../api/auth";
import { fetchContinents, fetchCountriesByContinent } from "../../api/masters";
import type { Continent, Country } from "../../api/masters";
import { getApiErrorMessage } from "../../utils/apiError";
import { loanKeyFor, loanLabelFor } from "../../constants/loanSlugs";
import { markApplySessionPending } from "../../utils/applySession";
import {
  applicationCooldown,
  clearPendingCreditScoreDraft,
  readPendingCreditScoreDraft,
  readSubmittedApplication,
  remainingCreditScoreWindow,
  type ApplicationCooldown,
} from "../../utils/applicationFlowState";
import Button from "../ui/Button";
import { resolveDashboardPath } from "./applicationModalRoutes";
import { Field, Select } from "./applicationModalFields";

const ALREADY_REGISTERED_SIGNALS = new Set([
  "mobile already exists",
  "mobile already registered",
  "already registered",
  "mobile number already registered",
]);

interface BlockedNotice {
  kind: "rejected" | "cooldown";
  title: string;
  body: string;
  detail?: string;
}

const formatDay = (date: Date): string =>
  date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

const alreadyAppliedError = (
  err: unknown,
): { message: string; availableAt?: string } | null => {
  const response = (
    err as {
      response?: { status?: number; data?: { message?: string; retryAfter?: { availableAt?: string } } };
    }
  )?.response;
  const message = response?.data?.message;
  if (typeof message !== "string" || !message.trim()) return null;
  const isCooldown =
    response?.status === 409 || /already applied|already submitted/i.test(message);
  if (!isCooldown) return null;
  return { message: message.trim(), availableAt: response?.data?.retryAfter?.availableAt };
};

const isAlreadyRegisteredResponse = (
  response: AuthActionResponse,
): boolean => {
  if (response.success) return false;
  const message =
    typeof response.message === "string" ? response.message.trim().toLowerCase() : "";
  if (ALREADY_REGISTERED_SIGNALS.has(message)) return true;
  if (message.includes("already")) {
    if (
      message.includes("mobile") ||
      message.includes("number") ||
      message.includes("registered") ||
      message.includes("exist")
    ) {
      return true;
    }
  }
  return false;
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  activeProduct?: { id: string } | null;
}

// ── Component ──────────────────────────────────────────────────────────────────

const ApplicationModal = ({
  isOpen,
  onClose,
  productName = "",
  activeProduct,
}: ApplicationModalProps) => {
  const navigate = useNavigate();
  const setApplicantPrefill = useSetApplicantPrefill();
  const { login, isLoggedIn, user } = useAuth();

  // Sign up (register for a product) vs Sign in (returning customer).
  const openedAsLogin = productName.trim().toLowerCase() === "log in";
  const [mode, setMode] = useState<"signup" | "signin">(openedAsLogin ? "signin" : "signup");

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [pan, __setPan] = useState("");
  // Region — chosen from the location masters (GET /masters/location/…).
  const [continent, setContinent] = useState("");
  const [country, setCountry] = useState("");
  const [continentOptions, setContinentOptions] = useState<Continent[]>([]);
  const [continentsLoading, setContinentsLoading] = useState(true);
  const [countryOptions, setCountryOptions] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const setPan = function (v: string) {
    const clean = v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    let structured = "";
    for (const c of clean) {
      const pos = structured.length;
      if (pos < 5 && /[A-Z]/.test(c)) structured += c;
      else if (pos >= 5 && pos < 9 && /[0-9]/.test(c)) structured += c;
      else if (pos === 9 && /[A-Z]/.test(c)) structured += c;
    }
    __setPan(structured);
    setFieldErrors((p) => ({ ...p, pan: "" }));
  };

  // ── Step 1 — Save eligibility details → eligibility test ────────────────────
  const [apiError, setApiError] = useState("");
  const [detailsBusy, setDetailsBusy] = useState(false);

  // ── Step 2 — the OTP gate (POST /auth/personal-loan → POST /auth/verify-otp) ──
  const [step, setStep] = useState<"details" | "otp">("details");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpBusy, setOtpBusy] = useState(false);
  const [resendNotice, setResendNotice] = useState("");
  const [resending, setResending] = useState(false);
  // Where to land once the mobile is verified.
  const [pendingDashboard, setPendingDashboard] = useState("");
  const [sessionWasSignedIn, setSessionWasSignedIn] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [blockedNotice, setBlockedNotice] = useState<BlockedNotice | null>(null);

  const resetAll = () => {
    setFullName("");
    setMobile("");
    setEmail("");
    setDob("");
    __setPan("");
    setContinent("");
    setCountry("");
    setCountryOptions([]);
    setCountriesLoading(false);
    setFieldErrors({});
    setApiError("");
    setDetailsBusy(false);
    setStep("details");
    setOtp("");
    setOtpError("");
    setOtpBusy(false);
    setResendNotice("");
    setResending(false);
    setAlreadyRegistered(false);
    setBlockedNotice(null);
    setPendingDashboard("");
    setSessionWasSignedIn(true);
    setMode(openedAsLogin ? "signin" : "signup");
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const switchMode = (next: "signup" | "signin") => {
    if (next === mode) return;
    setMode(next);
    setStep("details");
    setOtp("");
    setOtpError("");
    setResendNotice("");
    setApiError("");
    setFieldErrors({});
    setAlreadyRegistered(false);
    setBlockedNotice(null);
  };

  // Escape closes the panel, like the backdrop and the Cancel button.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  // Freeze the page behind the popup, so only the popup's own areas scroll.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Continents load once; the country list follows the chosen continent. Both are
  // masters endpoints, cached in the api module, so re-opening the popup is free.
  useEffect(() => {
    let cancelled = false;
    fetchContinents()
      .then((list) => { if (!cancelled) setContinentOptions(list); })
      .catch(() => { if (!cancelled) setContinentOptions([]); })
      .finally(() => { if (!cancelled) setContinentsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const picked = continentOptions.find((item) => item.name === continent);
    if (!picked) return;
    let cancelled = false;
    fetchCountriesByContinent(picked._id)
      .then((list) => { if (!cancelled) setCountryOptions(list); })
      .catch(() => { if (!cancelled) setCountryOptions([]); })
      .finally(() => { if (!cancelled) setCountriesLoading(false); });
    return () => { cancelled = true; };
  }, [continentOptions, continent]);

  if (!isOpen) return null;

  const productKey = activeProduct?.id ?? productName;
  // The canonical LOAN_SLUGS key names the OTP endpoint (/auth/{loanKey}).
  const loanKey = loanKeyFor(productKey);
  const isLoginMode = mode === "signin";

  const noticeForCooldown = (cooldown: ApplicationCooldown): BlockedNotice =>
    cooldown.outcome === "rejected"
      ? {
          kind: "rejected",
          title: "Your earlier application was not eligible",
          body: `Our review of your earlier ${productName} application found it was not eligible for a loan. A refused application can be refilled after a 30-day cooling-off period — from ${formatDay(cooldown.availableAt)}.`,
          detail: "A stronger credit score, or clearing existing dues, can change the outcome. Another product may still suit your profile today.",
        }
      : {
          kind: "cooldown",
          title: "You have already applied",
          body: `You have already applied for ${productName}. A new application can be filed from ${formatDay(cooldown.availableAt)}.`,
          detail: "You can follow the application you have already submitted from My Applications.",
        };

  // ── Validate eligibility fields ───────────────────────────────────────────

  const validateDetails = () => {
    const e: Record<string, string> = {};
    if (!MOBILE_REGEX.test(mobile)) e.mobile = "Enter a valid 10-digit mobile number";
    // Signing in needs nothing but the registered mobile number.
    if (isLoginMode) {
      setFieldErrors(e);
      return Object.keys(e).length === 0;
    }
    if (!fullName.trim()) e.fullName = "Full name is required";
    else if (!NAME_REGEX.test(fullName.trim())) e.fullName = "Enter a valid full name";
    if (!EMAIL_REGEX.test(email)) e.email = "Enter a valid email address";
    if (!dob) e.dob = "Date of birth is required";
    else if (!isAtLeastAge(dob, 18)) e.dob = "You must be at least 18 years old to apply for a loan";
    else if (!isAtMostAge(dob, 65)) e.dob = "Applicants must be 65 years old or younger";
    validatePan("pan", pan, e);
    if (!continent) e.continent = "Select a continent";
    if (!country) e.country = "Select a country";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePan = (name: "pan", value: string, e: Record<string, string>) => {
    if (!value.trim()) { e[name] = "PAN is required"; return; }
    if (!PAN_REGEX.test(value)) { e[name] = "Enter a valid PAN, e.g. ABCDE1234F"; return; }
  };

  // ── Step 1 — Save eligibility details → eligibility test ────────────────────


  /** Carries the verified identity into the dashboard form, then closes the popup. */
  const openApplicationForm = (dashboardPath: string) => {
    setApplicantPrefill?.({
      identity: {
        fullName: fullName.trim(),
        mobile,
        email: email.trim(),
        dob,
        panNumber: pan,
      },
      note: "Your details are carried into the application form. You can review them there.",
      // What the account registered at loan entry holds — not this typed copy —
      // is what the backend compares a submission against, so these values may
      // only fill the fields the account leaves blank.
      authoritative: false,
    });
    resetAll();
    onClose();
    navigate(dashboardPath);
  };

  const applyIdentity = () => ({
    name: fullName.trim(),
    mobile,
    email: email.trim(),
    dob,
    panNumber: pan,
    continent,
    country,
  });

  /**
   * Asks for the OTP: the apply flow registers the product
   * (POST /auth/{loanKey}); the sign-in flow hits POST /auth/login/request-otp.
   * A resend goes through the same call so it matches the first request.
   */
  const requestOtp = (): Promise<AuthActionResponse> => {
    if (!loanKey) {
      return Promise.reject(new Error("This product cannot be applied for yet."));
    }
    if (isLoginMode) return requestLoginOTP({ mobile });
    return requestLoanApplyOTP(loanKey, applyIdentity());
  };

  /** Step 1 — save the details and send the apply-flow OTP. */
  const handleDetailsSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    if (!validateDetails()) return;

    setApiError("");
    const productDashboardPath = resolveDashboardPath(productKey);
    // Each sign-in remains tied to the product that opened the modal; do not
    // guess a fallback product when that context is missing.
    const dashboardPath = productDashboardPath;
    if (!dashboardPath || !loanKey) {
      setApiError("Application form is not available for this product yet.");
      return;
    }

    if (!isLoginMode) {
      const record = readSubmittedApplication(user?._id ?? mobile, loanKey);
      const cooldown = record ? applicationCooldown(record) : null;
      if (cooldown?.blocked) {
        setApiError("");
        setBlockedNotice(noticeForCooldown(cooldown));
        return;
      }
    }

    // Every application is authorised by its own OTP: re-applying — for another
    // product, or after abandoning one — requests a fresh code and replaces the
    // token with the new one, so a stale session can never file the application.
    setSessionWasSignedIn(isLoggedIn);
    setDetailsBusy(true);
    try {
      const response = await requestOtp();
      if (!response.success) {
        if (isAlreadyRegisteredResponse(response)) {
          setAlreadyRegistered(true);
          setStep("details");
          return;
        }
        setApiError(response.message || "We could not send the OTP just now. Please try again.");
        return;
      }
      setPendingDashboard(dashboardPath);
      setOtp("");
      setOtpError("");
      setResendNotice("");
      setStep("otp");
    } catch (err) {
      setApiError(getApiErrorMessage(err, "We could not send the OTP just now. Please try again."));
    } finally {
      setDetailsBusy(false);
    }
  };

  /** Step 2 — verify the OTP, store its token, then open the product's form. */
  const handleOtpVerify = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const code = otp.trim();
    if (!code) { setOtpError("Please enter the OTP"); return; }
    if (!/^\d{4,8}$/.test(code)) { setOtpError("Enter a valid OTP"); return; }
    if (!loanKey) { setOtpError("Please start sign-in from the loan product you want to apply for."); return; }

    setOtpBusy(true);
    setOtpError("");
    try {
      const response = isLoginMode
        ? await verifyLoginOTP(loanKey, { mobile, otp: code })
        : await verifyOTP({ mobile, otp: code });
      if (!response.success || !response.token || !response.user) {
        setOtpError("The verification response was incomplete. Check the code and try again.");
        return;
      }
      login(response.token, response.user);
      if (isLoginMode) {
        const pendingDraft = readPendingCreditScoreDraft(response.user._id);
        if (pendingDraft) {
          if (remainingCreditScoreWindow(pendingDraft.createdAt).expired) {
            clearPendingCreditScoreDraft();
          } else {
            resetAll();
            onClose();
            const draftDashboard = resolveDashboardPath(pendingDraft.loanKey);
            navigate(draftDashboard ?? "/credit-score", {
              state: draftDashboard
                ? undefined
                : {
                    product: loanLabelFor(pendingDraft.loanKey) ?? pendingDraft.loanKey,
                    requestedProduct: productName,
                  },
            });
            return;
          }
        }
        // With no active draft, sign-in opens the requested product's form.
        resetAll();
        onClose();
        navigate(pendingDashboard);
        return;
      }
      if (!sessionWasSignedIn) markApplySessionPending();
      openApplicationForm(pendingDashboard);
    } catch (err) {
      const blocked = alreadyAppliedError(err);
      if (blocked) {
        const record = loanKey ? readSubmittedApplication(user?._id ?? mobile, loanKey) : null;
        const cooldown = record ? applicationCooldown(record) : null;
        setOtpError("");
        setBlockedNotice(
          cooldown && cooldown.outcome === "rejected"
            ? noticeForCooldown(cooldown)
            : {
                kind: "cooldown",
                title: "You have already applied",
                body: blocked.availableAt
                  ? `${blocked.message} You can apply again from ${formatDay(new Date(blocked.availableAt))}.`
                  : blocked.message,
                detail: "You can follow the application you have already submitted from My Applications.",
              },
        );
        return;
      }
      setOtpError(getApiErrorMessage(err, "Invalid OTP. Please try again."));
    } finally {
      setOtpBusy(false);
    }
  };

  const handleOtpResend = async () => {
    if (!loanKey) {
      setOtpError("Could not resend the OTP. Please try again.");
      return;
    }
    setResending(true);
    setOtpError("");
    setResendNotice("");
    try {
      const response = await requestOtp();
      if (!response.success) {
        setOtpError(response.message || "Could not resend the OTP. Please try again.");
        return;
      }
      setResendNotice("OTP resent successfully!");
    } catch (err) {
      setOtpError(getApiErrorMessage(err, "Could not resend the OTP. Please try again."));
    } finally {
      setResending(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  // Portalled to <body>: an ancestor with its own stacking context (e.g. the hero's `absolute z-10` wrapper) would otherwise trap the popup under the header, no matter how high its z-index is.
  return createPortal(
    <>
      {/* Backdrop — above the header (z-55) */}
      <div
        className="fixed inset-0 bg-black/50 z-90 backdrop-blur-sm"
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
                  >
                    {blockedNotice.title}
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
                      onClick={() => setBlockedNotice(null)}
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
                  </div>
                </div>
              )}

              {/* Feature 1 — this mobile is already registered; sign in instead. */}
              {alreadyRegistered && (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Already in our system</p>
                  <p className="mt-1 text-sm text-emerald-800">
                    This mobile number is already registered with us. To continue applying for {productName},
                    sign in with that number instead.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-lg font-semibold"
                      onClick={() => {
                        setAlreadyRegistered(false);
                        switchMode("signin");
                      }}>
                      Sign in
                    </Button>
                    <Button variant="ghost" className="flex-1 rounded-lg font-semibold"
                      onClick={() => setAlreadyRegistered(false)}>
                      Try again
                    </Button>
                  </div>
                </div>
              )}

              {/* Capture applicant identity before opening the loan form. */}
              {step === "details" && (
                <form onSubmit={handleDetailsSubmit} className="space-y-3" noValidate>
                  {/* Product selected on the home page — a sign-in has none. */}
                  {!isLoginMode && (
                    <div className="rounded-xl border border-(--brand-teal)/30 bg-(--brand-teal-14) px-4 py-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Product</p>
                      <p className="mt-0.5 flex items-center gap-2 text-sm font-bold text-slate-800">
                        <svg className="h-4 w-4 shrink-0 text-(--brand-teal)" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {productName}
                      </p>
                    </div>
                  )}

                  {/* Applicant details — only the mobile number in login mode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                    {!isLoginMode && (
                      <Field
                        label="Full Name" type="text" name="fullName"
                        value={fullName} onChange={(v) => { setFullName(v); setFieldErrors((p) => ({ ...p, fullName: "" })); }}
                        placeholder="As shown on your PAN card" error={fieldErrors.fullName}
                      />
                    )}
                    <Field
                      label="Mobile Number" type="tel" name="mobile"
                      value={mobile} onChange={(v) => { setMobile(v.replace(/\D/g, "").slice(0, 10)); setFieldErrors((p) => ({ ...p, mobile: "" })); }}
                      placeholder="10-digit mobile number" error={fieldErrors.mobile} maxLength={10}
                      containerCls={isLoginMode ? "sm:col-span-2" : ""}
                    />
                    {!isLoginMode && (
                      <>
                        <Field
                          label="Email Address" type="email" name="email"
                          value={email} onChange={(v) => { setEmail(v); setFieldErrors((p) => ({ ...p, email: "" })); }}
                          placeholder="you@example.com" error={fieldErrors.email}
                        />
                        <Field
                          label="Date of Birth" type="date" name="dob"
                          value={dob}
                          min={earliestDobForAge(65)}
                          max={latestDobForAge(18)}
                          onChange={(v) => { setDob(v); setFieldErrors((p) => ({ ...p, dob: "" })); }}
                          error={fieldErrors.dob}
                        />
                        <Field
                          label="PAN Number" type="text" name="pan"
                          value={pan}
                          maxLength={10}
                          onChange={(v) => { setPan(v); setFieldErrors((p) => ({ ...p, pan: "" })); }}
                          placeholder="ABCDE1234F"
                          error={fieldErrors.pan}
                          extraCls="uppercase tracking-wider"
                        />
                        <Select
                          label="Continent" name="continent"
                          value={continent}
                          options={continentOptions.map((c) => c.name)}
                          placeholder={continentsLoading ? "Loading…" : "Select continent"}
                          disabled={continentsLoading}
                          onChange={(v) => {
                            setContinent(v);
                            setCountry("");
                            setCountryOptions([]);
                            setCountriesLoading(true);
                            setFieldErrors((p) => ({ ...p, continent: "", country: "" }));
                          }}
                          error={fieldErrors.continent}
                        />
                        <Select
                          label="Country" name="country"
                          value={country}
                          options={countryOptions.map((c) => c.name)}
                          placeholder={
                            !continent ? "Select a continent first" : countriesLoading ? "Loading…" : "Select country"
                          }
                          disabled={!continent || countriesLoading}
                          onChange={(v) => { setCountry(v); setFieldErrors((p) => ({ ...p, country: "" })); }}
                          error={fieldErrors.country}
                        />
                      </>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1 rounded-lg font-semibold"
                      onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 rounded-lg font-semibold" loading={detailsBusy}>
                      {detailsBusy ? "Sending OTP…" : "Continue →"}
                    </Button>
                  </div>
                </form>
              )}

              {/* Step 2 — the OTP from POST /auth/{loanKey} (apply) or
                  POST /auth/login/request-otp (sign-in) */}
              {step === "otp" && (
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
                    <label htmlFor="apply-otp" className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-(--form-dark)">
                      Enter OTP <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      id="apply-otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      autoFocus
                      disabled={otpBusy}
                      onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setOtpError(""); }}
                      placeholder="• • • • • •"
                      className={`w-full rounded-xl border px-3 py-3 text-center text-xl font-bold tracking-[0.4em] text-slate-800 shadow-sm outline-none transition focus:ring-2 focus:ring-(--brand-teal-20) disabled:bg-slate-100 ${otpError ? "border-red-400 bg-red-50/30" : "border-slate-300 focus:border-(--brand-teal)"}`}
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
