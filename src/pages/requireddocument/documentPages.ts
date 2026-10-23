import type { DocSection } from "./DocPageLayout";

import balanceTransferBanner from "../../assets/loan-images/BlanceTransper-banner.png";
import businessBanner from "../../assets/loan-images/business-banner.png";
import commercialBanner from "../../assets/loan-images/commercial-banner.png";
import constructionBanner from "../../assets/loan-images/construction-banner.png";
import creditCardBanner from "../../assets/loan-images/CreditCards-banner.png";
import educationBanner from "../../assets/loan-images/Education-banner.png";
import filmBanner from "../../assets/loan-images/Film-banner.png";
import homeBanner from "../../assets/loan-images/Home-banner.png";
import leaseRentalBanner from "../../assets/loan-images/LeaseRental-banner.png";
import loanAgainstPropertyBanner from "../../assets/loan-images/AgainstProperty-banner.png";
import personalBanner from "../../assets/loan-images/personal-banner.png";
import projectBanner from "../../assets/loan-images/project-banner.png";
import vehicleBanner from "../../assets/loan-images/vehicle-banner.png";
import workingBanner from "../../assets/loan-images/working-banner.png";

export interface DocumentPageContent {
  loanName: string;
  breadcrumb: string;
  bannerBg: string;
  sections: DocSection[];
}

export const DOCUMENT_PAGES: Record<string, DocumentPageContent> = {
  "personal-loan": {
    loanName: "Personal Loan",
    breadcrumb: "Personal Loan · Required Documents",
    bannerBg: personalBanner,
    sections: [
      {
        id: "identity",
        title: "Identity & KYC",
        docs: [
          { name: "Passport Size Photograph", note: "Recent, plain white background" },
          { name: "PAN Card", note: "Clear scan or high-quality photo" },
          { name: "Aadhaar Card", note: "Front & back copy" },
        ],
      },
      {
        id: "address",
        title: "Address Proof",
        docs: [
          { name: "Current Residence Proof", note: "Utility bill, rent agreement, or bank statement" },
          { name: "Permanent Address Proof", note: "Voter ID, passport, or Aadhaar" },
        ],
      },
      {
        id: "income",
        title: "Income & Financial",
        docs: [
          { name: "Latest 3 Months Salary Slip", note: "For salaried applicants" },
          { name: "Bank Statement (3–6 Months)", note: "Salaried account / salary-credited account" },
        ],
      },
      {
        id: "selfemployed",
        title: "Self-Employed (Additional)",
        docs: [
          { name: "Balance Sheet & P&L Account", note: "Last 2 financial years" },
          { name: "Partnership Deed / MOA / AOA", note: "For firms or companies" },
          { name: "Other Mandatory Business Documents", note: "GST returns, trade licence, etc." },
        ],
      },
    ],
  },

  "business-loan": {
    loanName: "Business Loan",
    breadcrumb: "Business Loan · Required Documents",
    bannerBg: businessBanner,
    sections: [
      {
        id: "common",
        title: "Common Documents",
        docs: [
          { name: "2 Photographs", note: "Of each applicant & co-applicant" },
          { name: "PAN Card Copy", note: "Each applicant & co-applicant" },
          { name: "Aadhaar Card", note: "Each applicant & co-applicant" },
          { name: "Utility Bill", note: "Of office and current residence — latest month, each applicant & co-applicant" },
        ],
      },
      {
        id: "income",
        title: "Income Documents",
        docs: [
          { name: "3 Years ITR & Computation of Income", note: "P&L, Balance Sheet, all annexures & schedules, Dr. & Cr. List — self & CA attested" },
          { name: "Sales & Purchase Summary", note: "Last 3 years (till date)" },
          { name: "Dr. & Cr. List", note: "Last 3 years (till date)" },
          { name: "Last 12 Months Bank Statement", note: "Company account — all EMI reflections if any loans are ongoing" },
          { name: "Sanction Letter of All Loans & OD/CC", note: "If applicable" },
        ],
      },
      {
        id: "additional",
        title: "Additional Documents",
        docs: [
          { name: "PAN Card Copy of Company" },
          { name: "MOA & AOA / Partnership Deed" },
          { name: "List of Directors / Partners & Shareholders" },
          { name: "Business Proof", note: "Shop & Establishment Certificate, VAT, Sales Tax, GST, Service Tax, IEC" },
          { name: "GST Certificate of the Company" },
        ],
      },
    ],
  },

  "home-loan": {
    loanName: "Home Loan",
    breadcrumb: "Home Loan · Required Documents",
    bannerBg: homeBanner,
    sections: [
      {
        id: "common",
        title: "Common Documents",
        docs: [
          { name: "Passport-size Photograph", note: "Applicant & co-applicant" },
          { name: "PAN Card Copy", note: "Applicant & co-applicant" },
          { name: "Aadhaar Card Copy", note: "Applicant & co-applicant" },
          { name: "Current Address Proof", note: "Applicant & co-applicant" },
          { name: "Income Proof", note: "Applicant & co-applicant" },
          { name: "Bank Statement", note: "Last 12 months — applicant; last 6 months — co-applicant" },
        ],
      },
      {
        id: "salaried",
        title: "Salaried Applicants",
        docs: [
          { name: "Payslips", note: "Last 6 months + TDS certificate" },
          { name: "Employment Certificate", note: "From current employer" },
          { name: "Form 16", note: "Latest 2 years, issued by employer" },
        ],
      },
      {
        id: "selfemployed",
        title: "Self-Employed Applicants",
        docs: [
          { name: "Business Proof", note: "Partnership deed / MOA & AOA / Shop & Establishment / GST / VAT / IEC" },
          { name: "Audited Financial Statements", note: "Last 3 years" },
          { name: "Profit & Loss Account", note: "Last 3 years" },
          { name: "Income Tax Assessment Order" },
          { name: "Company Current Address Proof" },
          { name: "GST Certificate of the Company" },
        ],
      },
      {
        id: "other",
        title: "Other Documents",
        docs: [
          { name: "Existing Loan Sanction Letters", note: "If any" },
          { name: "Repayment Schedule of Existing EMIs", note: "If any" },
          { name: "Property Documents", note: "Agreement copy / booking slip / E-bill, OC & share certificate of the property to be purchased" },
        ],
      },
    ],
  },

  "loan-against-property": {
    loanName: "Loan Against Property",
    breadcrumb: "Loan Against Property · Required Documents",
    bannerBg: loanAgainstPropertyBanner,
    sections: [
      {
        id: "common",
        title: "Common Documents",
        docs: [
          { name: "2 Photographs", note: "Each applicant & co-applicant" },
          { name: "PAN Card Copy", note: "Each applicant & co-applicant" },
          { name: "Aadhaar Card Copy", note: "Each applicant & co-applicant" },
          { name: "Passport Copy", note: "Each applicant & co-applicant" },
          { name: "Utility Bill (Address Proof)", note: "Office and residence — latest month, each applicant & co-applicant" },
        ],
      },
      {
        id: "income",
        title: "Income Documents",
        docs: [
          { name: "Last 3 Years ITR (Company)", note: "Computation of income, P&L, Balance Sheet, all annexures & schedules, Dr. & Cr. List — self & CA attested" },
          { name: "Last 3 Years ITR (Individual)", note: "Computation of income, P&L, Balance Sheet" },
          { name: "Last 12 Months Bank Statements (Individual)" },
          { name: "Last 12 Months Bank Statement (Company)", note: "Including all EMI reflections as per Balance Sheet" },
          { name: "Sanction Letter of All Loans & OD/CC", note: "If any" },
          { name: "Sales & Purchase Summary", note: "Last 3 years till date" },
          { name: "Dr. & Cr. List", note: "Last 3 years till date" },
        ],
      },
      {
        id: "additional",
        title: "Additional Documents",
        docs: [
          { name: "MOA & AOA / Partnership Deed", note: "For proprietorship — registration certificate or business proof" },
          { name: "PAN Card Copy of Company" },
          { name: "Business Proof", note: "Shop & Establishment Certificate, VAT, Sales Tax, GST, Service Tax, IEC" },
          { name: "GST Certificate of the Company" },
          { name: "List of Directors / Partners & Shareholders" },
        ],
      },
      {
        id: "property",
        title: "Property Documents",
        docs: [
          { name: "Sales Deed" },
          { name: "OC & CC (Occupancy & Completion Certificate)" },
          { name: "Share Certificate" },
          { name: "Approved Building Plan" },
          { name: "Agreement Copy with Builder", note: "For new property" },
        ],
      },
      {
        id: "bt",
        title: "For Balance Transfer & Top-Up",
        docs: [
          { name: "LOD (List of Documents)", note: "From the bank where property is currently mortgaged" },
          { name: "Repayment Schedule", note: "Of all existing running loans" },
        ],
      },
    ],
  },

  "balance-transfer": {
    loanName: "Balance Transfer",
    breadcrumb: "Balance Transfer · Required Documents",
    bannerBg: balanceTransferBanner,
    sections: [
      {
        id: "homeloan-bt",
        title: "Home Loan Balance Transfer Documents",
        docs: [
          { name: "PAN Card" },
          { name: "Company ID Card" },
          { name: "Residence Proof" },
          { name: "Self-Owned Residence", note: "Latest electricity bill / landline bill / credit card bill" },
          { name: "Rented Residence", note: "Current rent agreement + latest electricity bill of the flat + permanent residence proof" },
          { name: "Latest CTC" },
          { name: "Salary Slips", note: "Last 3 months" },
          { name: "Salary Account & Bank Statement", note: "Up to date — last 6 months" },
          { name: "Form 16", note: "Latest" },
          { name: "Loan Repayment Track Records", note: "If any" },
          { name: "Foreclosure Letter & List of Original Documents", note: "Obtained from existing bank where loan is active — originals to be submitted" },
          { name: "Property Documents", note: "Residential / commercial premises" },
          { name: "Photocopies of Property Documents", note: "Originals collected at time of disbursement" },
        ],
      },
      {
        id: "common",
        title: "Common Documents (Secured & Unsecured BT)",
        docs: [
          { name: "2 Photographs", note: "Each applicant & co-applicant" },
          { name: "PAN Card Copy", note: "Each applicant & co-applicant" },
          { name: "Aadhaar Card Copy", note: "Applicant & co-applicant" },
          { name: "Passport Copy", note: "Each applicant & co-applicant" },
          { name: "Self-Owned Residence Proof", note: "Latest month — each applicant & co-applicant" },
          { name: "Utility Bill (Address Proof)", note: "Of office, if business profile" },
        ],
      },
      {
        id: "income-salaried",
        title: "Income Documents — Salaried",
        docs: [
          { name: "Payslips", note: "Last 6 months + TDS certificate" },
          { name: "Employment Certificate", note: "From employer" },
          { name: "Form 16", note: "Latest 2 years, issued by employer" },
          { name: "Bank Statement", note: "Last 12 months — salary account" },
        ],
      },
      {
        id: "income-selfemployed",
        title: "Income Documents — Self-Employed",
        docs: [
          { name: "PAN Card Copy of Company" },
          { name: "MOA & AOA / Partnership Deed", note: "Proprietorship — registration certificate or business proof" },
          { name: "3 Years ITR", note: "Computation of income, P&L, Balance Sheet, all annexures — self & CA attested" },
          { name: "Last 12 Months Bank Statement (Company)", note: "All EMI reflections as per Balance Sheet" },
          { name: "GST Certificate Copy" },
          { name: "Sanction Letter of All Loans & OD/CC" },
          { name: "Sales & Purchase Summary", note: "Last 3 years till date" },
          { name: "Dr. & Cr. List", note: "Last 3 years till date" },
        ],
      },
      {
        id: "unsecured",
        title: "Additional — Unsecured Loan Transfer",
        docs: [
          { name: "Loan Repayment Track Records" },
          { name: "Foreclosure Letter of Existing Loan" },
        ],
      },
      {
        id: "secured",
        title: "Additional — Secured Loan Transfer",
        docs: [
          { name: "Property Documents", note: "Registered deed, OC & share certificate" },
          { name: "Loan Repayment Track Records" },
          { name: "Foreclosure Letter & List of Original Documents", note: "From existing bank where loan is active — originals to be submitted" },
          { name: "Photocopies of All Property Documents", note: "Originals collected at time of disbursement" },
        ],
      },
    ],
  },

  "vehicle-loan": {
    loanName: "Vehicle Loan",
    breadcrumb: "Vehicle Loan · Required Documents",
    bannerBg: vehicleBanner,
    sections: [
      {
        id: "common",
        title: "Common Documents",
        docs: [
          { name: "2 Photographs", note: "Each applicant & co-applicant" },
          { name: "Passport", note: "Each applicant & co-applicant" },
          { name: "Utility Bill", note: "Office and residence — latest month, each applicant & co-applicant" },
          { name: "PAN Card Copy", note: "Each applicant & co-applicant" },
        ],
      },
      {
        id: "salaried",
        title: "Salaried Applicants",
        docs: [
          { name: "Employment Certificate", note: "From employer" },
          { name: "Payslips", note: "Last 6 months + TDS certificate" },
          { name: "Form 16", note: "Last 2 years, issued by employer" },
          { name: "Bank Statements", note: "Salary account" },
        ],
      },
      {
        id: "income",
        title: "Income Documents (Self-Employed / Business)",
        docs: [
          { name: "3 Years ITR", note: "Computation of income, P&L, Balance Sheet, all annexures, Dr. & Cr. List — self & CA attested" },
          { name: "3 Years ITR (Individual)", note: "Computation of income, P&L, Balance Sheet" },
          { name: "Last 12 Months Bank Statements (Individual)" },
          { name: "Last 12 Months Bank Statement (Company)", note: "All EMI reflections if any loans are ongoing" },
          { name: "Sanction Letter of All Loans & OD/CC", note: "If any" },
          { name: "Sales & Purchase Summary", note: "Last 3 years till date" },
          { name: "Dr. & Cr. List", note: "Last 3 years till date" },
        ],
      },
      {
        id: "additional",
        title: "Additional Documents",
        docs: [
          { name: "MOA & AOA / Partnership Deed" },
          { name: "List of Directors / Partners & Shareholders" },
          { name: "PAN Card Copy of Company" },
          { name: "Business Proof", note: "Shop & Establishment Certificate, VAT, Sales Tax, Service Tax, IEC" },
        ],
      },
    ],
  },

  "credit-card": {
    loanName: "Credit Card",
    breadcrumb: "Credit Card · Required Documents",
    bannerBg: creditCardBanner,
    sections: [
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
    ],
  },

  "education-loan": {
    loanName: "Education Loan",
    breadcrumb: "Education Loan · Required Documents",
    bannerBg: educationBanner,
    sections: [
      {
        id: "common",
        title: "Common Documents",
        docs: [
          { name: "Age Proof" },
          { name: "Address Proof" },
          { name: "Income Proof of Co-Applicant", note: "Father / mother / guardian" },
          { name: "Bank Statement of Co-Applicant", note: "Last 6 months" },
          { name: "Passport-size Photograph", note: "Applicant & co-applicant" },
        ],
      },
      {
        id: "salaried-coapplicant",
        title: "Co-Applicant — Salaried",
        docs: [
          { name: "Employment Certificate", note: "From current employer" },
          { name: "Payslips & TDS Certificate" },
          { name: "Form 16", note: "Latest, issued by employer" },
          { name: "Bank Statements" },
        ],
      },
      {
        id: "selfemployed-coapplicant",
        title: "Co-Applicant — Self-Employed",
        docs: [
          { name: "Audited Financial Statements", note: "Last 3 years" },
          { name: "Partnership Deed / MOA & AOA", note: "As applicable" },
          { name: "Profit & Loss Account" },
          { name: "Income Tax Assessment Order" },
        ],
      },
      {
        id: "other",
        title: "Other Documents",
        docs: [
          { name: "Latest Electricity Bill", note: "Co-applicant's owned house" },
        ],
      },
    ],
  },

  "project-loan": {
    loanName: "Project Loan",
    breadcrumb: "Project Loan · Required Documents",
    bannerBg: projectBanner,
    sections: [
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
    ],
  },

  "commercial-purchase": {
    loanName: "Commercial Purchase",
    breadcrumb: "Commercial Purchase · Required Documents",
    bannerBg: commercialBanner,
    sections: [
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
    ],
  },

  "lease-rental": {
    loanName: "Lease Rental Discounting",
    breadcrumb: "Lease Rental Discounting · Required Documents",
    bannerBg: leaseRentalBanner,
    sections: [
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
    ],
  },

  "working-capital": {
    loanName: "Working Capital",
    breadcrumb: "Working Capital · Required Documents",
    bannerBg: workingBanner,
    sections: [
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
    ],
  },

  "film-funding": {
    loanName: "Film Funding",
    breadcrumb: "Film Funding · Required Documents",
    bannerBg: filmBanner,
    sections: [
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
    ],
  },

  "od-cc-limit": {
    loanName: "OD CC Limit",
    breadcrumb: "OD CC Limit · Required Documents",
    bannerBg: businessBanner,
    sections: [
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
    ],
  },

  "loan-against-share": {
    loanName: "Loan Against Share",
    breadcrumb: "Loan Against Share · Required Documents",
    bannerBg: loanAgainstPropertyBanner,
    sections: [
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
    ],
  },

  "npa": {
    loanName: "NPA (Non-Performing Assets)",
    breadcrumb: "NPA · Required Documents",
    bannerBg: commercialBanner,
    sections: [
      {
        id: "kyc",
        title: "Identification & Address Proof",
        docs: [
          { name: "Identification Proof", note: "PAN Card, Aadhaar Card, passport, or other valid identity documents" },
          { name: "Address Proof", note: "Utility bills, rental agreement, or other valid address documents" },
        ],
      },
      {
        id: "account",
        title: "Loan Account Documents",
        docs: [
          { name: "Loan Account Details", note: "Details of the existing loan account classified as NPA" },
          { name: "Sanction Letter / Loan Agreement", note: "Original sanction letter and loan agreement copies" },
          { name: "Loan Account Statement", note: "Statement showing outstanding dues and overdue amount" },
        ],
      },
      {
        id: "financial",
        title: "Income & Financial Documents",
        docs: [
          { name: "Income Proof", note: "Salary slips, Income Tax Returns, bank statements, or other income-related documents, where applicable" },
          { name: "Bank Statements", note: "Recent bank statements to assess financial standing and repayment capacity" },
        ],
      },
      {
        id: "other",
        title: "Other Supporting Documents",
        docs: [
          { name: "Other Supporting Documents", note: "Any additional documents required for verification and credit assessment" },
        ],
      },
    ],
  },

  "gold-loan": {
    loanName: "Gold Loan",
    breadcrumb: "Gold Loan · Required Documents",
    bannerBg: personalBanner,
    sections: [
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
    ],
  },

  "fdi": {
    loanName: "Foreign Direct Investment (FDI)",
    breadcrumb: "FDI · Required Documents",
    bannerBg: constructionBanner,
    sections: [
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
    ],
  },
};
