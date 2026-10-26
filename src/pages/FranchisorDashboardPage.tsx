import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import Button from "../components/ui/Button";
import FranchiseIcon from "../components/franchise/FranchiseIcon";
import CustomerRegistry from "../components/franchise/dashboard/CustomerRegistry";
import AllLoansSection from "../components/franchise/dashboard/AllLoansSection";
import PlanPanel from "../components/franchise/dashboard/PlanPanel";
import NotificationBell from "../components/franchise/dashboard/NotificationBell";
import ProfilePanel from "../components/franchise/dashboard/ProfilePanel";
import LoanFormsMenu from "./franchise/loan-forms/LoanFormsMenu";
import { FRANCHISE_EMAIL } from "../components/franchise/franchiseData";
import { fetchFranchiseProfile } from "../api/franchise";
import type { FranchiseProfileResponse } from "../api/franchise";
import {
  fetchFranchiseCustomers,
  fetchFranchiseLoans,
  type FranchiseCustomer,
  type FranchiseCustomerLoan,
} from "../api/franchiseCustomers";
import {
  formatDate,
  fullNameInitials,
} from "../components/franchise/dashboard/franchiseFormat";
import { SECTIONS, resolveSection, type Section } from "../components/franchise/dashboard/franchiseSections";
import { agreementTone } from "../components/franchise/dashboard/agreementTone";
import OverviewPanel from "../components/franchise/dashboard/OverviewPanel";
import useSEO from "../hooks/useSEO";
import {
  clearStoredFranchiseSession,
  mergeFranchiseProfile,
  readFranchiseSession,
  isFranchiseSignedIn,
} from "../utils/franchiseSession";
import { useAuth } from "../context/authContext";
import type { FranchiseSession } from "../utils/franchiseSession";

// ── Sections ─────────────────────────────────────────────────────────────────

const EXPIRED = "Your franchise session is no longer valid. Sign in again to refresh your details.";
const UNREACHABLE = "Could not reach the franchise service. Your saved details are shown below; live data could not be refreshed.";

// ── Page ─────────────────────────────────────────────────────────────────────

const FranchisorDashboardPage = () => {
  useSEO({
    title: "Franchisee Dashboard — Customers, Loans & Applications",
    description:
      "The Indexia Finance franchisee dashboard: agreement status, registered customers, every loan application filed under your franchise, and filing for a client — all in one workspace.",
    path: "/franchisor-dashboard",
  });

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoggedIn } = useAuth();

  const [session, setSession] = useState<FranchiseSession | null>(() => readFranchiseSession());
  const [hasToken, setHasToken] = useState(isFranchiseSignedIn);
  const [profile, setProfile] = useState<FranchiseProfileResponse["franchise"] | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(() => Boolean(readFranchiseSession()));

  const [customers, setCustomers] = useState<FranchiseCustomer[]>([]);
  const [customersError, setCustomersError] = useState<string | null>(null);
  const [loadingCustomers, setLoadingCustomers] = useState(() => Boolean(readFranchiseSession()));

  const [loans, setLoans] = useState<FranchiseCustomerLoan[]>([]);
  const [loansError, setLoansError] = useState<string | null>(null);
  const [loadingLoans, setLoadingLoans] = useState(() => Boolean(readFranchiseSession()));

  const [notice, setNotice] = useState<string | null>(null);
  const [applyForCustomer, setApplyForCustomer] = useState<FranchiseCustomer | null>(null);

  const section = resolveSection(searchParams.get("section"));

  const goToSection = (next: Section) => {
    setApplyForCustomer(null);
    setNotice(null);
    setSearchParams(next === "overview" ? {} : { section: next }, { replace: true });
  };

  const openFilingDashboard = (productKey: string) => {
    const query = applyForCustomer ? `?customer=${encodeURIComponent(applyForCustomer._id)}` : "";
    navigate(`/franchisor-dashboard/apply/${productKey}${query}`);
  };

  const sessionId = session?.franchiseId;

  const loadProfile = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const res = await fetchFranchiseProfile();
      if (res.success && res.franchise) {
        const account = res.franchise;
        setProfile(account);
        setProfileError(null);
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
      } else {
        setProfileError(
          res.success
            ? "The franchise service returned an empty profile response."
            : "The franchise service reported no record for this session.",
        );
      }
    } catch (error) {
      const rejected = (error as { response?: unknown })?.response !== undefined;
      setProfileError(rejected ? EXPIRED : UNREACHABLE);
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  const loadCustomers = useCallback(async () => {
    setLoadingCustomers(true);
    const res = await fetchFranchiseCustomers();
    if (res.ok) {
      setCustomers(res.customers);
      setCustomersError(null);
    } else {
      setCustomersError(res.message);
    }
    setLoadingCustomers(false);
  }, []);

  const loadLoans = useCallback(async () => {
    setLoadingLoans(true);
    const res = await fetchFranchiseLoans();
    if (res.ok) {
      setLoans(res.loans);
      setLoansError(null);
    } else {
      setLoansError(res.message);
    }
    setLoadingLoans(false);
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadProfile(), loadCustomers(), loadLoans()]);
  }, [loadProfile, loadCustomers, loadLoans]);

  useEffect(() => {
    if (!sessionId || !hasToken || !isLoggedIn) return;
    let active = true;
    void (async () => {
      await Promise.resolve();
      if (active) await refreshAll();
    })();
    return () => {
      active = false;
    };
  }, [sessionId, hasToken, isLoggedIn, refreshAll]);

  const handleSignOut = () => {
    setSession(null);
    setHasToken(false);
    setProfile(null);
    clearStoredFranchiseSession();
    navigate("/franchise-login");
  };

  const agreementStatus = profile?.franchiseStatus ?? session?.franchiseStatus;
  const status = agreementTone(agreementStatus);
  const name = profile?.name ?? session?.name ?? "Franchise partner";
  const initials = fullNameInitials(name);
  const canSubmit = Boolean(session) && (agreementStatus ?? "").trim().toLowerCase() !== "suspended";


  const refreshing = loadingProfile || loadingCustomers || loadingLoans;

  const activeSection = SECTIONS.find((item) => item.id === section) ?? SECTIONS[0];
  const partnerMeta = [profile?.plan?.name, profile?.createdAt ? `Partner since ${formatDate(profile.createdAt)}` : null]
    .filter(Boolean)
    .join(" · ");

  // ── Signed-out guard ───────────────────────────────────────────────────────
  if (!session || !hasToken || !isLoggedIn) {
    return (
      <>
        <PageBanner
          breadcrumb="Franchisee Dashboard"
          title="Franchisee"
          highlight="Dashboard"
          tagline="Partner workspace for Indexia Finance franchisees"
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
                Your dashboard holds your agreement status, registered customers and every loan filed under your
                franchise ID. Portal credentials are issued with your franchise agreement.
              </p>

              {profileError && (
                <p
                  role="status"
                  className="mx-auto mt-4 max-w-lg rounded-xl px-4 py-3 text-[12.5px] font-semibold"
                  style={{ background: "var(--form-error-bg)", border: "1px solid var(--form-error-border)", color: "var(--form-error-text)" }}
                >
                  {profileError}
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

  // ── Dashboard ──────────────────────────────────────────────────────────────

  return (
    <div style={{ background: "var(--form-page-bg)", marginTop: "var(--header-h)", minHeight: "calc(100vh - var(--header-h))" }}>
      <div className="lg:flex lg:items-stretch">
          {/* Left panel — identity and section navigation */}
          <aside
            className="text-white lg:sticky lg:top-(--header-h) lg:flex lg:h-[calc(100vh-var(--header-h))] lg:w-66 lg:shrink-0 lg:flex-col lg:overflow-y-auto"
            style={{ background: "linear-gradient(165deg,var(--brand-navy-deep) 0%,var(--brand-navy) 58%,var(--brand-navy-light) 100%)" }}
          >
            <div className="flex items-center gap-3 px-4 pt-4 pb-3 lg:flex-col lg:items-start lg:gap-3 lg:px-5 lg:pt-5">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold lg:h-12 lg:w-12 lg:text-base"
                style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-yellow))", color: "var(--brand-navy-deep)" }}
                aria-hidden="true"
              >
                {initials}
              </span>

              <div className="min-w-0 flex-1 lg:w-full lg:flex-none">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em]" style={{ color: "var(--brand-yellow)" }}>
                  Franchisee
                </p>
                <p className="truncate text-[15px] font-bold leading-tight text-white">{name}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] font-semibold text-white/60">
                  <span>ID {session.franchiseId}</span>
                  {profile?.isVerified && (
                    <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold" style={{ background: "rgba(38,174,144,0.28)", color: "#d6fff5" }}>
                      ✓ Verified
                    </span>
                  )}
                </p>
                {partnerMeta && (
                  <p className="mt-1 hidden text-[11px] text-white/45 lg:block">{partnerMeta}</p>
                )}
              </div>

              <span
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold whitespace-nowrap"
                style={{ background: status.bg, border: `1px solid ${status.border}`, color: status.text }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.text }} aria-hidden="true" />
                {status.label}
              </span>
            </div>

            <p className="hidden px-5 pb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/35 lg:block">
              Workspace
            </p>

            <nav
              aria-label="Dashboard sections"
              className="grid grid-cols-2 gap-1 px-2.5 pb-2.5 lg:flex lg:flex-col lg:gap-0.5 lg:px-2.5 lg:pb-2"
            >
              {SECTIONS.map((item) => {
                const isActive = item.id === section;
                const count =
                  item.id === "customers" ? customers.length : item.id === "loans" ? loans.length : null;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goToSection(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12.5px] font-bold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 lg:w-full"
                    style={
                      isActive
                        ? { background: "rgba(255,255,255,0.16)", color: "#fff" }
                        : { color: "rgba(255,255,255,0.7)" }
                    }
                  >
                    <FranchiseIcon name={item.icon} className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {count !== null && (
                      <span
                        className="ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-extrabold"
                        style={
                          isActive
                            ? { background: "rgba(255,255,255,0.22)", color: "#fff" }
                            : { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)" }
                        }
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 border-t border-white/10 px-3 py-2.5 lg:mt-auto lg:flex-col lg:items-stretch">
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refreshAll()}
                loading={refreshing}
                className="flex-1 border-white/25 bg-white/10 text-white hover:bg-white/20 lg:w-full lg:flex-none"
              >
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex-1 border-white/25 bg-white/10 text-white hover:bg-white/20 lg:w-full lg:flex-none"
              >
                Sign out
              </Button>
            </div>
          </aside>

          {/* Right panel — section content (the layout already owns the page's main landmark) */}
          <div className="mt-5 min-w-0 px-4 py-6 md:px-6 md:py-7 lg:mt-0 lg:flex-1">
            <header className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                  Franchisee dashboard
                </p>
                <h1 id="franchise-panel-heading" className="mt-1 text-xl font-extrabold text-slate-800 md:text-[22px]">
                  {activeSection.label}
                </h1>
                <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-slate-500">
                  {activeSection.description}
                </p>
              </div>

              <NotificationBell
                loans={loans}
                customers={customers}
                franchiseId={session.franchiseId}
                onOpenSection={goToSection}
              />
            </header>

            {/* Feedback */}
            <div aria-live="polite" className="mt-3 space-y-2">
              {notice && (
                <p
                  role="status"
                  className="rounded-xl px-4 py-2.5 text-[12.5px] font-semibold"
                  style={{ background: "#ecfdf5", border: "1px solid #b6e4c9", color: "#0f7a5f" }}
                >
                  {notice}
                </p>
              )}
              {profileError && (
                <div className="rounded-xl px-4 py-3" style={{ background: "var(--form-error-bg)", border: "1px solid var(--form-error-border)" }}>
                  <p className="text-[12.5px] font-bold" style={{ color: "var(--form-error-text)" }}>Live profile unavailable</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-600">{profileError}</p>
                  <a
                    href={`mailto:${FRANCHISE_EMAIL}?subject=${encodeURIComponent(`Franchisee portal — account ${session.franchiseId}`)}`}
                    className="mt-1.5 inline-flex items-center gap-1.5 text-[12px] font-bold text-(--brand-navy) hover:underline"
                  >
                    <FranchiseIcon name="mail" className="h-3.5 w-3.5" />
                    {FRANCHISE_EMAIL}
                  </a>
                </div>
              )}
            </div>

            {/* Panels */}
            <section
              id={`franchise-panel-${section}`}
              aria-labelledby="franchise-panel-heading"
              className="mt-5 focus:outline-none"
            >
              {section === "overview" && (
                <OverviewPanel
                  customers={customers}
                  customersError={customersError}
                  loadingCustomers={loadingCustomers}
                  loans={loans}
                  loansError={loansError}
                  loadingLoans={loadingLoans}
                  goToSection={goToSection}
                  onReloadCustomers={() => void loadCustomers()}
                  onReloadLoans={() => void loadLoans()}
                />
              )}

              {section === "customers" && (
                <CustomerRegistry
                  customers={customers}
                  loading={loadingCustomers}
                  error={customersError}
                  onReload={() => void loadCustomers()}
                  onNotice={setNotice}
                  onApplyLoan={(customer) => {
                    setNotice(null);
                    setSearchParams({ section: "apply" }, { replace: true });
                    setApplyForCustomer(customer);
                  }}
                />
              )}

              {section === "loans" && (
                <AllLoansSection
                  loans={loans}
                  loading={loadingLoans}
                  error={loansError}
                  onReload={() => void loadLoans()}
                />
              )}

              {section === "profile" && <ProfilePanel profile={profile} session={session} />}

              {section === "plan" && <PlanPanel profile={profile} />}

              {section === "apply" && (
                <div className="space-y-4">
                  {!canSubmit && (
                    <p className="rounded-xl px-4 py-3 text-[12.5px] font-semibold" style={{ background: "#fff8e6", border: "1px solid rgba(224,168,0,0.45)", color: "#8a5a00" }}>
                      Filing unlocks once your franchise agreement is active. You can still review customers and loans.
                    </p>
                  )}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="max-w-xl text-[12.5px] leading-relaxed text-slate-500">
                        Pick a product below. Its filing dashboard opens with the customer, the form
                        and the credit-score step in one workspace — identity fields are filled and
                        locked from the customer record.
                      </p>
                      <Button variant="outline" size="sm" onClick={() => goToSection("customers")}>
                        Manage customers
                      </Button>
                    </div>
                    <LoanFormsMenu
                      session={session}
                      canSubmit={canSubmit}
                      onOpenProduct={openFilingDashboard}
                      filingFor={applyForCustomer}
                      onClearClient={() => setApplyForCustomer(null)}
                    />
                  </div>
                </div>
              )}
            </section>
          </div>
      </div>
    </div>
  );
};

export default FranchisorDashboardPage;
