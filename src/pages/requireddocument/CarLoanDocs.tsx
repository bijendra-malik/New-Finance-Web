import DocPageLayout from "./DocPageLayout";
import type { DocSection } from "./types";
import bannerImg from "../../assets/loan-images/car-banner.png";

const sections: DocSection[] = [
  {
    id: "common",
    title: "Common Documents",
    docs: [
      { name: "2 Photographs", note: "Each applicant & co-applicant" },
      { name: "Passport", note: "Each applicant & co-applicant" },
      { name: "Utility Bill", note: "Office and residence — latest month, each applicant & co-applicant" },
      { name: "PAN Card Copy", note: "Each applicant & co-applicant" },
    ],
  },
  {
    id: "salaried",
    title: "Salaried Applicants",
    docs: [
      { name: "Employment Certificate", note: "From employer" },
      { name: "Payslips", note: "Last 6 months + TDS certificate" },
      { name: "Form 16", note: "Last 2 years, issued by employer" },
      { name: "Bank Statements", note: "Salary account" },
    ],
  },
  {
    id: "income",
    title: "Income Documents (Self-Employed / Business)",
    docs: [
      { name: "3 Years ITR", note: "Computation of income, P&L, Balance Sheet, all annexures, Dr. & Cr. List — self & CA attested" },
      { name: "3 Years ITR (Individual)", note: "Computation of income, P&L, Balance Sheet" },
      { name: "Last 12 Months Bank Statements (Individual)" },
      { name: "Last 12 Months Bank Statement (Company)", note: "All EMI reflections if any loans are ongoing" },
      { name: "Sanction Letter of All Loans & OD/CC", note: "If any" },
      { name: "Sales & Purchase Summary", note: "Last 3 years till date" },
      { name: "Dr. & Cr. List", note: "Last 3 years till date" },
    ],
  },
  {
    id: "additional",
    title: "Additional Documents",
    docs: [
      { name: "MOA & AOA / Partnership Deed" },
      { name: "List of Directors / Partners & Shareholders" },
      { name: "PAN Card Copy of Company" },
      { name: "Business Proof", note: "Shop & Establishment Certificate, VAT, Sales Tax, Service Tax, IEC" },
    ],
  },
];

const CarLoanDocs = () => (
  <DocPageLayout
    loanName="Car Loan"
    breadcrumb="Car Loan · Required Documents"
    bannerBg={bannerImg}
    sections={sections}
    applySlug="car-loan"
  />
);

export default CarLoanDocs;
