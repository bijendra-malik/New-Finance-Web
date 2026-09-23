import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// ── Types ─────────────────────────────────────────────────────────────────────
interface LangOption {
  code: string;       // i18n language code
  label: string;      // native name shown in dropdown
  flagCode: string;   // flag-icons country code
}

interface Country {
  name: string;
  flagCode: string;   // flag-icons country code for the country row
  languages: LangOption[];
}

// ── Country → Language map ────────────────────────────────────────────────────
const COUNTRIES: Country[] = [
  {
    name: 'India',
    flagCode: 'in',
    languages: [
      { code: 'en', label: 'English',  flagCode: 'gb' },
      { code: 'hi', label: 'हिन्दी',    flagCode: 'in' },
    ],
  },
  {
    name: 'China',
    flagCode: 'cn',
    languages: [
      { code: 'en', label: 'English',  flagCode: 'gb' },
      { code: 'zh', label: '中文',      flagCode: 'cn' },
    ],
  },
  {
    name: 'Japan',
    flagCode: 'jp',
    languages: [
      { code: 'en', label: 'English',  flagCode: 'gb' },
      { code: 'ja', label: '日本語',    flagCode: 'jp' },
    ],
  },
  {
    name: 'Russia',
    flagCode: 'ru',
    languages: [
      { code: 'en', label: 'English',  flagCode: 'gb' },
      { code: 'ru', label: 'Русский',  flagCode: 'ru' },
    ],
  },
  {
    name: 'South Korea',
    flagCode: 'kr',
    languages: [
      { code: 'en', label: 'English',  flagCode: 'gb' },
      { code: 'ko', label: '한국어',    flagCode: 'kr' },
    ],
  },
  {
    name: 'Germany',
    flagCode: 'de',
    languages: [
      { code: 'en', label: 'English',  flagCode: 'gb' },
      { code: 'de', label: 'Deutsch',  flagCode: 'de' },
    ],
  },
  {
    name: 'France',
    flagCode: 'fr',
    languages: [
      { code: 'en', label: 'English',  flagCode: 'gb' },
      { code: 'fr', label: 'Français', flagCode: 'fr' },
    ],
  },
  {
    name: 'Spain',
    flagCode: 'es',
    languages: [
      { code: 'en', label: 'English',  flagCode: 'gb' },
      { code: 'es', label: 'Español',  flagCode: 'es' },
    ],
  },
  {
    name: 'Nepal',
    flagCode: 'np',
    languages: [
      { code: 'en', label: 'English',  flagCode: 'gb' },
      { code: 'ne', label: 'नेपाली',   flagCode: 'np' },
    ],
  },
  {
    name: 'Bhutan',
    flagCode: 'bt',
    languages: [
      { code: 'en', label: 'English',   flagCode: 'gb' },
      { code: 'dz', label: 'རྫོང་ཁ།',   flagCode: 'bt' },
    ],
  },
  {
    name: 'Sri Lanka',
    flagCode: 'lk',
    languages: [
      { code: 'en', label: 'English',   flagCode: 'gb' },
      { code: 'si', label: 'සිංහල',     flagCode: 'lk' },
    ],
  },
  {
    name: 'Thailand',
    flagCode: 'th',
    languages: [
      { code: 'en', label: 'English',   flagCode: 'gb' },
      { code: 'th', label: 'ภาษาไทย',   flagCode: 'th' },
    ],
  },
  {
    name: 'Uzbekistan',
    flagCode: 'uz',
    languages: [
      { code: 'en', label: 'English',   flagCode: 'gb' },
      { code: 'uz', label: "O'zbek",    flagCode: 'uz' },
    ],
  },
  {
    name: 'UAE',
    flagCode: 'ae',
    languages: [
      { code: 'en', label: 'English',   flagCode: 'gb' },
      { code: 'ar', label: 'العربية',   flagCode: 'ae' },
    ],
  },
  {
    name: 'Saudi Arabia',
    flagCode: 'sa',
    languages: [
      { code: 'en', label: 'English',   flagCode: 'gb' },
      { code: 'ar', label: 'العربية',   flagCode: 'sa' },
    ],
  },
  {
    name: 'Qatar',
    flagCode: 'qa',
    languages: [
      { code: 'en', label: 'English',   flagCode: 'gb' },
      { code: 'ar', label: 'العربية',   flagCode: 'qa' },
    ],
  },
  {
    name: 'Singapore',
    flagCode: 'sg',
    languages: [
      { code: 'en', label: 'English',   flagCode: 'gb' },
      { code: 'zh', label: '中文',       flagCode: 'cn' },
    ],
  },
  {
    name: 'Israel',
    flagCode: 'il',
    languages: [
      { code: 'en', label: 'English',   flagCode: 'gb' },
      { code: 'he', label: 'עברית',     flagCode: 'il' },
    ],
  },
];

// ── Helper: find active country flag ─────────────────────────────────────────
const getActiveFlagCode = (langCode: string): string => {
  for (const country of COUNTRIES) {
    const match = country.languages.find((l) => l.code === langCode);
    if (match) return match.flagCode;
  }
  return 'gb'; // fallback
};

// ── Component ─────────────────────────────────────────────────────────────────
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen]             = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const dropdownRef                     = useRef<HTMLDivElement>(null);
  const closeTimer                      = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHoveredCountry(null);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  const activeFlagCode = getActiveFlagCode(i18n.language);

  const handleLanguageSelect = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
    setHoveredCountry(null);
  };

  const handleMouseEnterCountry = (country: Country) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setHoveredCountry(country);
  };

  const handleMouseLeavePanel = () => {
    closeTimer.current = setTimeout(() => {
      setHoveredCountry(null);
    }, 150);
  };

  const handleMouseEnterLanguages = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">

      {/* ── Trigger button ── */}
      <button
        onClick={() => { setIsOpen(!isOpen); setHoveredCountry(null); }}
        className="flex items-center gap-1 p-1 rounded-xl bg-white/40 hover:bg-white/60 border border-slate-200/50 transition-all duration-200 hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1"
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <span className={`fi fi-${activeFlagCode} text-lg rounded-sm overflow-hidden block`} />
        <svg
          className={`h-3 w-3 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {/* ── Dropdown panel ── */}
      {isOpen && (
        <div
          className="absolute right-0 top-10 z-[9999] flex shadow-2xl rounded-2xl ring-1 ring-slate-900/10 overflow-visible"
          style={{ minWidth: 160 }}
        >
          {/* LEFT — country list */}
          <div
            className="bg-white rounded-l-2xl py-2 overflow-y-auto"
            style={{ width: 160, maxHeight: 340 }}
            onMouseLeave={handleMouseLeavePanel}
          >
            {COUNTRIES.map((country) => {
              const isHovered = hoveredCountry?.name === country.name;
              return (
                <div
                  key={country.name}
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors duration-150 ${
                    isHovered ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                  onMouseEnter={() => handleMouseEnterCountry(country)}
                >
                  <span className={`fi fi-${country.flagCode} text-base rounded-sm flex-shrink-0`} />
                  <span className="text-xs font-medium truncate">{country.name}</span>
                  {/* Right arrow indicator */}
                  <svg className="w-3 h-3 ml-auto flex-shrink-0 opacity-40" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L10.745 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </div>
              );
            })}
          </div>

          {/* RIGHT — language options (flyout, shown on hover) */}
          {hoveredCountry && (
            <div
              className="bg-white border-l border-slate-100 rounded-r-2xl py-2 flex flex-col justify-center"
              style={{ width: 140 }}
              onMouseEnter={handleMouseEnterLanguages}
              onMouseLeave={handleMouseLeavePanel}
            >
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {hoveredCountry.name}
              </p>
              {hoveredCountry.languages.map((lang) => {
                const isActive = i18n.language === lang.code;
                return (
                  <button
                    key={`${hoveredCountry.name}-${lang.code}`}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`flex items-center gap-2 px-3 py-2 w-full text-left transition-colors duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className={`fi fi-${lang.flagCode} text-base rounded-sm flex-shrink-0`} />
                    <span className="text-xs font-medium">{lang.label}</span>
                    {isActive && (
                      <svg className="w-3.5 h-3.5 ml-auto text-emerald-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;