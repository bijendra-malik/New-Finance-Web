import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { LOAN_ROUTES } from "../../constants/loanRoutes";
import type { LoanKey } from "../../constants/loanSlugs";

const LOAN_MENU_ORDER: LoanKey[] = [
  "personal",
  "business",
  "home",
  "lap",
  "balanceTransfer",
  "projectLoan",
  "vehicleLoan",
  "educationLoan",
  "creditCard",
  "commercialPurchase",
  "workingCapital",
  "leaseRentalDiscounting",
  "odCcLimit",
  "loanAgainstShare",
  "filmFunding",
  "npaLoan",
  "goldLoan",
  "fdiLoan",
];
import WebmLogo from "../../assets/main-logo.webm";
import LogoAlphaWebp from "../../assets/main-logo-alpha.webp";
import { useHeavyMediaAllowed } from "../../hooks/useHeavyMediaAllowed";

const isRealSafari = /^((?!chrome|android|crios|fxios|edg|opr).)*safari/i.test(
  navigator.userAgent
);

const Header = () => {
  const logoVideoReady = useHeavyMediaAllowed() && !isRealSafari;
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const loanProducts = LOAN_MENU_ORDER.map((key) => ({ key, ...LOAN_ROUTES[key] }));

  const { pathname } = useLocation();
  const isRouteActive = (href: string, match?: string) =>
    match
      ? pathname.startsWith(match)
      : href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const getFocusable = () =>
      Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    const focusTimer = window.setTimeout(() => getFocusable()[0]?.focus(), 40);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setOpenMobileDropdown(null);
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      menuButton?.focus();
    };
  }, [mobileMenuOpen]);

  type NavItem = { label: string; href: string; dropdown?: string; match?: string };

  const navLinks: NavItem[] = [
    { label: "Home",               href: "/" },
    { label: "Loan Product",       dropdown: "loans", href: "", match: "/showdetails" },
    { label: "EMI Calculator",     href: "/emi-calculator" },
    { label: "Loan Eligibility",   href: "/eligibility-calculator" },
    { label: "Contact Us",         href: "/contact" },
    { label: "Be a Franchisee",     href: "/franchise" },
  ];
  const franchiseeLoginLink: NavItem = { label: "Franchisee Login", href: "/franchise-login" };
  const applicationStatusLink: NavItem = { label: "Check Application Status", href: "/application-status" };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenMobileDropdown(null);
  };

  return (
    <>
      <header
        className="fixed w-full top-0 border-b"
        style={{
          zIndex: "var(--z-header)",
          background: "linear-gradient(90deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.55) 100%)",
          backdropFilter: "blur(14px) saturate(1.4)",
          WebkitBackdropFilter: "blur(14px) saturate(1.4)",
          borderColor: "rgba(255,255,255,0.45)",
          boxShadow: "0 4px 24px rgba(15,23,42,0.08)",
        }}
      >
          <div className="hdr-row flex h-24 items-center justify-between px-5 xl:justify-center xl:gap-x-12 2xl:gap-x-16">
            {/* Logo Section — pinned left */}
            <Link to="/" className="relative order-1 flex h-24 w-48 shrink-0 items-center justify-center overflow-hidden">
              {logoVideoReady ? (
                <video
                  src={WebmLogo}
                  className="absolute left-1/2 top-1/2 h-24 w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={LogoAlphaWebp}
                  alt="Indexia Finance"
                  decoding="async"
                  className="absolute left-1/2 top-1/2 h-24 w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
                />
              )}
            </Link>

            {/* Hamburger (small screens) — pinned right */}
            <div className="order-3 flex items-center gap-2">
              <div className="hidden items-center gap-2 xl:flex">
                <Link
                  to={franchiseeLoginLink.href}
                  aria-current={isRouteActive(franchiseeLoginLink.href) ? "page" : undefined}
                  className={`header-action header-action-login${isRouteActive(franchiseeLoginLink.href) ? " is-active" : ""}`}
                >
                  Franchisee Login
                </Link>
                <Link
                  to={applicationStatusLink.href}
                  aria-current={isRouteActive(applicationStatusLink.href) ? "page" : undefined}
                  className={`header-action header-action-status${isRouteActive(applicationStatusLink.href) ? " is-active" : ""}`}
                >
                  Check Application Status
                </Link>
              </div>
              <button
                type="button"
                ref={menuButtonRef}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-900/5 xl:hidden"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav"
              >
                {mobileMenuOpen ? <X size={22} strokeWidth={2.2} /> : <Menu size={22} strokeWidth={2.2} />}
              </button>
            </div>

            {/* Navigation Section - Desktop Only, centered */}
            <nav className="order-2 hidden xl:block text-slate-600 font-medium">
              <ul className="flex items-center text-[13px] gap-1">
                {navLinks.map((link) =>
                  link.dropdown ? (
                    <li
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => setOpenDropdown(link.dropdown!)}
                      onMouseLeave={() => setOpenDropdown(null)}
                      onFocus={() => setOpenDropdown(link.dropdown!)}
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                          setOpenDropdown(null);
                        }
                      }}
                    >
                      {/* Non-clickable dropdown trigger — opens on hover (desktop) */}
                      <span
                        role="button"
                        tabIndex={0}
                        aria-haspopup="true"
                        aria-expanded={openDropdown === link.dropdown}
                        onClick={(e) => e.preventDefault()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setOpenDropdown(openDropdown === link.dropdown ? null : link.dropdown!);
                          } else if (e.key === "Escape") {
                            setOpenDropdown(null);
                          }
                        }}
                        aria-current={isRouteActive(link.href, link.match) ? "page" : undefined}
                        className={`nav-link flex items-center gap-1 select-none${
                          isRouteActive(link.href, link.match) ? " is-active" : ""
                        }`}
                      >
                        {link.label}
                        <svg
                          className={`h-3 w-3 transition-transform duration-300 ${
                            openDropdown === link.dropdown ? "rotate-180" : ""
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>

                      {/* Mega dropdown */}
                      <div
                        className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 transition-all duration-300 ${
                          openDropdown === link.dropdown
                            ? "opacity-100 visible translate-y-0"
                            : "opacity-0 invisible -translate-y-2"
                        }`}
                      >
                        {link.dropdown === "loans" ? (
                        <div className="w-[min(40rem,calc(100vw-3rem))] rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl">
                          <p className="mb-4 text-[10.5px] font-bold uppercase tracking-[0.16em] text-(--brand-teal)">
                            Loan Products
                          </p>
                          <div className="grid grid-cols-3 gap-x-6 gap-y-1">
                            {loanProducts.map((item) => (
                              <Link
                                key={item.key}
                                to={item.detail}
                                onClick={() => setOpenDropdown(null)}
                                className="loan-item text-[12.5px] text-slate-600 py-2"
                              >
                                <svg className="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L10.745 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                </svg>
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                        ) : null}
                      </div>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        aria-current={isRouteActive(link.href) ? "page" : undefined}
                        className={`nav-link${isRouteActive(link.href) ? " is-active" : ""}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}

              </ul>
            </nav>
          </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 top-(--header-h) bg-slate-950/40 backdrop-blur-[2px] xl:hidden"
          style={{ zIndex: "calc(var(--z-header) - 1)" }}
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu - Slides from right */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="mobile-drawer fixed right-0 top-(--header-h) bottom-0 w-[min(20rem,calc(100vw-2.5rem))] overflow-y-auto border-l border-slate-200/80 bg-white shadow-2xl xl:hidden"
          style={{ zIndex: "var(--z-header)" }}
        >
          <nav className="text-slate-600 font-medium">
            <ul className="flex flex-col divide-y divide-slate-200">
              {[...navLinks, franchiseeLoginLink, applicationStatusLink].map((link) =>
                link.dropdown ? (
                  <li key={link.label}>
                    <button
                      onClick={() =>
                        setOpenMobileDropdown(openMobileDropdown === link.dropdown ? null : link.dropdown!)
                      }
                      aria-expanded={openMobileDropdown === link.dropdown}
                      className="flex min-h-13 w-full items-center justify-between px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.06em] text-slate-700 transition-colors hover:bg-(--brand-teal-14) hover:text-(--brand-navy)"
                    >
                      <span className="pointer-events-none">{link.label}</span>
                      <svg
                        className={`h-4 w-4 transition-transform duration-300 ${
                          openMobileDropdown === link.dropdown ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {openMobileDropdown === link.dropdown && (
                      <div className="bg-slate-50 border-l-4 border-emerald-500 pl-0">
                        {loanProducts.map((item) => (
                          <Link
                            key={item.key}
                            to={item.detail}
                            className="block border-b border-slate-100 px-8 py-3 text-xs font-medium text-slate-600 transition-colors last:border-b-0 hover:bg-(--brand-teal-14) hover:text-(--brand-navy)"
                            onClick={closeMobileMenu}
                          >
                            → {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className={`flex min-h-13 items-center px-5 py-4 text-xs uppercase font-bold tracking-[0.06em] transition-colors ${
                        link.href === franchiseeLoginLink.href
                          ? "mt-3 rounded-xl bg-(--brand-navy) text-white hover:bg-(--brand-navy-deep)"
                          : link.href === applicationStatusLink.href
                            ? "mb-3 rounded-xl bg-(--brand-teal-14) text-(--brand-navy) hover:bg-(--brand-teal) hover:text-white"
                            : "text-slate-700 hover:bg-(--brand-teal-14) hover:text-(--brand-navy)"
                      }`}
                      aria-current={isRouteActive(link.href) ? "page" : undefined}
                      onClick={closeMobileMenu}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              )}
              </ul>
          </nav>
        </div>
      )}

      <style>{`
        .nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 10px;
          text-transform: uppercase;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: .3px;
          color: #334155;
          text-decoration: none;
          z-index: 1;
          transition: color .35s ease;
          white-space: nowrap;
          gap: 4px;
        }
        .nav-link::before {
          content: "";
          position: absolute;
          inset: 0;
          border-top: 2px solid var(--brand-teal);
          border-bottom: 2px solid var(--brand-teal);
          transform: scaleY(2);
          opacity: 0;
          transition: .3s;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--brand-teal);
          transform: scale(0);
          opacity: 0;
          transition: .3s;
          z-index: -1;
        }
        .nav-link:hover {
          color: #fff;
        }
        .nav-link:hover::before,
        .nav-link:hover::after {
          transform: scaleY(1);
          opacity: 1;
        }

        /* The current tab keeps that teal box after the mouse exits. */
        .nav-link.is-active {
          color: #fff;
        }
        .nav-link.is-active::before,
        .nav-link.is-active::after {
          transform: scaleY(1);
          opacity: 1;
        }

        .mobile-drawer {
          animation: drawerIn .24s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes drawerIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: none; }
        }

        .header-action {
          display: inline-flex;
          min-height: 40px;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          padding: 0 8px;
          font-size: 11.5px;
          font-weight: 750;
          letter-spacing: .02em;
          line-height: 1.2;
          text-align: center;
          text-decoration: none;
          transition: transform .2s ease, background-color .2s ease, color .2s ease, box-shadow .2s ease, border-color .2s ease;
          white-space: nowrap;
        }

        .header-action-login {
          border: 1px solid var(--brand-navy);
          background: linear-gradient(135deg, var(--brand-navy), var(--brand-dark));
          color: #fff;
          box-shadow: 0 3px 10px rgba(6,106,156,.16);
        }

        .header-action-login:hover,
        .header-action-login.is-active {
          transform: translateY(-1px);
          background: linear-gradient(135deg, var(--brand-dark), #073e60);
          box-shadow: 0 6px 16px rgba(6,106,156,.25);
        }

        .header-action-status {
          border: 1px solid rgba(39,174,144,.48);
          background: rgba(39,174,144,.09);
          color: var(--brand-navy);
        }

        .header-action-status:hover,
        .header-action-status.is-active {
          transform: translateY(-1px);
          border-color: var(--brand-teal);
          background: var(--brand-teal);
          color: #fff;
          box-shadow: 0 5px 14px rgba(39,174,144,.2);
        }

        .header-action:focus-visible {
          outline: 3px solid rgba(39,174,144,.45);
          outline-offset: 3px;
        }

        /* Tighter centered cluster inside the 1280–1439 window band */
        @media (min-width: 1280px) and (max-width: 1439px) {
          .hdr-row { column-gap: 24px; }
          .hdr-row .nav-link {
            padding-left: 9px;
            padding-right: 9px;
            font-size: 10.5px;
          }
        }


        .loan-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: color .3s ease;
          color: #334155;
        }

        .loan-item:hover {
          color: var(--brand-navy);
          background: var(--brand-teal-14);
          border-radius: 8px;
          box-shadow: -8px 0 0 var(--brand-teal-14), 8px 0 0 var(--brand-teal-14);
        }

        .arrow-icon {
          width: 16px;
          height: 16px;
          opacity: 1;
          transition: opacity .3s ease, transform .3s ease;
          flex-shrink: 0;
          color: var(--brand-teal);
        }

        .loan-item:hover .arrow-icon {
          opacity: 1;
          transform: translateX(4px);
        }
      `}</style>
    </>
  );
};

export default Header;
