import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { GOOGLE_BUSINESS, GOOGLE_REVIEWS } from "../../constants/googleReviews";
import TestimonialCard from "./TestimonialCard";
import { GoogleStars } from "./googleReviews";

const Testimonials = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const lastIndex = GOOGLE_REVIEWS.length - 1;

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.min(Math.max(index, 0), GOOGLE_REVIEWS.length - 1);
    activeRef.current = clamped;
    setActive(clamped);
    const card = track.children[clamped] as HTMLElement | undefined;
    if (!card) return;
    const left =
      card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({ left, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      goTo((activeRef.current + 1) % GOOGLE_REVIEWS.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused, goTo]);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const trackLeft = track.getBoundingClientRect().left;
    let nearest = 0;
    let smallest = Number.POSITIVE_INFINITY;
    Array.from(track.children).forEach((child, index) => {
      const distance = Math.abs(
        (child as HTMLElement).getBoundingClientRect().left - trackLeft,
      );
      if (distance < smallest) {
        smallest = distance;
        nearest = index;
      }
    });
    if (nearest !== activeRef.current) {
      activeRef.current = nearest;
      setActive(nearest);
    }
  };

  return (
    <section className="section-shell relative w-full overflow-hidden bg-(--surface-tint) px-4 sm:px-6">
      <div
        className="absolute left-0 top-0 h-0.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--brand-navy), var(--brand-teal), var(--brand-yellow))",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-eyebrow mb-2">Customer reviews</p>
            <h2
              className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl"
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
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Real reviews from our Google Business Profile —{" "}
              <span className="font-semibold" style={{ color: "var(--brand-teal)" }}>
                nothing written for us
              </span>
              .
            </p>
          </div>

          <div className="flex items-center gap-4 self-start rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm md:self-auto">
            <div className="text-center">
              <p
                className="text-3xl font-black leading-none tracking-tight"
                style={{ color: "var(--brand-navy)" }}
              >
                {GOOGLE_BUSINESS.rating.toFixed(1)}
              </p>
              <div className="mt-1.5">
                <GoogleStars value={GOOGLE_BUSINESS.rating} size={12} />
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div>
              <p className="text-[12.5px] font-bold text-slate-800">
                {GOOGLE_BUSINESS.reviewCount} Google reviews
              </p>
              <a
                href={GOOGLE_BUSINESS.reviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-semibold text-(--brand-navy) transition-colors hover:underline"
              >
                Read all on Google <ArrowUpRight size={12} strokeWidth={2.4} />
              </a>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="mt-8"
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer reviews"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocusCapture={(event) => {
            if (event.target instanceof Element && event.target.matches(":focus-visible")) setPaused(true);
          }}
          onBlurCapture={() => setPaused(false)}
        >
          <div
            ref={trackRef}
            onScroll={handleScroll}
            tabIndex={0}
            aria-label="Review slides — scroll or use the arrow buttons"
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth focus:outline-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {GOOGLE_REVIEWS.map((review, index) => (
              <div
                key={review.id}
                aria-roledescription="slide"
                aria-label={`Review ${index + 1} of ${GOOGLE_REVIEWS.length}`}
                className="w-full shrink-0 snap-center px-0.5 py-1"
              >
                <div className="mx-auto max-w-3xl">
                  <TestimonialCard review={review} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => goTo(activeRef.current - 1)}
              disabled={active === 0}
              aria-label="Previous review"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-(--brand-navy) transition hover:border-(--brand-teal) hover:bg-(--brand-teal) hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronLeft size={18} strokeWidth={2.4} />
            </button>

            <div className="flex items-center gap-2">
              {GOOGLE_REVIEWS.map((review, index) => (
                <button
                  key={review.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to review ${index + 1}`}
                  aria-current={index === active}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === active
                      ? "w-6 bg-(--brand-navy)"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => goTo(activeRef.current + 1)}
              disabled={active === lastIndex}
              aria-label="Next review"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-(--brand-navy) transition hover:border-(--brand-teal) hover:bg-(--brand-teal) hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronRight size={18} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
