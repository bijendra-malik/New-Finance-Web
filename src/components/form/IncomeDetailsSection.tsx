import { FieldError, FieldLabel, AmountField, SelectField, SelectWithOther, TextField, DateField, OtherOptionList } from "./FormControls";
import { BusinessPlaceSection } from "./BusinessPlaceSection";
import { FORM } from "../../constants/formStyles";
import { THEME as C } from "../../constants/theme";
import { MULTIPLE_TRANSACTION_BANKS, OTHER_OPTION, SALARIED, SELF_EMPLOYED_BUSINESS, SELF_EMPLOYED_PROFESSIONAL } from "../../constants/masters";
import type { Masters } from "../../constants/masters";
import { formatGSTIN, formatPAN } from "../../utils/formatters";

export interface IncomeDetailsSlice {
  employmentType: string;
  companyName: string; companyType: string; companyTypeOther: string;
  monthlyNetSalary: number; salaryReceivedAs: string;
  salaryBankName: string; salaryBankNameOther: string;
  profession: string; professionOther: string;
  currentYearTurnover: number; priorYearTurnover: number;
  currentYearNetIncome: number; previousYearNetIncome: number;
  businessType: string; businessTypeOther: string; businessName: string;
  gstNumber: string; companyPanNumber: string;
  natureOfBusiness: string; natureOfBusinessOther: string;
  industryType: string; industryTypeOther: string; subIndustry: string;
  businessEstablishedDate: string;
  transactionBankName: string; transactionBankNameOther: string; transactionBanks: string[];
  lastYearTurnover: number; last2YearsTurnover: number;
  lastYearNetIncome: number; last2YearsNetIncome: number;
  businessState: string; businessCity: string; businessPincode: string;
  businessPlaceStatus: string; businessPlaceStatusOther: string;
}

interface IncomeDetailsSectionProps {
  form: IncomeDetailsSlice;
  errors: Partial<Record<keyof IncomeDetailsSlice, string>>;
  set: (key: keyof IncomeDetailsSlice, value: IncomeDetailsSlice[keyof IncomeDetailsSlice]) => void;
  masters: Masters;
  employmentTypeOptions: readonly string[];
  onEmploymentTypeChange: (value: string) => void;
  onClearTransactionBanks: () => void;
  transactionBankOptions: readonly string[];
  addTransactionBank: (value: string) => void;
  removeTransactionBank: (index: number) => void;
  datePickerPortalId: string;
  loadCities: (state: string) => string[];
  onPincodeResolved: (r: { pincode: string; state: string; city: string }) => void;
  salaryError?: string;
}

const IncomeDetailsSection = ({
  form, errors, set, masters, employmentTypeOptions, onEmploymentTypeChange,
  onClearTransactionBanks, transactionBankOptions, addTransactionBank, removeTransactionBank,
  datePickerPortalId, loadCities, onPincodeResolved, salaryError,
}: IncomeDetailsSectionProps) => (
  <div className={FORM.grid}>
    {form.employmentType === SELF_EMPLOYED_BUSINESS && (
      <div>
        <h3 className="text-sm font-bold mt-2" style={{ color: C.dark }}>Business Details</h3>
      </div>
    )}
    <div id="employmentType"><FieldLabel label="Employment Type" required />
      <SelectField value={form.employmentType} onChange={onEmploymentTypeChange} options={employmentTypeOptions} placeholder="Select" err={errors.employmentType} />
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
          err={salaryError ?? errors.monthlyNetSalary} />
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

    {form.employmentType === SELF_EMPLOYED_PROFESSIONAL && (<>
      <SelectWithOther
        id="profession" label="Profession" required
        value={form.profession} onChange={v => {
          set("profession", v);
          if (v !== OTHER_OPTION) set("professionOther", "");
        }} options={masters.professions} err={errors.profession}
        otherId="professionOther" otherLabel="Mention Profession"
        otherValue={form.professionOther} onOtherChange={v => set("professionOther", v)}
        otherPlaceholder="Enter profession" otherErr={errors.professionOther}
      />
      <div id="currentYearTurnover"><FieldLabel label="Current Year Turn Over" required />
        <AmountField value={form.currentYearTurnover === 0 ? "" : String(form.currentYearTurnover)} onChange={v => set("currentYearTurnover", parseInt(v) || 0)} placeholder="Enter Amount in INR" err={errors.currentYearTurnover} />
      </div>
      <div id="priorYearTurnover"><FieldLabel label="Last (2 Years old) Turnover" required />
        <AmountField value={form.priorYearTurnover === 0 ? "" : String(form.priorYearTurnover)} onChange={v => set("priorYearTurnover", parseInt(v) || 0)} placeholder="Enter Amount in INR" err={errors.priorYearTurnover} />
      </div>
      <div id="currentYearNetIncome"><FieldLabel label="Current Year Net Income" required />
        <AmountField value={form.currentYearNetIncome === 0 ? "" : String(form.currentYearNetIncome)} onChange={v => set("currentYearNetIncome", parseInt(v) || 0)} placeholder="Enter Amount in INR" err={errors.currentYearNetIncome} />
      </div>
      <div id="previousYearNetIncome"><FieldLabel label="Previous Year Net Income" required />
        <AmountField value={form.previousYearNetIncome === 0 ? "" : String(form.previousYearNetIncome)} onChange={v => set("previousYearNetIncome", parseInt(v) || 0)} placeholder="Enter Amount in INR" err={errors.previousYearNetIncome} />
      </div>
    </>)}

    {form.employmentType === SELF_EMPLOYED_BUSINESS && (<>
      <SelectWithOther
        id="businessType" label="Company Type" required
        value={form.businessType} onChange={v => {
          set("businessType", v);
          if (v !== OTHER_OPTION) set("businessTypeOther", "");
        }} options={masters.businessTypes} err={errors.businessType}
        otherId="businessTypeOther" otherLabel="Mention Company Type"
        otherValue={form.businessTypeOther} onOtherChange={v => set("businessTypeOther", v)}
        otherPlaceholder="Enter company type" otherErr={errors.businessTypeOther}
      />
      <div id="businessName"><FieldLabel label="Company Full Name" required />
        <TextField value={form.businessName} onChange={v => set("businessName", v.slice(0, 100))} maxLength={100} placeholder="Registered business / firm name" err={errors.businessName} />
      </div>

      <div id="gstNumber"><FieldLabel label="GST No (if available)" />
        <TextField value={form.gstNumber} onChange={v => set("gstNumber", formatGSTIN(v))} placeholder="Company GST No. – 15-character GSTIN" maxLength={15} err={errors.gstNumber} extraCls="uppercase tracking-wide" />
      </div>
      <div id="companyPanNumber"><FieldLabel label="Company PAN Number" required />
        <TextField value={form.companyPanNumber} onChange={v => set("companyPanNumber", formatPAN(v))} placeholder="ABCDE1234F" maxLength={10} err={errors.companyPanNumber} extraCls="uppercase tracking-widest" />
      </div>
      <SelectWithOther
        id="natureOfBusiness" label="Nature Of Business" required
        value={form.natureOfBusiness} onChange={v => {
          set("natureOfBusiness", v);
          if (v !== OTHER_OPTION) set("natureOfBusinessOther", "");
        }} options={masters.natureOfBusiness} err={errors.natureOfBusiness}
        otherId="natureOfBusinessOther" otherLabel="Mention Nature Of Business"
        otherValue={form.natureOfBusinessOther} onOtherChange={v => set("natureOfBusinessOther", v)}
        otherPlaceholder="Enter nature of business" otherErr={errors.natureOfBusinessOther}
      />

      <SelectWithOther
        id="industryType" label="Industry Type" required
        value={form.industryType} onChange={v => {
          set("industryType", v);
          if (v !== OTHER_OPTION) set("industryTypeOther", "");
          else set("subIndustry", "");
        }} options={masters.industryTypes} err={errors.industryType}
        otherId="industryTypeOther" otherLabel="Mention Industry Type"
        otherValue={form.industryTypeOther} onOtherChange={v => set("industryTypeOther", v)}
        otherPlaceholder="Enter industry type" otherErr={errors.industryTypeOther}
      />
      {form.industryType !== OTHER_OPTION && (
        <div id="subIndustry"><FieldLabel label="Sub Industry" />
          <TextField value={form.subIndustry} onChange={v => set("subIndustry", v)} placeholder="Optional" />
        </div>
      )}

      <div id="businessEstablishedDate"><FieldLabel label="Date Of Business Establishment" required />
        <DateField value={form.businessEstablishedDate} onChange={v => set("businessEstablishedDate", v)}
          err={errors.businessEstablishedDate} maxDate={new Date()} minDate={new Date(new Date().getFullYear() - 100, 0, 1)}
          portalId={datePickerPortalId} />
      </div>

      <div id="transactionBankName"><FieldLabel label="Transaction Bank Name" />
        <SelectField value={form.transactionBankName} onChange={v => {
          set("transactionBankName", v);
          if (v !== OTHER_OPTION) set("transactionBankNameOther", "");
          if (v !== MULTIPLE_TRANSACTION_BANKS) onClearTransactionBanks();
        }} options={transactionBankOptions} placeholder="Select" err={errors.transactionBankName} />
      </div>
      {form.transactionBankName === OTHER_OPTION && (
        <div id="transactionBankNameOther"><FieldLabel label="Mention Bank Name" required />
          <TextField value={form.transactionBankNameOther} onChange={v => set("transactionBankNameOther", v)} placeholder="Enter bank name" err={errors.transactionBankNameOther} />
        </div>
      )}
      {form.transactionBankName === MULTIPLE_TRANSACTION_BANKS && (
        <div className="md:col-span-2 mt-4" id="transactionBanks">
          <OtherOptionList label="Transaction Banks" placeholder="Enter bank name"
            items={form.transactionBanks} onAdd={addTransactionBank} onRemove={removeTransactionBank} color={C.teal} />
          <FieldError msg={errors.transactionBanks} />
        </div>
      )}

      <div id="lastYearTurnover"><FieldLabel label="Last Year Turnover" required />
        <AmountField value={form.lastYearTurnover === 0 ? "" : String(form.lastYearTurnover)} onChange={v => set("lastYearTurnover", parseInt(v) || 0)} placeholder="Enter Amount in INR" err={errors.lastYearTurnover} />
      </div>
      <div id="last2YearsTurnover"><FieldLabel label="Last (2 Years old) Turnover" />
        <AmountField value={form.last2YearsTurnover === 0 ? "" : String(form.last2YearsTurnover)} onChange={v => set("last2YearsTurnover", parseInt(v) || 0)} placeholder="Enter Amount in INR" />
      </div>
      <div id="lastYearNetIncome"><FieldLabel label="Last Year Net Income" required />
        <AmountField value={form.lastYearNetIncome === 0 ? "" : String(form.lastYearNetIncome)} onChange={v => set("lastYearNetIncome", parseInt(v) || 0)} placeholder="Enter Amount in INR" err={errors.lastYearNetIncome} />
      </div>
      <div id="last2YearsNetIncome"><FieldLabel label="Last (2 Years old) Net Income" />
        <AmountField value={form.last2YearsNetIncome === 0 ? "" : String(form.last2YearsNetIncome)} onChange={v => set("last2YearsNetIncome", parseInt(v) || 0)} placeholder="Enter Amount in INR" />
      </div>
    </>)}

    {(form.employmentType === SELF_EMPLOYED_BUSINESS || form.employmentType === SELF_EMPLOYED_PROFESSIONAL) && (
      <BusinessPlaceSection form={form} set={set} errors={errors}
        onPincodeResolved={onPincodeResolved}
        states={masters.states} businessPlaceStatuses={masters.businessPlaceStatuses} loadCities={loadCities} />
    )}
  </div>
);

export default IncomeDetailsSection;
