import { useState, useRef } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import ApplicationModal from "../modals/ApplicationModal";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

// ── Types ─────────────────────────────────────────────────────────────────────
interface LoanItem {
  tKey: string;       // "tKey" instead of "key" — "key" is reserved by React and never passed as a prop
  ringColors: string[];
}

// ── Data ──────────────────────────────────────────────────────────────────────
const loans: LoanItem[] = [
  { tKey: "loanProducts.personalLoan",           ringColors: ["#e74c3c","#f1c40f","#2ecc71","#3498db"] },
  { tKey: "loanProducts.businessLoan",           ringColors: ["#f39c12","#f1c40f","#e74c3c","#27ae60"] },
  { tKey: "loanProducts.homeLoan",               ringColors: ["#27ae60","#f1c40f","#e74c3c","#2980b9"] },
  { tKey: "loanProducts.loanAgainstProperty",    ringColors: ["#8e44ad","#e74c3c","#f1c40f","#27ae60"] },
  { tKey: "loanProducts.balanceTransfer",        ringColors: ["#16a085","#3498db","#e74c3c","#f39c12"] },
  { tKey: "loanProducts.projectLoan",            ringColors: ["#f1c40f","#e74c3c","#27ae60","#2980b9"] },
  { tKey: "loanProducts.carLoan",                ringColors: ["#e74c3c","#8e44ad","#f1c40f","#27ae60"] },
  { tKey: "loanProducts.educationLoan",          ringColors: ["#9b59b6","#3498db","#f1c40f","#27ae60"] },
  { tKey: "loanProducts.creditCard",             ringColors: ["#2ecc71","#e74c3c","#3498db","#f39c12"] },
  { tKey: "loanProducts.commercialPurchase",     ringColors: ["#3498db","#f1c40f","#27ae60","#e74c3c"] },
  { tKey: "loanProducts.workingCapital",         ringColors: ["#f39c12","#27ae60","#e74c3c","#3498db"] },
  { tKey: "loanProducts.leaseRentalDiscounting", ringColors: ["#8e44ad","#f1c40f","#2ecc71","#e74c3c"] },
  { tKey: "loanProducts.odCcLimit",              ringColors: ["#16a085","#e74c3c","#f39c12","#3498db"] },
  { tKey: "loanProducts.loanAgainstShare",       ringColors: ["#e74c3c","#3498db","#f1c40f","#27ae60"] },
  { tKey: "loanProducts.filmLoanFunding",        ringColors: ["#e67e22","#9b59b6","#2ecc71","#3498db"] },
  { tKey: "loanProducts.npalLoan",               ringColors: ["#c0392b","#f1c40f","#16a085","#8e44ad"] },
  { tKey: "loanProducts.goldLoan",               ringColors: ["#f39c12","#e74c3c","#27ae60","#2980b9"] },
  { tKey: "loanProducts.fdi",                    ringColors: ["#2980b9","#2ecc71","#f1c40f","#e74c3c"] },
];

// ── Globe Wireframe (without hover) ───────────────────────────────────────────
const GlobeWireframe = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#dbeafe" />
    {/* Latitude lines */}
    <ellipse cx="50" cy="50" rx="46" ry="15" fill="none" stroke="#93c5fd" strokeWidth="1" />
    <ellipse cx="50" cy="50" rx="46" ry="30" fill="none" stroke="#93c5fd" strokeWidth="1" />
    <line x1="4" y1="50" x2="96" y2="50" stroke="#93c5fd" strokeWidth="1" />
    {/* Longitude lines */}
    <ellipse cx="50" cy="50" rx="17" ry="46" fill="none" stroke="#93c5fd" strokeWidth="1" />
    <ellipse cx="50" cy="50" rx="32" ry="46" fill="none" stroke="#93c5fd" strokeWidth="1" />
    <line x1="50" y1="4" x2="50" y2="96" stroke="#93c5fd" strokeWidth="1" />
    <circle cx="50" cy="50" r="46" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
  </svg>
);

// ── Earth Globe with real-looking world map (on hover) ────────────────────────
const GlobeEarth = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="earth-clip">
        <circle cx="50" cy="50" r="46" />
      </clipPath>
    </defs>

    {/* Ocean */}
    <circle cx="50" cy="50" r="46" fill="#1a6fa8" />

    {/* ── Continents (real outlines, simplified & scaled to fit) ── */}
    <g clipPath="url(#earth-clip)" fill="#2ecc71" stroke="#27ae60" strokeWidth="0.3">

      {/* North America */}
      <path d="
        M 10 18 L 14 15 L 20 14 L 26 12 L 30 14 L 28 18
        L 32 20 L 34 24 L 30 28 L 26 32 L 24 38 L 20 42
        L 16 44 L 12 40 L 10 34 L 8 28 Z
      "/>
      {/* Central America / Caribbean bump */}
      <path d="M 20 42 L 24 44 L 22 48 L 18 46 Z"/>

      {/* South America */}
      <path d="
        M 22 50 L 28 48 L 34 50 L 36 56 L 35 64
        L 32 72 L 28 76 L 24 74 L 20 68 L 19 60
        L 20 54 Z
      "/>

      {/* Greenland */}
      <path d="M 28 6 L 34 4 L 38 6 L 36 12 L 30 13 L 27 10 Z"/>

      {/* Europe */}
      <path d="
        M 44 16 L 48 14 L 52 15 L 54 18 L 52 22
        L 50 26 L 47 27 L 44 25 L 42 21 Z
      "/>
      {/* Iberian peninsula bump */}
      <path d="M 42 24 L 44 26 L 42 29 L 40 27 Z"/>
      {/* Scandinavia */}
      <path d="M 48 12 L 52 10 L 54 14 L 51 16 L 48 15 Z"/>

      {/* Africa */}
      <path d="
        M 44 28 L 50 27 L 56 28 L 58 34 L 58 42
        L 56 50 L 54 58 L 50 64 L 46 62 L 42 54
        L 41 46 L 42 38 L 42 30 Z
      "/>

      {/* Asia (main body) */}
      <path d="
        M 54 14 L 62 12 L 70 11 L 78 13 L 84 16
        L 88 22 L 86 28 L 80 32 L 74 34 L 68 36
        L 62 38 L 56 36 L 52 32 L 52 26 L 54 20 Z
      "/>
      {/* Indian subcontinent */}
      <path d="M 64 36 L 68 38 L 68 46 L 65 50 L 62 46 L 62 38 Z"/>
      {/* Southeast Asia peninsula */}
      <path d="M 74 36 L 78 38 L 76 44 L 73 42 L 72 38 Z"/>
      {/* Japan islands */}
      <path d="M 86 24 L 89 22 L 90 26 L 87 28 Z"/>
      <path d="M 88 28 L 90 27 L 91 30 L 89 31 Z"/>

      {/* Australia */}
      <path d="
        M 76 56 L 84 54 L 90 56 L 92 62 L 90 68
        L 84 70 L 78 68 L 74 63 L 74 58 Z
      "/>
      {/* New Zealand */}
      <path d="M 92 66 L 94 64 L 95 68 L 93 70 Z"/>
      <path d="M 93 70 L 95 69 L 96 73 L 94 74 Z"/>
    </g>

    {/* Grid lines over earth */}
    <ellipse cx="50" cy="50" rx="46" ry="15" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" clipPath="url(#earth-clip)"/>
    <ellipse cx="50" cy="50" rx="46" ry="30" fill="none" stroke="rgba(253, 149, 149, 0.12)" strokeWidth="0.8" clipPath="url(#earth-clip)"/>
    <line x1="4" y1="50" x2="96" y2="50" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" clipPath="url(#earth-clip)"/>
    <ellipse cx="50" cy="50" rx="17" ry="46" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" clipPath="url(#earth-clip)"/>
    <line x1="50" y1="4" x2="50" y2="96" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" clipPath="url(#earth-clip)"/>

    {/* Subtle light sheen top-left */}
    <ellipse cx="34" cy="32" rx="14" ry="10" fill="rgba(255,255,255,0.08)" clipPath="url(#earth-clip)"/>

    {/* Border */}
    <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
  </svg>
);

// ── Colored 4-segment Ring ────────────────────────────────────────────────────
let ringCounter = 0;
const ColoredRing = ({ colors, size = 128 }: { colors: string[]; size?: number }) => {
  const [uid] = useState(() => `ring-${++ringCounter}`);
  const [c1, c2, c3, c4] = colors;
  return (
    <>
      <svg
        viewBox="0 0 128 128"
        width={size}
        height={size}
        className="absolute inset-0 pointer-events-none color-ring-spin"
        style={{ zIndex: 2 }}
      >
        <defs>
          <mask id={uid}>
            <circle cx="64" cy="64" r="62" fill="white" />
            <circle cx="64" cy="64" r="50" fill="black" />
          </mask>
        </defs>
        <path d="M64 2 A62 62 0 0 1 126 64"  fill="none" stroke={c1} strokeWidth="13" mask={`url(#${uid})`} />
        <path d="M126 64 A62 62 0 0 1 64 126" fill="none" stroke={c2} strokeWidth="13" mask={`url(#${uid})`} />
        <path d="M64 126 A62 62 0 0 1 2 64"  fill="none" stroke={c3} strokeWidth="13" mask={`url(#${uid})`} />
        <path d="M2 64 A62 62 0 0 1 64 2"   fill="none" stroke={c4} strokeWidth="13" mask={`url(#${uid})`} />
      </svg>
      <style>{`
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .color-ring-spin {
          transform-origin: 50% 50%;
          animation: ringRotate 6s linear infinite;
        }
      `}</style>
    </>
  );
};

// ── LoanCard ──────────────────────────────────────────────────────────────────
const LoanCard = (props: LoanItem & { onApplyClick?: (productName: string) => void }) => {
  const { t } = useTranslation();
  const { tKey, ringColors, onApplyClick } = props;
  const label = t(tKey);
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
      {/* ── Globe circle ── */}
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleApplyClick = (productName: string) => {
    setSelectedProduct(productName);
    setIsModalOpen(true);
  };

  const updateNavState = (swiper: SwiperType) => {
    setCanScrollLeft(!swiper.isBeginning);
    setCanScrollRight(!swiper.isEnd);
  };

  const goPrev = () => swiperRef.current?.slidePrev();
  const goNext = () => swiperRef.current?.slideNext();

  return (
    <>
      <section
        className="w-full overflow-hidden  sm:my-0 py-0 sm:py-0"
        style={{ background: "rgb(240, 249, 255)" }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* ═══ ONE shared Swiper instance for all breakpoints ═══ */}
        <div className="flex items-center gap-2 px-4 md:px-20 lg:px-40">
          {/* Desktop/tablet arrow — hidden on mobile */}
          <button
            onClick={goPrev}
            disabled={!canScrollLeft}
            className="hidden md:flex"
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              border: "none",
              color: canScrollLeft ? "#1e293b" : "#cbd5e1",
              backgroundColor: canScrollLeft ? "rgba(255,255,255,0.9)" : "rgba(241,245,249,0.6)",
              cursor: canScrollLeft ? "pointer" : "not-allowed",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
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

          <div className="flex-1 min-w-0 overflow-visible py-4">
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                updateNavState(swiper);
              }}
              onSlideChange={updateNavState}
              onResize={updateNavState}
              spaceBetween={0}
              slidesPerView={3}
              slidesPerGroup={1}
              breakpoints={{
                768: {
                  slidesPerView: 4,
                  slidesPerGroup: 1,
                },
                1024: {
                  slidesPerView: 9,
                  slidesPerGroup: 1,
                },
              }}
              className="loan-products-swiper"
            >
              {loans.map((loan) => (
                <SwiperSlide key={loan.tKey} className="py-2">
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
              borderRadius: "50%",
              border: "none",
              color: canScrollRight ? "#1e293b" : "#cbd5e1",
              backgroundColor: canScrollRight ? "rgba(255,255,255,0.9)" : "rgba(241,245,249,0.6)",
              cursor: canScrollRight ? "pointer" : "not-allowed",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
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

        {/* ═══ MOBILE: buttons + "Swipe to see more" below the same swiper ═══ */}
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
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={selectedProduct}
      />
    </>
  );
};

export default LoanProducts;
