import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useMyApplications } from "../../hooks/useMyApplications";
import { formatTimestamp } from "../../utils/formatters";

/**
 * Compact "My Applications" indicator for the header, shown to signed-in
 * customers once at least one application exists. The badge counts every
 * application; the caption names the most recent one's status and date.
 */
const ApplicationsChip = () => {
  const { user } = useAuth();
  const isCustomer = user?.role?.trim().toLowerCase() === "customer";
  const { applications, loading } = useMyApplications(isCustomer);

  if (!isCustomer || loading || applications.length === 0) return null;

  const latest = applications[0];

  return (
    <Link
      to="/applications"
      aria-label={`My applications: ${applications.length} submitted, latest is ${latest.productName} (${latest.status})`}
      className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-2.5 py-1.5 transition-all duration-200 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1"
      title="Track your loan applications"
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-left leading-tight">
        <span className="block text-[11px] font-bold text-slate-700">
          {applications.length} {applications.length === 1 ? "Application" : "Applications"}
        </span>
        <span className="block text-[10px] text-slate-500">
          {latest.productName} · {latest.status}
        </span>
      </span>
      <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
        {formatTimestamp(latest.createdAt)?.split(",")[0] ?? ""}
      </span>
    </Link>
  );
};

export default ApplicationsChip;
