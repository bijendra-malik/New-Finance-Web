import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerBg from "../../assets/loan-images/commercial-banner.png";
import commercialImg from "../../assets/personal-loan/commercialpurchage.png";

const ACCENT = "#066a9c";

const BulletList = ({ items }: { items: [string, string][] }) => (
  <ul className="space-y-2.5 mt-1">
    {items.map(([title, desc], i) => (
      <li key={i} className="flex items-start gap-3">
        <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
        <span className="text-sm text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-800">{title}: </span>{desc}
        </span>
      </li>
    ))}
  </ul>
);

const sections: DetailSection[] = [
  {
    id: "intro",
    heading: "Commercial Purchase Loan — Build Something Bigger",
    content: (
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 leading-relaxed">
            When it comes to expanding your business horizons or bringing a new venture to life,
            seizing the moment is everything. Indexia Finance's Commercial Purchase Loan offers
            more than just funds — they provide flexibility, a unique Surrogate Income Programme,
            and a commitment to ensuring your financial worries don't hinder your growth.
          </p>
        </div>
        <div className="shrink-0 w-full lg:w-80">
          <img src={commercialImg} alt="Commercial Purchase"
            className="w-full h-72 object-contain grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
      </div>
    ),
  },
  {
    id: "features",
    heading: "Features & Benefits",
    content: (
      <BulletList items={[
        ["Maximum Loan Amount", "Unlock the potential for significant commercial property acquisition."],
        ["Higher Loan Eligibility", "Tailored to meet the diverse needs of both Salaried and Self-Employed individuals."],
        ["Flexible Loan Tenure", "Choose the repayment schedule that suits you, facilitated through simple EMIs."],
        ["Special 'No Income Document' Programme", "Offering flexibility for a variety of financial situations."],
      ]} />
    ),
  },
  {
    id: "eligibility",
    heading: "Eligibility Criteria",
    content: (
      <div className="rounded-xl border border-gray-100 overflow-hidden">
        {[
          ["Minimum Age", "21 years"],
          ["Business / Service Continuity", "Demonstrated stability"],
          ["Residency Stability", "Established"],
          ["Minimum Gross Annual Income", "₹2,00,000"],
          ["Applicable To", "Salaried / Self-employed professionals and non-professionals"],
          ["All Loans", "Subject to the sole discretion of the company / bank"],
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
    id: "efficiency",
    heading: "Efficiency at Your Fingertips",
    content: (
      <p className="text-gray-600 leading-relaxed">
        We understand time is money in the business world. That's why we've streamlined the
        process. Apply for your Commercial Property Purchase Loan online and we'll deliver the
        necessary documents to your doorstep — so you can focus on building your business, not
        paperwork.
      </p>
    ),
  },
  {
    id: "why-indexia",
    heading: "Why Indexia Finance for Commercial Purchase?",
    content: (
      <BulletList items={[
        ["Proven Track Record", "A history of successful commercial transactions has earned Indexia Finance a reputation as a reliable partner."],
        ["Tailored Solutions", "Every commercial venture is unique — our commitment is to provide personalised solutions that align with your specific requirements."],
        ["Transparent Processes", "Transparency is at the core of our operations. Clear communication and straightforward processes, every step of the way."],
      ]} />
    ),
  },
  {
    id: "best-options",
    heading: "Best Commercial Purchase Options",
    content: (
      <div className="space-y-5">
        {[
          { num: "1", title: "Best Finance Commercial Purchase", desc: "Indexia Finance leads the way — our team understands the intricate dynamics of commercial transactions, ensuring every purchase aligns with your financial goals." },
          { num: "2", title: "Best Commercial Purchase Company", desc: "Going beyond the transaction, we offer expertise that extends to comprehensive support for your commercial ventures from start to finish." },
          { num: "3", title: "Best Commercial Purchase Provider Company", desc: "Delivering tailored solutions that cater to the unique needs of your business — a smooth, transparent process from application to disbursement." },
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
    heading: "Ready to Elevate Your Commercial Ventures?",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Indexia Finance is one of India's premier commercial loan providers. Whether you're
        seeking the best finance commercial purchase or a trustworthy commercial purchase
        provider — we've got you covered. Apply now and experience a financial journey that
        transcends boundaries.
      </p>
    ),
  },
];

const CommercialPurchaseDetail = () => (
  <ShowDetailLayout
    loanName="Commercial Purchase"
    breadcrumb="Commercial Purchase Loan"
    bannerTitle="Commercial Purchase Loan"
    bannerBg={bannerBg}
    docsHref="/requireddocument/commercial-purchase"
    applySlug="commercialpurchase"
    sections={sections}
  />
);

export default CommercialPurchaseDetail;
