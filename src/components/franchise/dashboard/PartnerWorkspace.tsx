import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../ui/Button";
import FranchiseIcon from "../FranchiseIcon";
import type {
  FranchiseIconName,
} from "../FranchiseIcon";
import type { FranchiseAccount } from "../../../api/franchise";
import type { FranchiseSession } from "../../../utils/franchiseSession";
import { formatTimestamp } from "../../../utils/formatters";
import {
  INDEXIA_SHARE,
  LEAD_STAGE_TONES,
  PARTNER_SHARE,
  SAMPLE_LEADS,
  SAMPLE_NOTICE,
  SAMPLE_PAYOUTS,
  inr,
  inrCompact,
  summariseLeads,
  summarisePayouts,
} from "./partnerData";
import type { LeadStage } from "./partnerData";

/** The agreement tone the page derives from the franchise status. */
export interface PartnerStatusTone {
  label: string;
  blurb: string;
  bg: string;
  border: string;
  text: string;
}

interface PartnerWorkspaceProps {
  session: FranchiseSession;
  profile: FranchiseAccount | null | undefined;
  status: PartnerStatusTone;
  loading: boolean;
  onRefresh: () => void | Promise<void>;
}

type PanelId = "overview" | "leads" | "payouts" | "business" | "support";

const PANELS: { id: PanelId; label: string; icon: FranchiseIconName; blurb: string }[] = [
  { id: "overview", label: "Overview", icon: "process", blurb: "Pipeline and payout snapshot" },
  { id: "leads", label: "Leads", icon: "lead", blurb: "Cases you have submitted" },
  { id: "payouts", label: "Payouts", icon: "rupee", blurb: "Statements and the payout split" },
  { id: "business", label: "Business profile", icon: "user", blurb: "Registered franchise details" },
  { id: "support", label: "Support", icon: "support", blurb: "Reach the franchise desk" },
];

/** Small amber strip that keeps the sample tables honest. */
const SampleNotice = () => (
  <p
    role="note"
    className="mb-4 flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-[12px] leading-relaxed"
    style={{ background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e" }}
  >
    <FranchiseIcon name="shield" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
    {SAMPLE_NOTICE}
  </p>
);

const StageChip = ({ stage }: { stage: LeadStage }) => {
  const tone = LEAD_STAGE_TONES[stage];
  return (
    <span
      className="inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{ background: tone.bg, border: `1px solid ${tone.border}`, color: tone.text }}
    >
      {stage}
    </span>
  );
};

const Tile = ({
  label,
  value,
  hint,
  icon,
  live = false,
}: {
  label: string;
  value: string;
  hint: string;
  icon: FranchiseIconName;
  live?: boolean;
}) => (
  <div
    className="rounded-2xl bg-white p-5"
    style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 14px rgba(6,106,156,0.06)" }}
  >
    <div className="flex items-start justify-between gap-3">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ background: "var(--brand-navy-14)", color: "var(--brand-navy)" }}
      >
        <FranchiseIcon name={icon} className="h-5 w-5" />
      </span>
      {!live && (
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          style={{ background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e" }}
        >
          Sample
        </span>
      )}
    </div>
    <p className="mt-3.5 text-2xl font-extrabold leading-none text-slate-800">{value}</p>
    <p className="mt-1.5 text-[12.5px] font-semibold text-slate-500">{label}</p>
    <p className="mt-1 text-[11.5px] leading-relaxed text-slate-400">{hint}</p>
  </div>
);

const Card = ({
  title,
  icon,
  aside,
  children,
}: {
  title: string;
  icon: FranchiseIconName;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section
    className="rounded-2xl bg-white p-6"
    style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 14px rgba(6,106,156,0.06)" }}
  >
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-[15px] font-extrabold text-slate-800">
        <span style={{ color: "var(--brand-teal)" }}>
          <FranchiseIcon name={icon} className="h-4.5 w-4.5" />
        </span>
        {title}
      </h2>
      {aside}
    </div>
    {children}
  </section>
);

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div className="min-w-0">
    <dt className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
    <dd className="mt-0.5 truncate text-[13.5px] font-semibold text-slate-700">{value?.trim() || "—"}</dd>
  </div>
);

/** One lead table, reused by the overview (top rows) and the leads panel (all rows). */
const LeadTable = ({ rows }: { rows: typeof SAMPLE_LEADS }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-160 border-collapse text-left">
      <thead>
        <tr className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
          <th className="pb-2 pr-4 font-bold">Lead</th>
          <th className="pb-2 pr-4 font-bold">Product</th>
          <th className="pb-2 pr-4 font-bold">Amount</th>
          <th className="pb-2 pr-4 font-bold">Stage</th>
          <th className="pb-2 pr-4 font-bold">Lender</th>
          <th className="pb-2 font-bold">Submitted</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((lead) => (
          <tr key={lead.id} className="border-t border-slate-100 text-[12.5px] text-slate-600">
            <td className="py-2.5 pr-4">
              <span className="block font-bold text-slate-800">{lead.customer}</span>
              <span className="text-[11px] text-slate-400">{lead.id}</span>
            </td>
            <td className="py-2.5 pr-4">{lead.product}</td>
            <td className="py-2.5 pr-4 font-semibold text-slate-700">{inr(lead.amount)}</td>
            <td className="py-2.5 pr-4">
              <StageChip stage={lead.stage} />
            </td>
            <td className="py-2.5 pr-4">{lead.lender}</td>
            <td className="py-2.5 whitespace-nowrap">{lead.submittedOn}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * The franchise partner workspace.
 *
 * Identity, agreement status and the business profile come from the live session
 * and GET /auth/franchise/profile. Leads and payout statements are sample rows
 * (see partnerData.ts) because the franchise service does not publish them yet —
 * each of those panels says so explicitly.
 */
const PartnerWorkspace = ({ session, profile, status, loading, onRefresh }: PartnerWorkspaceProps) => {
  const [panel, setPanel] = useState<PanelId>("overview");
  const [stageFilter, setStageFilter] = useState<LeadStage | "All">("All");

  const leadTotals = useMemo(() => summariseLeads(SAMPLE_LEADS), []);
  const payoutTotals = useMemo(() => summarisePayouts(SAMPLE_PAYOUTS), []);
  const visibleLeads = useMemo(
    () => (stageFilter === "All" ? SAMPLE_LEADS : SAMPLE_LEADS.filter((l) => l.stage === stageFilter)),
    [stageFilter],
  );

  const name = profile?.name ?? session.name;
  const region = [profile?.country ?? session.country, profile?.continent ?? session.continent]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[248px_1fr]">
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <nav aria-label="Dashboard sections" className="lg:sticky lg:top-24 lg:self-start">
        <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pb-0">
          {PANELS.map((item) => {
            const isActive = item.id === panel;
            return (
              <li key={item.id} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => setPanel(item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left whitespace-nowrap transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
                  style={
                    isActive
                      ? {
                          background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))",
                          color: "#fff",
                          boxShadow: "0 8px 20px -14px rgba(6,106,156,0.9)",
                        }
                      : { background: "#fff", border: "1px solid rgba(6,106,156,0.12)", color: "#475569" }
                  }
                >
                  <FranchiseIcon name={item.icon} className="h-4.5 w-4.5 shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-[13px] font-bold">{item.label}</span>
                    <span
                      className="mt-0.5 hidden text-[11px] lg:block"
                      style={{ color: isActive ? "rgba(255,255,255,0.7)" : "#94a3b8" }}
                    >
                      {item.blurb}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div
          className="mt-5 hidden rounded-2xl p-4 lg:block"
          style={{ background: "var(--brand-navy-14)" }}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-(--brand-navy)">Partner share</p>
          <p className="mt-1 text-2xl font-extrabold text-(--brand-navy)">{PARTNER_SHARE}%</p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">
            of every eligible payout, with {INDEXIA_SHARE}% retained by Indexia.
          </p>
        </div>
      </nav>

      {/* ── Panels ──────────────────────────────────────────────────────────── */}
      <div className="min-w-0">
        {panel === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Tile label="Leads submitted" value={String(leadTotals.total)} hint="Across all products" icon="lead" />
              <Tile label="In progress" value={String(leadTotals.inProgress)} hint="Submitted or under review" icon="clock" />
              <Tile label="Disbursed cases" value={String(leadTotals.disbursed)} hint="Eligible for a payout" icon="check" />
              <Tile
                label="Partner share to date"
                value={inrCompact(payoutTotals.partnerShare)}
                hint={`${payoutTotals.cases} cases settled`}
                icon="rupee"
              />
            </div>

            <Card
              title="Your agreement"
              icon="shield"
              aside={
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-bold"
                  style={{ background: status.bg, border: `1px solid ${status.border}`, color: status.text }}
                >
                  {status.label}
                </span>
              }
            >
              <p className="text-[13px] leading-relaxed text-slate-600">{status.blurb}</p>
              <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4">
                <Field label="Franchisee ID" value={session.franchiseId} />
                <Field label="Partner name" value={name} />
                <Field label="Region" value={region} />
                <Field label="Verified" value={profile?.isVerified ? "Yes" : "Pending"} />
              </dl>
            </Card>

            <Card title="Latest leads" icon="lead" aside={<Link to="#" onClick={(e) => { e.preventDefault(); setPanel("leads"); }} className="text-[12px] font-bold text-(--brand-navy) hover:underline">View all</Link>}>
              <SampleNotice />
              <LeadTable rows={visibleLeads.slice(0, 5)} />
            </Card>
          </div>
        )}

        {panel === "leads" && (
          <div className="space-y-6">
            <Card
              title="Customer leads"
              icon="lead"
              aside={
                <span className="text-[12px] font-semibold text-slate-500">
                  {visibleLeads.length} of {SAMPLE_LEADS.length}
                </span>
              }
            >
              <SampleNotice />
              <div className="mb-4 flex flex-wrap gap-2">
                {(["All", "New", "Submitted", "In review", "Approved", "Disbursed", "Rejected"] as const).map((stage) => {
                  const isActive = stageFilter === stage;
                  return (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => setStageFilter(stage)}
                      aria-pressed={isActive}
                      className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
                      style={
                        isActive
                          ? { background: "var(--brand-teal)", color: "#fff" }
                          : { background: "#f1f5f9", color: "#475569" }
                      }
                    >
                      {stage}
                    </button>
                  );
                })}
              </div>
              <LeadTable rows={visibleLeads} />
              {visibleLeads.length === 0 && (
                <p className="py-6 text-center text-[13px] text-slate-500">No leads in this stage.</p>
              )}
            </Card>

            <Card title="Submit a lead" icon="doc">
              <p className="text-[13px] leading-relaxed text-slate-600">
                Lead capture from the portal is not live yet. Until it is, send cases to the franchise desk with the
                customer's name, contact number, product and requested amount, and the team will register and track
                them for you.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/requireddocument"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-[12.5px] font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Required documents
                </Link>
                <Link
                  to="/contact"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-[12.5px] font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Contact the franchise team
                </Link>
              </div>
            </Card>
          </div>
        )}

        {panel === "payouts" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Tile label="Cases settled" value={String(payoutTotals.cases)} hint="Over the last four periods" icon="process" />
              <Tile label="Last paid" value={inr(payoutTotals.lastPaid)} hint="Most recent settled statement" icon="rupee" />
              <Tile
                label="Requested value"
                value={inrCompact(leadTotals.requestedValue)}
                hint="Total amount across all leads"
                icon="scale"
              />
            </div>

            <Card title="Payout split" icon="share">
              <div className="flex flex-wrap items-center gap-6 rounded-xl px-5 py-4" style={{ background: "var(--form-subtle-bg)" }}>
                <div className="text-center">
                  <p className="text-xl font-extrabold text-(--brand-navy)">{PARTNER_SHARE}%</p>
                  <p className="text-[11px] font-semibold text-slate-500">Your share</p>
                </div>
                <span className="h-9 w-px" style={{ background: "var(--form-field-border-strong)" }} aria-hidden="true" />
                <div className="text-center">
                  <p className="text-xl font-extrabold text-(--brand-navy)">{INDEXIA_SHARE}%</p>
                  <p className="text-[11px] font-semibold text-slate-500">Indexia share</p>
                </div>
                <p className="max-w-md text-[11.5px] leading-relaxed text-slate-500">
                  Payout rates are set by the lender and the product. Your share applies to eligible payouts on
                  successful disbursement, subject to lender and regulatory terms.
                </p>
              </div>
            </Card>

            <Card title="Payout statements" icon="rupee">
              <SampleNotice />
              <div className="overflow-x-auto">
                <table className="w-full min-w-160 border-collapse text-left">
                  <thead>
                    <tr className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="pb-2 pr-4 font-bold">Statement</th>
                      <th className="pb-2 pr-4 font-bold">Period</th>
                      <th className="pb-2 pr-4 font-bold">Cases</th>
                      <th className="pb-2 pr-4 font-bold">Gross payout</th>
                      <th className="pb-2 pr-4 font-bold">Your share</th>
                      <th className="pb-2 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_PAYOUTS.map((row) => (
                      <tr key={row.id} className="border-t border-slate-100 text-[12.5px] text-slate-600">
                        <td className="py-2.5 pr-4 font-bold text-slate-800">{row.id}</td>
                        <td className="py-2.5 pr-4">{row.period}</td>
                        <td className="py-2.5 pr-4">{row.cases}</td>
                        <td className="py-2.5 pr-4">{inr(row.grossPayout)}</td>
                        <td className="py-2.5 pr-4 font-semibold text-slate-700">{inr(row.partnerShare)}</td>
                        <td className="py-2.5">
                          <span
                            className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                            style={
                              row.status === "Paid"
                                ? { background: "#e6f7ee", border: "1px solid #b6e4c9", color: "#0b7a3f" }
                                : row.status === "Processing"
                                  ? { background: "#e8f1fb", border: "1px solid #c6dcf4", color: "#1b6ca8" }
                                  : { background: "#f1f5f9", border: "1px solid #d7dee8", color: "#475569" }
                            }
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {panel === "business" && (
          <div className="space-y-6">
            <Card
              title="Registered franchise details"
              icon="user"
              aside={
                <Button variant="outline" size="sm" onClick={() => void onRefresh()} loading={loading}>
                  Refresh
                </Button>
              }
            >
              <dl className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Franchisee ID" value={profile?.franchiseId ?? session.franchiseId} />
                <Field label="Partner name" value={name} />
                <Field label="Role" value={profile?.role ?? "Franchise"} />
                <Field label="Status" value={profile?.franchiseStatus ?? status.label} />
                <Field
                  label="Account active"
                  value={profile?.isActive === true ? "Yes" : profile?.isActive === false ? "No" : undefined}
                />
                <Field
                  label="Verified"
                  value={profile?.isVerified === true ? "Yes" : profile?.isVerified === false ? "No" : undefined}
                />
                <Field label="Registered mobile" value={profile?.mobile ?? session.mobile} />
                <Field label="Registered email" value={profile?.email ?? session.email} />
                <Field label="PAN" value={profile?.panNumber} />
                <Field label="Package" value={profile?.package} />
                <Field label="City" value={profile?.city} />
                <Field label="State" value={profile?.state} />
                <Field label="Pincode" value={profile?.pincode} />
                <Field label="Region" value={region} />
                <Field label="Registered on" value={formatTimestamp(profile?.createdAt)} />
                <Field label="Last login" value={formatTimestamp(profile?.lastLogin)} />
              </dl>

              {profile?.businessDetails && (
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-(--brand-navy)">
                    Business details
                  </p>
                  <dl className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Field label="Business name" value={profile.businessDetails.businessName} />
                    <Field label="Business type" value={profile.businessDetails.businessType} />
                    <Field label="GST number" value={profile.businessDetails.gstNumber} />
                    <Field label="Address" value={profile.businessDetails.address} />
                    <Field label="Years in business" value={profile.businessDetails.yearsInBusiness} />
                  </dl>
                </div>
              )}

              <p className="mt-5 text-[11.5px] leading-relaxed text-slate-500">
                These fields come from your live franchise profile. To change any of them, write to the franchise desk
                with your franchisee ID.
              </p>
            </Card>

            <Card title="Plan and agreement" icon="plans">
              <p className="text-[13px] leading-relaxed text-slate-600">
                Your plan tenure, renewal date and the signed agreement copy are issued with your franchise agreement.
                The portal does not publish them yet — the franchise team can re-send them on request.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl px-4 py-3.5" style={{ background: "var(--brand-navy-14)" }}>
                  <p className="text-[12px] font-bold text-(--brand-navy)">Agreement status</p>
                  <p className="mt-1 text-[12.5px] text-slate-600">{status.label}</p>
                </div>
                <div className="rounded-xl px-4 py-3.5" style={{ background: "var(--brand-navy-14)" }}>
                  <p className="text-[12px] font-bold text-(--brand-navy)">Payout share</p>
                  <p className="mt-1 text-[12.5px] text-slate-600">
                    {PARTNER_SHARE}% partner / {INDEXIA_SHARE}% Indexia
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {panel === "support" && (
          <div className="space-y-6">
            <Card title="Franchise desk" icon="support">
              <p className="text-[13px] leading-relaxed text-slate-600">
                Quote your franchisee ID <span className="font-bold text-slate-700">{session.franchiseId}</span> so the
                team can pull up your record straight away.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12.5px] font-bold text-white transition-all focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33) focus:ring-offset-1"
                  style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))" }}
                >
                  <FranchiseIcon name="mail" className="h-4 w-4" />
                  Contact the franchise team
                </Link>
                <Link
                  to="/franchise"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-[12.5px] font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <FranchiseIcon name="opportunity" className="h-4 w-4" />
                  Franchise opportunity page
                </Link>
              </div>
            </Card>

            <Card title="Working with the portal" icon="digital">
              <ul className="space-y-3 text-[12.5px] leading-relaxed text-slate-600">
                <li className="flex gap-2.5">
                  <FranchiseIcon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-(--brand-teal)" strokeWidth={2.6} />
                  Profile details refresh from the franchise service every time you open or refresh this dashboard.
                </li>
                <li className="flex gap-2.5">
                  <FranchiseIcon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-(--brand-teal)" strokeWidth={2.6} />
                  Leads and payout statements are not published by the service yet, so those screens are labelled as
                  sample data.
                </li>
                <li className="flex gap-2.5">
                  <FranchiseIcon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-(--brand-teal)" strokeWidth={2.6} />
                  Signing out here ends only your franchise session; a customer login on this device is untouched.
                </li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerWorkspace;
