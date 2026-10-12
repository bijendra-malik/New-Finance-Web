import { useMemo, useState, useCallback } from "react";
import { useAuth } from "../../../context/authContext";
import type { PersonalLoanApplication } from "../../../api/loanApplications";
import { FORM } from "../../../constants/formStyles";
import { OTHER_OPTION, SALARIED } from "../../../constants/masters";
import { useMasters } from "../../../hooks/useMasters";
import { usePincodeSections } from "../../../hooks/usePincodeSections";
import { useApplicationSubmit } from "../../../hooks/useApplicationSubmit";
import { useTouchedErrors } from "../../../hooks/useTouchedErrors";
import LoanApplicationFormShell from "../../../components/form/LoanApplicationFormShell";
import { PersonalDetailsSection } from "../../../components/form/PersonalDetailsSection";
import { ExistingLoanExposureSection } from "../../../components/form/ExistingLoanExposureSection";
import { NAME_REGEX, stripOther, validatePersonalDetails } from "../../../utils/validation";
import {
  AmountField,
  FieldLabel,
  FormCard,
  SelectField,
  SelectWithOther,
  TenureYearsField,
  TextField,
} from "../../../components/form/FormControls";
import { franchiseSubmitContext } from "../../../api/franchiseLoanApplications";
import {
  applyFranchiseCustomerLoan,
  type FranchiseCustomer,
} from "../../../api/franchiseCustomers";
import type { SuccessSection, SuccessRow } from "../../../components/form/successSections";

type FranchiseProfile = {
  name?: string;
  mobile?: string;
  email?: string;
  isVerified?: boolean;
  franchiseStatus?: string;
};


type FranchiseSessionLite = {
  franchiseId: string;
  name?: string;
  mobile?: string;
  email?: string;
  franchiseStatus?: string;
};

interface LoanFormModalBodyProps {
  productKey: string;
  /** The client this application is filed for. */
  customer: FranchiseCustomer;
  session: FranchiseSessionLite | null;
  profile: FranchiseProfile | null;
  canSubmit: boolean;    onRefNo: (refNo: string) => void;
  onClose: () => void; // kept for LoanFormModal's close wiring
}

const HEADLINE = "Unlock the best Personal Loan offers suitable for your needs from 43+ lenders";

const LoanFormModalBody = ({
  productKey,
  customer,
  session,
  profile,
  onRefNo,
}: LoanFormModalBodyProps) => {
  const { user } = useAuth();
  const { masters, loadCities } = useMasters();

  const ctx = franchiseSubmitContext();
  const franchiseId = ctx?.franchiseId ?? session?.franchiseId ?? "";
  const franchiseeName = ctx?.session.name ?? session?.name;
  const franchiseeMobile = ctx?.session.mobile ?? session?.mobile;
  const franchiseeEmail = ctx?.session.email ?? profile?.email ?? user?.email ?? "";

  const isPersonalLoan = productKey === "personal-loan";

  // Identity lives on the same object as the rest of the form so the
  // PersonalDetailsSection setter and the submit hook share one shape.
  const [form, setForm] = useState<{
    fullName: string;
    mobile: string;
    email: string;
    dob: string;
    panNumber: string;
    state: string;
    city: string;
    pincode: string;
    residenceStatus: string;
    residenceStatusOther: string;
    loanAmount: number;
    loanTenureYears: number | string;
    loanTenureYearsCustom: number;
    employmentType: string;
    companyName: string;
    companyType: string;
    companyTypeOther: string;
    monthlyNetSalary: number;
    salaryReceivedAs: string;
    salaryBankName: string;
    salaryBankNameOther: string;
    existingEMI: string;
    existingLoanAmount: string;
    existingBanks: string[];
    existingLoanTypes: string[];
    existingBanksOther: string[];
    existingLoanTypesOther: string[];
  }>({
    fullName: customer.fullName ?? "",
    mobile: (customer.mobile ?? "").replace(/\D/g, "").slice(-10),
    email: customer.email ?? "",
    dob: customer.dob ?? "",
    panNumber: customer.panNumber ?? "",
    state: customer.state ?? "",
    city: customer.city ?? "",
    pincode: customer.pincode ?? "",
    residenceStatus: "",
    residenceStatusOther: "",
    loanAmount: 0,
    loanTenureYears: 0,
    loanTenureYearsCustom: 0,
    employmentType: "",
    companyName: "",
    companyType: "",
    companyTypeOther: "",
    monthlyNetSalary: 0,
    salaryReceivedAs: "",
    salaryBankName: "",
    salaryBankNameOther: "",
    existingEMI: "",
    existingLoanAmount: "",
    existingBanks: [],
    existingLoanTypes: [],
    existingBanksOther: [],
    existingLoanTypesOther: [],
  });

  const set = useCallback(
    (k: keyof typeof form, v: (typeof form)[typeof k]) => {
      setForm((p) => ({ ...p, [k]: v }));
    },
    [],
  );


  const employmentTypeOptions = useMemo(
    () => [...masters.personalEmploymentTypes],
    [masters.personalEmploymentTypes],
  );

  const hasExposure = parseInt(form.existingEMI) > 0 || parseInt(form.existingLoanAmount) > 0;
  const pillBanksSelected = form.existingBanks.length > 0;
  const pillLoanTypesSelected = form.existingLoanTypes.length > 0;

  const { onPincodeResolved: _onPincodeResolved, mismatchErrors } = usePincodeSections({
    set: () => {}, // residence handled inline in the personal-loan branch below
    loadCities,
    sections: isPersonalLoan ? ["residence"] : [],
  });
  const _onPincodeResolvedUsed = _onPincodeResolved;


  const computeErrors = useCallback(() => {
    const e: Record<string, string> = {};

    if (isPersonalLoan) {
      if (!form.fullName.trim()) e.fullName = "Full name is required";
      else if (!NAME_REGEX.test(form.fullName.trim())) e.fullName = "Name must be at least 2 characters and contain only letters, spaces, dots or hyphens";

      if (!form.mobile.trim()) e.mobile = "Mobile number is required";
      else if (form.mobile.replace(/\D/g, "").length !== 10) e.mobile = "Mobile number must be 10 digits";

      if (!form.email.trim()) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email address";

      if (!form.dob) e.dob = "Date of birth is required";

      if (!form.panNumber.trim()) e.panNumber = "PAN number is required";
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.panNumber.trim().toUpperCase())) e.panNumber = "Enter a valid PAN (e.g. ABCDE1234A)";

      if (!form.pincode) e.pincode = "Pincode is required";
      else if (form.pincode.replace(/\D/g, "").length !== 6) e.pincode = "Enter a 6-digit pincode";

      if (!form.state) e.state = "State is required";
      if (!form.city) e.city = "City is required";

      if (!form.residenceStatus) e.residenceStatus = "Residence status is required";
      else if (form.residenceStatus === OTHER_OPTION && !form.residenceStatusOther.trim()) e.residenceStatusOther = "Please mention residence status";

      if (form.loanAmount < 50000) e.loanAmount = "Minimum ₹50,000";
      else if (form.loanAmount > 5000000) e.loanAmount = "Maximum loan amount is ₹50,00,000";

      if (!form.loanTenureYears) e.loanTenureYears = "Select loan tenure";
      else if (form.loanTenureYears === OTHER_OPTION && (form.loanTenureYearsCustom <= 7 || form.loanTenureYearsCustom > 10))
        e.loanTenureYearsCustom = form.loanTenureYearsCustom > 10 ? "Tenure cannot exceed 10 years" : "Enter a tenure greater than 7 years";

      if (!form.existingEMI.trim()) e.existingEMI = "Existing Total EMI is required (enter 0 if none)";
      if (!form.existingLoanAmount.trim()) e.existingLoanAmount = "Existing Loan Amount is required (enter 0 if none)";
      else if (parseInt(form.existingEMI) > parseInt(form.existingLoanAmount))
        e.existingEMI = "Existing Total EMI cannot be greater than Existing Loan Amount (Total)";
      if ((pillBanksSelected || pillLoanTypesSelected) && !hasExposure)
        e.existingEMI = "Since existing loan banks/types are selected, existing EMI or existing loan amount must be greater than 0 (unselect both if you have no existing loans)";

      if (!form.employmentType) e.employmentType = "Employment type is required";
      if (form.employmentType === SALARIED) {
        if (!form.companyName.trim()) e.companyName = "Company name is required";
        else if (!NAME_REGEX.test(form.companyName.trim())) e.companyName = "Name must be at least 2 characters and contain only letters, spaces, dots or hyphens";
        if (!form.companyType) e.companyType = "Company type is required";
        else if (form.companyType === OTHER_OPTION && !form.companyTypeOther.trim()) e.companyTypeOther = "Please mention company type";
        if (!form.monthlyNetSalary) e.monthlyNetSalary = "Monthly net salary is required";
        else if (form.monthlyNetSalary <= 12000) e.monthlyNetSalary = "Monthly income should be greater than 12,000";
        if (!form.salaryReceivedAs) e.salaryReceivedAs = "Select how salary is received";
        else if (form.salaryReceivedAs !== "Cash") {
          if (!form.salaryBankName) e.salaryBankName = "Select salary bank name";
          else if (form.salaryBankName === OTHER_OPTION && !form.salaryBankNameOther.trim()) e.salaryBankNameOther = "Please mention salary bank name";
        }
      }

      validatePersonalDetails(
        {
          fullName: form.fullName,
          mobile: form.mobile,
          email: form.email,
          dob: form.dob,
          panNumber: form.panNumber,
          state: form.state,
          city: form.city,
          pincode: form.pincode,
          residenceStatus: form.residenceStatus,
          residenceStatusOther: form.residenceStatusOther,
        },
        e,
        { maxAge: 60 },
      );
      Object.assign(e, mismatchErrors({ pincode: form.pincode }));
    }

    return e;
  }, [
    isPersonalLoan,
    mismatchErrors,
    form.fullName,
    form.mobile,
    form.email,
    form.dob,
    form.panNumber,
    form.pincode,
    form.state,
    form.city,
    form.residenceStatus,
    form.residenceStatusOther,
    form.loanAmount,
    form.loanTenureYears,
    form.loanTenureYearsCustom,
    form.employmentType,
    form.companyName,
    form.companyType,
    form.companyTypeOther,
    form.monthlyNetSalary,
    form.salaryReceivedAs,
    form.salaryBankName,
    form.salaryBankNameOther,
    form.existingEMI,
    form.existingLoanAmount,
    hasExposure,
    pillBanksSelected,
    pillLoanTypesSelected,
  ]);

  const { errors, markAllTouched } = useTouchedErrors(computeErrors());

  const {
    isSubmitting,
    apiError,
    submitAttempted,
    submitted,
    submittedApp,
    showFormAfterSubmit,
    setShowFormAfterSubmit,
    handleSubmit,
  } = useApplicationSubmit({
    computeErrors,
    markAllTouched,
    agreed: false,
    submit: async () => {
      if (!ctx) throw new Error("No franchise session");
      const payload = {
        fullName: form.fullName.trim(),
        mobile: form.mobile.replace(/\D/g, "").slice(-10),
        email: form.email.trim().toLowerCase(),
        dob: new Date(form.dob).toISOString(),
        panNumber: form.panNumber.trim().toUpperCase(),
        state: form.state,
        city: form.city,
        pincode: form.pincode,
        residenceStatus: form.residenceStatus === OTHER_OPTION ? OTHER_OPTION : form.residenceStatus,
        residenceStatusOther: form.residenceStatus === OTHER_OPTION ? (form.residenceStatusOther.trim() || undefined) : undefined,
        employmentType: form.employmentType,
        companyName: form.employmentType === SALARIED ? form.companyName.trim() : undefined,
        companyType: form.employmentType === SALARIED ? (form.companyType === OTHER_OPTION ? OTHER_OPTION : form.companyType) : undefined,
        companyTypeOther: form.employmentType === SALARIED && form.companyType === OTHER_OPTION ? form.companyTypeOther.trim() || undefined : undefined,
        monthlySalary: form.employmentType === SALARIED ? form.monthlyNetSalary : undefined,
        salaryReceivedAs: form.employmentType === SALARIED ? form.salaryReceivedAs : undefined,
        salaryBankName: form.employmentType === SALARIED && form.salaryReceivedAs && form.salaryReceivedAs !== "Cash" ? (form.salaryBankName === OTHER_OPTION ? OTHER_OPTION : form.salaryBankName) : undefined,
        salaryBankNameOther: form.employmentType === SALARIED && form.salaryReceivedAs && form.salaryReceivedAs !== "Cash" && form.salaryBankName === OTHER_OPTION ? form.salaryBankNameOther.trim() || undefined : undefined,
        loanAmount: form.loanAmount,
        loanTenure: Number(form.loanTenureYears === OTHER_OPTION ? form.loanTenureYearsCustom : form.loanTenureYears) * 12,
        existingEMI: parseInt(form.existingEMI) || 0,
        existingLoanAmount: parseInt(form.existingLoanAmount) || 0,
        existingBanks: stripOther(form.existingBanks),
        otherBankList: form.existingBanksOther,
        existingLoanTypes: stripOther(form.existingLoanTypes),
        otherLoanList: form.existingLoanTypesOther,
      };

      // Filed against the franchise customer registry — POST
      // /franchise/customer/:slug/applyloan, carrying the selected client's id
      // so the backend files it under this franchise.
      const res = await applyFranchiseCustomerLoan(productKey, {
        ...payload,
        franchiseCustomerId: customer._id,
      });
      if (!res.ok) throw new Error(res.message);
      return res.data as unknown as PersonalLoanApplication;
    },
    onSubmitSuccess: (id) => {
      onRefNo(id);
    },
  });

  const residenceHandleNonCb = (key: keyof typeof form, value: string) => {
    if (key === "state") {
      setForm((p) => ({ ...p, state: value }));
      _onPincodeResolvedUsed("residence", { pincode: form.pincode, state: value, city: form.city });
    } else if (key === "city") {
      setForm((p) => ({ ...p, city: value }));
    } else if (key === "pincode") {
      setForm((p) => ({ ...p, pincode: value }));
    } else if (key === "residenceStatus") {
      setForm((p) => ({ ...p, residenceStatus: value }));
    } else if (key === "residenceStatusOther") {
      setForm((p) => ({ ...p, residenceStatusOther: value }));
    }
  };

  return (
    <LoanApplicationFormShell
      productName="Personal Loan"
      headline={HEADLINE}
      application={submittedApp ?? null}
      submitted={submitted}
      showFormAfterSubmit={showFormAfterSubmit}
      onShowForm={setShowFormAfterSubmit}
      buildSections={(app) => buildProductSections(app, franchiseId, franchiseeName, franchiseeMobile, franchiseeEmail)}
      onSubmit={handleSubmit}
      agreed={false}
      onAgreedChange={() => {}}
      apiError={apiError}
      submitAttempted={submitAttempted}
      invalidCount={Object.keys(computeErrors()).length}
      isSubmitting={isSubmitting}
    >
      <FormCard title="Loan Requirements" subtitle="How much do you need and for how long?">
        <div className={FORM.grid}>
          <div id="loanAmount">
            <FieldLabel label="Required Loan Amount" required />
            <AmountField
              value={form.loanAmount === 0 ? "" : String(form.loanAmount)}
              onChange={(v) => set("loanAmount", parseInt(v) || 0)}
              placeholder="Enter Amount in INR"
              err={errors.loanAmount}
            />
          </div>
          <TenureYearsField
            id="loanTenureYears"
            label="Required Loan Tenure (in years)"
            value={form.loanTenureYears as number}
            onChange={(v) => set("loanTenureYears", v)}
            customValue={form.loanTenureYearsCustom}
            onCustomChange={(v) => set("loanTenureYearsCustom", v)}
            options={masters.personalLoanTenureYears}
            maxYears={10}
            err={errors.loanTenureYears}
            customErr={errors.loanTenureYearsCustom}
          />
        </div>
      </FormCard>

      <FormCard title="Income Details" subtitle="Tell us about your employment and income">
        <div className={FORM.grid}>
          <div id="employmentType">
            <FieldLabel label="Employment Type" required />
            <SelectField
              value={form.employmentType}
              onChange={(v) => set("employmentType", v)}
              options={employmentTypeOptions}
              placeholder="Select"
              err={errors.employmentType}
            />
          </div>
          {form.employmentType === SALARIED && (
            <>
              <div id="companyName">
                <FieldLabel label="Company Name" required />
                <TextField
                  value={form.companyName}
                  onChange={(v) => set("companyName", v.slice(0, 100))}
                  maxLength={100}
                  placeholder="Company full name"
                  err={errors.companyName}
                />
              </div>
              <SelectWithOther
                id="companyType"
                label="Company Type"
                required
                value={form.companyType}
                onChange={(v) => {
                  set("companyType", v);
                  if (v !== OTHER_OPTION) set("companyTypeOther", "");
                }}
                options={masters.companyTypes}
                err={errors.companyType}
                otherId="companyTypeOther"
                otherLabel="Mention Company Type"
                otherValue={form.companyTypeOther}
                onOtherChange={(v) => set("companyTypeOther", v)}
                otherPlaceholder="Enter company type"
                otherErr={errors.companyTypeOther}
              />
              <div id="monthlyNetSalary">
                <FieldLabel label="Monthly Net Salary" required />
                <AmountField
                  value={form.monthlyNetSalary === 0 ? "" : String(form.monthlyNetSalary)}
                  onChange={(v) => set("monthlyNetSalary", parseInt(v) || 0)}
                  placeholder="Enter Amount in INR"
                  err={errors.monthlyNetSalary}
                />
              </div>
              <div id="salaryReceivedAs">
                <FieldLabel label="Salary Received As" required />
                <SelectField
                  value={form.salaryReceivedAs}
                  onChange={(v) => {
                    set("salaryReceivedAs", v);
                    if (v === "Cash") { set("salaryBankName", ""); set("salaryBankNameOther", ""); }
                  }}
                  options={masters.salaryModes}
                  placeholder="Select"
                  err={errors.salaryReceivedAs}
                />
              </div>
              {form.salaryReceivedAs && form.salaryReceivedAs !== "Cash" && (
                <SelectWithOther
                  id="salaryBankName"
                  label="Salary Bank Name"
                  required
                  value={form.salaryBankName}
                  onChange={(v) => {
                    set("salaryBankName", v);
                    if (v !== OTHER_OPTION) set("salaryBankNameOther", "");
                  }}
                  options={masters.banks}
                  err={errors.salaryBankName}
                  otherId="salaryBankNameOther"
                  otherLabel="Mention Salary Bank Name"
                  otherValue={form.salaryBankNameOther}
                  onOtherChange={(v) => set("salaryBankNameOther", v)}
                  otherPlaceholder="Enter bank name"
                  otherErr={errors.salaryBankNameOther}
                />
              )}
            </>
          )}
        </div>
      </FormCard>

      <ExistingLoanExposureSection
        form={form}
        set={(key, value) => set(key as keyof typeof form, value)}
        errors={errors}
        mergeForm={(patch) => setForm((p) => ({ ...p, ...patch }))}
        banks={masters.banks}
        existingLoanTypes={masters.existingLoanTypes}
      />
      <PersonalDetailsSection
        form={form}
        set={residenceHandleNonCb}
        errors={errors}
        states={masters.states}
        residenceStatuses={masters.residenceStatuses}
        loadCities={loadCities}
        onPincodeResolved={(r) => {
          // The pincode master resolved state/city — mirror them into the form.
          setForm((p) => ({ ...p, pincode: r.pincode, state: r.state, city: r.city }));
        }}
      />

      <FormCard title="Franchise Filing" subtitle="This application is filed under your franchise ID">
        <div className={FORM.grid}>
          <div id="franchiseId">
            <FieldLabel label="Your Franchise ID" required />
            <div className="mt-1">
              <input
                type="text"
                value={franchiseId}
                readOnly
                className={`${FORM.field} bg-slate-50`}
                style={{ border: `1.5px solid ${errors.franchiseId ? FORM.error : FORM.fieldBorder}` }}
              />
              {errors.franchiseId && <p className="text-xs text-red-500 mt-1">{errors.franchiseId}</p>}
            </div>
          </div>
          <div id="franchiseeName">
            <FieldLabel label="Franchisee name" required />
            <div className="mt-1">
              <input
                type="text"
                value={franchiseeName ?? ""}
                readOnly
                className={`${FORM.field} bg-slate-50`}
                style={{ border: `1.5px solid ${errors.franchiseeName ? FORM.error : FORM.fieldBorder}` }}
              />
              {errors.franchiseeName && <p className="text-xs text-red-500 mt-1">{errors.franchiseeName}</p>}
            </div>
          </div>
        </div>
        {franchiseeMobile && (
          <div className={FORM.grid}>
            <div id="franchiseeMobile">
              <FieldLabel label="Franchisee mobile" required />
              <div className="mt-1">
                <input
                  type="text"
                  value={franchiseeMobile}
                  readOnly
                  className={`${FORM.field} bg-slate-50`}
                  style={{ border: `1.5px solid ${errors.franchiseeMobile ? FORM.error : FORM.fieldBorder}` }}
                />
                {errors.franchiseeMobile && <p className="text-xs text-red-500 mt-1">{errors.franchiseeMobile}</p>}
              </div>
            </div>
          </div>
        )}
        {franchiseeEmail && (
          <div className={FORM.grid}>
            <div id="franchiseeEmail">
              <FieldLabel label="Franchisee email" required />
              <div className="mt-1">
                <input
                  type="email"
                  value={franchiseeEmail}
                  readOnly
                  className={`${FORM.field} bg-slate-50`}
                  style={{ border: `1.5px solid ${errors.franchiseeEmail ? FORM.error : FORM.fieldBorder}` }}
                />
                {errors.franchiseeEmail && <p className="text-xs text-red-500 mt-1">{errors.franchiseeEmail}</p>}
              </div>
            </div>
          </div>
        )}
        <p className="mt-4 text-[12.5px] leading-relaxed text-slate-500">
          This application is submitted on behalf of the customer whose details you entered above. Your franchise ID is attached so the
          backend can match the application to your account and keep an audit trail of who filed it.
        </p>
      </FormCard>
    </LoanApplicationFormShell>
  );
};

const buildProductSections = (
  app: PersonalLoanApplication,
  franchiseId: string,
  franchiseeName?: string,
  franchiseeMobile?: string,
  franchiseeEmail?: string,
): SuccessSection[] => [
  {
    title: "Submission",
    rows: [
      { label: "Application ID", value: String(app._id) },
      { label: "Product", value: "Personal Loan" },
      { label: "Filed by", value: `Franchise ${franchiseId}` },
      { label: "Franchisee", value: franchiseeName ?? "—" },
      { label: "Franchisee contact", value: [franchiseeMobile, franchiseeEmail].filter(Boolean).join(" · ") ?? "—" },
      { label: "Submitted on", value: new Date(app.createdAt).toLocaleString("en-IN") },
      { label: "Status", value: app.status },
    ] as SuccessRow[],
  },
];

export default LoanFormModalBody;
