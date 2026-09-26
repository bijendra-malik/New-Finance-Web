import DocPageLayout from "./DocPageLayout";
import type { DocSection } from "./types";
import bannerImg from "../../assets/loan-images/Film-banner.png";

const sections: DocSection[] = [
  {
    id: "film",
    title: "Film-Related Documents",
    docs: [
      { name: "Soft Excel Presentation of the Upcoming Film" },
      { name: "PPT Presentation of the Upcoming Film" },
      { name: "Agreement Copies with Artists", note: "Actor / Actress — if available" },
      { name: "Agreement Copies for Music Release / Film Release / Rights", note: "If available" },
    ],
  },
  {
    id: "common",
    title: "Common Documents",
    docs: [
      { name: "2 Photographs", note: "Each applicant (director / partner / proprietor)" },
      { name: "PAN Card Copy", note: "Each applicant (director / partner / proprietor)" },
      { name: "Aadhaar Card", note: "Each applicant (director / partner / proprietor)" },
      { name: "Utility Bill", note: "Office and current residence — latest month, each applicant" },
    ],
  },
  {
    id: "income",
    title: "Income Documents",
    docs: [
      { name: "2 Years ITR & Computation of Income", note: "P&L, Balance Sheet, all annexures — self & CA attested" },
      { name: "Last 12 Months Bank Statement (Company)", note: "All EMI reflections if any loans are ongoing" },
      { name: "Sanction Letter of All Loans & OD/CC", note: "If any" },
    ],
  },
  {
    id: "additional",
    title: "Additional Documents",
    docs: [
      { name: "PAN Card Copy of Company" },
      { name: "MOA & AOA / Partnership Deed / Company Registration Certificate" },
      { name: "List of Directors / Partners & Shareholders" },
      { name: "Business Proof", note: "Shop & Establishment Certificate, VAT, Sales Tax, GST, Service Tax, IEC" },
      { name: "GST Certificate of the Company", note: "If available" },
    ],
  },
];

const FilmLoanDocs = () => (
  <DocPageLayout
    loanName="Film Funding"
    breadcrumb="Film Funding · Required Documents"
    bannerBg={bannerImg}
    sections={sections}
    applySlug="film-funding"
  />
);

export default FilmLoanDocs;
