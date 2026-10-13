import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageBanner from "../../../components/common/PageBanner";
import Button from "../../../components/ui/Button";
import FranchiseIcon from "../../../components/franchise/FranchiseIcon";
import {
  readFranchiseSession,
  mergeFranchiseProfile,
  clearFranchiseSession,
  type FranchiseSession,
} from "../../../utils/franchiseSession";
import { fetchFranchiseProfile } from "../../../api/franchise";
import useSEO from "../../../hooks/useSEO";

import LoanFormsMenu from "./LoanFormsMenu";
import LoanFormModal from "./LoanFormModal";
import FranchiseCustomersSection from "./FranchiseCustomersSection";

const EXPIRED = "Your franchise session is no longer valid. Sign in again to refresh your details.";
const UNREACHABLE = "Could not reach the franchise service. Your saved details are shown below.";

/** The portal's two sections. */
type PortalSection = "customers" | "products";

const SECTIONS: {
  id: PortalSection;
  label: string;
  icon: "user-plus" | "layers";
  blurb: string;
}[] = [
  {
    id: "customers",
    label: "Customer Registration",
    icon: "user-plus",
    blurb: "Your clients and their loans",
  },
  {
    id: "products",
    label: "Loan Products",
    icon: "layers",
    blurb: "Apply for any product on a client's behalf",
  },
];

const isPortalSection = (value: string | null): value is PortalSection =>
  value === "customers" || value === "products";

/**
 * The franchisor portal.
 *
 * The left panel lists the portal's sections — customer registration and loan
 * products — and the panel beside it shows the selected one. Both sections work
 * against the franchise endpoints: clients are registered through
 * POST /franchise/customer/register, and a loan is filed through
 * POST /franchise/customer/:slug/applyloan with the selected client's id.
 */
const FranchisePortalPage = () => {
  useSEO({
    title: "Franchisor Portal — Customers & Loan Products",
    description:
      "The franchisor portal for Indexia Finance franchise partners — register clients and submit any loan application on their behalf, filed under your franchise ID.",
    path: "/franchise/loan-forms",
  });

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [session, setSession] = useState<FranchiseSession | null>(() => readFranchiseSession());
  const [hasToken, setHasToken] = useState(() => Boolean(readFranchiseSession()));
  const [profile, setProfile] = useState<{ name?: string; mobile?: string; email?: string; isVerified?: boolean; franchiseStatus?: string } | null>(null);
  const [loading, setLoading] = useState(() => Boolean(readFranchiseSession()));
  const [error, setError] = useState<string | null>(null);
  // The product whose form is open; null keeps the menu visible.
  const [openProduct, setOpenProduct] = useState<string | null>(null);

  const section: PortalSection = isPortalSection(searchParams.get("section"))
    ? (searchParams.get("section") as PortalSection)
    : "customers";

  const goToSection = (next: PortalSection) => {
    setOpenProduct(null);
    setSearchParams(next === "customers" ? {} : { section: next }, { replace: true });
  };

  const sessionId = session?.franchiseId;

  const applyProfile = (user: NonNullable<Awaited<ReturnType<typeof fetchFranchiseProfile>>["user"]>) => {
    setProfile({
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      isVerified: user.isVerified,
      franchiseStatus: user.franchiseStatus,
    });
    setSession(
      mergeFranchiseProfile({
        franchiseId: user.franchiseId,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        franchiseStatus: user.franchiseStatus,
        isVerified: user.isVerified,
        continent: user.continent,
        country: user.country,
      }),
    );
  };

  useEffect(() => {
    if (!sessionId || !hasToken) return;
    let active = true;
    (async () => {
      try {
        const res = await fetchFranchiseProfile();
        if (!active) return;
        if (res.success && res.user) {
          applyProfile(res.user);
          setError(null);
        } else {
          setProfile(null);
          setError(res.success ? "The franchise service returned an empty profile response." : "The franchise service reported no record for this session.");
        }
      } catch (err) {
        if (!active) return;
        const rejected = (err as { response?: unknown })?.response !== undefined;
        setError(rejected ? EXPIRED : UNREACHABLE);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [sessionId, hasToken]);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFranchiseProfile();
      if (res.success && res.user) {
        applyProfile(res.user);
      } else {
        setProfile(null);
        setError(res.success ? "The franchise service returned an empty profile response." : "The franchise service reported no record for this session.");
      }
    } catch (err) {
      const rejected = (err as { response?: unknown })?.response !== undefined;
      setError(rejected ? EXPIRED : UNREACHABLE);
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

  const statusLabel = profile?.franchiseStatus ?? session?.franchiseStatus ?? "Not reported";
  const canSubmit = Boolean(session) && statusLabel.toLowerCase() !== "suspended";

  const initials = useMemo(() => {
    const name = profile?.name ?? session?.name ?? session?.franchiseId ?? "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [profile?.name, session?.name, session?.franchiseId]);

  if (!session || !hasToken) {
    return (
      <>
        <PageBanner
          breadcrumb="Franchisor Portal"
          title="Franchisor"
          highlight="Portal"
          tagline="Customers and loan applications, filed under your franchise ID"
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
              <h1 className="mt-4 text-xl font-bold text-slate-800">Sign in to open the franchisor portal</h1>
              <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-slate-600">
                The portal is where you register your clients and file any Indexia Finance loan application on their
                behalf. Every application is submitted under your franchise ID. Portal credentials issued with your
                franchise agreement are required.
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
                  Go to Franchisor Login
                </Link>
                <Link
                  to="/franchisor-dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-600 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33) focus:ring-offset-1"
                >
                  Back to dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const name = profile?.name ?? session.name ?? "Franchise partner";

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
                  {name}
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
                style={{
                  background: profile?.isVerified ? "rgba(38,174,144,0.16)" : "var(--brand-navy-14)",
                  border: `1px solid ${profile?.isVerified ? "rgba(38,174,144,0.4)" : "var(--brand-navy-44)"}`,
                  color: profile?.isVerified ? "#0f766e" : "var(--brand-navy)",
                }}
              >
                {statusLabel}
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

          <div className="px-6 pb-6 md:px-7 md:pb-7">
            <p
              className="rounded-xl px-4 py-3 text-[12.5px] leading-relaxed text-white/85"
              style={{ background: "rgba(255,255,255,0.1)" }}
              role="status"
            >
              {profile?.isVerified
                ? "Register a client once in Customer Registration, then open any loan product in Loan Products to file an application for them."
                : "Complete verification with the franchise team to unlock the customer registry and the loan forms."}
            </p>
          </div>
        </div>

        {/* Refresh / error feedback */}
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
                href={`mailto:contactus@indexiafinance.com?subject=${encodeURIComponent(`Franchisor portal — account ${session.franchiseId}`)}`}
                className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-bold text-(--brand-navy) hover:underline"
              >
                <FranchiseIcon name="mail" className="h-3.5 w-3.5" />
                contactus@indexiafinance.com
              </a>
            </div>
          )}
        </div>

        {/* Sections: left panel + the selected section */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <nav aria-label="Portal sections" className="lg:sticky lg:top-(--header-h) lg:self-start">
            <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0">
              {SECTIONS.map((item, index) => {
                const isActive = item.id === section;
                return (
                  <li key={item.id} className="shrink-0 lg:shrink">
                    <button
                      type="button"
                      onClick={() => goToSection(item.id)}
                      aria-current={isActive ? "true" : undefined}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left whitespace-nowrap transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
                      style={
                        isActive
                          ? {
                              background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))",
                              color: "#fff",
                              boxShadow: "0 8px 20px -14px rgba(6,106,156,0.9)",
                            }
                          : { background: "#fff", border: "1px solid rgba(6,106,156,0.12)", color: "var(--brand-navy)" }
                      }
                    >
                      <FranchiseIcon name={item.icon} className="h-4.5 w-4.5 shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-[13px] font-bold">
                          {index + 1}. {item.label}
                        </span>
                        <span
                          className="mt-0.5 hidden text-[11.5px] lg:block"
                          style={{ color: isActive ? "rgba(255,255,255,0.7)" : "#64748b" }}
                        >
                          {item.blurb}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 hidden rounded-xl p-4 lg:block" style={{ background: "var(--brand-navy-14)" }}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-(--brand-navy)">Partner share</p>
              <p className="mt-1 text-2xl font-extrabold text-(--brand-navy)">80%</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">
                of every eligible payout, with 20% retained by Indexia.
              </p>
            </div>
          </nav>

          <div className="min-w-0">
            {section === "customers" ? (
              <FranchiseCustomersSection />
            ) : (
              <LoanFormsMenu
                session={session}
                profile={profile}
                canSubmit={canSubmit}
                onOpenProduct={setOpenProduct}
              />
            )}
          </div>
        </div>
      </div>

      <LoanFormModal
        open={Boolean(openProduct)}
        productKey={openProduct}
        session={session}
        canSubmit={canSubmit}
        onClose={() => setOpenProduct(null)}
      />
    </div>
  );
};

export default FranchisePortalPage;
