/**
 * Shared layout used by all Required Document pages.
 * Each loan page just passes its own sections + loanName + applySlug.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationModal from "../../components/modals/ApplicationModal";
import useSEO from "../../hooks/useSEO";
import defaultBannerBg from "../../assets/bg.jpg";
import type { DocSection } from "./types";
export type { DocSection };
import processBg from "../../assets/personal-loan/step-image.png"

interface Props {
  loanName: string;
  breadcrumb: string;
  bannerBg?: string;  // each doc page passes its own image
  sections: DocSection[];
  applySlug: string;
}

const steps = [
  {
    num: "01",
    title: "Fill Application Form",
    desc: "Fill out our quick online form with your basic details and loan requirement.",
    icon: "📝",
    color: "#06b6d4",
  },
  {
    num: "02",
    title: "Document Collection",
    desc: "Upload or submit the required documents listed below for your loan type.",
    icon: "📁",
    color: "#3b82f6",
  },
  {
    num: "03",
    title: "Verification",
    desc: "Our team verifies your application and documents within 24 hours.",
    icon: "🔍",
    color: "#8b5cf6",
  },
  {
    num: "04",
    title: "Approval",
    desc: "Get instant confirmation once your application clears verification.",
    icon: "✅",
    color: "#10b981",
  },
  {
    num: "05",
    title: "Loan Disbursement",
    desc: "Approved amount is credited directly to your bank account.",
    icon: "🏦",
    color: "#f59e0b",
  },
];

const DocPageLayout = ({ loanName, breadcrumb, bannerBg, sections, applySlug }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const bg = bannerBg ?? defaultBannerBg;

  useSEO({
    title: `Required Documents for ${loanName}`,
    description: `Complete document checklist for a ${loanName.toLowerCase()} application with Indexia Finance — KYC, address proof, income documents and more.`,
    path: applySlug ? `/requireddocument/${applySlug}` : "/requireddocument",
  });

  return (
    <>
      {/* ── BANNER ─────────────────────────────────────────────────── */}
      <section
        className="relative w-full min-h-75 md:min-h-90 flex items-center overflow-hidden mt-10"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(14,30,60,0.92) 0%, rgba(27,108,168,0.80) 55%, rgba(30,144,255,0.55) 100%)",
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

          {/* Split */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* LEFT */}
            <div className="flex-1 max-w-xl">
              <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                Required Documents For{" "}
                <span style={{ color: "#f2f231" }}>{loanName}</span>
              </h1>
              <p className="text-lg md:text-xl font-semibold italic" style={{ color: "#f2f231" }}>
                Now, Right Bank will come at your doorstep
              </p>
            </div>

            {/* RIGHT — Apply button only */}
            <div className="flex flex-col items-start lg:items-end gap-4 shrink-0">
              {/* Animated spinning border button */}
              <div className="apply-btn-wrap">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="apply-btn-inner"
                >
                  Apply Now
                </button>
              </div>

              <style>{`
                .apply-btn-wrap {
                  position: relative;
                  padding: 2px;
                  border-radius: 12px;
                  overflow: hidden;
                  display: inline-block;
                }
                .apply-btn-wrap::before {
                  content: "";
                  position: absolute;
                  inset: -80%;
                  background: conic-gradient(
                    from 0deg,
                    transparent 0deg,
                    transparent 280deg,
                    #22d3ee 300deg,
                    #2563eb 330deg,
                    #10b981 355deg,
                    transparent 360deg
                  );
                  animation: applyBtnSpin 2.5s linear infinite;
                }
                @keyframes applyBtnSpin {
                  to { transform: rotate(360deg); }
                }
                .apply-btn-inner {
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
                  background: linear-gradient(135deg, #26ae90 0%,  #066a9c 100%);
                  border: none;
                  cursor: pointer;
                  transition: all 0.3s ease;
                  box-shadow: 0 4px 18px rgba(46,139,87,0.4);
                  white-space: nowrap;
                }
                .apply-btn-inner:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 8px 28px rgba(27,108,168,0.5);
                  background: linear-gradient(135deg, #066a9c 0%, #26ae90 100%);
                }
                .apply-btn-inner:active {
                  transform: scale(0.96);
                }
              `}</style>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT ────────────────────────────────────────────────── */}
      <div className="bg-white">

        {/* Document list */}
        <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-10">

          {/* Page heading */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: "linear-gradient(135deg,#27ae90,#066a9c)", boxShadow: "0 0 7px rgba(39,174,144,0.65)" }}
              />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#066a9c]">
                Document Checklist
              </span>
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: "linear-gradient(135deg,#066a9c,#27ae90)", boxShadow: "0 0 7px rgba(6,106,156,0.65)" }}
              />
            </div>
            <div className="inline-block">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Required Documents For{" "}
                <span style={{ color: "#27ae90" }}>{loanName}</span>
              </h2>
              <div
                className="mt-1.5 h-0.75 w-full rounded-full"
                style={{ background: "linear-gradient(90deg,#27ae90 0%,#066a9c 55%,transparent 100%)" }}
              />
            </div>
          </div>

          <div className="space-y-6">
            {sections.map((section, sIdx) => (
              <div
                key={section.id}
                className="rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid rgba(6,106,156,0.12)",
                  boxShadow: "0 2px 12px rgba(6,106,156,0.06)",
                }}
              >
                {/* ── Section heading bar ── */}
                <div
                  className="flex items-center gap-3 px-5 py-3"
                  style={{
                    background: "linear-gradient(90deg,rgba(6,106,156,0.07) 0%,rgba(39,174,144,0.05) 100%)",
                    borderBottom: "1px solid rgba(6,106,156,0.10)",
                  }}
                >
                  {/* step number */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
                    style={{ background: "linear-gradient(135deg,#27ae90,#066a9c)", boxShadow: "0 0 8px rgba(39,174,144,0.4)" }}
                  >
                    {sIdx + 1}
                  </div>

                  <div className="inline-block">
                    <h3
                      className="text-[11px] font-extrabold uppercase tracking-[0.18em]"
                      style={{ color: "#066a9c" }}
                    >
                      {section.title}
                    </h3>
                    <div
                      className="mt-0.5 h-0.5 w-full rounded-full"
                      style={{ background: "linear-gradient(90deg,#27ae90 0%,#066a9c 60%,transparent 100%)" }}
                    />
                  </div>

                  {/* doc count badge */}
                  <span
                    className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(39,174,144,0.12)", color: "#27ae90", border: "1px solid rgba(39,174,144,0.25)" }}
                  >
                    {section.docs.length} doc{section.docs.length > 1 ? "s" : ""}
                  </span>
                </div>

                {/* ── Doc items ── */}
                <ul className="divide-y divide-gray-50">
                  {section.docs.map((doc, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 px-5 py-3 transition-colors duration-150 hover:bg-[#f0faf7] group"
                    >
                      {/* tick icon */}
                      <div
                        className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
                        style={{
                          background: "linear-gradient(135deg,#27ae90,#066a9c)",
                          boxShadow: "0 2px 6px rgba(39,174,144,0.30)",
                        }}
                      >
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-gray-800 text-sm group-hover:text-[#066a9c] transition-colors duration-150">
                          {doc.name}
                        </span>
                        {doc.note && (
                          <span className="block text-xs text-gray-400 mt-0.5 leading-relaxed">
                            {doc.note}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
       <div
            className="w-full border-t border-gray-100 py-8 pb-10"
            style={{
              backgroundImage: `
                linear-gradient(
                  rgba(15, 23, 42, 0.85),
                  rgba(15, 23, 42, 0.85)
                ),
                url(${processBg})
              `,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            {/* How it works heading */}
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: "linear-gradient(135deg,#27ae90,#22d3ee)", boxShadow: "0 0 7px rgba(34,211,238,0.7)" }}
                />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em]" style={{ color: "#22d3ee" }}>
                  How It Works
                </span>
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: "linear-gradient(135deg,#22d3ee,#27ae90)", boxShadow: "0 0 7px rgba(34,211,238,0.7)" }}
                />
              </div>
              <div className="inline-block text-center">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  5 Simple Steps to Your Loan
                </h2>
                <div
                  className="mt-1.5 h-0.75 w-full rounded-full"
                  style={{ background: "linear-gradient(90deg,transparent 0%,#22d3ee 30%,#27ae90 70%,transparent 100%)" }}
                />
              </div>
            </div>

            {/* flex row on desktop — cards + arrow separators inline */}
            <div className="flex flex-col lg:flex-row items-stretch gap-0">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-center flex-1 min-w-0">

                  {/* ── STEP CARD ── */}
                  <div className="step-card flex-1 min-w-0">
                    {/* Step number pill */}
                    <div className="flex items-center justify-between w-full mb-4">
                      {/* Left - Step Number */}
                      <div
                        className="step-num-pill"
                        // style={{ background: step.color }}
                      >
                        {step.num}
                      </div>

                      {/* Right - Icon */}
                      <div
                        className="step-icon-wrap"
                        // style={{ background: `${step.color}22` }}
                      >
                        <span className="text-2xl">{step.icon}</span>
                      </div>
                    </div>

                    <h4 className="step-title">{step.title}</h4>
                    <p className="step-desc">{step.desc}</p>

                    {/* Bottom accent bar — always visible, no hover */}
                    <div className="step-accent-bar" style={{ background: step.color }} />
                  </div>

                  {/* ── ARROW BETWEEN CARDS ── */}
                  {idx < steps.length - 1 && (
                    <div className="step-arrow">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M9 5l7 7-7 7"
                          stroke="rgba(255,255,255,0.45)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>

          <style>{`
            .step-card {
              background: rgba(255,255,255,0.05);
              backdrop-filter: blur(8px);
              border: 1px solid rgba(255,255,255,0.10);
              border-radius: 16px;
              padding: 15px 14px 20px;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              gap: 0px;
              position: relative;
            }
            /* Arrow separator */
            .step-arrow {
              flex-shrink: 0;
              display: none;
              align-items: center;
              justify-content: center;
              width: 36px;
              padding: 0 4px;
            }
            @media (min-width: 1024px) {
              .step-arrow {
                display: flex;
              }
            }
            .step-num-pill {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 22px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 800;
              color: #fff;
              letter-spacing: 0.5px;
            }
            .step-icon-wrap {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 35px;
              height: 35px;
              border-radius: 12px;
            }
            .step-title {
              font-size: 13px;
              font-weight: 700;
              color: #ffffff;
              line-height: 1.35;
            }
            .step-desc {
              font-size: 12px;
              color: rgba(255,255,255,0.55);
              line-height: 1.55;
              flex: 1;
            }
            /* Bottom colored accent bar — always visible */
            .step-accent-bar {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 3px;
              border-radius: 0 0 16px 16px;
            }
          `}</style>
        </div>

      </div>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={loanName}
      />
    </>
  );
};

export default DocPageLayout;
