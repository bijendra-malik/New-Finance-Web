import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { fetchContinents, fetchCountriesByContinent, resolveCountryIso } from "../api/masters";
import type { Continent, Country } from "../api/masters";
import { useAuth } from "../context/authContext";
import {
  endSession,
  readAccountRecord,
  readStoredLanguage,
  readStoredProfile,
  startSession,
  writeStoredLanguage,
  writeStoredProfile,
} from "../utils/accountProfile";
import type { AccountProfile, Role } from "../utils/accountProfile";
import { consumePendingProduct, emitAccountReady, onSignUpRequested } from "../utils/signInGate";
import { getApiErrorMessage } from "../utils/apiError";
import { EMAIL_REGEX, MOBILE_REGEX, NAME_REGEX } from "../utils/validation";
import { loginUser, registerUser, verifyOTP } from "../api/auth";
import type { RegisterPayload } from "../api/auth";
import Button from "./ui/Button";

export type { AccountProfile, Role };

// ── Languages ─────────────────────
interface Language {
  code: string;
  label: string;
  short: string;
}

const LANGUAGES: Language[] = [
  { code: "en", label: "English", short: "ENG" },
  { code: "hi", label: "हिन्दी", short: "हि" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const initialsOf = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";

// Indian mobile numbers are a fixed 10 digits, so the stored value is capped there.
const digitsOf = (value: string) => value.replace(/\D/g, "").slice(0, 10);

const isUnregisteredMobileError = (error: unknown): boolean => {
  const value = error as {
    code?: string;
    message?: string;
    response?: { data?: { code?: string; message?: string } };
  };
  const rawCode = value?.response?.data?.code ?? value?.code;
  const rawMessage = value?.response?.data?.message ?? value?.message;
  const code = typeof rawCode === "string" ? rawCode.toLowerCase() : "";
  const message = typeof rawMessage === "string" ? rawMessage.toLowerCase() : "";
  return /user_not_found|account_not_found|mobile_not_registered|phone_not_registered/.test(code)
    || /not registered|no (user|account)|((user|account|mobile|phone).*(not found|does not exist|doesn't exist))/.test(message);
};

const normalizeRole = (role?: string): Role | null => {
  const value = typeof role === "string" ? role.trim().toLowerCase() : "";
  if (value === "customer") return "Customer";
  if (value === "franchise") return "Franchise";
  return null;
};

// ── Small presentational pieces ───────────────────────────────────────────────
const Chevron = ({ open }: { open: boolean }) => (
  <svg
    className={`h-3 w-3 text-black bg-(--brand-yellow) rounded-3xl transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
    {children}
  </span>
);

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/25";

const PANEL_ATTR = "data-account-panel";

const Combo = ({
  value,
  options,
  onChange,
  placeholder,
  disabled,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}) => {
  // A stored value can resolve to a place the masters list hasn't loaded (or that isn't in it at all) — keep it selectable so it still shows.
  const list = value && !options.includes(value) ? [...options, value] : options;
  return (
    <div className="relative">
      <select
        className={`${fieldClass} appearance-none pr-8 cursor-pointer`}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {list.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <Chevron open={false} />
      </span>
    </div>
  );
};  // ── Component ─────────────────────────────────────────────────────────────────
const AccountMenu = () => {
  const [profile, setProfile] = useState<AccountProfile | null>(readStoredProfile);
  const [language, setLanguage] = useState<string>(readStoredLanguage);
  const [panelOpen, setPanelOpen] = useState(false);
  const { user: apiUser, login, logout, refreshProfile, isLoggedIn } = useAuth();

  // Sign-up form state
  const [form, setForm] = useState({
    role: "Customer" as Role | "",
    continent: "",
    country: "",
    countryIso: "",
    name: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sign-in and registration state
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [signin, setSignin] = useState({ phone: "" });
  const [signinError, setSigninError] = useState("");
  const [signinNotice, setSigninNotice] = useState("");
  const [signupError, setSignupError] = useState("");

  // OTP verification — this is where the JWT for the apply flow is produced (both after Sign Up, whose register call sends the OTP, and after Sign In).
  const [signupBusy, setSignupBusy] = useState(false);
  const [signinBusy, setSigninBusy] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpMobile, setOtpMobile] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpBusy, setOtpBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [pendingProfile, setPendingProfile] = useState<AccountProfile | null>(null);

  const resetOtp = () => {
    setOtpOpen(false);
    setOtpValue("");
    setOtpError("");
    setResendMsg("");
    setPendingProfile(null);
  };

  // Location masters
  const [continents, setContinents] = useState<Continent[]>([]);
  const [continentsLoading, setContinentsLoading] = useState(true);
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const suppressReopen = useRef(false);

  // A loan product was clicked while logged out — open this panel centrally.
  useEffect(() => {
    const handler = () => {
      if (suppressReopen.current) {
        suppressReopen.current = false;
        return;
      }
      setPanelOpen(true);
    };
    onSignUpRequested(handler);
    return () => {
      // onSignUpRequested returns a cleanup fn, but we registered via the module-level Set — best effort: the process is short-lived anyway.
    };
  }, []);

  // Load every continent once; the country list follows the chosen continent.
  useEffect(() => {
    let cancelled = false;
    fetchContinents()
      .then((list) => {
        if (!cancelled) setContinents(list);
      })
      .catch(() => {
        if (!cancelled) setContinents([]);
      })
      .finally(() => {
        if (!cancelled) setContinentsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const picked = continents.find((item) => item.name === form.continent);
    if (!picked) return;
    let cancelled = false;
    fetchCountriesByContinent(picked._id)
      .then((list) => {
        if (!cancelled) setCountries(list);
      })
      .catch(() => {
        if (!cancelled) setCountries([]);
      })
      .finally(() => {
        if (!cancelled) setCountriesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [continents, form.continent]);

  // Freeze the page behind the popup, so only the popup's own areas scroll.
  useEffect(() => {
    if (!panelOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [panelOpen]);

  // Close the panel on outside click / Escape.
  useEffect(() => {
    if (!panelOpen) return;
    const onPointerDown = (e: MouseEvent) => {

      if ((e.target as Element)?.closest?.(`[${PANEL_ATTR}], [data-role-confirm]`)) return;
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        // A product button's onClick will call requestSignUp -> setPanelOpen(true) right after this mousedown.
        suppressReopen.current = true;
        consumePendingProduct();
        resetOtp();
        setPanelOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { resetOtp(); setPanelOpen(false); }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [panelOpen]);

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSignupError("");
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const openLogin = (role: Role) => {
    setForm((current) => ({ ...current, role }));
    setMode("signin");
    setPanelOpen(true);
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.continent) next.continent = "Select a continent";
    if (!form.country) next.country = "Select a country";
    const name = form.name.trim();
    if (!name) next.name = "Enter your name";
    else if (!NAME_REGEX.test(name)) next.name = "Name must be at least 2 characters and use only letters, spaces, dots or hyphens";
    if (!MOBILE_REGEX.test(digitsOf(form.phone))) next.phone = "Enter a valid 10-digit mobile number";
    if (!EMAIL_REGEX.test(form.email.trim())) next.email = "Enter a valid email address";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    if (!validate()) return;
    const mobile = digitsOf(form.phone);
    const saved: AccountProfile = {
      name: form.name.trim(),
      role: form.role as Role,
      country: form.country,
      countryIso: form.countryIso,
      phone: mobile,
      email: form.email.trim(),
    };
    const payload: RegisterPayload = {
      name: saved.name,
      mobile,
      email: saved.email,
      role: saved.role,
      continent: form.continent,
      country: saved.country,
    };

    setSignupBusy(true);
    setSignupError("");
    try {
      const response = await registerUser(payload);
      if (!response.success) {
        setSignupError(response.message || "Could not complete the registration. Please try again.");
        return;
      }
    } catch (err) {
      setSignupError(getApiErrorMessage(err, "Could not complete the registration. Please try again."));
      return;
    } finally {
      setSignupBusy(false);
    }

    // Registration sent the OTP. Hold the profile for verification and open
    // that step directly so the user does not request a duplicate OTP.
    setPendingProfile(saved);
    setSignin({ phone: mobile });
    setSigninError("");
    setSigninNotice("");
    setOtpMobile(mobile);
    setOtpValue("");
    setOtpError("");
    setResendMsg("");
    setOtpOpen(true);
  };

  // Cancel dismisses the panel the same way a backdrop click does — including dropping a pending "Apply Now" product so a later sign-up doesn't open it.
  const onCancel = () => {
    consumePendingProduct();
    setErrors({});
    resetOtp();
    setPanelOpen(false);
  };

  const onSignInSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const phone = digitsOf(signin.phone);
    if (phone.length !== 10) {
      setSigninError("Enter your 10-digit mobile number");
      return;
    }
    // `indexia_account` is the older sign-up-gating record (loan apply flow). It is NOT the
    // auth source of truth. A real customer may have no local record and still sign in via
    // OTP — the backend decides whether the mobile is registered. We only refuse to send the
    // OTP when the mobile is clearly invalid; everything else is handled by /auth/login.
    setSigninError("");
    setSigninNotice("");
    setSigninBusy(true);
    try {
      const response = await loginUser({ mobile: phone });
      if (!response.success) {
        if (isUnregisteredMobileError(response)) {
          setForm((current) => ({ ...current, phone }));
          setSignin({ phone });
          setErrors({});
          setSignupError("");
          setMode("signup");
          return;
        }
        setSigninError(response.message || "Could not send the OTP. Please try again.");
        return;
      }
    } catch (err) {
      if (isUnregisteredMobileError(err)) {
        setForm((current) => ({ ...current, phone }));
        setSignin({ phone });
        setErrors({});
        setSignupError("");
        setMode("signup");
        return;
      }
      setSigninError(getApiErrorMessage(err, "Could not send the OTP. Please try again."));
      return;
    } finally {
      setSigninBusy(false);
    }

    setOtpMobile(phone);
    setOtpValue("");
    setOtpError("");
    setResendMsg("");
    setOtpOpen(true);
    // Drop any leftover pending profile from a previous registration attempt.
    setPendingProfile(null);
    setOtpMobile(phone);
    setOtpValue("");
    setOtpError("");
    setResendMsg("");
    setOtpOpen(true);
  };


  // Verify the OTP — success stores the session (JWT + record) and lets any pending "Apply Now" continue into the application modal.
  const onOtpVerify = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const code = otpValue.trim();
    if (!code) { setOtpError("Please enter the OTP"); return; }
    if (!/^\d{4,8}$/.test(code)) { setOtpError("Enter a valid OTP"); return; }

    setOtpBusy(true);
    setOtpError("");
    try {
      const res = await verifyOTP({ mobile: otpMobile, otp: code });
      if (!res.success || !res.token || !res.user) {
        setOtpError("The verification response was incomplete. Check the code and try again.");
        return;
      }
      login(res.token, res.user);
      const roleFromApi = normalizeRole(res.user?.role);
      if (roleFromApi) {
        const base = pendingProfile ?? readAccountRecord();
        const apiProfile: AccountProfile = {
          name: res.user.name?.trim() || base?.name || "",
          role: roleFromApi,
          country: base?.country || res.user.country || "",
          countryIso: base?.countryIso ?? "",
          phone: (res.user.mobile ?? base?.phone ?? "").trim(),
          email: (res.user.email ?? base?.email ?? "").trim(),
        };
        writeStoredProfile(apiProfile);
        setProfile(apiProfile);
        consumePendingProduct();
      } else if (pendingProfile) {
        writeStoredProfile(pendingProfile);
        setProfile(pendingProfile);
        consumePendingProduct();
      } else {
        const stored = readAccountRecord();
        startSession();
        if (stored) setProfile(stored);
      }
      setOtpOpen(false);
      setOtpValue("");
      setPendingProfile(null);
      setPanelOpen(false);
      emitAccountReady();
    } catch (err) {
      const msg = getApiErrorMessage(err, "Invalid OTP. Please try again.");
      setOtpError(msg);
    } finally {
      setOtpBusy(false);
    }
  };

  const onOtpResend = async () => {
    if (!otpMobile) return;
    setResending(true);
    setOtpError("");
    setResendMsg("");
    try {
      await loginUser({ mobile: otpMobile });
      setResendMsg("OTP resent successfully!");
      setTimeout(() => setResendMsg(""), 3000);
    } catch (err) {
      const msg = getApiErrorMessage(err, "Failed to resend OTP.");
      setOtpError(msg);
    } finally {
      setResending(false);
    }
  };

  const onLanguage = (code: string) => {
    setLanguage(code);
    writeStoredLanguage(code);
  };

  const onSignOut = () => {
    endSession();
    logout();
    setProfile(null);
    setPanelOpen(false);
  };

  const apiRole = normalizeRole(apiUser?.role);
  // The stored record is primary, but an API-only session (or a record made
  // before region data existed) can miss the country the profile API already
  // reports — fall back to it so the menu is never blank.
  const apiCountry = apiUser?.country?.trim() || "";
  const account: AccountProfile | null = profile
    ? apiCountry && !profile.country
      ? { ...profile, country: apiCountry }
      : profile
    : apiUser
      ? {
        name: apiUser.name?.trim() ?? "",
        role: apiRole ?? "Customer",
        country: apiCountry,
        countryIso: "",
        phone: apiUser.mobile ?? "",
        email: apiUser.email ?? "",
      }
      : null;

  // Once the profile API fills in a country the stored record lacks, persist it
  // so every other consumer (application modal, loan forms) sees the same value.
  // The menu itself renders the merged view derived above, so only storage needs
  // updating here.
  useEffect(() => {
    if (!profile || profile.country || !apiCountry) return;
    writeStoredProfile({ ...profile, country: apiCountry });
  }, [profile, apiCountry]);

  // A session stored before the backend reported region data has no country in
  // either place — ask the profile API once for a fresh copy. The refresh
  // updates `user`, which re-renders the merged view above. Signed-out visitors
  // never hit the profile API; there is no session for it to read.
  useEffect(() => {
    if (!isLoggedIn) return;
    if (profile?.country || apiCountry) return;
    refreshProfile().catch(() => {
      // An expired token is cleared by the axios interceptor; nothing to do here.
    });
    // Runs once on mount; refreshProfile from context is intentionally not a dep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The backend keeps the country name but not the flag code, and only the
  // sign-up form ever stores an ISO — resolve it from location masters so
  // API-signed-in sessions get their flag too.
  const [resolvedIso, setResolvedIso] = useState("");
  const flagIso = account?.countryIso || resolvedIso;
  useEffect(() => {
    const name = account?.country ?? "";
    if (!name || account?.countryIso) return;
    let cancelled = false;
    resolveCountryIso(name)
      .then((iso) => {
        if (!iso || cancelled) return;
        setResolvedIso(iso);
        const stored = readAccountRecord();
        if (stored && !stored.countryIso) writeStoredProfile({ ...stored, countryIso: iso });
      })
      .catch(() => {
        // Masters unreachable — the country name alone still shows.
      });
    return () => {
      cancelled = true;
    };
  }, [account?.country, account?.countryIso]);

  const displayRole = apiRole ?? account?.role ?? "";

  // ── Signed in: flag + country on the left, initials on the right ────────────

  if (account) {
    return (
      <div ref={rootRef} className="relative">
        <button
          onClick={() => setPanelOpen((open) => !open)}
          aria-expanded={panelOpen}
          aria-label="Account"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-2 py-1.5 transition-all duration-200 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            {flagIso && (
              <span className={`fi fi-${flagIso} text-lg rounded-sm overflow-hidden block`} />
            )}
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
              {account.country}
            </span>
          </span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white ring-2 ring-emerald-500/20">
            {initialsOf(account.name)}
          </span>
          <Chevron open={panelOpen} />
        </button>

        {panelOpen && (
          <div className="absolute right-0 top-12 z-60 w-72.5 rounded-2xl bg-white/95 shadow-2xl ring-1 ring-white/60 backdrop-blur-2xl p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                  {initialsOf(account.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{account.name}</p>
                  <p className="truncate text-xs text-slate-500">{account.email}</p>
                  <p className="truncate text-xs text-slate-500">{account.phone}</p>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-b border-slate-100 text-xs">
                <div className="min-w-0">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</dt>
                  <dd className="truncate font-semibold text-slate-700">{displayRole}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Country</dt>
                  <dd className="flex items-center gap-1 truncate font-semibold text-slate-700">
                    {flagIso && (
                      <span className={`fi fi-${flagIso} text-sm rounded-sm overflow-hidden block`} />
                    )}
                    {account.country}
                  </dd>
                </div>
              </dl>

              <div className="border-t border-slate-100 pt-3">
                <Label>Language</Label>
                <div className="flex flex-wrap gap-1.5">
                  {LANGUAGES.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => onLanguage(item.code)}
                      title={item.label}
                      aria-pressed={language === item.code}
                      className={
                        language === item.code
                          ? "min-w-11 rounded-lg border border-emerald-500 bg-emerald-500 px-2.5 py-1.5 text-[11px] font-semibold text-white cursor-pointer"
                          : "min-w-11 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors duration-150 cursor-pointer hover:bg-slate-50"
                      }
                    >
                      {item.short}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={onSignOut}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition-colors duration-150 hover:border-red-300 hover:bg-red-100 cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Signed out ──────────────────────────────────────────────────────────────
  return (
    <div ref={rootRef} className="relative flex items-center gap-2">
      <button type="button" onClick={() => openLogin("Customer")} className="rounded-xl border border-(--brand-teal) bg-linear-to-r from-(--brand-navy) to-(--brand-dark) px-2 sm:px-3 py-2 text-[10px] sm:text-xs font-semibold text-white shadow-md transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33) cursor-pointer whitespace-nowrap">
        Customer Login
      </button>
      <button type="button" onClick={() => openLogin("Franchise")} className="rounded-xl border border-(--brand-teal) bg-(--brand-teal) px-2 sm:px-3 py-2 text-[10px] sm:text-xs font-semibold text-white shadow-md transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33) cursor-pointer whitespace-nowrap">
        Franchise Login
      </button>
      {panelOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-90 bg-black/50 backdrop-blur-sm"
              onClick={() => setPanelOpen(false)}
            />

            <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4" data-account-panel style={{ zIndex: 100 }}>
              <div className="auth-popup-card w-full max-w-lg min-w-0 flex flex-col shadow-2xl rounded-2xl overflow-hidden">

                <div className="flex-1 w-full min-w-0 min-h-0 flex flex-col bg-white overflow-hidden">
                  <div className="h-1 w-full shrink-0 bg-(--brand-teal)" />
                  <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 md:px-6 md:py-5">
                    {otpOpen && (
                      <form onSubmit={onOtpVerify} className="space-y-3.5">
                        <div className="text-center pt-1">
                          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-(--brand-navy-22) bg-(--brand-navy-14)">
                            <svg className="h-6 w-6 text-(--brand-navy)" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18h3" />
                            </svg>
                          </div>
                          <p className="text-sm text-slate-500">One-time password sent to</p>
                          <p className="text-base font-bold text-slate-900">+91 {otpMobile}</p>
                        </div>

                        <div>
                          <Label>Enter OTP</Label>
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otpValue}
                            // Auto-stop: keep digits only and never grow past 6, so a 7th keypress (or a pasted longer code) is discarded.
                            onChange={(e) => {
                              setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6));
                              setOtpError("");
                            }}
                            placeholder="• • • • • •"
                            disabled={otpBusy}
                            autoFocus
                            className={`w-full rounded-xl border px-3 py-3 text-center text-xl font-bold tracking-[0.4em] text-slate-800 shadow-sm outline-none transition focus:ring-2 focus:ring-emerald-400/25 disabled:bg-slate-100 ${otpError ? "border-red-400 bg-red-50/30" : "border-slate-300 focus:border-emerald-400"}`}
                          />
                          {resendMsg && <p className="mt-1 text-[11px] font-medium text-emerald-600">{resendMsg}</p>}
                        </div>

                        <div className="flex gap-3 pt-1">
                          <button type="button"
                            onClick={() => { setOtpOpen(false); setOtpValue(""); setOtpError(""); setPendingProfile(null); }}
                            disabled={otpBusy}
                            className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-200">
                            ← Back
                          </button>
                          <Button type="submit" className="flex-1"
                            disabled={otpBusy || otpValue.length < 6}>
                            {otpBusy ? "Verifying…" : "Verify & Continue →"}
                          </Button>
                        </div>

                        <p className="text-center text-xs text-slate-400">
                          Didn't get it?{' '}
                          <button type="button" onClick={onOtpResend} disabled={resending || otpBusy}
                            className="font-semibold text-(--brand-navy) hover:underline disabled:opacity-40 cursor-pointer">
                            {resending ? "Resending…" : "Resend OTP"}
                          </button>
                        </p>
                      </form>
                    )}

                    {mode === "signin" && !otpOpen && (
                      <form onSubmit={onSignInSubmit} className="space-y-3.5">
                        {signinNotice && (
                          <p
                            role="status"
                            className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[11.5px] leading-snug text-emerald-800"
                          >
                            <span className="shrink-0" aria-hidden="true">&#x2705;</span>
                            <span>
                              <strong>{signinNotice}</strong> We&apos;ll send a one-time password to this number.
                            </span>
                          </p>
                        )}
                        <div className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5">
                          <Label>Mobile Number</Label>
                          <div className={`flex items-center overflow-hidden rounded-xl border bg-white ${signinError ? "border-red-400" : "border-slate-200"}`}>
                            <span className="shrink-0 whitespace-nowrap border-r border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">&#x1F1EE;&#x1F1F3; +91</span>
                            <input type="tel" inputMode="numeric" maxLength={10} value={signin.phone}
                              placeholder="10-digit registered mobile"
                              onChange={(e) => { setSignin({ phone: e.target.value.replace(/[\D]/g, "").slice(0, 10) }); setSigninError(""); }}
                              className="w-full bg-transparent px-3 py-2 text-sm text-slate-700 outline-none" />
                          </div>
                          {signinError && <p className="mt-1 text-[10px] font-medium text-red-500">{signinError}</p>}
                        </div>
                        <div className="flex gap-3 pt-1">
                          <button type="button" onClick={onCancel}
                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600
                              border border-slate-300 hover:bg-slate-50 transition cursor-pointer
                              focus:outline-none focus:ring-2 focus:ring-slate-200">
                            Cancel
                          </button>
                          <Button type="submit" className="flex-1" loading={signinBusy}>
                            {signinBusy ? "Sending OTP…" : "Sign In"}
                          </Button>
                        </div>
                      </form>
                    )}

                    {!otpOpen && mode === "signup" && (
                      <form onSubmit={onSubmit} className="space-y-3">
                        <div>
                          <Label>Your details</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <input className={fieldClass} value={form.name} placeholder="Full name as per PAN card" autoComplete="name"
                                onChange={(e) => setField("name", e.target.value)} />
                              {errors.name && <p className="mt-0.5 text-[10px] font-medium text-red-500">{errors.name}</p>}
                            </div>
                            <div>
                              <div className={`flex items-center overflow-hidden rounded-xl border bg-white/80 shadow-sm transition focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/25 ${errors.phone ? "border-red-400" : "border-slate-200"}`}>
                                <span className="shrink-0 whitespace-nowrap border-r border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700" aria-hidden="true">🇮🇳 +91</span>
                                <input className="w-full bg-transparent px-3 py-2 text-sm text-slate-700 outline-none" value={form.phone} type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile number" autoComplete="tel"
                                  onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} />
                              </div>
                              {errors.phone && <p className="mt-0.5 text-[10px] font-medium text-red-500">{errors.phone}</p>}
                            </div>
                            <div className="col-span-2">
                              <input className={fieldClass} value={form.email} type="email" placeholder="Email" autoComplete="email"
                                onChange={(e) => setField("email", e.target.value)} />
                              {errors.email && <p className="mt-0.5 text-[10px] font-medium text-red-500">{errors.email}</p>}
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label>Location</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Combo value={form.continent} options={continents.map((c) => c.name)}
                              placeholder={continentsLoading ? "Loading..." : "Select continent"}
                              disabled={continentsLoading}
                              onChange={(v) => {
                                const picked = continents.find((item) => item.name === v);
                                setForm((p) => ({ ...p, continent: v, country: "", countryIso: "" }));
                                setCountries([]);
                                setCountriesLoading(!!picked);
                                setErrors((p) => {
                                  const next = { ...p };
                                  delete next.continent;
                                  delete next.country;
                                  return next;
                                });
                              }} />
                            <Combo value={form.country} options={countries.map((c) => c.name)}
                              placeholder={!form.continent ? "Pick a continent" : countriesLoading ? "Loading..." : "Select country"}
                              disabled={!form.continent || countriesLoading}
                              onChange={(v) => { const picked = countries.find((c) => c.name === v); setForm((p) => ({ ...p, country: v, countryIso: picked?.isoCode?.toLowerCase() ?? "" })); setErrors((p) => ({ ...p, country: "" })); }} />
                          </div>
                          {(errors.continent || errors.country) && <p className="mt-0.5 text-[10px] font-medium text-red-500">{errors.continent || errors.country}</p>}
                        </div>

                        {signupError && (
                          <p className="rounded-xl border border-red-200 bg-(--form-error-bg) px-3 py-2 text-[11px] font-medium text-red-600">
                            {signupError}
                          </p>
                        )}

                        <div className="flex gap-3 pt-1">
                          <button type="button" onClick={onCancel} disabled={signupBusy}
                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600
                              border border-slate-300 hover:bg-slate-50 transition cursor-pointer
                              disabled:opacity-50 disabled:cursor-not-allowed
                              focus:outline-none focus:ring-2 focus:ring-slate-200">
                            Cancel
                          </button>
                          <Button type="submit" className="flex-1" loading={signupBusy}>
                            {signupBusy ? "Registering…" : "Submit"}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}

    </div>
  );
};

export default AccountMenu;
