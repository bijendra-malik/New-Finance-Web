import { useRef, useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import footerBg from "../../assets/bg-footerimg01.webp";
import globeVideo from "../../assets/logo-footer.webm";
import { socialLinks } from "../../constants/socialLinks";
import {
  EMAIL_CONTACT,
  OFFICE_MAP_DIRECTIONS_URL,
  PHONE_LANDLINE,
  PHONE_LANDLINE_HREF,
  PHONE_MOBILE,
  PHONE_MOBILE_HREF,
} from "../../constants/contact";
import { useHeavyMediaAllowed } from "../../hooks/useHeavyMediaAllowed";

const COMPANY_LINKS = [
  { l: "About Us", h: "https://www.indexiagroup.com/finance", external: true },
  { l: "Indexia Group", h: "https://www.indexiagroup.com/", external: true },
  { l: "Careers", h: "/careers", external: false },
];

const RESOURCE_LINKS = [
  { l: "Global Research", h: "/global-research", external: false },
  { l: "News & Knowledge", h: "https://www.indexiagroup.com/news", external: true },
  { l: "Advertise With Us", h: "/advertise-with-us", external: false },
];

const TOP_STRIP = ["Lender-led decisions", "Est. 2012", "18 loan products", "New Delhi · India"];

const LEGAL_LINKS = [
  { l: "Privacy Policy", h: "/privacy-policy" },
  { l: "Terms of Use", h: "/terms-of-use" },
  { l: "Terms & Conditions", h: "/terms-conditions" },
];

const CONTAINER = "mx-auto w-full max-w-[80rem] px-5 sm:px-6";
const LINK_BASE =
  "flex items-center justify-between gap-4 py-[9px] text-[14.5px] text-white/[0.86] no-underline transition-colors hover:text-[var(--brand-yellow)]";

const Footer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaAllowed = useHeavyMediaAllowed();
  const [reachedFooter, setReachedFooter] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reachedFooter) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReachedFooter(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, [reachedFooter]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !reachedFooter) return;
    v.defaultMuted = true;
    v.muted = true;
    const play = () => { v.play().catch(() => { }); };
    play();
    v.addEventListener("pause", play);
    return () => v.removeEventListener("pause", play);
  }, [reachedFooter]);

  const renderLink = (item: { l: string; h: string; external: boolean }) => {
    const inner = (
      <>
        <span>{item.l}</span>
        <span
          aria-hidden="true"
          className="text-[12px] text-white/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-(--brand-yellow)"
        >
          {item.external ? "↗" : "→"}
        </span>
      </>
    );
    return item.external ? (
      <a key={item.l} href={item.h} target="_blank" rel="noreferrer" className={`group ${LINK_BASE}`}>
        {inner}
      </a>
    ) : (
      <Link key={item.l} to={item.h} className={`group ${LINK_BASE}`}>
        {inner}
      </Link>
    );
  };

  return (
    <footer className="relative overflow-hidden bg-(--brand-navy-deep)">
      {/* Background colour wash + image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[linear-gradient(135deg,var(--brand-navy-deep)_0%,var(--brand-navy)_60%,var(--brand-navy-light)_100%)]"
      />
      <img
        src={footerBg}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none object-cover object-center opacity-[0.07]"
      />

      {/* Top accent line */}
      <div className="relative z-1 h-0.75 w-full bg-[linear-gradient(90deg,var(--brand-navy),var(--brand-teal),var(--brand-yellow))]" />

      {/* Top strip */}
      <div className="relative z-1">
        <div className={CONTAINER}>
          <div className="border-b border-white/8">
            <ul className="flex flex-wrap items-center gap-x-10 gap-y-2 pb-3.5 pt-5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/70 max-sm:gap-x-5 max-sm:gap-y-2 max-sm:pb-3 max-sm:pt-4.5">
              {TOP_STRIP.map((item, i) => (
                <li
                  key={item}
                  className={`flex items-center gap-2.25 ${i === 0 ? "text-white/85" : ""}`}
                >
                  {i === 0 && (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-(--brand-teal) shadow-[0_0_0_3px_var(--brand-teal-33)]"
                    />
                  )}
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="relative z-1">
        <div className={CONTAINER}>
          <div className="grid grid-cols-1 gap-6 py-5.5 md:grid-cols-2 md:gap-x-8 md:gap-y-7 md:py-5.5 lg:grid-cols-[1.6fr_1fr_0.72fr_0.95fr] lg:gap-8 lg:pb-6.5 lg:pt-7.5">
            {/* Brand + contact */}
            <div className="md:col-span-2 lg:col-span-1">
              <Link to="/" className="inline-flex items-baseline gap-1.5 no-underline">
                <span className="text-[27px] font-extrabold text-(--brand-yellow)">Indexia</span>
                <span className="text-[27px] font-extrabold text-white">Finance</span>
              </Link>
              <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/68">
                An Indexia Group Company
              </p>

              <p className="mt-4 max-w-110 text-[15px] leading-[1.7] text-white/74 max-sm:text-sm">
                Services for investors, FDI entities, NBFCs, and banks, facilitating secured and
                unsecured borrowing solutions aligned with partner policies. Final approval rests
                solely with the lender.
              </p>

              <div className="mt-5.5 flex flex-col gap-2.5">
                <div className="flex items-baseline gap-3.5">
                  <span className="min-w-13 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white/68">
                    Call
                  </span>
                  <span>
                    <a
                      href={PHONE_LANDLINE_HREF}
                      className="text-[13px] text-white/88 no-underline transition-colors hover:text-(--brand-yellow)"
                    >
                      {PHONE_LANDLINE}
                    </a>
                    <span className="text-white/40"> · </span>
                    <a
                      href={PHONE_MOBILE_HREF}
                      className="text-[13px] text-white/88 no-underline transition-colors hover:text-(--brand-yellow)"
                    >
                      {PHONE_MOBILE}
                    </a>
                  </span>
                </div>
                <div className="flex items-baseline gap-3.5">
                  <span className="min-w-13 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white/68">
                    Email
                  </span>
                  <a
                    href={`mailto:${EMAIL_CONTACT}`}
                    className="text-[13px] text-white/88 no-underline transition-colors hover:text-(--brand-yellow)"
                  >
                    {EMAIL_CONTACT}
                  </a>
                </div>
                <div className="flex items-baseline gap-3.5">
                  <span className="min-w-13 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white/68">
                    Office
                  </span>
                  <a
                    href={OFFICE_MAP_DIRECTIONS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[13px] text-white/88 no-underline transition-colors hover:text-(--brand-yellow) hover:underline"
                  >
                    Naraina Vihar, New Delhi{" "}
                    <span aria-hidden="true" className="text-[11px]">
                      ↗
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Globe */}
            <div className="md:col-span-2 lg:col-span-1">
              <div className="relative mx-auto aspect-square w-full max-w-42.5 md:max-w-50 lg:max-w-58">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-3.5 rounded-full bg-[radial-gradient(circle,var(--brand-teal-40)_0%,transparent_70%)]"
                />
                <video
                  ref={videoRef}
                  className="h-full w-full rounded-full object-cover"
                  style={{
                    maskImage:
                      "radial-gradient(circle, #000 58%, rgba(0,0,0,0.35) 72%, transparent 88%)",
                    WebkitMaskImage:
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

            {/* Company */}
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-white">Company</p>
              <div className="mt-3.5 flex flex-col">{COMPANY_LINKS.map(renderLink)}</div>
            </div>

            {/* Resources */}
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-white">Resources</p>
              <div className="mt-3.5 flex flex-col">{RESOURCE_LINKS.map(renderLink)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Follow + subscribe */}
      <div className="relative z-1">
        <div className={CONTAINER}>
          <div className="flex flex-col items-start gap-4 border-t border-white/9 py-5 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-8">
            <div className="flex items-center gap-4.5">
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-white">Follow</p>
              <div className="flex gap-2.5">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${social.name} — ${social.handle}`}
                      title={`${social.name} — ${social.handle}`}
                      className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-(--soc) text-[13px] text-white ring-1 ring-white/20 shadow-[0_6px_16px_rgba(2,16,26,0.25)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:text-(--soc) hover:ring-white/60 hover:shadow-[0_8px_18px_rgba(2,16,26,0.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-yellow) motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                      style={{ "--soc": social.brand } as CSSProperties}
                    >
                      <Icon aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="w-full text-left lg:w-auto lg:text-right">
              <p className="mb-2 text-[12.5px] leading-[1.6] text-white/78">
                Subscribe for the latest loan updates and offers.
              </p>
              <form className="flex justify-start lg:justify-end" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address for newsletter
                </label>
                <div className="flex w-full max-w-70 overflow-hidden rounded-lg border border-white/16">
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="Your email address"
                    className="min-w-0 flex-1 border-none bg-white/8 px-2.75 py-2.25 text-[13px] text-white outline-none placeholder:text-white/35"
                  />
                  <button
                    type="submit"
                    className="cursor-pointer whitespace-nowrap border-none bg-(--brand-teal) px-3.5 py-2.25 text-[12px] font-bold text-white transition-colors hover:brightness-95"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-1 border-t border-white/9">
        <div className={CONTAINER}>
          <div className="flex flex-wrap items-center justify-between gap-3 py-4 max-sm:justify-center max-sm:text-center">
            <p className="text-[12.5px] text-white/60">
              © 2026 Indexia Finserve Pvt. Ltd. All rights reserved.
            </p>
            <nav aria-label="Legal" className="flex flex-wrap gap-6.5 max-sm:justify-center max-sm:gap-4.5">
              {LEGAL_LINKS.map((t) => (
                <Link
                  key={t.l}
                  to={t.h}
                  className="text-[12.5px] text-white/60 no-underline transition-colors hover:text-(--brand-yellow)"
                >
                  {t.l}
                </Link>
              ))}
            </nav>
          </div>
          <p className="pb-4.5 text-[11.5px] leading-[1.7] text-white/60 max-sm:text-center">
            Indexia Finance facilitates loan applications. Approval, loan amount, interest rate,
            fees and disbursal are decided by the lending bank or NBFC.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
