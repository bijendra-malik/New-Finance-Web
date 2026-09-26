import DocPageLayout from "./DocPageLayout";
import type { DocSection } from "./types";
import bannerImg from "../../assets/loan-images/personal-banner.png";

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
    id: "gold",
    title: "Gold & Pledge Documents",
    docs: [
      { name: "Gold Ornaments Details", note: "Details of the gold ornaments/jewellery proposed to be pledged" },
      { name: "Gold Purchase Invoice / Valuation", note: "Purchase invoices or valuation report, where available" },
      { name: "Pledge Declaration", note: "Declaration for pledging the gold as security for the loan" },
    ],
  },
  {
    id: "financial",
    title: "Income & Financial Documents",
    docs: [
      { name: "Income Proof", note: "Salary slips, Income Tax Returns, bank statements, or other income-related documents, where applicable" },
      { name: "Bank Statements", note: "Recent bank statements to assess financial transactions and repayment capacity" },
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

const GoldLoanDocs = () => (
  <DocPageLayout
    loanName="Gold Loan"
    breadcrumb="Gold Loan · Required Documents"
    bannerBg={bannerImg}
    sections={sections}
    applySlug="gold-loan"
  />
);

export default GoldLoanDocs;
