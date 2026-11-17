import { Link } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import useSEO from "../hooks/useSEO";
import { CAREER_ROLES } from "../constants/careers";
import { EMAIL_CAREERS, OFFICE_ADDRESS_LINES, PHONE_LANDLINE, PHONE_LANDLINE_HREF } from "../constants/contact";

const VALUES = [
  {
    title: "Own the outcome",
    desc: "Small teams, short chains of approval. If you find the problem, you get to fix it.",
  },
  {
    title: "Fair by default",
    desc: "Transparent pricing and honest advice to customers — the same standard we hold each other to.",
  },
  {
    title: "Learn in the open",
    desc: "Credit, compliance and engineering sit close together, so what you build meets what the business needs.",
  },
  {
    title: "Grow with the group",
    desc: "Indexia Group's businesses span financial services across India — careers move across them.",
  },
];

const HIRING_STEPS = [
  { step: "01", title: "Apply", desc: "Send your CV with the role in the subject line. Every application is read by a person." },
  { step: "02", title: "Conversation", desc: "A 30-minute call about your experience, what you want next and how the role fits." },
  { step: "03", title: "Meet the team", desc: "One or two focused interviews with the people you would work with, plus a practical discussion." },
  { step: "04", title: "Offer", desc: "We come back with a clear offer and a start date, usually within two weeks of the first call." },
];

const CareersPage = () => {
  useSEO({
    title: "Careers at Indexia Finance — Open Roles",
    description:
      "Build your career with Indexia Finance. Explore open roles in sales, credit, technology, operations and growth — and how our hiring process works.",
    path: "/careers",
  });

  const mailto = (role?: string) =>
    `mailto:${EMAIL_CAREERS}?subject=${encodeURIComponent(role ? `Application — ${role}` : "Career enquiry")}`;

  return (
    <>
      <PageBanner
        breadcrumb="Careers"
        title="Build your career"
        highlight="with us"
        tagline="Lending that is fair, fast and human — built by people who care"
      />

      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
          {/* Intro */}
          <header className="mb-10 border-t border-slate-200 pt-5">
            <div className="grid gap-5 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:items-end">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--brand-navy)">
                  Careers / Indexia Finance
                </p>
                <h2 className="mt-2 max-w-2xl text-3xl font-extrabold leading-[1.05] tracking-tight text-slate-900 md:text-4xl">
                  Work where the customer's <span className="text-(--brand-teal)">file actually moves.</span>
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-slate-500 md:justify-self-end md:pb-1 md:text-right">
                We are a loan facilitation business — part advisory, part operations, part product. If
                that mix appeals to you, we would like to talk.
              </p>
            </div>
          </header>

          {/* Values */}
          <section aria-labelledby="why-indexia" className="mb-14">
            <h3 id="why-indexia" className="mb-4 text-lg font-bold text-slate-900">
              Why Indexia
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {VALUES.map((value, index) => (
                <div
                  key={value.title}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                >
                  <span
                    className="mb-3 flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold text-white"
                    style={{ background: index % 2 === 0 ? "var(--brand-navy)" : "var(--brand-teal)" }}
                  >
                    {index + 1}
                  </span>
                  <h4 className="text-[15px] font-bold text-slate-900">{value.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{value.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Open roles */}
          <section aria-labelledby="open-roles" className="mb-14">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h3 id="open-roles" className="text-lg font-bold text-slate-900">
                Open roles
              </h3>
              <p className="text-xs text-slate-500">
                {CAREER_ROLES.length} openings · {OFFICE_ADDRESS_LINES[2]}
              </p>
            </div>

            <ul className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              {CAREER_ROLES.map((role) => (
                <li
                  key={role.title}
                  className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <h4 className="text-[15px] font-bold text-slate-900">{role.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{role.summary}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {[role.team, role.location, role.type].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    to={`/careers/apply?role=${encodeURIComponent(role.title)}&dept=${encodeURIComponent(role.team)}`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-(--brand-navy) px-5 py-2.5 text-xs font-bold text-(--brand-navy) transition-all duration-300 hover:bg-(--brand-navy) hover:text-white active:scale-95"
                  >
                    Apply now →
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-3 text-xs text-slate-500">
              Nothing matching your skills?{" "}
              <Link
                to="/careers/apply?role=Open%20application"
                className="font-semibold text-(--brand-navy) underline underline-offset-4"
              >
                Send an open application
              </Link>{" "}
              or write to{" "}
              <a href={mailto()} className="font-semibold text-(--brand-navy) underline underline-offset-4">
                {EMAIL_CAREERS}
              </a>
              .
            </p>
          </section>

          {/* Hiring process */}
          <section aria-labelledby="hiring-process" className="mb-14">
            <h3 id="hiring-process" className="mb-4 text-lg font-bold text-slate-900">
              How hiring works
            </h3>
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {HIRING_STEPS.map((item) => (
                <li
                  key={item.step}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5"
                >
                  <span className="font-mono text-xs font-bold tracking-[0.2em] text-(--brand-teal)">
                    {item.step}
                  </span>
                  <h4 className="mt-2 text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{item.desc}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* CTA */}
          <div
            className="overflow-hidden rounded-2xl text-white"
            style={{ background: "linear-gradient(135deg, var(--brand-navy-deep) 0%, var(--brand-navy) 100%)" }}
          >
            <div className="flex flex-col gap-4 px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-extrabold">Ready to apply?</h3>
                <p className="mt-1 text-sm text-white/75">
                  Send your application in two minutes, or write to{" "}
                  <a href={mailto()} className="font-semibold underline underline-offset-4">
                    {EMAIL_CAREERS}
                  </a>{" "}
                  and call{" "}
                  <a href={PHONE_LANDLINE_HREF} className="font-semibold underline underline-offset-4">
                    {PHONE_LANDLINE}
                  </a>
                  .
                </p>
              </div>
              <Link
                to="/careers/apply?role=Open%20application"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                style={{ background: "var(--brand-yellow)", color: "var(--brand-navy)" }}
              >
                Apply now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CareersPage;
