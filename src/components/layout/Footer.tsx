import { useRef, useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import footerBg from "../../assets/bg-footerimg01.webp";
import globeVideo from "../../assets/logo-footer.webm";
import { socialLinks } from "../../constants/socialLinks";
import {
  EMAIL_CONTACT,
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
        <span className="ftr-arrow" aria-hidden="true">{item.external ? "↗" : "→"}</span>
      </>
    );
    return item.external ? (
      <a key={item.l} href={item.h} target="_blank" rel="noreferrer" className="ftr-link">
        {inner}
      </a>
    ) : (
      <Link key={item.l} to={item.h} className="ftr-link">
        {inner}
      </Link>
    );
  };

  return (
    <>
      <style>{`
      .ftr-root {
        position: relative;
        overflow: hidden;
      }
      .ftr-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, var(--brand-navy-deep) 0%, var(--brand-navy) 60%, var(--brand-navy-light) 100%);
        z-index: 0;
      }
      .ftr-bg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        opacity: 0.07;
        pointer-events: none;
        user-select: none;
        z-index: 0;
      }
      .ftr-content { position: relative; z-index: 1; }
      .ftr-inner {
        max-width: 1280px;
        margin: 0 auto;
        padding-left: 24px;
        padding-right: 24px;
      }

      /* ── Top strip ── */
      .ftr-strip-wrap {
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      .ftr-strip {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 40px;
        padding: 20px 0 14px;
        font-size: 10.5px;
        font-weight: 600;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.7);
      }
      .ftr-strip li { display: flex; align-items: center; gap: 9px; }
      .ftr-strip-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--brand-teal);
        box-shadow: 0 0 0 3px rgba(38,174,144,0.18);
      }
      .ftr-strip-first { color: rgba(255,255,255,0.85); }

      /* ── Main grid ── */
      .ftr-main {
        display: grid;
        grid-template-columns: 1.6fr 1fr 0.72fr 0.95fr;
        gap: 32px;
        align-items: start;
        padding: 30px 0 26px;
      }

      .ftr-brand {
        display: flex;
        align-items: baseline;
        gap: 6px;
        text-decoration: none;
      }
      .ftr-brand-y { font-size: 27px; font-weight: 800; color: var(--brand-yellow); }
      .ftr-brand-w { font-size: 27px; font-weight: 800; color: #fff; }
      .ftr-group {
        margin-top: 10px;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.68);
      }
      .ftr-desc {
        margin-top: 16px;
        max-width: 440px;
        font-size: 15px;
        line-height: 1.7;
        color: rgba(255,255,255,0.74);
      }

      .ftr-contact { margin-top: 22px; display: flex; flex-direction: column; gap: 10px; }
      .ftr-contact-row { display: flex; align-items: baseline; gap: 14px; }
      .ftr-label {
        min-width: 52px;
        font-size: 11.5px;
        font-weight: 600;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.68);
      }
      .ftr-value {
        font-size: 13px;
        color: rgba(255,255,255,0.88);
        text-decoration: none;
        transition: color 0.2s;
      }
      .ftr-value:hover { color: var(--brand-yellow); }

      /* Globe */
      .ftr-globe-wrap {
        position: relative;
        width: 100%;
        max-width: 232px;
        aspect-ratio: 1 / 1;
        margin: 0 auto;
      }
      .ftr-globe-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        -webkit-mask-image: radial-gradient(circle, #000 58%, rgba(0,0,0,0.35) 72%, transparent 88%);
        mask-image: radial-gradient(circle, #000 58%, rgba(0,0,0,0.35) 72%, transparent 88%);
      }
      .ftr-globe-glow {
        position: absolute;
        inset: -14px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(38,174,144,0.25) 0%, rgba(38,174,144,0) 70%);
        pointer-events: none;
      }

      /* Link columns */
      .ftr-heading {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #ffffff;
      }
      .ftr-links { margin-top: 14px; display: flex; flex-direction: column; }
      .ftr-link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 9px 0;
        font-size: 14.5px;
        color: rgba(255,255,255,0.86);
        text-decoration: none;
        transition: color 0.2s;
      }
      .ftr-link:hover { color: var(--brand-yellow); }
      .ftr-arrow { font-size: 12px; color: rgba(255,255,255,0.3); transition: color 0.2s, transform 0.2s; }
      .ftr-link:hover .ftr-arrow { color: var(--brand-yellow); transform: translate(2px, -2px); }

      /* Follow + subscribe */
      .ftr-subscribe {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 16px 32px;
        padding: 20px 0;
        border-top: 1px solid rgba(255,255,255,0.09);
      }
      .ftr-follow { display: flex; align-items: center; gap: 18px; }
      .ftr-socials { display: flex; gap: 10px; }
      .ftr-social {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: var(--soc, rgba(255,255,255,0.08));
        border: 1px solid var(--soc, rgba(255,255,255,0.18));
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        text-decoration: none;
        transition: transform 0.2s, background 0.2s, color 0.2s, border-color 0.2s;
      }
      .ftr-social:hover {
        transform: translateY(-3px);
        background: #ffffff;
        border-color: var(--soc, #ffffff);
        color: var(--soc, #ffffff);
      }

      .ftr-sub-wrap { text-align: right; }
      .ftr-sub-note {
        margin-bottom: 8px;
        font-size: 12.5px;
        line-height: 1.6;
        color: rgba(255,255,255,0.78);
      }
      .ftr-sub { display: flex; justify-content: flex-end; }
      .ftr-sub-row {
        display: flex;
        width: 100%;
        max-width: 280px;
        border: 1px solid rgba(255,255,255,0.16);
        border-radius: 8px;
        overflow: hidden;
      }
      .ftr-input {
        flex: 1;
        padding: 9px 11px;
        font-size: 13px;
        border: none;
        outline: none;
        background: rgba(255,255,255,0.08);
        color: #fff;
        min-width: 0;
      }
      .ftr-input::placeholder { color: rgba(255,255,255,0.35); }
      .ftr-sub-btn {
        padding: 9px 14px;
        background: var(--brand-teal);
        color: #fff;
        font-weight: 700;
        font-size: 12px;
        border: none;
        cursor: pointer;
        white-space: nowrap;
        transition: background 0.2s;
      }
      .ftr-sub-btn:hover { background: #1e9478; }

      /* Bottom */
      .ftr-bottom {
        border-top: 1px solid rgba(255,255,255,0.09);
      }
      .ftr-bottom-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 16px 0;
      }
      .ftr-copy { font-size: 12.5px; color: rgba(255,255,255,0.6); }
      .ftr-legal { display: flex; flex-wrap: wrap; gap: 26px; }
      .ftr-legal a {
        font-size: 12.5px;
        color: rgba(255,255,255,0.6);
        text-decoration: none;
        transition: color 0.2s;
      }
      .ftr-legal a:hover { color: var(--brand-yellow); }
      .ftr-disclaimer {
        font-size: 11.5px;
        line-height: 1.7;
        color: rgba(255,255,255,0.6);
        padding-bottom: 18px;
      }

      /* ── Responsive: Tablet (640–1023px) ── */
      @media (max-width: 1023px) {
        .ftr-main {
          grid-template-columns: 1fr 1fr;
          gap: 28px 32px;
          padding: 26px 0 22px;
        }
        .ftr-brand-col { grid-column: 1 / -1; }
        .ftr-globe-col { grid-column: 1 / -1; }
        .ftr-globe-wrap { max-width: 200px; }
        .ftr-subscribe { flex-direction: column; align-items: flex-start; }
        .ftr-sub-wrap { text-align: left; width: 100%; }
        .ftr-sub { justify-content: flex-start; }
        .ftr-sub-row { margin: 0; }
      }

      /* ── Responsive: Mobile (<640px) ── */
      @media (max-width: 639px) {
        .ftr-inner { padding-left: 20px; padding-right: 20px; }
        .ftr-strip { gap: 8px 20px; padding: 18px 0 12px; }
        .ftr-main { grid-template-columns: 1fr; gap: 24px; padding: 22px 0; }
        .ftr-globe-wrap { max-width: 170px; }
        .ftr-desc { font-size: 14px; }
        .ftr-bottom-row { justify-content: center; text-align: center; }
        .ftr-legal { justify-content: center; gap: 18px; }
        .ftr-disclaimer { text-align: center; }
      }
    `}</style>

      <footer className="ftr-root">
        <div className="ftr-overlay" />
        <img src={footerBg} alt="" aria-hidden="true" loading="lazy" decoding="async" className="ftr-bg" />

        {/* Top accent line */}
        <div className="ftr-content" style={{ height: "3px", background: "linear-gradient(90deg,var(--brand-navy),var(--brand-teal),var(--brand-yellow))" }} />

        {/* Top strip */}
        <div className="ftr-content">
          <div className="ftr-inner">
            <div className="ftr-strip-wrap">
              <ul className="ftr-strip">
                {TOP_STRIP.map((item, i) => (
                  <li key={item} className={i === 0 ? "ftr-strip-first" : undefined}>
                    {i === 0 && <span className="ftr-strip-dot" aria-hidden="true" />}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="ftr-content">
          <div className="ftr-inner">
            <div className="ftr-main">

              {/* Brand + contact */}
              <div className="ftr-brand-col">
                <Link to="/" className="ftr-brand" style={{ textDecoration: "none" }}>
                  <span className="ftr-brand-y">Indexia</span>
                  <span className="ftr-brand-w">Finance</span>
                </Link>
                <p className="ftr-group">An Indexia Group Company</p>

                <p className="ftr-desc">
                  Services for investors, FDI entities, NBFCs, and banks, facilitating secured and unsecured borrowing solutions aligned with partner policies. Final approval rests solely with the lender.
                </p>

                <div className="ftr-contact">
                  <div className="ftr-contact-row">
                    <span className="ftr-label">Call</span>
                    <span>
                      <a href={PHONE_LANDLINE_HREF} className="ftr-value">{PHONE_LANDLINE}</a>
                      <span style={{ color: "rgba(255,255,255,0.4)" }}> · </span>
                      <a href={PHONE_MOBILE_HREF} className="ftr-value">{PHONE_MOBILE}</a>
                    </span>
                  </div>
                  <div className="ftr-contact-row">
                    <span className="ftr-label">Email</span>
                    <a href={`mailto:${EMAIL_CONTACT}`} className="ftr-value">{EMAIL_CONTACT}</a>
                  </div>
                  <div className="ftr-contact-row">
                    <span className="ftr-label">Office</span>
                    <span className="ftr-value" style={{ cursor: "default" }}>Naraina Vihar, New Delhi</span>
                  </div>
                </div>
              </div>

              {/* Globe */}
              <div className="ftr-globe-col">
                <div className="ftr-globe-wrap">
                  <div className="ftr-globe-glow" />
                  <video
                    ref={videoRef}
                    className="ftr-globe-video"
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
                <p className="ftr-heading">Company</p>
                <div className="ftr-links">{COMPANY_LINKS.map(renderLink)}</div>
              </div>

              {/* Resources */}
              <div>
                <p className="ftr-heading">Resources</p>
                <div className="ftr-links">{RESOURCE_LINKS.map(renderLink)}</div>
              </div>

            </div>
          </div>
        </div>

        {/* Follow + subscribe */}
        <div className="ftr-content">
          <div className="ftr-inner">
            <div className="ftr-subscribe">
              <div className="ftr-follow">
                <p className="ftr-heading">Follow</p>
                <div className="ftr-socials">
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
                        className="ftr-social"
                        style={{ "--soc": social.brand } as CSSProperties}
                      >
                        <Icon aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="ftr-sub-wrap">
                <p className="ftr-sub-note">
                  Subscribe for the latest loan updates and offers.
                </p>
                <form className="ftr-sub" onSubmit={(e) => e.preventDefault()}>
                  <label htmlFor="newsletter-email" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
                    Email address for newsletter
                  </label>
                  <div className="ftr-sub-row">
                    <input id="newsletter-email" type="email" placeholder="Your email address" className="ftr-input" />
                    <button type="submit" className="ftr-sub-btn">Subscribe</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="ftr-content ftr-bottom">
          <div className="ftr-inner">
            <div className="ftr-bottom-row">
              <p className="ftr-copy">© 2026 Indexia Finserve Pvt. Ltd. All rights reserved.</p>
              <nav className="ftr-legal" aria-label="Legal">
                {LEGAL_LINKS.map((t) => (
                  <Link key={t.l} to={t.h}>{t.l}</Link>
                ))}
              </nav>
            </div>
            <p className="ftr-disclaimer">
              Indexia Finance facilitates loan applications. Approval, loan amount, interest rate,
              fees and disbursal are decided by the lending bank or NBFC.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
