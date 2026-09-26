import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerBg from "../../assets/loan-images/BlanceTransper-banner.png";
import balanceTransferConcept from "../../assets/personal-loan/balance-transfer-03.png";

const ACCENT = "#066a9c";

const BulletList = ({ items }: { items: (string | [string, string])[] }) => (
  <ul className="space-y-2 mt-1">
    {items.map((item, i) => {
      const [title, desc] = Array.isArray(item) ? item : [item, undefined];
      return (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
          <span className="text-sm text-gray-600 leading-relaxed">
            {desc ? <><span className="font-semibold text-gray-800">{title}: </span>{desc}</> : title}
          </span>
        </li>
      );
    })}
  </ul>
);

const sections: DetailSection[] = [
  {
    id: "intro",
    heading: "What is a Balance Transfer?",
    content: (
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 leading-relaxed">
            A Balance Transfer is a financial strategy that involves moving existing debt from one
            lender to another — typically to take advantage of lower interest rates or better terms.
            This helps borrowers consolidate their debts, reduce interest payments, and simplify
            financial management.
          </p>
          <p className="text-gray-600 leading-relaxed mt-3">
            If you are currently paying a high interest rate on a home loan, personal loan, or
            business loan, a balance transfer could significantly reduce your monthly outgo.
          </p>
        </div>
        <div className="shrink-0 w-full lg:w-80">
          <img src={balanceTransferConcept} alt="Balance Transfer"
            className="w-full h-72 object-contain grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
      </div>
    ),
  },
  {
    id: "common-docs",
    heading: "Common Documents Required",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">Required for all applicants and co-applicants:</p>
        <BulletList items={[
          "2 passport-size photographs of each applicant & co-applicant",
          "PAN Card copy of each applicant & co-applicant",
          "Aadhaar Card copy of applicant & co-applicant",
          "Passport copy of each applicant & co-applicant",
          "Self-owned residence proof (latest month) of each applicant & co-applicant",
          "Utility bill (address proof) of office, if business profile",
        ]} />
      </div>
    ),
  },
  {
    id: "income-salaried",
    heading: "Income Documents — Salaried Applicants",
    content: (
      <BulletList items={[
        "Payslips for the last 6 months and TDS certificate",
        "Employment certificate from the current employer",
        "Latest 2 years' Form 16 issued by the employer",
        "Last 12 months' bank statement of salary account",
      ]} />
    ),
  },
  {
    id: "income-selfemployed",
    heading: "Income Documents — Self-Employed Applicants",
    content: (
      <BulletList items={[
        "PAN Card copy of the company",
        "MOA & AOA / Partnership Deed / Registration certificate or Business Proof",
        "3 years' ITR, computation of income, P&L, Balance Sheet with all annexures & schedules",
        "Last 12 months' bank statement of the company, including all EMI reflections",
        "GST certificate copy",
        "Sanction letter of all existing Loans & OD/CC",
        "Sales & Purchase Summary — last 3 years (till date)",
        "Dr. & Cr. List — last 3 years (till date)",
      ]} />
    ),
  },
  {
    id: "additional-unsecured",
    heading: "Additional Documents — Unsecured Loan Transfer",
    content: (
      <BulletList items={[
        "Loan repayment track record",
        "Foreclosure letter of existing loan",
      ]} />
    ),
  },
  {
    id: "additional-secured",
    heading: "Additional Documents — Secured Loan Transfer",
    content: (
      <div className="space-y-3">
        <BulletList items={[
          "Property documents (registered deed, OC & share certificate)",
          "Loan repayment track records",
          "Foreclosure letter and list of original documents held with the existing bank",
          "Photocopies of all property documents to be mortgaged",
        ]} />
        <p className="text-gray-400 text-xs italic mt-2">
          Note: Original foreclosure letters must be obtained directly from the existing bank.
        </p>
      </div>
    ),
  },
  {
    id: "best-options",
    heading: "Best Balance Transfer Options",
    content: (
      <div className="space-y-5">
        {[
          { num: "1", title: "Best Balance Transfer Provider", desc: "Known for competitive rates and flexible terms — seamless transfer processes and personalised service make managing your debt easier than ever." },
          { num: "2", title: "Best Balance Transfer Options", desc: "From low ongoing rates to favourable terms — options designed to help you save money and pay off debt faster." },
          { num: "3", title: "Best Balance Transfer Company", desc: "Transparent terms, efficient processes, and expert guidance — committed to helping you achieve financial freedom." },
          { num: "4", title: "Best Balance Transfer Provider Company", desc: "Whether transferring home loan balances or personal loan debt, partner with providers known for expertise and dedication to client satisfaction." },
        ].map((item) => (
          <div key={item.num} className="flex items-start gap-4">
            <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5" style={{ background: ACCENT }}>{item.num}</span>
            <div>
              <p className="font-semibold text-gray-800 text-sm mb-1">{item.title}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "conclusion",
    heading: "Ready to Transfer and Save?",
    content: (
      <p className="text-gray-600 leading-relaxed">
        When it comes to balance transfers, trust the expertise and reliability of the best
        providers. Explore your options today and take control of your finances with confidence.
        Contact Indexia Finance — one of India's top 3 loan service providers — to find the right
        balance transfer solution for you.
      </p>
    ),
  },
];

const BalanceTransferDetail = () => (
  <ShowDetailLayout
    loanName="Balance Transfer"
    breadcrumb="Balance Transfer"
    bannerTitle="Balance Transfer"
    bannerTagline="Bank will come to your doorstep"
    bannerBg={bannerBg}
    docsHref="/requireddocument/balance-transfer"
    applySlug="balancetransfer"
    sections={sections}
  />
);

export default BalanceTransferDetail;
