import { useMemo, useState } from "react";
import { useAuth } from "../../../../../context/authContext";
import { applyPersonalLoan } from "../../../../../api/loanApplications";
import { addCustomBankName } from "../../../../../api/masters";
import type { PersonalLoanApplication } from "../../../../../api/loanApplications";
import { FORM } from "../../../../../constants/formStyles";
import { OTHER_OPTION, SALARIED } from "../../../../../constants/masters";
import { useMasters } from "../../../../../hooks/useMasters";
import { usePincodeSections } from "../../../../../hooks/usePincodeSections";
import { useApplicationSubmit } from "../../../../../hooks/useApplicationSubmit";
import { useTouchedErrors } from "../../../../../hooks/useTouchedErrors";
import LoanApplicationFormShell from "../../../../../components/form/LoanApplicationFormShell";
import { PersonalDetailsSection } from "../../../../../components/form/PersonalDetailsSection";
import { ExistingLoanExposureSection } from "../../../../../components/form/ExistingLoanExposureSection";
import { formatIndianNumber } from "../../../../../utils/formatters";
import { NAME_REGEX, stripOther, validatePersonalDetails } from "../../../../../utils/validation";
import {
  AmountField, FieldLabel, FormCard, MORE_THAN_TENURE_OPTION, SelectField,
  SelectWithOther, TenureYearsField, TextField,
} from "../../../../../components/form/FormControls";
import { buildProductSections } from "./receiptSections";

interface ApplicationFormProps {
  userName?: string;
  userEmail?: string;
  onSubmit?: (id: string, app: PersonalLoanApplication) => void;
}

interface FormData {
  fullName: string; mobile: string; email: string; dob: string; panNumber: string;
  state: string; city: string; pincode: string; residenceStatus: string; residenceStatusOther: string;
  employmentType: string; companyName: string; companyType: string; companyTypeOther: string; monthlyNetSalary: number; salaryReceivedAs: string; salaryBankName: string; salaryBankNameOther: string;
  loanAmount: number; loanTenureYears: number; loanTenureYearsCustom: number; existingEMI: string; existingLoanAmount: string;
  existingBanks: string[]; existingLoanTypes: string[]; existingBanksOther: string[]; existingLoanTypesOther: string[];
}

const HEADLINE = "Unlock the best Personal Loan offers suitable for your needs from 43+ lenders";

const ApplicationForm = ({ userName = "", userEmail = "", onSubmit }: ApplicationFormProps) => {
  const { user } = useAuth();
  const { masters, loadCities } = useMasters();
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState<FormData>({
    fullName: user?.name || userName, mobile: user?.mobile || "", email: user?.email || userEmail,
    dob: "", panNumber: "", state: "", city: "", pincode: "", residenceStatus: "", residenceStatusOther: "",
    employmentType: "", companyName: "", companyType: "", companyTypeOther: "", monthlyNetSalary: 0,
    salaryReceivedAs: "", salaryBankName: "", salaryBankNameOther: "",
    loanAmount: 0, loanTenureYears: 0, loanTenureYearsCustom: 0, existingEMI: "", existingLoanAmount: "",
    existingBanks: [], existingLoanTypes: [], existingBanksOther: [], existingLoanTypesOther: [],
  });

  const set = (f: keyof FormData, v: FormData[keyof FormData]) => {
    setForm(p => ({ ...p, [f]: v }));
    touch(f);
  };

  // Employment types stay static for this product — /employment-types is Home Loan only.
  const employmentTypeOptions = useMemo(
    () => [...masters.personalEmploymentTypes],
    [masters.personalEmploymentTypes]
  );

  const hasExposure = parseInt(form.existingEMI) > 0 || parseInt(form.existingLoanAmount) > 0;
  const pillBanksSelected = [form.existingBanks].some(a => a.length > 0);
  const pillLoanTypesSelected = [form.existingLoanTypes].some(a => a.length > 0);

  const { onPincodeResolved, mismatchErrors } = usePincodeSections({
    set: (key, value) => set(key as keyof FormData, value),
    loadCities,
    sections: ["residence"],
  });

  const computeErrors = (draft: FormData = form) => {
    const e: Partial<Record<keyof FormData, string>> = {};

    if (draft.loanAmount < 50000) e.loanAmount = "Minimum ₹50,000";
    else if (draft.loanAmount > 5000000) e.loanAmount = "Maximum loan amount is ₹50,00,000";

    if (!draft.loanTenureYears) e.loanTenureYears = "Select loan tenure";
    else if (draft.loanTenureYears === MORE_THAN_TENURE_OPTION && (form.loanTenureYearsCustom <= 7 || form.loanTenureYearsCustom > 25))
      e.loanTenureYearsCustom = form.loanTenureYearsCustom > 25 ? "Tenure cannot exceed 25 years" : "Enter a tenure greater than 7 years";

    if (!draft.existingEMI.trim()) e.existingEMI = "Existing Total EMI is required (enter 0 if none)";
    if (!draft.existingLoanAmount.trim()) e.existingLoanAmount = "Existing Loan Amount is required (enter 0 if none)";
    else if (parseInt(draft.existingEMI) > parseInt(draft.existingLoanAmount))
      e.existingEMI = "Existing Total EMI cannot be greater than Existing Loan Amount (Total)";
    if ((pillBanksSelected || pillLoanTypesSelected) && !hasExposure)
      e.existingEMI = "Since existing loan banks/types are selected, existing EMI or existing loan amount must be greater than 0 (unselect both if you have no existing loans)";

    if (!draft.employmentType) e.employmentType = "Employment type is required";
    if (draft.employmentType === SALARIED) {
      if (!draft.companyName.trim()) e.companyName = "Company name is required";
      else if (!NAME_REGEX.test(draft.companyName.trim())) e.companyName = "Name must be at least 2 characters and contain only letters, spaces, dots or hyphens";
      if (!draft.companyType) e.companyType = "Company type is required";
      else if (draft.companyType === OTHER_OPTION && !draft.companyTypeOther.trim()) e.companyTypeOther = "Please mention company type";
      if (!draft.monthlyNetSalary) e.monthlyNetSalary = "Monthly net salary is required";
      else if (draft.monthlyNetSalary <= 12000) e.monthlyNetSalary = "Monthly income should be greater than 12,000";
      // 70% FOIR rule — total EMI must stay under 70% of net salary.
      else if (parseInt(draft.existingEMI) >= draft.monthlyNetSalary * 0.7)
        e.existingEMI = `Total monthly EMI should not be more than ₹${formatIndianNumber(String(Math.floor(draft.monthlyNetSalary * 0.7)))}`;
      if (!draft.salaryReceivedAs) e.salaryReceivedAs = "Select how salary is received";
      else if (draft.salaryReceivedAs !== "Cash") {
        if (!draft.salaryBankName) e.salaryBankName = "Select salary bank name";
        else if (draft.salaryBankName === OTHER_OPTION && !draft.salaryBankNameOther.trim()) e.salaryBankNameOther = "Please mention salary bank name";
      }
    }

    validatePersonalDetails(draft, e, { maxAge: 60 });
    Object.assign(e, mismatchErrors(draft));
    return e;
  };

  const allErrors = computeErrors();
  const { errors, touch, markAllTouched } = useTouchedErrors<keyof FormData>(allErrors);

  const {
    isSubmitting, apiError, submitAttempted, submitted, submittedApp,
    showFormAfterSubmit, setShowFormAfterSubmit, handleSubmit,
  } = useApplicationSubmit<PersonalLoanApplication>({
    computeErrors, markAllTouched, agreed,
    submit: async () => {
      if (form.existingBanksOther.length > 0) {
        await Promise.allSettled(form.existingBanksOther.map(b => addCustomBankName(b)));
      }
      const res = await applyPersonalLoan({
        fullName: form.fullName, mobile: form.mobile, email: form.email,
        dob: new Date(form.dob).toISOString(), panNumber: form.panNumber.toUpperCase(),
        state: form.state, city: form.city, pincode: form.pincode,
        residenceStatus: form.residenceStatus === OTHER_OPTION ? OTHER_OPTION : form.residenceStatus,
        residenceStatusOther: form.residenceStatus === OTHER_OPTION ? (form.residenceStatusOther.trim() || undefined) : undefined,
        employmentType: form.employmentType, companyName: form.companyName,
        companyType: form.companyType === OTHER_OPTION ? OTHER_OPTION : form.companyType,
        companyTypeOther: form.companyType === OTHER_OPTION ? (form.companyTypeOther.trim() || undefined) : undefined,
        monthlySalary: form.monthlyNetSalary, salaryReceivedAs: form.salaryReceivedAs,
        salaryBankName: form.salaryReceivedAs !== "Cash"
          ? (form.salaryBankName === OTHER_OPTION ? OTHER_OPTION : form.salaryBankName)
          : undefined,
        salaryBankNameOther: form.salaryReceivedAs !== "Cash"
          ? (form.salaryBankName === OTHER_OPTION ? (form.salaryBankNameOther.trim() || undefined) : undefined)
          : undefined,
        loanAmount: form.loanAmount,
        loanTenure: (form.loanTenureYears === MORE_THAN_TENURE_OPTION ? form.loanTenureYearsCustom : form.loanTenureYears) * 12,
        existingEMI: parseInt(form.existingEMI) || 0, existingLoanAmount: parseInt(form.existingLoanAmount) || 0,
        existingBanks: stripOther(form.existingBanks), otherBankList: form.existingBanksOther,
        existingLoanTypes: stripOther(form.existingLoanTypes), otherLoanList: form.existingLoanTypesOther,
      });
      return res.data;
    },
    onSubmitSuccess: onSubmit,
  });

  return (
    <LoanApplicationFormShell
      productName="Personal Loan"
      headline={HEADLINE}
      application={submittedApp}
      submitted={submitted}
      showFormAfterSubmit={showFormAfterSubmit}
      onShowForm={setShowFormAfterSubmit}
      buildSections={buildProductSections}
      onSubmit={handleSubmit}
      agreed={agreed}
      onAgreedChange={setAgreed}
      apiError={apiError}
      submitAttempted={submitAttempted}
      invalidCount={Object.keys(allErrors).length}
      isSubmitting={isSubmitting}
    >
      <FormCard title="Loan Requirements" subtitle="How much do you need and for how long?">
        <div className={FORM.grid}>
          <div id="loanAmount"><FieldLabel label="Required Loan Amount" required />
            <AmountField value={form.loanAmount === 0 ? "" : String(form.loanAmount)} onChange={v => set("loanAmount", parseInt(v) || 0)} placeholder="Enter Amount in INR" err={errors.loanAmount} />
          </div>
          <TenureYearsField
            id="loanTenureYears" label="Required Loan Tenure (in years)"
            value={form.loanTenureYears} onChange={v => set("loanTenureYears", v)}
            customValue={form.loanTenureYearsCustom} onCustomChange={v => set("loanTenureYearsCustom", v)}
            options={masters.personalLoanTenureYears} maxYears={25} err={errors.loanTenureYears} customErr={errors.loanTenureYearsCustom}
          />
        </div>
      </FormCard>

      <FormCard title="Income Details" subtitle="Tell us about your employment and income">
        <div className={FORM.grid}>
          <div id="employmentType"><FieldLabel label="Employment Type" required />
            <SelectField value={form.employmentType} onChange={v => set("employmentType", v)} options={employmentTypeOptions} placeholder="Select" err={errors.employmentType} />
          </div>
          {form.employmentType === SALARIED && (<>
            <div id="companyName"><FieldLabel label="Company Name" required />
              <TextField value={form.companyName} onChange={v => set("companyName", v.slice(0, 100))} maxLength={100} placeholder="Company full name" err={errors.companyName} />
            </div>
            <SelectWithOther
              id="companyType" label="Company Type" required
              value={form.companyType} onChange={v => {
                set("companyType", v);
                if (v !== OTHER_OPTION) set("companyTypeOther", "");
              }} options={masters.companyTypes} err={errors.companyType}
              otherId="companyTypeOther" otherLabel="Mention Company Type"
              otherValue={form.companyTypeOther} onOtherChange={v => set("companyTypeOther", v)}
              otherPlaceholder="Enter company type" otherErr={errors.companyTypeOther}
            />
            <div id="monthlyNetSalary"><FieldLabel label="Monthly Net Salary" required />
              <AmountField value={form.monthlyNetSalary === 0 ? "" : String(form.monthlyNetSalary)} onChange={v => set("monthlyNetSalary", parseInt(v) || 0)} placeholder="Enter Amount in INR"
                err={errors.monthlyNetSalary} />
            </div>
            <div id="salaryReceivedAs"><FieldLabel label="Salary Received As" required />
              <SelectField value={form.salaryReceivedAs} onChange={v => {
                set("salaryReceivedAs", v);
                if (v === "Cash") { set("salaryBankName", ""); set("salaryBankNameOther", ""); }
              }} options={masters.salaryModes} placeholder="Select" err={errors.salaryReceivedAs} />
            </div>
            {form.salaryReceivedAs && form.salaryReceivedAs !== "Cash" && (
              <SelectWithOther
                id="salaryBankName" label="Salary Bank Name" required
                value={form.salaryBankName} onChange={v => {
                  set("salaryBankName", v);
                  if (v !== OTHER_OPTION) set("salaryBankNameOther", "");
                }} options={masters.banks} err={errors.salaryBankName}
                otherId="salaryBankNameOther" otherLabel="Mention Salary Bank Name"
                otherValue={form.salaryBankNameOther} onOtherChange={v => set("salaryBankNameOther", v)}
                otherPlaceholder="Enter bank name" otherErr={errors.salaryBankNameOther}
              />
            )}
          </>)}
        </div>
      </FormCard>

      <ExistingLoanExposureSection form={form} set={(key, value) => set(key, value)} errors={errors}
        mergeForm={patch => setForm(p => ({ ...p, ...patch }))}
        banks={masters.banks} existingLoanTypes={masters.existingLoanTypes} />

      <PersonalDetailsSection form={form} set={(key, value) => set(key, value)} errors={errors}
        onPincodeResolved={r => onPincodeResolved("residence", r)}
        states={masters.states} residenceStatuses={masters.residenceStatuses} loadCities={loadCities} />
    </LoanApplicationFormShell>
  );
};

export default ApplicationForm;
