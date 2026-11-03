import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import globeVideo from "../../assets/logo-footer.webm";
import {
  EMAIL_CONTACT,
  OFFICE_MAP_DIRECTIONS_URL,
  PHONE_LANDLINE,
  PHONE_LANDLINE_HREF,
  PHONE_MOBILE,
  PHONE_MOBILE_HREF,
} from "../../constants/contact";
import { socialLinks } from "../../constants/socialLinks";
import { useHeavyMediaAllowed } from "../../hooks/useHeavyMediaAllowed";

/** Footer link: internal routes use react-router, external links open in a new tab. */
type FooterLink = { label: string; href: string; external?: boolean };

const FOOTER_COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About Indexia", href: "https://www.indexiagroup.com/about", external: true },
      { label: "Indexia Group", href: "https://www.indexiagroup.com/", external: true },
      { label: "Careers", href: "https://www.indexiagroup.com/careers/", external: true },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "EMI calculator", href: "/emi-calculator" },
      { label: "Eligibility calculator", href: "/eligibility-calculator" },
      { label: "Check credit score", href: "/know-your-score" },
      { label: "Track application", href: "/application-status" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Global research", href: "/global-research" },
      { label: "News & knowledge", href: "https://www.indexiagroup.com/news/", external: true },
      { label: "Become a franchise", href: "/franchise" },
      { label: "Advertise with us", href: "/advertise-with-us" },
    ],
  },
];

const CONTACT_LINES: { label: string; links: { label: string; href: string }[] }[] = [
  {
    label: "Call",
    links: [
      { label: PHONE_LANDLINE, href: PHONE_LANDLINE_HREF },
      { label: PHONE_MOBILE, href: PHONE_MOBILE_HREF },
    ],
  },
  {
    label: "Email",
    links: [{ label: EMAIL_CONTACT, href: `mailto:${EMAIL_CONTACT}` }],
  },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-use" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
];

const Footer = () => {
  const year = new Date().getFullYear();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaAllowed = useHeavyMediaAllowed();
  // The globe clip is several megabytes and purely decorative, so it is only
  // attached once the footer approaches the viewport.
  const [reachedFooter, setReachedFooter] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reachedFooter) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReachedFooter(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reachedFooter]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !reachedFooter) return;
    video.defaultMuted = true;
    video.muted = true;
    const play = () => {
      video.play().catch(() => {});
    };
    play();
    video.addEventListener("pause", play);
    return () => video.removeEventListener("pause", play);
  }, [reachedFooter]);

  return (
    <footer className="relative overflow-hidden bg-[#04101d] text-white">
      {/* Layered fintech surface: teal bloom, navy wash and a faint data grid. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 420px at 8% -10%, rgba(38,174,144,0.18), transparent 60%), radial-gradient(760px 420px at 94% 0%, rgba(6,106,156,0.38), transparent 65%), linear-gradient(180deg, #04101d 0%, #061426 55%, #040c17 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/4 h-80 w-80 rounded-full blur-3xl"
        style={{ background: "rgba(38,174,144,0.12)" }}
      />

      <div className="relative">
        <div
          className="h-0.5 w-full"
          style={{
            background:
              "linear-gradient(90deg, var(--brand-teal), var(--brand-yellow), var(--brand-navy))",
          }}
        />

        {/* Thin data strip */}
        <div className="border-y border-white/10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-2 px-6 py-3.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/35 md:px-8">
            <span className="inline-flex items-center gap-2 text-white/50">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-(--brand-teal)" />
              Lender-led decisions
            </span>
            <span>Est. 2012</span>
            <span>18 loan products</span>
            <span>New Delhi · India</span>
          </div>
        </div>

        {/* Main footer */}
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-stretch lg:gap-12">
          <div>
            <Link to="/" aria-label="Indexia Finance home" className="inline-flex items-baseline gap-1.5">
              <span className="text-[28px] font-extrabold leading-none tracking-tight text-(--brand-yellow)">
                Indexia
              </span>
              <span className="text-[28px] font-extrabold leading-none tracking-tight text-white">
                Finance
              </span>
            </Link>
            <p className="mt-2 font-mono text-[8.5px] uppercase tracking-[0.24em] text-white/30">
              An Indexia Group company
            </p>
            <p className="mt-5 text-[12.5px] leading-6 text-white/50">
              Loan facilitation for personal, business and secured borrowing — matched to partner
              banks and NBFCs, with the final decision always with the lender.
            </p>

            <ul className="mt-6 space-y-2.5">
              {CONTACT_LINES.map((line) => (
                <li key={line.label} className="flex items-baseline gap-3">
                  <span className="w-10 shrink-0 font-mono text-[8.5px] uppercase tracking-[0.16em] text-white/25">
                    {line.label}
                  </span>
                  <span className="flex flex-wrap items-baseline text-[12px] font-medium text-white/60">
                    {line.links.map((item, index) => (
                      <span key={item.href} className="inline-flex items-baseline">
                        <a
                          href={item.href}
                          aria-label={`${line.label} ${item.label}`}
                          className="transition-colors hover:text-(--brand-teal) hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-yellow)"
                        >
                          {item.label}
                        </a>
                        {index < line.links.length - 1 && (
                          <span aria-hidden="true" className="px-1.5 text-white/25">·</span>
                        )}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
              <li className="flex items-baseline gap-3">
                <span className="w-10 shrink-0 font-mono text-[8.5px] uppercase tracking-[0.16em] text-white/25">
                  Office
                </span>
                <a
                  href={OFFICE_MAP_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open the Indexia Finance Naraina Vihar office location in Google Maps"
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-white/60 transition-colors hover:text-(--brand-teal) hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-yellow)"
                >
                  Naraina Vihar, New Delhi
                </a>
              </li>
            </ul>

            <div className="mt-7">
              <p className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-white/25">
                Follow
              </p>
              <ul aria-label="Indexia Finance social profiles" className="mt-3 flex items-center gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <li key={social.name}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${social.name} — ${social.handle}`}
                        title={`${social.name} — ${social.handle}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-(--soc) text-white ring-1 ring-white/15 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white hover:text-(--soc) hover:shadow-[0_8px_18px_rgba(0,0,0,0.35)] hover:ring-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-yellow) motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                        style={{ "--soc": social.brand } as CSSProperties}
                      >
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative h-44 w-44 shrink-0 sm:h-52 sm:w-52 lg:h-56 lg:w-56">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-5 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(38,174,144,0.24) 0%, rgba(38,174,144,0) 70%)",
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, rgba(38,174,144,0.45), rgba(6,106,156,0.15) 55%, transparent 72%)",
                }}
              />
              <video
                ref={videoRef}
                className="relative h-full w-full rounded-full object-cover"
                style={{
                  WebkitMaskImage:
                    "radial-gradient(circle, #000 58%, rgba(0,0,0,0.35) 72%, transparent 88%)",
                  maskImage:
                    "radial-gradient(circle, #000 58%, rgba(0,0,0,0.35) 72%, transparent 88%)",
                }}
                src={reachedFooter && mediaAllowed ? globeVideo : undefined}
                preload="none"
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-9 sm:grid-cols-3 lg:gap-x-6">
            {FOOTER_COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title} className="min-w-0">
                <h3 className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white/35">
                  {column.title}
                </h3>
                <ul className="mt-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-2 border-b border-white/5 py-2 text-[12.5px] text-white/55 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-yellow)"
                        >
                          <span>{link.label}</span>
                          <span
                            aria-hidden="true"
                            className="text-[10px] text-white/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-(--brand-teal)"
                          >
                            ↗
                          </span>
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="group flex items-center justify-between gap-2 border-b border-white/5 py-2 text-[12.5px] text-white/55 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-yellow)"
                        >
                          <span>{link.label}</span>
                          <span
                            aria-hidden="true"
                            className="text-[10px] text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-(--brand-teal)"
                          >
                            →
                          </span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

          </div>
        </div>

        {/* Legal bar */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
            <p className="text-[11px] text-white/35">
              © {year} Indexia Finserve Pvt. Ltd. All rights reserved.
            </p>
            <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-[11px] text-white/40 transition-colors hover:text-(--brand-yellow) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-yellow)"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mx-auto max-w-7xl px-6 pb-7 md:px-8">
            <p className="border-t border-white/5 pt-4 text-[10.5px] leading-5 text-white/25">
              Indexia Finance facilitates loan applications. Approval, loan amount, interest rate,
              fees and disbursal are decided by the lending bank or NBFC.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
