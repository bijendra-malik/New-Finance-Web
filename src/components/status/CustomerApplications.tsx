import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { CustomerStatusApplication, CustomerStatusResponse } from "../../api/statusTracking";
import { formatTimestamp } from "../../utils/formatters";
import { resolveDashboardPath } from "../modals/applicationModalRoutes";
import Button from "../ui/Button";
import { applicationDetailGroups, applicationProgress } from "./applicationDetails";
import { formatInr, statusTone, titleCase } from "./statusFormat";

const submittedAtOf = (app: CustomerStatusApplication): string | undefined =>
  app.submittedAt ?? app.createdAt ?? undefined;

const applicationNumber = (app: CustomerStatusApplication): string | undefined =>
  app.applicationNo?.trim() || app.applicationNumber?.trim() || undefined;

const applicationName = (app: CustomerStatusApplication): string =>
  app.loanType?.trim() || app.productName?.trim() || titleCase(app.product) || "Loan application";

/** The stages this application moves through, with the ones already passed marked. */
const StageTrack = ({ app }: { app: CustomerStatusApplication }) => {
  const { stages, reached, rejected } = applicationProgress(app);
  return (
    <ol className="mt-4 flex items-center" aria-label={`Stage: ${app.stage ?? app.status ?? "unknown"}`}>
      {stages.map((label, index) => {
        const passed = rejected ? index === 0 : index < reached;
        const current = !rejected && index === reached;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
              style={
                passed || current
                  ? { background: "var(--brand-teal)", color: "#fff" }
                  : { background: "#f1f5f9", color: "#94a3b8" }
              }
              aria-current={current ? "step" : undefined}
            >
              {passed ? "✓" : index + 1}
            </span>
            <span
              className={`text-[11.5px] font-semibold whitespace-nowrap ${passed || current ? "text-slate-700" : "text-slate-400"}`}
            >
              {label}
            </span>
            {index < stages.length - 1 && (
              <span
                className="mx-1 hidden h-px flex-1 sm:block"
                style={{ background: passed && !rejected ? "var(--brand-teal)" : "#e2e8f0" }}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};

/** Every status update the feed recorded, with the moment it happened. */
const Timeline = ({ app }: { app: CustomerStatusApplication }) => {
  const entries = app.timeline ?? [];
  if (entries.length === 0) return null;
  return (
    <ul className="mt-3 space-y-1.5">
      {entries.map((entry, index) => (
        <li key={`${entry.step ?? "update"}-${index}`} className="flex flex-wrap items-baseline gap-x-2 text-[12px]">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--brand-teal)" }} aria-hidden="true" />
          <span className="font-semibold text-slate-700">{entry.step ?? "Update"}</span>
          {formatTimestamp(entry.at) && <span className="text-slate-400">{formatTimestamp(entry.at)}</span>}
        </li>
      ))}
    </ul>
  );
};

const StatusApplicationCard = ({
  app,
  defaultOpen,
}: {
  app: CustomerStatusApplication;
  defaultOpen: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const groups = useMemo(() => applicationDetailGroups(app), [app]);
  const tone = statusTone(app.status);
  const amount = formatInr(app.loanAmount);
  const submitted = formatTimestamp(submittedAtOf(app));
  const decided = formatTimestamp(app.decisionAt);
  const number = applicationNumber(app);
  const dashboardPath = resolveDashboardPath(app.product ?? "");
  const detailCount = groups.reduce((total, group) => total + group.rows.length, 0);
  const panelId = `application-details-${number ?? app._id ?? "unknown"}`;

  return (
    <article
      className="overflow-hidden rounded-2xl bg-white"
      style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 14px rgba(6,106,156,0.06)" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
        <div className="min-w-0">
          <h3 className="text-[15px] font-extrabold text-slate-800">{applicationName(app)}</h3>
          <p className="mt-0.5 text-[11.5px] text-slate-400">
            {number && <>Application {number}</>}
            {number && app.franchiseCode && " · "}
            {app.franchiseCode && <>Filed via {app.franchiseCode}</>}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${tone.className}`}>{tone.label}</span>
      </div>

      <div className="px-5 pb-5">
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate-500">
          {amount && (
            <span>
              Amount · <strong className="font-semibold text-slate-700">{amount}</strong>
            </span>
          )}
          {submitted && (
            <span>
              Submitted · <strong className="font-semibold text-slate-700">{submitted}</strong>
            </span>
          )}
          {decided && (
            <span>
              Decision · <strong className="font-semibold text-slate-700">{decided}</strong>
            </span>
          )}
        </p>

        <StageTrack app={app} />
        <Timeline app={app} />

        {app.adminNote?.trim() && (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[12px] leading-5 text-amber-900">
            <strong className="font-bold">Note from our team:</strong> {app.adminNote.trim()}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen((previous) => !previous)}
            aria-expanded={open}
            aria-controls={panelId}
            className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-[12.5px] font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
          >
            {open ? "Hide application details" : `View application details${detailCount ? ` (${detailCount})` : ""}`}
          </button>
          {dashboardPath && (
            <Link
              to={dashboardPath}
              className="rounded-xl border border-slate-200 px-4 py-2 text-[12.5px] font-semibold text-(--brand-navy) transition hover:bg-slate-50"
            >
              Open {applicationName(app)} dashboard
            </Link>
          )}
        </div>

        {open && (
          <div id={panelId} className="mt-4 space-y-5 border-t border-slate-100 pt-4">
            {groups.length === 0 ? (
              <p className="text-[12px] text-slate-400">
                No further details were captured for this application.
              </p>
            ) : (
              groups.map((group) => (
                <div key={group.title}>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400">{group.title}</p>
                  <dl className="mt-2 grid gap-x-8 sm:grid-cols-2">
                    {group.rows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-start justify-between gap-6 border-b py-1.5 last:border-0"
                        style={{ borderColor: "#f1f5f9" }}
                      >
                        <dt className="shrink-0 pt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          {row.label}
                        </dt>
                        <dd className="min-w-0 text-right text-[13px] font-bold text-slate-700 wrap-anywhere">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </article>
  );
};

/**
 * Every application the status feed returned, verified by OTP, newest first.
 * The newest application opens expanded so the details are visible immediately.
 */
const CustomerApplications = ({
  result,
  onCheckAgain,
}: {
  result: CustomerStatusResponse;
  onCheckAgain: () => void;
}) => {
  const applications = useMemo(() => {
    const rows = result.applications ?? result.loans ?? [];
    return [...rows].sort(
      (a, b) => Date.parse(submittedAtOf(b) ?? "") - Date.parse(submittedAtOf(a) ?? ""),
    );
  }, [result]);

  const customer = result.customer;
  const counts = Object.entries(result.byStatus ?? {}).filter(([, value]) => value > 0);
  const firstApplied = formatTimestamp(result.appliedAt);
  const lastUpdated = formatTimestamp(result.updatedAt);

  return (
    <section aria-live="polite" className="space-y-5">
      <div className="rounded-2xl border border-(--brand-teal)/25 bg-(--brand-teal)/5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Verified customer</p>
            <h2 className="mt-1 text-xl font-extrabold text-(--brand-navy)">
              {customer?.name?.trim() || "Your applications"}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {customer?.customerId && (
              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-600 ring-1 ring-slate-200">
                {customer.customerId}
              </span>
            )}
            {customer?.mobileMasked && (
              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-600 ring-1 ring-slate-200">
                +91 {customer.mobileMasked}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-white/80 px-4 py-3 ring-1 ring-slate-200/80">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Applications found</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {applications.length === 0
                ? "Nothing filed under this customer ID yet"
                : `Filed under customer ID ${customer?.customerId ?? "—"}`}
            </p>
          </div>
          <span
            className="text-2xl font-extrabold leading-none text-(--brand-navy)"
            aria-label={`${applications.length} application${applications.length === 1 ? "" : "s"} found`}
          >
            {applications.length}
          </span>
        </div>

        {counts.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {counts.map(([label, value]) => (
              <span key={label} className={`rounded-full px-3 py-1 text-[11px] font-bold ${statusTone(label).className}`}>
                {label} · {value}
              </span>
            ))}
          </div>
        )}

        {(firstApplied || lastUpdated) && (
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate-500">
            {firstApplied && (
              <span>
                First applied · <strong className="font-semibold text-slate-700">{firstApplied}</strong>
              </span>
            )}
            {lastUpdated && (
              <span>
                Last updated · <strong className="font-semibold text-slate-700">{lastUpdated}</strong>
              </span>
            )}
          </p>
        )}
      </div>

      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app, index) => (
            <StatusApplicationCard
              key={app.applicationNo ?? app._id ?? `${app.product}-${index}`}
              app={app}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-5">
          <p className="text-sm font-bold text-amber-900">No applications found</p>
          <p className="mt-1 text-sm leading-6 text-amber-800">
            Nothing has been filed under this customer ID yet. Apply for a loan first — it appears
            here as soon as it is submitted.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button variant="outline" size="md" onClick={onCheckAgain}>
          Check again
        </Button>
        <Link to="/" className="text-[12.5px] font-semibold text-(--brand-navy) hover:underline">
          Apply for another loan →
        </Link>
      </div>
    </section>
  );
};

export default CustomerApplications;
