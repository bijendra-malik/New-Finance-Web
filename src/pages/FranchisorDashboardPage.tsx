import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import Button from "../components/ui/Button";
import FranchiseIcon from "../components/franchise/FranchiseIcon";
import { FRANCHISE_EMAIL } from "../components/franchise/franchiseData";
import { fetchFranchiseProfile } from "../api/franchise";
import type { FranchiseProfileResponse } from "../api/franchise";
import useSEO from "../hooks/useSEO";
import {
  clearFranchiseSession,
  mergeFranchiseProfile,
  readFranchiseSession,
  isFranchiseSignedIn,
} from "../utils/franchiseSession";
import type { FranchiseSession } from "../utils/franchiseSession";

// ── Status presentation ──────────────────────────────────────────────────────

type StatusTone = { label: string; blurb: string; bg: string; border: string; text: string };

/**
 * The backend reports the agreement status as a free-form string, so anything
 * unrecognised is shown verbatim rather than silently mapped onto "Active".
 */
const statusTone = (status?: string): StatusTone => {
  switch ((status ?? "").toLowerCase()) {
    case "active":
      return {
        label: "Active",
        blurb: "Your franchise agreement is active. You can submit customer leads.",
        bg: "rgba(38,174,144,0.12)",
        border: "rgba(38,174,144,0.4)",
        text: "#0f766e",
      };
    case "pending":
      return {
        label: "Pending",
        blurb:
          "Your application is with the franchise team for review. Leads and payouts open up once the agreement is activated.",
        bg: "#fff8e6",
        border: "rgba(224,168,0,0.45)",
        text: "#92620a",
      };
    case "approved":
      return {
        label: "Approved",
        blurb:
          "Your franchise agreement is approved. Leads and payouts open up once the franchise team marks the account active.",
        bg: "rgba(38,174,144,0.2)",
        border: "#22bfb3",
        text: "#22bfb3",
      };
    case "suspended":
      return {
        label: "Suspended",
        blurb: "This franchise is currently suspended. Contact the franchise team before submitting further leads.",
        bg: "#fef2f2",
        border: "rgba(239,68,68,0.35)",
        text: "#b91c1c",
      };
    default: {
      const reported = status?.trim();
      return {
        label: reported || "Not reported",
        blurb: reported
          ? "This is the agreement status on your live franchise profile. Contact the franchise desk if it looks out of date."
          : "The agreement status has not been reported by the backend yet.",
        bg: "var(--brand-navy-14)",
        border: "var(--brand-navy-44)",
        text: "var(--brand-navy)",
      };
    }
  }
};

/**
 * The dashboard's left panel points into the franchisor portal, which owns the
 * customer registry and the loan forms — this page stays the partner overview
 * (agreement, profile, payouts).
 */
const PORTAL_SECTIONS: { id: string; label: string; icon: "user-plus" | "layers" | "search" | "pen-line"; desc: string; to: string }[] = [
  {
    id: "register-customer",
    label: "Register customer",
    icon: "user-plus",
    desc: "Add a new client to your franchise",
    to: "/franchise/loan-forms?section=customers",
  },
  {
    id: "all-loans",
    label: "All loans",
    icon: "layers",
    desc: "Every client and their applications",
    to: "/franchise/loan-forms?section=customers",
  },
  {
    id: "check-status",
    label: "Check status",
    icon: "search",
    desc: "Look up one loan's current status",
    to: "/franchise/loan-forms?section=customers",
  },
  {
    id: "apply-loan",
    label: "Apply loan",
    icon: "pen-line",
    desc: "Submit a loan on a customer's behalf",
    to: "/franchise/loan-forms?section=products",
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

const FranchisorDashboardPage = () => {
  useSEO({
    title: "Franchisee Dashboard",
    description:
      "Franchisee dashboard for Indexia Finance franchise partners — agreement status, registered details and payout structure in one place.",
    path: "/franchisor-dashboard",
  });

  const navigate = useNavigate();
  const [session, setSession] = useState<FranchiseSession | null>(() => readFranchiseSession());
  const [hasToken, setHasToken] = useState(isFranchiseSignedIn);
  const [profile, setProfile] = useState<FranchiseProfileResponse["franchise"] | null>(null);
  const [loading, setLoading] = useState(() => Boolean(readFranchiseSession()));
  const [error, setError] = useState<string | null>(null);

  type ProfileResult =
    | { ok: true; account: NonNullable<FranchiseProfileResponse["franchise"]> }
    | { ok: false; message: string };

  const applyProfileResult = useCallback((result: ProfileResult) => {
    if (!result.ok) {
      setProfile(null);
      setError(result.message);

      if (!readFranchiseSession()) {
        setSession(null);
        setHasToken(false);
      }
      return;
    }
    const account = result.account;
    setProfile(account);
    setError(null);
    setSession(
      mergeFranchiseProfile({
        franchiseId: account.franchiseId,
        name: account.name,
        mobile: account.mobile,
        email: account.email,
        franchiseStatus: account.franchiseStatus,
        isVerified: account.isVerified,
        continent: account.continent,
        country: account.country,
      }),
    );
  }, []);

  const readResult = (res: FranchiseProfileResponse): ProfileResult =>
    res.success && res.franchise
      ? { ok: true, account: res.franchise }
      : {
          ok: false,
          message: res.success
            ? "The franchise service returned an empty profile response."
            : "The franchise service reported no record for this session.",
        };

  const UNREACHABLE =
    "Could not reach the franchise service. Your saved details are shown below; live status could not be refreshed.";
  const EXPIRED = "Your franchise session is no longer valid. Sign in again to refresh your details.";

  const sessionId = session?.franchiseId;

  useEffect(() => {
    if (!sessionId || !hasToken) return;
    let active = true;
    (async () => {
      try {
        const res = await fetchFranchiseProfile();
        if (!active) return;
        applyProfileResult(readResult(res));
      } catch (error) {
        if (!active) return;
        const rejected = (error as { response?: unknown })?.response !== undefined;
        applyProfileResult({ ok: false, message: rejected ? EXPIRED : UNREACHABLE });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, hasToken]);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetchFranchiseProfile();
      applyProfileResult(readResult(res));
    } catch (error) {
      const rejected = (error as { response?: unknown })?.response !== undefined;
      applyProfileResult({ ok: false, message: rejected ? EXPIRED : UNREACHABLE });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    clearFranchiseSession();
    setSession(null);
    setHasToken(false);
    setProfile(null);
    navigate("/franchise-login");
  };

  if (!session || !hasToken) {
    return (
      <>
        <PageBanner
          breadcrumb="Franchisee Dashboard"
          title="Franchisee"
          highlight="Dashboard"
          tagline="Partner portal access for Indexia Finance franchisees"
        />
        <div className="bg-white">
          <div className="mx-auto max-w-3xl px-6 py-14 md:px-8">
            <div
              className="rounded-2xl p-7 text-center"
              style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 16px rgba(6,106,156,0.08)" }}
            >
              <span
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-white"
                style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))" }}
              >
                <FranchiseIcon name="lock" filled className="h-6 w-6" />
              </span>
              <h1 className="mt-4 text-xl font-bold text-slate-800">Sign in to open your dashboard</h1>
              <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-slate-600">
                The franchisee dashboard shows your agreement status, registered franchise details and payout
                structure. It is available to franchise partners with portal credentials issued with their agreement.
              </p>

              {error && (
                <p
                  role="status"
                  className="mx-auto mt-4 max-w-lg rounded-xl px-4 py-3 text-[12.5px] font-semibold"
                  style={{ background: "var(--form-error-bg)", border: "1px solid var(--form-error-border)", color: "var(--form-error-text)" }}
                >
                  {error}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/franchise-login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-white transition-all focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33) focus:ring-offset-1"
                  style={{ background: "linear-gradient(135deg,var(--brand-navy) 0%,var(--brand-dark) 100%)" }}
                >
                  Go to Franchisee Login
                </Link>
                <Link
                  to="/franchise"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-600 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33) focus:ring-offset-1"
                >
                  Not a franchisee yet? Apply
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const status = statusTone(profile?.franchiseStatus ?? session.franchiseStatus);
  const name = profile?.name ?? session.name;
  const initials = (name ?? session.franchiseId)
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={{ background: "var(--form-page-bg)", marginTop: "var(--header-h)", minHeight: "calc(100vh - var(--header-h))" }}>
      <div className="mx-auto max-w-6xl px-6 py-8 md:px-8 md:py-10">
        {/* Identity header */}
        <div
          className="overflow-hidden rounded-2xl"
          style={{ background: "linear-gradient(120deg,var(--brand-navy-deep) 0%,var(--brand-navy) 60%,var(--brand-navy-light) 100%)" }}
        >
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-7">
            <div className="flex items-center gap-4">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold"
                style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-yellow))", color: "var(--brand-navy-deep)" }}
                aria-hidden="true"
              >
                {initials}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em]" style={{ color: "var(--brand-yellow)" }}>
                  Franchisee Portal
                </p>
                <h1 className="truncate text-xl font-bold text-white md:text-2xl">
                  {name ?? "Franchise partner"}
                </h1>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-white/70">
                  <span className="rounded-full px-2 py-0.5 font-bold" style={{ background: "rgba(255,255,255,0.16)" }}>
                    ID {session.franchiseId}
                  </span>
                  {profile?.isVerified && (
                    <span className="rounded-full px-2 py-0.5 font-bold" style={{ background: "rgba(38,174,144,0.3)", color: "#d6fff5" }}>
                      ✓ Verified
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-bold"
                style={{ background: status.bg, border: `1px solid ${status.border}`, color: status.text }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: status.text }} aria-hidden="true" />
                {status.label}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refresh()}
                loading={loading}
                className="border-white/40 bg-white/10 text-white hover:bg-white/20"
              >
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="border-white/40 bg-white/10 text-white hover:bg-white/20">
                Sign out
              </Button>
            </div>
          </div>

          {/* Agreement status strip */}
          <div className="px-6 pb-6 md:px-7 md:pb-7">
            <p
              className="rounded-xl px-4 py-3 text-[12.5px] leading-relaxed text-white/85"
              style={{ background: "rgba(255,255,255,0.1)" }}
              role="status"
            >
              {status.blurb}
            </p>
          </div>
        </div>

        {/* Refresh feedback */}
        <div aria-live="polite" className="mt-4">
          {loading && (
            <p className="flex items-center gap-2 text-[12.5px] font-semibold text-slate-500">
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)"
                aria-hidden="true"
              />
              Refreshing your franchise details…
            </p>
          )}
          {error && (
            <div
              className="rounded-xl px-4 py-3"
              style={{ background: "var(--form-error-bg)", border: "1px solid var(--form-error-border)" }}
            >
              <p className="text-[12.5px] font-bold" style={{ color: "var(--form-error-text)" }}>
                Live details unavailable
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-slate-600">{error}</p>
              <a
                href={`mailto:${FRANCHISE_EMAIL}?subject=${encodeURIComponent(`Franchisee portal — account ${session.franchiseId}`)}`}
                className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-bold text-(--brand-navy) hover:underline"
              >
                <FranchiseIcon name="mail" className="h-3.5 w-3.5" />
                {FRANCHISE_EMAIL}
              </a>
            </div>
          )}
        </div>

        {/* Dashboard sections — the left panel links into the franchisor portal */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          {/* Left panel navigation */}
          <nav className="flex flex-col gap-2 lg:sticky lg:top-(--header-h) lg:self-start" aria-label="Dashboard sections">
            {PORTAL_SECTIONS.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className="group flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(6,106,156,0.12)",
                  color: "var(--brand-navy)",
                }}
              >
                <FranchiseIcon name={item.icon} className="h-4.5 w-4.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[13px] font-bold">{item.label}</p>
                  <p className="text-[11.5px] text-slate-500">{item.desc}</p>
                </div>
              </Link>
            ))}
            <div className="mt-4 rounded-xl p-4" style={{ background: "var(--brand-navy-14)" }}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-(--brand-navy)">Partner share</p>
              <p className="mt-1 text-2xl font-extrabold text-(--brand-navy)">80%</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">
                of every eligible payout, with 20% retained by Indexia.
              </p>
            </div>
          </nav>

          {/* Main panel content */}
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-extrabold text-slate-800">Franchisee Portal</h2>
            <p className="mt-1 text-[13px] text-slate-500">
              The portal is where the day-to-day work happens — it has two sections, both live against the franchise
              service.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                to="/franchise/loan-forms?section=customers"
                className="group rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-(--brand-teal)/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "var(--brand-navy-14)" }}>
                    <FranchiseIcon name="user-plus" className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">1. Customer Registration</p>
                    <p className="text-[11.5px] text-slate-500">Register a client, see their loans and each status</p>
                  </div>
                </div>
              </Link>
              <Link
                to="/franchise/loan-forms?section=products"
                className="group rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-(--brand-teal)/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "var(--brand-navy-14)" }}>
                    <FranchiseIcon name="layers" className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">2. Loan Products</p>
                    <p className="text-[11.5px] text-slate-500">File any product's application for a client</p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to="/franchise/loan-forms"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white transition-all focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33) focus:ring-offset-1"
                style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))" }}
              >
                <FranchiseIcon name="opportunity" className="h-4 w-4" />
                Open the portal
              </Link>
              <span className="text-[11.5px] text-slate-500">
                Filed under franchise {session.franchiseId}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FranchisorDashboardPage;
