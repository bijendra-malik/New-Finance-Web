import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import footerBg from "../../assets/bg-footerimg01.png";
import globeVideo from "../../assets/logo-footer.webm";
import { SITE_URL } from "../../constants/siteLinks";

const Footer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.defaultMuted = true;
    v.muted = true;
    const play = () => { v.play().catch(() => {}); };
    play();
    v.addEventListener("pause", play);
    return () => v.removeEventListener("pause", play);
  }, []);

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

      .ftr-link {
        font-size: 14px;
        color: rgba(255,255,255,0.58);
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: color 0.2s, transform 0.2s;
        line-height: 2;
      }
      .ftr-link:hover {
        color: var(--brand-yellow);
        transform: translateX(4px);
      }
      .ftr-heading {
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #fff;
        margin-bottom: 8px;
      }
      .ftr-divider {
        width: 30px;
        height: 3px;
        background: linear-gradient(90deg, var(--brand-teal), var(--brand-yellow));
        border-radius: 2px;
        margin-bottom: 16px;
      }
      .ftr-social {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.18);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        text-decoration: none;
        transition: background 0.2s, border-color 0.2s, transform 0.2s;
      }
      .ftr-social:hover {
        background: var(--brand-teal);
        border-color: var(--brand-teal);
        transform: translateY(-3px);
      }
      .ftr-input {
        flex: 1;
        padding: 9px 11px;
        font-size: 13px;
        border: none;
        outline: none;
        background: rgba(255,255,255,0.08);
        color: #fff;
        border-radius: 8px 0 0 8px;
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
        border-radius: 0 8px 8px 0;
        white-space: nowrap;
        transition: background 0.2s;
      }
      .ftr-sub-btn:hover { background: #1e9478; }

      /* ── Responsive: Tablet (640–1023px) ── */
      @media (max-width: 1023px) {
        .ftr-main-pad {
          padding: 48px 24px 48px !important;
        }
        .ftr-grid {
          grid-template-columns: 1fr 1fr !important;
          gap: 36px 28px !important;
        }
        /* Globe col spans both columns and sits at top */
        .ftr-globe-col {
          grid-column: 1 / -1;
          order: -1;
        }
        .ftr-bottom-pad {
          padding: 16px 24px !important;
        }
      }

      /* ── Responsive: Mobile (<640px) ── */
      @media (max-width: 639px) {
        .ftr-main-pad {
          padding: 40px 20px 40px !important;
        }
        .ftr-grid {
          grid-template-columns: 1fr !important;
          gap: 32px 0 !important;
        }
        .ftr-globe-col {
          grid-column: 1 / -1;
          order: -1;
        }
        .ftr-globe-wrap {
          max-width: 180px !important;
        }
        .ftr-bottom-pad {
          padding: 14px 20px !important;
          justify-content: center !important;
          text-align: center !important;
        }
        .ftr-bottom-links {
          justify-content: center !important;
        }
      }

      /* ── Globe video: circular porthole with soft-fade edge so the
         rectangular video frame disappears into the footer bg ── */
      .ftr-globe-wrap {
        position: relative;
        width: 100%;
        max-width: 260px;
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
    `}</style>

    <footer className="ftr-root">
      <div className="ftr-overlay" />
      <img src={footerBg} alt="" aria-hidden="true" className="ftr-bg" />

      {/* Top accent line */}
      <div className="ftr-content" style={{ height: "3px", background: "linear-gradient(90deg,var(--brand-navy),var(--brand-teal),var(--brand-yellow))" }} />

      {/* ── Main grid ── */}
      <div
        className="ftr-content ftr-main-pad"
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "72px 0px 65px", minHeight: "300px" }}
      >
        <div
          className="ftr-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 300px 1fr 1.3fr",
            gap: "32px 40px",
            alignItems: "start",
          }}
        >

          {/* ── Col 1: Company ── */}
          <div style={{ alignSelf: "start" }}>
            <p className="ftr-heading">Company</p>
            <div className="ftr-divider" />
            <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
              {[
                { l: "About Us",          h: "#" },
                { l: "Indexia Group",     h: "#" },
                { l: "Group Website",     h: "#" },
                { l: "Advertise With Us", h: "#" },
              ].map(item => (
                <a key={item.l} href={item.h} className="ftr-link">
                  <span style={{ color: "var(--brand-teal)", fontWeight: 700, fontSize: "14px" }}>›</span>
                  {item.l}
                </a>
              ))}
            </div>
          </div>

          {/* ── Col 2: Resources ── */}
          <div style={{ alignSelf: "start" }}>
            <p className="ftr-heading">Resources</p>
            <div className="ftr-divider" />
            <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
              {[
                { l: "Careers",            h: `${SITE_URL}/careers/` },
                { l: "Product & Services", h: `${SITE_URL}/product-services/` },
                { l: "Terms of Use",       h: `${SITE_URL}/terms-of-use/` },
                { l: "Terms & Conditions", h: `${SITE_URL}/terms-conditions/` },
              ].map(item => (
                <a key={item.l} href={item.h} className="ftr-link">
                  <span style={{ color: "var(--brand-teal)", fontWeight: 700, fontSize: "14px" }}>›</span>
                  {item.l}
                </a>
              ))}
            </div>
          </div>

          {/* ── Col 3 (CENTER): Logo + Globe video ── */}
          <div className="ftr-globe-col" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "25px", textAlign: "center" }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", gap: "3px", alignItems: "baseline" }}>
                <span style={{ fontSize: "25px", fontWeight: 800, color: "var(--brand-yellow)" }}>Indexia</span>
                <span style={{ fontSize: "25px", fontWeight: 800, color: "#fff" }}>Finance</span>
              </div>
            </Link>

            <div className="ftr-globe-wrap">
              <div className="ftr-globe-glow" />
              <video
                ref={videoRef}
                className="ftr-globe-video"
                src={globeVideo}
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
              />
            </div>
          </div>

          {/* ── Col 4: Knowledge ── */}
          <div style={{ alignSelf: "start" }}>
            <p className="ftr-heading">Knowledge</p>
            <div className="ftr-divider" />
            <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
              {[
                { l: "News & Knowledge",      h: `${SITE_URL}/news/` },
                { l: "Global Research",        h: `${SITE_URL}/global-research/` },
                { l: "Security Tips",          h: `${SITE_URL}/security-tips/` },
                { l: "Track Your Application", h: `${SITE_URL}/track-your-application/` },
                { l: "Blog",                   h: `${SITE_URL}/blog/` },
              ].map(item => (
                <a key={item.l} href={item.h} className="ftr-link">
                  <span style={{ color: "var(--brand-teal)", fontWeight: 700, fontSize: "14px" }}>›</span>
                  {item.l}
                </a>
              ))}
            </div>
          </div>

          {/* ── Col 5: Stay Updated + Socials ── */}
          <div style={{ alignSelf: "start" }}>
            <p className="ftr-heading">Stay Updated</p>
            <div className="ftr-divider" />
            <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.52)", marginBottom: "12px", lineHeight: 1.65 }}>
              Subscribe for the latest loan updates and offers.
            </p>
            <div style={{ display: "flex", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.16)", marginBottom: "20px" }}>
              <label htmlFor="newsletter-email" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
                Email address for newsletter
              </label>
              <input id="newsletter-email" type="email" placeholder="Your email address" className="ftr-input" />
              <button className="ftr-sub-btn">Subscribe</button>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <a href="https://www.facebook.com/indexia.finance.3" aria-label="Facebook" className="ftr-social"><FaFacebookF /></a>
              <a href="https://www.linkedin.com/in/indexia-finance/" aria-label="LinkedIn" className="ftr-social"><FaLinkedinIn /></a>
              <a href="https://www.instagram.com/finance.indexia/" aria-label="Instagram" className="ftr-social"><FaInstagram /></a>
              <a href="https://www.youtube.com/@FinanceIndexia" aria-label="YouTube" className="ftr-social"><FaYoutube /></a>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="ftr-content" style={{ borderTop: "1px solid rgba(255,255,255,0.09)" }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          padding: "18px 0px 18px",
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between", gap: "8px",
        }} className="ftr-bottom-pad">
          <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255, 255, 255, 1)", letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "center" }}>
              An Indexia Group Company
            </p>
          <div style={{ display: "flex", gap: "20px" }} className="ftr-bottom-links">
            {[
              { l: "Privacy Policy",   h: `${SITE_URL}/privacy-policy/` },
              { l: "Terms of Service", h: `${SITE_URL}/terms-of-use/` },
            ].map(t => (
              <a key={t.l} href={t.h}
                style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--brand-yellow)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
              >
                {t.l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  </>
  );
};

export default Footer;