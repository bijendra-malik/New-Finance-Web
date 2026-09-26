import { useEffect, useRef, useState } from "react";
import {
  Shield,
  Star,
  TrendingUp,
  ShieldCheck,
  MapPin,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  Quote,
  Zap,
  Heart,
} from "lucide-react";

import userImg1 from "../../assets/Users/testimonial-1.jpg";
import userImg2 from "../../assets/Users/testimonial-2.jpg";
import userImg3 from "../../assets/Users/testimonial-3.jpg";
import userImg4 from "../../assets/Users/testimonial-4.jpg"
import userImg5 from "../../assets/Users/testimonial-5.jpg"
import userImg6 from "../../assets/Users/testimonial-6.jpg"

// Brand Color Constants — naya palette
const BRAND_COLORS = {
  BISLERI_GREEN: "#26ae90", // teal-green — primary accent (badges, verified tick, CTA highlights)
  LIME_GREEN: "#f2f231",    // yellow — ratings/stars highlight color
  DARK_BLUE: "#066a9c",     // deep blue — primary accent bar / arrows / headings
  GREY: "#7b7b7b",          // neutral grey — secondary text
  NAVY_DARK: "#286090",     // medium blue — main text / names / headings
  WHITE: "#FFFFFF",
  LIGHT_BG: "#F8FAFC",
  lime: "#f2f231",          // same yellow, used for top accent line
};

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  loanType: string;
  loanAmount: string;
  rating: number;
  quote: string;
  daysAgo: string;
  accent: string;
  initials: string;
  avatar?: string;   // optional user photo
  bgGradient: string;
  isVerified: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Small Business Owner",
    location: "Delhi",
    loanType: "Business Loan",
    loanAmount: "₹2,00,000",
    rating: 5,
    quote:
      "I needed ₹2 lakhs urgently for my shop inventory. Approved in just 2 hours without any collateral. Highly recommended!",
    daysAgo: "15 days ago",
    accent: BRAND_COLORS.DARK_BLUE,
    initials: "RK",
    avatar: userImg1,
    bgGradient: `linear-gradient(135deg, ${BRAND_COLORS.DARK_BLUE}15 0%, ${BRAND_COLORS.DARK_BLUE}05 100%)`,
    isVerified: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Software Engineer",
    location: "Bangalore",
    loanType: "Personal Loan",
    loanAmount: "₹5,00,000",
    rating: 5,
    quote:
      "Needed funds for my wedding expenses. The instant personal loan saved the day — entire process was digital and transparent.",
    daysAgo: "1 month ago",
    accent: BRAND_COLORS.BISLERI_GREEN,
    initials: "PS",
    avatar: userImg2,
    bgGradient: `linear-gradient(135deg, ${BRAND_COLORS.BISLERI_GREEN}15 0%, ${BRAND_COLORS.BISLERI_GREEN}05 100%)`,
    isVerified: true,
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "Marketing Manager",
    location: "Mumbai",
    loanType: "Emergency Loan",
    loanAmount: "₹1,50,000",
    rating: 5,
    quote:
      "Emergency medical expenses came up suddenly. The quick approval process was a lifesaver — best loan app in India!",
    daysAgo: "3 weeks ago",
    accent: BRAND_COLORS.NAVY_DARK,
    initials: "AP",
    avatar: userImg3,
    bgGradient: `linear-gradient(135deg, ${BRAND_COLORS.NAVY_DARK}15 0%, ${BRAND_COLORS.NAVY_DARK}05 100%)`,
    isVerified: true,
  },
  {
    id: 4,
    name: "Anjali Singh",
    role: "Graduate Student",
    location: "Chennai",
    loanType: "Education Loan",
    loanAmount: "₹8,00,000",
    rating: 5,
    quote:
      "Transparent charges and a genuinely friendly team. They helped me fund my dream of higher education abroad.",
    daysAgo: "2 months ago",
    accent: BRAND_COLORS.DARK_BLUE,
    initials: "AS",
     avatar: userImg4,
    bgGradient: `linear-gradient(135deg, ${BRAND_COLORS.DARK_BLUE}15 0%, ${BRAND_COLORS.DARK_BLUE}05 100%)`,
    isVerified: true,
  },
  {
    id: 5,
    name: "Arjun Verma",
    role: "Product Consultant",
    location: "Hyderabad",
    loanType: "Vehicle Loan",
    loanAmount: "₹6,50,000",
    rating: 4,
    quote:
      "Quickest approval I've ever seen — got my car within 2 weeks. Outstanding service from start to finish.",
    daysAgo: "5 days ago",
    accent: BRAND_COLORS.BISLERI_GREEN,
    initials: "AV",
     avatar: userImg5,
    bgGradient: `linear-gradient(135deg, ${BRAND_COLORS.BISLERI_GREEN}15 0%, ${BRAND_COLORS.BISLERI_GREEN}05 100%)`,
    isVerified: true,
  },
  {
    id: 6,
    name: "Divya Nair",
    role: "Home Buyer",
    location: "Pune",
    loanType: "Home Loan",
    loanAmount: "₹28,00,000",
    rating: 5,
    quote:
      "Excellent guidance throughout the process. They made buying our first home stress-free from day one.",
    daysAgo: "6 weeks ago",
    accent: BRAND_COLORS.GREY,
    initials: "DN",
     avatar: userImg6,
    bgGradient: `linear-gradient(135deg, ${BRAND_COLORS.GREY}15 0%, ${BRAND_COLORS.GREY}05 100%)`,
    isVerified: true,
  },
];

const TRUST_METRICS = [
  {
    icon: Shield,
    value: "100%",
    label: "Secure & Safe",
    color: BRAND_COLORS.DARK_BLUE,
  },
  {
    icon: Zap,
    value: "2 Min",
    label: "Approval",
    color: BRAND_COLORS.BISLERI_GREEN,
  },
  {
    icon: Star,
    value: "4.9★",
    label: "Rating",
    color: BRAND_COLORS.LIME_GREEN,
  },
  {
    icon: TrendingUp,
    value: "₹1000Cr+",
    label: "Disbursed",
    color: BRAND_COLORS.NAVY_DARK,
  },
];

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <div key={s} className="relative">
        <Star
          size={16}
          strokeWidth={0}
          style={{
            fill: s <= rating ? BRAND_COLORS. BISLERI_GREEN : "#E2E8F0",
          }}
        />
      </div>
    ))}
  </div>
);

const TestimonialCard = ({ t, index }: { t: Testimonial; index: number }) => {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <div
      className="shrink-0 w-92.5 sm:w-85 md:w-90 snap-start group"
      style={{
        animation: `slideUpFade 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${
          index * 0.12
        }s both`,
      }}
    >
      <div
        className="relative h-full rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? "#ffffff" : "rgba(255,255,255,0.96)",
          border: `2px solid ${hovered ? t.accent + "aa" : t.accent + "40"}`,
          /* inside-the-box hover: NO translate/scale on the card itself —
             the "lift" is simulated with a raised inner shadow (top-light /
             bottom-deep), so the card can never escape its box or overlap
             neighbours in the carousel row */
          boxShadow: hovered
            ? `0 -6px 18px -6px ${t.accent}35, inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 6px ${t.accent}14`
            : "0 2px 12px rgba(6,106,156,0.06)",
        }}
      >
        {/* Premium badge — INSIDE the card's top accent bar (no negative
            offset, so nothing paints outside the card box on hover) */}
        <div
          className="absolute top-1.5 right-4 px-3 py-0.5 rounded-full text-[9px] font-bold text-white tracking-wider z-30"
          style={{
            background: `linear-gradient(90deg, ${t.accent}, ${t.accent}CC)`,
            boxShadow: `0 4px 12px ${t.accent}40`,
            textTransform: "uppercase",
          }}
        >
          ⭐ {t.rating}.0
        </div>

        {/* Animated background glow */}
        {/* <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-all duration-500"
          style={{
            background: t.accent,
            animation: hovered ? "pulse 3s ease-in-out infinite" : "none",
          }}
        /> */}

        {/* Top accent bar with gradient */}
        <div
          className="h-1.5 w-full relative overflow-hidden"
          style={{
            background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)`,
          }}
        >
          <div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-300"
            style={{
              animation: hovered ? "shimmerBar 2s infinite" : "none",
            }}
          />
        </div>

        <div className="relative px-6 py-4 ">
          {/* Top row - Quote Icon & Like Button */}
          <div className="flex items-center justify-between mb-2">
            <Quote
              size={32}
              strokeWidth={1}
              style={{
                color: t.accent,
                opacity: 0.15,
              }}
            />
            <button
              onClick={() => setLiked(!liked)}
              className="transition-all duration-300 hover:scale-125"
              style={{
                color: liked ? BRAND_COLORS.BISLERI_GREEN : BRAND_COLORS.GREY,
              }}
            >
              <Heart
                size={20}
                strokeWidth={1.5}
                fill={liked ? BRAND_COLORS.BISLERI_GREEN : "none"}
              />
            </button>
          </div>

          {/* Quote Text */}
          <p
            className="text-[14px] md:text-[15px] leading-relaxed font-medium mb-2 min-h-22 group-hover:text-opacity-100 transition-all"
            style={{
              color: BRAND_COLORS.NAVY_DARK,
              fontStyle: "italic",
            }}
          >
            "{t.quote}"
          </p>

          {/* Divider with gradient */}
          <div
            className="h-px my-4 border"
            style={{
              borderColor: `${t.accent}30`,
            }}
          />

          {/* User info section */}
          <div className="flex items-start justify-between mb-4">
            {/* Avatar & Info */}
            <div className="flex items-center gap-3 flex-1">
              <div
                className="relative shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-[16px] shadow-lg ring-2 ring-offset-2 group-hover:scale-110 transition-transform duration-300 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${t.accent}, ${t.accent}CC)`,
                }}
              >
                {t.avatar ? (
                  <img
                    src={t.avatar}
                    alt={t.name}
                    width={56}
                    height={56}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  t.initials
                )}
                {/* Shine effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, transparent, white)`,
                  }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="text-[14px] font-bold truncate"
                  style={{ color: BRAND_COLORS.NAVY_DARK }}
                >
                  {t.name}
                </p>
                <p className="text-[12px] truncate" style={{ color: BRAND_COLORS.GREY }}>
                  {t.role}
                </p>
                <p
                  className="text-[11px] flex items-center gap-1 mt-1"
                  style={{ color: BRAND_COLORS.GREY }}
                >
                  <MapPin size={11} strokeWidth={2} /> {t.location}
                </p>
              </div>
            </div>

            {/* Verified Badge */}
            {t.isVerified && (
              <div
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg ml-2 animate-pulse"
                style={{
                  background: `${BRAND_COLORS.BISLERI_GREEN}20`,
                  border: `1px solid ${BRAND_COLORS.BISLERI_GREEN}60`,
                }}
              >
                <ShieldCheck
                  size={13}
                  style={{ color: BRAND_COLORS.BISLERI_GREEN }}
                  strokeWidth={2.5}
                />
                <span
                  className="text-[10px] font-bold"
                  style={{ color: BRAND_COLORS.BISLERI_GREEN }}
                >
                  ✓
                </span>
              </div>
            )}
          </div>

          {/* Star Rating & Loan Type */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <StarRow rating={t.rating} />

            <span
              className="text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full text-white whitespace-nowrap transition-all duration-300 group-hover:shadow-lg"
              style={{
                background: t.accent,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                boxShadow: `0 4px 12px ${t.accent}40`,
              }}
            >
              {t.loanType}
            </span>
          </div>

          {/* Bottom - Loan Amount & Timeline */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            {/* Loan Amount */}
            <div
              className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-2 rounded-lg transition-all duration-300 group-hover:scale-105"
              style={{
                background: `${t.accent}15`,
                color: t.accent,
              }}
            >
              <IndianRupee size={12} strokeWidth={2} />
              <span className="truncate">{t.loanAmount}</span>
            </div>

            {/* Timeline */}
            <span
              className="text-[11px] font-medium px-3 py-2 rounded-lg transition-all duration-300"
              style={{
                background: "#F1F5F9",
                color: BRAND_COLORS.GREY,
              }}
            >
              📅 {t.daysAgo}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

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
          <p className="text-[12px] font-semibold" style={{ color: "#286090" }}>{label}</p>
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
        style={{ background: "linear-gradient(90deg, #066a9c, #26ae90, #f2f231)" }}
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
            style={{ color: "#066a9c" }}
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
          <p className="text-sm md:text-sm mb-0 font-medium" style={{ color: "#286090" }}>
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