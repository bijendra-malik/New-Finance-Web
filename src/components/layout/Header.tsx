import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Container from "../common/Container";
import LanguageSwitcher from "../LanguageSwitcher";
import WebmLogo from "../../assets/main-logo.webm";
import LogoAlphaWebp from "../../assets/main-logo-alpha.webp";

// Safari (macOS + iOS) decodes VP9 WebM fine but ignores its alpha channel,
// so the video's opaque black backing layer shows through as a black box.
// canPlayType('video/webm') can't detect this — Safari happily reports "probably"
// even though it will render opaque — so real Safari must be UA-sniffed instead.
// (Excludes Chrome/Edge/Opera/Firefox-on-iOS, which all include "Safari" in their UA too.)
const isRealSafari = /^((?!chrome|android|crios|fxios|edg|opr).)*safari/i.test(
  navigator.userAgent
);

const Header = () => {
  const { t } = useTranslation();
  const [loanOpen, setLoanOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);

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
    { key: "loanProducts.personalLoan", slug: "personalloan" },
    { key: "loanProducts.businessLoan", slug: "businessloan" },
    { key: "loanProducts.homeLoan", slug: "homeloan" },
    { key: "loanProducts.loanAgainstProperty", slug: "loanagainstproperty" },
    { key: "loanProducts.balanceTransfer", slug: "balancetransfer" },
    { key: "loanProducts.projectLoan", slug: "projectloan" },
    { key: "loanProducts.carLoan", slug: "carloan" },
    { key: "loanProducts.educationLoan", slug: "educationloan" },
    { key: "loanProducts.creditCard", slug: "creditcard" },
    { key: "loanProducts.commercialPurchase", slug: "commercialpurchase" },
    { key: "loanProducts.workingCapital", slug: "workingcapital" },
    { key: "loanProducts.leaseRentalDiscounting", slug: "leaserental" },
    { key: "loanProducts.odCcLimit", slug: "odcclimit" },
    { key: "loanProducts.loanAgainstShare", slug: "loanagainstshare" },
    { key: "loanProducts.filmLoanFunding", slug: "filmloanfunding" },
    { key: "loanProducts.npalLoan", slug: "npalloan" },
    { key: "loanProducts.goldLoan", slug: "goldloan" },
    { key: "loanProducts.fdi", slug: "fdi" },
  ];

  const navLinks = [
    { key: "nav.home", href: "/" },
    { key: "nav.loanProduct", dropdown: true, href: "" },
    { key: "nav.emiCalculator", href: "/emi-calculator" },
    { key: "nav.eligibilityCalculator", href: "/eligibility-calculator" },
    { key: "nav.franchiseLogin", href: "/franchise-login" },
    { key: "nav.beAnAssociate", href: "/be-an-associate" },
    { key: "nav.contactUs", href: "/contact" },
  ] satisfies { key: string; href: string; dropdown?: boolean }[];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileSubmenuOpen(false);
  };

  return (
    <>
      <header className="bg-[#867d7d]/40 backdrop-blur-md fixed w-full top-0 z-50 border-b border-white/20">
        <Container>
          <div className="flex justify-between items-center h-25 px-5 sm:px-10 md:px-20 lg:px-10">
            {/* Logo Section */}
            <div className="flex items-center gap-3 cursor-pointer">
              {isRealSafari ? (
                <img src={LogoAlphaWebp} alt="Indexia Finance" className="h-25 w-auto" />
              ) : (
                <video
                  src={WebmLogo}
                  className="h-25"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}
            </div>

            {/* Hamburger Menu Button - Mobile Only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 cursor-pointer z-40"
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

            {/* Navigation Section - Desktop Only */}
            <nav className="hidden lg:block text-slate-600 font-medium">
              <ul className="flex items-center text-sm gap-1">
                {navLinks.map((link) =>
                  link.dropdown ? (
                    <li
                      key={link.key}
                      className="relative"
                      onMouseEnter={() => setLoanOpen(true)}
                      onMouseLeave={() => setLoanOpen(false)}
                    >
                      {/* Non-clickable dropdown trigger — opens on hover (desktop) */}
                      <span
                        role="button"
                        tabIndex={0}
                        aria-haspopup="true"
                        aria-expanded={loanOpen}
                        onClick={(e) => e.preventDefault()}
                        className="nav-link flex items-center gap-1 select-none"
                      >
                        {t(link.key)}
                        <svg
                          className={`h-3 w-3 transition-transform duration-300 ${
                            loanOpen ? "rotate-180" : ""
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
                          loanOpen
                            ? "opacity-100 visible translate-y-0"
                            : "opacity-0 invisible -translate-y-2"
                        }`}
                      >
                        <div className="w-160 rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 p-6">
                          <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                            {t("loanProducts.title")}
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
                                {t(item.key)}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </li>
                  ) : (
                    <li key={link.key}>
                      <Link to={link.href} className="nav-link">
                        {t(link.key)}
                      </Link>
                    </li>
                  )
                )}

                <li className="ml-6">
                  <LanguageSwitcher />
                </li>
              </ul>
            </nav>
          </div>
        </Container>
      </header>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/30 z-30 lg:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Mobile Menu - Slides from right */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-25 right-0 bottom-0 w-80 bg-white/98 backdrop-blur-md z-40 overflow-y-auto shadow-2xl">
          <nav className="text-slate-600 font-medium">
            <ul className="flex flex-col divide-y divide-slate-200">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <li key={link.key}>
                    <button
                      onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
                      className="w-full text-left flex items-center justify-between px-5 py-4 text-sm uppercase font-semibold hover:bg-slate-50"
                    >
                      <span className="pointer-events-none">{t(link.key)}</span>
                      <svg
                        className={`h-4 w-4 transition-transform duration-300 ${
                          mobileSubmenuOpen ? "rotate-180" : ""
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

                    {mobileSubmenuOpen && (
                      <div className="bg-slate-50 border-l-4 border-emerald-500 pl-0">
                        {loanProducts.map((item) => (
                          <Link
                            key={item.slug}
                            to={showDetailsMap[item.slug] ?? `/${item.slug}`}
                            className="block px-8 py-2.5 text-xs text-slate-600 hover:text-(--brand-teal) hover:bg-(--brand-teal) border-b border-slate-100 last:border-b-0"
                            onClick={closeMobileMenu}
                          >
                            → {t(item.key)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={link.key}>
                    <Link
                      to={link.href}
                      className="block px-5 py-4 text-sm uppercase font-semibold hover:bg-slate-50"
                      onClick={closeMobileMenu}
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                )
              )}
                <li className="ml-2">
                  <LanguageSwitcher />
                </li>
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
          top: 2px;
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
