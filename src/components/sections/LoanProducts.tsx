import { useState, useRef } from "react";
import React from "react";
import { useApplyGate } from "../../hooks/useApplyGate";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

// ── Types ─────────────────────────────────────────────────────────────────────
interface LoanItem {
  label: string;
  ringColors: string[];
}

// ── Data ──────────────────────────────────────────────────────────────────────
const loans: LoanItem[] = [
  { label: "Personal Loan",            ringColors: ["#e74c3c","#f1c40f","#2ecc71","#3498db"] },
  { label: "Business Loan",            ringColors: ["#f39c12","#f1c40f","#e74c3c","#27ae60"] },
  { label: "Home Loan",                ringColors: ["#27ae60","#f1c40f","#e74c3c","#2980b9"] },
  { label: "Loan Against Property",    ringColors: ["#8e44ad","#e74c3c","#f1c40f","#27ae60"] },
  { label: "Balance Transfer",         ringColors: ["#16a085","#3498db","#e74c3c","#f39c12"] },
  { label: "Project Loan",             ringColors: ["#f1c40f","#e74c3c","#27ae60","#2980b9"] },
  { label: "Vehicle Loan",             ringColors: ["#e74c3c","#8e44ad","#f1c40f","#27ae60"] },
  { label: "Education Loan",           ringColors: ["#9b59b6","#3498db","#f1c40f","#27ae60"] },
  { label: "Credit Card",              ringColors: ["#2ecc71","#e74c3c","#3498db","#f39c12"] },
  { label: "Commercial Purchase",      ringColors: ["#3498db","#f1c40f","#27ae60","#e74c3c"] },
  { label: "Working Capital",          ringColors: ["#f39c12","#27ae60","#e74c3c","#3498db"] },
  { label: "Lease Rental Discounting", ringColors: ["#8e44ad","#f1c40f","#2ecc71","#e74c3c"] },
  { label: "OD CC Limit",              ringColors: ["#16a085","#e74c3c","#f39c12","#3498db"] },
  { label: "Loan Against Share",       ringColors: ["#e74c3c","#3498db","#f1c40f","#27ae60"] },
  { label: "Film Funding",             ringColors: ["#e67e22","#9b59b6","#2ecc71","#3498db"] },
  { label: "NPA",                      ringColors: ["#c0392b","#f1c40f","#16a085","#8e44ad"] },
  { label: "Gold Loan",                ringColors: ["#f39c12","#e74c3c","#27ae60","#2980b9"] },
  { label: "FDI",                      ringColors: ["#2980b9","#2ecc71","#f1c40f","#e74c3c"] },
];

// ── Globe Wireframe (without hover) ───────────────────────────────────────────
import { ColoredRing, GlobeEarth, GlobeWireframe } from "./LoanGlobes";

const LoanCard = (props: LoanItem & { onApplyClick?: (productName: string) => void }) => {
  const { label, ringColors, onApplyClick } = props;
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onApplyClick) onApplyClick(label);
  };

  return (
    <div
      className="flex flex-col items-center cursor-pointer w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{
        position: "relative",
        zIndex: hovered ? 20 : 1,
      }}
    >
      {/* Globe circle */}
      <div
        style={{
          position: "relative",
          width: 110,
          height: 110,
          borderRadius: "50%",
          transform: hovered ? "scale(1.08)" : "scale(1)",
          transition: "transform 0.3s ease",
          flexShrink: 0,
        }}
      >
        {/* Layer 1 — Globe background */}
        <div
          style={{
            position: "absolute",
            inset: 5,
            borderRadius: "50%",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          {hovered ? <GlobeEarth /> : <GlobeWireframe />}
        </div>

        {/* Layer 2 — 4-color ring */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
          <ColoredRing colors={ringColors} size={110} />
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
          <span
            style={{
              display: "block",
              textAlign: "center",
              fontWeight: 800,
              fontSize: 12,
              lineHeight: 1.35,
              letterSpacing: 0.2,
              padding: "0 10px",
              color: hovered ? "#ffffff" : "var(--brand-dark)",
              textShadow: hovered
                ? "0 1px 6px rgba(0,0,0,0.9)"
                : "0 1px 0 rgba(255,255,255,0.9), 0 -1px 0 rgba(255,255,255,0.9), 1px 0 0 rgba(255,255,255,0.9), -1px 0 0 rgba(255,255,255,0.9)",
              transition: "color 0.3s ease",
            }}
          >
            {hovered ? (
              <>Apply<br />Now</>
            ) : (
              label
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

// ── LoanProducts ──────────────────────────────────────────────────────────────
const LoanProducts = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { requestApply, gate } = useApplyGate();

  const handleApplyClick = (productName: string) => {
    requestApply(productName);
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
        <div
          aria-hidden
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(100% - 20px, 1200px)",
            borderRadius: 9999,
            background: "rgba(240,249,255,0.2)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            zIndex: 0,
          }}
        />
        {/* Clip container: same width as the slab. */}
        <div
          className="relative mx-auto overflow-hidden lp-ring"
          style={{ width: "min(100% - 20px, 1200px)", borderRadius: 9999 }}
        >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
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
        </div>

        {/* MOBILE: buttons + "Swipe to see more" below the same swiper */}
        <div className="md:hidden flex items-center justify-center gap-3 mt-1 px-4">
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
      </section>

      {/* Application Modal */}
      {gate}
    </>
  );
};

export default LoanProducts;
