import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import Button from "../components/ui/Button";
import FranchiseIcon from "../components/franchise/FranchiseIcon";
import { FRANCHISE_EMAIL } from "../components/franchise/franchiseData";
import { fetchFranchiseProfile, loginFranchise } from "../api/franchise";
import type { FranchiseAccount } from "../api/franchise";
import {
  saveFranchiseSession,
  readFranchiseSession,
  readFranchiseToken,
  mergeFranchiseProfile,
} from "../utils/franchiseSession";
import { formatTimestamp } from "../utils/formatters";
import { getApiErrorMessage } from "../utils/apiError";
import useSEO from "../hooks/useSEO";

const FRANCHISE_ONBOARD_DISMISSED_KEY = "indexia_franchise_onboarding_dismissed";

/** Profile + onboarding banner shown after login; dismissal persists forever. */

type Notice = { tone: "info" | "warn"; title: string; body: string } | null;

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

const FranchiseLoginPage = () => {
  useSEO({
    title: "Franchisor Login",
    description:
      "Franchisor login for the Indexia Finance franchise partner portal. New here? Apply for a franchise or submit a franchisor enquiry.",
    path: "/franchise-login",
  });

  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [notice, setNotice] = useState<Notice>(DEFAULT_NOTICE);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<FranchiseAccount | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  // A session token means a profile request is on its way, so start in the loading state.
  const [profileLoading, setProfileLoading] = useState(() => readFranchiseToken() !== null);
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
    // The bearer token lives under its own storage key, so read it directly —
    // the session record never carries a token of its own.
    const token = readFranchiseToken();
    if (!token) return;
    let active = true;

    fetchFranchiseProfile()
      .then((response) => {
        if (!active) return;
        if (response.success && response.user) {
          setProfile(response.user);
          mergeFranchiseProfile(response.user);
        } else {
          setProfileError(
            response.message ||
              "Could not load your franchisor profile details.",
          );
        }
      })
      .catch((error) => {
        if (!active) return;
        const rejected = (error as { response?: unknown })?.response !== undefined;
        setProfileError(
          rejected
            ? "Your franchise session is no longer valid. Sign in again to load your profile."
            : "Could not reach the franchise service. Check your connection and try again.",
        );
      })
      .finally(() => {
        if (active) setProfileLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

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
      saveFranchiseSession(
        {
          franchiseId: res.franchiseId ?? franchiseId,
          franchiseStatus: res.franchiseStatus,
          isVerified: res.isVerified,
        },
        res.token,
      );

      const status = (res.franchiseStatus ?? "").trim().toLowerCase();
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
                  className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5"
                  style={{ boxShadow: "0 2px 10px rgba(220,38,38,0.06)" }}
                >
                  <p className="mb-2 text-sm font-bold text-red-700">Could not load your profile</p>
                  <p className="text-xs text-red-600">{profileError}</p>
                </div>
              )}

              {profile && (
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
                        {profile.franchiseStatus && (
                          <span
                            className="rounded-full px-2 py-0.5 text-[10.5px] font-bold"
                            style={{ background: "#e6f7ee", border: "1px solid #b6e4c9", color: "#0b7a3f" }}
                          >
                            {profile.franchiseStatus}
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
                      notice.tone === "warn"
                        ? { background: "#fff8e6", borderColor: "rgba(224,168,0,0.45)" }
                        : { background: "var(--brand-navy-14)", borderColor: "var(--brand-navy-44)" }
                    }
                  >
                    <p className="text-[12.5px] font-bold text-slate-700">{notice.title}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-slate-600">{notice.body}</p>
                    <a
                      href={`mailto:${FRANCHISE_EMAIL}?subject=${encodeURIComponent("Franchisor portal access request")}`}
                      className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-bold text-(--brand-navy) hover:underline"
                    >
                      <FranchiseIcon name="mail" className="h-3.5 w-3.5" />
                      {FRANCHISE_EMAIL}
                    </a>
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
