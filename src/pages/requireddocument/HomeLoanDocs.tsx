import DocPageLayout from "./DocPageLayout";
import type { DocSection } from "./types";
import bannerImg from "../../assets/loan-images/Home-banner.png";
const sections: DocSection[] = [
  {
    id: "common",
    title: "Common Documents",
    docs: [
      { name: "Passport-size Photograph", note: "Applicant & co-applicant" },
      { name: "PAN Card Copy", note: "Applicant & co-applicant" },
      { name: "Aadhaar Card Copy", note: "Applicant & co-applicant" },
      { name: "Current Address Proof", note: "Applicant & co-applicant" },
      { name: "Income Proof", note: "Applicant & co-applicant" },
      { name: "Bank Statement", note: "Last 12 months — applicant; last 6 months — co-applicant" },
    ],
  },
  {
    id: "salaried",
    title: "Salaried Applicants",
    docs: [
      { name: "Payslips", note: "Last 6 months + TDS certificate" },
      { name: "Employment Certificate", note: "From current employer" },
      { name: "Form 16", note: "Latest 2 years, issued by employer" },
    ],
  },
  {
    id: "selfemployed",
    title: "Self-Employed Applicants",
    docs: [
      { name: "Business Proof", note: "Partnership deed / MOA & AOA / Shop & Establishment / GST / VAT / IEC" },
      { name: "Audited Financial Statements", note: "Last 3 years" },
      { name: "Profit & Loss Account", note: "Last 3 years" },
      { name: "Income Tax Assessment Order" },
      { name: "Company Current Address Proof" },
      { name: "GST Certificate of the Company" },
    ],
  },
  {
    id: "other",
    title: "Other Documents",
    docs: [
      { name: "Existing Loan Sanction Letters", note: "If any" },
      { name: "Repayment Schedule of Existing EMIs", note: "If any" },
      { name: "Property Documents", note: "Agreement copy / booking slip / E-bill, OC & share certificate of the property to be purchased" },
    ],
  },
];

const HomeLoanDocs = () => (
  <DocPageLayout
    loanName="Home Loan"
    breadcrumb="Home Loan · Required Documents"
   bannerBg={bannerImg}
    sections={sections}
    applySlug="homeloan"
  />
);

export default HomeLoanDocs;
