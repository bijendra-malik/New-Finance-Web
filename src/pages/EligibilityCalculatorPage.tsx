import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import Container from "../components/common/Container";
import useSEO from "../hooks/useSEO";
import { useApplyGate } from "../hooks/useApplyGate";
import { useSetApplicantPrefill } from "../context/applicantPrefillContext";
import { EMAIL_REGEX, MOBILE_REGEX, ageOn } from "../utils/validation";
import { DateOfBirthPicker } from "../components/form/FormControls";
import { digitsOnly, formatIndianNumber, formatINRRounded } from "../utils/formatters";
import {
  PRODUCTS,
  assetLtvFor,
  goldEligibility,
  maturityAgeFor,
  monthsToMaturity,
  productByKey,
  shareEligibility,
  termEligibility,
  tenureText,
  workingCapitalEligibility,
  type EligibilityOutcome,
  type ProductSpec,
} from "./eligibilityModels";

const SERIF = { fontFamily: "var(--font-serif)" } as const;

const OCCUPATIONS = ["Salaried", "Self-Employed", "Business Owner"] as const;
const BUSINESS_OCCUPATIONS = ["Self-Employed", "Business Owner"] as const;
const BUSINESS_PRODUCTS = new Set([
  "business",
  "projectLoan",
  "commercialPurchase",
  "workingCapital",
  "leaseRentalDiscounting",
]);
const PROFIT_INCOME_PRODUCTS = new Set(["home", "lap", "vehicleLoan"]);
const LAP_PROPERTY_TYPES = ["Residential", "Commercial", "Industrial", "Other"] as const;
const LAP_CITIES = [
  { value: "A", label: "Category A (metro)" },
  { value: "B", label: "Category B (large city)" },
  { value: "C", label: "Category C (smaller town)" },
] as const;
const LAP_USAGES = ["Self-occupied", "Rented out"] as const;
const CARATS = [24, 22, 20, 18] as const;

const num = (value: string): number => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

/** Crores and lakhs for headline figures, exact rupees elsewhere. */
const compact = (value: number): string => {
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)} Cr`;
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)} L`;
  return formatINRRounded(value);
};

const maxTenureFor = (product: ProductSpec, age: number, occupation: string): number => {
  if (product.family === "gold") return 12;
  return Math.max(12, Math.min(product.maxTenureMonths, monthsToMaturity(age, product, occupation) || 12));
};

const fieldClass = (hasError?: string) =>
  `w-full rounded-xl border bg-(--surface-muted) px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-(--brand-teal) focus:ring-(--brand-teal-33)"
  }`;

const FieldLabel = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
    {children}
  </label>
);

const FieldError = ({ children }: { children?: string }) =>
  children ? <p className="mt-1 text-[11.5px] font-semibold text-red-500">{children}</p> : null;

const AmountField = ({
  id, label, value, onChange, hint, error, placeholder = "0",
}: {
  id: string; label: string; value: string; onChange: (next: string) => void;
  hint?: string; error?: string; placeholder?: string;
}) => (
  <div>
    <FieldLabel htmlFor={id}>{label}</FieldLabel>
    <div className={`flex items-center gap-1 rounded-xl border bg-(--surface-muted) px-3 py-2.5 transition focus-within:ring-2 ${
      error ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100" : "border-slate-200 focus-within:border-(--brand-teal) focus-within:ring-(--brand-teal-33)"
    }`}>
      <span aria-hidden="true" className="text-sm font-bold text-slate-400">₹</span>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        value={formatIndianNumber(value)}
        onChange={(event) => onChange(digitsOnly(event.target.value))}
        className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
      />
    </div>
    <FieldError>{error}</FieldError>
    {!error && hint && <p className="mt-1 text-[11px] leading-4 text-slate-400">{hint}</p>}
  </div>
);

const PlainField = ({
  id, label, value, onChange, inputMode = "text", placeholder, maxLength, error,
}: {
  id: string; label: string; value: string; onChange: (next: string) => void;
  inputMode?: "text" | "tel" | "email"; placeholder?: string; maxLength?: number; error?: string;
}) => (
  <div>
    <FieldLabel htmlFor={id}>{label}</FieldLabel>
    <input
      id={id}
      type="text"
      inputMode={inputMode}
      autoComplete="off"
      placeholder={placeholder}
      maxLength={maxLength}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={fieldClass(error)}
    />
    <FieldError>{error}</FieldError>
  </div>
);

const Card = ({ title, note, children }: { title: string; note: string; children: React.ReactNode }) => (
  <section className="rounded-2xl border border-(--border-subtle) bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:p-7">
    <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h2>
    <p className="mt-1 text-[12.5px] leading-5 text-slate-500">{note}</p>
    <div className="mt-5">{children}</div>
  </section>
);

interface FormState {
  product: string;
  occupation: string;
  dob: string;
  monthlyIncome: string;
  lapPropertyType: string;
  lapPropertyOther: string;
  lapCity: string;
  lapUsage: string;
  lapRent: string;
  lapExistingLoan: string;
  existingEmi: string;
  propertyValue: string;
  turnover: string;
  vehiclePrice: string;
  goldGrams: string;
  goldCarat: number;
  goldRate: string;
  stock: string;
  debtors: string;
  otherCurrentLiabilities: string;
  creditScore: string;
  shareValue: string;
  fullName: string;
  mobile: string;
  email: string;
  authorized: boolean;
}

const INITIAL_FORM: FormState = {
  product: "personal",
  occupation: "Salaried",
  dob: "",
  monthlyIncome: "",
  lapPropertyType: "Residential",
  lapPropertyOther: "",
  lapCity: "A",
  lapUsage: "Self-occupied",
  lapRent: "",
  lapExistingLoan: "",
  existingEmi: "",
  propertyValue: "",
  turnover: "",
  vehiclePrice: "",
  goldGrams: "",
  goldCarat: 22,
  goldRate: "",
  stock: "",
  debtors: "",
  otherCurrentLiabilities: "",
  creditScore: "",
  shareValue: "",
  fullName: "",
  mobile: "",
  email: "",
  authorized: false,
};

const EligibilityCalculatorPage = () => {
  useSEO({
    title: "Loan Eligibility Calculator — Check in 2 Minutes",
    description:
      "Check how much loan you may be eligible for. Free and instant estimate built on your income and obligations, the value of your gold, or your business turnover — no documents needed.",
    path: "/eligibility-calculator",
  });

  const { requestApply, gate } = useApplyGate();
  const setApplicantPrefill = useSetApplicantPrefill();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ outcome: EligibilityOutcome; product: ProductSpec } | null>(null);

  const product = productByKey(form.product);
  // Personal loans are only open to salaried applicants, whatever was picked earlier.
  const occupation =
    product.key === "personal"
      ? "Salaried"
      : product.key === "business" && form.occupation === "Salaried"
        ? "Self-Employed"
        : form.occupation;
  const occupationOptions: readonly string[] =
    product.key === "personal" ? [] : product.key === "business" ? BUSINESS_OCCUPATIONS : OCCUPATIONS;
  const isBusiness = BUSINESS_PRODUCTS.has(product.key);
  const isBusinessIncome = isBusiness || (PROFIT_INCOME_PRODUCTS.has(product.key) && occupation !== "Salaried");
  const age = ageOn(form.dob);
  const tenure = maxTenureFor(product, age, occupation);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => (previous[key] ? { ...previous, [key]: "" } : previous));
  };

  const changeProduct = (key: string) => {
    setForm((previous) => ({
      ...previous,
      product: key,
      occupation:
        key === "personal" ? "Salaried" : key === "business" && previous.occupation === "Salaried" ? "Self-Employed" : previous.occupation,
    }));
    setErrors({});
  };

  useEffect(() => {
    if (result) {
      requestAnimationFrame(() => {
        document.getElementById("eligibility-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [result]);

  const computeOutcome = (): EligibilityOutcome => {
    if (product.family === "gold") {
      return goldEligibility({
        product,
        grams: num(form.goldGrams),
        ratePerGram: num(form.goldRate),
        months: tenure,
        monthlyIncome: num(form.monthlyIncome),
        existingEmi: num(form.existingEmi),
        creditScore: num(form.creditScore),
      });
    }

    if (product.family === "wc") {
      return workingCapitalEligibility({
        product,
        turnover: num(form.turnover),
        stock: num(form.stock),
        debtors: num(form.debtors),
        otherCurrentLiabilities: num(form.otherCurrentLiabilities),
        creditScore: num(form.creditScore),
      });
    }

    if (product.family === "share") {
      return shareEligibility({
        product,
        marketValue: num(form.shareValue),
        monthlyIncome: num(form.monthlyIncome),
        existingEmi: num(form.existingEmi),
        months: tenure,
        creditScore: num(form.creditScore),
      });
    }

    const asset = product.asset;
    return termEligibility({
      product,
      monthlyIncome: num(form.monthlyIncome),
      existingEmi: num(form.existingEmi),
      age,
      occupation,
      tenureMonths: tenure,
      assetValue: asset ? num(form[asset.field]) : 0,
      assetType: product.key === "lap" ? lapAssetType : undefined,
      cityCategory: product.key === "lap" ? form.lapCity : undefined,
      existingLoanOnAsset: product.key === "lap" ? num(form.lapExistingLoan) : 0,
      rentalIncome: product.key === "lap" && form.lapUsage === "Rented out" ? num(form.lapRent) : 0,
      creditScore: num(form.creditScore),
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};

    if (product.family === "term") {
      if (num(form.monthlyIncome) <= 0) {
        next.monthlyIncome = isBusinessIncome ? "Enter your monthly net profit" : "Enter your monthly income";
      }
      if (product.asset && num(form[product.asset.field]) <= 0) {
        next[product.asset.field] = `Enter the ${product.asset.label.toLowerCase()}`;
      }
      if (product.key === "lap" && form.lapPropertyType === "Other" && !form.lapPropertyOther.trim()) {
        next.lapPropertyOther = "Name the property type";
      }
    }
    if (product.family === "gold") {
      if (num(form.goldGrams) <= 0) next.goldGrams = "Enter the gold weight in grams";
      if (num(form.goldRate) <= 0) next.goldRate = "Enter the rate per gram";
    }
    if (product.family === "wc" && num(form.turnover) <= 0) {
      next.turnover = "Enter your projected annual turnover";
    }
    const score = num(form.creditScore);
    if (!form.creditScore) next.creditScore = "Enter your credit score";
    else if (score < 300 || score > 900) next.creditScore = "Credit scores run from 300 to 900";
    if (product.family === "share" && num(form.shareValue) <= 0) {
      next.shareValue = "Enter the market value of the shares";
    }

    if (!form.dob) next.dob = "Enter your date of birth";
    else if (age < 0) next.dob = "Date of birth cannot be in the future";
    else if (age < 18) next.dob = "You must be at least 18 years old to apply for a loan";
    else if (age > 65) next.dob = "Applicants must be 65 years old or younger";

    if (form.fullName.trim().length < 2) next.fullName = "Enter your full name";
    if (!MOBILE_REGEX.test(form.mobile)) next.mobile = "Enter a valid 10-digit mobile number";
    if (!EMAIL_REGEX.test(form.email.trim())) next.email = "Enter a valid email address";
    if (!form.authorized) next.authorized = "Please accept the terms to continue";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setResult({ outcome: computeOutcome(), product });
  };

  const startApplication = () => {
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
    requestApply(product.key);
  };

  const editDetails = () => {
    setResult(null);
    requestAnimationFrame(() => {
      document.getElementById("eligibility-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const asset = product.asset;
  // "Other" lets the applicant name the property type; the model then uses the safest cap.
  const lapAssetType =
    form.lapPropertyType === "Other" ? form.lapPropertyOther.trim() || "Other" : form.lapPropertyType;
  const assetLtv = asset ? assetLtvFor(asset, num(form[asset.field]), lapAssetType, form.lapCity) : 0;

  const incomeNoun =
    result &&
    (BUSINESS_PRODUCTS.has(result.product.key) ||
      (PROFIT_INCOME_PRODUCTS.has(result.product.key) && occupation !== "Salaried"))
      ? "monthly net profit"
      : "monthly income";

  const basedOn = result
    ? result.product.family === "gold"
      ? `Based on ${form.goldGrams} g of ${form.goldCarat}K gold at ${formatINRRounded(num(form.goldRate))} per gram.`
      : result.product.family === "wc"
        ? `Based on ${formatINRRounded(num(form.turnover))} of projected annual turnover.`
        : result.product.family === "share"
          ? `Based on shares worth ${formatINRRounded(num(form.shareValue))} pledged as security.`
            : result.outcome.credit
              ? `Based on ${formatINRRounded(num(form.monthlyIncome))} ${incomeNoun}, ${formatINRRounded(num(form.existingEmi))} of EMIs and a credit score of ${result.outcome.credit.score}.`
              : `Based on ${formatINRRounded(num(form.monthlyIncome))} ${incomeNoun} and ${formatINRRounded(num(form.existingEmi))} of existing EMIs.`
    : "";

  const stats = result
    ? result.product.family === "wc"
      ? [
          { label: "You can draw today", value: formatINRRounded(result.outcome.workCapital?.usable ?? 0) },
          { label: "Interest at full draw", value: `${formatINRRounded(result.outcome.monthly)} / month` },
          { label: "Rate", value: `${result.outcome.roi}% p.a.` },
        ]
      : result.product.family === "gold"
        ? [
            { label: "Monthly EMI", value: formatINRRounded(result.outcome.monthly) },
            { label: "Gold value", value: compact(result.outcome.gold?.value ?? 0) },
            { label: "Tenure", value: tenureText(result.outcome.months) },
          ]
        : [
            { label: "Monthly EMI", value: formatINRRounded(result.outcome.monthly) },
            { label: "Interest rate", value: `${result.outcome.roi}% p.a.` },
            { label: "Tenure", value: tenureText(result.outcome.months) },
          ]
    : [];

  return (
    <div className="min-h-screen bg-(--surface-muted)">
      <PageBanner
        breadcrumb="Loan Eligibility"
        title="How Much Can You"
        highlight="Borrow?"
        tagline="Answer a few questions and get an instant estimate. No documents, no waiting."
      />

      <Container>
        <div className="mx-auto max-w-3xl py-8 md:py-10">

          {result ? (
            /* ── Result — only shown after the form is submitted ─────────── */
            <div id="eligibility-result" className="scroll-mt-28 space-y-4">
              <div className="overflow-hidden rounded-2xl border border-(--border-subtle) bg-white shadow-[0_12px_32px_-24px_rgba(6,106,156,0.5)]">
                <div
                  className="px-6 py-7 text-white"
                  style={{
                    background: result.outcome.eligible
                      ? "linear-gradient(135deg,#044e74 0%,#066a9c 58%,#0f7f7a 100%)"
                      : "linear-gradient(135deg,#7c2d12 0%,#b45309 100%)",
                  }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                    {result.outcome.eligible ? result.outcome.headlineLabel : "Your estimate"}
                  </p>
                  {result.outcome.eligible ? (
                    <p className="mt-2 text-[40px] font-bold leading-none" style={SERIF}>
                      {compact(result.outcome.headline)}
                    </p>
                  ) : (
                    <p className="mt-2 text-[26px] font-bold leading-tight">We can't estimate an amount yet</p>
                  )}
                  <p className="mt-2 text-[13px] text-white/80">
                    {result.outcome.eligible
                      ? result.product.family === "wc"
                        ? `${result.outcome.roi}% p.a. · reviewed every year`
                        : `${result.outcome.roi}% p.a. · ${tenureText(result.outcome.months)}`
                      : "Adjust a detail or two and check again."}
                  </p>
                </div>

                <div className="p-6 md:p-7">
                  {result.outcome.eligible && (
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                      {stats.map((stat) => (
                        <div key={stat.label} className="rounded-xl bg-(--surface-muted) px-4 py-3">
                          <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400">{stat.label}</p>
                          <p className="mt-1 text-[15px] font-bold text-slate-900">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className={`text-sm leading-6 text-slate-600 ${result.outcome.eligible ? "mt-5" : ""}`}>
                    {result.outcome.message}
                  </p>

                  {result.outcome.suggestions.length > 0 && (
                    <ul className="mt-3 space-y-1.5 rounded-xl bg-amber-50 p-4 text-[13px] leading-5 text-amber-900">
                      {result.outcome.suggestions.map((suggestion) => (
                        <li key={suggestion} className="flex gap-2">
                          <span aria-hidden="true">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="mt-3 text-[12px] text-slate-400">{basedOn}</p>

                  <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                    {result.outcome.eligible && (
                      <button
                        type="button"
                        onClick={startApplication}
                        className="flex-1 cursor-pointer rounded-xl bg-(--brand-navy) px-5 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-(--brand-navy-deep) active:translate-y-0"
                      >
                        Apply for {result.product.label} →
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={editDetails}
                      className="flex-1 cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-600 transition-colors hover:border-(--brand-teal-33) hover:text-(--brand-navy)"
                    >
                      {result.outcome.eligible ? "Change details" : "Try again"}
                    </button>
                  </div>

                  {result.outcome.eligible && (
                    <p className="mt-4 text-[11px] leading-5 text-slate-400">
                      This is an indicative estimate, not a sanction. Final terms depend on the lender's credit policy,
                      credit bureau report and document verification.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ── Form ─────────────────────────────────────────────────────── */
            <form id="eligibility-form" onSubmit={handleSubmit} noValidate className="scroll-mt-28 space-y-4">

              <Card title="Loan details" note="Pick the product and tell us the numbers behind it.">
                <div className="space-y-5">
                  <div>
                    <FieldLabel htmlFor="elig-product">Loan product</FieldLabel>
                    <select
                      id="elig-product"
                      value={form.product}
                      onChange={(event) => changeProduct(event.target.value)}
                      className="w-full cursor-pointer rounded-xl border border-slate-200 bg-(--surface-muted) px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-(--brand-teal) focus:ring-2 focus:ring-(--brand-teal-33)"
                    >
                      {PRODUCTS.map((entry) => (
                        <option key={entry.key} value={entry.key}>{entry.label}</option>
                      ))}
                    </select>
                  </div>

                  {product.family === "term" && (
                    <div className="space-y-5">
                      {occupationOptions.length > 0 && (
                        <div>
                          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Occupation</p>
                          <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1">
                            {occupationOptions.map((option) => {
                              const active = option === occupation;
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => set("occupation", option)}
                                  aria-pressed={active}
                                  className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-[12px] font-bold transition-all ${
                                    active ? "bg-white text-(--brand-navy) shadow-sm" : "text-slate-500 hover:text-slate-700"
                                  }`}
                                >
                                  {option}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="grid gap-4 sm:grid-cols-2">
                        <AmountField
                          id="elig-income"
                          label={isBusinessIncome ? "Monthly net profit" : "Monthly income"}
                          value={form.monthlyIncome}
                          onChange={(next) => set("monthlyIncome", next)}
                          error={errors.monthlyIncome}
                          placeholder="e.g. 75,000"
                          hint={isBusinessIncome ? "Profit after business expenses, from your P&L" : "Take-home after deductions"}
                        />
                        <AmountField
                          id="elig-emi"
                          label="EMIs you already pay"
                          value={form.existingEmi}
                          onChange={(next) => set("existingEmi", next)}
                          hint="Leave blank if none"
                        />
                      </div>

                      {asset && (
                        <AmountField
                          id={`elig-${asset.field}`}
                          label={asset.label}
                          value={form[asset.field]}
                          onChange={(next) => set(asset.field, next)}
                          error={errors[asset.field]}
                          hint={
                            asset.ltvSlabs && form[asset.field]
                              ? `Up to ${Math.round(assetLtv * 100)}% for this property value`
                              : asset.ltvByType
                                ? `Up to ${Math.round(assetLtv * 100)}% for a ${lapAssetType.toLowerCase()} property in a category ${form.lapCity} city`
                                : asset.hint
                          }
                        />
                      )}

                      {product.key === "lap" && (
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                          <div>
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Property type</p>
                            <div className="flex flex-wrap gap-1.5 rounded-xl bg-white p-1 ring-1 ring-slate-200">
                              {LAP_PROPERTY_TYPES.map((option) => {
                                const active = option === form.lapPropertyType;
                                return (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() => set("lapPropertyType", option)}
                                    aria-pressed={active}
                                    className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-[12px] font-bold transition-all ${
                                      active ? "bg-(--brand-navy) text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    }`}
                                  >
                                    {option}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {form.lapPropertyType === "Other" && (
                            <PlainField
                              id="elig-lap-property-other"
                              label="Property type"
                              value={form.lapPropertyOther}
                              onChange={(next) => set("lapPropertyOther", next)}
                              placeholder="e.g. Agricultural land, warehouse"
                              error={errors.lapPropertyOther}
                            />
                          )}

                          <div>
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">City category</p>
                            <div className="flex flex-wrap gap-1.5 rounded-xl bg-white p-1 ring-1 ring-slate-200">
                              {LAP_CITIES.map((option) => {
                                const active = option.value === form.lapCity;
                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => set("lapCity", option.value)}
                                    aria-pressed={active}
                                    className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-[12px] font-bold transition-all ${
                                      active ? "bg-(--brand-navy) text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    }`}
                                  >
                                    {option.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Property usage</p>
                            <div className="flex flex-wrap gap-1.5 rounded-xl bg-white p-1 ring-1 ring-slate-200">
                              {LAP_USAGES.map((option) => {
                                const active = option === form.lapUsage;
                                return (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() => set("lapUsage", option)}
                                    aria-pressed={active}
                                    className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-[12px] font-bold transition-all ${
                                      active ? "bg-(--brand-navy) text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    }`}
                                  >
                                    {option}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {form.lapUsage === "Rented out" && (
                            <AmountField
                              id="elig-lap-rent"
                              label="Monthly rent received"
                              value={form.lapRent}
                              onChange={(next) => set("lapRent", next)}
                              placeholder="e.g. 25,000"
                              hint="Lenders count about 75% of the rent as income"
                            />
                          )}

                          <AmountField
                            id="elig-lap-existing-loan"
                            label="Existing loan on this property (optional)"
                            value={form.lapExistingLoan}
                            onChange={(next) => set("lapExistingLoan", next)}
                            hint="Outstanding balance, netted off the amount you can borrow"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {product.family === "gold" && (
                    <div className="space-y-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <FieldLabel htmlFor="elig-gold-weight">Gold weight (grams)</FieldLabel>
                          <input
                            id="elig-gold-weight"
                            type="number"
                            min={1}
                            step={1}
                            value={form.goldGrams}
                            onChange={(event) => set("goldGrams", event.target.value)}
                            className={fieldClass(errors.goldGrams)}
                          />
                          <FieldError>{errors.goldGrams}</FieldError>
                          {!errors.goldGrams && (
                            <p className="mt-1 text-[11px] leading-4 text-slate-400">Net weight, without stones or thread.</p>
                          )}
                        </div>

                        <AmountField
                          id="elig-gold-rate"
                          label={`Gold rate per gram (${form.goldCarat}K)`}
                          value={form.goldRate}
                          onChange={(next) => set("goldRate", next)}
                          error={errors.goldRate}
                          hint="Today's rate for the purity you selected"
                        />
                      </div>

                      <div>
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Gold purity</p>
                        <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1">
                          {CARATS.map((carat) => {
                            const active = carat === form.goldCarat;
                            return (
                              <button
                                key={carat}
                                type="button"
                                onClick={() => set("goldCarat", carat)}
                                aria-pressed={active}
                                className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-[12px] font-bold transition-all ${
                                  active ? "bg-white text-(--brand-navy) shadow-sm" : "text-slate-500 hover:text-slate-700"
                                }`}
                              >
                                {carat}K
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <AmountField
                          id="elig-gold-income"
                          label="Monthly income (optional)"
                          value={form.monthlyIncome}
                          onChange={(next) => set("monthlyIncome", next)}
                          hint="Helps us check you can repay comfortably"
                        />
                        <AmountField
                          id="elig-gold-emi"
                          label="EMIs you already pay"
                          value={form.existingEmi}
                          onChange={(next) => set("existingEmi", next)}
                          hint="Leave blank if none"
                        />
                      </div>
                    </div>
                  )}

                  {product.family === "wc" && (
                    <div className="space-y-4">
                      <AmountField
                        id="elig-wc-turnover"
                        label="Annual business turnover"
                        value={form.turnover}
                        onChange={(next) => set("turnover", next)}
                        error={errors.turnover}
                        hint="What you expect over the next 12 months"
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AmountField
                          id="elig-wc-stock"
                          label="Stock / inventory"
                          value={form.stock}
                          onChange={(next) => set("stock", next)}
                          hint="Paid stock at cost"
                        />
                        <AmountField
                          id="elig-wc-debtors"
                          label="Payments due from customers"
                          value={form.debtors}
                          onChange={(next) => set("debtors", next)}
                          hint="Within the last 90 days"
                        />
                      </div>
                      <AmountField
                        id="elig-wc-ocl"
                        label="Other short-term dues"
                        value={form.otherCurrentLiabilities}
                        onChange={(next) => set("otherCurrentLiabilities", next)}
                        hint="Excluding bank loans"
                      />
                    </div>
                  )}

                  {product.family === "share" && (
                    <div className="space-y-5">
                      <AmountField
                        id="elig-share-value"
                        label="Market value of shares"
                        value={form.shareValue}
                        onChange={(next) => set("shareValue", next)}
                        error={errors.shareValue}
                        hint="Closing value of the approved shares you will pledge"
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AmountField
                          id="elig-share-income"
                          label="Monthly income (optional)"
                          value={form.monthlyIncome}
                          onChange={(next) => set("monthlyIncome", next)}
                          hint="Caps the loan at what you can repay"
                        />
                        <AmountField
                          id="elig-share-emi"
                          label="EMIs you already pay"
                          value={form.existingEmi}
                          onChange={(next) => set("existingEmi", next)}
                          hint="Leave blank if none"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <FieldLabel htmlFor="elig-credit">Credit score (CIBIL)</FieldLabel>
                    <input
                      id="elig-credit"
                      type="text"
                      inputMode="numeric"
                      maxLength={3}
                      autoComplete="off"
                      placeholder="e.g. 760"
                      value={form.creditScore}
                      onChange={(event) => set("creditScore", event.target.value.replace(/\D/g, ""))}
                      className={fieldClass(errors.creditScore)}
                    />
                    <FieldError>{errors.creditScore}</FieldError>
                    {!errors.creditScore && (
                      <p className="mt-1 text-[11px] leading-4 text-slate-400">
                        300 to 900. The bureau score sets how much of your income can go to EMIs.
                      </p>
                    )}
                    <Link
                      to="/know-your-score"
                      className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-semibold text-(--brand-navy) underline underline-offset-2 hover:text-(--brand-teal)"
                    >
                      Don't know your score? Check your credit score →
                    </Link>
                  </div>

                  <div>
                    <FieldLabel htmlFor="elig-dob">Date of birth</FieldLabel>
                    <DateOfBirthPicker
                      id="elig-dob"
                      value={form.dob}
                      onChange={(next) => set("dob", next)}
                      err={errors.dob}
                      minAge={18}
                      maxAge={65}
                    />
                    {!errors.dob && (
                      <p className="mt-1 text-[11px] leading-4 text-slate-400">
                        {age >= 0 ? `You are ${age} years old. ` : ""}
                        Repayment must end by age {maturityAgeFor(product, occupation)}.
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              <Card title="Your details" note="We use these only to get back to you about this estimate.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <PlainField
                      id="elig-name"
                      label="Full name"
                      value={form.fullName}
                      onChange={(next) => set("fullName", next)}
                      placeholder="As per your PAN card"
                      error={errors.fullName}
                    />
                  </div>
                  <PlainField
                    id="elig-mobile"
                    label="Mobile number"
                    value={form.mobile}
                    onChange={(next) => set("mobile", next.replace(/\D/g, ""))}
                    inputMode="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    error={errors.mobile}
                  />
                  <PlainField
                    id="elig-email"
                    label="Email address"
                    value={form.email}
                    onChange={(next) => set("email", next)}
                    inputMode="email"
                    placeholder="you@example.com"
                    error={errors.email}
                  />
                  <div className="sm:col-span-2">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={form.authorized}
                        onChange={(event) => set("authorized", event.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ accentColor: "var(--brand-navy)" }}
                      />
                      <span className="text-[12px] leading-5 text-slate-500">
                        I authorise the website and its partner providers to call or SMS me about this application, and agree
                        to the{" "}
                        <Link to="/terms-of-use" className="font-semibold text-(--brand-navy) underline">
                          Terms of Use
                        </Link>.
                      </span>
                    </label>
                    <FieldError>{errors.authorized}</FieldError>
                  </div>
                </div>
              </Card>

              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-xl bg-(--brand-navy) px-6 py-4 text-sm font-bold text-white shadow-[0_12px_28px_-16px_rgba(6,106,156,0.9)] transition-all hover:-translate-y-0.5 hover:bg-(--brand-navy-deep) active:translate-y-0"
                >
                  Check my eligibility
                </button>
                <p className="mt-3 text-center text-[11.5px] text-slate-400">
                  Free and instant. No documents needed for this estimate.
                </p>
              </div>
            </form>
          )}
        </div>
      </Container>

      {gate}
    </div>
  );
};

export default EligibilityCalculatorPage;
