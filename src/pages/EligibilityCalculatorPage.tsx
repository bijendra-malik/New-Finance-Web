import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSEO from "../hooks/useSEO";
import { advanceOnEnter } from "../utils/enterToNext";
import { DateOfBirthPicker } from "../components/form/FormControls";
import { fetchContinents, fetchCountriesByContinent } from "../api/masters";
import type { Continent, Country } from "../api/masters";
import { useApplyGate } from "../hooks/useApplyGate";
import { useSetApplicantPrefill } from "../context/applicantPrefillContext";
import { LOAN_SLUGS, loanKeyFor, loanLabelFor } from "../constants/loanSlugs";
import type { LoanKey } from "../constants/loanSlugs";
import { EMAIL_REGEX, MOBILE_REGEX, isAtLeastAge, isAtMostAge } from "../utils/validation";

// ── Static data ───────────────────────────────────────────────────────────────
const loanProducts: string[] = (Object.keys(LOAN_SLUGS) as LoanKey[])
  .map((key) => loanLabelFor(key))
  .filter((label): label is string => Boolean(label));
const occupations = ["Salaried", "Self-Employed", "Business Owner", "Freelancer", "Student", "Retired"];

// ── Types ─────────────────────────────────────────────────────────────────────
interface FormData {
  continent: string; country: string; product: string; fullName: string;
  dob: string; mobile: string; email: string; occupation: string;
  monthlyIncome: string; existingEMI: string; authorized: boolean;
}
interface Result { eligible: boolean; maxLoan: string; emi: string; message: string }

// ── Small helpers ─────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  "₹" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// Icon wrappers
const Icon = ({ d, cls = "w-4 h-4" }: { d: string; cls?: string }) => (
  <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Main component ────────────────────────────────────────────────────────────
const EligibilityCalculatorPage = () => {
  useSEO({
    title: "Loan Eligibility Calculator — Check in 2 Minutes",
    description:
      "Check how much loan you may be eligible for. Free and instant loan eligibility estimate based on your income and existing EMIs — no documents needed.",
    path: "/eligibility-calculator",
  });

  const navigate = useNavigate();
  const { requestApply, gate } = useApplyGate();
  const setApplicantPrefill = useSetApplicantPrefill();

  const [form, setForm] = useState<FormData>({
    continent: "", country: "", product: "", fullName: "",
    dob: "", mobile: "", email: "", occupation: "",
    monthlyIncome: "", existingEMI: "", authorized: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [result, setResult]  = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  // Region comes from the location masters (GET /masters/location/…).
  const [continentOptions, setContinentOptions] = useState<Continent[]>([]);
  const [continentsLoading, setContinentsLoading] = useState(true);
  const [countryOptions, setCountryOptions] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);

  const set = (f: keyof FormData, v: string | boolean) =>
    setForm(p => ({ ...p, [f]: v }));

  useEffect(() => {
    let cancelled = false;
    fetchContinents()
      .then(list => { if (!cancelled) setContinentOptions(list); })
      .catch(() => { if (!cancelled) setContinentOptions([]); })
      .finally(() => { if (!cancelled) setContinentsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const picked = continentOptions.find(item => item.name === form.continent);
    if (!picked) return;
    let cancelled = false;
    fetchCountriesByContinent(picked._id)
      .then(list => { if (!cancelled) setCountryOptions(list); })
      .catch(() => { if (!cancelled) setCountryOptions([]); })
      .finally(() => { if (!cancelled) setCountriesLoading(false); });
    return () => { cancelled = true; };
  }, [continentOptions, form.continent]);

  /** Age rules for the date of birth: 18 to 65 years, never in the future. */
  const dobErrorFor = (dob: string): string => {
    if (!dob) return "";
    const born = new Date(`${dob}T00:00:00`);
    if (Number.isNaN(born.getTime())) return "Enter your complete date of birth";
    if (born > new Date()) return "Date of birth cannot be in the future";
    if (!isAtLeastAge(dob, 18)) return "You must be at least 18 years old";
    if (!isAtMostAge(dob, 65)) return "Applicants must be 65 or younger";
    return "";
  };

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.continent)                                   e.continent     = "Select a continent";
    if (!form.country)                                     e.country       = "Select a country";
    if (!form.product)                                     e.product       = "Select a loan product";
    if (!form.fullName.trim())                             e.fullName      = "Full name is required";
    if (!form.dob)                                         e.dob           = "Enter your complete date of birth";
    else {
      const dobError = dobErrorFor(form.dob);
      if (dobError)                                        e.dob           = dobError;
    }
    if (!form.mobile.trim())                               e.mobile        = "Mobile number is required";
    else if (!MOBILE_REGEX.test(form.mobile))              e.mobile        = "Enter a valid 10-digit number";
    if (form.email.trim() && !EMAIL_REGEX.test(form.email.trim())) e.email = "Enter a valid email address";
    if (!form.occupation)                                  e.occupation    = "Select occupation";
    if (!form.monthlyIncome)                               e.monthlyIncome = "Monthly income is required";
    if (!form.authorized)                                  e.authorized    = "Please authorise to proceed";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /** Opens the real application for the product and profile just estimated. */
  const startApplication = () => {
    const productId = loanKeyFor(form.product);
    if (!productId) return;
    setApplicantPrefill?.({
      identity: {
        fullName: form.fullName.trim(),
        mobile: form.mobile,
        email: form.email.trim(),
        dob: form.dob,
      },
      note: "Your eligibility details are carried into this application. You can review them there.",
      authoritative: false,
    });
    requestApply(productId);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const income   = parseFloat(form.monthlyIncome) || 0;
      const emi      = parseFloat(form.existingEMI)   || 0;
      const net      = income - emi;
      const eligible = net >= 15000;
      const maxLoan  = Math.floor((net * 0.5 * 60) / 1000) * 1000;
      const monthEMI = eligible ? Math.round(maxLoan / 60) : 0;
      setResult({
        eligible,
        maxLoan: eligible ? fmt(maxLoan) : "₹0",
        emi: eligible ? fmt(monthEMI) : "₹0",
        message: eligible
          ? `Great news, ${form.fullName.split(" ")[0]}! Based on your profile, you may be eligible for a loan up to ${fmt(maxLoan)}.`
          : "Your current income or obligations may not meet the minimum eligibility threshold. Try reducing existing EMIs or applying with a co-applicant.",
      });
      setLoading(false);
    }, 1000);
  };

  // Field class helper
  const fc = (field: keyof FormData) =>
    `w-full border rounded-xl px-4 py-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder:text-gray-400 ${
      errors[field] ? "border-red-400 bg-red-50/30" : "border-gray-200 hover:border-gray-300"
    }`;
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-teal-50/40 to-emerald-50/30 mt-(--header-h)">

      {/* Top nav bar */}
      <div
        className="sticky top-0 z-20 flex items-center gap-3 px-6 py-4 shadow-sm"
        style={{ background: "linear-gradient(90deg, #0f766e 0%, #059669 100%)" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 transition cursor-pointer"
          aria-label="Go back"
        >
          <Icon d="M15 19l-7-7 7-7" cls="w-4 h-4 text-white" />
        </button>
        <span className="text-white font-semibold text-sm tracking-wide">Loan Eligibility Calculator</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Page heading */}
        {!result && (
          <div className="mb-8 text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full mb-3">
              Free &amp; Instant
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-2">
              Check Your Loan Eligibility
            </h1>
            <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto">
              Check how much loan you can get — it takes under 2 minutes and needs no documents.
            </p>

            {/* Progress pills */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {["Personal Details", "Financial Info", "Get Results"].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    i === 0 ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      i === 0 ? "bg-white text-teal-600" : "bg-gray-300 text-gray-600"
                    }`}>{i + 1}</span>
                    {step}
                  </div>
                  {i < 2 && <div className="w-6 h-px bg-gray-300" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {result ? (
          /* ═══════════════════ RESULT SCREEN ══════════════════════ */
          <div className="max-w-2xl mx-auto">
            {/* Result header */}
            <div
              className="rounded-2xl p-8 text-center mb-6"
              style={{
                background: result.eligible
                  ? "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)"
                  : "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
                border: `1px solid ${result.eligible ? "#6ee7b7" : "#fca5a5"}`,
              }}
            >
              {/* Icon */}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${
                result.eligible ? "bg-emerald-500" : "bg-red-500"
              }`}>
                {result.eligible ? (
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>

              <h2 className={`text-2xl font-extrabold mb-2 ${result.eligible ? "text-emerald-800" : "text-red-800"}`}>
                {result.eligible ? "You're Eligible! 🎉" : "Not Eligible Yet"}
              </h2>
              <p className={`text-sm leading-relaxed max-w-sm mx-auto ${result.eligible ? "text-emerald-700" : "text-red-700"}`}>
                {result.message}
              </p>
            </div>

            {/* Stats row */}
            {result.eligible && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl border border-teal-200 bg-white p-5 text-center shadow-sm">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Max. Loan Amount</p>
                  <p className="text-2xl md:text-3xl font-extrabold text-teal-700">{result.maxLoan}</p>
                  <p className="text-xs text-gray-400 mt-1">Estimated eligibility</p>
                </div>
                <div className="rounded-xl border border-teal-200 bg-white p-5 text-center shadow-sm">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Est. Monthly EMI</p>
                  <p className="text-2xl md:text-3xl font-extrabold text-teal-700">{result.emi}</p>
                  <p className="text-xs text-gray-400 mt-1">Over 60 months</p>
                </div>
              </div>
            )}

            {/* Info note */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-xs text-amber-800">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
              </svg>
              <span>This is an estimate only. Final eligibility is subject to lender verification, credit score, and documentation review.</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setResult(null)}
                className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-all hover:scale-[1.02]"
              >
                ← Recalculate
              </button>
              {result.eligible && (
                <button
                  onClick={startApplication}
                  className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white cursor-pointer transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #0d9488 0%, #059669 100%)" }}
                >
                  Apply for {form.product} →
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ═══════════════════ FORM ══════════════════════ */
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

            {/* Form header stripe */}
            <div className="px-6 md:px-8 py-5 border-b border-gray-100 bg-gray-50/60">
              <h2 className="font-bold text-gray-800 text-base">Your Details</h2>
              <p className="text-xs text-gray-500 mt-0.5">All fields marked * are required</p>
            </div>

            <form onSubmit={handleSubmit} onKeyDown={advanceOnEnter} noValidate className="px-6 md:px-8 py-7">

              {/* Row 1: Continent | Country | Loan Product */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-5 mb-5">
                <div>
                  <label htmlFor="elig-continent" className={labelCls}>Continent *</label>
                  <select
                    id="elig-continent"
                    value={form.continent}
                    onChange={e => {
                      set("continent", e.target.value);
                      set("country", "");
                      setCountryOptions([]);
                      setCountriesLoading(true);
                      setErrors(p => ({ ...p, continent: "", country: "" }));
                    }}
                    disabled={continentsLoading}
                    className={fc("continent")}
                  >
                    <option value="">{continentsLoading ? "Loading…" : "Select"}</option>
                    {continentOptions.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                  {errors.continent && <p className="text-xs text-red-500 mt-1">{errors.continent}</p>}
                </div>
                <div>
                  <label htmlFor="elig-country" className={labelCls}>Country *</label>
                  <select
                    id="elig-country"
                    value={form.country}
                    onChange={e => { set("country", e.target.value); setErrors(p => ({ ...p, country: "" })); }}
                    disabled={!form.continent || countriesLoading}
                    className={fc("country")}
                  >
                    <option value="">
                      {!form.continent ? "Select a continent first" : countriesLoading ? "Loading…" : "Select"}
                    </option>
                    {countryOptions.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                  {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
                </div>
                <div>
                  <label htmlFor="elig-product" className={labelCls}>Loan Product *</label>
                  <select
                    id="elig-product"
                    value={form.product}
                    onChange={e => { set("product", e.target.value); setErrors(p => ({ ...p, product: "" })); }}
                    className={fc("product")}
                  >
                    <option value="">Select</option>
                    {loanProducts.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.product && <p className="text-xs text-red-500 mt-1">{errors.product}</p>}
                </div>
              </div>

              {/* Row 2: Full Name | Date of Birth | Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-5 mb-5">
                <div>
                  <label htmlFor="elig-name" className={labelCls}>Full Name *</label>
                  <input
                    id="elig-name"
                    type="text"
                    placeholder="Name as per PAN card"
                    value={form.fullName}
                    onChange={e => { set("fullName", e.target.value); setErrors(p => ({ ...p, fullName: "" })); }}
                    className={fc("fullName")}
                  />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label htmlFor="elig-dob-day" className={labelCls}>Date of Birth *</label>
                  <DateOfBirthPicker
                    id="elig-dob-day"
                    value={form.dob}
                    onChange={v => { set("dob", v); setErrors(p => ({ ...p, dob: dobErrorFor(v) })); }}
                    err={errors.dob}
                    showError={false}
                  />
                  {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob}</p>}
                </div>
                <div>
                  <label htmlFor="elig-mobile" className={labelCls}>Mobile Number *</label>
                  <input
                    id="elig-mobile"
                    type="tel"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={form.mobile}
                    onChange={e => { set("mobile", e.target.value.replace(/\D/g, "")); setErrors(p => ({ ...p, mobile: "" })); }}
                    className={fc("mobile")}
                  />
                  {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
                </div>
              </div>

              {/* Row 3: Email | Occupation | Income */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-5 mb-5">
                <div>
                  <label htmlFor="elig-email" className={labelCls}>
                    Email Address <span className="normal-case font-normal text-gray-400">(optional)</span>
                  </label>
                  <input
                    id="elig-email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => { set("email", e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                    className={fc("email")}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="elig-occupation" className={labelCls}>Occupation *</label>
                  <select
                    id="elig-occupation"
                    value={form.occupation}
                    onChange={e => { set("occupation", e.target.value); setErrors(p => ({ ...p, occupation: "" })); }}
                    className={fc("occupation")}
                  >
                    <option value="">Select</option>
                    {occupations.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {errors.occupation && <p className="text-xs text-red-500 mt-1">{errors.occupation}</p>}
                </div>
                <div>
                  <label htmlFor="elig-income" className={labelCls}>Net Monthly Income *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">₹</span>
                    <input
                      id="elig-income"
                      type="number"
                      placeholder="e.g. 50000"
                      value={form.monthlyIncome}
                      onChange={e => { set("monthlyIncome", e.target.value); setErrors(p => ({ ...p, monthlyIncome: "" })); }}
                      className={`${fc("monthlyIncome")} pl-7`}
                    />
                  </div>
                  {errors.monthlyIncome && <p className="text-xs text-red-500 mt-1">{errors.monthlyIncome}</p>}
                </div>
              </div>

              {/* Row 4: Existing EMI */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-5 mb-6">
                <div>
                  <label htmlFor="elig-emi" className={labelCls}>
                    Existing EMI <span className="normal-case font-normal text-gray-400">(if any)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">₹</span>
                    <input
                      id="elig-emi"
                      type="number"
                      placeholder="e.g. 5000"
                      value={form.existingEMI}
                      onChange={e => set("existingEMI", e.target.value)}
                      className={`${fc("existingEMI")} pl-7`}
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <hr className="border-gray-100 mb-5" />

              {/* Authorise checkbox */}
              <label className="flex items-start gap-3 cursor-pointer mb-7 group">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={form.authorized}
                    onChange={e => set("authorized", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all peer-checked:bg-teal-600 peer-checked:border-teal-600 ${errors.authorized ? "border-red-400 bg-red-50/30" : "border-gray-300 group-hover:border-teal-400"}`}>
                    <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-gray-500 leading-relaxed">
                  I authorise the website and its partner providers to call or SMS me in connection with my application and agree to the{" "}
                  <span className="text-teal-600 underline">Terms of use</span>.
                </span>
              </label>
              {errors.authorized && <p className="text-xs text-red-500 -mt-5 mb-5 ml-8">{errors.authorized}</p>}

              {/* Submit */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="relative inline-flex items-center justify-center gap-3 px-12 py-3.5 rounded-xl font-bold text-white text-base cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                  style={{ background: "linear-gradient(135deg, #0f766e 0%, #059669 100%)", minWidth: "240px", boxShadow: "0 6px 24px rgba(15,118,110,0.4)" }}
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Checking…
                    </>
                  ) : (
                    <>
                      Check Your Eligibility
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Trust badges */}
        {!result && (
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            {[
              { icon: "⏱️", label: "2 Minutes", sub: "to complete" },
              { icon: "🔒", label: "100% Secure", sub: "your data is safe" },
              { icon: "🆓", label: "Free Check", sub: "no charges" },
              { icon: "📋", label: "No Documents", sub: "needed now" },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full shadow-sm">
                <span className="text-base">{b.icon}</span>
                <div>
                  <p className="text-xs font-bold text-gray-800 leading-none">{b.label}</p>
                  <p className="text-[10px] text-gray-400 leading-none mt-0.5">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Registration + application form for the product just estimated */}
      {gate}
    </div>
  );
};

export default EligibilityCalculatorPage;
