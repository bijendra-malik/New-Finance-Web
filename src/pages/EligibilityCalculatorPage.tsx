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
  COMMERCIAL_LTV,
  EDUCATION_FOIR_CAP,
  VEHICLE_FOIR,
  VEHICLE_LTV,
  DSCR_MIN,
  assetLtvFor,
  commercialEligibility,
  educationEligibility,
  goldEligibility,
  lrdEligibility,
  maturityAgeFor,
  monthsToMaturity,
  productByKey,
  projectEligibility,
  LRD_LTV_MAX,
  LRD_LTV_MIN,
  LRD_ROI,
  LRD_TENURE_YEARS,
  shareEligibility,
  termEligibility,
  tenureText,
  turnoverEligibility,
  workingCapitalEligibility,
  type EligibilityOutcome,
  type ProductSpec,
} from "./eligibilityModels";

const SERIF = { fontFamily: "var(--font-serif)" } as const;

const OCCUPATIONS = ["Salaried", "Self-Employed", "Business Owner"] as const;
const BUSINESS_OCCUPATIONS = ["Self-Employed", "Business Owner"] as const;
const INCOME_COPY: Record<string, { label: string; hint: string }> = {
  Salaried: { label: "Monthly income", hint: "Take-home after deductions" },
  "Self-Employed": { label: "Monthly net profit", hint: "Profit after business expenses, from your P&L" },
  "Business Owner": { label: "Monthly net profit", hint: "Profit after business expenses, from your P&L" },
};
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
  id, label, value, onChange, inputMode = "text", placeholder, maxLength, error, hint,
}: {
  id: string; label: string; value: string; onChange: (next: string) => void;
  inputMode?: "text" | "tel" | "email"; placeholder?: string; maxLength?: number; error?: string; hint?: string;
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
    {!error && hint && <p className="mt-1 text-[11px] leading-4 text-slate-400">{hint}</p>}
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
  lrdRent: string;
  lrdLeaseYears: string;
  lrdPropertyValue: string;
  lrdLtv: string;
  vehicleDownPayment: string;
  eduFees: string;
  eduHostel: string;
  eduOther: string;
  eduScholarship: string;
  eduMargin: string;
  projectCost: string;
  projectContribution: string;
  projectCashFlow: string;
  commercialRent: string;
  wcAssessment: string;
  wcMargin: string;
  existingEmi: string;
  propertyValue: string;
  turnover: string;
  vehiclePrice: string;
  vehicleFoir: string;
  vehicleLtv: string;
  commercialCoApplicant: string;
  commercialFoir: string;
  commercialLtv: string;
  projectDscr: string;
  wcCurrentAssets: string;
  wcCurrentLiabilities: string;
  odMode: "turnover" | "drawingPower";
  odMargin: string;
  wcMethod: "turnover" | "drawingPower";
  lrdDeduction: string;
  lrdCoverage: string;
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
  lrdRent: "",
  lrdLeaseYears: "",
  lrdPropertyValue: "",
  lrdLtv: "",
  vehicleDownPayment: "",
  vehicleFoir: String(VEHICLE_FOIR * 100),
  vehicleLtv: String(VEHICLE_LTV * 100),
  commercialCoApplicant: "",
  commercialFoir: "70",
  commercialLtv: "70",
  projectDscr: "1.25",
  wcCurrentAssets: "",
  wcCurrentLiabilities: "",
  odMode: "turnover",
  odMargin: "",
  wcMethod: "turnover",
  lrdDeduction: "10",
  lrdCoverage: "70",
  eduFees: "",
  eduHostel: "",
  eduOther: "",
  eduScholarship: "",
  eduMargin: "",
  projectCost: "",
  projectContribution: "",
  projectCashFlow: "",
  commercialRent: "",
  wcAssessment: "18.75",
  wcMargin: "",
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
  const occupation =
    product.key === "personal"
      ? "Salaried"
      : product.key === "business" && form.occupation === "Salaried"
        ? "Self-Employed"
        : form.occupation;
  const occupationOptions: readonly string[] =
    product.key === "personal" || product.family === "lrd"
      ? []
      : product.key === "business"
        ? BUSINESS_OCCUPATIONS
        : OCCUPATIONS;
  const incomeCopy = INCOME_COPY[occupation] ?? INCOME_COPY.Salaried;
  const incomeLabel = incomeCopy.label;
  const incomeHint = incomeCopy.hint;
  const incomeError = `Enter your ${incomeLabel.toLowerCase()}`;
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

  const lrdInput = {
    product,
    roi: LRD_ROI,
    monthlyRent: num(form.lrdRent),
    leaseMonths: Math.round(num(form.lrdLeaseYears) * 12),
    propertyValue: num(form.lrdPropertyValue),
    repaymentMonths: LRD_TENURE_YEARS * 12,
    ltvPercent: num(form.lrdLtv),
    deductionPct: num(form.lrdDeduction),
    coveragePct: num(form.lrdCoverage),
    creditScore: num(form.creditScore),
  };
  const lrdReady =
    lrdInput.monthlyRent > 0 &&
    lrdInput.leaseMonths > 0 &&
    lrdInput.propertyValue > 0 &&
    lrdInput.ltvPercent >= LRD_LTV_MIN * 100 &&
    lrdInput.ltvPercent <= LRD_LTV_MAX * 100 &&
    lrdInput.creditScore >= 300 &&
    lrdInput.creditScore <= 900;
  // LRD revalues the rent as the applicant types, so the estimate is live before submit.
  const lrdLive = product.family === "lrd" && lrdReady ? lrdEligibility(lrdInput) : null;

  const computeOutcome = (): EligibilityOutcome => {
    if (product.family === "lrd") {
      return lrdEligibility(lrdInput);
    }

    if (product.family === "education") {
      return educationEligibility({
        product,
        months: tenure,
        courseFees: num(form.eduFees),
        hostelCost: num(form.eduHostel),
        otherCost: num(form.eduOther),
        scholarships: num(form.eduScholarship),
        marginMoney: num(form.eduMargin),
        coApplicantIncome: num(form.monthlyIncome),
        existingEmi: num(form.existingEmi),
        creditScore: num(form.creditScore),
      });
    }

    if (product.family === "project") {
      return projectEligibility({
        product,
        months: tenure,
        projectCost: num(form.projectCost),
        promoterContribution: num(form.projectContribution),
        monthlyCashFlow: num(form.projectCashFlow),
        dscr: num(form.projectDscr),
        creditScore: num(form.creditScore),
      });
    }

    if (product.family === "commercial") {
      return commercialEligibility({
        product,
        months: tenure,
        propertyValue: num(form.propertyValue),
        monthlyRent: num(form.commercialRent),
        monthlyIncome: num(form.monthlyIncome),
        existingEmi: num(form.existingEmi),
        coApplicantIncome: num(form.commercialCoApplicant),
        foirPct: num(form.commercialFoir),
        ltvPct: num(form.commercialLtv),
        creditScore: num(form.creditScore),
      });
    }

    if (product.family === "turnover") {
      return turnoverEligibility({
        product,
        turnover: num(form.turnover),
        assessmentPct: num(form.wcAssessment),
        margin: num(form.wcMargin),
        currentAssets: num(form.wcCurrentAssets),
        currentLiabilities: num(form.wcCurrentLiabilities),
        mode: form.wcMethod,
        creditScore: num(form.creditScore),
      });
    }

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
        margin: num(form.odMargin),
        mode: form.odMode,
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
      downPayment: num(form.vehicleDownPayment),
      foirPct: num(form.vehicleFoir),
      ltvPct: num(form.vehicleLtv),
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
        next.monthlyIncome = incomeError;
      }
      if (product.asset && num(form[product.asset.field]) <= 0) {
        next[product.asset.field] = `Enter the ${product.asset.label.toLowerCase()}`;
      }
      if (product.key === "lap" && form.lapPropertyType === "Other" && !form.lapPropertyOther.trim()) {
        next.lapPropertyOther = "Name the property type";
      }
    }
    if (product.family === "lrd") {
      const leaseYears = num(form.lrdLeaseYears);
      const ltv = num(form.lrdLtv);
      if (num(form.lrdRent) <= 0) next.lrdRent = "Enter the monthly rent your tenant pays";
      if (leaseYears <= 0) next.lrdLeaseYears = "Enter the lease left to run in years";
      if (num(form.lrdPropertyValue) <= 0) next.lrdPropertyValue = "Enter the property's market value";
      if (ltv <= 0) next.lrdLtv = "Enter the assumed LTV";
      else if (ltv < LRD_LTV_MIN * 100 || ltv > LRD_LTV_MAX * 100) {
        next.lrdLtv = `Lenders fund ${LRD_LTV_MIN * 100}% to ${LRD_LTV_MAX * 100}% of the discounted rent`;
      }
    }
    if (product.family === "education" && num(form.eduFees) <= 0) {
      next.eduFees = "Enter the course fees";
    }
    if (product.family === "project") {
      if (num(form.projectCost) <= 0) next.projectCost = "Enter the total project cost";
      else if (num(form.projectContribution) >= num(form.projectCost)) {
        next.projectContribution = "Promoter contribution must be less than the project cost";
      }
    }
    if (product.family === "commercial" && num(form.propertyValue) <= 0) {
      next.propertyValue = "Enter the commercial property's market value";
    }
    if (product.family === "turnover") {
      if (num(form.turnover) <= 0) next.turnover = "Enter your projected annual turnover";
      const pct = num(form.wcAssessment);
      if (form.wcAssessment && (pct <= 0 || pct > 100)) {
        next.wcAssessment = "Assessment must be between 1% and 100% of turnover";
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
  const lapAssetType =
    form.lapPropertyType === "Other" ? form.lapPropertyOther.trim() || "Other" : form.lapPropertyType;
  const assetLtv = asset ? assetLtvFor(asset, num(form[asset.field]), lapAssetType, form.lapCity) : 0;

  const incomeNoun = incomeLabel.toLowerCase();

  const basedOn = result
    ? result.product.family === "education"
      ? `Based on ${formatINRRounded(num(form.eduFees) + num(form.eduHostel) + num(form.eduOther))} of course cost, less ${formatINRRounded(num(form.eduScholarship) + num(form.eduMargin))} of scholarships and margin${num(form.monthlyIncome) > 0 ? `, and a co-applicant income of ${formatINRRounded(num(form.monthlyIncome))}` : ""}.`
      : result.product.family === "project"
        ? `Based on a ${formatINRRounded(num(form.projectCost))} project with ${formatINRRounded(num(form.projectContribution))} from the promoters.`
        : result.product.family === "commercial"
          ? `Based on a commercial property valued at ${formatINRRounded(num(form.propertyValue))}${num(form.commercialRent) > 0 ? ` let for ${formatINRRounded(num(form.commercialRent))} a month` : ""}.`
          : result.product.family === "turnover"
            ? `Based on ${formatINRRounded(num(form.turnover))} of projected annual turnover and a ${num(form.wcAssessment) || 18.75}% assessment.`
    : result.product.family === "gold"
      ? `Based on ${form.goldGrams} g of ${form.goldCarat}K gold at ${formatINRRounded(num(form.goldRate))} per gram.`
      : result.product.family === "wc"
        ? `Based on ${formatINRRounded(num(form.turnover))} of projected annual turnover.`
        : result.product.family === "lrd"
          ? `Based on ${formatINRRounded(num(form.lrdRent))} of monthly rent, ${form.lrdLeaseYears} years of lease left and a property valued at ${formatINRRounded(num(form.lrdPropertyValue))}.`
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
      : result.product.family === "education"
        ? [
            { label: "Course cost", value: formatINRRounded(num(form.eduFees) + num(form.eduHostel) + num(form.eduOther)) },
            { label: "Scholarships", value: formatINRRounded(num(form.eduScholarship)) },
            ...(result.outcome.caps.some((cap) => cap.key === "foir")
              ? [{
                  label: `Capacity at ${EDUCATION_FOIR_CAP * 100}% FOIR`,
                  value: formatINRRounded(result.outcome.caps.find((cap) => cap.key === "foir")?.value ?? 0),
                }]
              : []),
            { label: "Repayment tenure", value: tenureText(result.outcome.months) },
          ]
        : result.product.family === "project"
          ? [
              { label: "Project cost", value: formatINRRounded(num(form.projectCost)) },
              { label: "Promoter contribution", value: formatINRRounded(num(form.projectContribution)) },
              { label: "Repayment tenure", value: tenureText(result.outcome.months) },
            ]
          : result.product.family === "commercial"
            ? [
                { label: "Property-based limit", value: formatINRRounded(num(form.propertyValue) * ((num(form.commercialLtv) || COMMERCIAL_LTV * 100) / 100)) },
                { label: "Monthly rent", value: formatINRRounded(num(form.commercialRent)) },
                { label: "Tenure", value: tenureText(result.outcome.months) },
              ]
            : result.product.family === "turnover"
              ? [
                  { label: "Working capital requirement", value: formatINRRounded(num(form.turnover) * ((num(form.wcAssessment) || 18.75) / 100)) },
                  { label: "Borrower's margin", value: formatINRRounded(num(form.wcMargin)) },
                  { label: "Rate", value: `${result.outcome.roi}% p.a.` },
                ]
              : result.product.family === "lrd"
          ? [
              { label: "Monthly rental income", value: formatINRRounded(result.outcome.lease?.rent ?? 0) },
              { label: "Annual rental income", value: formatINRRounded(result.outcome.lease?.annualRent ?? 0) },
              { label: "Property-based limit", value: formatINRRounded(result.outcome.lease?.propertyLimit ?? 0) },
              { label: "Rental-based limit", value: formatINRRounded(result.outcome.lease?.rentalLimit ?? 0) },
              { label: "Applicable LTV", value: `${Math.round((result.outcome.lease?.ltv ?? 0) * 100)}%` },
              { label: "Remaining lease", value: tenureText(result.outcome.lease?.leaseMonths ?? 0) },
              { label: "Monthly EMI", value: formatINRRounded(result.outcome.monthly) },
            ]
        : result.product.family === "gold"
          ? [
              { label: "Monthly EMI", value: formatINRRounded(result.outcome.monthly) },
              { label: "Gold value", value: formatINRRounded(result.outcome.gold?.value ?? 0) },
              { label: "Tenure", value: tenureText(result.outcome.months) },
            ]
        : result.product.key === "vehicleLoan"
          ? [
              { label: "Repayment capacity", value: formatINRRounded(result.outcome.caps.find((cap) => cap.key === "foir")?.value ?? 0) },
              { label: "Vehicle funding limit", value: formatINRRounded(result.outcome.caps.find((cap) => cap.key === "asset")?.value ?? 0) },
              { label: "Monthly EMI", value: formatINRRounded(result.outcome.monthly) },
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
                    <p className="mt-2 text-[32px] font-bold leading-none tabular-nums sm:text-[40px]" style={SERIF}>
                      {formatINRRounded(result.outcome.headline)}
                    </p>
                  ) : (
                    <p className="mt-2 text-[26px] font-bold leading-tight">We can't estimate an amount yet</p>
                  )}
                  <p className="mt-2 text-[13px] text-white/80">
                    {result.outcome.eligible
                      ? result.product.family === "wc" || result.product.family === "turnover"
                        ? `${result.outcome.roi}% p.a. · reviewed every year`
                        : `${result.outcome.roi}% p.a. · ${tenureText(result.outcome.months)}`
                      : "Adjust a detail or two and check again."}
                  </p>
                </div>

                <div className="p-6 md:p-7">
                  {result.outcome.eligible && (
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {stats.map((stat) => (
                        <div key={stat.label} className="min-w-0 rounded-xl bg-(--surface-muted) px-3.5 py-3">
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

                  {result.product.family === "lrd" && (
                    <p className="mt-3 text-[11px] leading-5 text-slate-400">
                      Loan eligibility shown is indicative and subject to property valuation, tenant profile, lease
                      documentation, lender policies, credit assessment and final approval. Actual loan amount may vary.
                    </p>
                  )}

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
                          <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-slate-100 p-1 sm:flex sm:flex-wrap [&>*:last-child:nth-child(odd)]:col-span-2">
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
                          label={incomeLabel}
                          value={form.monthlyIncome}
                          onChange={(next) => set("monthlyIncome", next)}
                          error={errors.monthlyIncome}
                          placeholder="e.g. 75,000"
                          hint={incomeHint}
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
                            <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-white p-1 ring-1 ring-slate-200 sm:flex sm:flex-wrap [&>*:last-child:nth-child(odd)]:col-span-2">
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
                            <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-white p-1 ring-1 ring-slate-200 sm:flex sm:flex-wrap [&>*:last-child:nth-child(odd)]:col-span-2">
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
                            <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-white p-1 ring-1 ring-slate-200 sm:flex sm:flex-wrap [&>*:last-child:nth-child(odd)]:col-span-2">
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

                      <div>
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Assessment method</p>
                        <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1">
                          {([
                            ["turnover", "Turnover method"],
                            ["drawingPower", "Drawing power"],
                          ] as const).map(([value, label]) => {
                            const active = form.odMode === value;
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => set("odMode", value)}
                                aria-pressed={active}
                                className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-[12px] font-bold transition-all ${
                                  active ? "bg-white text-(--brand-navy) shadow-sm" : "text-slate-500 hover:text-slate-700"
                                }`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                        <p className="mt-2 text-[11.5px] leading-4 text-slate-500">
                          {form.odMode === "turnover"
                            ? "25% of turnover is the requirement and the bank funds 75% of it — 18.75% of turnover."
                            : "Stock and receivables less the bank's margin and deductions, capped by the turnover norm."}
                        </p>
                      </div>

                      {form.odMode === "drawingPower" && (
                        <AmountField
                          id="elig-od-margin"
                          label="Borrower's margin"
                          value={form.odMargin}
                          onChange={(next) => set("odMargin", next)}
                          hint="Deducted from drawing power; your own contribution"
                        />
                      )}
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

                  {product.key === "vehicleLoan" && (
                    <div className="space-y-5">
                      <AmountField
                        id="elig-vehicle-down"
                        label="Down payment"
                        value={form.vehicleDownPayment}
                        onChange={(next) => set("vehicleDownPayment", next)}
                        hint="Paid upfront; the loan cannot exceed the on-road price less this amount"
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <PlainField
                          id="elig-vehicle-foir"
                          label="FOIR (%)"
                          value={form.vehicleFoir}
                          onChange={(next) => set("vehicleFoir", next.replace(/[^\d.]/g, ""))}
                          inputMode="tel"
                          maxLength={4}
                          hint="Share of income lenders allow for all EMIs; 50% is typical"
                        />
                        <PlainField
                          id="elig-vehicle-ltv"
                          label="LTV (%)"
                          value={form.vehicleLtv}
                          onChange={(next) => set("vehicleLtv", next.replace(/[^\d.]/g, ""))}
                          inputMode="tel"
                          maxLength={3}
                          hint="Share of the on-road price lenders fund; 90% is typical"
                        />
                      </div>
                    </div>
                  )}

                  {product.family === "education" && (
                    <div className="space-y-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AmountField
                          id="elig-edu-fees"
                          label="Course fees"
                          value={form.eduFees}
                          onChange={(next) => set("eduFees", next)}
                          error={errors.eduFees}
                          placeholder="e.g. 8,00,000"
                          hint="Tuition for the full programme"
                        />
                        <AmountField
                          id="elig-edu-hostel"
                          label="Hostel and living costs"
                          value={form.eduHostel}
                          onChange={(next) => set("eduHostel", next)}
                          hint="For the duration of the course"
                        />
                        <AmountField
                          id="elig-edu-other"
                          label="Other eligible expenses"
                          value={form.eduOther}
                          onChange={(next) => set("eduOther", next)}
                          hint="Books, equipment, exam and travel costs"
                        />
                        <AmountField
                          id="elig-edu-scholarship"
                          label="Scholarships or grants"
                          value={form.eduScholarship}
                          onChange={(next) => set("eduScholarship", next)}
                          hint="Leave blank if none"
                        />
                      </div>
                      <AmountField
                        id="elig-edu-margin"
                        label="Margin money"
                        value={form.eduMargin}
                        onChange={(next) => set("eduMargin", next)}
                        hint="The part of the cost your family funds itself"
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AmountField
                          id="elig-edu-income"
                          label="Co-applicant monthly income"
                          value={form.monthlyIncome}
                          onChange={(next) => set("monthlyIncome", next)}
                          hint={`Lenders count ${EDUCATION_FOIR_CAP * 100}% of this towards the EMI`}
                        />
                        <AmountField
                          id="elig-edu-emi"
                          label="EMIs already paid"
                          value={form.existingEmi}
                          onChange={(next) => set("existingEmi", next)}
                          hint="Leave blank if none"
                        />
                      </div>
                    </div>
                  )}

                  {product.family === "project" && (
                    <div className="space-y-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AmountField
                          id="elig-project-cost"
                          label="Total project cost"
                          value={form.projectCost}
                          onChange={(next) => set("projectCost", next)}
                          error={errors.projectCost}
                          placeholder="e.g. 5,00,00,000"
                          hint="Land, construction, plant and pre-operative costs"
                        />
                        <AmountField
                          id="elig-project-contribution"
                          label="Promoter contribution"
                          value={form.projectContribution}
                          onChange={(next) => set("projectContribution", next)}
                          error={errors.projectContribution}
                          hint="Your own equity in the project"
                        />
                      </div>
                      <AmountField
                        id="elig-project-cashflow"
                        label="Projected monthly cash flow (optional)"
                        value={form.projectCashFlow}
                        onChange={(next) => set("projectCashFlow", next)}
                        hint={`Caps the loan at a ${DSCR_MIN}× DSCR on the project's cash flow`}
                      />
                      <PlainField
                        id="elig-project-dscr"
                        label="DSCR assumption (×)"
                        value={form.projectDscr}
                        onChange={(next) => set("projectDscr", next.replace(/[^\d.]/g, ""))}
                        inputMode="tel"
                        maxLength={4}
                        hint="Debt service cover lenders ask for; 1.25× is typical"
                      />
                    </div>
                  )}

                  {product.family === "commercial" && (
                    <div className="space-y-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AmountField
                          id="elig-commercial-value"
                          label="Property current market value"
                          value={form.propertyValue}
                          onChange={(next) => set("propertyValue", next)}
                          error={errors.propertyValue}
                          placeholder="e.g. 2,00,00,000"
                          hint="Today's market value, not the purchase price; lenders fund about 70% of it"
                        />
                        <AmountField
                          id="elig-commercial-rent"
                          label="Monthly rent received (optional)"
                          value={form.commercialRent}
                          onChange={(next) => set("commercialRent", next)}
                          hint={`Caps the loan at a ${DSCR_MIN}× DSCR on the rent`}
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AmountField
                          id="elig-commercial-income"
                          label="Monthly income (optional)"
                          value={form.monthlyIncome}
                          onChange={(next) => set("monthlyIncome", next)}
                          hint="Caps the loan at what you can repay"
                        />
                        <AmountField
                          id="elig-commercial-emi"
                          label="EMIs you already pay"
                          value={form.existingEmi}
                          onChange={(next) => set("existingEmi", next)}
                          hint="Leave blank if none"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AmountField
                          id="elig-commercial-coapplicant"
                          label="Co-applicant monthly income (optional)"
                          value={form.commercialCoApplicant}
                          onChange={(next) => set("commercialCoApplicant", next)}
                          hint="Added to your income when the lender counts both"
                        />
                        <PlainField
                          id="elig-commercial-foir"
                          label="FOIR (%)"
                          value={form.commercialFoir}
                          onChange={(next) => set("commercialFoir", next.replace(/[^\d.]/g, ""))}
                          inputMode="tel"
                          maxLength={4}
                          hint="Share of income lenders allow for all EMIs; 70% is typical"
                        />
                      </div>
                      <PlainField
                        id="elig-commercial-ltv"
                        label="LTV (%)"
                        value={form.commercialLtv}
                        onChange={(next) => set("commercialLtv", next.replace(/[^\d.]/g, ""))}
                        inputMode="tel"
                        maxLength={3}
                        hint="Share of the property value lenders fund; 70% is typical"
                      />
                    </div>
                  )}

                  {product.family === "turnover" && (
                    <div className="space-y-5">
                      <AmountField
                        id="elig-wct-turnover"
                        label="Projected annual turnover"
                        value={form.turnover}
                        onChange={(next) => set("turnover", next)}
                        error={errors.turnover}
                        hint="What you expect over the next 12 months"
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <PlainField
                          id="elig-wct-assessment"
                          label="Assessment percentage (%)"
                          value={form.wcAssessment}
                          onChange={(next) => set("wcAssessment", next.replace(/[^\d.]/g, ""))}
                          inputMode="tel"
                          maxLength={5}
                          placeholder="e.g. 18.75"
                          error={errors.wcAssessment}
                          hint="Turnover norm; 18.75% is the Nayak default (75% of a 25% requirement)"
                        />
                        <AmountField
                          id="elig-wct-margin"
                          label="Borrower's margin"
                          value={form.wcMargin}
                          onChange={(next) => set("wcMargin", next)}
                          hint="Your own contribution to the working capital"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AmountField
                          id="elig-wct-current-assets"
                          label="Eligible current assets (optional)"
                          value={form.wcCurrentAssets}
                          onChange={(next) => set("wcCurrentAssets", next)}
                          hint="Inventory, receivables and other qualifying assets"
                        />
                        <AmountField
                          id="elig-wct-current-liabilities"
                          label="Current liabilities (optional)"
                          value={form.wcCurrentLiabilities}
                          onChange={(next) => set("wcCurrentLiabilities", next)}
                          hint="Trade creditors and other current liabilities"
                        />
                      </div>
                      <div>
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Assessment method</p>
                        <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1">
                          {([
                            ["turnover", "Turnover method"],
                            ["drawingPower", "Drawing power"],
                          ] as const).map(([value, label]) => {
                            const active = form.wcMethod === value;
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => set("wcMethod", value)}
                                aria-pressed={active}
                                className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-[12px] font-bold transition-all ${
                                  active ? "bg-white text-(--brand-navy) shadow-sm" : "text-slate-500 hover:text-slate-700"
                                }`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                        <p className="mt-2 text-[11.5px] leading-4 text-slate-500">
                          {form.wcMethod === "turnover"
                            ? "The turnover norm less your margin sets the limit."
                            : "Current assets less current liabilities, less your margin, capped by the turnover norm."
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {product.family === "lrd" && (
                    <div className="space-y-4">
                      {/* The tooltip is anchored to the whole label row, so its
                          256px panel cannot spill past the card on a phone. */}
                      <div className="group relative flex items-center gap-1.5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Lease details</p>
                        <span className="inline-flex">
                          <button
                            type="button"
                            aria-label="What is lease rental discounting?"
                            className="flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-slate-300 text-[9px] font-bold leading-none text-slate-500 transition-colors group-hover:border-(--brand-teal) group-hover:text-(--brand-teal)"
                          >
                            i
                          </button>
                          <span
                            role="tooltip"
                            className="pointer-events-none absolute left-0 top-6 z-20 w-64 rounded-xl bg-slate-900 p-3 text-[11.5px] font-normal leading-4 text-white opacity-0 shadow-xl transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 sm:left-full sm:top-0 sm:ml-2"
                          >
                            Lease Rental Discounting lets a property owner borrow against the rent a tenant pays. Rent for the
                            remaining lease is discounted to today's value at the loan rate, the lender funds a slice of that
                            value, and the loan can never exceed the property's market value.
                          </span>
                        </span>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <AmountField
                          id="elig-lrd-rent"
                          label="Monthly rental income"
                          value={form.lrdRent}
                          onChange={(next) => set("lrdRent", next)}
                          error={errors.lrdRent}
                          placeholder="e.g. 1,20,000"
                          hint="Rent your tenant pays under the registered lease"
                        />
                        <PlainField
                          id="elig-lrd-lease"
                          label="Remaining lease tenure (years)"
                          value={form.lrdLeaseYears}
                          onChange={(next) => set("lrdLeaseYears", next.replace(/\D/g, ""))}
                          inputMode="tel"
                          maxLength={2}
                          placeholder="e.g. 5"
                          error={errors.lrdLeaseYears}
                        />
                        <AmountField
                          id="elig-lrd-property"
                          label="Property market value"
                          value={form.lrdPropertyValue}
                          onChange={(next) => set("lrdPropertyValue", next)}
                          error={errors.lrdPropertyValue}
                          placeholder="e.g. 2,50,00,000"
                          hint="Current market value of the leased property"
                        />
                        <PlainField
                          id="elig-lrd-ltv"
                          label="Assumed LTV (%)"
                          value={form.lrdLtv}
                          onChange={(next) => set("lrdLtv", next.replace(/[^\d.]/g, ""))}
                          inputMode="tel"
                          maxLength={4}
                          placeholder="e.g. 70"
                          error={errors.lrdLtv}
                          hint={`Lenders fund ${LRD_LTV_MIN * 100}% to ${LRD_LTV_MAX * 100}% of the discounted rent`}
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <PlainField
                          id="elig-lrd-deduction"
                          label="Rental deduction (%)"
                          value={form.lrdDeduction}
                          onChange={(next) => set("lrdDeduction", next.replace(/[^\d.]/g, ""))}
                          inputMode="tel"
                          maxLength={4}
                          hint="Vacancy, expenses and lender adjustments; 10% is typical"
                        />
                        <PlainField
                          id="elig-lrd-coverage"
                          label="Rent-to-EMI coverage (%)"
                          value={form.lrdCoverage}
                          onChange={(next) => set("lrdCoverage", next.replace(/[^\d.]/g, ""))}
                          inputMode="tel"
                          maxLength={3}
                          hint="Share of net rent the EMI may use; 70% is typical"
                        />
                      </div>

                      <p className="rounded-xl bg-slate-50 px-4 py-3 text-[11.5px] leading-4 text-slate-500">
                        Fixed terms: {LRD_ROI}% p.a. over up to {LRD_TENURE_YEARS} years, capped at the lease left to run.
                      </p>

                      {lrdLive && (
                        <div className="rounded-xl border border-(--brand-teal-33) bg-(--surface-muted) px-4 py-3">
                          <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400">Live estimate</p>
                          {lrdLive.eligible ? (
                            <>
                              <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">
                                {formatINRRounded(lrdLive.headline)}
                              </p>
                              <p className="mt-1 text-[11px] leading-4 text-slate-500">
                                {formatINRRounded(lrdLive.lease?.rentalLimit ?? 0)} from the discounted rent ·{" "}
                                {formatINRRounded(lrdLive.lease?.propertyLimit ?? 0)} from the property value
                              </p>
                            </>
                          ) : (
                            <p className="mt-1 text-[11.5px] leading-4 text-slate-500">
                              The rent and property together support less than the smallest loan lenders sanction.
                            </p>
                          )}
                        </div>
                      )}
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
                        {product.key === "vehicleLoan" || product.family === "commercial"
                          ? "300 to 900. Lenders need a score of at least 650, and the FOIR above sets the EMI room."
                          : "300 to 900. The bureau score sets how much of your income can go to EMIs."}
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
