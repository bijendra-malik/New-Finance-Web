import DocPageLayout from "./DocPageLayout";
import type { DocSection } from "./types";
import bannerImg from "../../assets/loan-images/construction-banner.png";

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
    id: "entity",
    title: "Entity & Investment Documents",
    docs: [
      { name: "Company / Entity Documents", note: "Certificate of incorporation, MOA/AOA, and other statutory registrations, where applicable" },
      { name: "FDI Investment Details", note: "Details of the proposed foreign direct investment, sector, and structure" },
      { name: "Shareholding Pattern", note: "Existing and proposed shareholding pattern of the Indian entity" },
    ],
  },
  {
    id: "financial",
    title: "Financial & Compliance Documents",
    docs: [
      { name: "Financial Statements", note: "Audited financial statements of the Indian entity, where applicable" },
      { name: "Bank Statements / KYC of Investees", note: "Bank details and KYC documents of the parties involved" },
      { name: "Regulatory Approvals / Declarations", note: "FEMA/RBI-related declarations, approvals, or compliance documents, where required" },
    ],
  },
  {
    id: "other",
    title: "Other Supporting Documents",
    docs: [
      { name: "Other Supporting Documents", note: "Any additional documents required for verification and assessment" },
    ],
  },
];

const FdiDocs = () => (
  <DocPageLayout
    loanName="Foreign Direct Investment (FDI)"
    breadcrumb="FDI · Required Documents"
    bannerBg={bannerImg}
    sections={sections}
    applySlug="fdi"
  />
);

export default FdiDocs;
