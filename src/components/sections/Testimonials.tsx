import { ArrowUpRight } from "lucide-react";
import { GOOGLE_BUSINESS, GOOGLE_REVIEWS } from "../../constants/googleReviews";
import TestimonialCard from "./TestimonialCard";
import { GoogleStars } from "./googleReviews";

const Testimonials = () => (
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

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {GOOGLE_REVIEWS.map((review) => (
          <TestimonialCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
