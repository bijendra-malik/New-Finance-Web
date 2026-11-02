// How We Work + FAQ
import { useState } from "react";
import { Plus, Minus, FileText, BadgeCheck, CreditCard, Files, BarChart3, Wallet, FilePenLine } from "lucide-react";
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { THEME } from "../../constants/theme";

// Legacy aliases kept so call sites stay readable
const C = {
  ...THEME,
  navyDark: THEME.dark,
  lime: THEME.yellow,
  grey: THEME.gray,
};

const NAVY_HEX = "#066a9c";
const TEAL_HEX = "#26ae90";
const DARK_HEX = "#286090";

// Lucide equivalents of the previous emoji markers (visual only — copy unchanged)
const STEP_ICONS: Record<string, LucideIcon> = { "📝": FilePenLine, "✅": BadgeCheck, "💳": CreditCard };
const FAQ_ICONS:  Record<string, LucideIcon> = { "📝": FileText, "📄": Files, "📊": BarChart3, "💰": Wallet };

const STEPS = [
  { id: 1, title: "Apply Online",   desc: "Share basic details & loan amount. Takes under 2 minutes — no paperwork, no hassle.",        color: NAVY_HEX,  icon: "📝", tag: "Step 1" },
  { id: 2, title: "Get Verified",   desc: "Instant eligibility & CIBIL check. Our smart system verifies documents in real-time.",       color: TEAL_HEX,  icon: "✅", tag: "Step 2" },
  { id: 3, title: "Receive Funds",  desc: "Amount disbursed to your account in 24–48 hours. Safe, secure & direct transfer.",          color: DARK_HEX,  icon: "💳", tag: "Step 3" },
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
      {/* Bottom CTA Section — How much Loan can you get? */}
      <div
        className="w-full relative overflow-hidden"
        style={{
          background: "linear-gradient(115deg, var(--brand-navy) 0%, var(--brand-teal) 115%)",
        }}
      >
        {/* Soft light sweep for depth */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(55% 120% at 88% -20%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 62%), radial-gradient(45% 90% at 5% 115%, rgba(240,180,10,0.10) 0%, rgba(240,180,10,0) 55%)",
          }}
        />
        <div
          className="relative z-10 flex flex-col items-center text-center px-6 py-14 md:py-16 max-w-4xl mx-auto"
        >
          {/* Heading */}
          <h3
            className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight"
            style={{ color: C.lime }}
          >
            How much Loan can you get?
          </h3>

          {/* Description */}
          <p className="text-sm md:text-[15px] leading-relaxed text-white/85 mt-4 max-w-xl">
            Join thousands of satisfied customers who've unlocked their financial dreams.
            Fast approvals, transparent pricing, and exceptional support.
          </p>

          {/* Checklist — glass chips with check discs */}
          <ul className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 text-left w-full max-w-3xl mt-8">
            {[
              ["Instant Eligibility Check",  "Know if you qualify in seconds"],
              ["Quick Approval in 48 Hours", "Get funds directly to your account"],
              ["Transparent Pricing",        "No hidden charges or surprises"],
            ].map(([title, desc]) => (
              <li
                key={title}
                className="flex items-center gap-2.5 flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/17 transition-colors duration-300"
              >
                <span
                  className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center"
                  style={{ background: C.lime }}
                >
                  <Check size={14} strokeWidth={3.5} style={{ color: C.navy }} />
                </span>
                <div>
                  <span className="font-bold text-sm text-white block">{title}</span>
                  <span className="text-xs text-white/70">{desc}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Button */}
          <button
            onClick={() => window.location.href = "/eligibility-calculator"}
            className="mt-9 px-9 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer whitespace-nowrap"
            style={{
              background: C.lime,
              color: C.navy,
              boxShadow: "0 10px 26px rgba(240,180,10,0.32)",
            }}
          >
            Check Your Loan Eligibility
          </button>
        </div>
      </div>

      {/* SECTION 1 — How We Work + FAQ */}
      <section className="relative w-full bg-slate-50 border-y border-slate-200/60 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-16">

          {/* Heading */}
          <div className="text-center mb-6 md:mb-10">
            <h2
              id="how-we-work-title"
              className="text-3xl md:text-4xl font-extrabold tracking-tight"
              style={{ color: C.navy }}
            >
              How We Work?
            </h2>
            <p className="text-sm mx-auto mt-3 max-w-xl" style={{ color: C.grey }}>
              Three simple steps to get your loan approved — fast, secure, and fully online.
            </p>
          </div>

          {/* Two Column Grid */}
          <div className="grid lg:grid-cols-2 gap-5 lg:gap-8 items-start">

            {/* LEFT — Process steps */}
            <div
              className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-2 sm:p-5"
              onMouseLeave={() => setHoverStep(null)}
            >
              <div className="flex items-center gap-2.5 px-3 pt-1 pb-3">
                <div className="w-1 h-6 rounded-full" style={{ background: C.teal }} />
                <h3 className="text-lg font-bold" style={{ color: C.navy }}>Our Process</h3>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-1"
                  style={{ background: "rgba(240,180,10,0.12)", color: C.navyDark }}
                >
                  3 Steps
                </span>
              </div>

              <div className="px-1 pb-2">
                {STEPS.map((step, i) => {
                  const active  = expandedStep === step.id;
                  const hovered = hoverStep === step.id;
                  const StepIcon = STEP_ICONS[step.icon];
                  return (
                    <div key={step.id} className="flex gap-3">
                      {/* Timeline column */}
                      <div className="flex flex-col items-center pt-3 pb-1">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 transition-all duration-300"
                          style={{
                            background: active ? step.color : "rgba(255,255,255,0.9)",
                            color: active ? "#fff" : step.color,
                            border: `2px solid ${step.color}`,
                            boxShadow: active ? `0 6px 14px ${step.color}33` : "none",
                          }}
                        >
                          {i + 1}
                        </div>
                        {i < STEPS.length - 1 && (
                          <div
                            className="flex-1 w-0.5 my-1 rounded-full"
                            style={{ background: active ? step.color : "#e2e8f0", minHeight: 28 }}
                          />
                        )}
                      </div>

                      {/* Content column */}
                      <div className="flex-1 min-w-0 border-b border-slate-100">
                        <button
                          type="button"
                          aria-expanded={active}
                          onClick={() => setExpandedStep(active ? null : step.id)}
                          onMouseEnter={() => setHoverStep(step.id)}
                          className="w-full flex items-center gap-3 py-3 text-left cursor-pointer"
                        >
                          <span
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300"
                            style={{
                              background: `${step.color}14`,
                              color: step.color,
                            }}
                          >
                            <StepIcon size={18} strokeWidth={2} />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: step.color }}>
                              {step.tag}
                            </span>
                            <span className={`block font-bold text-[15px] leading-tight transition-colors duration-200${hovered && !active ? " underline decoration-2 underline-offset-4 decoration-(--brand-teal)" : ""}`}>
                              {step.title}
                            </span>
                          </span>
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                            style={{ background: active || hovered ? step.color : "#f1f5f9" }}
                          >
                            {active
                              ? <Minus size={13} color="#fff" />
                              : <Plus size={13} style={{ color: hovered ? "#fff" : "#94a3b8" }} />}
                          </span>
                        </button>

                        <div
                          className="overflow-hidden transition-all duration-300"
                          style={{ maxHeight: active ? "200px" : "0px", opacity: active ? 1 : 0 }}
                        >
                          <p className="px-1 pb-4 pr-6 text-sm leading-relaxed" style={{ color: C.grey }}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT — FAQ */}
            <div
              className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-2 sm:p-5"
              onMouseLeave={() => setHoverFAQ(null)}
            >
              <div className="flex items-center gap-2.5 px-3 pt-1 pb-3">
                <div className="w-1 h-6 rounded-full" style={{ background: C.teal }} />
                <h3 className="text-lg font-bold" style={{ color: C.navy }}>Frequently Asked Questions</h3>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-1"
                  style={{ background: "rgba(38,174,144,0.1)", color: C.teal }}
                >
                  {FAQS.length} FAQs
                </span>
              </div>

              <div className="px-1">
                {FAQS.map((item) => {
                  const active  = expandedFAQ === item.id;
                  const hovered = hoverFAQ === item.id;
                  const FaqIcon = FAQ_ICONS[item.icon];
                  return (
                    <div key={item.id} className="border-b border-slate-100 last:border-0">
                      <button
                        type="button"
                        aria-expanded={active}
                        onClick={() => setExpandedFAQ(active ? null : item.id)}
                        onMouseEnter={() => setHoverFAQ(item.id)}
                        className="w-full flex items-center gap-3 py-3.5 text-left cursor-pointer"
                      >
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 transition-all duration-300"
                          style={{ background: active ? C.teal : "rgba(38,174,144,0.08)", color: active ? "#fff" : C.teal }}
                        >
                          {item.id}
                        </span>
                        <span
                          className="hidden sm:flex w-7 h-7 rounded-lg items-center justify-center shrink-0 transition-colors duration-300"
                          style={{ background: "#f1f5f9", color: "#64748b" }}
                        >
                          <FaqIcon size={15} strokeWidth={2} />
                        </span>
                        <h4
                          className="flex-1 min-w-0 font-semibold text-[14px] sm:text-[15px] leading-snug text-slate-800 transition-opacity duration-200"
                          style={{ opacity: active ? 1 : hovered ? 0.75 : 1 }}
                        >
                          {item.q}
                        </h4>
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                          style={{ background: active || hovered ? C.teal : "#f1f5f9" }}
                        >
                          {active
                            ? <Minus size={13} color="#fff" />
                            : <Plus size={13} style={{ color: hovered ? "#fff" : "#94a3b8" }} />}
                        </span>
                      </button>

                      <div
                        className="overflow-hidden transition-all duration-300"
                        style={{ maxHeight: active ? "200px" : "0px", opacity: active ? 1 : 0 }}
                      >
                        <p className="pl-10 pr-4 pb-4 pt-0 text-sm leading-relaxed border-t" style={{ borderColor: "rgba(38,174,144,0.16)", color: C.grey }}>
                          {item.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-4 px-3 pt-4 pb-1 border-t border-slate-100">
                <p className="text-xs" style={{ color: C.grey }}>
                  Still have questions?
                </p>
                <button
                  className="px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-95 cursor-pointer"
                  style={{ background: C.lime, color: C.navy }}
                >
                  View All FAQs →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQ;
