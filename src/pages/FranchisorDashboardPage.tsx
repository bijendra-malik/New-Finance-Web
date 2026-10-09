import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import Button from "../components/ui/Button";
import FranchiseIcon from "../components/franchise/FranchiseIcon";
import PartnerWorkspace from "../components/franchise/dashboard/PartnerWorkspace";
import { FRANCHISE_EMAIL } from "../components/franchise/franchiseData";
import { fetchFranchiseProfile } from "../api/franchise";
import type { FranchiseProfileResponse } from "../api/franchise";
import useSEO from "../hooks/useSEO";
import {
  clearFranchiseSession,
  mergeFranchiseProfile,
  readFranchiseSession,
  readFranchiseToken,
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
    case "suspended":
      return {
        label: "Suspended",
        blurb: "This franchise is currently suspended. Contact the franchise team before submitting further leads.",
        bg: "#fef2f2",
        border: "rgba(239,68,68,0.35)",
        text: "#b91c1c",
      };
    default:
      return {
        label: status?.trim() || "Not reported",
        blurb: "The agreement status has not been reported by the backend yet.",
        bg: "var(--brand-navy-14)",
        border: "var(--brand-navy-44)",
        text: "var(--brand-navy)",
      };
  }
};

// ── Page ─────────────────────────────────────────────────────────────────────

const FranchisorDashboardPage = () => {
  useSEO({
    title: "Franchisor Dashboard",
    description:
      "Franchisor dashboard for Indexia Finance franchise partners — agreement status, registered details and payout structure in one place.",
    path: "/franchisor-dashboard",
  });

  const navigate = useNavigate();
  const [session, setSession] = useState<FranchiseSession | null>(() => readFranchiseSession());
  // Read once: a session without a token is treated as signed out rather than
  // rendered as a broken dashboard.
  const [hasToken, setHasToken] = useState(() => Boolean(readFranchiseToken()));
  const [profile, setProfile] = useState<FranchiseProfileResponse["franchise"] | null>(null);
  const [loading, setLoading] = useState(() => Boolean(readFranchiseSession()));
  const [error, setError] = useState<string | null>(null);

  type ProfileResult =
    | { ok: true; franchise: NonNullable<FranchiseProfileResponse["franchise"]> }
    | { ok: false; message: string };

  /** Applies an already-settled profile result. Safe to call from async work. */
  const applyProfileResult = useCallback((result: ProfileResult) => {
    if (!result.ok) {
      setProfile(null);
      setError(result.message);

      // the token, so mirror that here: a dead session must not keep rendering a
      // dashboard it can no longer back with data.
      if (!readFranchiseSession()) {
        setSession(null);
        setHasToken(false);
      }
      return;
    }
    const franchise = result.franchise;
    setProfile(franchise);
    setError(null);
    setSession(
      mergeFranchiseProfile({
        franchiseId: franchise._id,
        name: franchise.name,
        mobile: franchise.mobile,
        email: franchise.email,
        franchiseStatus: franchise.franchiseStatus,
        isVerified: franchise.isVerified,
        continent: franchise.continent,
        country: franchise.country,
      }),
    );
  }, []);

  /** Turns a settled response into the outcome the applier expects. */
  const readResult = (res: FranchiseProfileResponse): ProfileResult =>
    res.success && res.franchise
      ? { ok: true, franchise: res.franchise }
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

  // Initial load. The request is awaited before anything is applied, so no state
  // update happens synchronously while the effect body is running.
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
        // A 4xx means the backend answered — the session or record is the problem,
        // not the connection.
        const rejected = (error as { response?: unknown })?.response !== undefined;
        applyProfileResult({ ok: false, message: rejected ? EXPIRED : UNREACHABLE });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // Re-runs only when the signed-in franchisee changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, hasToken]);

  /** Refresh triggered by the user, where an immediate spinner is expected. */
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

  // ── Signed out ─────────────────────────────────────────────────────────────
  // A session without a token is treated as signed out: the dashboard would have
  // nothing it could honestly read.
  if (!session || !hasToken) {
    return (
      <>
        <PageBanner
          breadcrumb="Franchisor Dashboard"
          title="Franchisor"
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
                The franchisor dashboard shows your agreement status, registered franchise details and payout
                structure. It is available to franchise partners with portal credentials issued with their agreement.
              </p>

              {/* Why the visitor landed here — shown after a rejected or unreachable session. */}
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
                  Go to Franchisor Login
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

  // ── Signed in ──────────────────────────────────────────────────────────────
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
                  Franchisor Portal
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
                href={`mailto:${FRANCHISE_EMAIL}?subject=${encodeURIComponent(`Franchisor portal — account ${session.franchiseId}`)}`}
                className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-bold text-(--brand-navy) hover:underline"
              >
                <FranchiseIcon name="mail" className="h-3.5 w-3.5" />
                {FRANCHISE_EMAIL}
              </a>
            </div>
          )}
        </div>

        {/* Partner workspace */}
        <PartnerWorkspace
          session={session}
          profile={profile}
          status={status}
          loading={loading}
          onRefresh={refresh}
        />
      </div>
    </div>
  );
};

export default FranchisorDashboardPage;
