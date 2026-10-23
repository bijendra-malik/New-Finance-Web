import FranchiseStatusChip from "./FranchiseStatusChip";
import { formatDate, fullNameInitials } from "./franchiseFormat";
import type { FranchiseAccount } from "../../../api/franchise";
import type { FranchiseSession } from "../../../utils/franchiseSession";

interface ProfilePanelProps {
  profile: FranchiseAccount | null;
  session: FranchiseSession;
}

const Detail = ({ label, value, breakAll = false }: { label: string; value?: string; breakAll?: boolean }) => (
  <div className="min-w-0">
    <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</dt>
    <dd className={`mt-0.5 text-[13px] font-semibold text-slate-700 ${breakAll ? "break-all" : "wrap-break-word"}`}>
      {value?.trim() || "—"}
    </dd>
  </div>
);

const locationLabel = (profile: FranchiseAccount | null): string | undefined => {
  const cityState = [profile?.city, profile?.state].filter(Boolean).join(", ");
  const location = [cityState, profile?.pincode].filter(Boolean).join(" — ");
  return location || undefined;
};

/**
 * My Details section: the franchisee's own profile and the key facts of the
 * franchise account. The live profile wins; the stored session covers the
 * fields the service has not reported yet.
 */
const ProfilePanel = ({ profile, session }: ProfilePanelProps) => {
  const name = profile?.name?.trim() || session.name?.trim() || "Franchise partner";
  const email = profile?.email ?? session.email;
  const mobile = profile?.mobile ?? session.mobile;
  const franchiseId = profile?.franchiseId ?? session.franchiseId;
  const agreementStatus = profile?.franchiseStatus ?? session.franchiseStatus;
  const country = [profile?.country ?? session.country, profile?.continent ?? session.continent]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white" aria-labelledby="profile-personal-heading">
      <div
        className="flex flex-wrap items-center gap-4 px-5 py-4"
        style={{ background: "linear-gradient(120deg,rgba(6,106,156,0.07),rgba(38,174,144,0.1))" }}
      >
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-extrabold"
          style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-yellow))", color: "var(--brand-navy-deep)" }}
          aria-hidden="true"
        >
          {fullNameInitials(name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Franchisee</p>
          <h2 id="profile-personal-heading" className="mt-0.5 truncate text-lg font-extrabold text-slate-800">
            {name}
          </h2>
          <p className="mt-0.5 text-[12px] font-semibold text-slate-500">ID {franchiseId}</p>
        </div>
        <FranchiseStatusChip status={agreementStatus} size="md" />
      </div>

      <div className="px-5 py-4">
        <h3 className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Personal details</h3>
        <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <Detail label="Mobile" value={mobile} />
          <Detail label="Email" value={email} breakAll />
          <Detail label="Date of birth" value={formatDate(profile?.dob)} />
          <Detail label="PAN" value={profile?.panNumber} />
          <Detail label="Location" value={locationLabel(profile)} />
          <Detail label="Country" value={country} />
        </dl>
      </div>

      <div className="border-t border-slate-100 px-5 py-4">
        <h3 className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Franchise account</h3>
        <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
          <Detail label="Plan" value={profile?.plan?.name ?? profile?.package} />
          <Detail label="Agreement approved" value={formatDate(profile?.franchiseApprovedAt)} />
          <Detail label="Last login" value={formatDate(profile?.lastLogin)} />
        </dl>
      </div>
    </section>
  );
};

export default ProfilePanel;
