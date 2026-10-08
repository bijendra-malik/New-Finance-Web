import { useState, useEffect, useRef } from "react";
import bgImage from "../../assets/copyright-free.png";
import ApplicationModal from "../modals/ApplicationModal";

import { products, PRODUCT_META, VISIBLE_COUNT } from "./productDetailsData";
import type { Feature } from "./productDetailsData";

const ProductDetails = () => {
  const [activeId, setActiveId]   = useState(products[0].id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [visible, setVisible]     = useState(true);
  const [displayId, setDisplayId] = useState(products[0].id);
  const [scrollTop, setScrollTop] = useState(0);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const listRef    = useRef<HTMLDivElement>(null);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const ITEM_H = 52;
  const canScrollUp   = scrollTop > 0;
  const canScrollDown = scrollTop < (products.length - VISIBLE_COUNT) * ITEM_H;

  // Viewport entry trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSectionVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const next = Math.max(0, Math.min(scrollTop + dir * ITEM_H * 2, (products.length - VISIBLE_COUNT) * ITEM_H));
    setScrollTop(next);
    if (listRef.current) listRef.current.scrollTop = next;
  };

  const handleListScroll = () => {
    if (listRef.current) setScrollTop(listRef.current.scrollTop);
  };

  const handleSelect = (id: string) => {
    if (id === activeId) return;
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDisplayId(id);
      setActiveId(id);
      setVisible(true);
    }, 260);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const active = products.find((p) => p.id === displayId) ?? products[0];
  const meta   = PRODUCT_META[active.id] ?? { rate: "", tag: "", tagColor: "#22d3ee" };

  return (
    <>
      <style>{`        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(36px); }
          /* transform: none (not translateX(0)) — releases the pinned stacking
             context once the entrance finishes, so hover z-ordering works */
          to { opacity: 1; transform: none; }
        }
        .pd-enter { animation: slideInFromRight 0.3s cubic-bezier(0.22,1,0.36,1) both; }
        .pd-btn-list::-webkit-scrollbar { display: none; }
        .pd-btn-list { scrollbar-width: none; overflow-x: hidden; }
        @keyframes pdFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pd-fade-up { animation: pdFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }

        /* CTA buttons — paint-only hover (brightness/shadow/arrow nudge).
           The arrow nudges INSIDE the button's own padding, never outside. */
        .pd-cta svg { transition: transform 0.2s ease; }
        .pd-cta:hover svg { transform: translateX(3px); }

        /* Product list buttons — ALL hover effects are painted INSIDE the
           button's own border-box. No translate/scale on the button itself,
           so it can never escape its box, clip, or slide under a sibling. */
        .pd-product-btn {
          position: relative;
          overflow: hidden;
        }
        .pd-product-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            transparent 0%,
            rgba(38,174,144,0.20) 40%,
            rgba(6,106,156,0.25) 70%,
            rgba(38,174,144,0.12) 100%
          );
          transform: translateX(-100%) translateY(100%);
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 0;
          border-radius: 10px;
        }
        .pd-product-btn:hover::before {
          transform: translateX(0%) translateY(0%);
        }
        /* chevron indicator — absolutely positioned INSIDE the box,
           slides in from the inner edge on hover */
        .pd-product-btn::after {
          content: "";
          position: absolute;
          right: 12px;
          top: 50%;
          width: 6px;
          height: 6px;
          border-top: 2px solid currentColor;
          border-right: 2px solid currentColor;
          transform: translateY(-50%) rotate(45deg) translateX(-5px);
          opacity: 0;
          transition: opacity 0.25s ease, transform 0.25s ease;
          z-index: 1;
        }
        .pd-product-btn:hover::after {
          opacity: 0.9;
          transform: translateY(-50%) rotate(45deg) translateX(0);
        }
        .pd-product-btn > * {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative w-full min-h-112.5 flex items-stretch overflow-hidden"
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}
      >
        {/* Dark overlay — brand gradient */}
        <div className="absolute inset-0" style={{ background:"linear-gradient(135deg, rgb(3 37 60 / 88%) 0%, rgb(6 106 156 / 78%) 55%, rgb(38 174 144 / 0%) 100%)" }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-10 md:px-8 py-8 lg:px-10 flex flex-col lg:flex-row md:py-16 gap-10">

          {/* LEFT content */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <div
              key={displayId}
              className={visible ? "pd-enter" : ""}
              style={{ opacity: visible ? 1 : 0, transition: visible ? "none" : "opacity 0.22s ease" }}
            >

              {/* Heading + tag badge */}
              <div className="flex items-start gap-3 flex-wrap mb-1">
                <h2
                  className="text-2xl sm:text-3xl lg:text-[2rem] font-bold leading-tight"
                  style={{ color: "var(--brand-yellow)" }}
                >
                  {active.heading}
                </h2>
                {/* Tag badge */}
                {/* <span
                  className="mt-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide"
                  style={{ background: meta.tagColor + "22", color: meta.tagColor, border: `1px solid ${meta.tagColor}55` }}
                >
                  {meta.tag}
                </span> */}
              </div>

              {/* Accent + rate pill */}
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="flex gap-1.5">
                  <div className="h-0.75 w-8 rounded-full" style={{ background: "var(--brand-teal)" }} />
                  <div className="h-0.75 w-8 rounded-full" style={{ background: "var(--brand-yellow)" }} />
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border" style={{ color: "#ffffffff" }}>
                  {meta.rate}
                </span>
              </div>

              <p className="text-sm sm:text-[0.95rem] leading-relaxed max-w-2xl mb-8" style={{ color: "rgba(255,255,255,0.80)" }}>
                {active.subtitle}
              </p>

              {/* Features — with hover effect */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-7 mb-10">
                {active.features.map((feat, i) => (
                  <FeatureItem key={feat.title} feat={feat} delay={i * 60} visible={visible} />
                ))}
              </div>

              {/* Buttons */}
              <div className="relative z-20 flex items-center gap-4 flex-wrap">
                <a
                  href={(() => {
                    const docRouteMap: Record<string, string> = {
                      "personal-loan":    "/requireddocument/personal-loan",
                      "business-loan":    "/requireddocument/business-loan",
                      "home-loan":        "/requireddocument/home-loan",
                      "loanAP-loan":      "/requireddocument/loan-against-property",
                      "balance-loan":     "/requireddocument/balance-transfer",
                      "car-loan":         "/requireddocument/car-loan",
                      "credit-card":      "/requireddocument/credit-card",
                      "education-loan":   "/requireddocument/education-loan",
                      "project-loan":     "/requireddocument/project-loan",
                      "commercial-purchase": "/requireddocument/commercial-purchase",
                      "lease-rental":     "/requireddocument/lease-rental",
                      "working-capital":  "/requireddocument/working-capital",
                      "film-funding":     "/requireddocument/film-funding",
                      "od-cc-limit":      "/requireddocument/od-cc-limit",
                      "loan-against-share": "/requireddocument/loan-against-share",
                      "gold-loan":        "/requireddocument/gold-loan",
                      "npa":              "/requireddocument/npa",
                      "fdi":              "/requireddocument/fdi",
                    };
                    return docRouteMap[active.id] || `/requireddocument?loan=${encodeURIComponent(active.heading)}`;
                  })()}
                  className="pd-cta relative z-20 inline-flex items-center gap-2 px-7 py-2.5 rounded-lg font-bold text-white text-sm cursor-pointer select-none transition-all duration-200 hover:brightness-110 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, var(--brand-navy), var(--brand-teal))",
                    boxShadow: "0 4px 16px rgba(38,174,144,0.40)",
                    border: "1px solid rgba(38,174,144,0.45)",
                  }}
                >
                  Required Document
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a
                  href={`/showdetails/${active.id}`}
                  className="pd-cta relative z-20 inline-flex items-center gap-2 px-7 py-2.5 rounded-lg font-bold text-sm cursor-pointer select-none transition-all duration-200 hover:brightness-125 active:scale-95"
                  style={{
                    color: "var(--brand-yellow)",
                    border: "1px solid rgba(255, 255, 255, 1)",
                    background: "rgba(242,242,49,0.07)",
                  }}
                >
                  Know More About Your Loan
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: scrollable button list */}
          <div className="lg:w-56 flex flex-col gap-0 shrink-0">

            {/* Up chevron */}
            <button
              onClick={() => scrollBy(-1)}
              className="flex items-center justify-center mb-1 rounded-lg transition-all duration-200"
              style={{ opacity: canScrollUp ? 1 : 0, pointerEvents: canScrollUp ? "auto" : "none", cursor: "pointer" }}
              aria-label="Scroll up"
            >
              <svg className="w-4 h-4" style={{ color: "var(--brand-teal)" }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Button list */}
            <div
              ref={listRef}
              onScroll={handleListScroll}
              className="pd-btn-list flex flex-col gap-3 overflow-y-auto"
              style={{ maxHeight: `${VISIBLE_COUNT * ITEM_H}px` }}
            >
              {products.map((p, i) => {
                const isActive  = p.id === activeId;
                const isHovered = hoveredId === p.id && !isActive;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p.id)}
                    onMouseEnter={() => setHoveredId(p.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="pd-product-btn w-full text-left pl-3 pr-8 py-2.5 text-sm cursor-pointer select-none whitespace-nowrap shrink-0 flex items-center gap-2.5"
                    style={{
                      borderRadius: "10px",
                      // active: teal bg + dark text | hovered: teal tint + lime text | default: subtle
                      background: isActive
                        ? "linear-gradient(135deg, var(--brand-navy), var(--brand-teal))"
                        : isHovered
                        ? "rgba(38,174,144,0.15)"
                        : "rgba(255,255,255,0.04)",
                      color: isActive
                        ? "var(--brand-yellow)"           // lime text on active
                        : isHovered
                        ? "var(--brand-yellow)"           // teal text on hover
                        : "rgba(255, 255, 255, 1)", // muted white default
                      border: isActive
                        ? "1.5px solid rgba(38,174,144,0.80)"
                        : isHovered
                        ? "1.5px solid rgba(38,174,144,0.50)"
                        : "1.5px solid rgb(242 242 49)",
                      boxShadow: isActive
                        ? "0 4px 16px rgba(6,106,156,0.45)"
                        : isHovered
                        ? "inset 0 0 0 1px rgba(38,174,144,0.35), inset 0 0 14px rgba(38,174,144,0.18)"
                        : "none",
                      /* no transform on hover — the redesign keeps every hover
                         effect inside the button's own box (see CSS above) */
                      fontWeight: isActive ? 700 : 500,
                      opacity: sectionVisible ? 1 : 0,
                      transitionProperty: "opacity, transform, background, border, box-shadow, color",
                      transitionDuration: "0.4s, 0.25s, 0.25s, 0.25s, 0.25s, 0.25s",
                      transitionDelay: sectionVisible ? `${i * 50}ms` : "0ms",
                    }}
                  >
                    {/* Product icon */}
                    {/* <span className="text-base leading-none shrink-0">{PRODUCT_ICON[p.id]}</span> */}
                    <span className="truncate">{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Down chevron */}
            <button
              onClick={() => scrollBy(1)}
              className="flex items-center justify-center rounded-lg mt-1 transition-all duration-200"
              style={{ opacity: canScrollDown ? 1 : 0, pointerEvents: canScrollDown ? "auto" : "none", cursor: "pointer" }}
              aria-label="Scroll down"
            >
              <svg className="w-4 h-4" style={{ color: "var(--brand-teal)" }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

          </div>
        </div>
      </section>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={active.heading}
      />
    </>
  );
};

// ── FeatureItem with hover glow ───────────────────────────────────────────────
const FeatureItem = ({
  feat,
  delay,
  visible,
}: {
  feat: Feature;
  delay: number;
  visible: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex flex-col gap-2 cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mb-1 shrink-0 transition-all duration-300"
        style={{
          background: hovered ? "rgba(38,174,144,0.25)" : "rgba(38,174,144,0.12)",
          border: hovered ? "1px solid rgba(38,174,144,0.70)" : "1px solid rgba(38,174,144,0.30)",
          boxShadow: hovered ? "0 0 14px rgba(38,174,144,0.35)" : "none",
        }}
      >
        <span style={{ color: "var(--brand-teal)" }}>{feat.icon}</span>
      </div>
      <p
        className="font-bold text-sm leading-snug transition-colors duration-200"
        style={{ color: hovered ? "var(--brand-yellow)" : "#fff" }}
      >
        {feat.title}
      </p>
      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.62)" }}>{feat.desc}</p>
    </div>
  );
};

export default ProductDetails;
