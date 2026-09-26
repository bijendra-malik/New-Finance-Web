import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerBg from "../../assets/loan-images/Home-banner.png";
import homelonaDetail from "../../assets/personal-loan/home-loan.png";

const ACCENT = "var(--brand-navy)";

const BulletList = ({ items }: { items: [string, string][] }) => (
  <ul className="space-y-2.5 mt-1">
    {items.map(([title, desc]) => (
      <li key={title} className="flex items-start gap-3">
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
        <span className="text-sm md:text-base text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-800">{title}: </span>{desc}
        </span>
      </li>
    ))}
  </ul>
);

const sections: DetailSection[] = [
  {
    id: "intro",
    heading: "What is a Home Loan?",
    content: (
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 leading-relaxed">
            Your home isn't just a haven — it's where cherished memories unfold. Transforming the
            dream of homeownership into reality demands meticulous planning and substantial finances.
            Indexia Finance, your trusted home loan partner, is dedicated to securing the optimal
            loan deal tailored for you — with competitive rates, minimal paperwork, and end-to-end
            digital convenience.
          </p>
        </div>
        <div className="shrink-0 w-full lg:w-80">
          <img src={homelonaDetail} alt="Home Loan"
            className="w-full h-72 object-contain grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
      </div>
    ),
  },
  {
    id: "types",
    heading: "Types of Home Loans",
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 text-sm leading-relaxed">Different types of home loans cater to different borrower needs:</p>
        <div className="space-y-3">
          {[
            ["Home Purchase Loan", "The most common type — for purchasing a new or resale house or apartment."],
            ["Home Improvement Loan", "For renovation, repair, or upgrade of an already-owned home."],
            ["Home Extension Loan", "When you want to expand your existing home — adding a room, floor, or extension."],
            ["Home Conversion Loan", "Transfers your existing loan and covers additional funds needed for a new property."],
            ["Bridge Loan", "A short-term loan to help finance a new home while you wait to sell your existing one."],
            ["Home Construction Loan", "For borrowers who want to construct a new house on a plot they own."],
            ["Land Purchase Loan", "For purchasing a plot of land for construction or investment."],
          ].map(([title, desc]) => (
            <div key={title} className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
              <span className="text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-800">{title}: </span>{desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "eligibility",
    heading: "Calculating Your Home Loan Eligibility",
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 text-sm leading-relaxed">Several factors determine how much you are eligible to borrow:</p>
        <BulletList items={[
          ["Monthly Income", "Net income after deducting existing EMIs directly influences your eligibility."],
          ["Other EMIs", "Active loan obligations reduce your available repayment capacity."],
          ["Loan Tenure", "Longer tenures lower your EMI but increase total interest paid."],
          ["Interest Rate", "Rates vary by lender — comparing deals is essential for a cost-effective decision."],
          ["EMI", "The fixed monthly repayment amount covering both principal and interest."],
          ["Eligible Loan Amount", "The maximum amount a lender will sanction based on your overall financial profile."],
        ]} />
      </div>
    ),
  },
  {
    id: "why-indexia",
    heading: "Why Choose Indexia Finance for Your Home Loan?",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 leading-relaxed">
          Indexia Finance stands as one of India's leading home loan provider companies. Our
          fully online application process ensures convenience and efficiency — no branch visits,
          no endless paperwork.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ["Best Rate Guarantee", "We compare rates across 30+ partner lenders to get you the most competitive offer."],
            ["Seamless Process", "Fully digital application — from submission to disbursal, track everything online."],
            ["Top 3 in India", "Ranked among India's top 3 finance companies and loan service providers."],
            ["Expert Guidance", "Dedicated home loan advisors guide you from eligibility check to possession."],
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
    heading: "Best Home Loan Options",
    content: (
      <div className="space-y-5">
        {[
          { num: "1", title: "Best Home Loan", desc: "A curated selection of home loans with competitive terms, flexible repayment options, and quick approvals — making your dream home more accessible." },
          { num: "2", title: "Best Home Loan Company", desc: "Partnered with reputable lenders known for customer satisfaction, transparent processes, and seamless borrowing experiences." },
          { num: "3", title: "Best Home Loan Provider", desc: "Institutions that prioritize your financial well-being — transparent, customer-centric, and committed to fair lending." },
          { num: "4", title: "Best Home Loan Provider Company", desc: "Renowned for reliability, integrity, and a genuine dedication to helping individuals achieve homeownership." },
          { num: "5", title: "Best Home Loan Finance", desc: "Financing options aligned with your financial goals — competitive rates, favourable terms, and solutions built around your needs." },
          { num: "6", title: "Home Loan at Lowest Rate of Interest", desc: "We negotiate with lenders to secure the most favorable interest rates, helping you minimize the total cost of financing your dream home." },
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
    heading: "Ready to Secure Your Dream Home?",
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed">
          Finding the right home loan is simplified with Indexia Finance. Whether you prioritise
          the lowest interest rate, fastest disbursal, or the most flexible tenure — we have the
          right option for you.
        </p>
        <p className="text-gray-400 text-xs italic">
          Disclaimer: Ensure thorough comparisons of EMI, tenure, and interest rates before
          finalising any deal. All information is indicative; final terms are subject to lender approval.
        </p>
      </div>
    ),
  },
];

const HomeLoanDetail = () => (
  <ShowDetailLayout
    loanName="Home Loan"
    breadcrumb="Home Loan"
    bannerTitle="Secure Your Dream Home with the Best Home Loan"
    bannerTagline="Bank will come to your doorstep"
    bannerBg={bannerBg}
    docsHref="/requireddocument/home-loan"
    applySlug="homeloan"
    sections={sections}
  />
);

export default HomeLoanDetail;
