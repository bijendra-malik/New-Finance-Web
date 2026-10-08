/** Single customer testimonial card with its star row. */
import { useState } from "react";
import { Heart, IndianRupee, MapPin, Quote, ShieldCheck, Star } from "lucide-react";
import { BRAND_COLORS } from "./testimonialsData";
import type { Testimonial } from "./testimonialsData";

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

export default TestimonialCard;
