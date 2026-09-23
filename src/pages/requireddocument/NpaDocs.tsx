import DocPageLayout from "./DocPageLayout";
import type { DocSection } from "./types";
import bannerImg from "../../assets/loan-images/commercial-banner.png";

const sections: DocSection[] = [
  {
    id: "kyc",
    title: "Identification & Address Proof",
    docs: [
      { name: "Identification Proof", note: "PAN Card, Aadhaar Card, passport, or other valid identity documents" },
      { name: "Address Proof", note: "Utility bills, rental agreement, or other valid address documents" },
    ],
  },
  {
    id: "account",
    title: "Loan Account Documents",
    docs: [
      { name: "Loan Account Details", note: "Details of the existing loan account classified as NPA" },
      { name: "Sanction Letter / Loan Agreement", note: "Original sanction letter and loan agreement copies" },
      { name: "Loan Account Statement", note: "Statement showing outstanding dues and overdue amount" },
    ],
  },
  {
    id: "financial",
    title: "Income & Financial Documents",
    docs: [
      { name: "Income Proof", note: "Salary slips, Income Tax Returns, bank statements, or other income-related documents, where applicable" },
      { name: "Bank Statements", note: "Recent bank statements to assess financial standing and repayment capacity" },
    ],
  },
  {
    id: "other",
    title: "Other Supporting Documents",
    docs: [
      { name: "Other Supporting Documents", note: "Any additional documents required for verification and credit assessment" },
    ],
  },
];

const NpaDocs = () => (
  <DocPageLayout
    loanName="NPA (Non-Performing Assets)"
    breadcrumb="NPA · Required Documents"
    bannerBg={bannerImg}
    sections={sections}
    applySlug="npa"
  />
);

export default NpaDocs;
