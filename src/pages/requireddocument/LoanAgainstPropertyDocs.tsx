import DocPageLayout from "./DocPageLayout";
import type { DocSection } from "./types";
import bannerImg from "../../assets/loan-images/AgainstProperty-banner.png"

const sections: DocSection[] = [
  {
    id: "common",
    title: "Common Documents",
    docs: [
      { name: "2 Photographs", note: "Each applicant & co-applicant" },
      { name: "PAN Card Copy", note: "Each applicant & co-applicant" },
      { name: "Aadhaar Card Copy", note: "Each applicant & co-applicant" },
      { name: "Passport Copy", note: "Each applicant & co-applicant" },
      { name: "Utility Bill (Address Proof)", note: "Office and residence — latest month, each applicant & co-applicant" },
    ],
  },
  {
    id: "income",
    title: "Income Documents",
    docs: [
      { name: "Last 3 Years ITR (Company)", note: "Computation of income, P&L, Balance Sheet, all annexures & schedules, Dr. & Cr. List — self & CA attested" },
      { name: "Last 3 Years ITR (Individual)", note: "Computation of income, P&L, Balance Sheet" },
      { name: "Last 12 Months Bank Statements (Individual)" },
      { name: "Last 12 Months Bank Statement (Company)", note: "Including all EMI reflections as per Balance Sheet" },
      { name: "Sanction Letter of All Loans & OD/CC", note: "If any" },
      { name: "Sales & Purchase Summary", note: "Last 3 years till date" },
      { name: "Dr. & Cr. List", note: "Last 3 years till date" },
    ],
  },
  {
    id: "additional",
    title: "Additional Documents",
    docs: [
      { name: "MOA & AOA / Partnership Deed", note: "For proprietorship — registration certificate or business proof" },
      { name: "PAN Card Copy of Company" },
      { name: "Business Proof", note: "Shop & Establishment Certificate, VAT, Sales Tax, GST, Service Tax, IEC" },
      { name: "GST Certificate of the Company" },
      { name: "List of Directors / Partners & Shareholders" },
    ],
  },
  {
    id: "property",
    title: "Property Documents",
    docs: [
      { name: "Sales Deed" },
      { name: "OC & CC (Occupancy & Completion Certificate)" },
      { name: "Share Certificate" },
      { name: "Approved Building Plan" },
      { name: "Agreement Copy with Builder", note: "For new property" },
    ],
  },
  {
    id: "bt",
    title: "For Balance Transfer & Top-Up",
    docs: [
      { name: "LOD (List of Documents)", note: "From the bank where property is currently mortgaged" },
      { name: "Repayment Schedule", note: "Of all existing running loans" },
    ],
  },
];

const LoanAgainstPropertyDocs = () => (
  <DocPageLayout
    loanName="Loan Against Property"
    breadcrumb="Loan Against Property · Required Documents"
   bannerBg={bannerImg}
    sections={sections}
    applySlug="loanagainstproperty"
  />
);

export default LoanAgainstPropertyDocs;
