import { useState, useRef } from "react";
import React from "react";
import { useApplyGate } from "../../hooks/useApplyGate";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

// ── Types ─────────────────────────────────────────────────────────────────────
interface LoanItem {
  id: string;
  label: string;
  ringColors: string[];
}

// ── Data ──────────────────────────────────────────────────────────────────────
import { products } from "./productDetailsData";

const loans: LoanItem[] = (() => {
  const catalogue = products.slice(0, 18);
  const npa = catalogue.find((product) => product.id === "npaLoan");
  const orderedProducts = catalogue.filter((product) => product.id !== "npaLoan");
  const loanAgainstPropertyIndex = orderedProducts.findIndex((product) => product.id === "lap");

  if (npa) orderedProducts.splice(loanAgainstPropertyIndex + 1, 0, npa);

  return orderedProducts.map((product) => ({
    id: product.id,
    label: product.id === "npaLoan" ? "NPA" : product.label,
    ringColors: ["#e74c3c", "#f1c40f", "#2ecc71", "#3498db"],
  }));
})();

// ── Globe Wireframe (without hover) ───────────────────────────────────────────
import { ColoredRing, GlobeEarth, GlobeWireframe } from "./LoanGlobes";

const LoanCard = (props: LoanItem & { onApplyClick?: (productId: string) => void }) => {
  const { id, label, ringColors, onApplyClick } = props;
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onApplyClick?.(id);
  };

  return (
    <button
      type="button"
      aria-label={`Apply for ${label}`}
      className="flex w-full cursor-pointer flex-col items-center border-0 bg-transparent p-0 text-inherit focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--brand-teal)"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Globe circle */}
      <div
        className="lp-globe"
        style={{
          transform: hovered ? "scale(1.08)" : "scale(1)",
        }}
      >
        {/* Layer 1 — Globe background */}
        <div
          style={{
            position: "absolute",
            inset: "4.5%",
            borderRadius: "50%",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          {hovered ? <GlobeEarth /> : <GlobeWireframe />}
        </div>

        {/* Layer 2 — 4-color ring */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
          <ColoredRing colors={ringColors} />
        </div>

        {/* Layer 3 — Center text, always on top inside the circle */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            backgroundColor: hovered ? "rgba(0,0,0,0.35)" : "transparent",
            transition: "background-color 0.3s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              width: "78%",
              padding: 0,
              gap: "0.25em",
            }}
          >
            {hovered ? (
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "max(8px, 10.9cqw)",
                  fontWeight: 800,
                  letterSpacing: 0.2,
                  lineHeight: 1.35,
                  textShadow: "0 1px 6px rgba(0,0,0,0.9)",
                }}
              >
                Apply<br />Now
              </span>
            ) : (
              <>
                <span
                  style={{
                    color: "var(--brand-dark)",
                    fontSize: "max(7px, 9.6cqw)",
                    fontWeight: 800,
                    letterSpacing: 0.2,
                    lineHeight: 1.2,
                    whiteSpace: "normal",
                    overflowWrap: "break-word",
                    textShadow: "0 1px 0 rgba(255,255,255,0.9), 0 -1px 0 rgba(255,255,255,0.9), 1px 0 0 rgba(255,255,255,0.9), -1px 0 0 rgba(255,255,255,0.9)",
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    display: "block",
                    flexShrink: 0,
                    color: "var(--brand-navy-light)",
                    fontFamily: "Georgia, serif",
                    fontSize: "max(7.5px, 10.4cqw)",
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  Apply
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

// ── LoanProducts ──────────────────────────────────────────────────────────────
const LoanProducts = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { requestApply, gate } = useApplyGate();

  const handleApplyClick = (productId: string) => {
    requestApply(productId);
  };

  const updateNavState = (swiper: SwiperType) => {
    setCanScrollLeft(!swiper.isBeginning);
    setCanScrollRight(!swiper.isEnd);
  };

  const goPrev = () => swiperRef.current?.slidePrev();
  const goNext = () => swiperRef.current?.slideNext();

  return (
    <>
      <section className="relative w-full my-0 py-0">
        {/* Pill: background, gradient border and clipping all live on this one element */}
        <div
          className="relative mx-auto overflow-hidden lp-ring"
          style={{ width: "min(100% - 20px, 1200px)", borderRadius: 9999 }}
        >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
          /* Pill background — same box as the gradient border, so it can never
             spill past the rounded ends at any viewport size. */
          .lp-ring {
            background: var(--brand-blue-200);
            -webkit-backdrop-filter: blur(5px);
            backdrop-filter: blur(5px);
          }
          /* Product globe: fluid so it shrinks with the slide, text scales with it */
          .lp-globe {
            position: relative;
            width: 100%;
            max-width: 110px;
            aspect-ratio: 1 / 1;
            margin-inline: auto;
            flex-shrink: 0;
            border-radius: 50%;
            container-type: inline-size;
            transition: transform 0.3s ease;
          }
          /* Gradient border ring — 3px, all four brand colors */
          .lp-ring::before {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            padding: 2px;
            background: conic-gradient(from 0deg, var(--brand-dark) 0deg, var(--brand-teal) 90deg, var(--brand-navy) 180deg, var(--brand-yellow) 270deg, var(--brand-dark) 360deg);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
            z-index: 2;
          }
        `}</style>

        {/* ONE shared Swiper instance for all breakpoints */}
          <div className="relative flex items-center gap-2 px-3 md:px-4" style={{ zIndex: 1 }}>
          {/* Desktop/tablet arrow — hidden on mobile */}
          <button
            onClick={goPrev}
            disabled={!canScrollLeft}
            className="hidden md:flex"
            style={{
              width: 20,
              height: 20,
              borderRadius: "20%",
              border: "none",
              color: canScrollLeft ? "#1e293b" : "#cbd5e1",
              backgroundColor: canScrollLeft ? "rgba(255,255,255,0.9)" : "rgba(241,245,249,0.6)",
              cursor: canScrollLeft ? "pointer" : "not-allowed",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
              flexShrink: 0,
              opacity: canScrollLeft ? 1 : 0.5,
              transition: "all 200ms ease",
            }}
            aria-label="Scroll left"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex-1 min-w-0 overflow-visible py-1.5">
            <Swiper
              modules={[Mousewheel]}
              mousewheel={{
                releaseOnEdges: true,
                sensitivity: 1,
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                updateNavState(swiper);
              }}
              onSlideChange={updateNavState}
              onResize={updateNavState}
              slidesPerView={3}
              spaceBetween={4}
              slidesPerGroup={1}
              breakpoints={{
                768: {
                  slidesPerView: 5,
                },
                1024: {
                  slidesPerView: 8,
                },
              }}
              className="loan-products-swiper"
            >
              {loans.map((loan) => (
                <SwiperSlide key={loan.label} className="py-1">
                  <LoanCard {...loan} onApplyClick={handleApplyClick} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop/tablet arrow — hidden on mobile */}
          <button
            onClick={goNext}
            disabled={!canScrollRight}
            className="hidden md:flex"
            style={{
              width: 20,
              height: 20,
              borderRadius: "20%",
              border: "none",
              color: canScrollRight ? "#1e293b" : "#cbd5e1",
              backgroundColor: canScrollRight ? "rgba(255,255,255,0.9)" : "rgba(241,245,249,0.6)",
              cursor: canScrollRight ? "pointer" : "not-allowed",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
              flexShrink: 0,
              opacity: canScrollRight ? 1 : 0.5,
              transition: "all 200ms ease",
            }}
            aria-label="Scroll right"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          </div>

        {/* MOBILE: buttons + "Swipe to see more" — kept inside the pill so the
            background and gradient border always wrap the whole control group */}
        <div className="md:hidden flex items-center justify-center gap-3 px-4 pb-2">
          <button
            onClick={goPrev}
            disabled={!canScrollLeft}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "none",
              color: canScrollLeft ? "#050505ff" : "#cbd5e1",
              backgroundColor: canScrollLeft ? "rgba(6,182,212,0.1)" : "rgba(226,232,240,0.3)",
              cursor: canScrollLeft ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              opacity: canScrollLeft ? 1 : 0.5,
              transition: "all 200ms ease",
            }}
            aria-label="Scroll left"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <p className="text-xs text-slate-400 font-medium whitespace-nowrap">
            Swipe to see more
          </p>

          <button
            onClick={goNext}
            disabled={!canScrollRight}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "none",
              color: canScrollRight ? "#000000ff" : "#cbd5e1",
              backgroundColor: canScrollRight ? "rgba(6,182,212,0.1)" : "rgba(226,232,240,0.3)",
              cursor: canScrollRight ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              opacity: canScrollRight ? 1 : 0.5,
              transition: "all 200ms ease",
            }}
            aria-label="Scroll right"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        </div>
      </section>

      {/* Application Modal */}
      {gate}
    </>
  );
};

export default LoanProducts;
