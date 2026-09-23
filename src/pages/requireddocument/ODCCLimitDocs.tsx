import DocPageLayout from "./DocPageLayout";
import type { DocSection } from "./types";
import bannerImg from "../../assets/loan-images/business-banner.png";

const sections: DocSection[] = [
  {
    id: "kyc",
    title: "KYC & Identity Documents",
    docs: [
      { name: "Self-attested copy of KYC Documents" },
      { name: "Entity Proof", note: "Partnership deed / Certificate of Incorporation / Shops & Establishment Certificate" },
      { name: "PAN Card Copy", note: "Entity, proprietors / partners / directors, and guarantors" },
      { name: "Address Proof", note: "Entity, proprietors / partners / directors, and guarantors" },
    ],
  },
  {
    id: "financial",
    title: "Financial Documents",
    docs: [
      { name: "Last 3 Years Audited / Provisional Financials", note: "Balance Sheet, P&L, schedules, Notes to Accounts" },
      { name: "Last 1 Year Income Tax Returns", note: "With computation of income; if filed online, acknowledgment number required" },
      { name: "Latest Bank Statements", note: "Last 6 months (First Time Borrower) or 12 months (Takeover proposals)" },
      { name: "GST Returns", note: "Last 12 months, if registered" },
    ],
  },
  {
    id: "collateral",
    title: "Collateral Documents",
    docs: [
      { name: "Title Deed / Ownership Proof", note: "For the property offered as collateral" },
      { name: "Valuation Report", note: "From an approved valuer" },
      { name: "Encumbrance Certificate", note: "Covering the last 13 years" },
    ],
  },
];

const ODCCLimitDocs = () => (
  <DocPageLayout
    loanName="OD CC Limit"
    breadcrumb="OD CC Limit · Required Documents"
    bannerBg={bannerImg}
    sections={sections}
    applySlug="odcclimit"
  />
);

export default ODCCLimitDocs;
