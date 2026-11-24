import { Link } from "react-router-dom";
import Button from "../ui/Button";
import useFranchisorLoginAccess from "../../hooks/useFranchisorLoginAccess";
import FranchiseIcon from "./FranchiseIcon";

interface FranchiseHeroProps {
  /** Opens the Franchisee application popup. */
  onApply: () => void;
}

const FranchiseHero = ({ onApply }: FranchiseHeroProps) => {
  const franchiseeLoginEnabled = useFranchisorLoginAccess();
  return (
    <section
      className="franchise-hero relative mt-(--header-h) flex w-full items-center overflow-hidden px-6 py-9 md:px-8 md:py-11"
      style={{ background: "linear-gradient(125deg,#0b1730 0%,#123f6b 46%,#0f7ba8 78%,#17a08a 100%)" }}
    >
      {/* Decorative rings + glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border-32 border-white/5" />
      <div className="pointer-events-none absolute -bottom-40 left-1/5 h-96 w-96 rounded-full border-40 border-white/5" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(242,242,49,0.55),transparent)" }}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:items-center lg:gap-12">
          {/* Copy — left */}
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.16em]"
              style={{ background: "rgba(38,174,144,0.18)", color: "#7fe3cb", border: "1px solid rgba(38,174,144,0.35)" }}
            >
              <FranchiseIcon name="handshake" className="h-3.5 w-3.5" />
              Franchise Opportunity
            </span>

            <h1 className="mt-4 max-w-2xl text-3xl font-extrabold leading-[1.12] tracking-tight text-white md:text-[42px]">
              Build Your Own Financial Service Business with{" "}
              <span style={{ color: "var(--brand-yellow)" }}>Indexia Finance</span>
            </h1>

            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/70 md:text-[15px]">
              Earn among the highest payouts on secured and unsecured loans, investment products and FDI — with
              partner banks and NBFCs behind every case.
            </p>
          </div>

          {/* Actions — right */}
          <div className="flex flex-col gap-3 lg:items-stretch">
            <Button
              size="lg"
              onClick={onApply}
              className="w-full justify-center shadow-lg"
              style={{ background: "var(--brand-yellow)", color: "#0b1730" }}
            >
              Apply to be a Franchisee
            </Button>
            <Link
              to="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/35 px-6 py-3 text-[15px] font-bold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              Talk to Our Team
            </Link>

            <div className="mt-1 space-y-1.5 border-t border-white/15 pt-3 text-[12px] text-white/55">
              <p className="flex items-start gap-1.5">
                <FranchiseIcon name="lock" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/45" />
                <span>
                  Already a Franchisee?{" "}
                  {franchiseeLoginEnabled ? (
                    <Link
                      to="/franchise-login"
                      className="font-bold text-(--brand-yellow) underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-white/40"
                    >
                      Sign in
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      title="Sign in to access the Franchisee portal"
                      className="cursor-not-allowed font-bold text-white/45"
                    >
                      Sign in first to reach your dashboard
                    </span>
                  )}
                </span>
              </p>
              <p className="flex items-start gap-1.5">
                <FranchiseIcon name="search" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/45" />
                <span>
                  Waiting for approval?{" "}
                  <Link
                    to="/franchise-application-status"
                    className="font-bold text-(--brand-yellow) underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-white/40"
                  >
                    Check status
                  </Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FranchiseHero;
