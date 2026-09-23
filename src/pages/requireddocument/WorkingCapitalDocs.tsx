import DocPageLayout from "./DocPageLayout";
import type { DocSection } from "./types";
import bannerImg from "../../assets/loan-images/working-banner.png";

const sections: DocSection[] = [
  {
    id: "kyc",
    title: "KYC & Identity Documents",
    docs: [
      { name: "Self-attested copy of KYC Documents" },
      { name: "Entity Proof", note: "Partnership deed / Certificate of Incorporation / Shops & Establishment Certificate" },
      { name: "PAN Card Copy", note: "Entity, proprietors / partners / directors, security providers, and guarantors" },
      { name: "Address Proof", note: "Entity, proprietors / partners / directors, security providers, and guarantors" },
    ],
  },
  {
    id: "financial",
    title: "Financial Documents",
    docs: [
      { name: "Last 3 Years Audited / Provisional Financials", note: "Balance Sheet, P&L, schedules, Notes to Accounts, tax audit & statutory audit reports; VAT returns also required for provisional financials" },
      { name: "Current Year Performance & Projected Turnover", note: "On entity letterhead" },
      { name: "Last 1 Year Income Tax Returns", note: "With computation of income; if filed online, acknowledgment number required" },
      { name: "Latest Bank Statements", note: "Last 6 months (First Time Borrower) or 12 months (Takeover proposals); in case of multiple banking, statements covering min. 75% of banking turnover" },
    ],
  },
  {
    id: "business",
    title: "Business & Project Documents",
    docs: [
      { name: "Orders in Hand & Status", note: "Along with order copies / Letters of Intent / Contract Agreements" },
      { name: "Previous 3 Inland LC Transaction Details", note: "For ascertaining track record" },
      { name: "Project Report", note: "Cost of project, means of finance, expenditure incurred, and projections with justifiable details" },
      { name: "Government Approvals", note: "Power, pollution, and building plans with documentary proofs" },
      { name: "Pro Forma Invoices of Assets to be Purchased", note: "Copy of allotment letter / conveyance deed for land; architect certificate for building cost validation" },
    ],
  },
];

const WorkingCapitalDocs = () => (
  <DocPageLayout
    loanName="Working Capital"
    breadcrumb="Working Capital · Required Documents"
    bannerBg={bannerImg}
    sections={sections}
    applySlug="workingcapital"
  />
);

export default WorkingCapitalDocs;
