import { useState, useEffect } from "react";
import { EMAIL_REGEX, MOBILE_REGEX, NAME_REGEX, PAN_REGEX, isAtLeastAge, latestDobForAge } from "../../utils/validation";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useSetApplicantPrefill } from "../../context/applicantPrefillContext";
import { useAuth } from "../../context/authContext";
import { requestLoanApplyOTP, verifyOTP } from "../../api/auth";
import { fetchContinents, fetchCountriesByContinent } from "../../api/masters";
import type { Continent, Country } from "../../api/masters";
import { getApiErrorMessage } from "../../utils/apiError";
import { loanSlugFor } from "../../constants/loanSlugs";
import Button from "../ui/Button";

// ── Loan type → dashboard route ───────────────────────────────────────────────

const dashboardRoutes: Readonly<Record<string, string>> = {
  "Personal Loan": "/dashboard/personalloan",
  "Business Loan": "/dashboard/businessloan",
  "Home Loan": "/dashboard/homeloan",
  "Vehicle Loan": "/dashboard/Vehicleloan",
  "Education Loan": "/dashboard/educationloan",
  "Loan Against Property": "/dashboard/loanagainstproperty",
  "Balance Transfer": "/dashboard/balancetransfer",
  "Credit Card": "/dashboard/creditcard",

  "Premium Credit Cards": "/dashboard/creditcard",
  "Project Loan": "/dashboard/projectloan",
  "Commercial Purchase": "/dashboard/commercialpurchase",
  "Commercial Purchase Loan": "/dashboard/commercialpurchase",
  "Working Capital": "/dashboard/workingcapital",
  "Working Capital Loan": "/dashboard/workingcapital",
  "Lease Rental Discounting": "/dashboard/leaserental",
  "Film Funding": "/dashboard/filmfunding",
  "OD CC Limit": "/dashboard/odcclimit",
  "Loan Against Share": "/dashboard/loanagainstshare",
  "NPA": "/dashboard/npa",
  "Gold Loan": "/dashboard/goldloan",
  "FDI": "/dashboard/fdi",
};

// Homepage globe IDs do not always match the dashboard route slug.
const productIdRoutes: Readonly<Record<string, string>> = {
  personal: "/dashboard/personalloan",
  business: "/dashboard/businessloan",
  home: "/dashboard/homeloan",
  lap: "/dashboard/loanagainstproperty",
  balanceTransfer: "/dashboard/balancetransfer",
  vehicleLoan: "/dashboard/Vehicleloan",
  creditCard: "/dashboard/creditcard",
  educationLoan: "/dashboard/educationloan",
  projectLoan: "/dashboard/projectloan",
  commercialPurchase: "/dashboard/commercialpurchase",
  leaseRentalDiscounting: "/dashboard/leaserental",
  workingCapital: "/dashboard/workingcapital",
  filmFunding: "/dashboard/filmfunding",
  odCcLimit: "/dashboard/odcclimit",
  loanAgainstShare: "/dashboard/loanagainstshare",
  goldLoan: "/dashboard/goldloan",
  fdiLoan: "/dashboard/fdi",
  npaLoan: "/dashboard/npa",
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  activeProduct?: { id: string } | null;
}

// ── Reusable Field ─────────────────────────────────────────────────────────────

const Field = ({
  label, type, name, value, onChange, placeholder, error, disabled, maxLength, max, extraCls = "", required = true,
}: {
  label: string; type: string; name: string; value: string;
  onChange: (v: string) => void; placeholder?: string; error?: string; disabled?: boolean; maxLength?: number; max?: string; extraCls?: string; required?: boolean;
}) => (
  <div>
    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-(--form-dark)">
      {label} {required && <span className="text-red-500 ml-0.5">*</span>}
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

// ── Reusable select ────────────────────────────────────────────────────────────

const Select = ({
  label, name, value, onChange, options, placeholder, error, disabled,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder: string; error?: string; disabled?: boolean;
}) => (
  <div>
    <label htmlFor={name} className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-(--form-dark)">
      {label} <span className="text-red-500 ml-0.5">*</span>
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all
        focus:outline-none focus:ring-2 focus:ring-(--brand-teal-20) focus:border-(--brand-teal)
        disabled:bg-(--form-field-bg-disabled) disabled:cursor-not-allowed
        ${error ? "border-red-400" : "border-(--form-field-border)"}`}
      style={error ? { borderColor: "#ef4444" } : undefined}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// ── Component ──────────────────────────────────────────────────────────────────

const ApplicationModal = ({
  isOpen,
  onClose,
  productName = "",
  activeProduct,
}: ApplicationModalProps) => {
  const navigate = useNavigate();
  const setApplicantPrefill = useSetApplicantPrefill();
  const { login, isLoggedIn } = useAuth();

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

  // PAN-format setter (the structured "autostop" A→Z then 0-9 flush) "Autostop alphanumeric letters": while typing, keep A-Z letters until the 5-letter block is full, then only accept 0-9 digits for the next 4 slots; slot 10 accepts a letter only — the check letter from the card.
  const setPan = function (v: string) {
    const clean = v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    let structured = "";
    for (const c of clean) {
      const pos = structured.length;
      if (pos < 5 && /[A-Z]/.test(c)) structured += c;                 // letters autostop at 5
      else if (pos >= 5 && pos < 9 && /[0-9]/.test(c)) structured += c; // digits autostop at 4
      else if (pos === 9 && /[A-Z]/.test(c)) structured += c;           // check letter only
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
    setPendingDashboard("");
  };

  const handleClose = () => {
    resetAll();
    onClose();
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

  // ── Validate eligibility fields ───────────────────────────────────────────

  const validateDetails = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    else if (!NAME_REGEX.test(fullName.trim())) e.fullName = "Enter a valid full name";
    if (!MOBILE_REGEX.test(mobile)) e.mobile = "Enter a valid 10-digit mobile number";
    if (!EMAIL_REGEX.test(email)) e.email = "Enter a valid email address";
    if (!dob) e.dob = "Date of birth is required";
    else if (!isAtLeastAge(dob, 21)) e.dob = "You must be at least 21 years old to apply for a loan";
    validatePan("pan", pan, e);
    if (!continent) e.continent = "Select a continent";
    if (!country) e.country = "Select a country";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const productKey = activeProduct?.id ?? productName;
  // The product's own slug names both the OTP endpoint (/auth/{slug}) and the
  // product on the loan-apply endpoints.
  const loanSlug = loanSlugFor(productKey);

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

  /** The identity the OTP is requested with, so a resend matches the first request. */
  const requestOtp = (slug: string) => requestLoanApplyOTP(slug, applyIdentity());

  /** Step 1 — save the details and send the apply-flow OTP. */
  const handleDetailsSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    if (!validateDetails()) return;

    setApiError("");
    const dashboardPath = productIdRoutes[productKey] ?? dashboardRoutes[productKey];
    if (!dashboardPath || !loanSlug) {
      setApiError("Application form is not available for this product yet.");
      return;
    }

    // A live session already authorises POST /customer/loan-apply, so the OTP gate
    // only runs when there is no token to submit the form with.
    if (isLoggedIn) {
      openApplicationForm(dashboardPath);
      return;
    }

    setDetailsBusy(true);
    try {
      const response = await requestOtp(loanSlug);
      if (!response.success) {
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

    setOtpBusy(true);
    setOtpError("");
    try {
      const response = await verifyOTP({ mobile, otp: code });
      if (!response.success || !response.token || !response.user) {
        setOtpError("The verification response was incomplete. Check the code and try again.");
        return;
      }
      // The token from this call is what lets POST /customer/loan-apply be accepted.
      login(response.token, response.user);
      openApplicationForm(pendingDashboard);
    } catch (err) {
      setOtpError(getApiErrorMessage(err, "Invalid OTP. Please try again."));
    } finally {
      setOtpBusy(false);
    }
  };

  const handleOtpResend = async () => {
    if (!loanSlug) {
      setOtpError("Could not resend the OTP. Please try again.");
      return;
    }
    setResending(true);
    setOtpError("");
    setResendNotice("");
    try {
      const response = await requestOtp(loanSlug);
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

          {/* ── Header band — navy, single column: this is the eligibility
              gateway, not a login panel ── */}
          <div className="relative shrink-0 overflow-hidden bg-linear-to-br from-(--brand-navy) via-(--brand-dark) to-(--brand-navy-deep) text-white">
            <div className="h-1 w-full bg-(--brand-teal)" />
            <div className="px-5 py-3.5 sm:px-6 sm:py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                    text-[10px] font-bold uppercase tracking-wider bg-(--brand-yellow) text-(--brand-dark)
                    shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                    Eligibility check
                  </span>
                  <h2 id="apply-modal-title" className="mt-1.5 text-lg sm:text-xl font-extrabold tracking-tight">
                    {productName}
                  </h2>
                  <p className="mt-0.5 text-xs sm:text-sm text-white/70">
                    Add your contact and identity details to start the application.
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
                  { label: "Your details", state: step === "otp" ? "done" : "active" },
                  { label: "Verify mobile", state: step === "otp" ? "active" : "todo" },
                  { label: "Application form", state: "todo" },
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

              {/* Capture applicant identity before opening the loan form. */}
              {step === "details" && (
                <form onSubmit={handleDetailsSubmit} className="space-y-3" noValidate>
                  {/* Product selected on the home page. */}
                  <div className="rounded-xl border border-(--brand-teal)/30 bg-(--brand-teal-14) px-4 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Product</p>
                    <p className="mt-0.5 flex items-center gap-2 text-sm font-bold text-slate-800">
                      <svg className="h-4 w-4 shrink-0 text-(--brand-teal)" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {productName}
                    </p>
                  </div>

                  {/* Applicant details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                    <Field
                      label="Full Name" type="text" name="fullName"
                      value={fullName} onChange={(v) => { setFullName(v); setFieldErrors((p) => ({ ...p, fullName: "" })); }}
                      placeholder="As shown on your PAN card" error={fieldErrors.fullName}
                    />
                    <Field
                      label="Mobile Number" type="tel" name="mobile"
                      value={mobile} onChange={(v) => { setMobile(v.replace(/\D/g, "").slice(0, 10)); setFieldErrors((p) => ({ ...p, mobile: "" })); }}
                      placeholder="10-digit mobile number" error={fieldErrors.mobile} maxLength={10}
                    />
                    <Field
                      label="Email Address" type="email" name="email"
                      value={email} onChange={(v) => { setEmail(v); setFieldErrors((p) => ({ ...p, email: "" })); }}
                      placeholder="you@example.com" error={fieldErrors.email}
                    />
                    <Field
                      label="Date of Birth" type="date" name="dob"
                      value={dob}
                      max={latestDobForAge(21)}
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

              {/* Step 2 — the OTP sent by POST /auth/personal-loan */}
              {step === "otp" && (
                <form onSubmit={handleOtpVerify} className="space-y-3.5" noValidate>
                  <div className="rounded-xl border border-(--brand-navy-22) bg-(--brand-navy-14) px-4 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Product</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-800">{productName}</p>
                  </div>

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
                      {otpBusy ? "Verifying…" : "Verify & Continue →"}
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
