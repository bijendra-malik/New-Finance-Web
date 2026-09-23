import DocPageLayout from "./DocPageLayout";
import type { DocSection } from "./types";
import bannerImg from "../../assets/loan-images/Education-banner.png";

const sections: DocSection[] = [
  {
    id: "common",
    title: "Common Documents",
    docs: [
      { name: "Age Proof" },
      { name: "Address Proof" },
      { name: "Income Proof of Co-Applicant", note: "Father / mother / guardian" },
      { name: "Bank Statement of Co-Applicant", note: "Last 6 months" },
      { name: "Passport-size Photograph", note: "Applicant & co-applicant" },
    ],
  },
  {
    id: "salaried-coapplicant",
    title: "Co-Applicant — Salaried",
    docs: [
      { name: "Employment Certificate", note: "From current employer" },
      { name: "Payslips & TDS Certificate" },
      { name: "Form 16", note: "Latest, issued by employer" },
      { name: "Bank Statements" },
    ],
  },
  {
    id: "selfemployed-coapplicant",
    title: "Co-Applicant — Self-Employed",
    docs: [
      { name: "Audited Financial Statements", note: "Last 3 years" },
      { name: "Partnership Deed / MOA & AOA", note: "As applicable" },
      { name: "Profit & Loss Account" },
      { name: "Income Tax Assessment Order" },
    ],
  },
  {
    id: "other",
    title: "Other Documents",
    docs: [
      { name: "Latest Electricity Bill", note: "Co-applicant's owned house" },
    ],
  },
];

const EducationLoanDocs = () => (
  <DocPageLayout
    loanName="Education Loan"
    breadcrumb="Education Loan · Required Documents"
   bannerBg={bannerImg}
    sections={sections}
    applySlug="educationloan"
  />
);

export default EducationLoanDocs;
