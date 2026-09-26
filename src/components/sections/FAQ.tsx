// How We Work + FAQ
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const C = {
  navy: "#066a9c",
  navyDark: "#286090",
  teal: "#26ae90",
  lime: "#f2f231",
  grey: "#7b7b7b",
};

const STEPS = [
  { id: 1, title: "Apply Online",   desc: "Share basic details & loan amount. Takes under 2 minutes — no paperwork, no hassle.",        color: C.navy,    icon: "📝", tag: "Step 1" },
  { id: 2, title: "Get Verified",   desc: "Instant eligibility & CIBIL check. Our smart system verifies documents in real-time.",       color: C.teal,    icon: "✅", tag: "Step 2" },
  { id: 3, title: "Receive Funds",  desc: "Amount disbursed to your account in 24–48 hours. Safe, secure & direct transfer.",          color: C.navyDark, icon: "💳", tag: "Step 3" },
];

const FAQS = [
  { id: 1, q: "How do I apply for a loan?",    a: "Fill the quick form, verify OTP, complete eligibility check & submit docs. Approval in 48 hours!", icon: "📝" },
  { id: 2, q: "Which documents are required?", a: "Aadhar/PAN, address proof, income proof, 6 months bank statements & employment letter.",             icon: "📄" },
  { id: 3, q: "What is CIBIL Score?",           a: "A 3-digit number (300–900) showing creditworthiness. Higher score = better rates & faster approval.", icon: "📊" },
  { id: 4, q: "What is the processing fee?",    a: "0.5% to 1.5% of loan amount — deducted from approved amount. Fully transparent, no hidden charges.", icon: "💰" },
];

// ── Main ──────────────────────────────────────────────────────────────────────
const FAQ = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [expandedFAQ,  setExpandedFAQ]  = useState<number | null>(1);
  const [hoverStep,    setHoverStep]    = useState<number | null>(null);
  const [hoverFAQ,     setHoverFAQ]     = useState<number | null>(null);

  return (
    <>
      {/* ══════════ SECTION 1 — How We Work + FAQ ══════════ */}
      <section className="relative w-full py-16 px-10 md:px-6 bg-white overflow-hidden">
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 w-full h-0.75"
          style={{ background: `linear-gradient(90deg, ${C.navy}, ${C.teal}, ${C.lime})` }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* ── Heading ── */}
          <div className="text-center mb-8">
            <h2
              className="text-3xl md:text-4xl font-extrabold mb-0 inline-block relative"
              style={{ color: C.navy }}
            >
              How We Work?
              <span
                className="absolute left-0 -bottom-1.5 w-full h-0.75 rounded-full block"
                style={{ background: `linear-gradient(90deg, ${C.navy}, ${C.teal}, ${C.lime})` }}
              />
            </h2>
            <p className="text-sm max-w-lg mx-auto mt-3" style={{ color: C.grey }}>
              Three simple steps to get your loan approved — fast, secure, and fully online.
            </p>
          </div>

          {/* ── Two Column Grid ── */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* LEFT — Process steps */}
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-1 h-6 rounded-full" style={{ background: C.teal }} />
                <h3 className="text-lg font-bold" style={{ color: C.navy }}>Our Process</h3>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-1"
                  style={{ background: `${C.lime}30`, color: C.navyDark }}
                >
                  3 Steps
                </span>
              </div>

              <div>
                {STEPS.map((step, i) => {
                  const active  = expandedStep === step.id;
                  const hovered = hoverStep === step.id;
                  return (
                    <div key={step.id} className="relative flex gap-0">
                      {/* Timeline column */}
                      <div className="flex flex-col items-center mr-4 pt-1">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 shadow-sm transition-all duration-300 z-10"
                          style={{
                            background: active ? `linear-gradient(135deg, ${step.color}, ${step.color}cc)` : "#f4f5f7",
                            color: active ? "#fff" : step.color,
                            border: `2px solid ${step.color}`,
                            transform: active ? "scale(1.12)" : "scale(1)",
                          }}
                        >
                          {i + 1}
                        </div>
                        {i < STEPS.length - 1 && (
                          <div
                            className="flex-1 w-0.5 my-1 rounded-full transition-colors duration-300"
                            style={{ background: active ? step.color : "#e5e7eb", minHeight: 32 }}
                          />
                        )}
                      </div>

                      {/* Card */}
                      <div
                        className="flex-1 mb-4 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer bg-white"
                        onMouseEnter={() => setHoverStep(step.id)}
                        onMouseLeave={() => setHoverStep(null)}
                        onClick={() => setExpandedStep(active ? null : step.id)}
                        style={{
                          border: `1.5px solid ${active || hovered ? step.color : "#e5e7eb"}`,
                          boxShadow: active
                            ? `0 8px 20px ${step.color}26`
                            : hovered
                            ? "0 4px 14px rgba(0,0,0,0.08)"
                            : "0 1px 3px rgba(0,0,0,0.04)",
                          transform: hovered && !active ? "translateY(-2px)" : "translateY(0)",
                        }}
                      >
                        <div className="flex items-center justify-between px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{step.icon}</span>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: step.color }}>
                                {step.tag}
                              </span>
                              <h4 className="font-bold text-[15px] leading-tight" style={{ color: "#1a1a1a" }}>
                                {step.title}
                              </h4>
                            </div>
                          </div>
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                            style={{ background: active || hovered ? step.color : "#f0f1f3" }}
                          >
                            {active
                              ? <Minus size={13} color="#fff" />
                              : <Plus  size={13} color={hovered ? "#fff" : C.grey} />}
                          </div>
                        </div>
                        <div
                          className="overflow-hidden transition-all duration-300"
                          style={{ maxHeight: active ? "120px" : "0px", opacity: active ? 1 : 0 }}
                        >
                          <div
                            className="px-4 pb-4 pt-0 text-sm leading-relaxed border-t"
                            style={{ borderColor: `${step.color}25`, color: C.grey }}
                          >
                            {step.desc}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress pills */}
              <div className="flex gap-2 mt-2 ml-14">
                {STEPS.map((step) => (
                  <div
                    key={step.id}
                    className="flex-1 h-1 rounded-full transition-all duration-300"
                    style={{ background: expandedStep === step.id ? step.color : "#e5e7eb" }}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT — FAQ */}
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-1 h-6 rounded-full" style={{ background: C.teal }} />
                <h3 className="text-lg font-bold" style={{ color: C.navy }}>Frequently Asked Questions</h3>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-1"
                  style={{ background: `${C.teal}22`, color: C.teal }}
                >
                  {FAQS.length} FAQs
                </span>
              </div>

              {FAQS.map((item, i) => {
                const active  = expandedFAQ === item.id;
                const hovered = hoverFAQ === item.id;
                return (
                  <div
                    key={item.id}
                    className="rounded-xl overflow-hidden transition-all duration-300 mb-3 cursor-pointer bg-white"
                    onMouseEnter={() => setHoverFAQ(item.id)}
                    onMouseLeave={() => setHoverFAQ(null)}
                    onClick={() => setExpandedFAQ(active ? null : item.id)}
                    style={{
                      border: `1.5px solid ${active || hovered ? C.teal : "#e5e7eb"}`,
                      borderLeft: `4px solid ${active || hovered ? C.teal : "#d1d5db"}`,
                      boxShadow: active
                        ? `0 8px 20px ${C.teal}26`
                        : hovered
                        ? "0 4px 14px rgba(0,0,0,0.08)"
                        : "0 1px 3px rgba(0,0,0,0.04)",
                      transform: hovered && !active ? "translateY(-2px)" : "translateY(0)",
                    }}
                  >
                    <div className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 transition-all duration-300"
                        style={{ background: active ? C.teal : "#f0f1f3", color: active ? "#fff" : C.teal }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-base">{item.icon}</span>
                        <h4 className="font-semibold text-[14px] leading-snug" style={{ color: "#1a1a1a" }}>
                          {item.q}
                        </h4>
                      </div>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                        style={{ background: active || hovered ? C.teal : "#f0f1f3" }}
                      >
                        {active
                          ? <Minus size={13} color="#fff" />
                          : <Plus  size={13} color={hovered ? "#fff" : C.grey} />}
                      </div>
                    </div>
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{ maxHeight: active ? "140px" : "0px", opacity: active ? 1 : 0 }}
                    >
                      <div
                        className="px-4 pb-4 pt-0 text-sm leading-relaxed border-t ml-10"
                        style={{ borderColor: `${C.teal}20`, color: C.grey }}
                      >
                        {item.a}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex gap-4 justify-center mt-8">
                <p className="text-xs self-end mb-2.5" style={{ color: C.grey }}
                
                >
                  Still have questions?
                </p>
                <button
                  className="px-6 py-2.5 rounded-full text-lg font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                  style={{ background: C.lime, color: C.navy }}
                >
                  View All FAQs →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ Bottom CTA Section ══════════ */}
     
      <div
        className="w-full relative overflow-hidden"
        style={{
          background: "linear-gradient(110deg, #066a9c 0%, #26ae90 100%)",
          borderTop: "3px solid rgba(168,216,205,0.28)",
        }}
      >
        {/* Centered column — text on top, button below */}
        <div
          className="relative z-10 flex flex-col items-center text-center gap-6 px-8 md:px-25 py-16 max-w-4xl mx-auto"
        >
          {/* Heading */}
          <h3
            className="text-3xl md:text-5xl font-extrabold leading-tight "
            style={{ color: C.lime }}
          >
            How much Loan can you get?
          </h3>

          {/* Description */}
          <p className="text-sm leading-relaxed max-w-lg text-white/85 mb-5">
            Join thousands of satisfied customers who've unlocked their financial dreams.
            Fast approvals, transparent pricing, and exceptional support.
          </p>

          {/* Checklist — centered with borders on each item */}
          <ul className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-left w-full max-w-3xl">
            {[
              ["Instant Eligibility Check",  "Know if you qualify in seconds"],
              ["Quick Approval in 48 Hours", "Get funds directly to your account"],
              ["Transparent Pricing",        "No hidden charges or surprises"],
            ].map(([title, desc]) => (
              <li
                key={title}
                className="flex items-start gap-2 flex-1 px-4 py-3 rounded-xl"
                style={{
                  border: "1.5px solid rgba(255,255,255,0.28)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <span className="font-bold text-base shrink-0 mt-0.5" style={{ color: C.lime }}>✓</span>
                <div>
                  <span className="font-bold text-sm text-white block">{title}</span>
                  <span className="text-xs text-white/65">{desc}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Button */}
          <button
            onClick={() => window.location.href = "/eligibility-calculator"}
            className="mt-8 px-8 py-4 rounded-lg font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 cursor-pointer whitespace-nowrap"
            style={{
              background: C.lime,
              color: C.navy,
              boxShadow: `0 4px 20px ${C.teal}60`,
            }}
          >
            Check Your Loan Eligibility
          </button>
        </div>
      </div>
    </>
  );
};

export default FAQ;
