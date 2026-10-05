import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { fetchContinents, fetchCountriesByContinent, verifyPincode } from "../api/masters";
import type { Country } from "../api/masters";
import { useMasters } from "../hooks/useMasters";
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
import { emitAccountReady, onSignUpRequested } from "../utils/signInGate";

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

const ROLES: { role: Role; blurb: string; icon: string }[] = [
  {
    role: "Customer",
    blurb: "Apply for loans and track your applications",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  },
  {
    role: "Franchisee",
    blurb: "Partner with us and grow your network",
    icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z",
  },
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

const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
const digitsOf = (value: string) => value.replace(/\D/g, "");

/** Same shape the application form's PincodeInputField accepts. */
const PINCODE_REGEX = /^[1-9]\d{5}$/;
const PINCODE_DEBOUNCE_MS = 600;

// ── Small presentational pieces ───────────────────────────────────────────────
const Chevron = ({ open }: { open: boolean }) => (
  <svg
    className={`h-3 w-3 text-slate-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
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

/** Marks portalled surfaces so the outside-click listener ignores clicks in them. */
const PANEL_ATTR = "data-account-panel";

/** Select when options exist, free-text input otherwise. */  const Combo = ({
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
  if (options.length === 0) {
    return (
      <input
        className={fieldClass}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  // A pincode can resolve to a place the masters list hasn't loaded (or that
  // isn't in it at all) — keep the resolved value selectable so it still shows.
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
};

// ── Component ─────────────────────────────────────────────────────────────────
const AccountMenu = () => {
  const [profile, setProfile] = useState<AccountProfile | null>(readStoredProfile);
  const [language, setLanguage] = useState<string>(readStoredLanguage);
  const [panelOpen, setPanelOpen] = useState(false);
  const { logout } = useAuth();

  // Sign-up form state
  const [form, setForm] = useState({
    role: "" as Role | "",
    country: "",
    countryIso: "",
    state: "",
    city: "",
    pincode: "",
    name: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pinNote, setPinNote] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmRole, setConfirmRole] = useState<Role | null>(null);

  // Sign In / Sign Up tabs
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [signin, setSignin] = useState({ phone: "" });
  const [signinError, setSigninError] = useState("");

  // Location masters
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const { masters, loadCities } = useMasters();

  const rootRef = useRef<HTMLDivElement>(null);

  // A loan product was clicked while logged out — open this panel centrally.
  useEffect(() => onSignUpRequested(() => setPanelOpen(true)), []);

  // Load every country once, flattened across continents.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const continents = await fetchContinents();
        const nested = await Promise.all(
          continents.map(async (continent) => fetchCountriesByContinent(continent._id))
        );
        if (!cancelled) setCountries(nested.flat());
      } catch {
        if (!cancelled) setCountries([]);
      } finally {
        if (!cancelled) setCountriesLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Cities follow the chosen state (India-seeded masters). `loadCities` returns
  // [] on the first call and re-renders once the fetch lands, which changes its
  // identity — so deriving here stays in step with the async city list.
  const cities = useMemo<string[]>(
    () => (form.state ? loadCities(form.state) : []),
    [form.state, loadCities]
  );

  // Country name (as the pincode API spells it) -> flag code for the header.
  const isoByCountry = useMemo(
    () => new Map(countries.map((c) => [c.name.trim().toLowerCase(), (c.isoCode ?? "").toLowerCase()])),
    [countries]
  );

  // Close the panel on outside click / Escape.
  useEffect(() => {
    if (!panelOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      // The panel and the role dialog are portalled to <body>, so their clicks
      // land outside `rootRef` — ignore them or the panel would close itself.
      if ((e.target as Element)?.closest?.(`[${PANEL_ATTR}], [data-role-confirm]`)) return;
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setPanelOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanelOpen(false);
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
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const requestRole = (role: Role) => {
    if (form.role === role) return;
    setConfirmRole(role);
  };

  const applyRole = () => {
    if (!confirmRole) return;
    setField("role", confirmRole);
    setConfirmRole(null);
  };

  // A pincode pins down the location, so city, state and country all follow it
  // as soon as the sixth digit lands — no blur needed.
  useEffect(() => {
    const pin = form.pincode.trim();
    // The input clears the note on every keystroke, so an incomplete pincode
    // just means "nothing to look up".
    if (!PINCODE_REGEX.test(pin)) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const result = await verifyPincode(pin);
        if (cancelled) return;
        if (result.exists && result.info) {
          const { city, state, country } = result.info;
          setPinNote({ ok: true, text: `${city}, ${state}, ${country}` });
          setForm((prev) => ({
            ...prev,
            city,
            state,
            country,
            countryIso: isoByCountry.get(country.trim().toLowerCase()) ?? "",
          }));
        } else {
          setPinNote({ ok: false, text: result.message || "Pincode not found" });
        }
      } catch {
        if (!cancelled) setPinNote({ ok: false, text: "Couldn't verify pincode" });
      }
    }, PINCODE_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [form.pincode, isoByCountry]);

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.role) next.role = "Select a role to continue";
    if (!form.country) next.country = "Select a country";
    if (!form.state.trim()) next.state = "Enter your state";
    if (!form.city.trim()) next.city = "Enter your city";
    if (!digitsOf(form.pincode)) next.pincode = "Enter your pincode";
    if (!form.name.trim()) next.name = "Enter your name";
    if (digitsOf(form.phone).length !== 10) next.phone = "Enter a valid 10-digit mobile number";
    if (!emailOk(form.email.trim())) next.email = "Enter a valid email address";
    setErrors(next);
    if (next.pincode) return false;
    if (pinNote && !pinNote.ok) {
      return false;
    }
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    if (!validate()) return;
    const saved: AccountProfile = {
      name: form.name.trim(),
      role: form.role as Role,
      country: form.country,
      countryIso: form.countryIso,
      state: form.state.trim(),
      city: form.city.trim(),
      pincode: form.pincode.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
    };
    writeStoredProfile(saved);
    setProfile(saved);
    setPanelOpen(false);
    emitAccountReady();
  };

  const switchMode = (next: "signup" | "signin") => {
    setMode(next);
    setErrors({});
    setPinNote(null);
    setSigninError("");
  };

  const onSignInSubmit = (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const phone = digitsOf(signin.phone);
    if (phone.length !== 10) {
      setSigninError("Enter your 10-digit mobile number");
      return;
    }
    const stored = readAccountRecord();
    if (!stored || digitsOf(stored.phone) !== phone) {
      setSigninError("No account found for this mobile number. Please sign up.");
      return;
    }
    setSigninError("");
    // The record already exists from a previous sign-up — restore the session.
    startSession();
    setProfile(stored);
    setPanelOpen(false);
    emitAccountReady();
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

  const stateOptions = useMemo<string[]>(() => [...(masters.states ?? [])], [masters.states]);

  // ── Signed in: flag + country on the left, initials on the right ────────────
  if (profile) {
    return (
      <div ref={rootRef} className="relative">
        <button
          onClick={() => setPanelOpen((open) => !open)}
          aria-expanded={panelOpen}
          aria-label="Account"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-2 py-1.5 transition-all duration-200 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            {profile.countryIso && (
              <span className={`fi fi-${profile.countryIso} text-lg rounded-sm overflow-hidden block`} />
            )}
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
              {profile.country}
            </span>
          </span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white ring-2 ring-emerald-500/20">
            {initialsOf(profile.name)}
          </span>
          <Chevron open={panelOpen} />
        </button>

        {panelOpen && (
          <div className="absolute right-0 top-12 z-60 w-72.5 rounded-2xl bg-white/95 shadow-2xl ring-1 ring-white/60 backdrop-blur-2xl p-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                {initialsOf(profile.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">{profile.name}</p>
                <p className="truncate text-xs text-slate-500">{profile.email}</p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-b border-slate-100 py-3 text-xs">
              <div className="min-w-0">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</dt>
                <dd className="truncate font-semibold text-slate-700">{profile.role}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Country</dt>
                <dd className="flex items-center gap-1 truncate font-semibold text-slate-700">
                  {profile.countryIso && (
                    <span className={`fi fi-${profile.countryIso} text-sm rounded-sm overflow-hidden block`} />
                  )}
                  {profile.country}
                </dd>
              </div>
            </dl>

            <div className="pt-3">
              <Label>Language</Label>
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => onLanguage(item.code)}
                    title={item.label}
                    aria-pressed={language === item.code}
                    className={`min-w-11 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-colors duration-150 cursor-pointer ${
                      language === item.code
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {item.short}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onSignOut}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition-colors duration-150 hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Sign out
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Signed out: Sign In / Sign Up ───────────────────────────────────────────
  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setPanelOpen((open) => !open)}
        aria-expanded={panelOpen}
        aria-label="Sign In or Sign Up"
        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/60 px-3 py-2 transition-all duration-200 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 cursor-pointer"
      >
        <svg className="h-4 w-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.118a7.5 7.5 0 0115 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.5-1.632z" />
        </svg>
        <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">Sign In / Sign Up</span>
        <Chevron open={panelOpen} />
      </button>

      {panelOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-65 bg-slate-900/50 backdrop-blur-[2px]"
              onClick={() => setPanelOpen(false)}
            />
            <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
              <div
                className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-label={mode === "signup" ? "Sign up" : "Sign in"}
                {...{ [PANEL_ATTR]: true }}
              >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  {mode === "signup" ? "Create your account" : "Welcome back"}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {mode === "signup"
                    ? "Sign up to apply for a loan."
                    : "Sign in with the mobile number you registered with."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                aria-label="Close"
                className="-mr-1 -mt-1 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ── Sign In / Sign Up switch ── */}
            <div className="mt-4 flex rounded-xl border border-slate-200 bg-slate-50 p-1" role="tablist">
              {(["signup", "signin"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                    mode === m ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {m === "signup" ? "✨ Sign Up" : "🔑 Sign In"}
                </button>
              ))}
            </div>

            {mode === "signin" ? (
              /* ── SIGN IN ── */
              <form onSubmit={onSignInSubmit} className="mt-4 space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white/80 px-3 py-3">
                  <Label>Mobile Number</Label>
                  <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <span className="shrink-0 whitespace-nowrap border-r border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">🇮🇳 +91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={signin.phone}
                      placeholder="10-digit mobile number"
                      onChange={(e) => {
                        setSignin({ phone: e.target.value.replace(/\D/g, "") });
                        setSigninError("");
                      }}
                      className="w-full bg-transparent px-3 py-2 text-sm text-slate-700 outline-none"
                    />
                  </div>
                  {signinError && <p className="mt-1.5 text-[11px] font-medium text-red-500">{signinError}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 cursor-pointer"
                >
                  Sign In
                </button>

                <p className="text-center text-xs text-slate-400">
                  New to Indexia?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className="font-semibold text-emerald-600 hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              </form>
            ) : (
              /* ── SIGN UP ── */
              <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] leading-snug text-amber-800">
              <span className="shrink-0">📄</span>
              <span>
                Enter your details <strong>exactly as they appear on your PAN card</strong> — these are
                carried over to your loan application and cannot be edited there.
              </span>
            </p>

            {/* ── Role ── */}
            <fieldset>
              <Label>Role</Label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(({ role, blurb, icon }) => {
                  const active = form.role === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => requestRole(role)}
                      aria-pressed={active}
                      className={`rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer ${
                        active
                          ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/25"
                          : "border-slate-200 bg-white/80 hover:border-emerald-300 hover:bg-emerald-50/40"
                      }`}
                    >
                      <span
                        className={`mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg ${
                          active ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                        </svg>
                      </span>
                      <span className="block text-xs font-bold text-slate-800">{role}</span>
                      <span className="mt-0.5 block text-[10px] leading-snug text-slate-500">{blurb}</span>
                    </button>
                  );
                })}
              </div>
              {errors.role && <p className="mt-1.5 text-[11px] font-medium text-red-500">{errors.role}</p>}
            </fieldset>

            {/* ── Location ── */}
            <fieldset>
              <Label>Location</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <Combo
                    value={form.country}
                    options={countries.map((country) => country.name)}
                    placeholder={countriesLoading ? "Loading countries…" : "Select country"}
                    onChange={(value) => {
                      const picked = countries.find((country) => country.name === value);
                      setForm((prev) => ({
                        ...prev,
                        country: value,
                        countryIso: picked?.isoCode?.toLowerCase() ?? "",
                      }));
                      setErrors((prev) => ({ ...prev, country: "" }));
                    }}
                  />
                  {errors.country && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.country}</p>}
                </div>
                <Combo
                  value={form.state}
                  options={stateOptions}
                  placeholder="State"
                  onChange={(value) => setField("state", value)}
                />
                <Combo
                  value={form.city}
                  options={cities}
                  placeholder="City"
                  onChange={(value) => setField("city", value)}
                />
                <div className="col-span-2">
                  <input
                    className={fieldClass}
                    value={form.pincode}
                    inputMode="numeric"
                    placeholder="Pincode"
                    onChange={(e) => {
                      setPinNote(null);
                      setField("pincode", e.target.value);
                    }}
                  />
                  {errors.pincode && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.pincode}</p>}
                  {pinNote && !errors.pincode && (
                    <p className={`mt-1 text-[11px] font-medium ${pinNote.ok ? "text-emerald-600" : "text-red-500"}`}>
                      {pinNote.text}
                    </p>
                  )}
                </div>
              </div>
              {errors.state && <p className="mt-1.5 text-[11px] font-medium text-red-500">{errors.state}</p>}
              {errors.city && <p className="mt-1.5 text-[11px] font-medium text-red-500">{errors.city}</p>}
            </fieldset>

            {/* ── Contact ── */}
            <fieldset>
              <Label>Your details</Label>
              <div className="space-y-2">
                <div>
                  <input
                    className={fieldClass}
                    value={form.name}
                    placeholder="Name"
                    autoComplete="name"
                    onChange={(e) => setField("name", e.target.value)}
                  />
                  {errors.name && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <input
                    className={fieldClass}
                    value={form.phone}
                    inputMode="numeric"
                    placeholder="Phone / Mobile Number"
                    autoComplete="tel"
                    onChange={(e) => setField("phone", e.target.value)}
                  />
                  {errors.phone && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.phone}</p>}
                </div>
                <div>
                  <input
                    className={fieldClass}
                    value={form.email}
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    onChange={(e) => setField("email", e.target.value)}
                  />
                  {errors.email && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.email}</p>}
                </div>
              </div>
            </fieldset>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 cursor-pointer"
            >
              Submit
            </button>
          </form>
            )}
              </div>
            </div>
          </>,
          document.body
        )}

      {/* ── Role confirmation ── */}
      {confirmRole &&
        createPortal(
        <div
          className="fixed inset-0 z-80 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm role"
          data-role-confirm
          onClick={() => setConfirmRole(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </span>
            <h3 className="text-base font-bold text-slate-800">Confirm your role</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              You have selected <span className="font-semibold text-slate-800">{confirmRole}</span>. This role{" "}
              <span className="font-semibold text-slate-800">cannot be changed later</span>, for more details
              contact us.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmRole(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
              >
                Go back
              </button>
              <button
                type="button"
                onClick={applyRole}
                className="flex-1 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600 cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>,
          document.body
        )}
    </div>
  );
};

export default AccountMenu;