import DocPageLayout from "./DocPageLayout";
import type { DocSection } from "./types";
import bannerImg from "../../assets/loan-images/AgainstProperty-banner.png";

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
    id: "securities",
    title: "Securities & DEMAT Documents",
    docs: [
      { name: "Demat Account Details", note: "Demat account statement and details of the securities proposed to be pledged" },
      { name: "Shareholding / Investment Details", note: "Details of eligible shares and securities held by the applicant" },
      { name: "Security / Pledge Documents", note: "Documents and declarations required for pledging the eligible shares" },
    ],
  },
  {
    id: "financial",
    title: "Income & Financial Documents",
    docs: [
      { name: "Income Proof", note: "Salary slips, Income Tax Returns, bank statements, or other income-related documents, where applicable" },
      { name: "Bank Statements", note: "Recent bank statements to assess financial transactions and repayment capacity" },
      { name: "Financial Documents", note: "Relevant financial statements or other documents where required" },
      { name: "Existing Loan Details", note: "Details of existing loans or financial obligations, where applicable" },
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

const LoanAgainstShareDocs = () => (
  <DocPageLayout
    loanName="Loan Against Share"
    breadcrumb="Loan Against Share · Required Documents"
    bannerBg={bannerImg}
    sections={sections}
    applySlug="loan-against-share"
  />
);

export default LoanAgainstShareDocs;
