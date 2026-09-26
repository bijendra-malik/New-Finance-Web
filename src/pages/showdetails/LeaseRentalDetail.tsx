import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerBg from "../../assets/loan-images/LeaseRental-banner.png";
import LeaseRentalImg from "../../assets/personal-loan/leaserental-Details.png";

const ACCENT = "var(--brand-navy)";

const NumberedList = ({ items }: { items: [string, string][] }) => (
  <ol className="space-y-3 mt-1">
    {items.map(([title, desc], i) => (
      <li key={i} className="flex items-start gap-3">
        <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5" style={{ background: ACCENT }}>{i + 1}</span>
        <span className="text-sm text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-800">{title}: </span>{desc}
        </span>
      </li>
    ))}
  </ol>
);

const sections: DetailSection[] = [
  {
    id: "intro",
    heading: "What is Lease Rental Discounting (LRD)?",
    content: (
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 leading-relaxed">
            Lease Rental Discounting (LRD) provides an alternative avenue to secure finance from
            banks and lending institutions. This arrangement involves the premises owner (borrower),
            the tenant (occupying or leasing the premises), and the financial entity. Loan approval
            is based on fixed rental income over the lease period — with the unique condition that
            rent is deposited directly with the lender. Indexia Finance specialises in LRD and is
            your trusted partner.
          </p>
        </div>
        <div className="shrink-0 w-full lg:w-80">
          <img src={LeaseRentalImg} alt="Lease Rental Discounting"
            className="w-full h-72 object-contain grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
      </div>
    ),
  },
  {
    id: "process",
    heading: "Lease Rent Process — Step by Step",
    content: (
      <NumberedList items={[
        ["Personal Interview & Discussions", "Bank officials engage in discussions to gain a comprehensive understanding of the customer's financial needs."],
        ["Field Investigation", "The bank's investigation team visits the applicant's business or workplace to gather essential information."],
        ["Document Verification", "All submitted documents are meticulously verified against originals to establish authenticity."],
        ["Credit Verification", "The applicant's credit history is checked through agencies like CIBIL."],
        ["Project Analysis", "Background, technical feasibility, financial viability, and market conditions are assessed."],
        ["Sanction & Disbursement", "A sanction letter is issued with specified terms upon approval, which the applicant accepts."],
        ["Processing Charges", "Processing charges are paid as per the bank's specifications to proceed with disbursement."],
        ["Documentation Procedure", "Includes legal opinions on property documents and valuation reports."],
        ["Loan Disbursement", "Loan is disbursed after the Legal Department certifies the correctness of all documents."],
      ]} />
    ),
  },
  {
    id: "benefits",
    heading: "Benefits of Lease Rental Discounting",
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
        {[
          ["Enhanced Liquidity", "Immediate access to funds based on anticipated rental income."],
          ["Flexible Repayment", "Repayment terms align with the lease period for a manageable commitment."],
          ["Efficient Financial Planning", "Fixed rental income as the loan basis facilitates structured planning."],
          ["Streamlined Approval", "Clear rental income assessment leads to quicker disbursal."],
          ["Property Asset Utilisation", "Unlock the financial potential of real estate without selling."],
          ["Risk Mitigation", "Backed by tangible rental income — lower risk for lenders and borrowers."],
          ["Competitive Interest Rates", "Attractive rates make LRD a cost-effective financing option."],
          ["Business Expansion", "Obtain funds for expansion without straining existing resources."],
          ["Tax Advantages", "Potential tax benefits on interest paid on LRD loans."],
          ["Professional Guidance", "Expert advisors from Indexia Finance guide you through every step."],
        ].map(([title, desc]) => (
          <div key={title} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="font-semibold text-gray-800 text-sm mb-1">{title}</p>
            <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "best-options",
    heading: "Best Lease Rental Discounting Options",
    content: (
      <div className="space-y-5">
        {[
          { num: "1", title: "Best LRD Provider", desc: "Known for competitive rates and tailored solutions — secure financing against future rental income with ease." },
          { num: "2", title: "Best Lease Rental Discounting", desc: "From property expansion to working capital — flexible terms designed to suit your specific LRD requirements." },
          { num: "3", title: "Best LRD Company", desc: "Transparent terms and reliable service — committed to a seamless borrowing experience from start to finish." },
          { num: "4", title: "Best LRD Provider Company", desc: "Whether you're an individual or a corporation, these providers offer comprehensive financial support for your real estate ventures." },
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
    heading: "Secure Financing for Your Real Estate Ventures",
    content: (
      <p className="text-gray-600 leading-relaxed">
        When it comes to Lease Rental Discounting, trust the expertise and reliability of
        Indexia Finance. Explore your options today and secure financing for your real estate
        ventures with confidence. Apply now — the right bank will come to your doorstep.
      </p>
    ),
  },
];

const LeaseRentalDetail = () => (
  <ShowDetailLayout
    loanName="Lease Rental Discounting"
    breadcrumb="Lease Rental Discounting"
    bannerTitle="Lease Rental Discounting"
    bannerTagline="Now, Right Bank will come to your doorstep"
    bannerBg={bannerBg}
    docsHref="/requireddocument/lease-rental"
    applySlug="leaserental"
    sections={sections}
  />
);

export default LeaseRentalDetail;
