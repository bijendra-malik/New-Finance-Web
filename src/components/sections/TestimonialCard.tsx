/** A single Google review card. */
import { type GoogleReview } from "../../constants/googleReviews";
import { GoogleG, GoogleStars } from "./googleReviews";

const TestimonialCard = ({ review }: { review: GoogleReview }) => (
  <figure className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-32px_rgba(6,106,156,0.5)] sm:p-8">
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -top-8 -right-1 select-none font-serif text-[130px] leading-none text-slate-100"
    >
      &ldquo;
    </span>

    <div className="relative">
      <GoogleStars value={review.rating} size={16} />
    </div>

    <blockquote className="relative mt-4 flex-1 whitespace-pre-line text-[14.5px] leading-relaxed text-slate-700">
      {review.quote}
    </blockquote>

    <figcaption className="relative mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
      <img
        src={review.avatar}
        alt={`${review.name} profile photo`}
        width={44}
        height={44}
        loading="lazy"
        className="h-11 w-11 shrink-0 rounded-full object-cover shadow-sm ring-2 ring-white"
      />
      <div className="min-w-0">
        <p className="truncate text-[13.5px] font-bold text-slate-900">{review.name}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-slate-500">
          <GoogleG size={11} /> Google review
        </p>
      </div>
      <a
        href={review.reviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-auto shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-(--brand-navy) transition-colors hover:border-slate-300 hover:bg-slate-50"
      >
        See review
      </a>
    </figcaption>
  </figure>
);

export default TestimonialCard;
