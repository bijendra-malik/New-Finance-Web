import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerFallback from "../../assets/loan-images/CreditCards-banner.png";
import creaditcarddetails from "../../assets/personal-loan/creaditcard-details.png";

const ACCENT = "var(--brand-navy)";

const BulletList = ({ items }: { items: (string | [string, string])[] }) => (
  <ul className="space-y-2.5 mt-1">
    {items.map((item, i) => {
      const [title, desc] = Array.isArray(item) ? item : [item, undefined];
      return (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
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
    heading: "What is a Credit Card?",
    content: (
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        <div className="flex-1 min-w-0">
          <div className="space-y-3">
            <p className="text-gray-600 leading-relaxed">
              In today's digital age, carrying cash is increasingly impractical. Credit cards —
              often called plastic money — offer a rising alternative that not only replaces cash
              but also rewards your everyday spending.
            </p>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2 mt-3">Types of Credit Cards Available</p>
              <div className="flex flex-wrap gap-2">
                {["Entertainment","Fuel","Co-branded","Cash-back","Student","Women","Travel","Lifetime Free","Premium","Business","Global","Low-interest"].map((type) => (
                  <span key={type} className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background: "#EFF7FF", color: ACCENT, border: "1px solid var(--brand-navy)22" }}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="shrink-0 w-full lg:w-80">
          <img src={creaditcarddetails} alt="Credit Card"
            className="w-full h-72 object-contain grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
      </div>
    ),
  },
  {
    id: "vs-debit",
    heading: "Credit Card vs Debit Card",
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Debit Card", icon: "🏦", points: ["Spends your own money from your bank account","No credit history impact","No interest charged","Limited to your account balance"], bg: "#FAFAFA", border: "#E5E7EB" },
          { label: "Credit Card", icon: "💳", points: ["Spends borrowed money — repay before due date","Builds your credit history and CIBIL score","Zero interest if paid in full before due date","Access to a revolving credit line"], bg: "#EFF7FF", border: "var(--brand-navy)22" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl p-4" style={{ background: card.bg, border: `1px solid ${card.border}` }}>
            <p className="font-semibold text-gray-800 text-sm mb-3">{card.icon} {card.label}</p>
            <ul className="space-y-1.5">
              {card.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="mt-1.5 w-1 h-1 rounded-full shrink-0 bg-gray-400" />{p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "how-to-use",
    heading: "How to Use a Credit Card",
    content: (
      <p className="text-gray-600 leading-relaxed">
        A credit card issuer provides you with a revolving credit line for purchases or cash advances.
        Your monthly bill can be paid in full before the due date — at zero interest. Card transactions
        work via the magnetic strip, chip-and-pin system, or online using your card number, expiry date,
        CVV, and transaction password.
      </p>
    ),
  },
  {
    id: "benefits",
    heading: "Benefits of Credit Cards",
    content: (
      <BulletList items={[
        ["Use Anywhere", "Shop in India and abroad — both online and offline — with supplementary card benefits included."],
        ["ATM Facilities", "Withdraw cash from any ATM at any time using your credit card's cash advance feature."],
        ["Reward Points", "Earn reward points on every swipe — redeem for benefits, discounts, or upgrades with your bank."],
        ["Monitor Usage", "All transactions appear on a single statement for easy tracking."],
        ["Independence", "Supplementary cards for family members provide financial freedom and are useful in emergencies."],
        ["Easy Tracking", "Single consolidated statement for all cards under the account simplifies financial planning."],
      ]} />
    ),
  },
  {
    id: "eligibility",
    heading: "Eligibility Criteria",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">Basic criteria that apply across most providers:</p>
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          {[
            ["Minimum Age", "18 years"],
            ["Income", "Regular income (salaried or self-employed) — minimum bracket varies by card"],
            ["Bank Account", "Must have a savings account in your name"],
            ["Credit History", "No bad credit history or defaults"],
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
    id: "best-options",
    heading: "Best Credit Card Options",
    content: (
      <div className="space-y-5">
        {[
          { num: "1", title: "Best Credit Card Provider", desc: "Known for competitive rates and rewarding perks — a variety of card options tailored to your lifestyle." },
          { num: "2", title: "Best Credit Card Options", desc: "From premium rewards cards to student-friendly options — providers offer solutions for every stage of life." },
          { num: "3", title: "Best Credit Card Company", desc: "User-friendly interfaces, secure payment systems, and excellent customer support." },
          { num: "4", title: "Best Credit Card Provider Company", desc: "Whether you're a frequent traveller or everyday spender, committed to innovation and enhancing your financial experience." },
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
    heading: "Explore the Modern Financial Landscape",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Credit cards seamlessly blend convenience and rewards. Indexia Finance is one of the
        best credit card providers in India. Explore our curated selection and embark on a
        journey toward financial freedom.
      </p>
    ),
  },
];

const CreditCardDetail = () => (
  <ShowDetailLayout
    loanName="Credit Card"
    breadcrumb="Credit Card"
    bannerTitle="Credit Cards — Convenience & Rewards in One"
    bannerBg={bannerFallback}
    docsHref="/requireddocument/credit-card"
    applySlug="credit-card"
    sections={sections}
  />
);

export default CreditCardDetail;
