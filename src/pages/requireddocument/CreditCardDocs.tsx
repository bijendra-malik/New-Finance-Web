import DocPageLayout from "./DocPageLayout";
import type { DocSection } from "./types";
import bannerImg from "../../assets/loan-images/CreditCards-banner.png";

const sections: DocSection[] = [
  {
    id: "identity",
    title: "Identity & Signature Proof",
    docs: [
      { name: "PAN Card" },
      { name: "Driving Licence" },
      { name: "Voter ID Card" },
      { name: "Aadhaar Card" },
      { name: "Employee Identity Card", note: "For government employees" },
    ],
  },
  {
    id: "address",
    title: "Address Proof",
    docs: [
      { name: "Bank Statement" },
      { name: "Rent Agreement" },
      { name: "Voter ID Card" },
      { name: "Ration Card" },
      { name: "Passport" },
      { name: "Driving Licence" },
      { name: "Utility Bill", note: "Telephone / electricity / water / credit card bill" },
      { name: "Property Tax Receipt" },
    ],
  },
  {
    id: "age",
    title: "Age Proof",
    docs: [
      { name: "Voter ID Card" },
      { name: "Secondary School Certificate (Class 10)" },
      { name: "Birth Certificate" },
      { name: "Passport" },
      { name: "Aadhaar Card" },
      { name: "Pension Payment Order" },
      { name: "LIC Policy Receipt" },
    ],
  },
  {
    id: "income-salaried",
    title: "Income Proof — Salaried",
    docs: [
      { name: "Latest 3 Months Salary Slips" },
      { name: "Salary Account Bank Statement", note: "Last 6 months" },
    ],
  },
  {
    id: "income-selfemployed",
    title: "Income Proof — Self-Employed",
    docs: [
      { name: "Latest IT Returns with Computation of Income" },
      { name: "Certified Financial Documents" },
      { name: "Business Continuity Proof" },
    ],
  },
];

const CreditCardDocs = () => (
  <DocPageLayout
    loanName="Credit Card"
    breadcrumb="Credit Card · Required Documents"
    bannerBg={bannerImg}
    sections={sections}
    applySlug="credit-card"
  />
);

export default CreditCardDocs;
