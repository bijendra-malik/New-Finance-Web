import { Link } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import useSEO from "../hooks/useSEO";

/**
 * Global Research — mirrored from indexiafinance.com/global-research: who we
 * are & what we do, publication coverage, client interaction and portal access,
 * plus a highlight that we serve in 72 countries.
 */

const PUBLICATIONS = [
  "Economic Research",
  "Global Thematic Research",
  "Global Macro Strategy",
  "FX",
  "Rates · Credit · Commodities",
];

const GlobalResearchPage = () => {
  useSEO({
    title: "Global Research",
    description:
      "Indexia Finance Global Research — insightful analyses across macroeconomic, fixed income, currency and commodity disciplines, served in 72 countries. Economic, thematic, macro strategy and FX publications.",
    path: "/global-research",
  });

  return (
    <>
      <PageBanner
        breadcrumb="Global Research"
        title="Global Financial"
        highlight="Research"
        tagline="Insight, analyses and incisive views across our coverage footprint"
      />

      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-12 md:px-8">
          {/* 72 countries highlight */}
          <div className="mb-10 flex flex-col items-start gap-5 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-7 sm:flex-row sm:items-center md:px-8">
            <p className="text-5xl font-extrabold leading-none tracking-tight text-(--brand-teal) md:text-6xl">
              72
            </p>
            <p className="text-sm leading-7 text-gray-600 md:text-[15px]">
              <strong className="font-semibold text-slate-900">
                We serve in 72 countries.
              </strong>{" "}
              Our research draws on a strong on-the-ground profile — particularly
              in Asia, Africa and the Middle East — so our clients get local
              insight wherever they operate.
            </p>
          </div>

          <header className="max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--brand-navy)">
              Who we are & what we do
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              Global Research – Who we are & what we do
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-gray-600 md:text-[15px]">
              <p>
                Indexia Finance Global Research delivers insightful, relevant
                analyses and incisive views across the Bank's coverage
                footprint. Our award-winning team is strongly positioned to
                inform, advise and partner with clients across macroeconomic,
                fixed income, currency and commodity disciplines.
              </p>
              <p>
                Our strong on-the-ground profile – particularly in Asia, Africa
                and the Middle East – allows us to study these dynamic regions
                in depth and provide you, our client, with a leading edge
                through the team's local insight.
              </p>
            </div>
          </header>

          {/* Publications coverage */}
          <section className="mt-10 border-t border-slate-200 pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--brand-navy)">
              Our coverage
            </p>
            <p className="mt-3 text-sm leading-7 text-gray-600 md:text-[15px]">
              Our comprehensive range of publications includes reports on:
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {PUBLICATIONS.map((topic) => (
                <li
                  key={topic}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900"
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rounded-full bg-(--brand-teal)"
                  />
                  {topic}
                </li>
              ))}
            </ul>
          </section>

          {/* Client interaction & publications */}
          <section className="mt-10 border-t border-slate-200 pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--brand-navy)">
              How we work with clients
            </p>
            <div className="mt-3 space-y-4 text-sm leading-7 text-gray-600 md:text-[15px]">
              <p>
                We interact with our clients through frequent presentations and
                the production of a range of high-quality publications
                including OTG, our on-the-ground analysis; ACT, our actionable
                trade ideas, and Special Reports, presenting analyses of
                globally significant themes and their impact on economies and
                markets.
              </p>
              <p>
                To find out more about us and receive our research, visit our
                Global Research portal. To get access, please contact your
                Relationship Manager.
              </p>
            </div>
          </section>

          {/* Group website */}
          <section className="mt-10 border-t border-slate-200 pt-6">
            <p className="text-sm leading-7 text-gray-600 md:text-[15px]">
              Visit Our Group Website:{" "}
              <a
                href="https://www.indexiagroup.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-(--brand-teal) underline underline-offset-4 hover:text-(--brand-navy)"
              >
                www.indexiagroup.com
              </a>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/products-services"
                className="inline-flex items-center rounded-full bg-(--brand-navy) px-6 py-3 text-sm font-semibold text-white transition hover:bg-(--brand-teal)"
              >
                Explore Product & Services
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-(--brand-teal) hover:text-(--brand-teal)"
              >
                Contact Us
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default GlobalResearchPage;