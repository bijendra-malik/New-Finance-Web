import { useMemo, useState } from "react";
import { useAuth } from "../../../../../context/authContext";
import { FORM } from "../../../../../constants/formStyles";
import { MULTIPLE_TRANSACTION_BANKS, OTHER_OPTION, SALARIED, SELF_EMPLOYED_BUSINESS, SELF_EMPLOYED_PROFESSIONAL } from "../../../../../constants/masters";
import { useMasters } from "../../../../../hooks/useMasters";
import { usePincodeSections } from "../../../../../hooks/usePincodeSections";
import { useApplicationSubmit } from "../../../../../hooks/useApplicationSubmit";
import { useTouchedErrors } from "../../../../../hooks/useTouchedErrors";
import LoanApplicationFormShell from "../../../../../components/form/LoanApplicationFormShell";
import { PersonalDetailsSection } from "../../../../../components/form/PersonalDetailsSection";
import IncomeDetailsSection from "../../../../../components/form/IncomeDetailsSection";
import { ExistingLoanExposureSection } from "../../../../../components/form/ExistingLoanExposureSection";
import { formatIndianNumber } from "../../../../../utils/formatters";
import { GSTIN_REGEX, NAME_REGEX, stripOther, validatePersonalDetails } from "../../../../../utils/validation";
import { AmountField, FieldLabel, FormCard, MORE_THAN_TENURE_OPTION, PincodeInputField, SelectField, TenureYearsField, TextField } from "../../../../../components/form/FormControls";
import { buildProductSections } from "./receiptSections";
import { applyLeaseRental } from "../../../../../api/loanApplications";
import type { LeaseRentalApplication } from "../../../../../api/loanApplications";

// Local type — no backend yet, this is purely the shape used to render the UI success state Type lives in the API layer (aligned with the backend's LeaseRental document); re-exported so the dashboard and LoanStatus imports keep working unchanged.
export type { LeaseRentalApplication } from "../../../../../api/loanApplications";

interface ApplicationFormProps {
  userName?: string;
  userEmail?: string;
  onSubmit?: (id: string, app: LeaseRentalApplication) => void;
}
interface FormData {
  fullName:string; mobile:string; email:string; dob:string; panNumber:string;
  state:string; city:string; pincode:string; residenceStatus:string; residenceStatusOther:string;
  monthlyLeaseIncome:string; totalLeaseAmount:string;
  leasePropertyDuration:string; leasePropertyMarketValue:number; leasePropertyAge:string;
  leasePropertyState:string; leasePropertyCity:string; leasePropertyPincode:string;
  employmentType:string;
  companyName:string; companyType:string; companyTypeOther:string; monthlyNetSalary:number; salaryReceivedAs:string; salaryBankName:string; salaryBankNameOther:string;
  businessName:string; businessType:string; businessTypeOther:string;
  gstNumber:string; companyPanNumber:string; natureOfBusiness:string; natureOfBusinessOther:string;
  industryType:string; industryTypeOther:string; subIndustry:string;
  businessEstablishedDate:string; transactionBankName:string; transactionBankNameOther:string; transactionBanks:string[];
  lastYearTurnover:number; last2YearsTurnover:number;
  lastYearNetIncome:number; last2YearsNetIncome:number;
  profession:string; professionOther:string;
  currentYearTurnover:number; priorYearTurnover:number;
  currentYearNetIncome:number; previousYearNetIncome:number;
  businessState:string; businessCity:string;
  businessPincode:string; businessPlaceStatus:string; businessPlaceStatusOther:string;
  loanAmount:number; loanTenureYears:number; loanTenureYearsCustom:number; existingEMI:string; existingLoanAmount:string;
  existingBanks:string[]; existingLoanTypes:string[]; existingBanksOther:string[]; existingLoanTypesOther:string[];
}

const ApplicationForm = ({userName="",userEmail="",onSubmit}:ApplicationFormProps) => {
  const {user} = useAuth();const { masters, loadCities } = useMasters();
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState<FormData>({
    fullName:user?.name||userName, mobile:user?.mobile||"", email:user?.email||userEmail,
    dob:"", panNumber:"", state:"", city:"", pincode:"", residenceStatus:"", residenceStatusOther:"",
    monthlyLeaseIncome:"", totalLeaseAmount:"",
    leasePropertyDuration:"", leasePropertyMarketValue:0, leasePropertyAge:"",
    leasePropertyState:"", leasePropertyCity:"", leasePropertyPincode:"",
    employmentType:"",
    companyName:"", companyType:"", companyTypeOther:"", monthlyNetSalary:0, salaryReceivedAs:"", salaryBankName:"", salaryBankNameOther:"",
    businessName:"", businessType:"", businessTypeOther:"",
    gstNumber:"", companyPanNumber:"", natureOfBusiness:"", natureOfBusinessOther:"",
    industryType:"", industryTypeOther:"", subIndustry:"",
    businessEstablishedDate:"", transactionBankName:"", transactionBankNameOther:"", transactionBanks:[],
    lastYearTurnover:0, last2YearsTurnover:0, lastYearNetIncome:0, last2YearsNetIncome:0,
    profession:"", professionOther:"",
    currentYearTurnover:0, priorYearTurnover:0, currentYearNetIncome:0, previousYearNetIncome:0,
    businessState:"", businessCity:"",
    businessPincode:"", businessPlaceStatus:"", businessPlaceStatusOther:"",
    loanAmount:0, loanTenureYears:0, loanTenureYearsCustom:0, existingEMI:"", existingLoanAmount:"",
    existingBanks:[], existingLoanTypes:[], existingBanksOther:[], existingLoanTypesOther:[],
  });

  // Banks/loan-type pills unlock only once some existing-loan exposure is entered.
  const employmentTypeOptions = useMemo(
    () => [...masters.leaseRentalEmploymentTypes],
    [masters.leaseRentalEmploymentTypes]
  );

const hasExposure = parseInt(form.existingEMI) > 0 || parseInt(form.existingLoanAmount) > 0;
  // Inverse pill gate: if any existing-loan bank/type pill is selected, some exposure must be entered.
  const pillBanksSelected = [form.existingBanks].some(a=>a.length>0);
  const pillLoanTypesSelected = [form.existingLoanTypes].some(a=>a.length>0);

  const { onPincodeResolved, mismatchErrors } = usePincodeSections({ set: (key, value) => set(key as keyof FormData, value), loadCities, sections: ["residence", "business", "leaseProperty"] });

  const leasePropertyCityOptions = useMemo(
    () => loadCities(form.leasePropertyState),
    [form.leasePropertyState, loadCities]
  );

  const transactionBankOptions = useMemo(() => {
    const banks = masters.banks.filter(b=>b!==OTHER_OPTION);
    return [...banks, MULTIPLE_TRANSACTION_BANKS, OTHER_OPTION];
  }, [masters.banks]);

  const set = (f:keyof FormData, v:FormData[keyof FormData]) => {
    setForm(p=>({...p,[f]:v}));
    touch(f);
  };

  const employmentBranchFields: (keyof FormData)[] = [
    "companyName", "companyType", "companyTypeOther", "monthlyNetSalary", "salaryReceivedAs", "salaryBankName", "salaryBankNameOther",
    "businessName", "businessType", "businessTypeOther",
    "gstNumber", "companyPanNumber", "natureOfBusiness", "natureOfBusinessOther",
    "industryType", "industryTypeOther", "subIndustry",
    "businessEstablishedDate", "transactionBankName", "transactionBankNameOther", "transactionBanks",
    "lastYearTurnover", "last2YearsTurnover", "lastYearNetIncome", "last2YearsNetIncome",
    "profession", "professionOther",
    "currentYearTurnover", "priorYearTurnover", "currentYearNetIncome", "previousYearNetIncome",
  ];

  const setEmploymentType = (v:string) => {
    setForm(p=>({
      ...p, employmentType:v,
      companyName:"", companyType:"", companyTypeOther:"", monthlyNetSalary:0, salaryReceivedAs:"", salaryBankName:"", salaryBankNameOther:"",
      businessName:"", businessType:"", businessTypeOther:"",
      gstNumber:"", companyPanNumber:"", natureOfBusiness:"", natureOfBusinessOther:"",
      industryType:"", industryTypeOther:"", subIndustry:"",
      businessEstablishedDate:"", transactionBankName:"", transactionBankNameOther:"", transactionBanks:[],
      lastYearTurnover:0, last2YearsTurnover:0, lastYearNetIncome:0, last2YearsNetIncome:0,
      profession:"", professionOther:"",
      currentYearTurnover:0, priorYearTurnover:0, currentYearNetIncome:0, previousYearNetIncome:0,
    }));
    touch("employmentType");
    untouch(employmentBranchFields);
  };

  const addTransactionBank = (value:string) =>
    setForm(p=>({...p, transactionBanks:[...p.transactionBanks, value]}));
  const removeTransactionBank = (idx:number) =>
    setForm(p=>({...p, transactionBanks:p.transactionBanks.filter((_,i)=>i!==idx)}));

// ── Shared validation constants (used by computeErrors below) ──

  const computeErrors = (draft:FormData = form) => {
    const e:Partial<Record<keyof FormData,string>> = {};
    // Pincode ↔ State/City consistency (15) and duplicate-application detection (16) are enforced server-side; the frontend validates the pincode format itself below.
    if(draft.loanAmount<100000) e.loanAmount="Minimum ₹1,00,000";
    else if(draft.loanAmount>20000000) e.loanAmount="Maximum loan amount is ₹2,00,00,000";
    if(!draft.loanTenureYears) e.loanTenureYears="Select loan tenure";
    else if(draft.loanTenureYears===MORE_THAN_TENURE_OPTION&&(form.loanTenureYearsCustom<=15||form.loanTenureYearsCustom>25)) e.loanTenureYearsCustom=form.loanTenureYearsCustom>25?"Tenure cannot exceed 25 years":"Enter a tenure greater than 15 years";

    if(!draft.leasePropertyState) e.leasePropertyState="Lease property state is required";
    if(!draft.leasePropertyCity) e.leasePropertyCity="Lease property city is required";
    if(!draft.leasePropertyPincode) e.leasePropertyPincode="Lease property pincode is required";
    else if(!/^[1-9]\d{5}$/.test(draft.leasePropertyPincode)) e.leasePropertyPincode="Enter valid 6-digit pincode";
    if(draft.leasePropertyMarketValue>1000000000) e.leasePropertyMarketValue="Market value cannot exceed ₹1,00,00,00,000";
    if(parseInt(draft.leasePropertyAge)>150) e.leasePropertyAge="Property age cannot exceed 150 years";

    if(!draft.existingEMI.trim()) e.existingEMI="Existing Total EMI is required (enter 0 if none)";
    if(!draft.existingLoanAmount.trim()) e.existingLoanAmount="Existing Loan Amount is required (enter 0 if none)";
    else if(parseInt(draft.existingEMI)>parseInt(draft.existingLoanAmount)) e.existingEMI="Existing Total EMI cannot be greater than Existing Loan Amount (Total)";
    if((pillBanksSelected||pillLoanTypesSelected)&&!hasExposure) e.existingEMI="Since existing loan banks/types are selected, existing EMI or existing loan amount must be greater than 0 (unselect both if you have no existing loans)";

    if(!draft.employmentType) e.employmentType="Employment type is required";

    if(draft.employmentType===SALARIED){
      if(!draft.companyName.trim()) e.companyName="Company name is required";
      else if(!NAME_REGEX.test(draft.companyName.trim())) e.companyName="Name must be at least 2 characters and contain only letters, spaces, dots or hyphens";
      if(!draft.companyType) e.companyType="Company type is required";
      else if(draft.companyType===OTHER_OPTION&&!draft.companyTypeOther.trim()) e.companyTypeOther="Please mention company type";
      if(!draft.monthlyNetSalary) e.monthlyNetSalary="Monthly net salary is required";
      else if(draft.monthlyNetSalary<=12000) e.monthlyNetSalary="Monthly income should be greater than 12,000";
      else if(parseInt(draft.existingEMI)>=draft.monthlyNetSalary*0.7) e.existingEMI=`Total monthly EMI should not be more than ₹${formatIndianNumber(String(Math.floor(draft.monthlyNetSalary*0.7)))}`; // 70% FOIR rule
      if(!draft.salaryReceivedAs) e.salaryReceivedAs="Select how salary is received";
      else if(draft.salaryReceivedAs!=="Cash"){
        if(!draft.salaryBankName) e.salaryBankName="Select salary bank name";
        else if(draft.salaryBankName===OTHER_OPTION&&!draft.salaryBankNameOther.trim()) e.salaryBankNameOther="Please mention salary bank name";
      }
    }

    if(draft.employmentType===SELF_EMPLOYED_BUSINESS){
      if(!draft.businessName.trim()) e.businessName="Company full name is required";
      else if(!NAME_REGEX.test(draft.businessName.trim())) e.businessName="Name must be at least 2 characters and contain only letters, spaces, dots or hyphens";
      if(!draft.businessType) e.businessType="Company type is required";
      else if(draft.businessType===OTHER_OPTION&&!draft.businessTypeOther.trim()) e.businessTypeOther="Please mention company type";

      if(draft.gstNumber.trim()&&!GSTIN_REGEX.test(draft.gstNumber.toUpperCase())) e.gstNumber="Enter a valid GST number (15-character GSTIN)";
      const lastYearGstBase = Math.max(draft.lastYearTurnover, draft.currentYearTurnover, draft.priorYearTurnover);
      if(lastYearGstBase>=4000000&&!draft.gstNumber.trim()) e.gstNumber="GST number is required for annual turnover of ₹40 lakh or more";
      if(!draft.companyPanNumber.trim()) e.companyPanNumber="Company PAN Number is required";
      else if(!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(draft.companyPanNumber.toUpperCase())) e.companyPanNumber="Invalid PAN format";
      if(!draft.natureOfBusiness) e.natureOfBusiness="Nature of business is required";
      else if(draft.natureOfBusiness===OTHER_OPTION&&!draft.natureOfBusinessOther.trim()) e.natureOfBusinessOther="Please mention nature of business";
      if(!draft.industryType) e.industryType="Industry type is required";
      else if(draft.industryType===OTHER_OPTION&&!draft.industryTypeOther.trim()) e.industryTypeOther="Please mention industry type";
      if(!draft.businessEstablishedDate) e.businessEstablishedDate="Date of business establishment is required";
      else if(new Date(draft.businessEstablishedDate+"T00:00:00")>new Date()) e.businessEstablishedDate="Business establishment date cannot be in the future";
      if(draft.transactionBankName===OTHER_OPTION&&!draft.transactionBankNameOther.trim()) e.transactionBankNameOther="Please mention bank name";
      else if(draft.transactionBankName===MULTIPLE_TRANSACTION_BANKS&&draft.transactionBanks.length===0) e.transactionBanks="Please add at least one bank";
      if(!draft.lastYearTurnover) e.lastYearTurnover="Last year turnover is required";
      else if(draft.lastYearTurnover>10000000000) e.lastYearTurnover="Last year turnover cannot exceed ₹1,00,00,00,000";
      if(draft.lastYearTurnover&&draft.lastYearNetIncome>draft.lastYearTurnover) e.lastYearNetIncome="Last year net income cannot be greater than last year turnover";
      if(draft.last2YearsTurnover>10000000000) e.last2YearsTurnover="Turnover cannot exceed ₹1,00,00,00,000";
      if(!draft.lastYearNetIncome) e.lastYearNetIncome="Annual income cannot be zero";
    }

    if(draft.employmentType===SELF_EMPLOYED_PROFESSIONAL){
      if(!draft.profession) e.profession="Profession is required";
      else if(draft.profession===OTHER_OPTION&&!draft.professionOther.trim()) e.professionOther="Please mention profession";
      if(!draft.currentYearTurnover) e.currentYearTurnover="Current year turnover is required";
      else if(draft.currentYearTurnover>10000000000) e.currentYearTurnover="Current year turnover cannot exceed ₹1,00,00,00,000";
      if(draft.currentYearTurnover&&draft.currentYearNetIncome>draft.currentYearTurnover) e.currentYearNetIncome="Current year net income cannot be greater than current year turnover";
      if(!draft.priorYearTurnover) e.priorYearTurnover="Last (2 years old) turnover is required";
      else if(draft.priorYearTurnover>10000000000) e.priorYearTurnover="Last (2 years old) turnover cannot exceed ₹1,00,00,00,000";
      if(draft.priorYearTurnover&&draft.previousYearNetIncome>draft.priorYearTurnover) e.previousYearNetIncome="Previous year net income cannot be greater than prior year turnover";
      if(!draft.currentYearNetIncome) e.currentYearNetIncome="Current year net income is required";
      if(!draft.previousYearNetIncome) e.previousYearNetIncome="Previous year net income is required";
    }

    if(draft.employmentType===SELF_EMPLOYED_BUSINESS||draft.employmentType===SELF_EMPLOYED_PROFESSIONAL){
      if(!draft.businessState) e.businessState="Business state is required";
      if(!draft.businessCity) e.businessCity="Business city is required";
      if(!draft.businessPincode) e.businessPincode="Business pincode is required";
      else if(!/^[1-9]\d{5}$/.test(draft.businessPincode)) e.businessPincode="Enter valid 6-digit pincode";
      if(!draft.businessPlaceStatus) e.businessPlaceStatus="Status of business place is required";
      else if(draft.businessPlaceStatus===OTHER_OPTION&&!draft.businessPlaceStatusOther.trim()) e.businessPlaceStatusOther="Please mention status of business place";
    }

    validatePersonalDetails(draft, e);

  Object.assign(e, mismatchErrors(draft));
  return e;
  };

  const allErrors = computeErrors();
  const { errors, touch, markAllTouched, untouch } = useTouchedErrors<keyof FormData>(allErrors);

  const {
    isSubmitting, apiError, submitAttempted, submitted, submittedApp,
    showFormAfterSubmit, setShowFormAfterSubmit, handleSubmit,
  } = useApplicationSubmit<LeaseRentalApplication>({
    computeErrors, markAllTouched, agreed,
    submit: async () => {
          const app = {
            fullName:form.fullName, mobile:form.mobile, email:form.email,
            dob:new Date(form.dob).toISOString(), panNumber:form.panNumber.toUpperCase(),
            state:form.state, city:form.city, pincode:form.pincode,
            residenceStatus:form.residenceStatus===OTHER_OPTION?OTHER_OPTION:form.residenceStatus,
            residenceStatusOther:form.residenceStatus===OTHER_OPTION?(form.residenceStatusOther.trim()||undefined):undefined,
            monthlyLeaseIncome:parseInt(form.monthlyLeaseIncome)||0, totalLeaseAmount:parseInt(form.totalLeaseAmount)||0,
            leasePropertyDuration:parseInt(form.leasePropertyDuration)||0,
            leasePropertyMarketValue:form.leasePropertyMarketValue,
            leasePropertyAge:parseInt(form.leasePropertyAge)||0,
            leasePropertyState:form.leasePropertyState,
            leasePropertyCity:form.leasePropertyCity,
            leasePropertyPincode:form.leasePropertyPincode,
            employmentType:form.employmentType,
            companyName:form.employmentType===SALARIED?form.companyName:undefined,
            companyType:form.employmentType===SALARIED
              ?(form.companyType===OTHER_OPTION?OTHER_OPTION:form.companyType)
              :undefined,
              companyTypeOther:form.employmentType===SALARIED
              ?(form.companyType===OTHER_OPTION?(form.companyTypeOther.trim()||undefined):undefined)
              :undefined,
            monthlyNetSalary:form.employmentType===SALARIED?form.monthlyNetSalary:undefined,
            salaryReceivedAs:form.employmentType===SALARIED?form.salaryReceivedAs:undefined,
            salaryBankName:form.employmentType===SALARIED&&form.salaryReceivedAs!=="Cash"
              ?(form.salaryBankName===OTHER_OPTION?OTHER_OPTION:form.salaryBankName)
              :undefined,
              salaryBankNameOther:form.employmentType===SALARIED&&form.salaryReceivedAs!=="Cash"
              ?(form.salaryBankName===OTHER_OPTION?(form.salaryBankNameOther.trim()||undefined):undefined)
              :undefined,
            businessName:form.employmentType===SELF_EMPLOYED_BUSINESS?form.businessName:undefined,
            businessType:form.employmentType===SELF_EMPLOYED_BUSINESS
              ?(form.businessType===OTHER_OPTION?OTHER_OPTION:form.businessType)
              :undefined,
              businessTypeOther:form.employmentType===SELF_EMPLOYED_BUSINESS
              ?(form.businessType===OTHER_OPTION?(form.businessTypeOther.trim()||undefined):undefined)
              :undefined,
            gstNumber:form.employmentType===SELF_EMPLOYED_BUSINESS?(form.gstNumber.trim()?form.gstNumber.toUpperCase():undefined):undefined,
            companyPanNumber:form.employmentType===SELF_EMPLOYED_BUSINESS?form.companyPanNumber.toUpperCase():undefined,
            natureOfBusiness:form.employmentType===SELF_EMPLOYED_BUSINESS
              ?(form.natureOfBusiness===OTHER_OPTION?OTHER_OPTION:form.natureOfBusiness)
              :undefined,
              natureOfBusinessOther:form.employmentType===SELF_EMPLOYED_BUSINESS
              ?(form.natureOfBusiness===OTHER_OPTION?(form.natureOfBusinessOther.trim()||undefined):undefined)
              :undefined,
            industryType:form.employmentType===SELF_EMPLOYED_BUSINESS
              ?(form.industryType===OTHER_OPTION?OTHER_OPTION:form.industryType)
              :undefined,
              industryTypeOther:form.employmentType===SELF_EMPLOYED_BUSINESS
              ?(form.industryType===OTHER_OPTION?(form.industryTypeOther.trim()||undefined):undefined)
              :undefined,
            subIndustry:form.employmentType===SELF_EMPLOYED_BUSINESS?(form.subIndustry.trim()||undefined):undefined,
            businessEstablishedDate:form.employmentType===SELF_EMPLOYED_BUSINESS&&form.businessEstablishedDate
              ?new Date(form.businessEstablishedDate).toISOString()
              :undefined,
            transactionBankName:form.employmentType===SELF_EMPLOYED_BUSINESS
              ?(form.transactionBankName===OTHER_OPTION?OTHER_OPTION:form.transactionBankName===MULTIPLE_TRANSACTION_BANKS?(form.transactionBanks.length>0?form.transactionBanks.join(", "):MULTIPLE_TRANSACTION_BANKS):form.transactionBankName||undefined)
              :undefined,
              transactionBankOther:form.employmentType===SELF_EMPLOYED_BUSINESS&&form.transactionBankName===OTHER_OPTION
              ?(form.transactionBankNameOther.trim()||undefined)
              :undefined,
            transactionBanks:form.employmentType===SELF_EMPLOYED_BUSINESS&&form.transactionBankName===MULTIPLE_TRANSACTION_BANKS
              ?form.transactionBanks
              :undefined,
            lastYearTurnover:form.employmentType===SELF_EMPLOYED_BUSINESS?form.lastYearTurnover:undefined,
            last2YearsTurnover:form.employmentType===SELF_EMPLOYED_BUSINESS?form.last2YearsTurnover:undefined,
            lastYearNetIncome:form.employmentType===SELF_EMPLOYED_BUSINESS?form.lastYearNetIncome:undefined,
            last2YearsNetIncome:form.employmentType===SELF_EMPLOYED_BUSINESS?form.last2YearsNetIncome:undefined,
            profession:form.employmentType===SELF_EMPLOYED_PROFESSIONAL
              ?(form.profession===OTHER_OPTION?OTHER_OPTION:form.profession)
              :undefined,
              professionOther:form.employmentType===SELF_EMPLOYED_PROFESSIONAL
              ?(form.profession===OTHER_OPTION?(form.professionOther.trim()||undefined):undefined)
              :undefined,
            currentYearTurnover:form.employmentType===SELF_EMPLOYED_PROFESSIONAL?form.currentYearTurnover:undefined,
            priorYearTurnover:form.employmentType===SELF_EMPLOYED_PROFESSIONAL?form.priorYearTurnover:undefined,
            currentYearNetIncome:form.employmentType===SELF_EMPLOYED_PROFESSIONAL?form.currentYearNetIncome:undefined,
            previousYearNetIncome:form.employmentType===SELF_EMPLOYED_PROFESSIONAL?form.previousYearNetIncome:undefined,
            businessState:(form.employmentType===SELF_EMPLOYED_BUSINESS||form.employmentType===SELF_EMPLOYED_PROFESSIONAL)?form.businessState:undefined,
            businessCity:(form.employmentType===SELF_EMPLOYED_BUSINESS||form.employmentType===SELF_EMPLOYED_PROFESSIONAL)
              ?form.businessCity
              :undefined,
            businessPincode:(form.employmentType===SELF_EMPLOYED_BUSINESS||form.employmentType===SELF_EMPLOYED_PROFESSIONAL)
              ?(form.businessPincode)
              :undefined,
            businessPlaceStatus:(form.employmentType===SELF_EMPLOYED_BUSINESS||form.employmentType===SELF_EMPLOYED_PROFESSIONAL)
              ?(form.businessPlaceStatus===OTHER_OPTION?OTHER_OPTION:form.businessPlaceStatus)
              :undefined,
              businessPlaceStatusOther:(form.employmentType===SELF_EMPLOYED_BUSINESS||form.employmentType===SELF_EMPLOYED_PROFESSIONAL)
              ?(form.businessPlaceStatus===OTHER_OPTION?(form.businessPlaceStatusOther.trim()||undefined):undefined)
              :undefined,
            loanAmount:form.loanAmount,
            loanTenure:(form.loanTenureYears===MORE_THAN_TENURE_OPTION?form.loanTenureYearsCustom:form.loanTenureYears)*12,
            existingEMI:parseInt(form.existingEMI)||0, existingLoanAmount:parseInt(form.existingLoanAmount)||0,
            existingBanks:stripOther(form.existingBanks), otherBankList:form.existingBanksOther,
            existingLoanTypes:stripOther(form.existingLoanTypes), otherLoanList:form.existingLoanTypesOther,
          };
          const res = await applyLeaseRental(app);
      return res.data;
    },
    onSubmitSuccess: onSubmit,
  });

  return (
    <LoanApplicationFormShell
      productName="Lease Rental Discounting"
      headline="Unlock the best Lease Rental Discounting offers suitable for your needs from 43+ lenders"
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

      {/* LOAN REQUIREMENTS */}
      <FormCard title="Loan Requirements" subtitle="How much do you need and for how long?">
        <div className={FORM.grid}>
          <div id="loanAmount"><FieldLabel label="Required Loan Amount" required/>
            <AmountField value={form.loanAmount===0?"":String(form.loanAmount)} onChange={v=>set("loanAmount",parseInt(v)||0)} placeholder="Enter Amount in INR" err={errors.loanAmount}/>
          </div>
          <TenureYearsField
            id="loanTenureYears" label="Required Loan Tenure (in years)"
            value={form.loanTenureYears} onChange={v=>set("loanTenureYears",v)}
            customValue={form.loanTenureYearsCustom} onCustomChange={v=>set("loanTenureYearsCustom",v)}
            options={masters.leaseRentalTenureYears} maxYears={25} err={errors.loanTenureYears} customErr={errors.loanTenureYearsCustom}
          />
          <div id="monthlyLeaseIncome"><FieldLabel label="Monthly Income Through Lease"/>
            <AmountField value={form.monthlyLeaseIncome} onChange={v=>set("monthlyLeaseIncome",v.replace(/\D/g,""))} placeholder="Enter Amount in INR"/>
          </div>
          <div id="totalLeaseAmount"><FieldLabel label="Total Amount To Be Received From Lease"/>
            <AmountField value={form.totalLeaseAmount} onChange={v=>set("totalLeaseAmount",v.replace(/\D/g,""))} placeholder="Enter Amount in INR"/>
          </div>
          <div id="leasePropertyDuration"><FieldLabel label="Lease Property Duration"/>
            <TextField type="number" value={form.leasePropertyDuration} onChange={v=>set("leasePropertyDuration",v.replace(/\D/g,""))} placeholder="In years"/>
          </div>
          <div id="leasePropertyMarketValue"><FieldLabel label="Lease Property Market Value (Approx)"/>
            <AmountField value={form.leasePropertyMarketValue===0?"":String(form.leasePropertyMarketValue)} onChange={v=>set("leasePropertyMarketValue",parseInt(v)||0)} placeholder="Enter Amount in INR"/>
          </div>
          <div id="leasePropertyAge"><FieldLabel label="Lease Property Age"/>
            <TextField type="number" value={form.leasePropertyAge} onChange={v=>set("leasePropertyAge",v.replace(/\D/g,""))} placeholder="In Years"/>
          </div>
          <div id="leasePropertyState"><FieldLabel label="Lease Property State" required/>
            <SelectField value={form.leasePropertyState} onChange={v=>{
              set("leasePropertyState",v); set("leasePropertyCity",""); loadCities(v);
            }} options={masters.states} placeholder="Select" err={errors.leasePropertyState}/>
          </div>
          <div id="leasePropertyCity"><FieldLabel label="Lease Property City" required/>
            <SelectField value={form.leasePropertyCity} onChange={v=>set("leasePropertyCity",v)}
              options={leasePropertyCityOptions} placeholder={form.leasePropertyState?"Select city":"Select state first"} disabled={!form.leasePropertyState} err={errors.leasePropertyCity}/>
          </div>
          <PincodeInputField
            id="leasePropertyPincode" label="Lease Property Pincode"
            value={form.leasePropertyPincode} onChange={v=>set("leasePropertyPincode",v)}
 onResolved={r=>onPincodeResolved("leaseProperty",r)} err={errors.leasePropertyPincode}
          />
        </div>
      </FormCard>

      {/* INCOME DETAILS */}
            <FormCard title="Income Details" subtitle="Tell us about your employment and income">
        <IncomeDetailsSection
          form={form}
          errors={errors}
          set={set}
          masters={masters}
          employmentTypeOptions={employmentTypeOptions}
          onEmploymentTypeChange={setEmploymentType}
          onClearTransactionBanks={() => setForm(p => ({ ...p, transactionBanks: [] }))}
          transactionBankOptions={transactionBankOptions}
          addTransactionBank={addTransactionBank}
          removeTransactionBank={removeTransactionBank}
          datePickerPortalId="business-established-datepicker-portal"
          loadCities={loadCities}
          onPincodeResolved={r => onPincodeResolved("business", r)}
          salaryError={errors.monthlyNetSalary || (form.monthlyNetSalary > 0 && form.monthlyNetSalary <= 12000 ? "Monthly income should be greater than 12,000" : undefined)}
        />
      </FormCard>

      <ExistingLoanExposureSection form={form} set={(key, value) => set(key, value)} errors={errors}
        mergeForm={patch => setForm(p => ({ ...p, ...patch }))}
        banks={masters.banks} existingLoanTypes={masters.existingLoanTypes} />

      <PersonalDetailsSection form={form} set={(key, value) => set(key, value)} errors={errors}
        onPincodeResolved={r=>onPincodeResolved("residence",r)}
        states={masters.states} residenceStatuses={masters.residenceStatuses} loadCities={loadCities} />

    </LoanApplicationFormShell>
  );
};

export default ApplicationForm;
