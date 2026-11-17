import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BRAND_COLORS, GOOGLE_BUSINESS, TESTIMONIALS } from "./testimonialsData";
import TestimonialCard from "./TestimonialCard";
import { GoogleG, GoogleStars } from "./googleReviews";

const Testimonials = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateCarousel = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : 340;
    setActiveIndex(Math.round(el.scrollLeft / step));
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateCarousel();
    const timer = setTimeout(updateCarousel, 120);
    el.addEventListener("scroll", updateCarousel, { passive: true });
    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", updateCarousel);
    };
  }, [updateCarousel]);

  const scrollCards = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : 340;
    el.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
  };

  const arrowClass =
    "hidden lg:flex absolute top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:border-[#26ae90] hover:text-[#066a9c] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-700";

  return (
    <section className="relative w-full overflow-hidden bg-[#f0f9ff] px-4 py-12 md:px-8 md:py-16">
      <div
        className="absolute left-0 top-0 z-20 h-0.5 w-full"
        style={{ background: "linear-gradient(90deg, var(--brand-navy), var(--brand-teal), var(--brand-yellow))" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <h2
            className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl"
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
          <p className="mt-3 text-sm font-medium text-slate-600">
            Reviews shown here are taken from our Google Business Profile —{" "}
            <span className="font-bold" style={{ color: BRAND_COLORS.BISLERI_GREEN }}>
              nothing written for us
            </span>
            .
          </p>
        </div>

        {/* Google rating summary */}
        <div className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm sm:flex-row sm:gap-6">
          <div className="text-center">
            <p className="text-4xl font-black leading-none" style={{ color: "var(--brand-navy)" }}>
              {GOOGLE_BUSINESS.rating}
            </p>
            <div className="mt-1.5 flex justify-center">
              <GoogleStars value={GOOGLE_BUSINESS.rating} size={15} />
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">
              {GOOGLE_BUSINESS.reviewCount} Google reviews
            </p>
          </div>
          <div className="hidden h-14 w-px bg-slate-200 sm:block" />
          <div className="flex-1 text-center sm:text-left">
            <p className="text-[12px] leading-relaxed text-slate-600">
              Rated {GOOGLE_BUSINESS.rating} out of 5 by {GOOGLE_BUSINESS.reviewCount} customers on
              Google. As of {GOOGLE_BUSINESS.asOf}.
            </p>
            <a
              href={GOOGLE_BUSINESS.reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#066a9c] px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#0a4b6d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#066a9c]"
            >
              <GoogleG size={13} /> Read all reviews on Google
            </a>
          </div>
        </div>

        {/* Reviews carousel */}
        <div className="relative mt-8">
          <button
            onClick={() => scrollCards("left")}
            disabled={!canLeft}
            aria-label="Previous reviews"
            className={`${arrowClass} -left-4`}
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>

          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-3 pt-1 scroll-smooth [&::-webkit-scrollbar]:hidden scrollbar-none"
          >
            {TESTIMONIALS.map((review, index) => (
              <TestimonialCard key={review.id} review={review} index={index} />
            ))}
          </div>

          <button
            onClick={() => scrollCards("right")}
            disabled={!canRight}
            aria-label="More reviews"
            className={`${arrowClass} -right-4`}
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Mobile indicators */}
        <div className="mt-5 flex justify-center gap-2 lg:hidden">
          {TESTIMONIALS.map((review, index) => (
            <button
              key={review.id}
              aria-label={`Go to review ${index + 1}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: activeIndex === index ? "18px" : "8px",
                background: activeIndex === index ? BRAND_COLORS.BISLERI_GREEN : "rgba(6,106,156,0.25)",
              }}
              onClick={() =>
                scrollerRef.current?.scrollTo({ left: index * 328, behavior: "smooth" })
              }
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes reviewIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
