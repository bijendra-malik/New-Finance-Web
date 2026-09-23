import DocPageLayout from "./DocPageLayout";
import type { DocSection } from "./types";
import bannerImg from "../../assets/loan-images/commercial-banner.png";

const sections: DocSection[] = [
  {
    id: "individual",
    title: "Individual Applicant",
    docs: [
      { name: "Application Form" },
      { name: "Passport Copy / PAN Card / Ration Card" },
      { name: "Passport-sized Photographs", note: "All applicants & co-applicants" },
      { name: "Latest Form 16 & 3 Months Salary Statement" },
      { name: "Latest 6 Months Bank Statement" },
      { name: "Repayment Track Record", note: "If any" },
    ],
  },
  {
    id: "business",
    title: "Sole Proprietor / Partnership / Pvt. Ltd. Company",
    docs: [
      { name: "Application Form" },
      { name: "Passport Copy / PAN Card / Ration Card" },
      { name: "Office Address Proof" },
      { name: "Passport-sized Photographs", note: "All applicants & co-applicants" },
      { name: "Certified Copies of MOA / AOA / Partnership Deed" },
      { name: "Repayment Track Record" },
      { name: "2 Years Audited Financials" },
      { name: "2 Years ITR of Directors / Partners" },
      { name: "6 Months Bank Statement", note: "Main operating account" },
      { name: "Professional Qualification Certificate", note: "For Doctors / CA / Lawyers / Architects" },
    ],
  },
];

const CommercialPurchaseDocs = () => (
  <DocPageLayout
    loanName="Commercial Purchase"
    breadcrumb="Commercial Purchase · Required Documents"
    bannerBg={bannerImg}
    sections={sections}
    applySlug="commercialpurchase"
  />
);

export default CommercialPurchaseDocs;
