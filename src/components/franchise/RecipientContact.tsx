// RecipientContact — the "where your application goes" + "prefer email?" block
// that the franchise pages repeat. One module so FranchiseeApplication,
// FranchisorFormModal and any future franchise section share one contact block.

import FranchiseIcon from "./FranchiseIcon";
import { FRANCHISE_EMAIL } from "./franchiseData";

interface RecipientContactProps {
  /** Heading shown above the email icon + copy. */
  heading: string;
  /** Paragraph copy that can reference the email link. */
  children: React.ReactNode;
  /** Extra bottom note (e.g. the agreement-fee pointer). */
  footnote?: React.ReactNode;
}

export const RecipientContact = ({ heading, children, footnote }: RecipientContactProps) => (
  <div
    className="rounded-2xl p-5"
    style={{ background: "linear-gradient(130deg,#0e1e3c 0%,#1b6ca8 100%)" }}
  >
    <span
      className="flex h-10 w-10 items-center justify-center rounded-xl"
      style={{ background: "rgba(255,255,255,0.14)", color: "var(--brand-yellow)" }}
    >
      <FranchiseIcon name="mail" className="h-5 w-5" />
    </span>
    <h3 className="mt-3.5 text-[13.5px] font-bold text-white">{heading}</h3>
    <div className="mt-1.5 text-[12.5px] leading-relaxed text-white/70">
      {children}
    </div>
    {footnote && <div className="mt-4 border-t border-white/15 pt-3.5 text-[11.5px] text-white/50">{footnote}</div>}
  </div>
);

/** Compact variant for cards/sidebars that only need the email link + short copy. */
export const EmailLink = ({ label = FRANCHISE_EMAIL }: { label?: string; text?: string }) => (
  <a
    href={`mailto:${FRANCHISE_EMAIL}`}
    className="font-semibold text-(--brand-yellow) hover:underline"
  >
    {label}
  </a>
);

export default RecipientContact;
