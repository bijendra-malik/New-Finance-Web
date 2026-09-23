import DocPageLayout from "./DocPageLayout";
import type { DocSection } from "./types";
import bannerImg from "../../assets/loan-images/business-banner.png";

const sections: DocSection[] = [
  {
    id: "common",
    title: "Common Documents",
    docs: [
      { name: "2 Photographs", note: "Of each applicant & co-applicant" },
      { name: "PAN Card Copy", note: "Each applicant & co-applicant" },
      { name: "Aadhaar Card", note: "Each applicant & co-applicant" },
      { name: "Utility Bill", note: "Of office and current residence — latest month, each applicant & co-applicant" },
    ],
  },
  {
    id: "income",
    title: "Income Documents",
    docs: [
      { name: "3 Years ITR & Computation of Income", note: "P&L, Balance Sheet, all annexures & schedules, Dr. & Cr. List — self & CA attested" },
      { name: "Sales & Purchase Summary", note: "Last 3 years (till date)" },
      { name: "Dr. & Cr. List", note: "Last 3 years (till date)" },
      { name: "Last 12 Months Bank Statement", note: "Company account — all EMI reflections if any loans are ongoing" },
      { name: "Sanction Letter of All Loans & OD/CC", note: "If applicable" },
    ],
  },
  {
    id: "additional",
    title: "Additional Documents",
    docs: [
      { name: "PAN Card Copy of Company" },
      { name: "MOA & AOA / Partnership Deed" },
      { name: "List of Directors / Partners & Shareholders" },
      { name: "Business Proof", note: "Shop & Establishment Certificate, VAT, Sales Tax, GST, Service Tax, IEC" },
      { name: "GST Certificate of the Company" },
    ],
  },
];

const BusinessLoanDocs = () => (
  <DocPageLayout
    loanName="Business Loan"
    breadcrumb="Business Loan · Required Documents"
    bannerBg={bannerImg}
    sections={sections}
    applySlug="businessloan"
  />
);

export default BusinessLoanDocs;
