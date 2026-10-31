import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Container from "../common/Container";
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

  const showDetailsMap: Record<string, string> = {
    personalloan:       "/showdetails/personal-loan",
    businessloan:       "/showdetails/business-loan",
    homeloan:           "/showdetails/home-loan",
    loanagainstproperty:"/showdetails/loanAP-loan",
    balancetransfer:    "/showdetails/balance-loan",
    projectloan:        "/showdetails/project-loan",
    Vehicleloan:        "/showdetails/vehicle-loan",
    educationloan:      "/showdetails/education-loan",
    creditcard:         "/showdetails/credit-card",
    commercialpurchase: "/showdetails/commercial-purchase",
    workingcapital:     "/showdetails/working-capital",
    leaserental:        "/showdetails/lease-rental",
    odcclimit:          "/showdetails/od-cc-limit",
    loanagainstshare:   "/showdetails/loan-against-share",
    filmloanfunding:    "/showdetails/film-funding",
    npalloan:           "/showdetails/npa",
    goldloan:           "/showdetails/gold-loan",
    fdi:                "/showdetails/fdi",
  };

  const loanProducts = [
    { label: "Personal Loan",            slug: "personalloan" },
    { label: "Business Loan",            slug: "businessloan" },
    { label: "Home Loan",                slug: "homeloan" },
    { label: "Loan Against Property",    slug: "loanagainstproperty" },
    { label: "Balance Transfer",         slug: "balancetransfer" },
    { label: "Project Loan",             slug: "projectloan" },
    { label: "Vehicle Loan",             slug: "Vehicleloan" },
    { label: "Education Loan",           slug: "educationloan" },
    { label: "Credit Card",              slug: "creditcard" },
    { label: "Commercial Purchase",      slug: "commercialpurchase" },
    { label: "Working Capital",          slug: "workingcapital" },
    { label: "Lease Rental Discounting", slug: "leaserental" },
    { label: "OD CC Limit",              slug: "odcclimit" },
    { label: "Loan Against Share",       slug: "loanagainstshare" },
    { label: "Film Funding",             slug: "filmloanfunding" },
    { label: "NPA",                      slug: "npalloan" },
    { label: "Gold Loan",                slug: "goldloan" },
    { label: "FDI",                      slug: "fdi" },
  ];

  const { pathname } = useLocation();
  const isRouteActive = (href: string, match?: string) =>
    match
      ? pathname.startsWith(match)
      : href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(`${href}/`);

  type NavItem = { label: string; href: string; dropdown?: string; match?: string };

  const navLinks: NavItem[] = [
    { label: "Home",               href: "/" },
    { label: "Loan Product",       dropdown: "loans", href: "", match: "/showdetails" },
    { label: "EMI Calculator",     href: "/emi-calculator" },
    { label: "Loan Eligibility",   href: "/eligibility-calculator" },
    { label: "Be a Franchisee",     href: "/franchise" },
    { label: "Contact Us",         href: "/contact" },
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
        <Container>
          <div className="grid grid-cols-[auto_1fr_auto] items-center h-20 px-5">
            {/* Logo Section — pinned left */}
            <Link to="/" className="col-start-1 row-start-1 flex shrink-0 items-center gap-3">
              {logoVideoReady ? (
                <video
                  src={WebmLogo}
                  className="h-20 w-auto shrink-0"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img src={LogoAlphaWebp} alt="Indexia Finance" decoding="async" className="h-20 w-auto shrink-0" />
              )}
            </Link>

            {/* Hamburger (small screens) — pinned right */}
            <div className="col-start-3 row-start-1 flex items-center gap-2 justify-self-end">
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
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center justify-center w-10 h-10 cursor-pointer z-60 xl:hidden"
                aria-label="Toggle Menu"
              >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute w-6 h-0.5 bg-slate-600 transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45 top-1/2 -translate-y-1/2" : "top-1"
                  }`}
                ></span>
                <span
                  className={`absolute w-6 h-0.5 bg-slate-600 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`absolute w-6 h-0.5 bg-slate-600 transition-all duration-300 ${
                    mobileMenuOpen ? "-rotate-45 bottom-1 translate-y-0" : "bottom-1"
                  }`}
                ></span>
              </div>
              </button>
            </div>

            {/* Navigation Section - Desktop Only, centered */}
            <nav className="col-start-2 row-start-1 hidden xl:block justify-self-center text-slate-600 font-medium">
              <ul className="flex items-center text-sm gap-1">
                {navLinks.map((link) =>
                  link.dropdown ? (
                    <li
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => setOpenDropdown(link.dropdown!)}
                      onMouseLeave={() => setOpenDropdown(null)}
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
                        <div className="w-160 rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 p-6">
                          <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                            Loan Products
                          </p>
                          <div className="grid grid-cols-3 gap-x-6 gap-y-1">
                            {loanProducts.map((item) => (
                              <Link
                                key={item.slug}
                                to={showDetailsMap[item.slug] ?? `/${item.slug}`}
                                className="loan-item text-[13px] text-slate-600 py-2"
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
        </Container>
      </header>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-(--header-h) bg-black/30 z-30 xl:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Mobile Menu - Slides from right */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed top-(--header-h) right-0 bottom-0 w-80 bg-white/98 backdrop-blur-md z-60 overflow-y-auto shadow-2xl">
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
                      className="w-full text-left flex items-center justify-between px-5 py-4 text-sm uppercase font-semibold hover:bg-slate-50"
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
                            key={item.slug}
                            to={showDetailsMap[item.slug] ?? `/${item.slug}`}
                            className="block px-8 py-2.5 text-xs text-slate-600 hover:text-white hover:bg-(--brand-teal) border-b border-slate-100 last:border-b-0"
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
                      className={`block px-5 py-4 text-sm uppercase font-semibold transition-colors ${
                        link.href === franchiseeLoginLink.href
                          ? "bg-(--brand-navy) text-white hover:bg-(--brand-dark)"
                          : link.href === applicationStatusLink.href
                            ? "bg-(--brand-teal-14) text-(--brand-navy) hover:bg-(--brand-teal) hover:text-white"
                            : "hover:bg-slate-50"
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
          font-size: 12.5px;
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

        .header-action {
          display: inline-flex;
          min-height: 40px;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          padding: 0 13px;
          font-size: 12.5px;
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

        /* Tighter nav links at lg band so logo + centered nav + country chip fit without overflow */
        @media (min-width: 1024px) and (max-width: 1289px) {
          .nav-link {
            padding-left: 10px;
            padding-right: 10px;
            font-size: 11.5px;
          }

          .header-action {
            padding-left: 9px;
            padding-right: 9px;
            font-size: 10px;
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
          color: #059669;
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
