/** A single Google review card. */
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { GOOGLE_BUSINESS } from "./testimonialsData";
import type { GoogleReview } from "./testimonialsData";
import { GoogleG, GoogleStars } from "./googleReviews";

const TestimonialCard = ({ review, index = 0 }: { review: GoogleReview; index?: number }) => (
  <article
    className="group flex w-76 shrink-0 snap-start flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_40px_-24px_rgba(6,106,156,0.45)] sm:w-84"
    style={{ animation: `reviewIn 0.5s ease-out ${index * 0.08}s both` }}
  >
    <header className="flex items-center gap-3">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white shadow-sm"
        style={{
          background: "linear-gradient(135deg, #4285F4, #26ae90)",
        }}
        aria-hidden="true"
      >
        {review.initials}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-bold text-slate-900">{review.name}</p>
        <p className="text-[11px] text-slate-500">{review.date}</p>
      </div>
      <span className="ml-auto shrink-0" title="Posted on Google">
        <GoogleG size={16} />
      </span>
    </header>

    <div className="mt-4">
      <GoogleStars value={review.rating} />
    </div>

    <blockquote className="mt-3 flex-1 text-[14px] leading-relaxed text-slate-700">
      “{review.quote}”
    </blockquote>

    <footer className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
        <BadgeCheck size={13} strokeWidth={2.2} /> Verified
      </span>
      <a
        href={GOOGLE_BUSINESS.reviewsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded text-[11px] font-semibold text-[#066a9c] transition-colors hover:text-[#0a4b6d] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#066a9c]"
      >
        View on Google <ArrowUpRight size={13} strokeWidth={2.2} />
      </a>
    </footer>
  </article>
);

export default TestimonialCard;
