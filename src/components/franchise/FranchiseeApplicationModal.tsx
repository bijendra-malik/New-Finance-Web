import Modal from "../ui/Modal";
import FranchiseForm from "./FranchiseForm";
import FranchiseIcon from "./FranchiseIcon";
import useMediaQuery from "../../hooks/useMediaQuery";

interface FranchiseeApplicationModalProps {
  open: boolean;
  onClose: () => void;
  /** Currently selected plan — kept on the page so a plan card can pre-select it. */
  packageId: string | null;
  onPackageChange: (planId: string) => void;
}

const FranchiseeApplicationModal = ({
  open,
  onClose,
  packageId,
  onPackageChange,
}: FranchiseeApplicationModalProps) => {
  const isWide = useMediaQuery("(min-width: 1024px)");

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="franchisee-application-title"
      maxWidth="max-w-4xl"
    >
      {/* Header */}
      <div
        className="relative shrink-0 overflow-hidden px-6 py-3.5"
        style={{ background: "linear-gradient(130deg,#0b1730 0%,#1b6ca8 100%)" }}
      >
        <div className="h-1 absolute inset-x-0 top-0" style={{ background: "var(--brand-teal)" }} />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ background: "rgba(255,255,255,0.14)", color: "var(--brand-yellow)" }}
            >
              <FranchiseIcon name="handshake" className="h-5.5 w-5.5" />
            </span>
            <div>
              <h2 id="franchisee-application-title" className="text-lg font-extrabold text-white">
                Franchisee Application
              </h2>
              <p className="mt-0.5 max-w-2xl text-[12.5px] leading-relaxed text-white/70">
                Share your details as they appear on official documents and pick a package duration.
                Fields marked * are required.
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
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
        <FranchiseForm
          variant="franchisee"
          presentation={isWide ? "horizontal" : "stepped"}
          packageId={packageId ?? undefined}
          onPackageChange={onPackageChange}
        />
      </div>
    </Modal>
  );
};

export default FranchiseeApplicationModal;
