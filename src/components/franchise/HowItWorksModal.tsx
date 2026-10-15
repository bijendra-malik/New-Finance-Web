import Modal from "../ui/Modal";
import FranchiseIcon from "./FranchiseIcon";
import { JOURNEY_STEPS } from "./franchiseData";

interface HowItWorksModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * "How It Works" popup — the franchisee's seven steps from application to
 * payout, told as a numbered list. Content comes from JOURNEY_STEPS so the
 * popup and the on-page section can never drift apart.
 */
const HowItWorksModal = ({ open, onClose }: HowItWorksModalProps) => (
  <Modal open={open} onClose={onClose} labelledBy="how-it-works-title" maxWidth="max-w-3xl">
    {/* Header */}
    <div
      className="relative shrink-0 overflow-hidden px-6 py-5"
      style={{ background: "linear-gradient(130deg,#0b1730 0%,#1b6ca8 100%)" }}
    >
      <div className="h-1 absolute inset-x-0 top-0" style={{ background: "var(--brand-teal)" }} />
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "rgba(255,255,255,0.14)", color: "var(--brand-yellow)" }}
          >
            <FranchiseIcon name="process" className="h-5.5 w-5.5" />
          </span>
          <div>
            <h2 id="how-it-works-title" className="text-lg font-extrabold text-white">
              How It Works
            </h2>
            <p className="mt-0.5 max-w-md text-[12.5px] leading-relaxed text-white/70">
              Seven steps from your franchisee application to the payout.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 cursor-pointer rounded-lg border border-white/25 bg-white/10 p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    {/* Body */}
    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
      <ol className="space-y-3.5">
        {JOURNEY_STEPS.map((step) => (
          <li key={step.id} className="flex items-start gap-4">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[12px] font-extrabold text-white"
              style={{
                background: step.external
                  ? "linear-gradient(135deg,var(--brand-navy),var(--brand-navy-deep))"
                  : "linear-gradient(135deg,#26ae90,var(--brand-navy))",
              }}
            >
              {step.id}
            </span>
            <div className="min-w-0">
              <h3 className="text-[14px] font-bold text-slate-800">{step.title}</h3>
              <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">{step.desc}</p>
              {step.external && (
                <p className="mt-1.5 text-[10.5px] font-bold uppercase tracking-widest text-(--brand-navy)">
                  Outside the franchisee&apos;s control
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  </Modal>
);

export default HowItWorksModal;
