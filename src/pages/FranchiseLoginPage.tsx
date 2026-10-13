import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import Button from "../components/ui/Button";
import FranchiseIcon from "../components/franchise/FranchiseIcon";
import { FRANCHISE_EMAIL } from "../components/franchise/franchiseData";
import { fetchFranchiseProfile, loginFranchise } from "../api/franchise";
import type { FranchiseAccount } from "../api/franchise";
import {
  saveFranchiseSession,
  clearFranchiseSession,
  readFranchiseSession,
  isFranchiseSignedIn,
  mergeFranchiseProfile,
} from "../utils/franchiseSession";
import { formatTimestamp } from "../utils/formatters";
import { getApiErrorMessage } from "../utils/apiError";
import useSEO from "../hooks/useSEO";
import { useAuth } from "../context/authContext";
import useFranchiseStatus from "../hooks/useFranchiseStatus";

const FRANCHISE_ONBOARD_DISMISSED_KEY = "indexia_franchise_onboarding_dismissed";

/** Profile + onboarding banner shown after login; dismissal persists forever. */

type Notice = { tone: "info" | "warn" | "error"; title: string; body: string } | null;

const PORTAL_POINTS = [
  "Check your franchise agreement status at a glance",
  "Keep plan, renewal and agreement details in one place",
  "Track leads submitted under your franchise agreement",
  "Review payout statements for successfully disbursed cases",
];

const DEFAULT_NOTICE: Notice = {
  tone: "info",
  title: "Portal access is invitation-based",
  body:
    "Portal credentials are issued with your franchise agreement and plan. " +
    "Write to the franchise team if you need access.",
};

/** Any live session the franchise profile endpoint can authenticate: the
 *  franchisor login, or the header (customer) login — the axios interceptor
 *  attaches whichever bearer token the franchise endpoints accept. */
const hasProfileSession = (): boolean =>
  isFranchiseSignedIn() || localStorage.getItem("token") !== null;

type ProfileProblem = { tone: "error" | "info"; text: string };

/** A header-login account with no franchise record attached — not an error. */
const NO_FRANCHISE_PROFILE: ProfileProblem = {
  tone: "info",
  text: "No franchisor profile is linked to this account yet. Apply for a franchise and the team will connect it here.",
};

const hasReportedFranchiseStatus = (value?: string): boolean =>
  Boolean(value?.trim() && value.trim().toLowerCase() !== "none");

/** Tone + explanation for the API's `franchiseStatus` on the profile card. */
const statusInfo = (raw?: string) => {
  const reported = (raw ?? "").trim();
  switch (reported.toLowerCase()) {
    case "approved":
      return {
        label: "Approved",
        message:
          "Your franchise application is approved. The franchise team will issue your portal credentials and agreement details.",
        bg: "rgba(38,174,144,0.12)",
        border: "rgba(38,174,144,0.4)",
        text: "#0f766e",
      };
    case "rejected":
      return {
        label: "Rejected",
        message:
          "Your franchise application was not approved. Write to the franchise team if you would like it reviewed again.",
        bg: "#fef2f2",
        border: "rgba(239,68,68,0.35)",
        text: "#b91c1c",
      };
    case "pending":
      return {
        label: "Pending",
        message:
          "Your application is with the franchise team for review. Portal access opens once the agreement is confirmed.",
        bg: "#eff6ff",
        border: "rgba(59,130,246,0.4)",
        text: "#1d4ed8",
      };
    case "active":
      return {
        label: "Active",
        message: "Your franchise agreement is active — sign in below to open your dashboard.",
        bg: "rgba(38,174,144,0.12)",
        border: "rgba(38,174,144,0.4)",
        text: "#0f766e",
      };
    case "suspended":
      return {
        label: "Suspended",
        message: "This franchise account is suspended. Contact the franchise team before signing in further.",
        bg: "#fef2f2",
        border: "rgba(239,68,68,0.35)",
        text: "#b91c1c",
      };
    default:
      return {
        label: reported || "Not reported",
        message: reported
          ? "This is the status reported on your franchise profile. Contact the franchise desk if it looks out of date."
          : "The backend has not reported a franchise status for this account yet.",
        bg: "var(--brand-navy-14)",
        border: "var(--brand-navy-22)",
        text: "var(--brand-navy)",
      };
  }
};

const FranchiseLoginPage = () => {
  useSEO({
    title: "Franchisor Login",
    description:
      "Franchisor login for the Indexia Finance franchise partner portal. New here? Apply for a franchise or submit a franchisor enquiry.",
    path: "/franchise-login",
  });

  const navigate = useNavigate();
  // The header (customer) login also unlocks this page's profile — see hasProfileSession.
  const { isLoggedIn } = useAuth();
  // GET /franchise/status controls whether the portal login can be opened.
  const liveFranchiseStatus = useFranchiseStatus(isLoggedIn || isFranchiseSignedIn());
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [notice, setNotice] = useState<Notice>(DEFAULT_NOTICE);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<FranchiseAccount | null>(null);
  const [profileError, setProfileError] = useState<ProfileProblem | null>(null);
  // A live session means a profile request is on its way, so start in the loading state.
  const [profileLoading, setProfileLoading] = useState(() => hasProfileSession());
  // Computed once on mount from the persisted session — not reactive state.
  const [onboarding, setOnboarding] = useState<{
    title: string;
    body: string;
    tone: "success" | "info";
  } | null>(() => {
    const session = readFranchiseSession();
    const dismissed = localStorage.getItem(FRANCHISE_ONBOARD_DISMISSED_KEY);
    if (!session || dismissed) return null;

    const status = (session.franchiseStatus ?? "").trim().toLowerCase();
    const active = status === "active" || session.isVerified === true;
    if (!active) return null;

    return {
      tone: "success",
      title: session.name
        ? `Welcome back, ${session.name.split(" ")[0]}.`
        : "Welcome back to the franchisor portal.",
      body:
        status === "active"
          ? "Your franchise agreement is active. You can submit customer leads from the dashboard."
          : "Your account is verified. If your agreement is not yet active, the franchise team will contact you.",
    };
  });

  useEffect(() => {
    // \"Your Franchisor Profile\" belongs to a live session only — the franchisor
    // login or the header (customer) login. Signed-out visitors never trigger it.
    if (!hasProfileSession()) return;
    let active = true;

    fetchFranchiseProfile()
      .then((response) => {
        if (!active) return;
        // The session can end while the request is in flight (the axios 401
        // interceptor clears it) — never surface profile data signed out.
        if (!hasProfileSession()) return;
        if (response.success && response.user) {
          setProfile(response.user);
          // Persists only for a franchise session; a header-login account has no
          // franchise record to merge into, so this is a no-op there.
          mergeFranchiseProfile(response.user);
        } else {
          setProfileError(
            isFranchiseSignedIn()
              ? {
                  tone: "error",
                  text:
                    response.message ||
                    "Could not load your franchisor profile details.",
                }
              : NO_FRANCHISE_PROFILE,
          );
        }
      })
      .catch((error) => {
        if (!active) return;
        const rejected = (error as { response?: unknown })?.response !== undefined;
        setProfileError(
          rejected
            ? isFranchiseSignedIn()
              ? {
                  tone: "error",
                  text: "Your franchise session is no longer valid. Sign in again to load your profile.",
                }
              : NO_FRANCHISE_PROFILE
            : {
                tone: "error",
                text: "Could not reach the franchise service. Check your connection and try again.",
              },
        );
      })
      .finally(() => {
        if (active) setProfileLoading(false);
      });

    return () => {
      active = false;
    };
    // Refetch when the header session appears or ends; the franchise session is
    // static storage, so mount coverage is enough for it.
  }, [isLoggedIn]);

  // A header sign-in that ends while this page is open: drop the profile and
  // send the visitor back to the sign-in form with a message.
  const wasLoggedIn = useRef(isLoggedIn);
  useEffect(() => {
    if (isLoggedIn) {
      wasLoggedIn.current = true;
      return;
    }
    if (!wasLoggedIn.current) return;
    wasLoggedIn.current = false;
    setProfile(null);
    setProfileError(null);
    setProfileLoading(false);
    setNotice({
      tone: "info",
      title: "You have been signed out",
      body: "Sign in again with your franchisee ID and password to view your franchisor profile and status.",
    });
    const idField = document.getElementById("franchisor-id");
    idField?.scrollIntoView({ behavior: "smooth", block: "center" });
    idField?.focus();
  }, [isLoggedIn]);

  const handleSubmit = async (ev: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    ev.preventDefault();
    const e: { identifier?: string; password?: string } = {};
    const franchiseId = identifier.trim().toUpperCase();

    if (!franchiseId) e.identifier = "Enter the franchisee ID issued with your agreement";
    else if (!/^FRN\d{6}$/.test(franchiseId)) {
      e.identifier = "Franchisee IDs look like FRN000003 — check your agreement";
    }
    if (!password) e.password = "Enter your password";

    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    setNotice(null);
    try {
      const res = await loginFranchise({ franchiseId, password });
      if (!res.success || !res.token) {
        setNotice({
          tone: "warn",
          title: "Sign-in failed",
          body: res.message || `These credentials were not accepted. Write to ${FRANCHISE_EMAIL} if your credentials need to be re-issued.`,
        });
        return;
      }
      const status = (res.franchiseStatus ?? "").trim().toLowerCase();
      if (status === "rejected") {
        clearFranchiseSession();
        setNotice({
          tone: "error",
          title: "Franchisor login is locked",
          body: `Your franchise application was not approved. Contact ${FRANCHISE_EMAIL} if you would like to discuss your application.`,
        });
        return;
      }
      saveFranchiseSession(
        {
          franchiseId: res.franchiseId ?? franchiseId,
          franchiseStatus: res.franchiseStatus,
          isVerified: res.isVerified,
        },
        res.token,
      );

      const active = status === "active" || res.isVerified === true;
      if (active) {
        setOnboarding({
          tone: "success",
          title:
            res.franchiseId
              ? `Welcome back, franchise partner.`
              : "Welcome back to the franchisor portal.",
          body:
            status === "active"
              ? "Your franchise agreement is active. You can submit customer leads from the dashboard."
              : "Your account is verified. If your agreement is not yet active, the franchise team will contact you.",
        });
      }

      navigate("/franchisor-dashboard");
    } catch (error) {
      const rejected = (error as { response?: unknown })?.response !== undefined;
      setNotice({
        tone: "warn",
        title: rejected ? "Sign-in failed" : "Could not reach the franchise service",
        body: rejected
          ? getApiErrorMessage(error, `These credentials were not accepted. Write to ${FRANCHISE_EMAIL} if they need to be re-issued.`)
          : `The sign-in request did not complete. Check your connection and try again, or write to ${FRANCHISE_EMAIL}.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const franchiseSession = readFranchiseSession();
  const franchiseStatus = (
    liveFranchiseStatus.reported
      ? liveFranchiseStatus.status
      : profile?.franchiseStatus ?? franchiseSession?.franchiseStatus ?? ""
  ).trim().toLowerCase();

  // Locked screens — no login form.
  if (!isLoggedIn && !isFranchiseSignedIn()) {
    return (
      <>
        <PageBanner
          breadcrumb="Franchisor Login"
          title="Franchisor"
          highlight="Login"
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
              <h1 className="mt-4 text-xl font-bold text-slate-800">Sign in first</h1>
              <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-slate-600">
                The franchisor portal is only available to signed-in franchise partners. If you already have an
                account, sign in from the login menu first. If you are not a franchisee yet, apply using the link
                below.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-white transition-all focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33) focus:ring-offset-1"
                  style={{ background: "linear-gradient(135deg,var(--brand-navy) 0%,var(--brand-dark) 100%)" }}
                >
                  <FranchiseIcon name="user" className="h-4 w-4" />
                  Go to login
                </Link>
                <Link
                  to="/franchise"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-600 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33) focus:ring-offset-1"
                >
                  Apply for a franchise
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (liveFranchiseStatus.loading || profileLoading) {
    return (
      <>
        <PageBanner breadcrumb="Franchisor Login" title="Franchisor" highlight="Login" tagline="Partner portal access for Indexia Finance franchisees" />
        <div className="mx-auto flex min-h-64 max-w-3xl items-center justify-center gap-3 px-6 py-16 text-sm font-semibold text-slate-600">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-(--brand-teal) border-t-transparent" aria-hidden="true" />
          Checking your franchise status…
        </div>
      </>
    );
  }

  const statusIsNone = franchiseStatus === "none" || (liveFranchiseStatus.reported && franchiseStatus === "");
  if (statusIsNone || franchiseStatus === "pending" || franchiseStatus === "rejected") {
    const pending = franchiseStatus === "pending";
    const rejected = franchiseStatus === "rejected";
    return (
      <>
        <PageBanner
          breadcrumb="Franchisor Login"
          title="Franchisor"
          highlight="Login"
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
              <h1 className="mt-4 text-xl font-bold text-slate-800">Franchisor login is locked</h1>
              <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-slate-600">
                {rejected
                  ? "Your franchise application was not approved, so franchisor login is unavailable. Contact the franchise team if you would like to discuss your application."
                  : pending
                  ? "Your franchise application has been received and is pending review. Login will become available once your status changes."
                  : "No franchise application is on file yet. Submit the Franchisee Application before accessing the franchisor login."}
              </p>
              <p className="mx-auto mt-3 max-w-lg text-[12.5px] leading-relaxed text-slate-500">
                If you believe this is a mistake, contact the franchise desk with your franchisee ID or registered
                email so they can check your account.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`mailto:${FRANCHISE_EMAIL}?subject=${encodeURIComponent("Franchisor portal login details")}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-white transition-all focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33) focus:ring-offset-1"
                  style={{ background: "linear-gradient(135deg,var(--brand-navy) 0%,var(--brand-dark) 100%)" }}
                >
                  <FranchiseIcon name="mail" className="h-4 w-4" />
                  {pending ? "Contact the franchise team" : "Email the franchise team"}
                </a>
                <Link
                  to="/franchise"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-600 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33) focus:ring-offset-1"
                >
                  Back to franchise opportunity
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBanner
        breadcrumb="Franchisor Login"
        title="Franchisor"
        highlight="Login"
        tagline="Partner portal access for Indexia Finance franchisees"
      />

      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:items-start">
            {/* Left — profile details from the profile API, then what the portal is for */}
            <div className="lg:col-span-2">
              {profileLoading && (
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-(--brand-teal) border-t-transparent" />
                </div>
              )}

              {profileError && (
                <div
                  className="mb-6 rounded-2xl p-5"
                  style={
                    profileError.tone === "info"
                      ? { border: "1px solid var(--brand-navy-22)", background: "var(--brand-navy-14)" }
                      : { border: "1px solid #fecaca", background: "#fef2f2", boxShadow: "0 2px 10px rgba(220,38,38,0.06)" }
                  }
                >
                  <p
                    className={`mb-2 text-sm font-bold ${
                      profileError.tone === "info" ? "text-(--brand-navy)" : "text-red-700"
                    }`}
                  >
                    {profileError.tone === "info"
                      ? "No franchisor profile on this account"
                      : "Could not load your profile"}
                  </p>
                  <p
                    className={`text-xs ${
                      profileError.tone === "info" ? "text-slate-600" : "text-red-600"
                    }`}
                  >
                    {profileError.text}
                  </p>
                </div>
              )}

              {/* Signed-out guard: the card is dropped the moment the session ends,
                  even if this page still holds the fetched profile in memory. */}
              {profile && hasProfileSession() && (
                <div
                  className="mb-6 rounded-2xl border border-slate-200 bg-white p-5"
                  style={{ boxShadow: "0 2px 10px rgba(6,106,156,0.06)" }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                      style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))" }}
                    >
                      <FranchiseIcon name="user" filled className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-(--brand-navy)">
                        Your Franchisor Profile
                      </p>
                      <p className="mt-0.5 truncate text-[13px] font-bold text-slate-800">
                        {profile.name ?? "Not reported by the server"}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {profile.franchiseId && (
                          <span
                            className="rounded-full px-2 py-0.5 text-[10.5px] font-bold"
                            style={{ background: "var(--brand-navy-14)", color: "var(--brand-navy)" }}
                          >
                            {profile.franchiseId}
                          </span>
                        )}
                        {hasReportedFranchiseStatus(profile.franchiseStatus) && (
                          <span
                            className="rounded-full px-2 py-0.5 text-[10.5px] font-bold"
                            style={{
                              background: statusInfo(profile.franchiseStatus).bg,
                              border: `1px solid ${statusInfo(profile.franchiseStatus).border}`,
                              color: statusInfo(profile.franchiseStatus).text,
                            }}
                          >
                            {statusInfo(profile.franchiseStatus).label}
                          </span>
                        )}
                        {profile.isVerified && (
                          <span
                            className="rounded-full px-2 py-0.5 text-[10.5px] font-bold"
                            style={{
                              background: "var(--brand-navy-14)",
                              border: "1px solid var(--brand-navy-22)",
                              color: "var(--brand-navy)",
                            }}
                          >
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* API status — approved / rejected / pending, in the API's own words */}
                  {hasReportedFranchiseStatus(profile.franchiseStatus) && (
                    <div
                      role="status"
                      className="mt-4 rounded-xl border px-3.5 py-3"
                      style={{ background: statusInfo(profile.franchiseStatus).bg, borderColor: statusInfo(profile.franchiseStatus).border }}
                    >
                      <p className="text-[12.5px] font-bold" style={{ color: statusInfo(profile.franchiseStatus).text }}>
                        {statusInfo(profile.franchiseStatus).label}
                      </p>
                      <p className="mt-0.5 text-[12px] leading-relaxed text-slate-600">
                        {statusInfo(profile.franchiseStatus).message}
                      </p>
                    </div>
                  )}

                  <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      ["Franchise ID", profile.franchiseId],
                      ["Mobile", profile.mobile],
                      ["Email", profile.email],
                      ["Role", profile.role],
                      ["Package", profile.package],
                      ["PAN", profile.panNumber],
                      ["City", profile.city],
                      ["State", profile.state],
                      ["Pincode", profile.pincode],
                      ["Country", profile.country],
                      ["Continent", profile.continent],
                      [
                        "Account Active",
                        profile.isActive === true
                          ? "Yes"
                          : profile.isActive === false
                            ? "No"
                            : undefined,
                      ],
                      [
                        "Verified",
                        profile.isVerified === true
                          ? "Yes"
                          : profile.isVerified === false
                            ? "No"
                            : undefined,
                      ],
                      ["Registered On", formatTimestamp(profile.createdAt)],
                      ["Last Login", formatTimestamp(profile.lastLogin)],
                      ["Last Updated", formatTimestamp(profile.updatedAt)],
                    ].map(([label, value]) => (
                      <div key={label as string}>
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold text-slate-700">{value || "—"}</dd>
                      </div>
                    ))}
                  </dl>

                  {profile.businessDetails && (
                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-(--brand-navy)">
                        Business Details
                      </p>
                      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                          ["Business Name", profile.businessDetails.businessName],
                          ["Business Type", profile.businessDetails.businessType],
                          ["GST Number", profile.businessDetails.gstNumber],
                          ["Address", profile.businessDetails.address],
                          ["Years in Business", profile.businessDetails.yearsInBusiness],
                        ].map(([label, value]) => (
                          <div key={label as string}>
                            <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              {label}
                            </dt>
                            <dd className="mt-0.5 text-sm font-semibold text-slate-700">{value || "—"}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

                  <p
                    className="mt-4 rounded-lg border px-3 py-2 text-xs"
                    style={{ borderColor: "var(--brand-navy-22)", background: "var(--brand-navy-14)" }}
                  >
                    These details come from your live franchise profile. To change any of them, write to the franchise
                    desk with your franchisee ID.
                  </p>
                </div>
              )}

              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-(--brand-navy)">
                Franchisor Portal
              </span>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">One desk for your franchise business</h2>
              <div
                className="mt-3 h-0.75 w-32 rounded-full"
                style={{ background: "linear-gradient(90deg,#27ae90 0%,var(--brand-navy) 55%,transparent 100%)" }}
              />

              <ul className="mt-8 space-y-4">
                {PORTAL_POINTS.map((point) => (
                  <li key={point} className="flex gap-3.5">
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
                      style={{ background: "linear-gradient(135deg,#26ae90,var(--brand-navy))" }}
                    >
                      <FranchiseIcon name="check" filled className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-[13px] leading-relaxed text-slate-600">{point}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl p-5" style={{ background: "var(--brand-navy-14)" }}>
                <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-(--brand-navy)">
                  Not a franchisee yet?
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-600">
                  Review the franchise business model, plan fees and the 80:20 payout structure, then apply.
                </p>
                <Link
                  to="/franchise"
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-(--brand-navy) hover:underline"
                >
                  View the franchise opportunity →
                </Link>
              </div>
            </div>

            {/* Right — login card */}
            <div className="lg:col-span-3">
              <div
                className="rounded-2xl p-6 md:p-8"
                style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 16px rgba(6,106,156,0.08)" }}
              >
                {onboarding && (
                  <div
                    role="status"
                    className="mb-5 rounded-xl border px-4 py-3.5"
                    style={
                      onboarding.tone === "success"
                        ? { background: "#ecfdf5", borderColor: "rgba(38,174,144,0.4)" }
                        : { background: "var(--brand-navy-14)", borderColor: "var(--brand-navy-44)" }
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[12.5px] font-bold text-slate-800">{onboarding.title}</p>
                        <p className="mt-1 text-[12px] leading-relaxed text-slate-600">{onboarding.body}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem(FRANCHISE_ONBOARD_DISMISSED_KEY, "1");
                          setOnboarding(null);
                        }}
                        className="shrink-0 cursor-pointer rounded-md px-3 py-1.5 text-[11px] font-bold text-(--brand-teal) transition hover:bg-(--brand-teal-14) focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
                      >
                        Got it
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))" }}
                  >
                    <FranchiseIcon name="lock" filled className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Franchisor Login</h2>
                    <p className="text-[12.5px] text-slate-500">For registered franchise partners only</p>
                  </div>
                </div>

                {/* Portal status — stated up front, not after a failed attempt */}
                {notice && (
                  <div
                    role="status"
                    className="mt-6 rounded-xl border px-4 py-3.5"
                    style={
                      notice.tone === "error"
                        ? { background: "#fef2f2", borderColor: "#fecaca" }
                        : notice.tone === "warn"
                          ? { background: "#fff8e6", borderColor: "rgba(224,168,0,0.45)" }
                          : { background: "var(--brand-navy-14)", borderColor: "var(--brand-navy-44)" }
                    }
                  >
                    <p className="text-[12.5px] font-bold text-slate-700">{notice.title}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-slate-600">{notice.body}</p>
                    {notice.tone !== "info" && (
                      <a
                        href={`mailto:${FRANCHISE_EMAIL}?subject=${encodeURIComponent("Franchisor portal access request")}`}
                        className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-bold text-(--brand-navy) hover:underline"
                      >
                        <FranchiseIcon name="mail" className="h-3.5 w-3.5" />
                        {FRANCHISE_EMAIL}
                      </a>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                  <div>
                    <label htmlFor="franchisor-id" className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">
                      Franchisee ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="franchisor-id"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        setErrors((p) => ({ ...p, identifier: undefined }));
                      }}
                      placeholder="FRN000003"
                      autoComplete="username"
                      aria-describedby="franchisor-id-hint"
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-(--brand-navy) ${
                        errors.identifier ? "border-red-400 bg-red-50/40" : "border-slate-300"
                      }`}
                    />
                    {errors.identifier && <p className="mt-1 text-[11.5px] font-medium text-red-500">{errors.identifier}</p>}
                    <p id="franchisor-id-hint" className="mt-1 text-[11px] text-slate-400">
                      The franchisee ID is printed on your franchise agreement.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="franchisor-pw" className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="franchisor-pw"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setErrors((p) => ({ ...p, password: undefined }));
                        }}
                        placeholder="Your portal password"
                        autoComplete="current-password"
                        className={`w-full rounded-lg border px-3.5 py-2.5 pr-20 text-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-(--brand-navy) ${
                          errors.password ? "border-red-400 bg-red-50/40" : "border-slate-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md px-2.5 py-1.5 text-[11px] font-bold text-(--brand-navy) transition hover:bg-(--brand-navy-14) focus:outline-none focus:ring-2 focus:ring-(--brand-navy-44)"
                        aria-pressed={showPassword}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-[11.5px] font-medium text-red-500">{errors.password}</p>}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    loading={submitting}
                    style={{ background: "linear-gradient(135deg,var(--brand-navy) 0%,var(--brand-dark) 100%)" }}
                  >
                    {submitting ? "Signing in…" : "Login"}
                  </Button>
                </form>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={() =>
                      setNotice({
                        tone: "info",
                        title: "Password reset",
                        body: `Password resets are handled by the franchise team while the portal is being rolled out. Write to ${FRANCHISE_EMAIL} with your registered email or mobile number.`,
                      })
                    }
                    className="cursor-pointer text-[12.5px] font-semibold text-(--brand-navy) hover:underline focus:outline-none focus:ring-2 focus:ring-(--brand-navy-44) rounded"
                  >
                    Forgot Password?
                  </button>
                  <Link
                    to="/franchise#become-a-franchisor"
                    className="cursor-pointer text-[12.5px] font-semibold text-(--brand-navy) hover:underline rounded focus:outline-none focus:ring-2 focus:ring-(--brand-navy-44)"
                  >
                    Become a Franchisor →
                  </Link>
                </div>
              </div>

              <p className="mt-4 text-center text-[11.5px] leading-relaxed text-slate-400">
                Looking to apply for a franchise instead?{" "}
                <Link to="/franchise" className="font-semibold text-(--brand-navy) hover:underline">
                  Go to the franchisee application
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FranchiseLoginPage;
