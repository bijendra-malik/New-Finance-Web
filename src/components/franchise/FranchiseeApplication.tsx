import FranchiseIcon from "./FranchiseIcon";
import SectionShell from "./SectionShell";
import FranchiseForm from "./FranchiseForm";
import RecipientContact from "./RecipientContact";
import { FRANCHISE_EMAIL } from "./franchiseData";

const BEFORE_YOU_APPLY = [
  "PAN-level details — every field must match your PAN card and official documents.",
  "A registered business entity is not mandatory to apply; the application is reviewed individually.",
  "The plan fee and the agreement fee are separate and both are exclusive of GST.",
  "Franchise allotment is confirmed only after agreement and verification are completed.",
];

interface FranchiseeApplicationProps {
  packageId: string | null;
  onPackageChange: (planId: string) => void;
}

/** Section 11 — the franchisee application form. */
const FranchiseeApplication = ({ packageId, onPackageChange }: FranchiseeApplicationProps) => (
  <SectionShell
    id="franchisee-application"
    eyebrow="Franchisee Application"
    title="Become an Indexia Franchisee"
    subtitle="Register or sign in first, then share your business details exactly as they appear on your PAN card and pick the package duration that suits you."
    tone="tint"
  >
    <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-start">
      {/* Before you apply */}
      <aside className="space-y-5">
        <div
          className="rounded-2xl bg-white p-5"
          style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 14px rgba(6,106,156,0.07)" }}
        >
          <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-(--brand-navy)">
            Before you apply
          </h3>
          <ul className="mt-4 space-y-3">
            {BEFORE_YOU_APPLY.map((point) => (
              <li key={point} className="flex gap-2.5 text-[12.5px] leading-relaxed text-slate-600">
                <FranchiseIcon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-(--brand-teal)" strokeWidth={2.8} />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <RecipientContact
          heading="Where your application goes"
          footnote=
            <>The one-time franchisee agreement fee is charged separately from the plan fee you select. It is published in full in <a href="#plans" className="font-semibold text-(--brand-yellow) hover:underline">Plans &amp; fees</a>.</>
        >
          Your application is submitted to our franchise team for review. Once your details are
          verified, you will be issued a <strong>franchise ID and password</strong> to sign in to the
          franchisor dashboard. Prefer email? Write to <a href={`mailto:${FRANCHISE_EMAIL}`} className="font-semibold text-(--brand-yellow) hover:underline">{FRANCHISE_EMAIL}</a>.
        </RecipientContact>
      </aside>

      {/* Form */}
      <div
        className="rounded-3xl bg-white p-6 md:p-8"
        style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 6px 26px rgba(6,106,156,0.1)" }}
      >
        <div className="mb-6 flex items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: "linear-gradient(135deg,#26ae90,var(--brand-navy))" }}
          >
            <FranchiseIcon name="handshake" filled className="h-5.5 w-5.5" />
          </span>
          <div>
            <h3 className="text-[15px] font-extrabold text-slate-800">Franchisee Application</h3>
            <p className="text-[12px] text-slate-500">Fields marked * are required</p>
          </div>
        </div>

        <FranchiseForm variant="franchisee" packageId={packageId ?? undefined} onPackageChange={onPackageChange} />
      </div>
    </div>
  </SectionShell>
);

export default FranchiseeApplication;
