import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Container from "../common/Container";
import AccountMenu from "../AccountMenu";
import ApplicationsChip from "./ApplicationsChip";
import WebmLogo from "../../assets/main-logo.webm";
import LogoAlphaWebp from "../../assets/main-logo-alpha.webp";
import { useAuth } from "../../context/authContext";

const isRealSafari = /^((?!chrome|android|crios|fxios|edg|opr).)*safari/i.test(
  navigator.userAgent
);

const Header = () => {
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
    carloan:            "/showdetails/car-loan",
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
    { label: "Vehicle Loan",             slug: "carloan" },
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

  // Franchise entries live in a dropdown so the nav keeps its width at the lg band.
  const { user } = useAuth();
  const isCustomer = Boolean(user?.role && user.role.toLowerCase() === "customer");


  const { pathname } = useLocation();
  const isRouteActive = (href: string, match?: string) =>
    match
      ? pathname.startsWith(match)
      : href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(`${href}/`);

  // Signed-in Customers do not see the franchise nav; signed-out visitors and Franchise
  // users do (Franchise users use it to apply or to reach the portal login).
  const franchiseLinks = [
    { label: "Be a Franchisor",   href: "/franchise",         desc: "Plans, payout model and the application" },
  ];

  type NavItem = { label: string; href: string; dropdown?: string; match?: string };

  const navLinks: NavItem[] = (() => {
    const all: NavItem[] = [
      { label: "Home",               href: "/" },
      { label: "Loan Product",       dropdown: "loans", href: "", match: "/showdetails" },
      { label: "EMI Calculator",     href: "/emi-calculator" },
      { label: "Loan Eligibility",   href: "/eligibility-calculator" },
      { label: "Franchise",          dropdown: "franchise", href: "", match: "/franchise" },
      { label: "Contact Us",         href: "/contact" },
    ];
    return isCustomer ? all.filter((l) => l.label !== "Franchise") : all;
  })();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenMobileDropdown(null);
  };

  return (
    <>
      <header
        className="fixed w-full top-0 z-55 border-b"
        style={{
          background: "linear-gradient(90deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.55) 100%)",
          backdropFilter: "blur(14px) saturate(1.4)",
          WebkitBackdropFilter: "blur(14px) saturate(1.4)",
          borderColor: "rgba(255,255,255,0.45)",
          boxShadow: "0 4px 24px rgba(15,23,42,0.08)",
        }}
      >
        <Container>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-20 px-5">
            {/* Logo Section — pinned left */}
            <Link to="/" className="col-start-1 row-start-1 flex items-center gap-3">
            <div className="col-start-1 row-start-1 flex items-center gap-3">
              {isRealSafari ? (
                <img src={LogoAlphaWebp} alt="Indexia Finance" className="h-20 w-auto" />
              ) : (
                <video
                  src={WebmLogo}
                  className="h-20"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}
            </div>
            </Link>

            {/* Account menu (all sizes) + Hamburger (small screens) — pinned right */}
            <div className="col-start-3 row-start-1 flex items-center gap-3 justify-self-end">
                <ApplicationsChip />
                <AccountMenu />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center justify-center w-10 h-10 cursor-pointer z-60 lg:hidden"
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
            <nav className="col-start-2 row-start-1 hidden lg:block justify-self-center text-slate-600 font-medium">
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
                        ) : (
                          <div className="w-88 rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-slate-900/5">
                            <p className="px-2.5 pb-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                              Franchise
                            </p>
                            {franchiseLinks.map((item) => (
                              <Link
                                key={item.label}
                                to={item.href}
                                className="block rounded-xl px-2.5 py-2.5 transition-colors hover:bg-slate-50"
                              >
                                <span className="block text-[13px] font-semibold text-slate-700">{item.label}</span>
                                <span className="mt-0.5 block text-[11.5px] text-slate-400">{item.desc}</span>
                              </Link>
                            ))}
                            {/* Franchisor Login — its own CTA, opening the dedicated login page */}
                            <Link
                              to="/franchise-login"
                              className="mt-2 flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-white transition-transform hover:-translate-y-0.5"
                              style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))" }}
                            >
                              <span>
                                <span className="block text-[13px] font-bold">Franchisor Login</span>
                                <span className="mt-0.5 block text-[11px] text-white/60">Partner portal access</span>
                              </span>
                              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="4.5" y="10" width="15" height="10.5" rx="2" />
                                <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
                              </svg>
                            </Link>
                          </div>
                        )}
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
          className="fixed inset-0 top-(--header-h) bg-black/30 z-30 lg:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Mobile Menu - Slides from right */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-(--header-h) right-0 bottom-0 w-80 bg-white/98 backdrop-blur-md z-60 overflow-y-auto shadow-2xl">
          <nav className="text-slate-600 font-medium">
            <ul className="flex flex-col divide-y divide-slate-200">
              {navLinks.map((link) =>
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
                        {link.dropdown === "loans"
                          ? loanProducts.map((item) => (
                              <Link
                                key={item.slug}
                                to={showDetailsMap[item.slug] ?? `/${item.slug}`}
                                className="block px-8 py-2.5 text-xs text-slate-600 hover:text-white hover:bg-(--brand-teal) border-b border-slate-100 last:border-b-0"
                                onClick={closeMobileMenu}
                              >
                                → {item.label}
                              </Link>
                            ))
                          : franchiseLinks.map((item) => (
                              <Link
                                key={item.label}
                                to={item.href}
                                className="block px-8 py-3 text-xs font-semibold text-slate-600 hover:text-white hover:bg-(--brand-teal) border-b border-slate-100"
                                onClick={closeMobileMenu}
                              >
                                → {item.label}
                                <span className="mt-0.5 block text-[10.5px] font-normal text-slate-400">
                                  {item.desc}
                                </span>
                              </Link>
                            ))}
                        <Link
                          to="/franchise-login"
                          className="block px-8 py-3.5 text-xs font-bold text-white"
                          style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))" }}
                          onClick={closeMobileMenu}
                        >
                          Franchisor Login →
                        </Link>
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="block px-5 py-4 text-sm uppercase font-semibold hover:bg-slate-50"
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
          padding: 10px 16px;
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

        /* Tighter nav links at lg band so logo + centered nav + country chip fit without overflow */
        @media (min-width: 1024px) and (max-width: 1289px) {
          .nav-link {
            padding-left: 10px;
            padding-right: 10px;
            font-size: 11.5px;
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
