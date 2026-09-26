import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../../context/authContext";
import { applyPersonalLoan } from "../../../../../api/loanApplications";
import { addCustomBankName } from "../../../../../api/masters";
import type { PersonalLoanApplication } from "../../../../../api/loanApplications";
import { THEME as C } from "../../../../../constants/theme";
import { TERMS_OF_USE_URL, PRIVACY_POLICY_URL } from "../../../../../constants/legalLinks";
import { OTHER_OPTION } from "../../../../../constants/masters";
import { useMasters } from "../../../../../hooks/useMasters";
import { formatPAN } from "../../../../../utils/formatters";
import { getApiErrorMessage } from "../../../../../utils/apiError";
import SubmissionSuccess from "../../../../../components/form/SubmissionSuccess";
import { buildSuccessSections } from "../../../../../components/form/successSections";
import {
  DateOfBirthPicker, FieldError, FieldLabel, FormCard,
  MORE_THAN_TENURE_OPTION, OtherOptionList, PillMultiSelect, PincodeInputField, SelectField, SelectWithOther,
  TenureYearsField, TextField,
} from "../../../../../components/form/FormControls";

interface ApplicationFormProps {
  userName?: string;
  userEmail?: string;
  onSubmit?: (id: string, app: PersonalLoanApplication) => void;
}
interface FormData {
  fullName:string; mobile:string; email:string; dob:string; panNumber:string;
  state:string; city:string; pincode:string; residenceStatus:string; residenceStatusOther:string;
  employmentType:string; companyName:string; companyType:string; companyTypeOther:string; monthlyNetSalary:number; salaryReceivedAs:string; salaryBankName:string; salaryBankNameOther:string;
  loanAmount:number; loanTenureYears:number; loanTenureYearsCustom:number; existingEMI:string; existingLoanAmount:string;
  existingBanks:string[]; existingLoanTypes:string[]; existingBanksOther:string[]; existingLoanTypesOther:string[];
}

const ApplicationForm = ({userName="",userEmail="",onSubmit}:ApplicationFormProps) => {
  const {user} = useAuth();
  const {masters, loadCities, getEmploymentTypesFor} = useMasters();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<PersonalLoanApplication|null>(null);
  // After submission: "receipt" view first; "Back to Application Form" returns to the filled form.
  const [showFormAfterSubmit, setShowFormAfterSubmit] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [form, setForm] = useState<FormData>({
    fullName:user?.name||userName, mobile:user?.mobile||"", email:user?.email||userEmail,
    dob:"", panNumber:"", state:"", city:"", pincode:"", residenceStatus:"", residenceStatusOther:"",
    employmentType:"", companyName:"", companyType:"", companyTypeOther:"", monthlyNetSalary:0, salaryReceivedAs:"", salaryBankName:"", salaryBankNameOther:"",
    loanAmount:0, loanTenureYears:0, loanTenureYearsCustom:0, existingEMI:"", existingLoanAmount:"",
    existingBanks:[], existingLoanTypes:[], existingBanksOther:[], existingLoanTypesOther:[],
  });
  const [touched, setTouched] = useState<Partial<Record<keyof FormData,boolean>>>({});

  // Banks/loan-type pills unlock only once some existing-loan exposure is entered.
  // Employment types come from the backend per loan type, with the local
  // constants list as fallback while/if the loan type is not registered.
  const [employmentTypesState, setEmploymentTypesState] = useState<string[]>([]);
  useEffect(() => {
    let cancelled = false;
    getEmploymentTypesFor("personal", "personalEmploymentTypes")
      .then(types => { if (!cancelled) setEmploymentTypesState(types); })
      .catch(() => { /* fallback already returned by the helper */ });
    return () => { cancelled = true; };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const employmentTypeOptions = useMemo(
    () => (employmentTypesState.length > 0 ? employmentTypesState : [...masters.personalEmploymentTypes]),
    [employmentTypesState, masters.personalEmploymentTypes]
  );

  const hasExposure = parseInt(form.existingEMI) > 0 || parseInt(form.existingLoanAmount) > 0;
  // Inverse pill gate: if any existing-loan bank/type pill is selected, some exposure must be entered.
  const pillBanksSelected = [form.existingBanks].some(a=>a.length>0);
  const pillLoanTypesSelected = [form.existingLoanTypes].some(a=>a.length>0);

  const cityOptions = useMemo(
    () => loadCities(form.state),
    [form.state, loadCities]
  );


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

// ── Shared validation constants (used by computeErrors below) ──
  const NAME_REGEX = /^[A-Za-z][A-Za-z .'-]{0,98}$/;

  const computeErrors = (draft:FormData = form) => {
    const e:Partial<Record<keyof FormData,string>> = {};
    // Pincode ↔ State/City consistency (15) and duplicate-application
    // detection (16) are enforced server-side; the frontend validates the
    // pincode format itself below.
    if(draft.loanAmount<50000) e.loanAmount="Minimum ₹50,000";
    else if(draft.loanAmount>5000000) e.loanAmount="Maximum loan amount is ₹50,00,000";
    if(!draft.loanTenureYears) e.loanTenureYears="Select loan tenure";
    else if(draft.loanTenureYears===MORE_THAN_TENURE_OPTION&&(form.loanTenureYearsCustom<=7)) e.loanTenureYearsCustom="Maximum tenure for this loan is 7 years";
    if(!draft.existingEMI.trim()) e.existingEMI="Existing Total EMI is required (enter 0 if none)";
    if(!draft.existingLoanAmount.trim()) e.existingLoanAmount="Existing Loan Amount is required (enter 0 if none)";
    else if(parseInt(draft.existingEMI)>parseInt(draft.existingLoanAmount)) e.existingEMI="Existing Total EMI cannot be greater than Existing Loan Amount (Total)";
    if((pillBanksSelected||pillLoanTypesSelected)&&!hasExposure) e.existingEMI="Since existing loan banks/types are selected, existing EMI or existing loan amount must be greater than 0 (unselect both if you have no existing loans)";

    if(!draft.employmentType) e.employmentType="Employment type is required";
    if(draft.employmentType==="Salaried"){
      if(!draft.companyName.trim()) e.companyName="Company name is required";
      else if(!NAME_REGEX.test(draft.companyName.trim())) e.companyName="Name must be at least 2 characters and contain only letters, spaces, dots or hyphens";
      if(!draft.companyType) e.companyType="Company type is required";
      else if(draft.companyType===OTHER_OPTION&&!draft.companyTypeOther.trim()) e.companyTypeOther="Please mention company type";
      if(!draft.monthlyNetSalary) e.monthlyNetSalary="Monthly net salary is required";
      else if(draft.monthlyNetSalary<=12000) e.monthlyNetSalary="Monthly income should be greater than 12,000";
      else if(parseInt(draft.existingEMI)>draft.monthlyNetSalary*0.6) e.existingEMI="Existing Total EMI should be at most 60% of monthly net salary (FOIR check)"; // FOIR check
      if(!draft.salaryReceivedAs) e.salaryReceivedAs="Select how salary is received";
      else if(draft.salaryReceivedAs!=="Cash"){
        if(!draft.salaryBankName) e.salaryBankName="Select salary bank name";
        else if(draft.salaryBankName===OTHER_OPTION&&!draft.salaryBankNameOther.trim()) e.salaryBankNameOther="Please mention salary bank name";
      }
    }

    if(!draft.fullName.trim()) e.fullName="Name is required";
    else if(!NAME_REGEX.test(draft.fullName.trim())) e.fullName="Name must be at least 2 characters and contain only letters, spaces, dots or hyphens";
    if(!draft.mobile.trim()) e.mobile="Mobile is required";
    else if(!/^[6-9]\d{9}$/.test(draft.mobile)) e.mobile="Enter a valid 10-digit mobile number (starting with 6-9)";
    if(!draft.email.trim()) e.email="Email is required";
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) e.email="Enter valid email";
    if(!draft.dob) e.dob="Date of birth is required";
    else {
      const dobDate = new Date(draft.dob+"T00:00:00");
      const today = new Date(); today.setHours(0,0,0,0);
      if(dobDate>today) e.dob="Date of birth cannot be in the future";
      else {
        const eighteenYearsAgo = new Date(today.getFullYear()-18, today.getMonth(), today.getDate());
        const ageCeiling = new Date(today.getFullYear()-60, today.getMonth(), today.getDate());
        if(dobDate<ageCeiling) e.dob="Maximum application age is 60 years for this loan";
        if(dobDate>eighteenYearsAgo) e.dob="You must be at least 18 years old";
      }
    }
    if(!draft.panNumber.trim()) e.panNumber="PAN is required";
    else if(!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(draft.panNumber.toUpperCase())) e.panNumber="Invalid PAN format";
    if(!draft.state) e.state="State is required";
    if(!draft.city) e.city="City is required";
    if(!draft.pincode) e.pincode="Pincode is required";
    else if(!/^[1-9]\d{5}$/.test(draft.pincode)) e.pincode="Enter valid 6-digit pincode";
    if(!draft.residenceStatus) e.residenceStatus="Residence status is required";
    else if(draft.residenceStatus===OTHER_OPTION&&!draft.residenceStatusOther.trim()) e.residenceStatusOther="Please mention residence status type";

    return e;
  };

  const allErrors = computeErrors();
  const errors:Partial<Record<keyof FormData,string>> = {};
  (Object.keys(touched) as (keyof FormData)[]).forEach(k=>{ if(touched[k]&&allErrors[k]) errors[k]=allErrors[k]; });

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
      document.getElementById(Object.keys(errs)[0])?.scrollIntoView({behavior:"smooth",block:"center"});
      return;
    }
    setIsSubmitting(true); setApiError("");
    try {
      if(form.existingBanksOther.length>0){
        await Promise.allSettled(form.existingBanksOther.map(b=>addCustomBankName(b)));
      }
      const res = await applyPersonalLoan({
        fullName:form.fullName, mobile:form.mobile, email:form.email,
        dob:new Date(form.dob).toISOString(), panNumber:form.panNumber.toUpperCase(),
        state:form.state, city:form.city, pincode:form.pincode,
        residenceStatus:form.residenceStatus===OTHER_OPTION?form.residenceStatusOther:form.residenceStatus,
        employmentType:form.employmentType, companyName:form.companyName,
        companyType:form.companyType===OTHER_OPTION?form.companyTypeOther:form.companyType,
        monthlySalary:form.monthlyNetSalary, salaryReceivedAs:form.salaryReceivedAs,
        salaryBankName:form.salaryReceivedAs!=="Cash"
          ?(form.salaryBankName===OTHER_OPTION?form.salaryBankNameOther:form.salaryBankName)
          :undefined,
        loanAmount:form.loanAmount,
        loanTenure:(form.loanTenureYears===MORE_THAN_TENURE_OPTION?form.loanTenureYearsCustom:form.loanTenureYears)*12,
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
      <div className="rounded-2xl px-5 py-4 flex items-center justify-between gap-3 flex-wrap" style={{background:C.tealBg,border:`1px solid ${C.teal}33`}}>
        <p className="text-sm font-bold" style={{color:C.dark}}>✓ Application submitted successfully</p>
        <button type="button" onClick={()=>setShowFormAfterSubmit(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white shrink-0 transition-all hover:opacity-90"
          style={{background:C.navy}}>
          ← Back to Application Form
        </button>
      </div>
      <SubmissionSuccess
      refNo={submittedApp._id.slice(-10).toUpperCase()}
      fullId={submittedApp._id}
      createdAt={submittedApp.createdAt}
      productName="Personal Loan"
      applicantName={submittedApp.fullName}
      mobile={submittedApp.mobile}
      email={submittedApp.email}
      sections={buildSuccessSections(submittedApp, { amountLabel: "Loan Amount" })}
    />
    </div>
  );

  return (
    <form className="max-w-4xl mx-auto" onSubmit={handleSubmit} noValidate>
      {submitted&&submittedApp&&(
        <div className="mb-6 rounded-2xl px-5 py-4 flex items-center justify-between gap-3 flex-wrap" style={{background:C.tealBg,border:`1px solid ${C.teal}33`}}>
          <div>
            <p className="text-sm font-bold" style={{color:C.dark}}>✓ Application submitted — Ref No. {submittedApp._id.slice(-10).toUpperCase()}</p>
            <p className="text-xs mt-0.5" style={{color:C.gray}}>Your details are saved and shown below.</p>
          </div>
          <button type="button" onClick={()=>setShowFormAfterSubmit(false)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white shrink-0 transition-all hover:opacity-90"
            style={{background:C.navy}}>
            View Receipt
          </button>
        </div>
      )}
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{color:C.dark}}>
          Unlock the best Personal Loan offers suitable for your needs from 43+ lenders
        </h1>
        <p className="text-xs mt-1.5" style={{color:C.gray}}>Fields with asterisk mark (*) are mandatory</p>
      </div>

      {/* ── LOAN REQUIREMENTS ────────────────────────────────────────── */}
      <FormCard title="Loan Requirements" subtitle="How much do you need and for how long?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div id="loanAmount"><FieldLabel label="Required Loan Amount" required/>
            <TextField type="number" value={form.loanAmount===0?"":String(form.loanAmount)}
              onChange={v=>set("loanAmount",Math.max(0,parseInt(v)||0))} placeholder="e.g. 500000" err={errors.loanAmount}/>
          </div>
          <TenureYearsField
            id="loanTenureYears" label="Required Loan Tenure (in years)"
            value={form.loanTenureYears} onChange={v=>set("loanTenureYears",v)}
            customValue={form.loanTenureYearsCustom} onCustomChange={v=>set("loanTenureYearsCustom",v)}
            options={masters.personalLoanTenureYears} err={errors.loanTenureYears}
          />
        </div>
      </FormCard>

      {/* ── INCOME DETAILS ───────────────────────────────────────────── */}
      <FormCard title="Income Details" subtitle="Tell us about your employment and income">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div id="employmentType"><FieldLabel label="Employment Type" required/>
            <SelectField value={form.employmentType} onChange={v=>set("employmentType",v)} options={employmentTypeOptions} placeholder="Select" err={errors.employmentType}/>
          </div>
          {form.employmentType==="Salaried"&&(<>
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
              <TextField type="number" value={form.monthlyNetSalary===0?"":String(form.monthlyNetSalary)}
                onChange={v=>set("monthlyNetSalary",Math.max(0,parseInt(v)||0))} placeholder="Take home salary"
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
        </div>
      </FormCard>

      {/* ── EXISTING LOAN EXPOSURE ───────────────────────────────────── */}
      <FormCard title="Existing Loan Exposure" subtitle="Fill 0 if you have no existing loans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div id="existingEMI"><FieldLabel label="Existing Total EMI" required/>
            <TextField type="number" value={form.existingEMI} onChange={v=>set("existingEMI",v.replace(/\D/g,""))} placeholder="0" err={errors.existingEMI}/>
          </div>
          <div id="existingLoanAmount"><FieldLabel label="Existing Loan Amount (Total)" required/>
            <TextField type="number" value={form.existingLoanAmount} onChange={v=>set("existingLoanAmount",v.replace(/\D/g,""))} placeholder="0" err={errors.existingLoanAmount}/>
          </div>
        </div>

        <div className="mb-5">
          <FieldLabel label="Existing Loan Bank's Name"/>
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
          <PillMultiSelect options={masters.existingLoanTypes} selected={form.existingLoanTypes} disabled={!hasExposure}
            onChange={vals=>setForm(p=>({...p,existingLoanTypes:vals, existingLoanTypesOther:vals.includes(OTHER_OPTION)?p.existingLoanTypesOther:[]}))}
            color={C.navy}/>

          {hasExposure&&form.existingLoanTypes.includes(OTHER_OPTION)&&(
            <OtherOptionList label="Other Existing Loan Types" placeholder="Enter other loan type"
              items={form.existingLoanTypesOther} onAdd={addOtherLoanType} onRemove={removeOtherLoanType} color={C.navy} existingOptions={masters.existingLoanTypes}/>
          )}
        </div>
      </FormCard>

      {/* ── PERSONAL DETAILS ─────────────────────────────────────────── */}
      <FormCard title="Personal Details" subtitle="Basic details as per your official documents">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div id="fullName"><FieldLabel label="Full Name" required/>
            <TextField value={form.fullName} onChange={v=>set("fullName",v.slice(0,100))} maxLength={100} placeholder="As per Aadhaar / PAN" err={errors.fullName}/>
          </div>
          <div id="mobile"><FieldLabel label="Mobile Number" required/>
            <div className="flex items-center rounded-xl overflow-hidden"
              style={{border:`1.5px solid ${errors.mobile?"#ef4444":"#e2e8f0"}`,background:"#fafafa"}}>
              <span className="px-3 py-2.5 text-sm font-semibold shrink-0 border-r" style={{color:C.dark,borderColor:"#e2e8f0"}}>🇮🇳 +91</span>
              <input type="tel" value={form.mobile} maxLength={10} placeholder="10-digit number"
                onChange={e=>set("mobile",e.target.value.replace(/\D/g,""))}
                className="w-full px-3 py-2.5 text-sm bg-transparent focus:outline-none"/>
            </div><FieldError msg={errors.mobile}/>
          </div>
          <div id="email"><FieldLabel label="Email Address" required/>
            <TextField type="email" value={form.email} onChange={v=>set("email",v)} placeholder="your@email.com" err={errors.email}/>
          </div>
          <div id="dob"><FieldLabel label="Date of Birth (as per PAN card)" required/>
            <DateOfBirthPicker value={form.dob} onChange={v=>set("dob",v)} err={errors.dob}/>
          </div>
          <div id="panNumber"><FieldLabel label="PAN Number" required/>
            <TextField value={form.panNumber} onChange={v=>set("panNumber",formatPAN(v))} placeholder="Individual pan card no. - AAAAA9999A" maxLength={10} err={errors.panNumber} extraCls="uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"/>
          </div>
          <div id="state"><FieldLabel label="Current Residence State" required/>
            <SelectField value={form.state} onChange={v=>{
              set("state",v); set("city",""); loadCities(v);
            }} options={masters.states} placeholder="Select" err={errors.state}/>
          </div>
          <div id="city"><FieldLabel label="Current Residence City" required/>
            <SelectField value={form.city} onChange={v=>set("city",v)}
              options={cityOptions} placeholder={form.state?"Select city":"Select state first"} disabled={!form.state} err={errors.city}/>
          </div>
          <PincodeInputField
            id="pincode" label="Current Residence Pincode"
            value={form.pincode} onChange={v=>set("pincode",v)} err={errors.pincode}
          />
          <SelectWithOther
            id="residenceStatus" label="Status of Current Residence" required
            value={form.residenceStatus} onChange={v=>{
              set("residenceStatus",v);
              if(v!==OTHER_OPTION) set("residenceStatusOther","");
            }} options={masters.residenceStatuses} err={errors.residenceStatus}
            otherId="residenceStatusOther" otherLabel="Mention Status of Residence"
            otherValue={form.residenceStatusOther} onOtherChange={v=>set("residenceStatusOther",v)}
            otherPlaceholder="Enter residence status type" otherErr={errors.residenceStatusOther}
          />
        </div>
      </FormCard>

      {/* ── Consent + Submit ─────────────────────────────────────────── */}
      <label className="flex items-start gap-2.5 mb-5 cursor-pointer select-none">
        <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded shrink-0" style={{accentColor:C.teal}}/>
        <span className="text-xs" style={{color:C.gray}}>
          By continuing, you agree to Indexia Finance <a href={TERMS_OF_USE_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{color:C.navy}}>Terms of Use</a> and <a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{color:C.navy}}>Privacy Policy</a>.
        </span>
      </label>

      {apiError&&(
        <div className="rounded-xl px-4 py-3 text-sm flex gap-2 items-start mb-5" style={{background:"#fef2f2",border:"1px solid #fecaca",color:"#dc2626"}}>
          <span className="shrink-0 mt-0.5">⚠️</span>{apiError}
        </div>
      )}

      <button type="submit" disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-70 flex items-center justify-center gap-2 hover:shadow-lg hover:opacity-90"
        style={{background:`linear-gradient(135deg,${C.teal},${C.navy})`}}>
        {isSubmitting?(
          <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25"/>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>Submitting...</>
        ):"✓ Submit Application"}
      </button>
    </form>
  );
};

export default ApplicationForm;
