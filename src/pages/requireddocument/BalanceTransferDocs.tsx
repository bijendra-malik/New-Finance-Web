import DocPageLayout from "./DocPageLayout";
import type { DocSection } from "./types";
import bannerImg from "../../assets/loan-images/BlanceTransper-banner.png";

const sections: DocSection[] = [
  {
    id: "homeloan-bt",
    title: "Home Loan Balance Transfer Documents",
    docs: [
      { name: "PAN Card" },
      { name: "Company ID Card" },
      { name: "Residence Proof" },
      { name: "Self-Owned Residence", note: "Latest electricity bill / landline bill / credit card bill" },
      { name: "Rented Residence", note: "Current rent agreement + latest electricity bill of the flat + permanent residence proof" },
      { name: "Latest CTC" },
      { name: "Salary Slips", note: "Last 3 months" },
      { name: "Salary Account & Bank Statement", note: "Up to date — last 6 months" },
      { name: "Form 16", note: "Latest" },
      { name: "Loan Repayment Track Records", note: "If any" },
      { name: "Foreclosure Letter & List of Original Documents", note: "Obtained from existing bank where loan is active — originals to be submitted" },
      { name: "Property Documents", note: "Residential / commercial premises" },
      { name: "Photocopies of Property Documents", note: "Originals collected at time of disbursement" },
    ],
  },
  {
    id: "common",
    title: "Common Documents (Secured & Unsecured BT)",
    docs: [
      { name: "2 Photographs", note: "Each applicant & co-applicant" },
      { name: "PAN Card Copy", note: "Each applicant & co-applicant" },
      { name: "Aadhaar Card Copy", note: "Applicant & co-applicant" },
      { name: "Passport Copy", note: "Each applicant & co-applicant" },
      { name: "Self-Owned Residence Proof", note: "Latest month — each applicant & co-applicant" },
      { name: "Utility Bill (Address Proof)", note: "Of office, if business profile" },
    ],
  },
  {
    id: "income-salaried",
    title: "Income Documents — Salaried",
    docs: [
      { name: "Payslips", note: "Last 6 months + TDS certificate" },
      { name: "Employment Certificate", note: "From employer" },
      { name: "Form 16", note: "Latest 2 years, issued by employer" },
      { name: "Bank Statement", note: "Last 12 months — salary account" },
    ],
  },
  {
    id: "income-selfemployed",
    title: "Income Documents — Self-Employed",
    docs: [
      { name: "PAN Card Copy of Company" },
      { name: "MOA & AOA / Partnership Deed", note: "Proprietorship — registration certificate or business proof" },
      { name: "3 Years ITR", note: "Computation of income, P&L, Balance Sheet, all annexures — self & CA attested" },
      { name: "Last 12 Months Bank Statement (Company)", note: "All EMI reflections as per Balance Sheet" },
      { name: "GST Certificate Copy" },
      { name: "Sanction Letter of All Loans & OD/CC" },
      { name: "Sales & Purchase Summary", note: "Last 3 years till date" },
      { name: "Dr. & Cr. List", note: "Last 3 years till date" },
    ],
  },
  {
    id: "unsecured",
    title: "Additional — Unsecured Loan Transfer",
    docs: [
      { name: "Loan Repayment Track Records" },
      { name: "Foreclosure Letter of Existing Loan" },
    ],
  },
  {
    id: "secured",
    title: "Additional — Secured Loan Transfer",
    docs: [
      { name: "Property Documents", note: "Registered deed, OC & share certificate" },
      { name: "Loan Repayment Track Records" },
      { name: "Foreclosure Letter & List of Original Documents", note: "From existing bank where loan is active — originals to be submitted" },
      { name: "Photocopies of All Property Documents", note: "Originals collected at time of disbursement" },
    ],
  },
];

const BalanceTransferDocs = () => (
  <DocPageLayout
    loanName="Balance Transfer"
    breadcrumb="Balance Transfer · Required Documents"
    bannerBg={bannerImg}
    sections={sections}
    applySlug="balancetransfer"
  />
);

export default BalanceTransferDocs;
