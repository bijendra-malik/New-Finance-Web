import DocPageLayout from "./DocPageLayout";
import type { DocSection } from "./types";
import bannerImg from "../../assets/loan-images/personal-banner.png";

const sections: DocSection[] = [
  {
    id: "identity",
    title: "Identity & KYC",
    docs: [
      { name: "Passport Size Photograph", note: "Recent, plain white background" },
      { name: "PAN Card", note: "Clear scan or high-quality photo" },
      { name: "Aadhaar Card", note: "Front & back copy" },
    ],
  },
  {
    id: "address",
    title: "Address Proof",
    docs: [
      { name: "Current Residence Proof", note: "Utility bill, rent agreement, or bank statement" },
      { name: "Permanent Address Proof", note: "Voter ID, passport, or Aadhaar" },
    ],
  },
  {
    id: "income",
    title: "Income & Financial",
    docs: [
      { name: "Latest 3 Months Salary Slip", note: "For salaried applicants" },
      { name: "Bank Statement (3–6 Months)", note: "Salaried account / salary-credited account" },
    ],
  },
  {
    id: "selfemployed",
    title: "Self-Employed (Additional)",
    docs: [
      { name: "Balance Sheet & P&L Account", note: "Last 2 financial years" },
      { name: "Partnership Deed / MOA / AOA", note: "For firms or companies" },
      { name: "Other Mandatory Business Documents", note: "GST returns, trade licence, etc." },
    ],
  },
];

const PersonalLoanDocs = () => (
  <DocPageLayout
    loanName="Personal Loan"
    breadcrumb="Personal Loan · Required Documents"
    bannerBg={bannerImg}
    sections={sections}
    applySlug="personalloan"
  />
);

export default PersonalLoanDocs;
