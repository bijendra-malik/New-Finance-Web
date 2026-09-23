import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerBg from "../../assets/loan-images/business-banner.png";
import businessloanDetails from "../../assets/personal-loan/business-details02.png";

const ACCENT = "#066a9c";

const sections: DetailSection[] = [
  {
    id: "intro",
    heading: "What is a Business Loan?",
    content: (
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 leading-relaxed">
            In the fast-paced world of entrepreneurship, securing the right Business Loan is a
            strategic move that can propel your ventures to unprecedented heights. Whether you are
            looking to manage working capital, purchase equipment, expand operations, or consolidate
            existing debt — a business loan provides the financial fuel your enterprise needs to grow
            sustainably.
          </p>
        </div>
        <div className="flex-shrink-0 w-full lg:w-80">
          <img src={businessloanDetails} alt="Business Loan"
            className="w-full h-72 object-contain grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
      </div>
    ),
  },
  {
    id: "eligibility",
    heading: "Eligibility Criteria",
    content: (
      <div className="rounded-xl border border-gray-100 overflow-hidden">
        {[
          ["Minimum Age", "21 years"],
          ["Maximum Age", "65 years"],
          ["Minimum Annual Income", "₹4,00,000"],
          ["Minimum Loan Amount", "₹1,00,000"],
          ["Maximum Loan Amount", "₹2,00,00,000 (₹2 Crore)"],
          ["Minimum Business Existence", "3 years"],
          ["Minimum Loan Tenure", "1 year"],
          ["Maximum Loan Tenure", "5 years"],
        ].map(([param, value], i) => (
          <div key={param} className="flex justify-between items-center px-4 py-3 text-sm"
            style={{ background: i % 2 === 0 ? "#F8FAFC" : "#FFFFFF" }}>
            <span className="font-medium text-gray-700">{param}</span>
            <span className="text-gray-500">{value}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "dynamics",
    heading: "The Dynamics of Business Loans",
    content: (
      <p className="text-gray-600 leading-relaxed">
        In the diverse financial landscape of India, business loans come in various forms —
        tailored to meet the unique needs of different enterprises. From term loans to working
        capital loans, overdraft facilities to equipment financing, businesses can choose the
        financial tool that aligns best with their objectives and repayment capacity.
      </p>
    ),
  },
  {
    id: "types",
    heading: "Types of Business Loans",
    content: (
      <div className="space-y-4">
        {[
          {
            num: "1",
            title: "Secured Business Loan",
            desc: "A secured business loan requires the borrower to pledge collateral — raw materials, finished goods, land, machinery, or even cash. Because the lender's risk is reduced, secured loans typically come with lower interest rates and more flexible repayment options.",
          },
          {
            num: "2",
            title: "Unsecured Business Loan",
            desc: "No collateral is required for an unsecured loan, making it accessible to a broader range of businesses. However, lenders offset the higher risk with higher interest rates and generally shorter loan tenures compared to secured options.",
          },
        ].map((item) => (
          <div key={item.num} className="rounded-xl border border-gray-100 p-5" style={{ background: "#F8FAFC" }}>
            <p className="font-semibold text-gray-800 mb-2">{item.num}. {item.title}</p>
            <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "loan-terms",
    heading: "Short-Term, Intermediate & Long-Term Loans",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 text-sm leading-relaxed">
          Business loans can also be classified by tenure — each suited to a different stage or need:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Short-Term", period: "Up to 1 year", use: "Managing immediate cash flow gaps, seasonal inventory, or urgent working capital needs." },
            { label: "Intermediate", period: "1 – 3 years", use: "Starting a business, buying equipment, upgrading infrastructure, or building inventory." },
            { label: "Long-Term", period: "3 – 5 years", use: "Expanding an established business, acquiring fixed assets, or major business acquisitions." },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-gray-100 p-4" style={{ background: "#F8FAFC" }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: ACCENT }}>{item.label}</p>
              <p className="font-semibold text-gray-800 text-sm mb-2">{item.period}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{item.use}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "indexia",
    heading: "Why Indexia Finance for Business Loans?",
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed">
          Indexia Finance is one of the best business loan providers in India — ranked among the
          top 3 finance companies and top 3 loan service providers in the country.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {[
            ["Top-Rated Provider", "Ranked among India's top 3 loan service providers."],
            ["Wide Lender Network", "Access to 30+ banks and NBFCs for the best rate."],
            ["Fast Disbursal", "Funds credited within days of document verification."],
            ["Expert Guidance", "Dedicated advisor from application to disbursal."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="font-semibold text-gray-800 text-sm mb-1">{title}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "best-options",
    heading: "Best Business Loan Options",
    content: (
      <div className="space-y-5">
        {[
          { num: "1", title: "Best Business Loan Provider", desc: "Competitive rates and flexible terms tailored to your business model. From startups to established enterprises — personalised funding solutions with fast approvals." },
          { num: "2", title: "Best Business Loan", desc: "From small business loans to equipment financing and working capital — options designed to fuel growth at every stage of your business journey." },
          { num: "3", title: "Best Business Loan Company", desc: "Transparent lending, efficient processes, and expert guidance. These companies are committed to helping businesses thrive with reliable financing." },
          { num: "4", title: "Best Business Loan Provider Company", desc: "Whether seeking working capital or funds for expansion, partner with providers known for expertise, integrity, and dedication to client success." },
        ].map((item) => (
          <div key={item.num} className="flex items-start gap-4">
            <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5" style={{ background: ACCENT }}>{item.num}</span>
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
    heading: "Ready to Grow Your Business?",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Whether you are acquiring capital to promote your business or consolidating existing
        debts, Indexia Finance has the right loan product for you. Explore your options today
        and take your business to new heights.
      </p>
    ),
  },
];

const BusinessLoanDetail = () => (
  <ShowDetailLayout
    loanName="Business Loan"
    breadcrumb="Business Loan"
    bannerTitle="Do You Require A Loan for Your Business?"
    bannerBg={bannerBg}
    docsHref="/requireddocument/business-loan"
    applySlug="businessloan"
    sections={sections}
  />
);

export default BusinessLoanDetail;
