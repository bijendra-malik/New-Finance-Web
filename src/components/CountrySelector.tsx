import { useState, useRef, useEffect } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Country {
  code: string;      // flag-icons country code
  name: string;      // country name shown next to the flag
}

// English is the site's only and default language — this control is a country
// selector (flags with country names), not a language switcher.
const COUNTRIES: Country[] = [
  { code: 'in', name: 'India' },
];

// ── Component ─────────────────────────────────────────────────────────────────
const CountrySelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Country>(COUNTRIES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative inline-block">

      {/* ── Trigger button (flag + country name) ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-white/60 hover:bg-white border border-slate-200 transition-all duration-200 hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1"
        aria-label="Select Country"
        aria-expanded={isOpen}
      >
        <span className={`fi fi-${selected.code} text-lg rounded-sm overflow-hidden block`} />
        <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">{selected.name}</span>
        <svg
          className={`h-3 w-3 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {/* ── Dropdown panel — country list ── */}
      {isOpen && (
        <div
          className="absolute right-0 top-11 z-9999 rounded-2xl shadow-2xl ring-1 ring-white/60 bg-white/90 backdrop-blur-2xl overflow-visible"
          style={{ minWidth: 150 }}
        >
          <div className="py-2" style={{ width: 150 }}>
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400/90">
              Country
            </p>
            {COUNTRIES.map((country) => {
              const isActive = selected.code === country.code;
              return (
                <button
                  key={country.code}
                  onClick={() => { setSelected(country); setIsOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-2 w-full text-left transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-700 font-semibold'
                      : 'hover:bg-slate-900/5 text-slate-600'
                  }`}
                >
                  <span className={`fi fi-${country.code} text-base rounded-sm shrink-0`} />
                  <span className="text-xs font-medium">{country.name}</span>
                  {isActive && (
                    <svg className="w-3.5 h-3.5 ml-auto text-emerald-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
