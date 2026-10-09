import Modal from "../ui/Modal";
import FranchiseForm from "./FranchiseForm";
import RecipientContact from "./RecipientContact";
import { FRANCHISE_EMAIL } from "./franchiseData";
import FranchiseIcon from "./FranchiseIcon";

/** Modal wrapper around the franchisor variant of the shared franchise form. */
const FranchisorFormModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <Modal open={open} onClose={onClose} labelledBy="franchisor-modal-title" maxWidth="max-w-2xl">
    {/* Header */}
    <div className="relative shrink-0 overflow-hidden px-6 py-5" style={{ background: "linear-gradient(130deg,#0b1730 0%,#1b6ca8 100%)" }}>
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
            <h2 id="franchisor-modal-title" className="text-lg font-extrabold text-white">
              Become a Franchisor
            </h2>
            <p className="mt-0.5 max-w-sm text-[12.5px] leading-relaxed text-white/70">
              Share your details and our team will review them and get in touch with you.
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
      <FranchiseForm variant="franchisor" />
      <RecipientContact
        heading="Where your enquiry goes"
        children={<>Prefer email? Write to <a href={`mailto:${FRANCHISE_EMAIL}`} className="font-semibold text-(--brand-navy) hover:underline">{FRANCHISE_EMAIL}</a>.</>}
      />
    </div>
  </Modal>
);

export default FranchisorFormModal;
