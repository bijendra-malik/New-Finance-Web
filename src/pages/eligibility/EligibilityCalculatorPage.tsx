import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageBanner from "../../components/common/PageBanner";
import Container from "../../components/common/Container";
import useSEO from "../../hooks/useSEO";
import { useApplyGate } from "../../hooks/useApplyGate";
import { useSetApplicantPrefill } from "../../context/applicantPrefillContext";
import { EMAIL_REGEX, MOBILE_REGEX, ageOn } from "../../utils/validation";
import { DateOfBirthPicker } from "../../components/form/FormControls";
import { formatINRRounded } from "../../utils/formatters";
import {
  PRODUCTS,
  COMMERCIAL_LTV,
  assetLtvFor,
  commercialEligibility,
  educationEligibility,
  goldEligibility,
  lrdEligibility,
  maturityAgeFor,
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
} from "./models";

import {
  BUSINESS_OCCUPATIONS,
  INCOME_COPY,
  INITIAL_FORM,
  OCCUPATIONS,
  maxTenureFor,
  num,
  type FormState,
} from "./formState";
import { Card, FieldError, FieldLabel, PlainField } from "./fieldControls";
import { SERIF, fieldClass } from "./formState";
import EligibilityProductFields from "./productFields";

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
      if (!form.existingEmi.trim()) next.existingEmi = "Enter the EMIs you already pay (0 if none)";
      if (product.key === "vehicleLoan" && !form.vehicleDownPayment.trim()) {
        next.vehicleDownPayment = "Enter the down payment you can pay (0 if none)";
      }
      if (product.key === "lap" && form.lapPropertyType === "Other" && !form.lapPropertyOther.trim()) {
        next.lapPropertyOther = "Name the property type";
      }
      if (product.key === "lap" && form.lapUsage === "Rented out" && num(form.lapRent) <= 0) {
        next.lapRent = "Enter the monthly rent received";
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
    if (product.family === "education") {
      if (num(form.eduFees) <= 0) next.eduFees = "Enter the course fees";
      if (!form.existingEmi.trim()) next.existingEmi = "Enter the EMIs you already pay (0 if none)";
    }
    if (product.family === "project") {
      if (num(form.projectCost) <= 0) next.projectCost = "Enter the total project cost";
      else if (num(form.projectContribution) <= 0) {
        next.projectContribution = "Enter the promoter contribution";
      } else if (num(form.projectContribution) >= num(form.projectCost)) {
        next.projectContribution = "Promoter contribution must be less than the project cost";
      }
    }
    if (product.family === "commercial") {
      if (num(form.propertyValue) <= 0) next.propertyValue = "Enter the commercial property's market value";
      if (!form.existingEmi.trim()) next.existingEmi = "Enter the EMIs you already pay (0 if none)";
    }
    if (product.family === "turnover") {
      if (num(form.turnover) <= 0) next.turnover = "Enter your projected annual turnover";
      const pct = num(form.wcAssessment);
      if (form.wcAssessment && (pct <= 0 || pct > 100)) {
        next.wcAssessment = "Assessment must be between 1% and 100% of turnover";
      }
      if (form.wcMethod === "drawingPower" && num(form.wcCurrentAssets) <= 0) {
        next.wcCurrentAssets = "Enter the eligible current assets for the drawing power";
      }
    }
    if (product.family === "gold") {
      if (num(form.goldGrams) <= 0) next.goldGrams = "Enter the gold weight in grams";
      if (num(form.goldRate) <= 0) next.goldRate = "Enter the rate per gram";
      if (!form.existingEmi.trim()) next.existingEmi = "Enter the EMIs you already pay (0 if none)";
    }
    if (product.family === "wc") {
      if (num(form.turnover) <= 0) next.turnover = "Enter your projected annual turnover";
      if (form.odMode === "drawingPower" && num(form.stock) + num(form.debtors) <= 0) {
        next.stock = "Enter the stock and receivables behind the drawing power";
      }
    }
    const score = num(form.creditScore);
    if (!form.creditScore) next.creditScore = "Enter your credit score";
    else if (score < 300 || score > 900) next.creditScore = "Credit scores run from 300 to 900";
    if (product.family === "share") {
      if (num(form.shareValue) <= 0) next.shareValue = "Enter the market value of the shares";
      if (!form.existingEmi.trim()) next.existingEmi = "Enter the EMIs you already pay (0 if none)";
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
                  label: "Repayment capacity",
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

                  <EligibilityProductFields
                    product={product}
                    form={form}
                    errors={errors}
                    set={set}
                    lrdLive={lrdLive}
                    occupation={occupation}
                    occupationOptions={occupationOptions}
                    incomeLabel={incomeLabel}
                    incomeHint={incomeHint}
                    asset={asset}
                    assetLtv={assetLtv}
                    lapAssetType={lapAssetType}
                  />
                  <div>
                    <FieldLabel htmlFor="elig-credit" required>Credit score (CIBIL)</FieldLabel>
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
                    <FieldLabel htmlFor="elig-dob" required>Date of birth</FieldLabel>
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
                      required
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
                    required
                  />
                  <PlainField
                    id="elig-email"
                    label="Email address"
                    value={form.email}
                    onChange={(next) => set("email", next)}
                    inputMode="email"
                    placeholder="you@example.com"
                    error={errors.email}
                    required
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
