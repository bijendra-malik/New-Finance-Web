import { useMemo, useState } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import { THEME as C } from "../../../../../constants/theme";
import { TERMS_OF_USE_URL, PRIVACY_POLICY_URL } from "../../../../../constants/legalLinks";
import { OTHER_OPTION } from "../../../../../constants/masters";
import { useMasters } from "../../../../../hooks/useMasters";
import SubmissionSuccess from "../../../../../components/form/SubmissionSuccess";
import { buildSuccessSections } from "../../../../../components/form/successSections";
import { formatPAN } from "../../../../../utils/formatters";
import {
  DateField, DateOfBirthPicker, FieldError, FieldLabel, FormCard,
  MORE_THAN_TENURE_OPTION, OtherOptionList, PillMultiSelect, PincodeInputField, SelectField, SelectWithOther,
  TenureYearsField, TextField,
} from "../../../../../components/form/FormControls";

// ── Local type — no backend yet, this is purely the shape used to render the UI success state ──
export interface EducationLoanApplication {
  _id: string;
  fullName: string; mobile: string; email: string; dob: string; panNumber?: string;
  state: string; city: string; pincode: string; residenceStatus: string;
  parentRelationship: string; parentFullName: string; parentMobile: string; parentEmail: string;
  parentDob: string; parentPanNumber: string;
  parentState: string; parentCity: string; parentPincode: string; parentResidenceStatus: string;
  educationCountry: string; fieldOfStudy: string; courseName: string; university: string; instituteName: string;
  enrollmentStatus: string; courseDuration: number; educationCost: number;
  employmentType: string;
  companyName?: string; companyType?: string; monthlyNetSalary?: number; salaryReceivedAs?: string; salaryBankName?: string;
  businessName?: string; businessType?: string;
  gstNumber?: string; companyPanNumber?: string; natureOfBusiness?: string; industryType?: string; subIndustry?: string;
  businessEstablishedDate?: string; transactionBankName?: string; transactionBanks?: string[];
  lastYearTurnover?: number; last2YearsTurnover?: number;
  lastYearNetIncome?: number; last2YearsNetIncome?: number;
  profession?: string;
  currentYearTurnover?: number; priorYearTurnover?: number;
  currentYearNetIncome?: number; previousYearNetIncome?: number;
  businessState?: string; businessCity?: string; businessPincode?: string; businessPlaceStatus?: string;
  loanAmount: number; loanTenure: number;
  existingEMI: number; existingLoanAmount: number;
  existingBanks: string[]; existingBanksOther?: string[];
  existingLoanTypes: string[]; existingLoanTypesOther?: string[];
  status: "Pending";
  createdAt: string;
}

const SALARIED = "Salaried";
const SELF_EMPLOYED_BUSINESS = "Self Employed - Business";
const SELF_EMPLOYED_PROFESSIONAL = "Self Employed - Professional";
const MULTIPLE_TRANSACTION_BANKS = "Multiple Transaction Banks";

interface ApplicationFormProps {
  userName?: string;
  userEmail?: string;
  onSubmit?: (id: string, app: EducationLoanApplication) => void;
}
interface FormData {
  fullName:string; mobile:string; email:string; dob:string; panNumber:string;
  state:string; city:string; pincode:string; residenceStatus:string; residenceStatusOther:string;
  parentRelationship:string; parentRelationshipOther:string;
  parentFullName:string; parentMobile:string; parentEmail:string; parentDob:string; parentPanNumber:string;
  parentState:string; parentCity:string; parentPincode:string;
  parentResidenceStatus:string; parentResidenceStatusOther:string;
  loanAmount:number; loanTenureYears:number; loanTenureYearsCustom:number;
  educationCountry:string; educationCountryOther:string;
  fieldOfStudy:string; fieldOfStudyOther:string;
  courseName:string; university:string; instituteName:string;
  enrollmentStatus:string; enrollmentStatusOther:string;
  courseDuration:string; educationCost:string;
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
  existingEMI:string; existingLoanAmount:string;
  existingBanks:string[]; existingLoanTypes:string[]; existingBanksOther:string[]; existingLoanTypesOther:string[];
}

const ApplicationForm = ({userName="",userEmail="",onSubmit}:ApplicationFormProps) => {
  const {user} = useAuth();
  const {masters} = useMasters();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<EducationLoanApplication|null>(null);
  const [agreed, setAgreed] = useState(true);
  const [form, setForm] = useState<FormData>({
    fullName:user?.name||userName, mobile:user?.mobile||"", email:user?.email||userEmail,
    dob:"", panNumber:"", state:"", city:"", pincode:"", residenceStatus:"", residenceStatusOther:"",
    parentRelationship:"", parentRelationshipOther:"",
    parentFullName:"", parentMobile:"", parentEmail:"", parentDob:"", parentPanNumber:"",
    parentState:"", parentCity:"", parentPincode:"",
    parentResidenceStatus:"", parentResidenceStatusOther:"",
    loanAmount:0, loanTenureYears:0, loanTenureYearsCustom:0,
    educationCountry:"", educationCountryOther:"",
    fieldOfStudy:"", fieldOfStudyOther:"",
    courseName:"", university:"", instituteName:"",
    enrollmentStatus:"", enrollmentStatusOther:"",
    courseDuration:"", educationCost:"",
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
    existingEMI:"", existingLoanAmount:"",
    existingBanks:[], existingLoanTypes:[], existingBanksOther:[], existingLoanTypesOther:[],
  });
  const [touched, setTouched] = useState<Partial<Record<keyof FormData,boolean>>>({});

  const cityOptions = useMemo(
    () => form.state ? masters.citiesByState[form.state] ?? [] : [],
    [form.state, masters.citiesByState]
  );
  const parentCityOptions = useMemo(
    () => form.parentState ? masters.citiesByState[form.parentState] ?? [] : [],
    [form.parentState, masters.citiesByState]
  );

  const businessCityOptions = useMemo(
    () => form.businessState ? masters.citiesByState[form.businessState] ?? [] : [],
    [form.businessState, masters.citiesByState]
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

  const computeErrors = (draft:FormData = form) => {
    const e:Partial<Record<keyof FormData,string>> = {};
    if(draft.loanAmount<50000) e.loanAmount="Minimum ₹50,000";
    if(!draft.loanTenureYears) e.loanTenureYears="Select loan tenure";

    if(!draft.educationCountry) e.educationCountry="Country for education is required";
    else if(draft.educationCountry===OTHER_OPTION&&!draft.educationCountryOther.trim()) e.educationCountryOther="Please mention country";
    if(!draft.fieldOfStudy) e.fieldOfStudy="Field of study is required";
    else if(draft.fieldOfStudy===OTHER_OPTION&&!draft.fieldOfStudyOther.trim()) e.fieldOfStudyOther="Please mention field of study";
    if(!draft.courseName.trim()) e.courseName="Course name is required";
    if(!draft.university.trim()) e.university="University is required";
    if(!draft.instituteName.trim()) e.instituteName="Institute name is required";
    if(!draft.enrollmentStatus) e.enrollmentStatus="Enrollment status is required";
    else if(draft.enrollmentStatus===OTHER_OPTION&&!draft.enrollmentStatusOther.trim()) e.enrollmentStatusOther="Please mention enrollment status";
    if(!draft.courseDuration.trim()) e.courseDuration="Course duration is required";
    else if(parseInt(draft.courseDuration)<=0) e.courseDuration="Enter a valid duration in years";
    if(!draft.educationCost.trim()) e.educationCost="Education cost is required";
    else if(parseFloat(draft.educationCost)<=0) e.educationCost="Enter a valid course cost";

    if(!draft.employmentType) e.employmentType="Employment type is required";

    if(draft.employmentType===SALARIED){
      if(!draft.companyName.trim()) e.companyName="Company name is required";
      if(!draft.companyType) e.companyType="Company type is required";
      else if(draft.companyType===OTHER_OPTION&&!draft.companyTypeOther.trim()) e.companyTypeOther="Please mention company type";
      if(!draft.monthlyNetSalary) e.monthlyNetSalary="Monthly net salary is required";
      else if(draft.monthlyNetSalary<=12000) e.monthlyNetSalary="Monthly income should be greater than 12,000";
      if(!draft.salaryReceivedAs) e.salaryReceivedAs="Select how salary is received";
      else if(draft.salaryReceivedAs!=="Cash"){
        if(!draft.salaryBankName) e.salaryBankName="Select salary bank name";
        else if(draft.salaryBankName===OTHER_OPTION&&!draft.salaryBankNameOther.trim()) e.salaryBankNameOther="Please mention salary bank name";
      }
    }

    if(draft.employmentType===SELF_EMPLOYED_BUSINESS){
      if(!draft.businessName.trim()) e.businessName="Company full name is required";
      if(!draft.businessType) e.businessType="Company type is required";
      else if(draft.businessType===OTHER_OPTION&&!draft.businessTypeOther.trim()) e.businessTypeOther="Please mention company type";

      if(draft.gstNumber.trim()&&!/^[0-9A-Z]{15}$/.test(draft.gstNumber.toUpperCase())) e.gstNumber="Enter a valid 15-character GST number";
      if(!draft.companyPanNumber.trim()) e.companyPanNumber="Company PAN Number is required";
      else if(!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(draft.companyPanNumber.toUpperCase())) e.companyPanNumber="Invalid PAN format";
      if(!draft.natureOfBusiness) e.natureOfBusiness="Nature of business is required";
      else if(draft.natureOfBusiness===OTHER_OPTION&&!draft.natureOfBusinessOther.trim()) e.natureOfBusinessOther="Please mention nature of business";
      if(!draft.industryType) e.industryType="Industry type is required";
      else if(draft.industryType===OTHER_OPTION&&!draft.industryTypeOther.trim()) e.industryTypeOther="Please mention industry type";
      if(!draft.businessEstablishedDate) e.businessEstablishedDate="Date of business establishment is required";
      if(draft.transactionBankName===OTHER_OPTION&&!draft.transactionBankNameOther.trim()) e.transactionBankNameOther="Please mention bank name";
      else if(draft.transactionBankName===MULTIPLE_TRANSACTION_BANKS&&draft.transactionBanks.length===0) e.transactionBanks="Please add at least one bank";
      if(!draft.lastYearTurnover) e.lastYearTurnover="Last year turnover is required";
      if(!draft.lastYearNetIncome) e.lastYearNetIncome="Annual income cannot be zero";
    }

    if(draft.employmentType===SELF_EMPLOYED_PROFESSIONAL){
      if(!draft.profession) e.profession="Profession is required";
      else if(draft.profession===OTHER_OPTION&&!draft.professionOther.trim()) e.professionOther="Please mention profession";
      if(!draft.currentYearTurnover) e.currentYearTurnover="Current year turnover is required";
      if(!draft.priorYearTurnover) e.priorYearTurnover="Last (2 years old) turnover is required";
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

    if(!draft.existingEMI.trim()) e.existingEMI="Existing Total EMI is required (enter 0 if none)";
    if(!draft.existingLoanAmount.trim()) e.existingLoanAmount="Existing Loan Amount is required (enter 0 if none)";

    // ── Student ──
    if(!draft.fullName.trim()) e.fullName="Name is required";
    if(!draft.mobile.trim()) e.mobile="Mobile is required";
    else if(!/^\d{10}$/.test(draft.mobile)) e.mobile="Enter valid 10-digit number";
    if(!draft.email.trim()) e.email="Email is required";
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) e.email="Enter valid email";
    if(!draft.dob) e.dob="Date of birth is required";
    else {
      const dobDate = new Date(draft.dob+"T00:00:00");
      const today = new Date(); today.setHours(0,0,0,0);
      if(dobDate>today) e.dob="Date of birth cannot be in the future";
    }
    if(draft.panNumber.trim()&&!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(draft.panNumber.toUpperCase())) e.panNumber="Invalid PAN format";
    if(!draft.state) e.state="State is required";
    if(!draft.city) e.city="City is required";
    if(!draft.pincode) e.pincode="Pincode is required";
    else if(!/^[1-9]\d{5}$/.test(draft.pincode)) e.pincode="Enter valid 6-digit pincode";
    if(!draft.residenceStatus) e.residenceStatus="Residence status is required";
    else if(draft.residenceStatus===OTHER_OPTION&&!draft.residenceStatusOther.trim()) e.residenceStatusOther="Please mention residence status type";

    // ── Parent / Co-applicant ──
    if(!draft.parentRelationship) e.parentRelationship="Relationship with applicant is required";
    else if(draft.parentRelationship===OTHER_OPTION&&!draft.parentRelationshipOther.trim()) e.parentRelationshipOther="Please mention relationship";
    if(!draft.parentFullName.trim()) e.parentFullName="Name is required";
    if(!draft.parentMobile.trim()) e.parentMobile="Mobile is required";
    else if(!/^\d{10}$/.test(draft.parentMobile)) e.parentMobile="Enter valid 10-digit number";
    if(!draft.parentEmail.trim()) e.parentEmail="Email is required";
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.parentEmail)) e.parentEmail="Enter valid email";
    if(!draft.parentDob) e.parentDob="Date of birth is required";
    else {
      const dobDate = new Date(draft.parentDob+"T00:00:00");
      const today = new Date(); today.setHours(0,0,0,0);
      if(dobDate>today) e.parentDob="Date of birth cannot be in the future";
      else {
        const eighteenYearsAgo = new Date(today.getFullYear()-18, today.getMonth(), today.getDate());
        if(dobDate>eighteenYearsAgo) e.parentDob="Must be at least 18 years old";
      }
    }
    if(!draft.parentPanNumber.trim()) e.parentPanNumber="PAN is required";
    else if(!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(draft.parentPanNumber.toUpperCase())) e.parentPanNumber="Invalid PAN format";
    if(!draft.parentState) e.parentState="State is required";
    if(!draft.parentCity) e.parentCity="City is required";
    if(!draft.parentPincode) e.parentPincode="Pincode is required";
    else if(!/^[1-9]\d{5}$/.test(draft.parentPincode)) e.parentPincode="Enter valid 6-digit pincode";
    if(!draft.parentResidenceStatus) e.parentResidenceStatus="Residence status is required";
    else if(draft.parentResidenceStatus===OTHER_OPTION&&!draft.parentResidenceStatusOther.trim()) e.parentResidenceStatusOther="Please mention residence status type";

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
      document.getElementById(Object.keys(errs)[0])?.scrollIntoView({behavior:"smooth",block:"center"});
      return;
    }
    setIsSubmitting(true); setApiError("");
    await new Promise(res=>setTimeout(res,600));
    const app: EducationLoanApplication = {
      _id: `EL${Date.now()}`,
      fullName:form.fullName, mobile:form.mobile, email:form.email,
      dob:new Date(form.dob).toISOString(), panNumber:form.panNumber.trim()?form.panNumber.toUpperCase():undefined,
      state:form.state, city:form.city, pincode:form.pincode,
      residenceStatus:form.residenceStatus===OTHER_OPTION?form.residenceStatusOther:form.residenceStatus,
      parentRelationship:form.parentRelationship===OTHER_OPTION?form.parentRelationshipOther:form.parentRelationship,
      parentFullName:form.parentFullName, parentMobile:form.parentMobile, parentEmail:form.parentEmail,
      parentDob:new Date(form.parentDob).toISOString(), parentPanNumber:form.parentPanNumber.toUpperCase(),
      parentState:form.parentState, parentCity:form.parentCity,
      parentPincode:form.parentPincode,
      parentResidenceStatus:form.parentResidenceStatus===OTHER_OPTION?form.parentResidenceStatusOther:form.parentResidenceStatus,
      educationCountry:form.educationCountry===OTHER_OPTION?form.educationCountryOther:form.educationCountry,
      fieldOfStudy:form.fieldOfStudy===OTHER_OPTION?form.fieldOfStudyOther:form.fieldOfStudy,
      courseName:form.courseName, university:form.university, instituteName:form.instituteName,
      enrollmentStatus:form.enrollmentStatus===OTHER_OPTION?form.enrollmentStatusOther:form.enrollmentStatus,
      courseDuration:parseInt(form.courseDuration)||0, educationCost:parseFloat(form.educationCost)||0,
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
        ?(form.transactionBankName===OTHER_OPTION?form.transactionBankNameOther:form.transactionBankName||undefined)
        :undefined,
      transactionBanks:form.employmentType===SELF_EMPLOYED_BUSINESS&&form.transactionBankName===MULTIPLE_TRANSACTION_BANKS
        ?form.transactionBanks
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
      businessCity:(form.employmentType===SELF_EMPLOYED_BUSINESS||form.employmentType===SELF_EMPLOYED_PROFESSIONAL)?form.businessCity:undefined,
      businessPincode:(form.employmentType===SELF_EMPLOYED_BUSINESS||form.employmentType===SELF_EMPLOYED_PROFESSIONAL)
        ?(form.businessPincode)
        :undefined,
      businessPlaceStatus:(form.employmentType===SELF_EMPLOYED_BUSINESS||form.employmentType===SELF_EMPLOYED_PROFESSIONAL)
        ?(form.businessPlaceStatus===OTHER_OPTION?form.businessPlaceStatusOther:form.businessPlaceStatus)
        :undefined,
      loanAmount:form.loanAmount,
      loanTenure:(form.loanTenureYears===MORE_THAN_TENURE_OPTION?form.loanTenureYearsCustom:form.loanTenureYears)*12,
      existingEMI:parseInt(form.existingEMI)||0, existingLoanAmount:parseInt(form.existingLoanAmount)||0,
      existingBanks:form.existingBanks, existingBanksOther:form.existingBanksOther,
      existingLoanTypes:form.existingLoanTypes, existingLoanTypesOther:form.existingLoanTypesOther,
      status:"Pending", createdAt:new Date().toISOString(),
    };
    setSubmittedApp(app); setSubmitted(true);
    setIsSubmitting(false);
    if(onSubmit) onSubmit(app._id, app);
  };

  if(submitted && submittedApp) return (
    <SubmissionSuccess
      refNo={submittedApp._id.slice(-10).toUpperCase()}
      fullId={submittedApp._id}
      createdAt={submittedApp.createdAt}
      productName="Education Loan"
      applicantName={submittedApp.fullName}
      mobile={submittedApp.mobile}
      email={submittedApp.email}
      sections={buildSuccessSections(submittedApp, {
        productSection: {
          title: "Education Details",
          rows: [
            { label: "Country of Study", value: submittedApp.educationCountry },
            { label: "Field of Study", value: submittedApp.fieldOfStudy },
            { label: "Course", value: submittedApp.courseName },
            { label: "University", value: submittedApp.university },
            { label: "Institute", value: submittedApp.instituteName },
            { label: "Enrollment Status", value: submittedApp.enrollmentStatus },
            { label: "Course Duration", value: submittedApp.courseDuration ? `${submittedApp.courseDuration.toLocaleString("en-IN")} years` : undefined },
            { label: "Course Cost", value: submittedApp.educationCost ? `₹${submittedApp.educationCost.toLocaleString("en-IN")}` : undefined },
          ],
        },
        extraSections: [{
          title: "Co-applicant (Parent) Details",
          rows: [
            { label: "Relationship", value: submittedApp.parentRelationship },
            { label: "Full Name", value: submittedApp.parentFullName },
            { label: "Mobile", value: submittedApp.parentMobile ? `+91 ${submittedApp.parentMobile}` : undefined },
            { label: "Email", value: submittedApp.parentEmail },
            { label: "Date of Birth", value: submittedApp.parentDob },
            { label: "PAN Number", value: submittedApp.parentPanNumber },
            { label: "Residence", value: [submittedApp.parentCity, submittedApp.parentState].filter(Boolean).join(", ") || undefined },
            { label: "Residence Status", value: submittedApp.parentResidenceStatus },
          ],
        }],
      })}
    />
  );

  return (
    <form className="max-w-4xl mx-auto" onSubmit={handleSubmit} noValidate>
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{color:C.dark}}>
          Unlock the best Education Loan offers suitable for your needs from 43+ lenders
        </h1>
        <p className="text-xs mt-1.5" style={{color:C.gray}}>Fields with asterisk mark (*) are mandatory</p>
      </div>

      {/* ── LOAN REQUIREMENTS ────────────────────────────────────────── */}
      <FormCard title="Loan Requirements" subtitle="Tell us about the course you're financing">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div id="loanAmount"><FieldLabel label="Required Loan Amount" required/>
            <TextField type="number" value={form.loanAmount===0?"":String(form.loanAmount)}
              onChange={v=>set("loanAmount",Math.max(0,parseInt(v)||0))} placeholder="e.g. 1500000" err={errors.loanAmount}/>
          </div>
          <TenureYearsField
            id="loanTenureYears" label="Required Loan Tenure (in years)"
            value={form.loanTenureYears} onChange={v=>set("loanTenureYears",v)}
            customValue={form.loanTenureYearsCustom} onCustomChange={v=>set("loanTenureYearsCustom",v)}
            options={masters.educationLoanTenureYears} err={errors.loanTenureYears}
          />
          <SelectWithOther
            id="educationCountry" label="Country for Education" required
            value={form.educationCountry} onChange={v=>{
              set("educationCountry",v);
              if(v!==OTHER_OPTION) set("educationCountryOther","");
            }} options={masters.educationCountries} err={errors.educationCountry}
            otherId="educationCountryOther" otherLabel="Mention Country"
            otherValue={form.educationCountryOther} onOtherChange={v=>set("educationCountryOther",v)}
            otherPlaceholder="Enter country" otherErr={errors.educationCountryOther}
          />
          <SelectWithOther
            id="fieldOfStudy" label="Field of Study" required
            value={form.fieldOfStudy} onChange={v=>{
              set("fieldOfStudy",v);
              if(v!==OTHER_OPTION) set("fieldOfStudyOther","");
            }} options={masters.fieldOfStudy} err={errors.fieldOfStudy}
            otherId="fieldOfStudyOther" otherLabel="Mention Field of Study"
            otherValue={form.fieldOfStudyOther} onOtherChange={v=>set("fieldOfStudyOther",v)}
            otherPlaceholder="Enter field of study" otherErr={errors.fieldOfStudyOther}
          />
          <div id="courseName"><FieldLabel label="Course Name" required/>
            <TextField value={form.courseName} onChange={v=>set("courseName",v)} placeholder="e.g. B.Tech Computer Science" err={errors.courseName}/>
          </div>
          <div id="university"><FieldLabel label="University" required/>
            <TextField value={form.university} onChange={v=>set("university",v)} placeholder="Enter university name" err={errors.university}/>
          </div>
          <div id="instituteName"><FieldLabel label="Institute Name" required/>
            <TextField value={form.instituteName} onChange={v=>set("instituteName",v)} placeholder="Enter institute name" err={errors.instituteName}/>
          </div>
          <div id="enrollmentStatus"><FieldLabel label="Enrollment Status" required/>
            <SelectField value={form.enrollmentStatus} onChange={v=>{
              set("enrollmentStatus",v);
              if(v!==OTHER_OPTION) set("enrollmentStatusOther","");
            }} options={masters.enrollmentStatuses} placeholder="Select" err={errors.enrollmentStatus}/>
            {form.enrollmentStatus===OTHER_OPTION&&(
              <div className="mt-3" id="enrollmentStatusOther"><FieldLabel label="Mention Enrollment Status" required/>
                <TextField value={form.enrollmentStatusOther} onChange={v=>set("enrollmentStatusOther",v)} placeholder="Enter enrollment status" err={errors.enrollmentStatusOther}/>
              </div>
            )}
          </div>
          <div id="courseDuration"><FieldLabel label="Course Duration" required/>
            <TextField type="number" value={form.courseDuration} onChange={v=>set("courseDuration",v.replace(/\D/g,""))} placeholder="In years" err={errors.courseDuration}/>
          </div>
          <div id="educationCost"><FieldLabel label="Education Cost" required/>
            <TextField type="number" value={form.educationCost} onChange={v=>set("educationCost",v.replace(/[^0-9.]/g,""))} placeholder="Fees/Cost of entire course in Lakhs" err={errors.educationCost}/>
          </div>
        </div>
      </FormCard>

      {/* ── INCOME DETAILS ───────────────────────────────────────────── */}
      <FormCard title="Income Details (Self/Father/Mother)" subtitle="Tell us about the co-applicant's employment">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2" id="employmentType"><FieldLabel label="Employment Type" required/>
            <SelectField value={form.employmentType} onChange={setEmploymentType} options={masters.homeEmploymentTypes} placeholder="Select" err={errors.employmentType}/>
          </div>

          {form.employmentType===SALARIED&&(<>
            <div id="companyName"><FieldLabel label="Company Name" required/>
              <TextField value={form.companyName} onChange={v=>set("companyName",v)} placeholder="Company full name" err={errors.companyName}/>
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
              <TextField type="number" value={form.currentYearTurnover===0?"":String(form.currentYearTurnover)}
                onChange={v=>set("currentYearTurnover",Math.max(0,parseInt(v)||0))} placeholder="Current turn over" err={errors.currentYearTurnover}/>
            </div>
            <div id="priorYearTurnover"><FieldLabel label="Last (2 Years old) Turnover" required/>
              <TextField type="number" value={form.priorYearTurnover===0?"":String(form.priorYearTurnover)}
                onChange={v=>set("priorYearTurnover",Math.max(0,parseInt(v)||0))} placeholder="0" err={errors.priorYearTurnover}/>
            </div>
            <div id="currentYearNetIncome"><FieldLabel label="Current Year Net Income" required/>
              <TextField type="number" value={form.currentYearNetIncome===0?"":String(form.currentYearNetIncome)}
                onChange={v=>set("currentYearNetIncome",Math.max(0,parseInt(v)||0))} placeholder="Current year net profit" err={errors.currentYearNetIncome}/>
            </div>
            <div id="previousYearNetIncome"><FieldLabel label="Previous Year Net Income" required/>
              <TextField type="number" value={form.previousYearNetIncome===0?"":String(form.previousYearNetIncome)}
                onChange={v=>set("previousYearNetIncome",Math.max(0,parseInt(v)||0))} placeholder="0" err={errors.previousYearNetIncome}/>
            </div>
          </>)}

          {form.employmentType===SELF_EMPLOYED_BUSINESS&&(<>
            <div className="md:col-span-2">
              <h3 className="text-sm font-bold mt-2" style={{color:C.dark}}>Business Details</h3>
            </div>
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
              <TextField value={form.businessName} onChange={v=>set("businessName",v)} placeholder="Registered business / firm name" err={errors.businessName}/>
            </div>

            <div id="gstNumber"><FieldLabel label="GST No (if available)"/>
                <TextField value={form.gstNumber} onChange={v=>set("gstNumber",v.toUpperCase())} placeholder="Company GST No. – 15-character GSTIN" maxLength={15} err={errors.gstNumber} extraCls="uppercase tracking-wide"/>
              </div>
              <div id="companyPanNumber"><FieldLabel label="Company PAN Number" required/>
                <TextField value={form.companyPanNumber} onChange={v=>set("companyPanNumber",formatPAN(v))} placeholder="AAAAA9999A" maxLength={10} err={errors.companyPanNumber} extraCls="uppercase tracking-widest"/>
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
                  err={errors.businessEstablishedDate} maxDate={new Date(new Date().getFullYear()+50,11,31)} minDate={new Date(new Date().getFullYear()-100,0,1)}
                  portalId="educationloan-business-established-datepicker-portal"/>
              </div>

              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                </div>
                {form.transactionBankName===MULTIPLE_TRANSACTION_BANKS&&(
                  <div className="mt-4" id="transactionBanks">
                    <OtherOptionList label="Transaction Banks" placeholder="Enter bank name"
                      items={form.transactionBanks} onAdd={addTransactionBank} onRemove={removeTransactionBank} color={C.teal}/>
                    <FieldError msg={errors.transactionBanks}/>
                  </div>
                )}
              </div>

              <div id="lastYearTurnover"><FieldLabel label="Last Year Turnover" required/>
                <TextField type="number" value={form.lastYearTurnover===0?"":String(form.lastYearTurnover)}
                  onChange={v=>set("lastYearTurnover",Math.max(0,parseInt(v)||0))} placeholder="Company last year turnover" err={errors.lastYearTurnover}/>
              </div>
              <div id="last2YearsTurnover"><FieldLabel label="Last (2 Years old) Turnover"/>
                <TextField type="number" value={form.last2YearsTurnover===0?"":String(form.last2YearsTurnover)}
                  onChange={v=>set("last2YearsTurnover",Math.max(0,parseInt(v)||0))} placeholder="Company turnover 2 years ago"/>
              </div>
              <div id="lastYearNetIncome"><FieldLabel label="Last Year Net Income" required/>
                <TextField type="number" value={form.lastYearNetIncome===0?"":String(form.lastYearNetIncome)}
                  onChange={v=>set("lastYearNetIncome",Math.max(0,parseInt(v)||0))} placeholder="Company last year net profit" err={errors.lastYearNetIncome}/>
              </div>
              <div id="last2YearsNetIncome"><FieldLabel label="Last (2 Years old) Net Income"/>
                <TextField type="number" value={form.last2YearsNetIncome===0?"":String(form.last2YearsNetIncome)}
                  onChange={v=>set("last2YearsNetIncome",Math.max(0,parseInt(v)||0))} placeholder="Company net income 2 years ago"/>
              </div>
          </>)}

          {(form.employmentType===SELF_EMPLOYED_BUSINESS||form.employmentType===SELF_EMPLOYED_PROFESSIONAL)&&(<>
            <div id="businessState"><FieldLabel label="Current Business State" required/>
              <SelectField value={form.businessState} onChange={v=>{
                set("businessState",v); set("businessCity","");
              }} options={masters.states} placeholder="Select" err={errors.businessState}/>
            </div>
            <div id="businessCity"><FieldLabel label="Current Business City" required/>
              <SelectField value={form.businessCity} onChange={v=>set("businessCity",v)}
                options={businessCityOptions} placeholder={form.businessState?"Select city":"Select state first"} disabled={!form.businessState} err={errors.businessCity}/>
            </div>
            <PincodeInputField
              id="businessPincode" label="Current Business Pincode"
              value={form.businessPincode} onChange={v=>set("businessPincode",v)} err={errors.businessPincode}
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
            <TextField type="number" value={form.existingEMI} onChange={v=>set("existingEMI",v.replace(/\D/g,""))} placeholder="0" err={errors.existingEMI}/>
          </div>
          <div id="existingLoanAmount"><FieldLabel label="Existing Loan Amount (Total)" required/>
            <TextField type="number" value={form.existingLoanAmount} onChange={v=>set("existingLoanAmount",v.replace(/\D/g,""))} placeholder="0" err={errors.existingLoanAmount}/>
          </div>
        </div>

        <div className="mb-5">
          <FieldLabel label="Existing Loan Bank's Name"/>
          <PillMultiSelect options={masters.banks} selected={form.existingBanks}
            onChange={vals=>setForm(p=>({...p,existingBanks:vals, existingBanksOther:vals.includes(OTHER_OPTION)?p.existingBanksOther:[]}))}
            color={C.teal}/>

          {form.existingBanks.includes(OTHER_OPTION)&&(
            <OtherOptionList label="Other Existing Loan Bank Name" placeholder="Enter other bank name"
              items={form.existingBanksOther} onAdd={addOtherBank} onRemove={removeOtherBank} color={C.teal} existingOptions={masters.banks}/>
          )}
        </div>

        <div>
          <FieldLabel label="Existing Loan Types"/>
          <PillMultiSelect options={masters.existingLoanTypes} selected={form.existingLoanTypes}
            onChange={vals=>setForm(p=>({...p,existingLoanTypes:vals, existingLoanTypesOther:vals.includes(OTHER_OPTION)?p.existingLoanTypesOther:[]}))}
            color={C.navy}/>

          {form.existingLoanTypes.includes(OTHER_OPTION)&&(
            <OtherOptionList label="Other Existing Loan Types" placeholder="Enter other loan type"
              items={form.existingLoanTypesOther} onAdd={addOtherLoanType} onRemove={removeOtherLoanType} color={C.navy} existingOptions={masters.existingLoanTypes}/>
          )}
        </div>
      </FormCard>

      {/* ── PERSONAL DETAILS (STUDENT) ───────────────────────────────── */}
      <FormCard title="Personal Details (Student)" subtitle="Basic details as per your official documents">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div id="fullName"><FieldLabel label="Full Name" required/>
            <TextField value={form.fullName} onChange={v=>set("fullName",v)} placeholder="As per Aadhaar Card" err={errors.fullName}/>
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
          <div id="dob"><FieldLabel label="Date of Birth (as per aadhar card)" required/>
            <DateOfBirthPicker value={form.dob} onChange={v=>set("dob",v)} err={errors.dob}/>
          </div>
          <div className="md:col-span-2" id="panNumber"><FieldLabel label="PAN Number (if any)"/>
            <TextField value={form.panNumber} onChange={v=>set("panNumber",formatPAN(v))} placeholder="Individual pan card no. - AAAAA9999A" maxLength={10} err={errors.panNumber} extraCls="uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"/>
          </div>
          <div id="state"><FieldLabel label="Current Residence State" required/>
            <SelectField value={form.state} onChange={v=>{
              set("state",v); set("city","");
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

      {/* ── PERSONAL DETAILS (PARENT) ────────────────────────────────── */}
      <FormCard title="Personal Details (Parent)" subtitle="Co-applicant details as per official documents">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SelectWithOther
            id="parentRelationship" label="Relationship with the Applicant" required
            value={form.parentRelationship} onChange={v=>{
              set("parentRelationship",v);
              if(v!==OTHER_OPTION) set("parentRelationshipOther","");
            }} options={masters.parentRelationships} err={errors.parentRelationship}
            otherId="parentRelationshipOther" otherLabel="Mention Relationship"
            otherValue={form.parentRelationshipOther} onOtherChange={v=>set("parentRelationshipOther",v)}
            otherPlaceholder="Enter relationship" otherErr={errors.parentRelationshipOther}
          />
          <div id="parentFullName"><FieldLabel label="Full Name" required/>
            <TextField value={form.parentFullName} onChange={v=>set("parentFullName",v)} placeholder="As per PAN card" err={errors.parentFullName}/>
          </div>
          <div id="parentMobile"><FieldLabel label="Mobile Number" required/>
            <div className="flex items-center rounded-xl overflow-hidden"
              style={{border:`1.5px solid ${errors.parentMobile?"#ef4444":"#e2e8f0"}`,background:"#fafafa"}}>
              <span className="px-3 py-2.5 text-sm font-semibold shrink-0 border-r" style={{color:C.dark,borderColor:"#e2e8f0"}}>🇮🇳 +91</span>
              <input type="tel" value={form.parentMobile} maxLength={10} placeholder="10-digit number"
                onChange={e=>set("parentMobile",e.target.value.replace(/\D/g,""))}
                className="w-full px-3 py-2.5 text-sm bg-transparent focus:outline-none"/>
            </div><FieldError msg={errors.parentMobile}/>
          </div>
          <div id="parentEmail"><FieldLabel label="Email Address" required/>
            <TextField type="email" value={form.parentEmail} onChange={v=>set("parentEmail",v)} placeholder="your@email.com" err={errors.parentEmail}/>
          </div>
          <div id="parentDob"><FieldLabel label="Date of Birth (as per PAN card)" required/>
            <DateOfBirthPicker value={form.parentDob} onChange={v=>set("parentDob",v)} err={errors.parentDob}/>
          </div>
          <div id="parentPanNumber"><FieldLabel label="PAN Card Number" required/>
            <TextField value={form.parentPanNumber} onChange={v=>set("parentPanNumber",formatPAN(v))} placeholder="AAAAA9999A" maxLength={10} err={errors.parentPanNumber} extraCls="uppercase tracking-widest"/>
          </div>
          <div id="parentState"><FieldLabel label="Current Residence State" required/>
            <SelectField value={form.parentState} onChange={v=>{
              set("parentState",v); set("parentCity","");
            }} options={masters.states} placeholder="Select" err={errors.parentState}/>
          </div>
          <div id="parentCity"><FieldLabel label="Current Residence City" required/>
            <SelectField value={form.parentCity} onChange={v=>set("parentCity",v)}
              options={parentCityOptions} placeholder={form.parentState?"Select city":"Select state first"} disabled={!form.parentState} err={errors.parentCity}/>
          </div>
          <PincodeInputField
            id="parentPincode" label="Current Residence Pincode"
            value={form.parentPincode} onChange={v=>set("parentPincode",v)} err={errors.parentPincode}
          />
          <SelectWithOther
            id="parentResidenceStatus" label="Status of Current Residence" required
            value={form.parentResidenceStatus} onChange={v=>{
              set("parentResidenceStatus",v);
              if(v!==OTHER_OPTION) set("parentResidenceStatusOther","");
            }} options={masters.residenceStatuses} err={errors.parentResidenceStatus}
            otherId="parentResidenceStatusOther" otherLabel="Mention Status of Residence"
            otherValue={form.parentResidenceStatusOther} onOtherChange={v=>set("parentResidenceStatusOther",v)}
            otherPlaceholder="Enter residence status type" otherErr={errors.parentResidenceStatusOther}
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
