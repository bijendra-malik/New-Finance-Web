import DocPageLayout from "./DocPageLayout";
import type { DocSection } from "./types";
import bannerImg from "../../assets/loan-images/LeaseRental-banner.png";

const sections: DocSection[] = [
  {
    id: "address",
    title: "Address Proof",
    docs: [
      { name: "Latest Electricity / Telephone Bill" },
      { name: "Receipt of Maintenance Charges" },
      { name: "Valid Passport" },
      { name: "Voter's Identity Card" },
      { name: "Purchase / Lease Deed / Leave & Licence Agreement", note: "Residence or office premises" },
    ],
  },
  {
    id: "identity",
    title: "Identity Proof",
    docs: [
      { name: "Valid Passport" },
      { name: "PAN Card" },
      { name: "Aadhaar Card" },
      { name: "Voter's Card" },
      { name: "Any Government-issued Photo ID" },
    ],
  },
  {
    id: "business",
    title: "Business Proof",
    docs: [
      { name: "VAT / CST Registration No." },
      { name: "MIDC Agreement" },
      { name: "SSI Permanent Registration Certificate" },
      { name: "Warehouse Receipts" },
      { name: "Shop & Establishment Act Certificate" },
      { name: "Copy of Lease Agreement", note: "Along with latest rent paid receipt" },
      { name: "Business Profile on Company Letterhead" },
      { name: "Partnership Deed", note: "For partnership firms" },
      { name: "Certificate of Incorporation" },
      { name: "Date of Commencement of Business & Memorandum of Title Deeds" },
      { name: "Form 32", note: "For addition or deletion of directors in companies" },
      { name: "Last 3 Years Trading, P&L A/c & Balance Sheets", note: "Duly signed by CA, wherever applicable" },
      { name: "Last 1 Year Bank Statement of the Firm" },
      { name: "Existing Loan Sanction Letter & Repayment Schedule", note: "If applicable" },
      { name: "Firm / Company PAN Card" },
      { name: "Individual ITR of Partners / Directors", note: "Last 3 years" },
      { name: "Last 1 Year Bank Statement", note: "Of individuals, partners, directors" },
      { name: "SEBI Formalities", note: "For listed companies" },
      { name: "Shareholding Pattern of Directors", note: "Certified by a Chartered Accountant" },
      { name: "List of Existing Directors", note: "From Registrar of Companies" },
      { name: "Written Confirmation of No Legal Suit Against Directors", note: "If any proceedings pending, full details to be provided" },
    ],
  },
];

const LeaseRentalDocs = () => (
  <DocPageLayout
    loanName="Lease Rental Discounting"
    breadcrumb="Lease Rental Discounting · Required Documents"
   bannerBg={bannerImg}
    sections={sections}
    applySlug="lease-rental"
  />
);

export default LeaseRentalDocs;
