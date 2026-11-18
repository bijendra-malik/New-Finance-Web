import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GOOGLE_BUSINESS, GOOGLE_REVIEWS } from "../../constants/googleReviews";
import TestimonialCard from "./TestimonialCard";
import { GoogleG, GoogleStars } from "./googleReviews";

const CARD_GAP = 24;

const cardStep = (scroller: HTMLDivElement): number => {
  const card = scroller.firstElementChild as HTMLElement | null;
  return card ? card.offsetWidth + CARD_GAP : 340;
};

const Testimonials = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [scrollable, setScrollable] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateCarousel = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const overflow = el.scrollWidth - el.clientWidth > 4;
    setScrollable(overflow);
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    setActiveIndex(Math.round(el.scrollLeft / cardStep(el)));
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateCarousel();
    const timer = setTimeout(updateCarousel, 120);
    el.addEventListener("scroll", updateCarousel, { passive: true });
    window.addEventListener("resize", updateCarousel);
    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", updateCarousel);
      window.removeEventListener("resize", updateCarousel);
    };
  }, [updateCarousel]);

  const scrollCards = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = cardStep(el);
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
                background: "linear-gradient(135deg, var(--brand-teal), var(--brand-navy))",
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
            <span className="font-bold" style={{ color: "var(--brand-teal)" }}>
              nothing written for us
            </span>
            .
          </p>
        </div>

        {/* Google rating summary */}
        <div className="mx-auto mt-7 max-w-2xl overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05),0_24px_48px_-36px_rgba(6,106,156,0.55)] ring-1 ring-slate-200">
          <div
            aria-hidden
            className="h-1 w-full"
            style={{ background: "linear-gradient(90deg, #4285F4, #34A853, #FBBC05, #EA4335)" }}
          />
          <div className="flex flex-col items-center gap-5 px-6 py-6 text-center sm:flex-row sm:items-center sm:gap-7 sm:px-8 sm:py-7 sm:text-left">
            <div className="shrink-0">
              <p
                className="text-5xl font-black leading-none tracking-tight"
                style={{ color: "var(--brand-navy)" }}
              >
                {GOOGLE_BUSINESS.rating}
              </p>
              <div className="mt-2 flex justify-center sm:justify-start">
                <GoogleStars value={GOOGLE_BUSINESS.rating} size={18} />
              </div>
            </div>

            <div className="hidden h-16 w-px shrink-0 bg-slate-200 sm:block" />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-snug text-slate-800">
                Rated {GOOGLE_BUSINESS.rating} out of 5 by {GOOGLE_BUSINESS.reviewCount} customers on
                Google.
              </p>
            </div>

            <span
              className="flex shrink-0 items-center justify-center rounded-full bg-slate-50 p-2.5 ring-1 ring-slate-200"
              title="Google reviews"
            >
              <GoogleG size={22} />
            </span>
          </div>
        </div>

        {/* Reviews carousel */}
        <div className="relative mt-8">
          {scrollable && (
            <button
              onClick={() => scrollCards("left")}
              disabled={!canLeft}
              aria-label="Previous reviews"
              className={`${arrowClass} -left-4`}
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
          )}

          <div
            ref={scrollerRef}
            className={`flex snap-x snap-mandatory gap-6 overflow-x-auto pb-3 pt-1 [&::-webkit-scrollbar]:hidden scrollbar-none${scrollable ? "" : " justify-center"}`}
          >
            {GOOGLE_REVIEWS.map((review, index) => (
              <TestimonialCard key={review.id} review={review} index={index} />
            ))}
          </div>

          {scrollable && (
            <button
              onClick={() => scrollCards("right")}
              disabled={!canRight}
              aria-label="More reviews"
              className={`${arrowClass} -right-4`}
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Mobile indicators */}
        <div className="mt-5 flex justify-center gap-2 lg:hidden">
          {GOOGLE_REVIEWS.map((review, index) => (
            <button
              key={review.id}
              aria-label={`Go to review ${index + 1}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: activeIndex === index ? "18px" : "8px",
                background: activeIndex === index ? "var(--brand-teal)" : "rgba(6,106,156,0.25)",
              }}
              onClick={() => {
                const el = scrollerRef.current;
                if (!el) return;
                el.scrollTo({ left: index * cardStep(el), behavior: "smooth" });
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes reviewIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
