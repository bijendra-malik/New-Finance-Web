import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerBg from "../../assets/loan-images/working-banner.png";
import WorkingCapitalImg from "../../assets/personal-loan/WorkingCapital-Img.png";

const ACCENT = "var(--brand-navy)";

const BL = ({ items }: { items: [string, string][] }) => (
  <ul className="space-y-2.5 mt-1">
    {items.map(([t, d], i) => (
      <li key={i} className="flex items-start gap-3">
        <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
        <span className="text-sm text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-800">{t}: </span>{d}
        </span>
      </li>
    ))}
  </ul>
);

const sections: DetailSection[] = [
  {
    id: "intro",
    heading: "Working Capital Finance at Indexia Finance",
    content: (
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 leading-relaxed">
            At Indexia Finance, we possess a robust appetite for recognised credits. Our team of
            customer-focused relationship managers brings extensive industry experience across various
            segments. We provide tailored working capital finance — cash credit or loan — structured
            to align with your needs and risk profile, whether in consortium or as a sole banker.
          </p>
        </div>
        <div className="shrink-0 w-full lg:w-80">
          <img src={WorkingCapitalImg} alt="Working Capital"
            className="w-full h-72 object-contain grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
      </div>
    ),
  },
  {
    id: "eligibility",
    heading: "Eligibility Criteria",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">Our working capital scheme caters to limited companies classified as industrial concerns. Eligible companies must:</p>
        <ul className="space-y-2 mt-1">
          {[
            "Demonstrate a clear market for their product",
            "Have competent and integrity-driven promoters",
            "Utilise non-outdated technology",
            "Exhibit potential viability for both the company and the unit",
            "Lack of existing working capital results in underfinancing — this scheme addresses that gap",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
              <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "objective",
    heading: "Objective & Quantum of Assistance",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 leading-relaxed">
          This scheme targets units facing challenges due to a lack of working capital support
          from commercial banks. We inject fresh funds — providing one-time core working capital
          assistance to make these units financially viable.
        </p>
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          {[
            ["Quantum of Assistance", "75% of the working capital requirement for one operational cycle"],
            ["Promoters' Contribution", "25%"],
            ["Interest Rate", "PLR + Risk Weightage"],
            ["Repayment Period", "Maximum 3 years"],
            ["Upfront Fee", "0.1% of the loan amount"],
          ].map(([param, value], i) => (
            <div key={param} className="flex justify-between items-center px-4 py-3 text-sm"
              style={{ background: i % 2 === 0 ? "#F8FAFC" : "#FFFFFF" }}>
              <span className="font-medium text-gray-700">{param}</span>
              <span className="text-gray-500">{value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "security",
    heading: "Security Requirements",
    content: (
      <BL items={[
        ["First Charge on Current Assets", "Through hypothecation"],
        ["Charge on Fixed Assets", "Of the unit"],
        ["Personal / Corporate Guarantee", "Of promoter director or corporate entity"],
        ["Pari Passu Charge", "First pari passu charge on fixed assets if mortgaged to other institutions / banks"],
        ["Adequate Collateral Security", "As required by the lender"],
      ]} />
    ),
  },
  {
    id: "best-options",
    heading: "Best Working Capital Options",
    content: (
      <div className="space-y-5">
        {[
          { num: "1", title: "Best Working Capital Provider", desc: "Known for competitive rates and flexible terms — secure short-term operational financing with ease." },
          { num: "2", title: "Best Working Capital", desc: "From inventory management to payroll — tailored solutions to keep your operations running smoothly." },
          { num: "3", title: "Best Working Capital Company", desc: "Transparent terms and reliable service — ensuring efficient access to funds when you need them most." },
          { num: "4", title: "Best Working Capital Provider Company", desc: "Whether you're experiencing rapid growth or facing unexpected expenses, trust these providers for reliable financial support." },
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
    heading: "Ensure Your Business Has the Funds to Thrive",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Trust the expertise and reliability of the best providers. Explore your working capital
        options with Indexia Finance today — and keep your business moving forward with confidence.
      </p>
    ),
  },
];

const WorkingCapitalDetail = () => (
  <ShowDetailLayout
    loanName="Working Capital"
    breadcrumb="Working Capital Loan"
    bannerTitle="Working Capital Loan"
    bannerTagline="Now, Right Bank will come to your doorstep"
    bannerBg={bannerBg}
    docsHref="/requireddocument/working-capital"
    applySlug="workingcapital"
    sections={sections}
  />
);

export default WorkingCapitalDetail;
