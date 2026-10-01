import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../../context/authContext";
import { applyHomeLoan } from "../../../../../api/loanApplications";
import type { HomeLoanApplication } from "../../../../../api/loanApplications";
import { getApiErrorMessage } from "../../../../../utils/apiError";
import { THEME as C } from "../../../../../constants/theme";
import { MULTIPLE_TRANSACTION_BANKS, OTHER_OPTION, SALARIED, SELF_EMPLOYED_BUSINESS, SELF_EMPLOYED_PROFESSIONAL } from "../../../../../constants/masters";
import { addCustomBankName } from "../../../../../api/masters";
import { useMasters } from "../../../../../hooks/useMasters";
import { usePincodeSections } from "../../../../../hooks/usePincodeSections";
import { PersonalDetailsSection } from "../../../../../components/form/PersonalDetailsSection";
import SubmissionSuccess from "../../../../../components/form/SubmissionSuccess";
import { ConsentAndSubmit, SubmittedReceiptBanner, SubmittedFormBanner } from "../../../../../components/form/SubmitSection";
import { formatGSTIN, formatIndianNumber, formatPAN } from "../../../../../utils/formatters";
import { GSTIN_REGEX, NAME_REGEX, validatePersonalDetails } from "../../../../../utils/validation";
import { AmountField, DateField, FieldError, FieldLabel, FormCard, OtherOptionList, PillMultiSelect, PincodeInputField, SelectField, SelectWithOther, TextField } from "../../../../../components/form/FormControls";
import { buildProductSections } from "./receiptSections";

// Type lives in the API layer now (aligned with the backend's HomeLoan document);
// re-exported so the dashboard and LoanStatus imports keep working unchanged.
export type { HomeLoanApplication };


interface ApplicationFormProps {
  userName?: string;
  userEmail?: string;
  onSubmit?: (id: string, app: HomeLoanApplication) => void;
}
interface FormData {
  fullName:string; mobile:string; email:string; dob:string; panNumber:string;
  state:string; city:string; pincode:string; residenceStatus:string; residenceStatusOther:string;
  buyingPropertyType:string; buyingPropertyTypeOther:string; buyingPropertyAge:string;
  buyingPropertyState:string; buyingPropertyCity:string; buyingPropertyPincode:string;
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
  loanAmount:number; loanTenureYears:number; existingEMI:string; existingLoanAmount:string;
  existingBanks:string[]; existingLoanTypes:string[]; existingBanksOther:string[]; existingLoanTypesOther:string[];
}

const ApplicationForm = ({userName="",userEmail="",onSubmit}:ApplicationFormProps) => {
  const {user} = useAuth();
  const {masters, loadCities, getEmploymentTypesFor} = useMasters();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<HomeLoanApplication|null>(null);
  // After submission: "receipt" view first; "Back to Application Form" returns to the filled form.
  const [showFormAfterSubmit, setShowFormAfterSubmit] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState<FormData>({
    fullName:user?.name||userName, mobile:user?.mobile||"", email:user?.email||userEmail,
    dob:"", panNumber:"", state:"", city:"", pincode:"", residenceStatus:"", residenceStatusOther:"",
    buyingPropertyType:"", buyingPropertyTypeOther:"", buyingPropertyAge:"",
    buyingPropertyState:"", buyingPropertyCity:"", buyingPropertyPincode:"",
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
    loanAmount:0, loanTenureYears:0, existingEMI:"", existingLoanAmount:"",
    existingBanks:[], existingLoanTypes:[], existingBanksOther:[], existingLoanTypesOther:[],
  });
  const [touched, setTouched] = useState<Partial<Record<keyof FormData,boolean>>>({});

  // Banks/loan-type pills unlock only once some existing-loan exposure is entered.
  // Employment types come from the backend per loan type, with the local
  // constants list as fallback while/if the loan type is not registered.
  const [employmentTypesState, setEmploymentTypesState] = useState<string[]>([]);
  useEffect(() => {
    let cancelled = false;
    getEmploymentTypesFor("home", "homeEmploymentTypes")
      .then(types => { if (!cancelled) setEmploymentTypesState(types); })
      .catch(() => { /* fallback already returned by the helper */ });
    return () => { cancelled = true; };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const employmentTypeOptions = useMemo(
    () => (employmentTypesState.length > 0 ? employmentTypesState : [...masters.homeEmploymentTypes]),
    [employmentTypesState, masters.homeEmploymentTypes]
  );

const hasExposure = parseInt(form.existingEMI) > 0 || parseInt(form.existingLoanAmount) > 0;
  // Inverse pill gate: if any existing-loan bank/type pill is selected, some exposure must be entered.
  const pillBanksSelected = [form.existingBanks].some(a=>a.length>0);
  const pillLoanTypesSelected = [form.existingLoanTypes].some(a=>a.length>0);

  const { onPincodeResolved, mismatchErrors } = usePincodeSections({ set: (key, value) => set(key as keyof FormData, value), loadCities, sections: ["residence", "business", "buyingProperty"] });


  const buyingPropertyCityOptions = useMemo(
    () => loadCities(form.buyingPropertyState),
    [form.buyingPropertyState, loadCities]
  );

  const businessCityOptions = useMemo(
    () => loadCities(form.businessState),
    [form.businessState, loadCities]
  );

  const transactionBankOptions = useMemo(() => {
    const banks = masters.banks.filter(b=>b!==OTHER_OPTION);
    return [...banks, MULTIPLE_TRANSACTION_BANKS, OTHER_OPTION];
  }, [masters.banks]);

  const addOtherBank = (value:string) =>
    setForm(p=>({...p, existingBanksOther:[...p.existingBanksOther, value]}));
  const removeOtherBank = (idx:number) =>
    setForm(p=>({...p, existingBanksOther:p.existingBanksOther.filter((_,i)=>i!==idx)}));

  const addOtherLoanType = (value:string) =>
    setForm(p=>({...p, existingLoanTypesOther:[...p.existingLoanTypesOther, value]}));
  const removeOtherLoanType = (idx:number) =>
    setForm(p=>({...p, existingLoanTypesOther:p.existingLoanTypesOther.filter((_,i)=>i!==idx)}));

  const set = (f:keyof FormData, v:FormData[keyof FormData]) => {
    setForm(p=>({...p,[f]:v}));
    setTouched(p=>(p[f]?p:{...p,[f]:true}));
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
    "businessState", "businessCity", "businessPincode", "businessPlaceStatus", "businessPlaceStatusOther",
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
      businessState:"", businessCity:"",
      businessPincode:"", businessPlaceStatus:"", businessPlaceStatusOther:"",
    }));
    setTouched(p=>{
      const next = {...p, employmentType:true};
      for(const f of employmentBranchFields) delete next[f];
      return next;
    });
  };

  const addTransactionBank = (value:string) =>
    setForm(p=>({...p, transactionBanks:[...p.transactionBanks, value]}));
  const removeTransactionBank = (idx:number) =>
    setForm(p=>({...p, transactionBanks:p.transactionBanks.filter((_,i)=>i!==idx)}));

// ── Shared validation constants (used by computeErrors below) ──

  const computeErrors = (draft:FormData = form) => {
    const e:Partial<Record<keyof FormData,string>> = {};
    // Pincode ↔ State/City consistency (15) and duplicate-application
    // detection (16) are enforced server-side; the frontend validates the
    // pincode format itself below.
    if(draft.loanAmount<100000) e.loanAmount="Minimum ₹1,00,000";
    else if(draft.loanAmount>100000000) e.loanAmount="Maximum loan amount is ₹10,00,00,000";
    if(!draft.loanTenureYears) e.loanTenureYears="Enter loan tenure";
    else if(draft.loanTenureYears<3) e.loanTenureYears="Minimum loan tenure is 3 years";
    else if(draft.loanTenureYears>35) e.loanTenureYears="Maximum loan tenure is 35 years";

    if(!draft.buyingPropertyType) e.buyingPropertyType="Buying property type is required";
    else if(draft.buyingPropertyType===OTHER_OPTION&&!draft.buyingPropertyTypeOther.trim()) e.buyingPropertyTypeOther="Please mention buying property type";
    if(!draft.buyingPropertyAge.trim()) e.buyingPropertyAge="Buying property age is required (enter 0 if new/under construction)";
    if(!draft.buyingPropertyState) e.buyingPropertyState="Buying property state is required";
    if(!draft.buyingPropertyCity) e.buyingPropertyCity="Buying property city is required";
    if(!draft.buyingPropertyPincode) e.buyingPropertyPincode="Buying property pincode is required";
    else if(!/^[1-9]\d{5}$/.test(draft.buyingPropertyPincode)) e.buyingPropertyPincode="Enter valid 6-digit pincode";

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
      else if(parseInt(draft.existingEMI)>=draft.monthlyNetSalary*0.7) e.existingEMI=`Total monthly EMI should not be more than ₹${formatIndianNumber(String(Math.floor(draft.monthlyNetSalary*0.7)))} (70% of your net monthly salary)`; // 70% FOIR rule
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
  const errors:Partial<Record<keyof FormData,string>> = {};
  (Object.keys(touched) as (keyof FormData)[]).forEach(k=>{ if(touched[k]&&allErrors[k]) errors[k]=allErrors[k]; });

  // No backend yet — validate, then build the confirmation view purely from local state.
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if(!agreed){ setApiError("Please accept the Terms of Use and Privacy Policy to continue."); return; }
    const errs = computeErrors();
    if(Object.keys(errs).length>0){
      setTouched(p=>{
        const next = {...p};
        (Object.keys(errs) as (keyof FormData)[]).forEach(k=>{ next[k]=true; });
        return next;
      });
      setSubmitAttempted(true); setApiError("");
      document.getElementById(Object.keys(errs)[0])?.scrollIntoView({behavior:"smooth",block:"center"});
      return;
    }
    setSubmitAttempted(false);
    setIsSubmitting(true); setApiError("");
    try {
      if(form.existingBanksOther.length>0){
        await Promise.allSettled(form.existingBanksOther.map(b=>addCustomBankName(b)));
      }
      const res = await applyHomeLoan({
      fullName:form.fullName, mobile:form.mobile, email:form.email,
      dob:new Date(form.dob).toISOString(), panNumber:form.panNumber.toUpperCase(),
      state:form.state, city:form.city, pincode:form.pincode,
      residenceStatus:form.residenceStatus===OTHER_OPTION?form.residenceStatusOther:form.residenceStatus,
      buyingPropertyType:form.buyingPropertyType===OTHER_OPTION?form.buyingPropertyTypeOther:form.buyingPropertyType,
      buyingPropertyAge:parseInt(form.buyingPropertyAge)||0,
      buyingPropertyState:form.buyingPropertyState,
      buyingPropertyCity:form.buyingPropertyCity,
      buyingPropertyPincode:form.buyingPropertyPincode,
      employmentType:form.employmentType,
      companyName:form.employmentType===SALARIED?form.companyName:undefined,
      companyType:form.employmentType===SALARIED
        ?(form.companyType===OTHER_OPTION?form.companyTypeOther:form.companyType)
        :undefined,
      monthlyNetSalary:form.employmentType===SALARIED?form.monthlyNetSalary:undefined,
      salaryReceivedAs:form.employmentType===SALARIED?form.salaryReceivedAs:undefined,
      salaryBankName:form.employmentType===SALARIED&&form.salaryReceivedAs!=="Cash"
        ?(form.salaryBankName===OTHER_OPTION?form.salaryBankNameOther:form.salaryBankName)
        :undefined,
      businessName:form.employmentType===SELF_EMPLOYED_BUSINESS?form.businessName:undefined,
      businessType:form.employmentType===SELF_EMPLOYED_BUSINESS
        ?(form.businessType===OTHER_OPTION?form.businessTypeOther:form.businessType)
        :undefined,
      gstNumber:form.employmentType===SELF_EMPLOYED_BUSINESS?(form.gstNumber.trim()?form.gstNumber.toUpperCase():undefined):undefined,
      companyPanNumber:form.employmentType===SELF_EMPLOYED_BUSINESS?form.companyPanNumber.toUpperCase():undefined,
      natureOfBusiness:form.employmentType===SELF_EMPLOYED_BUSINESS
        ?(form.natureOfBusiness===OTHER_OPTION?form.natureOfBusinessOther:form.natureOfBusiness)
        :undefined,
      industryType:form.employmentType===SELF_EMPLOYED_BUSINESS
        ?(form.industryType===OTHER_OPTION?form.industryTypeOther:form.industryType)
        :undefined,
      subIndustry:form.employmentType===SELF_EMPLOYED_BUSINESS?(form.subIndustry.trim()||undefined):undefined,
      businessEstablishedDate:form.employmentType===SELF_EMPLOYED_BUSINESS&&form.businessEstablishedDate
        ?new Date(form.businessEstablishedDate).toISOString()
        :undefined,
      transactionBankName:form.employmentType===SELF_EMPLOYED_BUSINESS
        ?(form.transactionBankName===OTHER_OPTION
          ?undefined
          :form.transactionBankName===MULTIPLE_TRANSACTION_BANKS
            ?{displayName:MULTIPLE_TRANSACTION_BANKS, banks:form.transactionBanks}
            :form.transactionBankName||undefined)
        :undefined,
      transactionBankOther:form.employmentType===SELF_EMPLOYED_BUSINESS&&form.transactionBankName===OTHER_OPTION
        ?(form.transactionBankNameOther.trim()||undefined)
        :undefined,
      lastYearTurnover:form.employmentType===SELF_EMPLOYED_BUSINESS?form.lastYearTurnover:undefined,
      last2YearsTurnover:form.employmentType===SELF_EMPLOYED_BUSINESS?form.last2YearsTurnover:undefined,
      lastYearNetIncome:form.employmentType===SELF_EMPLOYED_BUSINESS?form.lastYearNetIncome:undefined,
      last2YearsNetIncome:form.employmentType===SELF_EMPLOYED_BUSINESS?form.last2YearsNetIncome:undefined,
      profession:form.employmentType===SELF_EMPLOYED_PROFESSIONAL
        ?(form.profession===OTHER_OPTION?form.professionOther:form.profession)
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
        ?(form.businessPlaceStatus===OTHER_OPTION?form.businessPlaceStatusOther:form.businessPlaceStatus)
        :undefined,
      loanAmount:form.loanAmount, loanTenure:form.loanTenureYears*12,
      existingEMI:parseInt(form.existingEMI)||0, existingLoanAmount:parseInt(form.existingLoanAmount)||0,
      existingBanks:form.existingBanks, otherBankList:form.existingBanksOther,
      existingLoanTypes:form.existingLoanTypes, otherLoanList:form.existingLoanTypesOther,
      });
      setSubmittedApp(res.data); setSubmitted(true);
      if(onSubmit) onSubmit(res.data._id, res.data);
    } catch(err) {
      setApiError(getApiErrorMessage(err, "Submission failed. Please try again."));
    } finally { setIsSubmitting(false); }
  };

  if(submitted && submittedApp && !showFormAfterSubmit) return (
    <div className="max-w-3xl mx-auto space-y-5">
      <SubmittedReceiptBanner onBack={() => setShowFormAfterSubmit(true)} />
      <SubmissionSuccess
      refNo={submittedApp._id.slice(-10).toUpperCase()}
      fullId={submittedApp._id}
      createdAt={submittedApp.createdAt}
      productName="Home Loan"
      applicantName={submittedApp.fullName}
      mobile={submittedApp.mobile}
      email={submittedApp.email}
      sections={buildProductSections(submittedApp)}
    />
    </div>
  );

  return (
    <form className="max-w-4xl mx-auto" onSubmit={handleSubmit} noValidate>
      {submitted && submittedApp && (
        <SubmittedFormBanner refNo={submittedApp._id.slice(-10).toUpperCase()} onViewReceipt={() => setShowFormAfterSubmit(false)} />
      )}
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{color:C.dark}}>
          Unlock the best Home Loan offers suitable for your needs from 43+ lenders
        </h1>
        <p className="text-xs mt-1.5" style={{color:C.gray}}>Fields with asterisk mark (*) are mandatory. All amounts should be entered in INR (₹).</p>
      </div>

      {/* ── LOAN REQUIREMENTS ────────────────────────────────────────── */}
      <FormCard title="Loan Requirements" subtitle="How much do you need and for how long?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div id="loanAmount"><FieldLabel label="Required Loan Amount" required/>
            <AmountField value={form.loanAmount===0?"":String(form.loanAmount)} onChange={v=>set("loanAmount",parseInt(v)||0)} placeholder="Enter Amount in INR" err={errors.loanAmount}/>
          </div>
          <div id="loanTenureYears"><FieldLabel label="Required Loan Tenure (in years)" required/>
            <TextField type="number" min={3} max={35} value={form.loanTenureYears===0?"":String(form.loanTenureYears)}
              onChange={v=>set("loanTenureYears",Math.max(0,parseInt(v)||0))} placeholder="Between 3 and 35 years" err={errors.loanTenureYears}/>
          </div>
          <SelectWithOther
            id="buyingPropertyType" label="Buying Property Type" required
            value={form.buyingPropertyType} onChange={v=>{
              set("buyingPropertyType",v);
              if(v!==OTHER_OPTION) set("buyingPropertyTypeOther","");
            }} options={masters.buyingPropertyTypes} err={errors.buyingPropertyType}
            otherId="buyingPropertyTypeOther" otherLabel="Mention Buying Property Type"
            otherValue={form.buyingPropertyTypeOther} onOtherChange={v=>set("buyingPropertyTypeOther",v)}
            otherPlaceholder="Enter property type" otherErr={errors.buyingPropertyTypeOther}
          />
          <div id="buyingPropertyAge"><FieldLabel label="Buying Property Age" required/>
            <TextField type="number" value={form.buyingPropertyAge} onChange={v=>set("buyingPropertyAge",v.replace(/\D/g,""))}
              placeholder="In Years (0 if property is new/under construction)" err={errors.buyingPropertyAge}/>
          </div>
          <div id="buyingPropertyState"><FieldLabel label="Buying Property State" required/>
            <SelectField value={form.buyingPropertyState} onChange={v=>{
              set("buyingPropertyState",v); set("buyingPropertyCity",""); loadCities(v);
            }} options={masters.states} placeholder="Select" err={errors.buyingPropertyState}/>
          </div>
          <div id="buyingPropertyCity"><FieldLabel label="Buying Property City" required/>
            <SelectField value={form.buyingPropertyCity} onChange={v=>set("buyingPropertyCity",v)}
              options={buyingPropertyCityOptions} placeholder={form.buyingPropertyState?"Select city":"Select state first"} disabled={!form.buyingPropertyState} err={errors.buyingPropertyCity}/>
          </div>
          <PincodeInputField
            id="buyingPropertyPincode" label="Buying Property Pincode"
            value={form.buyingPropertyPincode} onChange={v=>set("buyingPropertyPincode",v)}
 onResolved={r=>onPincodeResolved("buyingProperty",r)} err={errors.buyingPropertyPincode}
          />
        </div>
      </FormCard>

      {/* ── INCOME DETAILS ───────────────────────────────────────────── */}
      <FormCard title="Income Details" subtitle="Tell us about your employment and income">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {form.employmentType===SELF_EMPLOYED_BUSINESS&&(
            <div>
              <h3 className="text-sm font-bold mt-2" style={{color:C.dark}}>Business Details</h3>
            </div>
          )}
          <div id="employmentType"><FieldLabel label="Employment Type" required/>
            <SelectField value={form.employmentType} onChange={setEmploymentType} options={employmentTypeOptions} placeholder="Select" err={errors.employmentType}/>
          </div>

          {form.employmentType===SALARIED&&(<>
            <div id="companyName"><FieldLabel label="Company Name" required/>
              <TextField value={form.companyName} onChange={v=>set("companyName",v.slice(0,100))} maxLength={100} placeholder="Company full name" err={errors.companyName}/>
            </div>
            <SelectWithOther
              id="companyType" label="Company Type" required
              value={form.companyType} onChange={v=>{
                set("companyType",v);
                if(v!==OTHER_OPTION) set("companyTypeOther","");
              }} options={masters.companyTypes} err={errors.companyType}
              otherId="companyTypeOther" otherLabel="Mention Company Type"
              otherValue={form.companyTypeOther} onOtherChange={v=>set("companyTypeOther",v)}
              otherPlaceholder="Enter company type" otherErr={errors.companyTypeOther}
            />
            <div id="monthlyNetSalary"><FieldLabel label="Monthly Net Salary" required/>
              <AmountField value={form.monthlyNetSalary===0?"":String(form.monthlyNetSalary)} onChange={v=>set("monthlyNetSalary",parseInt(v)||0)} placeholder="Enter Amount in INR"
                err={errors.monthlyNetSalary}/>
            </div>
            <div id="salaryReceivedAs"><FieldLabel label="Salary Received As" required/>
              <SelectField value={form.salaryReceivedAs} onChange={v=>{
                set("salaryReceivedAs",v);
                if(v==="Cash"){ set("salaryBankName",""); set("salaryBankNameOther",""); }
              }} options={masters.salaryModes} placeholder="Select" err={errors.salaryReceivedAs}/>
            </div>
            {form.salaryReceivedAs&&form.salaryReceivedAs!=="Cash"&&(
              <SelectWithOther
                id="salaryBankName" label="Salary Bank Name" required
                value={form.salaryBankName} onChange={v=>{
                  set("salaryBankName",v);
                  if(v!==OTHER_OPTION) set("salaryBankNameOther","");
                }} options={masters.banks} err={errors.salaryBankName}
                otherId="salaryBankNameOther" otherLabel="Mention Salary Bank Name"
                otherValue={form.salaryBankNameOther} onOtherChange={v=>set("salaryBankNameOther",v)}
                otherPlaceholder="Enter bank name" otherErr={errors.salaryBankNameOther}
              />
            )}
          </>)}

          {form.employmentType===SELF_EMPLOYED_PROFESSIONAL&&(<>
            <SelectWithOther
              id="profession" label="Profession" required
              value={form.profession} onChange={v=>{
                set("profession",v);
                if(v!==OTHER_OPTION) set("professionOther","");
              }} options={masters.professions} err={errors.profession}
              otherId="professionOther" otherLabel="Mention Profession"
              otherValue={form.professionOther} onOtherChange={v=>set("professionOther",v)}
              otherPlaceholder="Enter profession" otherErr={errors.professionOther}
            />
            <div id="currentYearTurnover"><FieldLabel label="Current Year Turn Over" required/>
              <AmountField value={form.currentYearTurnover===0?"":String(form.currentYearTurnover)} onChange={v=>set("currentYearTurnover",parseInt(v)||0)} placeholder="Enter Amount in INR" err={errors.currentYearTurnover}/>
            </div>
            <div id="priorYearTurnover"><FieldLabel label="Last (2 Years old) Turnover" required/>
              <AmountField value={form.priorYearTurnover===0?"":String(form.priorYearTurnover)} onChange={v=>set("priorYearTurnover",parseInt(v)||0)} placeholder="Enter Amount in INR" err={errors.priorYearTurnover}/>
            </div>
            <div id="currentYearNetIncome"><FieldLabel label="Current Year Net Income" required/>
              <AmountField value={form.currentYearNetIncome===0?"":String(form.currentYearNetIncome)} onChange={v=>set("currentYearNetIncome",parseInt(v)||0)} placeholder="Enter Amount in INR" err={errors.currentYearNetIncome}/>
            </div>
            <div id="previousYearNetIncome"><FieldLabel label="Previous Year Net Income" required/>
              <AmountField value={form.previousYearNetIncome===0?"":String(form.previousYearNetIncome)} onChange={v=>set("previousYearNetIncome",parseInt(v)||0)} placeholder="Enter Amount in INR" err={errors.previousYearNetIncome}/>
            </div>
          </>)}

          {form.employmentType===SELF_EMPLOYED_BUSINESS&&(<>
            <SelectWithOther
              id="businessType" label="Company Type" required
              value={form.businessType} onChange={v=>{
                set("businessType",v);
                if(v!==OTHER_OPTION) set("businessTypeOther","");
              }} options={masters.businessTypes} err={errors.businessType}
              otherId="businessTypeOther" otherLabel="Mention Company Type"
              otherValue={form.businessTypeOther} onOtherChange={v=>set("businessTypeOther",v)}
              otherPlaceholder="Enter company type" otherErr={errors.businessTypeOther}
            />
            <div id="businessName"><FieldLabel label="Company Full Name" required/>
              <TextField value={form.businessName} onChange={v=>set("businessName",v.slice(0,100))} maxLength={100} placeholder="Registered business / firm name" err={errors.businessName}/>
            </div>

            <div id="gstNumber"><FieldLabel label="GST No (if available)"/>
                <TextField value={form.gstNumber} onChange={v=>set("gstNumber",formatGSTIN(v))} placeholder="Company GST No. – 15-character GSTIN" maxLength={15} err={errors.gstNumber} extraCls="uppercase tracking-wide"/>
              </div>
              <div id="companyPanNumber"><FieldLabel label="Company PAN Number" required/>
                <TextField value={form.companyPanNumber} onChange={v=>set("companyPanNumber",formatPAN(v))} placeholder="ABCDE1234F" maxLength={10} err={errors.companyPanNumber} extraCls="uppercase tracking-widest"/>
              </div>
              <SelectWithOther
                id="natureOfBusiness" label="Nature Of Business" required
                value={form.natureOfBusiness} onChange={v=>{
                  set("natureOfBusiness",v);
                  if(v!==OTHER_OPTION) set("natureOfBusinessOther","");
                }} options={masters.natureOfBusiness} err={errors.natureOfBusiness}
                otherId="natureOfBusinessOther" otherLabel="Mention Nature Of Business"
                otherValue={form.natureOfBusinessOther} onOtherChange={v=>set("natureOfBusinessOther",v)}
                otherPlaceholder="Enter nature of business" otherErr={errors.natureOfBusinessOther}
              />

              <SelectWithOther
                id="industryType" label="Industry Type" required
                value={form.industryType} onChange={v=>{
                  set("industryType",v);
                  if(v!==OTHER_OPTION) set("industryTypeOther","");
                  else set("subIndustry","");
                }} options={masters.industryTypes} err={errors.industryType}
                otherId="industryTypeOther" otherLabel="Mention Industry Type"
                otherValue={form.industryTypeOther} onOtherChange={v=>set("industryTypeOther",v)}
                otherPlaceholder="Enter industry type" otherErr={errors.industryTypeOther}
              />
              {form.industryType!==OTHER_OPTION&&(
                <div id="subIndustry"><FieldLabel label="Sub Industry"/>
                  <TextField value={form.subIndustry} onChange={v=>set("subIndustry",v)} placeholder="Optional"/>
                </div>
              )}

              <div id="businessEstablishedDate"><FieldLabel label="Date Of Business Establishment" required/>
                <DateField value={form.businessEstablishedDate} onChange={v=>set("businessEstablishedDate",v)}
                  err={errors.businessEstablishedDate} maxDate={new Date()} minDate={new Date(new Date().getFullYear()-100,0,1)}
                  portalId="home-business-established-datepicker-portal"/>
              </div>

              <div id="transactionBankName"><FieldLabel label="Transaction Bank Name"/>
                <SelectField value={form.transactionBankName} onChange={v=>{
                  set("transactionBankName",v);
                  if(v!==OTHER_OPTION) set("transactionBankNameOther","");
                  if(v!==MULTIPLE_TRANSACTION_BANKS) setForm(p=>({...p, transactionBanks:[]}));
                }} options={transactionBankOptions} placeholder="Select" err={errors.transactionBankName}/>
              </div>
              {form.transactionBankName===OTHER_OPTION&&(
                <div id="transactionBankNameOther"><FieldLabel label="Mention Bank Name" required/>
                  <TextField value={form.transactionBankNameOther} onChange={v=>set("transactionBankNameOther",v)} placeholder="Enter bank name" err={errors.transactionBankNameOther}/>
                </div>
              )}
              {form.transactionBankName===MULTIPLE_TRANSACTION_BANKS&&(
                <div className="md:col-span-2 mt-4" id="transactionBanks">
                  <OtherOptionList label="Transaction Banks" placeholder="Enter bank name"
                    items={form.transactionBanks} onAdd={addTransactionBank} onRemove={removeTransactionBank} color={C.teal}/>
                  <FieldError msg={errors.transactionBanks}/>
                </div>
              )}

              <div id="lastYearTurnover"><FieldLabel label="Last Year Turnover" required/>
                <AmountField value={form.lastYearTurnover===0?"":String(form.lastYearTurnover)} onChange={v=>set("lastYearTurnover",parseInt(v)||0)} placeholder="Enter Amount in INR" err={errors.lastYearTurnover}/>
              </div>
              <div id="last2YearsTurnover"><FieldLabel label="Last (2 Years old) Turnover"/>
                <AmountField value={form.last2YearsTurnover===0?"":String(form.last2YearsTurnover)} onChange={v=>set("last2YearsTurnover",parseInt(v)||0)} placeholder="Enter Amount in INR"/>
              </div>
              <div id="lastYearNetIncome"><FieldLabel label="Last Year Net Income" required/>
                <AmountField value={form.lastYearNetIncome===0?"":String(form.lastYearNetIncome)} onChange={v=>set("lastYearNetIncome",parseInt(v)||0)} placeholder="Enter Amount in INR" err={errors.lastYearNetIncome}/>
              </div>
              <div id="last2YearsNetIncome"><FieldLabel label="Last (2 Years old) Net Income"/>
                <AmountField value={form.last2YearsNetIncome===0?"":String(form.last2YearsNetIncome)} onChange={v=>set("last2YearsNetIncome",parseInt(v)||0)} placeholder="Enter Amount in INR"/>
              </div>
          </>)}

          {(form.employmentType===SELF_EMPLOYED_BUSINESS||form.employmentType===SELF_EMPLOYED_PROFESSIONAL)&&(<>
            <div id="businessState"><FieldLabel label="Current Business State" required/>
              <SelectField value={form.businessState} onChange={v=>{
                set("businessState",v); set("businessCity",""); loadCities(v);
              }} options={masters.states} placeholder="Select" err={errors.businessState}/>
            </div>
            <div id="businessCity"><FieldLabel label="Current Business City" required/>
              <SelectField value={form.businessCity} onChange={v=>set("businessCity",v)}
                options={businessCityOptions} placeholder={form.businessState?"Select city":"Select state first"} disabled={!form.businessState} err={errors.businessCity}/>
            </div>
            <PincodeInputField
              id="businessPincode" label="Current Business Pincode"
              value={form.businessPincode} onChange={v=>set("businessPincode",v)}
 onResolved={r=>onPincodeResolved("business",r)} err={errors.businessPincode}
            />
            <SelectWithOther
              id="businessPlaceStatus" label="Status Of Business Place" required
              value={form.businessPlaceStatus} onChange={v=>{
                set("businessPlaceStatus",v);
                if(v!==OTHER_OPTION) set("businessPlaceStatusOther","");
              }} options={masters.businessPlaceStatuses} err={errors.businessPlaceStatus}
              otherId="businessPlaceStatusOther" otherLabel="Mention Status Of Business Place"
              otherValue={form.businessPlaceStatusOther} onOtherChange={v=>set("businessPlaceStatusOther",v)}
              otherPlaceholder="Enter status of business place" otherErr={errors.businessPlaceStatusOther}
            />
          </>)}
        </div>
      </FormCard>

      {/* ── EXISTING LOAN EXPOSURE ───────────────────────────────────── */}
      <FormCard title="Existing Loan Exposure" subtitle="Fill 0 if you have no existing loans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div id="existingEMI"><FieldLabel label="Existing Total EMI" required/>
            <AmountField value={form.existingEMI} onChange={v=>set("existingEMI",v.replace(/\D/g,""))} placeholder="Enter Amount in INR" err={errors.existingEMI}/>
          </div>
          <div id="existingLoanAmount"><FieldLabel label="Existing Loan Amount (Total)" required/>
            <AmountField value={form.existingLoanAmount} onChange={v=>set("existingLoanAmount",v.replace(/\D/g,""))} placeholder="Enter Amount in INR" err={errors.existingLoanAmount}/>
          </div>
        </div>

        <div className="mb-5">
          <FieldLabel label="Existing Loan Bank's Name"/>
          {!hasExposure&&<p className="text-xs mb-2" style={{color:C.gray}}>Enter Existing Total EMI or Existing Loan Amount above to enable selection</p>}
          <PillMultiSelect options={masters.banks} selected={form.existingBanks} disabled={!hasExposure}
            onChange={vals=>setForm(p=>({...p,existingBanks:vals, existingBanksOther:vals.includes(OTHER_OPTION)?p.existingBanksOther:[]}))}
            color={C.teal}/>

          {hasExposure&&form.existingBanks.includes(OTHER_OPTION)&&(
            <OtherOptionList label="Other Existing Loan Bank Name" placeholder="Enter other bank name"
              items={form.existingBanksOther} onAdd={addOtherBank} onRemove={removeOtherBank} color={C.teal} existingOptions={masters.banks}/>
          )}
        </div>

        <div>
          <FieldLabel label="Existing Loan Types"/>
          {!hasExposure&&<p className="text-xs mb-2" style={{color:C.gray}}>Enter Existing Total EMI or Existing Loan Amount above to enable selection</p>}
          <PillMultiSelect options={masters.existingLoanTypes} selected={form.existingLoanTypes} disabled={!hasExposure}
            onChange={vals=>setForm(p=>({...p,existingLoanTypes:vals, existingLoanTypesOther:vals.includes(OTHER_OPTION)?p.existingLoanTypesOther:[]}))}
            color={C.navy}/>

          {hasExposure&&form.existingLoanTypes.includes(OTHER_OPTION)&&(
            <OtherOptionList label="Other Existing Loan Types" placeholder="Enter other loan type"
              items={form.existingLoanTypesOther} onAdd={addOtherLoanType} onRemove={removeOtherLoanType} color={C.navy} existingOptions={masters.existingLoanTypes}/>
          )}
        </div>
      </FormCard>

      <PersonalDetailsSection form={form} set={(key, value) => set(key, value)} errors={errors}
        onPincodeResolved={r=>onPincodeResolved("residence",r)}
        states={masters.states} residenceStatuses={masters.residenceStatuses} loadCities={loadCities} />

      <ConsentAndSubmit agreed={agreed} onAgreedChange={setAgreed} apiError={apiError} submitAttempted={submitAttempted}
        invalidCount={Object.keys(allErrors).length} isSubmitting={isSubmitting} submitted={submitted} />
    </form>
  );
};

export default ApplicationForm;
