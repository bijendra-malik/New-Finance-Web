import { useState, useRef, useEffect } from "react";

// ── Static location data ─────────────────────────────────────────────────────
// India is the only live country; other continents/countries are coming soon.
// Adding a location later = adding an entry here.
const LOCATIONS = {
  Asia: {
    India: {
      languages: ["English", "Hindi"],
    },
  },
  Africa: "coming soon",
  "North America": "coming soon",
  "South America": "coming soon",
  Antarctica: "coming soon",
  Europe: "coming soon",
  Australia: "coming soon",
} as const;

type Locations = typeof LOCATIONS;
type ContinentName = keyof Locations;
type LiveCountry = { languages: readonly string[] };

// Continents whose value is an object (i.e. they have live countries).
const LIVE_CONTINENTS = (Object.keys(LOCATIONS) as ContinentName[])
  .filter((c): c is ContinentName => typeof LOCATIONS[c] === "object")
  .map((c) => ({ name: c, countries: LOCATIONS[c] as unknown as Record<string, LiveCountry> }));

// Continents marked "coming soon".
const COMING_SOON_CONTINENTS = (Object.keys(LOCATIONS) as ContinentName[])
  .filter((c) => typeof LOCATIONS[c] === "string");

// Country name → flag-icons ISO code (extend as new countries go live).
const COUNTRY_FLAGS: Record<string, string> = { India: "in" };

// ── Component ─────────────────────────────────────────────────────────────────
const CountrySelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openContinent, setOpenContinent] = useState<ContinentName | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* ── Trigger button (flag + country name) ── */}
      <button
        onClick={() => { setIsOpen(!isOpen); setOpenContinent(null); }}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-white/60 hover:bg-white border border-slate-200 transition-all duration-200 hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1"
        aria-label="Select Location"
        aria-expanded={isOpen}
      >
        <span className="fi fi-in text-lg rounded-sm overflow-hidden block" />
        <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">India</span>
        <svg
          className={`h-3 w-3 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {/* ── Dropdown panel — continents → countries → languages ── */}
      {isOpen && (
        <div
          className="absolute right-0 top-11 z-9999 rounded-2xl shadow-2xl ring-1 ring-white/60 bg-white/90 backdrop-blur-2xl overflow-visible"
          style={{ minWidth: 210 }}
        >
          <div className="py-2" style={{ width: 210 }}>
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400/90">
              Location
            </p>

            {/* Continents with live countries: open a country flyout. */}
            {LIVE_CONTINENTS.map(({ name: continent, countries }) => (
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
                    {Object.entries(countries).map(([country, entry]) => (
                      <div key={country} className="px-3 py-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`fi fi-${COUNTRY_FLAGS[country] ?? ""} text-base rounded-sm shrink-0`} />
                          <span className="text-xs font-semibold text-slate-700 flex-1">{country}</span>
                          <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {entry.languages.map((lang) => (
                            <button
                              key={lang}
                              onClick={closeAll}
                              className="px-2 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100 cursor-pointer transition-colors duration-150"
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">More countries coming soon</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Coming-soon continents: inert rows. */}
            {COMING_SOON_CONTINENTS.map((continent) => (
              <div
                key={continent}
                className="flex items-center justify-between px-3 py-2 opacity-60 cursor-default"
              >
                <span className="text-xs font-medium text-slate-500">{continent}</span>
                <span className="text-[10px] italic text-slate-400">coming soon</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
