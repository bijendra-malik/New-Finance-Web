import DocPageLayout from "./DocPageLayout";
import type { DocSection } from "./types";
import bannerImg from "../../assets/loan-images/project-banner.png";

const sections: DocSection[] = [
  {
    id: "company",
    title: "Company Documents (Pvt. Ltd. / Partnership Firm)",
    docs: [
      { name: "PAN Card of Company" },
      { name: "Current Address Proof" },
      { name: "MOA & AOA or Certified Copy of Partnership Deed" },
      { name: "GST Certificate of the Company" },
      { name: "Other Registration Certificates", note: "If any" },
      { name: "All Current Account Bank Statements", note: "Last 6 months" },
      { name: "Last 2 Years ITR", note: "Computation of income, Balance Sheet & P&L — Audited or CA certified" },
    ],
  },
  {
    id: "director",
    title: "Director / Partner / Sole Proprietor",
    docs: [
      { name: "2 Passport-size Photographs", note: "Each director / partner / proprietor" },
      { name: "PAN Card" },
      { name: "Address Proof", note: "Aadhaar Card / Telephone bill / Electricity bill / Lease agreement / Passport" },
      { name: "Bank Statement", note: "Last 6 months" },
      { name: "Last 2 Years ITR", note: "Computation of income, Balance Sheet & P&L — Audited or CA certified" },
    ],
  },
  {
    id: "mandatory",
    title: "Other Mandatory Documents",
    docs: [
      { name: "Title Documents of Property & Approved Plan" },
      { name: "Property Registry Documents", note: "Last 12 years property chain" },
      { name: "Certificate & Proof of Business Existence along with Business Profile" },
      { name: "PPT Presentation of the Project" },
      { name: "Soft Excel Presentation of the Project" },
      { name: "All Existing Loan Exposure in Excel Format", note: "If any" },
      { name: "All Sanction Letters of Existing Loans", note: "If any" },
      { name: "Latest Valuation Report of the Company" },
      { name: "Current Rating of the Company" },
    ],
  },
];

const ProjectLoanDocs = () => (
  <DocPageLayout
    loanName="Project Loan"
    breadcrumb="Project Loan · Required Documents"
    bannerBg={bannerImg}
    sections={sections}
    applySlug="project-loan"
  />
);

export default ProjectLoanDocs;
