import { Link } from "react-router-dom";
import Button from "../ui/Button";
import FranchiseIcon from "./FranchiseIcon";
import FranchiseNetworkGraphic from "./FranchiseNetworkGraphic";

/**
 * Hero — headline, the two paths into the section (apply, or sign in), and the
 * network graphic.
 *
 * It deliberately carries no highlight cards and no figures: the benefits,
 * plans and payout facts each have their own section further down the page, and
 * previewing them here was what made the page read as repeating itself.
 */
const FranchiseHero = () => (
  <section
    className="relative mt-(--header-h) w-full overflow-hidden px-6 pb-14 pt-12 md:px-8 md:pb-16 md:pt-16"
    style={{ background: "linear-gradient(125deg,#0b1730 0%,#123f6b 46%,#0f7ba8 78%,#17a08a 100%)" }}
  >
    {/* Decorative rings + glow */}
    <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border-32 border-white/5" />
    <div className="pointer-events-none absolute -bottom-40 left-1/5 h-96 w-96 rounded-full border-40 border-white/5" />
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
      style={{ background: "linear-gradient(90deg,transparent,rgba(242,242,49,0.55),transparent)" }}
    />

    <div className="relative mx-auto max-w-6xl">
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
        {/* Copy */}
        <div>
          <span
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em]"
            style={{ background: "rgba(38,174,144,0.18)", color: "#7fe3cb", border: "1px solid rgba(38,174,144,0.35)" }}
          >
            <FranchiseIcon name="handshake" className="h-3.5 w-3.5" />
            Franchise Opportunity
          </span>

          <h1 className="mt-5 text-3xl font-extrabold leading-[1.15] text-white md:text-[44px]">
            Build Your Own Financial Services Business with{" "}
            <span style={{ color: "var(--brand-yellow)" }}>Indexia Finance</span>
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/75 md:text-base">
            Partner with Indexia Finance and earn attractive payouts by connecting customers with banks and
            NBFCs for secured and unsecured financial products.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              size="lg"
              onClick={() => document.getElementById("franchisee-application")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="shadow-lg"
              style={{ background: "var(--brand-yellow)", color: "#0b1730" }}
            >
              Apply for a Franchise
            </Button>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/35 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              Talk to Our Team
            </Link>
          </div>

          {/* The second page in this flow, linked where a returning partner lands. */}
          <p className="mt-5 flex flex-wrap items-center gap-2 text-[12.5px] text-white/55">
            <FranchiseIcon name="lock" className="h-4 w-4 shrink-0 text-white/45" />
            Already a franchise partner?{" "}
            <Link
              to="/franchise-login"
              className="font-bold text-(--brand-yellow) underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              Sign in to your dashboard
            </Link>
          </p>
        </div>

        {/* Graphic */}
        <div
          className="relative mx-auto w-full max-w-140 rounded-3xl p-5 md:p-7"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.16)" }}
        >
          <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">
            How a franchise partner connects the two sides
          </p>
          <FranchiseNetworkGraphic />
        </div>
      </div>

      {/* In-page jump links — a table of contents, not a second copy of the sections. */}
      <nav aria-label="On this page" className="mt-12 flex flex-wrap items-center gap-2.5">
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">On this page</span>
        {[
          ["how-it-works", "How it works"],
          ["payouts", "Payouts"],
          ["plans", "Plans & fees"],
          ["benefits", "Why partner"],
          ["franchisee-application", "Apply"],
          ["faqs", "FAQs"],
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
            style={{ border: "1px solid rgba(255,255,255,0.16)" }}
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  </section>
);

export default FranchiseHero;
