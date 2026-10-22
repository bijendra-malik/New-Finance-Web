import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import Button from "../components/ui/Button";
import FranchiseIcon from "../components/franchise/FranchiseIcon";
import type { FranchiseIconName } from "../components/franchise/FranchiseIcon";
import FranchiseStatusChip from "../components/franchise/dashboard/FranchiseStatusChip";
import CustomerRegistry from "../components/franchise/dashboard/CustomerRegistry";
import AllLoansSection from "../components/franchise/dashboard/AllLoansSection";
import LoanFormsMenu from "./franchise/loan-forms/LoanFormsMenu";
import LoanFormModal from "./franchise/loan-forms/LoanFormModal";
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
  dateValue,
  formatDate,
  formatRupees,
  formatRupeesCompact,
  fullNameInitials,
  isLoanInProgress,
  isLoanPositive,
  loanAmount,
  loanApplicationNo,
  loanCustomerName,
  loanProductName,
  loanStatus,
  sortLoansNewestFirst,
} from "../components/franchise/dashboard/franchiseFormat";
import useSEO from "../hooks/useSEO";
import {
  clearStoredFranchiseSession,
  mergeFranchiseProfile,
  readFranchiseSession,
  isFranchiseSignedIn,
} from "../utils/franchiseSession";
import { useAuth } from "../context/authContext";
import type { FranchiseSession } from "../utils/franchiseSession";

interface AgreementTone {
  label: string;
  blurb: string;
  bg: string;
  border: string;
  text: string;
}

const agreementTone = (status?: string): AgreementTone => {
  switch ((status ?? "").trim().toLowerCase()) {
    case "active":
      return {
        label: "Active",
        blurb: "Your franchise agreement is active. You can register customers and file loans.",
        bg: "rgba(38,174,144,0.16)",
        border: "rgba(38,174,144,0.45)",
        text: "#d6fff5",
      };
    case "pending":
      return {
        label: "Pending",
        blurb: "Your application is with the franchise team. Customer registration and loan filing open once the agreement is active.",
        bg: "rgba(224,168,0,0.2)",
        border: "rgba(224,168,0,0.5)",
        text: "#ffe9ad",
      };
    case "approved":
      return {
        label: "Approved",
        blurb: "Your franchise agreement is approved. Portal actions unlock once the franchise team marks the account active.",
        bg: "rgba(38,174,144,0.2)",
        border: "rgba(38,174,144,0.55)",
        text: "#d6fff5",
      };
    case "suspended":
      return {
        label: "Suspended",
        blurb: "This franchise is currently suspended. Contact the franchise team before registering customers or filing loans.",
        bg: "rgba(239,68,68,0.2)",
        border: "rgba(248,113,113,0.55)",
        text: "#fecaca",
      };
    default: {
      const reported = status?.trim();
      return {
        label: reported || "Not reported",
        blurb: reported
          ? "This is the agreement status on your live franchise profile. Contact the franchise desk if it looks out of date."
          : "The agreement status has not been reported by the backend yet.",
        bg: "rgba(255,255,255,0.12)",
        border: "rgba(255,255,255,0.3)",
        text: "#ffffff",
      };
    }
  }
};

// ── Sections ─────────────────────────────────────────────────────────────────

type Section = "overview" | "customers" | "loans" | "apply";

const SECTIONS: { id: Section; label: string; icon: FranchiseIconName }[] = [
  { id: "overview", label: "Overview", icon: "scale" },
  { id: "customers", label: "Customers", icon: "user" },
  { id: "loans", label: "All Loans", icon: "layers" },
  { id: "apply", label: "Apply Loan", icon: "pen-line" },
];

const resolveSection = (raw: string | null): Section => {
  if (raw === "customers" || raw === "loans" || raw === "apply" || raw === "overview") return raw;
  if (raw === "products") return "apply";
  return "overview";
};

const EXPIRED = "Your franchise session is no longer valid. Sign in again to refresh your details.";
const UNREACHABLE = "Could not reach the franchise service. Your saved details are shown below; live data could not be refreshed.";

// ── Small dashboard pieces ───────────────────────────────────────────────────

const StatCard = ({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  icon: FranchiseIconName;
  accent: string;
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_14px_rgba(6,106,156,0.06)]">
    <span className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} aria-hidden="true" />
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
        <p className="mt-1.5 text-2xl font-extrabold text-slate-800 md:text-[27px]">{value}</p>
      </div>
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: "var(--brand-navy-14)", color: "var(--brand-navy)" }}
        aria-hidden="true"
      >
        <FranchiseIcon name={icon} className="h-4.5 w-4.5" />
      </span>
    </div>
    <p className="mt-2 text-[11.5px] leading-relaxed text-slate-500">{hint}</p>
  </div>
);

const QuickAction = ({
  icon,
  label,
  hint,
  onClick,
}: {
  icon: FranchiseIconName;
  label: string;
  hint: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-left transition-all hover:border-(--brand-teal)/40 hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
  >
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
      style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-navy))", color: "#fff" }}
      aria-hidden="true"
    >
      <FranchiseIcon name={icon} className="h-4 w-4" filled />
    </span>
    <span className="min-w-0">
      <span className="block text-[13px] font-extrabold text-slate-800">{label}</span>
      <span className="mt-0.5 block text-[11.5px] leading-relaxed text-slate-500">{hint}</span>
    </span>
    <span className="ml-auto shrink-0 self-center text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-(--brand-teal)" aria-hidden="true">
      →
    </span>
  </button>
);

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
  const [openProduct, setOpenProduct] = useState<string | null>(null);

  const section = resolveSection(searchParams.get("section"));

  const goToSection = (next: Section) => {
    setOpenProduct(null);
    setNotice(null);
    setSearchParams(next === "overview" ? {} : { section: next }, { replace: true });
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

  const sortedLoans = useMemo(() => sortLoansNewestFirst(loans), [loans]);
  const recentLoans = useMemo(() => sortedLoans.slice(0, 5), [sortedLoans]);
  const recentCustomers = useMemo(
    () =>
      [...customers].sort((a, b) => dateValue(b.createdAt) - dateValue(a.createdAt)).slice(0, 5),
    [customers],
  );

  const inProgress = loans.filter(isLoanInProgress).length;
  const positive = loans.filter(isLoanPositive).length;
  const totalLoanValue = loans.reduce((sum, loan) => sum + (loanAmount(loan) ?? 0), 0);
  const refreshing = loadingProfile || loadingCustomers || loadingLoans;

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
      <div className="mx-auto max-w-7xl px-4 py-7 md:px-8 md:py-9">
        {/* Identity header */}
        <div
          className="overflow-hidden rounded-2xl"
          style={{ background: "linear-gradient(120deg,var(--brand-navy-deep) 0%,var(--brand-navy) 62%,var(--brand-navy-light) 100%)" }}
        >
          <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-7">
            <div className="flex min-w-0 items-center gap-4">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold"
                style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-yellow))", color: "var(--brand-navy-deep)" }}
                aria-hidden="true"
              >
                {initials}
              </span>
              <div className="min-w-0">
                <p className="text-[10.5px] font-extrabold uppercase tracking-[0.2em]" style={{ color: "var(--brand-yellow)" }}>
                  Franchisee Dashboard
                </p>
                <h1 className="truncate text-xl font-bold text-white md:text-2xl">{name}</h1>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-white/75">
                  <span className="rounded-full px-2 py-0.5 font-bold" style={{ background: "rgba(255,255,255,0.16)" }}>
                    ID {session.franchiseId}
                  </span>
                  {profile?.isVerified && (
                    <span className="rounded-full px-2 py-0.5 font-bold" style={{ background: "rgba(38,174,144,0.3)", color: "#d6fff5" }}>
                      ✓ Verified
                    </span>
                  )}
                  {profile?.plan?.name && (
                    <span className="rounded-full px-2 py-0.5 font-bold" style={{ background: "rgba(255,255,255,0.12)" }}>
                      {profile.plan.name}
                    </span>
                  )}
                  {profile?.createdAt && (
                    <span className="text-white/55">Partner since {formatDate(profile.createdAt)}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
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
                onClick={() => void refreshAll()}
                loading={refreshing}
                className="border-white/40 bg-white/10 text-white hover:bg-white/20"
              >
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="border-white/40 bg-white/10 text-white hover:bg-white/20">
                Sign out
              </Button>
            </div>
          </div>

          <div className="px-5 pb-5 md:px-7 md:pb-6">
            <p className="rounded-xl px-4 py-2.5 text-[12.5px] leading-relaxed text-white/85" style={{ background: "rgba(255,255,255,0.1)" }} role="status">
              {status.blurb}
            </p>
          </div>
        </div>

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

        {/* Section tabs */}
        <div className="mt-5 overflow-x-auto">
          <div
            role="tablist"
            aria-label="Dashboard sections"
            className="inline-flex min-w-full gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 sm:min-w-0"
          >
            {SECTIONS.map((item) => {
              const isActive = item.id === section;
              const count =
                item.id === "customers" ? customers.length : item.id === "loans" ? loans.length : null;
              return (
                <button
                  key={item.id}
                  role="tab"
                  type="button"
                  id={`franchise-tab-${item.id}`}
                  aria-selected={isActive}
                  aria-controls={`franchise-panel-${item.id}`}
                  onClick={() => goToSection(item.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-[12.5px] font-bold whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
                  style={
                    isActive
                      ? {
                          background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))",
                          color: "#fff",
                          boxShadow: "0 8px 20px -14px rgba(6,106,156,0.9)",
                        }
                      : { color: "#475569" }
                  }
                >
                  <FranchiseIcon name={item.icon} className="h-4 w-4" />
                  {item.label}
                  {count !== null && (
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[10px] font-extrabold"
                      style={
                        isActive
                          ? { background: "rgba(255,255,255,0.2)", color: "#fff" }
                          : { background: "var(--brand-navy-14)", color: "var(--brand-navy)" }
                      }
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panels */}
        <div
          role="tabpanel"
          id={`franchise-panel-${section}`}
          aria-labelledby={`franchise-tab-${section}`}
          tabIndex={0}
          className="mt-5 focus:outline-none"
        >
          {section === "overview" && (
            <div className="space-y-5">
              {/* KPIs */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  label="Customers"
                  value={String(customers.length)}
                  hint="Registered under your franchise ID"
                  icon="user"
                  accent="linear-gradient(90deg,var(--brand-teal),var(--brand-navy))"
                />
                <StatCard
                  label="Applications"
                  value={String(loans.length)}
                  hint={totalLoanValue > 0 ? `${formatRupeesCompact(totalLoanValue)} requested in total` : "Loans filed across all products"}
                  icon="layers"
                  accent="linear-gradient(90deg,var(--brand-navy),var(--brand-navy-light))"
                />
                <StatCard
                  label="In progress"
                  value={String(inProgress)}
                  hint="Submitted, under review or processing"
                  icon="clock"
                  accent="linear-gradient(90deg,#e0a800,#f6c453)"
                />
                <StatCard
                  label="Approved / disbursed"
                  value={String(positive)}
                  hint="Sanctioned, disbursed or closed"
                  icon="check"
                  accent="linear-gradient(90deg,#26ae90,#7bd9c4)"
                />
              </div>

              {/* Quick actions */}
              <section aria-labelledby="quick-actions-heading" className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 id="quick-actions-heading" className="text-[13px] font-extrabold uppercase tracking-wider text-slate-500">
                  Quick actions
                </h2>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <QuickAction
                    icon="user-plus"
                    label="Register a customer"
                    hint="Add a client to your franchise registry"
                    onClick={() => goToSection("customers")}
                  />
                  <QuickAction
                    icon="pen-line"
                    label="Apply for a loan"
                    hint="File any product on a customer's behalf"
                    onClick={() => goToSection("apply")}
                  />
                  <QuickAction
                    icon="layers"
                    label="Track applications"
                    hint="Review every loan and its live status"
                    onClick={() => goToSection("loans")}
                  />
                </div>
              </section>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr]">
                {/* Recent applications */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white" aria-labelledby="recent-loans-heading">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                    <div>
                      <h2 id="recent-loans-heading" className="text-[15px] font-extrabold text-slate-800">
                        Recent applications
                      </h2>
                      <p className="mt-0.5 text-[11.5px] text-slate-500">The latest loans filed under your franchise.</p>
                    </div>
                    <Button variant="link" size="sm" onClick={() => goToSection("loans")}>
                      View all →
                    </Button>
                  </div>

                  {loansError ? (
                    <div className="px-5 py-6">
                      <p role="alert" className="text-[12.5px] font-semibold text-red-700">{loansError}</p>
                      <Button variant="link" size="sm" onClick={() => void loadLoans()}>Try again</Button>
                    </div>
                  ) : loadingLoans && loans.length === 0 ? (
                    <p className="flex items-center gap-2 px-5 py-8 text-[12.5px] font-semibold text-slate-500">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)" aria-hidden="true" />
                      Loading applications…
                    </p>
                  ) : recentLoans.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                      <p className="text-[13px] font-bold text-slate-700">No applications yet</p>
                      <p className="mt-1 text-[12px] text-slate-500">File your first loan to see it tracked here.</p>
                      <Button size="sm" className="mt-3" onClick={() => goToSection("apply")}>Apply for a loan</Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-140 text-left text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/70 text-[10.5px] uppercase tracking-wider text-slate-400">
                            <th scope="col" className="px-5 py-2.5 font-bold">Product</th>
                            <th scope="col" className="px-3 py-2.5 font-bold">Customer</th>
                            <th scope="col" className="px-3 py-2.5 font-bold">Amount</th>
                            <th scope="col" className="px-5 py-2.5 font-bold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {recentLoans.map((loan, index) => (
                            <tr key={`${loanApplicationNo(loan)}-${index}`}>
                              <td className="px-5 py-3">
                                <p className="text-[13px] font-bold text-slate-800">{loanProductName(loan)}</p>
                                <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{loanApplicationNo(loan)}</p>
                              </td>
                              <td className="px-3 py-3 text-[12.5px] text-slate-600">{loanCustomerName(loan) || "—"}</td>
                              <td className="px-3 py-3 text-[12.5px] font-semibold text-slate-700">{formatRupees(loanAmount(loan))}</td>
                              <td className="px-5 py-3"><FranchiseStatusChip status={loanStatus(loan)} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                {/* Newest customers */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white" aria-labelledby="recent-customers-heading">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                    <div>
                      <h2 id="recent-customers-heading" className="text-[15px] font-extrabold text-slate-800">
                        Newest customers
                      </h2>
                      <p className="mt-0.5 text-[11.5px] text-slate-500">Registered most recently.</p>
                    </div>
                    <Button variant="link" size="sm" onClick={() => goToSection("customers")}>
                      View all →
                    </Button>
                  </div>

                  {customersError ? (
                    <div className="px-5 py-6">
                      <p role="alert" className="text-[12.5px] font-semibold text-red-700">{customersError}</p>
                      <Button variant="link" size="sm" onClick={() => void loadCustomers()}>Try again</Button>
                    </div>
                  ) : loadingCustomers && customers.length === 0 ? (
                    <p className="flex items-center gap-2 px-5 py-8 text-[12.5px] font-semibold text-slate-500">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)" aria-hidden="true" />
                      Loading customers…
                    </p>
                  ) : recentCustomers.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                      <p className="text-[13px] font-bold text-slate-700">No customers yet</p>
                      <p className="mt-1 text-[12px] text-slate-500">Register your first client to get started.</p>
                      <Button size="sm" className="mt-3" onClick={() => goToSection("customers")}>Register customer</Button>
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {recentCustomers.map((customer) => (
                        <li key={customer._id} className="flex items-center gap-3 px-5 py-3">
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10.5px] font-extrabold"
                            style={{ background: "var(--brand-navy-14)", color: "var(--brand-navy)" }}
                            aria-hidden="true"
                          >
                            {fullNameInitials(customer.fullName)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12.5px] font-bold text-slate-800">{customer.fullName || "Unnamed customer"}</p>
                            <p className="mt-0.5 text-[11px] text-slate-500">{customer.mobile || "—"}</p>
                          </div>
                          <span className="shrink-0 text-[10.5px] font-semibold text-slate-400">{formatDate(customer.createdAt)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </div>
          )}

          {section === "customers" && (
            <CustomerRegistry
              customers={customers}
              loading={loadingCustomers}
              error={customersError}
              onReload={() => void loadCustomers()}
              onNotice={setNotice}
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

          {section === "apply" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800">Apply for a customer</h2>
                  <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-slate-500">
                    Pick a product, choose a registered customer, and file the application under your franchise ID.
                    Their identity fields are filled and locked from the customer record.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => goToSection("customers")}>
                  Manage customers
                </Button>
              </div>
              {!canSubmit && (
                <p className="mt-4 rounded-xl px-4 py-3 text-[12.5px] font-semibold" style={{ background: "#fff8e6", border: "1px solid rgba(224,168,0,0.45)", color: "#8a5a00" }}>
                  Filing unlocks once your franchise agreement is active. You can still review customers and loans.
                </p>
              )}
              <LoanFormsMenu session={session} profile={profile} canSubmit={canSubmit} onOpenProduct={setOpenProduct} />
            </div>
          )}
        </div>
      </div>

      <LoanFormModal
        open={Boolean(openProduct)}
        productKey={openProduct}
        session={session}
        canSubmit={canSubmit}
        onClose={() => {
          setOpenProduct(null);
          void loadCustomers();
          void loadLoans();
          void loadProfile();
        }}
      />
    </div>
  );
};

export default FranchisorDashboardPage;
