/**
 * Shared layout used by ALL "Show Details" loan pages.
 * Each loan page just passes its own sections + meta props.
 *
 * To update the banner, section heading style, or content layout —
 * change it here once and every loan detail page reflects it.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationModal from "../../components/modals/ApplicationModal";
import useSEO from "../../hooks/useSEO";

// ─────────────────────────────────────────────────────────────────────────────
export interface DetailSection {
  id: string;
  heading: string;
  content: React.ReactNode;
}

export interface ShowDetailLayoutProps {
  /** Loan product name shown in the banner and modal */
  loanName: string;
  /** Breadcrumb label e.g. "Personal Loan" */
  breadcrumb: string;
  /** Banner headline — can be longer than loanName */
  bannerTitle: string;
  /** Banner sub-tagline */
  bannerTagline?: string;
  /** Banner background image */
  bannerBg: string;
  /** Path to the required-documents page for this loan */
  docsHref?: string;
  /** Apply form slug, used for the apply-now redirect */
  applySlug: string;
  /** All content sections */
  sections: DetailSection[];
  /** How many sections to show before "Read More" (default 3) */
  previewCount?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
const ACCENT = "var(--brand-navy)";

// Shared section-heading component — gradient underline matching text width
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-stretch gap-3 mb-3">
    {/* left accent bar — full height of heading */}
    <div
      className="w-0.75 rounded-full shrink-0 self-stretch"
      style={{ background: "linear-gradient(180deg,#27ae90,var(--brand-navy))", minHeight: "1.25rem" }}
    />
    <div className="inline-block">
      <h2 className="text-base md:text-lg font-bold text-gray-900 leading-snug">
        {children}
      </h2>
      {/* gradient underline — only as wide as heading text */}
      <div
        className="mt-0.5 h-0.5 w-full rounded-full"
        style={{ background: "linear-gradient(90deg,#27ae90 0%,var(--brand-navy) 60%,transparent 100%)" }}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
const ShowDetailLayout = ({
  loanName,
  breadcrumb,
  bannerTitle,
  bannerTagline = "Now, Right Bank will come to your doorstep",
  bannerBg,
  docsHref,
  /** Form slug; doubles as the canonical-url slug for SEO. */
  applySlug,
  sections,
  previewCount = 3,
}: ShowDetailLayoutProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useSEO({
    title: `${loanName} — Rates, Eligibility & Documents`,
    description: `Apply for a ${loanName.toLowerCase()} with Indexia Finance. Check eligibility, interest rates, required documents and apply online in minutes.`,
    path: `/showdetails/${applySlug}`,
  });

  const visible = expanded ? sections : sections.slice(0, previewCount);

  return (
    <>
      {/* ── BANNER ────────────────────────────────────────────────────── */}
      <section
        className="relative w-full min-h-80 md:min-h-95 flex items-center overflow-hidden mt-10"
        style={{
          backgroundImage: `url(${bannerBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(14,30,60,0.93) 0%, rgba(27,108,168,0.80) 55%, rgba(30,144,255,0.50) 100%)",
          }}
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-7">
            <button
              onClick={() => navigate("/")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>›</span>
            <span className="text-white/85 font-medium">{breadcrumb}</span>
          </nav>

          {/* Split layout */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* LEFT — title + tagline + docs button */}
            <div className="flex-1 max-w-xl">
              {/* Title */}
              <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-2">
                {bannerTitle}
              </h1>
              {/* Gradient underline — two-bar accent */}
              <div className="flex items-center gap-1.5 mb-3">
                <div className="h-1 w-10 rounded-full" style={{ background: "#27ae90" }} />
                <div className="h-1 w-6 rounded-full" style={{ background: "var(--brand-yellow)" }} />
                <div className="h-1 w-3 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
              </div>

              <p className="text-base md:text-lg font-semibold italic mb-8" style={{ color: "var(--brand-yellow)" }}>
                {bannerTagline}
              </p>

              {/* Required Docs link */}
              {docsHref && (
                <a
                  href={docsHref}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm text-white cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-teal) 100%)",
                    boxShadow: "0 4px 18px rgba(6,106,156,0.45)",
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Required Documents
                </a>
              )}
            </div>

            {/* RIGHT — Apply Now */}
            <div className="flex flex-col items-start lg:items-end gap-4 shrink-0 lg:pt-2">
              <div className="sdl-apply-wrap">
                <button onClick={() => setIsModalOpen(true)} className="sdl-apply-inner">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apply button spinning border styles */}
      <style>{`
        .sdl-apply-wrap {
          position: relative;
          padding: 2px;
          border-radius: 12px;
          overflow: hidden;
          display: inline-block;
        }
        .sdl-apply-wrap::before {
          content: "";
          position: absolute;
          inset: -80%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 280deg,
            #22d3ee 300deg,
            var(--brand-blue) 330deg,
            #10b981 355deg,
            transparent 360deg
          );
          animation: sdlBtnSpin 2.5s linear infinite;
        }
        @keyframes sdlBtnSpin { to { transform: rotate(360deg); } }
        .sdl-apply-inner {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 32px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          color: #ffffff;
          background: linear-gradient(135deg, var(--brand-teal) 0%, var(--brand-navy) 100%);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 18px rgba(46,139,87,0.4);
          white-space: nowrap;
        }
        .sdl-apply-inner:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(27,108,168,0.5);
        }
        .sdl-apply-inner:active { transform: scale(0.96); }
      `}</style>

      {/* ── CONTENT ───────────────────────────────────────────────────── */}
      <div className="bg-white">
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-8">

          <div className="space-y-4">
            {visible.map((section, idx) => (
              <div key={section.id}>
                {idx > 0 && <hr className="border-gray-100 mb-8" />}
                <SectionHeading>{section.heading}</SectionHeading>
                <div>{section.content}</div>
              </div>
            ))}
          </div>

          {/* Read More / Read Less */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-50"
              style={{ borderColor: "var(--brand-navy-55)", color: ACCENT }}
            >
              {expanded ? "Read Less" : "Read More"}
              <svg
                className="w-4 h-4 transition-transform duration-200"
                style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────── */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={loanName}
      />
    </>
  );
};

export default ShowDetailLayout;
