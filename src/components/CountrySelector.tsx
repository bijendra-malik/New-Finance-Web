import { useEffect, useRef, useState } from "react";
import { fetchContinents, fetchCountriesByContinent } from "../api/masters";
import type { Country } from "../api/masters";

// ── Static data ─────────────────────────────────────────────────────
// Live continents, countries and flags all come from the masters API;
// continents the backend doesn't serve (yet) stay as static "coming soon" rows.
const STATIC_CONTINENTS = [
  "Africa",
  "North America",
  "South America",
  "Antarctica",
  "Europe",
  "Australia",
] as const;

type LiveContinent = { name: string; countries: Country[] };
type SelectedLocation = { name: string; isoCode: string | null };

// Flag-icons ISO code, straight from the API's isoCode field.
const flagCodeFor = (country: Country): string =>
  country.isoCode?.toLowerCase() || "";

// ── Component ─────────────────────────────────────────────────────────
const CountrySelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openContinent, setOpenContinent] = useState<string | null>(null);
  const [live, setLive] = useState<LiveContinent[]>([]);
  const [comingSoon, setComingSoon] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<SelectedLocation | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load continents + their countries from the masters API once on mount.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const continents = await fetchContinents();
        const located = await Promise.all(
          continents.map(async (continent) => ({
            name: continent.name,
            countries: await fetchCountriesByContinent(continent._id),
          }))
        );
        if (cancelled) return;
        const liveList = located.filter((c) => c.countries.length > 0);
        const apiNames = new Set(located.map((c) => c.name));
        setLive(liveList);
        // API continents without countries + static list, minus anything live.
        setComingSoon([
          ...located.filter((c) => c.countries.length === 0).map((c) => c.name),
          ...STATIC_CONTINENTS.filter((name) => !apiNames.has(name)),
        ]);
      } catch {
        if (!cancelled) {
          // No fallback data — the dropdown just stays empty for live locations.
          setLive([]);
          setComingSoon([...STATIC_CONTINENTS]);
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Close on outside click.
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setOpenContinent(null);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen]);

  const closeAll = () => {
    setIsOpen(false);
    setOpenContinent(null);
  };

  const selectCountry = (country: Country) => {
    setSelected({ name: country.name, isoCode: flagCodeFor(country) });
    closeAll();
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* ── Trigger button (flag + country name) ── */}
      <button
        onClick={() => { setIsOpen(!isOpen); setOpenContinent(null); }}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-white/60 hover:bg-white border border-slate-200 transition-all duration-200 hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1"
        aria-label="Select Location"
        aria-expanded={isOpen}
      >
        {selected ? (
          <>
            {selected.isoCode && (
              <span className={`fi fi-${selected.isoCode} text-lg rounded-sm overflow-hidden block`} />
            )}
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">{selected.name}</span>
          </>
        ) : (
          <>
            <svg className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
              <path strokeLinecap="round" d="M3 12h18M12 3c2.49 2.49 3.5 5.5 3.5 9s-1.01 6.51-3.5 9c-2.49-2.49-3.5-5.5-3.5-9s1.01-6.51 3.5-9z" />
            </svg>
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Select Location</span>
          </>
        )}
        <svg
          className={`h-3 w-3 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {/* ── Dropdown panel — continents → countries ── */}
      {isOpen && (
        <div
          className="absolute right-0 top-11 z-9999 rounded-2xl shadow-2xl ring-1 ring-white/60 bg-white/90 backdrop-blur-2xl overflow-visible"
          style={{ minWidth: 210 }}
        >
          <div className="py-2" style={{ width: 210 }}>
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400/90">
              Location
            </p>

            {!loaded ? (
              <div className="px-3 py-2">
                <span className="text-xs text-slate-400 animate-pulse">Loading locations…</span>
              </div>
            ) : (
              <>
                {live.length === 0 && (
                  <div className="px-3 py-2">
                    <span className="text-xs text-slate-400">Couldn't load locations</span>
                  </div>
                )}

                {/* Continents with live countries: open a country flyout. */}
                {live.map(({ name: continent, countries }) => (
                  <div
                    key={continent}
                    className="relative"
                    onMouseEnter={() => setOpenContinent(continent)}
                    onMouseLeave={() => setOpenContinent((cur) => (cur === continent ? null : cur))}
                  >
                    <button
                      onClick={() => setOpenContinent(continent)}
                      className={`flex items-center gap-2 px-3 py-2 w-full text-left transition-colors duration-150 cursor-pointer ${
                        openContinent === continent
                          ? "bg-emerald-500/15 text-emerald-700 font-semibold"
                          : "hover:bg-slate-900/5 text-slate-600"
                      }`}
                    >
                      <span className="text-xs font-medium flex-1">{continent}</span>
                      <svg
                        className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${openContinent === continent ? "rotate-90" : ""}`}
                        viewBox="0 0 20 20" fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L10.745 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {/* Country flyout */}
                    {openContinent === continent && (
                      <div
                        className="absolute right-full top-0 mr-1 rounded-2xl shadow-2xl ring-1 ring-white/60 bg-white/90 backdrop-blur-2xl py-2"
                        style={{ width: 200 }}
                      >
                        <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400/90">
                          Country
                        </p>
                        {countries.map((country) => {
                          const flag = flagCodeFor(country);
                          return (
                            <div key={country._id} className="px-3 py-1.5">
                              <button
                                onClick={() => selectCountry(country)}
                                className="flex items-center gap-2 w-full text-left rounded-lg -mx-1 px-1 py-0.5 hover:bg-slate-900/5 transition-colors duration-150 cursor-pointer"
                              >
                                {flag && (
                                  <span className={`fi fi-${flag} text-base rounded-sm shrink-0`} />
                                )}
                                <span className="text-xs font-semibold text-slate-700 flex-1">{country.name}</span>
                                {selected?.name === country.name && (
                                  <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </button>
                              <p className="text-[10px] text-slate-400 mt-1">More countries coming soon</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}

                {/* Coming-soon continents: inert rows. */}
                {comingSoon.map((continent) => (
                  <div
                    key={continent}
                    className="flex items-center justify-between px-3 py-2 opacity-60 cursor-default"
                  >
                    <span className="text-xs font-medium text-slate-500">{continent}</span>
                    <span className="text-[10px] italic text-slate-400">coming soon</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
