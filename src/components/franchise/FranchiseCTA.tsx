import { Link } from "react-router-dom";
import FranchiseIcon from "./FranchiseIcon";
import useFranchisorLoginAccess from "../../hooks/useFranchisorLoginAccess";

interface FranchiseCTAProps {
  /** Opens the franchisee application popup. */
  onApply: () => void;
}

/**
 * Closing band — the way to start: apply. It carries no figures and no
 * disclaimer of its own, since the plans and payout sections above already
 * state them.
 */
const FranchiseCTA = ({ onApply }: FranchiseCTAProps) => {
  // Franchisee login is disabled (greyed out) for signed-out visitors.
  const franchiseeLoginEnabled = useFranchisorLoginAccess();
  return (
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
          onClick={onApply}
          className="cursor-pointer rounded-xl px-7 py-3.5 text-base font-bold shadow-lg transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/50"
          style={{ background: "var(--brand-yellow)", color: "#0b1730" }}
        >
          Apply for a Franchisee
        </button>
      </div>

      {/* The return path for partners who already hold an agreement. */}
      <p className="mx-auto mt-8 text-[12.5px] text-white/60">
        Already a Franchisee?{" "}
        {franchiseeLoginEnabled ? (
          <Link
            to="/franchise-login"
            className="font-bold text-(--brand-yellow) underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            Franchisee Login →
          </Link>
        ) : (
          <span
            aria-disabled="true"
            title="Sign in to access the franchisee portal"
            className="cursor-not-allowed font-bold text-white/45"
          >
            Franchisee Login — sign in first
          </span>
        )}
      </p>
    </div>
  </section>
  );
};

export default FranchiseCTA;
