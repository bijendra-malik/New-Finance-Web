import { Link } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import FranchiseIcon from "../components/franchise/FranchiseIcon";
import { useMyApplications } from "../hooks/useMyApplications";
import type { MyApplication } from "../api/myApplications";
import { formatTimestamp } from "../utils/formatters";
import useSEO from "../hooks/useSEO";

// The service's known stages, in order. The reported status is matched
// case-insensitively against these labels; anything unrecognised is shown
// verbatim on the first stage rather than being mapped onto a stage it may
// not mean.
const STAGES = ["Submitted", "In Review", "Approved", "Disbursed"] as const;

const stageOf = (status: string): number => {
  const value = status.trim().toLowerCase();
  if (value.includes("disburse") || value.includes("paid")) return 3;
  if (value.includes("approv")) return 2;
  if (value.includes("review") || value.includes("verif") || value.includes("process")) return 1;
  return 0;
};

const statusChipStyle = (stage: number): React.CSSProperties => {
  switch (stage) {
    case 2:
      return { background: "#e8f1fb", border: "1px solid #c6dcf4", color: "#1b6ca8" };
    case 3:
      return { background: "#e6f7ee", border: "1px solid #b6e4c9", color: "#0b7a3f" };
    default:
      return { background: "#fff8e6", border: "1px solid #fde68a", color: "#92400e" };
  }
};

const money = (amount?: number): string | undefined =>
  amount
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
    : undefined;

const ApplicationCard = ({ app }: { app: MyApplication }) => {
  const stage = stageOf(app.status);

  return (
    <article
      className="rounded-2xl bg-white p-5"
      style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 14px rgba(6,106,156,0.06)" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[15px] font-extrabold text-slate-800">{app.productName}</h2>
          <p className="mt-0.5 text-[11.5px] text-slate-400">
            Application ID {app._id}
          </p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-[11px] font-bold"
          style={statusChipStyle(stage)}
        >
          {app.status}
        </span>
      </div>

      {/* Progress track — the current stage is highlighted from the reported status. */}
      <ol className="mt-5 flex items-center" aria-label={`Progress: ${app.status}`}>
        {STAGES.map((label, index) => {
          const done = index < stage;
          const current = index === stage;
          return (
            <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                style={
                  done || current
                    ? { background: "var(--brand-teal)", color: "#fff" }
                    : { background: "#f1f5f9", color: "#94a3b8" }
                }
                aria-current={current ? "step" : undefined}
              >
                {done ? "✓" : index + 1}
              </span>
              <span
                className={`text-[11.5px] font-semibold whitespace-nowrap ${done || current ? "text-slate-700" : "text-slate-400"}`}
              >
                {label}
              </span>
              {index < STAGES.length - 1 && (
                <span
                  className="mx-1 hidden h-px flex-1 sm:block"
                  style={{ background: index < stage ? "var(--brand-teal)" : "#e2e8f0" }}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-[12px] text-slate-500">
          Submitted on <span className="font-semibold text-slate-700">{formatTimestamp(app.createdAt)}</span>
          {money(app.loanAmount) && (
            <>
              {" · "}Requested <span className="font-semibold text-slate-700">{money(app.loanAmount)}</span>
            </>
          )}
        </p>
        {app.dashboardPath && (
          <Link
            to={app.dashboardPath}
            className="rounded-xl border border-slate-200 px-4 py-2 text-[12.5px] font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Open {app.productName} dashboard
          </Link>
        )}
      </div>
    </article>
  );
};

const MyApplicationsPage = () => {
  useSEO({
    title: "My Applications",
    description:
      "Track every loan application you have submitted with Indexia Finance — status, progress and requested amount in one place.",
    path: "/applications",
  });

  const { applications, loading, error, refresh } = useMyApplications(true);

  const inProgress = applications.filter((app) => stageOf(app.status) < 3).length;

  return (
    <>
      <PageBanner
        breadcrumb="My Applications"
        title="My"
        highlight="Applications"
        tagline="Every loan application you have submitted, with its live status"
      />

      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-12 md:px-8">
          {loading && (
            <div className="flex items-center justify-center gap-3 py-16 text-slate-500">
              <span
                className="h-5 w-5 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)"
                aria-hidden="true"
              />
              <span className="text-sm font-semibold">Loading your applications…</span>
            </div>
          )}

          {!loading && error && (
            <div
              role="status"
              className="rounded-2xl px-5 py-4 text-center"
              style={{ background: "var(--form-error-bg)", border: "1px solid var(--form-error-border)" }}
            >
              <p className="text-[13px] font-bold" style={{ color: "var(--form-error-text)" }}>{error}</p>
              <button
                type="button"
                onClick={() => void refresh()}
                className="mt-3 cursor-pointer rounded-xl border border-slate-300 px-4 py-2 text-[12.5px] font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && applications.length === 0 && (
            <div className="rounded-2xl p-8 text-center" style={{ background: "var(--brand-navy-14)" }}>
              <span
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-white"
                style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))" }}
              >
                <FranchiseIcon name="doc" filled className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-lg font-bold text-slate-800">No applications yet</h2>
              <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-slate-600">
                When you apply for a loan, it shows up here with its status — from submission through review,
                approval and disbursal.
              </p>
              <Link
                to="/"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33) focus:ring-offset-1"
                style={{ background: "linear-gradient(135deg,var(--brand-navy) 0%,var(--brand-dark) 100%)" }}
              >
                Explore loan products
              </Link>
            </div>
          )}

          {!loading && !error && applications.length > 0 && (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] text-slate-600">
                  <span className="font-bold text-slate-800">{applications.length}</span>{" "}
                  {applications.length === 1 ? "application" : "applications"} ·{" "}
                  <span className="font-bold text-slate-800">{inProgress}</span> in progress
                </p>
                <button
                  type="button"
                  onClick={() => void refresh()}
                  className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-[12.5px] font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Refresh status
                </button>
              </div>

              <div className="space-y-4">
                {applications.map((app) => (
                  <ApplicationCard key={`${app.productKey}-${app._id}`} app={app} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MyApplicationsPage;
