import { Link } from "react-router-dom";
import FranchiseIcon from "./FranchiseIcon";

interface FranchiseCTAProps {
  /** Opens the franchisor-arrangement enquiry modal. */
  onBecomeFranchisor: () => void;
}

/**
 * Closing band — the two ways to start: apply, or open a franchisor-arrangement
 * enquiry. It carries no figures and no disclaimer of its own, since the plans
 * and payout sections above already state them.
 */
const FranchiseCTA = ({ onBecomeFranchisor }: FranchiseCTAProps) => (
  <section
    id="become-a-franchisor"
    className="franchise-anchor relative w-full overflow-hidden px-6 py-10 md:px-8 md:py-14"
    style={{ background: "linear-gradient(120deg,#0b1730 0%,#123f6b 50%,#17a08a 100%)" }}
  >
    <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full border-24 border-white/5" />
    <div className="pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full border-32 border-white/5" />

    <div className="relative mx-auto max-w-4xl text-center">
      <span
        className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.18em]"
        style={{ background: "rgba(242,242,49,0.14)", color: "var(--brand-yellow)", border: "1px solid rgba(242,242,49,0.4)" }}
      >
        <FranchiseIcon name="scale" className="h-3.5 w-3.5" />
        Take the Next Step
      </span>

      <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white md:text-[40px]">
        Ready to Build Your Financial Services Business?
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/75">
        Choose your franchise plan and take the first step toward building your customer network with Indexia
        Finance.
      </p>

      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() =>
            document.getElementById("franchisee-application")?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          className="cursor-pointer rounded-xl px-7 py-3.5 text-base font-bold shadow-lg transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/50"
          style={{ background: "var(--brand-yellow)", color: "#0b1730" }}
        >
          Apply for a Franchise
        </button>
        <button
          type="button"
          onClick={onBecomeFranchisor}
          className="cursor-pointer rounded-xl border border-white/35 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          Explore a franchisor arrangement
        </button>
      </div>

      {/* The return path for partners who already hold an agreement. */}
      <p className="mx-auto mt-8 text-[12.5px] text-white/60">
        Already a franchise partner?{" "}
        <Link
          to="/franchise-login"
          className="font-bold text-(--brand-yellow) underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          Franchisor Login →
        </Link>
      </p>
    </div>
  </section>
);

export default FranchiseCTA;
