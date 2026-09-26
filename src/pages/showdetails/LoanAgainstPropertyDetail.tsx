import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerBg from "../../assets/loan-images/AgainstProperty-banner.png";
import againstloanDetails from "../../assets/personal-loan/againstloan-details.png";

const ACCENT = "var(--brand-navy)";

const BulletList = ({ items }: { items: [string, string?][] }) => (
  <ul className="space-y-2.5 mt-1">
    {items.map(([title, desc], i) => (
      <li key={i} className="flex items-start gap-3">
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
        <span className="text-sm text-gray-600 leading-relaxed">
          {desc ? <><span className="font-semibold text-gray-800">{title}: </span>{desc}</> : title}
        </span>
      </li>
    ))}
  </ul>
);

const sections: DetailSection[] = [
  {
    id: "intro",
    heading: "What is a Loan Against Property?",
    content: (
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        <div className="flex-1 min-w-0">
          <div className="space-y-3">
            <p className="text-gray-600 leading-relaxed">
              A Loan Against Property (LAP) lets you unlock the value of your residential or
              commercial property without selling it. Borrow from{" "}
              <strong className="text-gray-800">₹10 Lakh onwards</strong> — up to{" "}
              <strong className="text-gray-800">100% of the market value</strong> of your property —
              at some of the lowest interest rates available.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {[
                ["Loan from", "₹10 Lakh onwards"],
                ["Max LTV", "Up to 100% of property value"],
                ["Repayment", "EMI-based or Overdraft"],
                ["Tenure", "Up to 15 years"],
                ["Interest Rate", "Among the lowest available"],
                ["Eligibility", "Salaried, self-employed & businessmen"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center px-4 py-3 rounded-lg text-sm"
                  style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="shrink-0 w-full lg:w-80">
          <img src={againstloanDetails} alt="Loan Against Property"
            className="w-full h-72 object-contain grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
      </div>
    ),
  },
  {
    id: "advantages",
    heading: "Advantages of Taking a Loan Against Property",
    content: (
      <BulletList items={[
        ["Cheaper than Personal Loans", "LAP interest rates are far lower than personal loans, which typically range from 11.5% – 21% p.a."],
        ["Longer Loan Tenure", "LAP tenures can go up to 15 years, giving you much more breathing room than a personal loan."],
        ["Lower EMI", "Because the interest rate is lower and tenure is longer, your monthly outgo is significantly reduced."],
        ["Simple Documentation & Fast Approvals", "Being a secured loan, LAP has comparatively minimal documentation requirements and faster processing."],
      ]} />
    ),
  },
  {
    id: "purposes",
    heading: "What Can You Use a Loan Against Property For?",
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 text-sm leading-relaxed">LAP is a multipurpose loan — you can use the funds for virtually any personal or business need:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {["Expanding your business","Funding your child's wedding","Sending your child to higher studies abroad","Funding your dream holiday","Covering medical treatments","Debt consolidation","Any personal or business requirement"].map((use) => (
            <div key={use} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />{use}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "why-indexia",
    heading: "Why Choose Indexia Finance for LAP?",
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed">
          Indexia Finance is one of the best Loan Against Property providers in India — ranked
          among the top 3 finance companies and loan service providers in the country.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {[
            ["Top 3 in India", "Ranked among India's top 3 finance & loan service providers."],
            ["Wide Lender Network", "30+ partner banks and NBFCs for the best available rates."],
            ["Personal & Business Use", "LAP available for both individual and business purposes."],
            ["End-to-End Support", "Dedicated advisor from application to final disbursal."],
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
    heading: "Best Loan Against Property Options",
    content: (
      <div className="space-y-5">
        {[
          { num: "1", title: "Best LAP Provider Company", desc: "Partnered with reputable institutions known for expertise, integrity, and commitment to providing tailored LAP solutions." },
          { num: "2", title: "Best Loan Against Property", desc: "A curated selection with competitive terms, flexible repayment, and quick approvals." },
          { num: "3", title: "Best LAP Finance", desc: "Financing aligned with your financial objectives — competitive interest rates and favourable terms." },
          { num: "4", title: "Best LAP Company", desc: "Companies renowned for reliability, integrity, and dedication to helping individuals and businesses leverage their property." },
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
    heading: "Ready to Unlock Your Property's Value?",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Unlocking the value of your property is made easier with Indexia Finance's curated
        selection of the best LAP options. Whether you prioritize the lowest rate, highest LTV,
        or fastest disbursal — we guide you toward the right choice. Contact us today.
      </p>
    ),
  },
];

const LoanAgainstPropertyDetail = () => (
  <ShowDetailLayout
    loanName="Loan Against Property"
    breadcrumb="Loan Against Property"
    bannerTitle="Loan Against Property"
    bannerBg={bannerBg}
    docsHref="/requireddocument/loan-against-property"
    applySlug="loanagainstproperty"
    sections={sections}
  />
);

export default LoanAgainstPropertyDetail;
