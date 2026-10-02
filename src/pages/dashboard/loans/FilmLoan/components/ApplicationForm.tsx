import { useMemo, useState } from "react";
import { useAuth } from "../../../../../context/authContext";
import { THEME as C } from "../../../../../constants/theme";
import { MULTIPLE_TRANSACTION_BANKS, OTHER_OPTION, SELF_EMPLOYED_BUSINESS, SELF_EMPLOYED_PROFESSIONAL } from "../../../../../constants/masters";
import { useMasters } from "../../../../../hooks/useMasters";
import { usePincodeSections } from "../../../../../hooks/usePincodeSections";
import { useApplicationSubmit } from "../../../../../hooks/useApplicationSubmit";
import SubmittedReceiptView from "../../../../../components/form/SubmittedReceiptView";
import { PersonalDetailsSection } from "../../../../../components/form/PersonalDetailsSection";
import { BusinessPlaceSection } from "../../../../../components/form/BusinessPlaceSection";
import { ExistingLoanExposureSection } from "../../../../../components/form/ExistingLoanExposureSection";
import { ConsentAndSubmit, SubmittedFormBanner } from "../../../../../components/form/SubmitSection";
import { formatGSTIN, formatPAN } from "../../../../../utils/formatters";
import { GSTIN_REGEX, NAME_REGEX, stripOther, validatePersonalDetails } from "../../../../../utils/validation";
import { AmountField, DateField, FieldError, FieldLabel, FormCard, MORE_THAN_TENURE_OPTION, OtherOptionList, PillMultiSelect, SelectField, SelectWithOther, TenureYearsField, TextField } from "../../../../../components/form/FormControls";
import { buildProductSections } from "./receiptSections";
import { applyFilmLoan } from "../../../../../api/loanApplications";
import type { FilmLoanApplication } from "../../../../../api/loanApplications";

// ── Local type — no backend yet, this is purely the shape used to render the UI success state ──
// Type lives in the API layer (aligned with the backend's FilmLoan document);
// re-exported so the dashboard and LoanStatus imports keep working unchanged.
export type { FilmLoanApplication } from "../../../../../api/loanApplications";

const FILM_LANGUAGES = ["Hindi","English","Tamil","Telugu","Malayalam","Kannada","Bengali","Marathi","Punjabi","Gujarati","Bhojpuri","Odia","Assamese",OTHER_OPTION];
const FILM_CATEGORIES = ["Hollywood","Bollywood","Tollywood",OTHER_OPTION];
const MAX_STAR_CAST = 5;

interface ApplicationFormProps {
  userName?: string;
  userEmail?: string;
  onSubmit?: (id: string, app: FilmLoanApplication) => void;
}
interface FormData {
  fullName:string; mobile:string; email:string; dob:string; panNumber:string;
  state:string; city:string; pincode:string; residenceStatus:string; residenceStatusOther:string;
  employmentType:string; businessName:string; businessType:string; businessTypeOther:string;
  gstNumber:string; companyPanNumber:string;
  businessEstablishedDate:string; transactionBankName:string; transactionBankNameOther:string; transactionBanks:string[];
  lastYearTurnover:number; last2YearsTurnover:number;
  lastYearNetIncome:number; last2YearsNetIncome:number;
  profession:string; professionOther:string;
  currentYearTurnover:number; priorYearTurnover:number;
  currentYearNetIncome:number; previousYearNetIncome:number;
  businessState:string; businessCity:string;
  businessPincode:string; businessPlaceStatus:string; businessPlaceStatusOther:string;
  filmComesUnder:string; filmComesUnderOther:string;
  filmLanguages:string[]; filmLanguagesOther:string[]; starCastNames:string[];
  totalProjectCost:number; ownInvestmentAmount:number;
  loanAmount:number; loanTenureYears:number; loanTenureYearsCustom:number; existingEMI:string; existingLoanAmount:string;
  existingBanks:string[]; existingLoanTypes:string[]; existingBanksOther:string[]; existingLoanTypesOther:string[];
}

const ApplicationForm = ({userName="",userEmail="",onSubmit}:ApplicationFormProps) => {
  const {user} = useAuth();const { masters, loadCities } = useMasters();
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState<FormData>({
    fullName:user?.name||userName, mobile:user?.mobile||"", email:user?.email||userEmail,
    dob:"", panNumber:"", state:"", city:"", pincode:"", residenceStatus:"", residenceStatusOther:"",
    employmentType:"", businessName:"", businessType:"", businessTypeOther:"",
    gstNumber:"", companyPanNumber:"",
    businessEstablishedDate:"", transactionBankName:"", transactionBankNameOther:"", transactionBanks:[],
    lastYearTurnover:0, last2YearsTurnover:0, lastYearNetIncome:0, last2YearsNetIncome:0,
    profession:"", professionOther:"",
    currentYearTurnover:0, priorYearTurnover:0, currentYearNetIncome:0, previousYearNetIncome:0,
    businessState:"", businessCity:"",
    businessPincode:"", businessPlaceStatus:"", businessPlaceStatusOther:"",
    filmComesUnder:"", filmComesUnderOther:"",
    filmLanguages:[], filmLanguagesOther:[], starCastNames:[],
    totalProjectCost:0, ownInvestmentAmount:0,
    loanAmount:0, loanTenureYears:0, loanTenureYearsCustom:0, existingEMI:"", existingLoanAmount:"",
    existingBanks:[], existingLoanTypes:[], existingBanksOther:[], existingLoanTypesOther:[],
  });
  const [touched, setTouched] = useState<Partial<Record<keyof FormData,boolean>>>({});

  // Banks/loan-type pills unlock only once some existing-loan exposure is entered.
  // The /employment-types API is only available for Home Loan, so employment
  // types stay static for this product.
  const employmentTypeOptions = useMemo(
    () => [...masters.businessEmploymentTypes],
    [masters.businessEmploymentTypes]
  );

const hasExposure = parseInt(form.existingEMI) > 0 || parseInt(form.existingLoanAmount) > 0;
  // Inverse pill gate: if any existing-loan bank/type pill is selected, some exposure must be entered.
  const pillBanksSelected = [form.existingBanks].some(a=>a.length>0);
  const pillLoanTypesSelected = [form.existingLoanTypes].some(a=>a.length>0);

  const { onPincodeResolved, mismatchErrors } = usePincodeSections({ set: (key, value) => set(key as keyof FormData, value), loadCities, sections: ["residence", "business"] });



  const transactionBankOptions = useMemo(() => {
    const banks = masters.banks.filter(b=>b!==OTHER_OPTION);
    return [...banks, MULTIPLE_TRANSACTION_BANKS, OTHER_OPTION];
  }, [masters.banks]);



  const addFilmLanguageOther = (value:string) =>
    setForm(p=>({...p, filmLanguagesOther:[...p.filmLanguagesOther, value]}));
  const removeFilmLanguageOther = (idx:number) =>
    setForm(p=>({...p, filmLanguagesOther:p.filmLanguagesOther.filter((_,i)=>i!==idx)}));

  const addStarCastName = (value:string) =>
    setForm(p=>({...p, starCastNames:[...p.starCastNames, value]}));
  const removeStarCastName = (idx:number) =>
    setForm(p=>({...p, starCastNames:p.starCastNames.filter((_,i)=>i!==idx)}));

  const set = (f:keyof FormData, v:FormData[keyof FormData]) => {
    setForm(p=>({...p,[f]:v}));
    setTouched(p=>(p[f]?p:{...p,[f]:true}));
  };

  const employmentBranchFields: (keyof FormData)[] = [
    "businessName", "businessType", "businessTypeOther",
    "gstNumber", "companyPanNumber",
    "businessEstablishedDate", "transactionBankName", "transactionBankNameOther", "transactionBanks",
    "lastYearTurnover", "last2YearsTurnover", "lastYearNetIncome", "last2YearsNetIncome",
    "profession", "professionOther",
    "currentYearTurnover", "priorYearTurnover", "currentYearNetIncome", "previousYearNetIncome",
  ];

  const setEmploymentType = (v:string) => {
    setForm(p=>({
      ...p, employmentType:v,
      businessName:"", businessType:"", businessTypeOther:"",
      gstNumber:"", companyPanNumber:"",
      businessEstablishedDate:"", transactionBankName:"", transactionBankNameOther:"", transactionBanks:[],
      lastYearTurnover:0, last2YearsTurnover:0, lastYearNetIncome:0, last2YearsNetIncome:0,
      profession:"", professionOther:"",
      currentYearTurnover:0, priorYearTurnover:0, currentYearNetIncome:0, previousYearNetIncome:0,
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
    if(!draft.filmComesUnder) e.filmComesUnder="Please select what the film comes under";
    else if(draft.filmComesUnder===OTHER_OPTION&&!draft.filmComesUnderOther.trim()) e.filmComesUnderOther="Please mention film category";
    if(draft.filmLanguages.length===0) e.filmLanguages="Select at least one language";
    else if(draft.filmLanguages.includes(OTHER_OPTION)&&draft.filmLanguagesOther.length===0) e.filmLanguages="Please add at least one other language";
    if(draft.starCastNames.length===0) e.starCastNames="Add at least one star cast name";
    if(!draft.totalProjectCost) e.totalProjectCost="Total film project cost is required";
    if(!draft.ownInvestmentAmount) e.ownInvestmentAmount="Own investment amount is required";
    else if(draft.totalProjectCost&&draft.ownInvestmentAmount>draft.totalProjectCost) e.ownInvestmentAmount="Own investment amount cannot exceed total film project cost";
    else if(draft.totalProjectCost&&draft.ownInvestmentAmount<draft.totalProjectCost*0.2) e.ownInvestmentAmount="Own investment amount should be min 20% of the total film project cost";
    if(draft.loanAmount<10000000) e.loanAmount="Minimum ₹1,00,00,000";
    else if(draft.loanAmount>50000000) e.loanAmount="Maximum loan amount is ₹5,00,00,000";
    if(!draft.loanTenureYears) e.loanTenureYears="Select funding tenure";
    else if(draft.loanTenureYears===MORE_THAN_TENURE_OPTION&&(form.loanTenureYearsCustom<=10||form.loanTenureYearsCustom>10)) e.loanTenureYearsCustom=form.loanTenureYearsCustom>10?"Tenure cannot exceed 10 years":"Enter a tenure greater than 10 years";
    if(!draft.existingEMI.trim()) e.existingEMI="Existing Total EMI is required (enter 0 if none)";
    if(!draft.existingLoanAmount.trim()) e.existingLoanAmount="Existing Loan Amount is required (enter 0 if none)";
    else if(parseInt(draft.existingEMI)>parseInt(draft.existingLoanAmount)) e.existingEMI="Existing Total EMI cannot be greater than Existing Loan Amount (Total)";
    if((pillBanksSelected||pillLoanTypesSelected)&&!hasExposure) e.existingEMI="Since existing loan banks/types are selected, existing EMI or existing loan amount must be greater than 0 (unselect both if you have no existing loans)";

    if(!draft.employmentType) e.employmentType="Employment type is required";
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


  const markAllTouched = (keys: string[]) =>
    setTouched(p => { const next = { ...p }; keys.forEach(k => { next[k as keyof FormData] = true; }); return next; });

  const {
    isSubmitting, apiError, submitAttempted, submitted, submittedApp,
    showFormAfterSubmit, setShowFormAfterSubmit, handleSubmit,
  } = useApplicationSubmit<FilmLoanApplication>({
    computeErrors, markAllTouched, agreed,
    submit: async () => {
          const app = {
            fullName:form.fullName, mobile:form.mobile, email:form.email,
            dob:new Date(form.dob).toISOString(), panNumber:form.panNumber.toUpperCase(),
            state:form.state, city:form.city, pincode:form.pincode,
            residenceStatus:form.residenceStatus===OTHER_OPTION?OTHER_OPTION:form.residenceStatus,
            residenceStatusOther:form.residenceStatus===OTHER_OPTION?(form.residenceStatusOther.trim()||undefined):undefined,
            employmentType:form.employmentType,
            businessName:form.employmentType===SELF_EMPLOYED_BUSINESS?form.businessName:undefined,
            businessType:form.employmentType===SELF_EMPLOYED_BUSINESS
              ?(form.businessType===OTHER_OPTION?OTHER_OPTION:form.businessType)
              :undefined,
              businessTypeOther:form.employmentType===SELF_EMPLOYED_BUSINESS
              ?(form.businessType===OTHER_OPTION?(form.businessTypeOther.trim()||undefined):undefined)
              :undefined,
            gstNumber:form.employmentType===SELF_EMPLOYED_BUSINESS?(form.gstNumber.trim()?form.gstNumber.toUpperCase():undefined):undefined,
            companyPanNumber:form.employmentType===SELF_EMPLOYED_BUSINESS?form.companyPanNumber.toUpperCase():undefined,
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
            filmComesUnder:form.filmComesUnder===OTHER_OPTION?OTHER_OPTION:form.filmComesUnder,
            filmComesUnderOther:form.filmComesUnder===OTHER_OPTION?(form.filmComesUnderOther.trim()||undefined):undefined,
            filmLanguages:[...form.filmLanguages.filter(l=>l!==OTHER_OPTION), ...form.filmLanguagesOther],
            starCastNames:form.starCastNames,
            totalProjectCost:form.totalProjectCost, ownInvestmentAmount:form.ownInvestmentAmount,
            loanAmount:form.loanAmount,
            loanTenure:(form.loanTenureYears===MORE_THAN_TENURE_OPTION?form.loanTenureYearsCustom:form.loanTenureYears)*12,
            existingEMI:parseInt(form.existingEMI)||0, existingLoanAmount:parseInt(form.existingLoanAmount)||0,
            existingBanks:stripOther(form.existingBanks), otherBankList:form.existingBanksOther,
            existingLoanTypes:stripOther(form.existingLoanTypes), otherLoanList:form.existingLoanTypesOther,
          };
          const res = await applyFilmLoan(app);
      return res.data;
    },
    onSubmitSuccess: onSubmit,
  });

  if(submitted && submittedApp && !showFormAfterSubmit) return (
    <SubmittedReceiptView app={submittedApp} productName="Film Funding" buildSections={buildProductSections} onBack={() => setShowFormAfterSubmit(true)} />
  );

  return (
    <form className="max-w-4xl mx-auto" onSubmit={handleSubmit} noValidate>
      {submitted && submittedApp && (
        <SubmittedFormBanner refNo={submittedApp._id.slice(-10).toUpperCase()} onViewReceipt={() => setShowFormAfterSubmit(false)} />
      )}
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{color:C.dark}}>
          Unlock the best Film Funding offers suitable for your needs from 43+ lenders
        </h1>
        <p className="text-xs mt-1.5" style={{color:C.gray}}>Fields with asterisk mark (*) are mandatory. All amounts should be entered in INR (₹).</p>
      </div>

      {/* ── FUNDs REQUIREMENTS ─────────────────────────────────────── */}
      <FormCard title="Funds Requirements" subtitle="How much do you need and for how long?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SelectWithOther
            id="filmComesUnder" label="Film Comes Under" required
            value={form.filmComesUnder} onChange={v=>{
              set("filmComesUnder",v);
              if(v!==OTHER_OPTION) set("filmComesUnderOther","");
            }} options={FILM_CATEGORIES} err={errors.filmComesUnder}
            otherId="filmComesUnderOther" otherLabel="Mention Film Category"
            otherValue={form.filmComesUnderOther} onOtherChange={v=>set("filmComesUnderOther",v)}
            otherPlaceholder="Enter film category" otherErr={errors.filmComesUnderOther}
          />

          <div className="md:col-span-2" id="filmLanguages">
            <FieldLabel label="Film Language" required/>
            <p className="text-xs mb-2" style={{color:C.gray}}>In which languages film will be made</p>
            <PillMultiSelect options={FILM_LANGUAGES} selected={form.filmLanguages}
              onChange={vals=>setForm(p=>({...p,filmLanguages:vals, filmLanguagesOther:vals.includes(OTHER_OPTION)?p.filmLanguagesOther:[]}))} color={C.teal}/>
            <FieldError msg={errors.filmLanguages}/>
            {form.filmLanguages.includes(OTHER_OPTION)&&(
              <OtherOptionList label="Add Other Language" placeholder="Enter language name"
                items={form.filmLanguagesOther} onAdd={addFilmLanguageOther} onRemove={removeFilmLanguageOther}
                color={C.teal} existingOptions={FILM_LANGUAGES}/>
            )}
          </div>

          <div className="md:col-span-2" id="starCastNames">
            <OtherOptionList label="Main Star Cast Name" required placeholder="Actor / Actress Name" max={MAX_STAR_CAST}
              items={form.starCastNames} onAdd={addStarCastName} onRemove={removeStarCastName} color={C.teal}/>
            <FieldError msg={errors.starCastNames}/>
          </div>

          <div id="totalProjectCost"><FieldLabel label="Total Film Project Cost" required/>
            <AmountField value={form.totalProjectCost===0?"":String(form.totalProjectCost)} onChange={v=>set("totalProjectCost",parseInt(v)||0)} placeholder="Enter Amount in INR" err={errors.totalProjectCost}/>
          </div>
          <div id="ownInvestmentAmount"><FieldLabel label="Own Investment Amount" required/>
            <AmountField value={form.ownInvestmentAmount===0?"":String(form.ownInvestmentAmount)} onChange={v=>set("ownInvestmentAmount",parseInt(v)||0)} placeholder="Enter Amount in INR" err={errors.ownInvestmentAmount}/>
          </div>
          <div id="loanAmount"><FieldLabel label="Required Funds/Investment Amount" required/>
            <AmountField value={form.loanAmount===0?"":String(form.loanAmount)} onChange={v=>set("loanAmount",parseInt(v)||0)} placeholder="Enter Amount in INR" err={errors.loanAmount}/>
          </div>
          <TenureYearsField
            id="loanTenureYears" label="Required Tenure (in years)"
            value={form.loanTenureYears} onChange={v=>set("loanTenureYears",v)}
            customValue={form.loanTenureYearsCustom} onCustomChange={v=>set("loanTenureYearsCustom",v)}
            options={masters.businessLoanTenureYears} maxYears={10} err={errors.loanTenureYears} customErr={errors.loanTenureYearsCustom}
          />
        </div>
      </FormCard>

      {/* ── INCOME DETAILS ───────────────────────────────────────────── */}
      <FormCard title="Income Details" subtitle="Tell us about your business and income">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {form.employmentType===SELF_EMPLOYED_BUSINESS&&(
            <div>
              <h3 className="text-sm font-bold mt-2" style={{color:C.dark}}>Business Details</h3>
            </div>
          )}
          <div id="employmentType"><FieldLabel label="Employment Type" required/>
            <SelectField value={form.employmentType} onChange={setEmploymentType} options={employmentTypeOptions} placeholder="Select" err={errors.employmentType}/>
          </div>

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
              otherPlaceholder="Enter company type - Proprietorship / Privated Limited" otherErr={errors.businessTypeOther}
            />
            <div id="businessName"><FieldLabel label="Film Production Company Name" required/>
              <TextField value={form.businessName} onChange={v=>set("businessName",v.slice(0,100))} maxLength={100} placeholder="Full Name" err={errors.businessName}/>
            </div>

            <div id="gstNumber"><FieldLabel label="GST No (if available)"/>
                <TextField value={form.gstNumber} onChange={v=>set("gstNumber",formatGSTIN(v))} placeholder="Company GST No. – 15-character GSTIN" maxLength={15} err={errors.gstNumber} extraCls="uppercase tracking-wide"/>
              </div>
              <div id="companyPanNumber"><FieldLabel label="Company PAN Number" required/>
                <TextField value={form.companyPanNumber} onChange={v=>set("companyPanNumber",formatPAN(v))} placeholder="ABCDE1234F" maxLength={10} err={errors.companyPanNumber} extraCls="uppercase tracking-widest"/>
              </div>

              <div id="businessEstablishedDate"><FieldLabel label="Date Of Company Establishment" required/>
                  <DateField value={form.businessEstablishedDate} onChange={v=>set("businessEstablishedDate",v)}
                    err={errors.businessEstablishedDate} maxDate={new Date()} minDate={new Date(new Date().getFullYear()-100,0,1)}
                    portalId="business-established-datepicker-portal"/>
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
                <div className="md:col-span-2" id="transactionBanks">
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

          {(form.employmentType===SELF_EMPLOYED_BUSINESS||form.employmentType===SELF_EMPLOYED_PROFESSIONAL)&&(
            <BusinessPlaceSection form={form} set={(key, value) => set(key, value)} errors={errors}
              onPincodeResolved={r=>onPincodeResolved("business",r)}
              states={masters.states} businessPlaceStatuses={masters.businessPlaceStatuses} loadCities={loadCities} entityLabel="Company" />
          )}
        </div>
      </FormCard>

      <ExistingLoanExposureSection form={form} set={(key, value) => set(key, value)} errors={errors}
        mergeForm={patch => setForm(p => ({ ...p, ...patch }))}
        banks={masters.banks} existingLoanTypes={masters.existingLoanTypes} emiLabel="Existing Loan EMI (Total)" />

      <PersonalDetailsSection form={form} set={(key, value) => set(key, value)} errors={errors}
        onPincodeResolved={r=>onPincodeResolved("residence",r)}
        states={masters.states} residenceStatuses={masters.residenceStatuses} loadCities={loadCities} />

      <ConsentAndSubmit agreed={agreed} onAgreedChange={setAgreed} apiError={apiError} submitAttempted={submitAttempted}
        invalidCount={Object.keys(allErrors).length} isSubmitting={isSubmitting} submitted={submitted} />
    </form>
  );
};

export default ApplicationForm;
