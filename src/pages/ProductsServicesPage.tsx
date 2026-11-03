import { Link } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import useSEO from "../hooks/useSEO";

/**
 * Product & Services — a landing page for the full funding range, with the
 * spotlight on Investor, FDI, NBFC & Bank Funding.
 */

interface Highlight {
  title: string;
  tagline: string;
  desc: string;
  points: string[];
}

const HIGHLIGHTS: Highlight[] = [
  {
    title: "Investor",
    tagline: "Capital that grows with your business",
    desc: "Structured investment and funding solutions that connect growing businesses with the right investors.",
    points: [
      "Funding against company valuation, case by case",
      "Equity and structured investor participation",
      "Long-tenure growth capital for expansion",
      "End-to-end structuring and documentation support",
    ],
  },
  {
    title: "FDI",
    tagline: "Foreign Direct Investment, done right",
    desc: "FEMA-compliant FDI solutions for businesses expanding into India, with full regulatory guidance.",
    points: [
      "Complete guidance on FEMA-compliant FDI structure",
      "RBI reporting, sectoral caps and approval-route filings",
      "Funding against company valuation or collateral property",
      "Handled end to end by experts",
    ],
  },
  {
    title: "NBFC Funding",
    tagline: "Fast, flexible non-bank funding",
    desc: "Loan syndication through leading NBFCs for borrowers who need speed and flexibility over paperwork.",
    points: [
      "Faster approvals with simpler documentation",
      "Flexible structures for business and project needs",
      "Customised repayment aligned with cash flow",
      "Access to a wide network of NBFC partners",
    ],
  },
  {
    title: "Bank Funding",
    tagline: "Right bank at your doorstep",
    desc: "Direct access to leading banks and their full product range at the most competitive terms.",
    points: [
      "Personal, business, home, LAP, vehicle and more",
      "Competitive bank interest rates and tenures",
      "One application syndicated across multiple banks",
      "A dedicated loan specialist for every file",
    ],
  },
];

const OTHER_PRODUCTS = [
  { label: "Personal Loan",            slug: "personal-loan" },
  { label: "Business Loan",            slug: "business-loan" },
  { label: "Home Loan",                slug: "home-loan" },
  { label: "Loan Against Property",    slug: "loanAP-loan" },
  { label: "Balance Transfer",         slug: "balance-loan" },
  { label: "Project Loan",             slug: "project-loan" },
  { label: "Vehicle Loan",             slug: "vehicle-loan" },
  { label: "Education Loan",           slug: "education-loan" },
  { label: "Credit Card",              slug: "credit-card" },
  { label: "Commercial Purchase",      slug: "commercial-purchase" },
  { label: "Working Capital",          slug: "working-capital" },
  { label: "Lease Rental Discounting", slug: "lease-rental" },
  { label: "OD CC Limit",              slug: "od-cc-limit" },
  { label: "Loan Against Share",       slug: "loan-against-share" },
  { label: "Film Funding",             slug: "film-funding" },
  { label: "Gold Loan",                slug: "gold-loan" },
];

const ProductsServicesPage = () => {
  useSEO({
    title: "Product & Services",
    description:
      "Investor funding, FDI, NBFC & Bank Funding and 15+ loan products under one roof — Indexia Finance is an entire loan destination with banks coming to your doorstep.",
    path: "/products-services",
  });

  return (
    <>
      <PageBanner
        breadcrumb="Product & Services"
        title="Product &"
        highlight="Services"
        tagline="Now, Right Bank will come at your doorstep"
      />

      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
          {/* Intro */}
          <header className="max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--brand-navy)">
              An entire loan destination
            </p>
            <h2 className="mt-2 mb-4 text-2xl font-extrabold leading-tight text-slate-900 md:text-3xl">
              Every funding need, one destination
            </h2>
            <p className="text-sm leading-7 text-gray-600 md:text-[15px]">
              From structured investor capital to FDI, NBFC syndication and direct
              bank funding, Indexia Finance brings every funding route under one
              roof — so you pick the one that actually fits your business.
            </p>
          </header>

          {/* Spotlight: Investor / FDI / NBFC / Bank Funding */}
          <section aria-labelledby="spotlight-heading" className="mt-10">
            <h2
              id="spotlight-heading"
              className="mb-6 text-2xl font-extrabold text-slate-900 md:text-3xl"
            >
              Our <span className="text-(--brand-teal)">spotlight</span> services
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {HIGHLIGHTS.map((item, index) => (
                <article
                  key={item.title}
                  className="relative overflow-hidden rounded-2xl p-6 md:p-7"
                  style={{
                    border: "1px solid rgba(6,106,156,0.12)",
                    boxShadow: "0 2px 12px rgba(6,106,156,0.06)",
                  }}
                >
                  {/* corner accent */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-15"
                    style={{
                      background:
                        index % 2 === 0
                          ? "radial-gradient(circle, var(--brand-teal) 0%, transparent 70%)"
                          : "radial-gradient(circle, var(--brand-navy) 0%, transparent 70%)",
                    }}
                  />
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--brand-teal)">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold italic text-(--brand-navy)">
                    {item.tagline}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-gray-600">{item.desc}</p>
                  <ul className="mt-4 space-y-2">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm leading-6 text-gray-600">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-(--brand-teal)"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className="mt-5 inline-flex items-center gap-2 text-[12.5px] font-bold text-(--brand-navy) transition-colors hover:text-(--brand-teal)"
                  >
                    Enquire Now
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </article>
              ))}
            </div>
          </section>

          {/* Other loan products */}
          <section aria-labelledby="other-products-heading" className="mt-12">
            <div className="mb-6 border-t border-slate-200 pt-8">
              <h2
                id="other-products-heading"
                className="text-2xl font-extrabold text-slate-900 md:text-3xl"
              >
                Explore our full loan range
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Retail to corporate — 15+ products with approvals within 48 hours.
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {OTHER_PRODUCTS.map((product) => (
                <li key={product.slug}>
                  <Link
                    to={`/showdetails/${product.slug}`}
                    className="flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-(--brand-teal-14) hover:text-(--brand-navy)"
                    style={{ border: "1px solid rgba(6,106,156,0.12)" }}
                  >
                    {product.label}
                    <span aria-hidden="true" className="text-(--brand-teal)">›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};

export default ProductsServicesPage;
