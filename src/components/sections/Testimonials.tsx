import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BRAND_COLORS, TESTIMONIALS, TRUST_METRICS } from "./testimonialsData";
import TestimonialCard from "./TestimonialCard";

const TrustMetric = ({
  icon: Icon,
  value,
  label,
  color,
  index,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
  index: number;
}) => {
  const [hoveredMetric, setHoveredMetric] = useState(false);
  return (
  <div
    className="flex flex-col items-start gap-3 px-5 py-2 rounded-2xl transition-all duration-300 group cursor-pointer relative"
    style={{
      background: "#ffffff",
      border: `1.5px solid ${color}40`,
      /* inside-the-box hover: tinted ring + glow painted via box-shadow,
         no scale — the metric card never leaves its grid cell */
      boxShadow: hoveredMetric
        ? `0 0 0 3px ${color}25, 0 4px 16px -2px ${color}40`
        : "0 2px 12px rgba(6,106,156,0.08)",
      animation: `fadeInLeft 0.6s ease-out ${index * 0.1}s both`,
    }}
    onMouseEnter={() => setHoveredMetric(true)}
    onMouseLeave={() => setHoveredMetric(false)}
  >
      <div className="relative z-10 flex items-center gap-4 w-full">
        <div
          className="p-2 rounded-lg transition-all duration-300 group-hover:scale-110"
          style={{ background: `${color}20` }}
        >
          <Icon size={24} style={{ color: color, strokeWidth: 1.5 }} />
        </div>
        <div className="flex-1">
          <p className="text-[18px] md:text-[20px] font-black" style={{ color: color }}>
            {value}
          </p>
          <p className="text-[12px] font-semibold" style={{ color: "var(--brand-dark)" }}>{label}</p>
        </div>
      </div>
  </div>
  );
};

const Testimonials = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  const scrollBy = (dir: "left" | "right") => {
    scrollerRef.current?.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    const timer = setTimeout(updateArrows, 100);
    el.addEventListener("scroll", updateArrows);
    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", updateArrows);
    };
  }, []);

  return (
    <section className="w-full py-8 md:py-15 px-4 md:px-8 relative overflow-hidden" style={{ background: "rgb(240, 249, 255)" }}>
      <div
        className="absolute top-0 left-0 w-full h-0.5 z-20"
        style={{ background: "linear-gradient(90deg, var(--brand-navy), var(--brand-teal), var(--brand-yellow))" }}
      />

      {/* Subtle overlay — same bg, just a slight tint for depth */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(240, 249, 255, 0.6)" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          {/* Main Title with Animation */}
          <h2
            className="text-3xl sm:text-3xl md:text-5xl font-black mb-4 tracking-tight animate-fade-in drop-shadow-sm"
            style={{ color: "var(--brand-navy)" }}
          >
            What Our{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND_COLORS.BISLERI_GREEN}, ${BRAND_COLORS.DARK_BLUE})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Customers
            </span>{" "}
            Say
          </h2>

          {/* Subtitle */}
          <p className="text-sm md:text-sm mb-0 font-medium" style={{ color: "var(--brand-dark)" }}>
            Join over{" "}
            <span className="font-black" style={{ color: BRAND_COLORS.BISLERI_GREEN }}>
              1,00,000+ satisfied customers
            </span>{" "}
            across India
          </p>
          <p className="text-xs max-w-md mx-auto mt-0" style={{ color: BRAND_COLORS.GREY }}>
            Real stories from real people who trusted us with their financial goals
          </p>
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-1 md:mb-2 px-4">
          {TRUST_METRICS.map((metric, idx) => (
            <TrustMetric key={idx} {...metric} index={idx} />
          ))}
        </div>

        {/* Carousel Section */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scrollBy("left")}
            disabled={!canLeft}
            aria-label="Scroll left"
            className="hidden lg:flex absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full items-center justify-center transition-all duration-300 shadow-xl hover:shadow-2xl group"
            style={{
              background: canLeft ? BRAND_COLORS.DARK_BLUE : "rgba(255,255,255,0.15)",
              color: canLeft ? BRAND_COLORS.WHITE : "rgba(255,255,255,0.3)",
              border: canLeft
                ? `2px solid ${BRAND_COLORS.BISLERI_GREEN}`
                : "2px solid transparent",
              cursor: canLeft ? "pointer" : "not-allowed",
              transform: canLeft ? "scale(1)" : "scale(0.8)",
            }}
            onMouseEnter={(e) => {
              if (canLeft) {
                e.currentTarget.style.background = BRAND_COLORS.BISLERI_GREEN;
                e.currentTarget.style.transform = "scale(1.15)";
              }
            }}
            onMouseLeave={(e) => {
              if (canLeft) {
                e.currentTarget.style.background = BRAND_COLORS.DARK_BLUE;
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollerRef}
            className="flex gap-6 overflow-x-auto pb-2 pt-5 ml-4 snap-x snap-mandatory scroll-smooth scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.id} t={t} index={i} />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scrollBy("right")}
            disabled={!canRight}
            aria-label="Scroll right"
            className="hidden lg:flex absolute -right-8 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full items-center justify-center transition-all duration-300 shadow-xl hover:shadow-2xl group"
            style={{
              background: canRight ? BRAND_COLORS.DARK_BLUE : "rgba(255,255,255,0.15)",
              color: canRight ? BRAND_COLORS.WHITE : "rgba(255,255,255,0.3)",
              border: canRight
                ? `2px solid ${BRAND_COLORS.BISLERI_GREEN}`
                : "2px solid transparent",
              cursor: canRight ? "pointer" : "not-allowed",
              transform: canRight ? "scale(1)" : "scale(0.8)",
            }}
            onMouseEnter={(e) => {
              if (canRight) {
                e.currentTarget.style.background = BRAND_COLORS.BISLERI_GREEN;
                e.currentTarget.style.transform = "scale(1.15)";
              }
            }}
            onMouseLeave={(e) => {
              if (canRight) {
                e.currentTarget.style.background = BRAND_COLORS.DARK_BLUE;
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* Mobile carousel indicators */}
        <div className="flex lg:hidden justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              className="h-2 rounded-full transition-all duration-300 hover:scale-125"
              style={{
                width: activeIndex === i ? "16px" : "8px",
                background:
                  activeIndex === i
                    ? BRAND_COLORS.BISLERI_GREEN
                    : "rgba(255,255,255,0.4)",
              }}
              onClick={() => {
                scrollerRef.current?.scrollTo({
                  left: i * 380,
                  behavior: "smooth",
                });
                setActiveIndex(i);
              }}
            />
          ))}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(40px); }
          /* transform: none (not translateY(0)) — releases the pinned stacking
             context once the entrance finishes, so hover z-ordering works */
          to { opacity: 1; transform: none; }
        }
        @keyframes shimmerBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;