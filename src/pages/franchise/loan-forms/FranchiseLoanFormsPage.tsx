import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { franchiseSubmitContext } from "../../../api/franchiseLoanApplications";

import LoanFormsMenu from "./LoanFormsMenu";
import LoanFormModal from "./LoanFormModal";
import FranchiseCustomersSection from "./FranchiseCustomersSection";

const EXPIRED = "Your franchise session is no longer valid. Sign in again to refresh your details.";
const UNREACHABLE = "Could not reach the franchise service. Your saved details are shown below.";

const FranchiseLoanFormsPage = () => {
  useSEO({
    title: "Loan Forms — Franchise Partner",
    description:
      "Submit any Indexia Finance loan application on behalf of your customer — every product form with its exact validations, filed under your franchise ID.",
    path: "/franchise/loan-forms",
  });

  const navigate = useNavigate();
  const [session, setSession] = useState<FranchiseSession | null>(() => readFranchiseSession());
  const [hasToken, setHasToken] = useState(() => Boolean(readFranchiseSession()));
  const [profile, setProfile] = useState<{ name?: string; mobile?: string; email?: string; isVerified?: boolean; franchiseStatus?: string } | null>(null);
  const [loading, setLoading] = useState(() => Boolean(readFranchiseSession()));
  const [error, setError] = useState<string | null>(null);

  const sessionId = session?.franchiseId;
  const ctx = useMemo(() => franchiseSubmitContext(), []);

  useEffect(() => {
    if (!sessionId || !hasToken) return;
    let active = true;
    (async () => {
      try {
        const res = await fetchFranchiseProfile();
        if (!active) return;
        if (res.success && res.user) {
          setProfile({
            name: res.user.name,
            mobile: res.user.mobile,
            email: res.user.email,
            isVerified: res.user.isVerified,
            franchiseStatus: res.user.franchiseStatus,
          });
          setSession(
            mergeFranchiseProfile({
              franchiseId: res.user.franchiseId,
              name: res.user.name,
              mobile: res.user.mobile,
              email: res.user.email,
              franchiseStatus: res.user.franchiseStatus,
              isVerified: res.user.isVerified,
              continent: res.user.continent,
              country: res.user.country,
            }),
          );
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
        setProfile({
          name: res.user.name,
          mobile: res.user.mobile,
          email: res.user.email,
          isVerified: res.user.isVerified,
          franchiseStatus: res.user.franchiseStatus,
        });
        setSession(
          mergeFranchiseProfile({
            franchiseId: res.user.franchiseId,
            name: res.user.name,
            mobile: res.user.mobile,
            email: res.user.email,
            franchiseStatus: res.user.franchiseStatus,
            isVerified: res.user.isVerified,
            continent: res.user.continent,
            country: res.user.country,
          }),
        );
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

  if (!session || !hasToken) {
    return (
      <>
        <PageBanner
          breadcrumb="Loan Forms"
          title="Franchise"
          highlight="Loan Forms"
          tagline="Applications, filed under your franchise ID"
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
              <h1 className="mt-4 text-xl font-bold text-slate-800">Sign in to open the loan forms</h1>
              <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-slate-600">
                The loan-forms menu is part of the franchise partner portal — it lets you submit applications
                for any Indexia Finance product on a customer's behalf, filed under your franchise ID. Portal
                credentials issued with your franchise agreement are required.
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
  const initials = (name ?? session.franchiseId)
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const statusLabel = profile?.franchiseStatus ?? session.franchiseStatus ?? "Not reported";
  const canSubmit = Boolean(ctx) && profile?.franchiseStatus?.toLowerCase() !== "suspended";

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
                  Loan Forms Menu
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
                ? "You are verified and can open any product form below. Each submitted application is filed under your franchise ID so we can match it to your account."
                : "Complete verification with the franchise team to unlock the full loan-forms menu."}
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

        {/* Section 1 — customer registry */}
        <FranchiseCustomersSection />

        {/* Section 2 — loan products */}
        <LoanFormsMenu
          session={session}
          profile={profile}
          canSubmit={canSubmit}
          onOpenProduct={(productKey) => {
            // Modal opens through LoanFormModal register; this is the hook.
            window.dispatchEvent(new CustomEvent("franchise-loan-form:open", { detail: { productKey, session, profile } }));
          }}
        />
      </div>

      <LoanFormModal
        session={session}
        profile={profile}
        canSubmit={canSubmit}
        onRefNo={(refNo, productKey) => {
          window.dispatchEvent(new CustomEvent("franchise-loan-form:refno", { detail: { refNo, productKey } }));
        }}
      />
    </div>
  );
};

export default FranchiseLoanFormsPage;
