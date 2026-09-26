import { useState, useMemo, useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/common/Container";
import bgImage from "../assets/customer-img.png";
import useSEO from "../hooks/useSEO";

// ── Design tokens (Bisleri green / lime / deep blue / grey brief) ─────────────
const T = {
  navy: "#066a9c",       // deep blue — primary dark, headers, hero
  navyDeep: "#032B5C",   // darker blue for gradients/depth
  gold: "#f2f231",       // lime — CTA, high-energy accents
  goldSoft: "#E7F98F",   // soft lime for text-on-dark / highlights
  cream: "#F1FAF8",      // teal-tinted off-white background
  paper: "#FFFFFF",
  ink: "#0C2A4D",
  inkSoft: "#7b7b7b",    // grey — secondary text
  emerald: "#26ae90",    // bisleri green — principal, primary active color
  emeraldSoft: "#D7F5F1",
  rust: "#2E6FB5",       // mid-blue — interest, secondary data color
  rustSoft: "#DEEAF8",
  limeDark: "#8FA916",   // accessible lime for text/borders on light bg
  limeSoft: "#F2FAD1",
  line: "#E2E8E7",
};

const serif = { fontFamily: "'Fraunces', Georgia, serif" };

// ── Loan type config ──────────────────────────────────────────────────────────
const loanTypes = [
  { id: "personal",  label: "Personal",   full: "Personal Loan",        rate: 11.0, minAmt: 50000,   maxAmt: 5000000,  minTenure: 1, maxTenure: 5  },
  { id: "home",      label: "Home",       full: "Home Loan",            rate: 8.5,  minAmt: 500000,  maxAmt: 50000000, minTenure: 5, maxTenure: 30 },
  { id: "car",       label: "Car",        full: "Car Loan",             rate: 9.0,  minAmt: 100000,  maxAmt: 5000000,  minTenure: 1, maxTenure: 7  },
  { id: "business",  label: "Business",   full: "Business Loan",        rate: 12.0, minAmt: 100000,  maxAmt: 10000000, minTenure: 1, maxTenure: 5  },
  { id: "education", label: "Education",  full: "Education Loan",       rate: 8.0,  minAmt: 100000,  maxAmt: 2000000,  minTenure: 1, maxTenure: 7  },
  { id: "lap",       label: "Property",   full: "Loan Against Property",rate: 9.5,  minAmt: 500000,  maxAmt: 50000000, minTenure: 5, maxTenure: 20 },
  { id: "balance",   label: "Transfer",   full: "Balance Transfer",     rate: 9.0,  minAmt: 100000,  maxAmt: 5000000,  minTenure: 1, maxTenure: 5  },
  { id: "credit",    label: "Credit Card",full: "Credit Card",          rate: 18.0, minAmt: 10000,   maxAmt: 500000,   minTenure: 1, maxTenure: 3  },
];

const banks = [
  { id: "hdfc",   label: "HDFC Bank" },
  { id: "icici",  label: "ICICI Bank" },
  { id: "axis",   label: "Axis Bank" },
  { id: "kotak",  label: "Kotak Mahindra Bank" },
  { id: "sbi",    label: "State Bank of India" },
  { id: "pnb",    label: "PNB Housing" },
  { id: "bajaj",  label: "Bajaj Finserv" },
  { id: "tata",   label: "Tata Capital" },
];

// ── Icons (minimal line icons, one per loan type) ─────────────────────────────
const icons: Record<string, ReactElement> = {
  personal: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c1.2-4 4-5.8 7-5.8s5.8 1.8 7 5.8" />
    </>
  ),
  home: (
    <>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </>
  ),
  car: (
    <>
      <path d="M4 16V12l2-4h12l2 4v4" />
      <path d="M4 16h16" />
      <circle cx="7.5" cy="16.5" r="1.6" />
      <circle cx="16.5" cy="16.5" r="1.6" />
    </>
  ),
  business: (
    <>
      <rect x="4" y="8.5" width="16" height="10.5" rx="1.2" />
      <path d="M9 8.5V6.2A1.2 1.2 0 0 1 10.2 5h3.6a1.2 1.2 0 0 1 1.2 1.2V8.5" />
      <path d="M4 13h16" />
    </>
  ),
  education: (
    <>
      <path d="M2.5 8.5 12 4l9.5 4.5L12 13z" />
      <path d="M6 10.6V15c0 1.6 2.7 2.9 6 2.9s6-1.3 6-2.9v-4.4" />
    </>
  ),
  lap: (
    <>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9h12v-9" />
      <circle cx="12" cy="14.5" r="1.6" />
      <path d="M12 16v1.8" />
    </>
  ),
  balance: (
    <>
      <path d="M4 8h13" />
      <path d="M14 4.5 17.5 8 14 11.5" />
      <path d="M20 16H7" />
      <path d="M10 12.5 6.5 16 10 19.5" />
    </>
  ),
  credit: (
    <>
      <rect x="3.5" y="6" width="17" height="12" rx="1.6" />
      <path d="M3.5 10.2h17" />
      <path d="M6.5 14.3h4" />
    </>
  ),
};

const Icon = ({ id, active }: { id: string; active: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke={active ? "#fff" : T.navy}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {icons[id]}
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n: number) => "\u20B9" + Math.round(n).toLocaleString("en-IN");

// Count-up hook — animates a displayed number toward its target
function useCountUp(target: number, duration = 450) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const delta = target - from;
    if (Math.abs(delta) < 1) {
      setValue(target);
      fromRef.current = target;
      return;
    }
    startRef.current = null;
    let raf: number;
    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const p = Math.min(1, (ts - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(from + delta * eased);
      if (p < 1) raf = requestAnimationFrame(step);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

// Donut chart — principal vs interest, with a center label
function DonutChart({ principal, interest }: { principal: number; interest: number }) {
  const total = principal + interest;
  const pct = total === 0 ? 0 : principal / total;
  const r = 62;
  const stroke = 20;
  const c = 2 * Math.PI * r;
  const principalLen = c * pct;

  return (
    <div className="relative" style={{ width: 176, height: 176 }}>
      <svg viewBox="0 0 176 176" width="176" height="176">
        <circle cx="88" cy="88" r={r} fill="none" stroke={T.rustSoft} strokeWidth={stroke} />
        <circle
          cx="88" cy="88" r={r} fill="none"
          stroke={T.emerald} strokeWidth={stroke}
          strokeDasharray={`${principalLen} ${c - principalLen}`}
          strokeLinecap="round"
          transform="rotate(-90 88 88)"
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] font-semibold tracking-wide" style={{ color: T.inkSoft }}>Principal</span>
        <span className="text-xl font-bold" style={{ ...serif, color: T.navy }}>{(pct * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
}

// ── Styled range slider ────────────────────────────────────────────────────────
function Slider({
  value, min, max, step, onChange, color,
}: { value: number; min: number; max: number; step: number; onChange: (n: number) => void; color: string }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="emi-slider w-full cursor-pointer"
      style={{
        // CSS custom properties must be cast — React's CSSProperties type
        // only knows fixed property names.
        "--fill": `${pct}%`,
        "--track-color": color,
      } as React.CSSProperties}
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const EMICalculatorPage = () => {
  useSEO({
    title: "EMI Calculator — Monthly Instalment & Interest",
    description:
      "Calculate your loan EMI, total interest and full repayment schedule for personal, home, car and other loans. Free, instant and no sign-up needed.",
    path: "/emi-calculator",
  });

  const navigate = useNavigate();

  const [selectedLoanId, setSelectedLoanId] = useState("personal");
  const [selectedBank,   setSelectedBank]   = useState("");
  const [loanAmount,     setLoanAmount]     = useState(500000);
  const [interestRate,   setInterestRate]   = useState(11.0);
  const [loanTenure,     setLoanTenure]     = useState(3);
  const [tenureUnit,     setTenureUnit]     = useState<"months" | "years">("years");

  const loan = useMemo(() => loanTypes.find(l => l.id === selectedLoanId)!, [selectedLoanId]);

  const handleLoanTypeChange = (id: string) => {
    const l = loanTypes.find(x => x.id === id)!;
    setSelectedLoanId(id);
    setInterestRate(l.rate);
    setLoanAmount(Math.round((l.minAmt + l.maxAmt) / 10 / 1000) * 1000);
    setLoanTenure(Math.round((l.minTenure + l.maxTenure) / 2));
    setTenureUnit("years");
  };

  const tenureInMonths = tenureUnit === "years" ? loanTenure * 12 : loanTenure;
  const monthlyRate    = interestRate / 12 / 100;
  const emi = monthlyRate === 0
    ? loanAmount / tenureInMonths
    : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) /
      (Math.pow(1 + monthlyRate, tenureInMonths) - 1);

  const totalPayment  = emi * tenureInMonths;
  const totalInterest = totalPayment - loanAmount;

  const emiAnimated      = useCountUp(emi);
  const interestAnimated = useCountUp(totalInterest);
  const totalAnimated    = useCountUp(totalPayment);

  const amortRows = useMemo(() => {
    const rows = [];
    const totalYears = Math.ceil(tenureInMonths / 12);
    let balance = loanAmount;
    for (let yr = 1; yr <= totalYears; yr++) {
      const mths = yr < totalYears ? 12 : tenureInMonths - (totalYears - 1) * 12;
      let yPrincipal = 0, yInterest = 0;
      for (let m = 0; m < mths; m++) {
        const ip = balance * monthlyRate;
        const pp = emi - ip;
        yInterest  += ip;
        yPrincipal += pp;
        balance    -= pp;
      }
      rows.push({ yr, yPrincipal, yInterest, yTotal: yPrincipal + yInterest, balance: Math.max(0, balance) });
    }
    return rows;
  }, [loanAmount, monthlyRate, emi, tenureInMonths]);

  return (
    <div className="min-h-screen" style={{ background: T.cream }}>
      <style>{`
        .emi-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(to right, var(--track-color) 0%, var(--track-color) var(--fill), #E2E8E7 var(--fill), #E2E8E7 100%);
          outline: none;
        }
        .emi-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: #fff;
          border: 3px solid var(--track-color);
          box-shadow: 0 2px 6px rgba(5,66,137,0.25);
          cursor: pointer;
          margin-top: -7px;
        }
        .emi-slider::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: #fff;
          border: 3px solid var(--track-color);
          box-shadow: 0 2px 6px rgba(5,66,137,0.25);
          cursor: pointer;
        }
        .emi-slider::-moz-range-track { background: transparent; }
      `}</style>

      {/* ════════════════════════ HERO BANNER ════════════════════════ */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: 380 }}>
        {/* Background image */}
        <img
          src={bgImage}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark navy overlay — keeps content legible while image shows through */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(120deg, rgba(3,43,92,0.92) 0%, rgba(5,66,137,0.85) 55%, rgba(0,179,161,0.70) 100%)` }}
        />

        <Container>
          <div className="relative z-10 py-14 md:py-16 px-4 md:px-8 text-white">
            <div className="flex items-center gap-2 text-sm mb-6" style={{ color: T.goldSoft }}>
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span style={{ color: T.emerald }}>/</span>
              <span className="text-white font-medium">EMI Calculator</span>
            </div>

            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase mb-4 px-3 py-1.5 rounded-full" style={{ color: T.navyDeep, background: T.gold }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: T.navyDeep }} />
                Free & Instant
              </span>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3" style={serif}>
                Know your EMI<br className="hidden md:block" /> before you borrow
              </h1>
              <p className="text-base md:text-lg leading-relaxed max-w-lg" style={{ color: "#C9DCEF" }}>
                Move the sliders to see your monthly instalment, total interest and full repayment
                schedule update instantly — no sign-up needed.
              </p>

              {/* stat strip — a quick, credible snapshot */}
              <div className="flex flex-wrap gap-3 mt-7">
                {[
                  { k: "8%+", v: "Rates from" },
                  { k: "8", v: "Loan types" },
                  { k: "30 yrs", v: "Max tenure" },
                ].map(s => (
                  <div key={s.v} className="flex items-center gap-2.5 rounded-xl px-4 py-2.5" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}>
                    <span className="text-lg font-bold" style={{ ...serif, color: T.gold }}>{s.k}</span>
                    <span className="text-xs" style={{ color: "#B9CBE0" }}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ height: 36 }}>
          <svg viewBox="0 0 1440 36" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,36 C480,0 960,0 1440,36 L1440,36 L0,36 Z" fill={T.cream} />
          </svg>
        </div>
      </section>

      {/* ════════════════════════ CALCULATOR ════════════════════════ */}
      <Container>
        <div className="py-10 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">

            {/* ── Loan type chips ── */}
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wide mb-2.5" style={{ color: T.inkSoft }}>
                What are you borrowing for?
              </label>
              <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: "thin" }}>
                {loanTypes.map(l => {
                  const active = l.id === selectedLoanId;
                  return (
                    <button
                      key={l.id}
                      onClick={() => handleLoanTypeChange(l.id)}
                      className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all cursor-pointer"
                      style={{
                        background: active ? T.navy : T.paper,
                        color: active ? "#fff" : T.ink,
                        borderColor: active ? T.navy : T.line,
                        boxShadow: active ? "0 4px 12px rgba(5,66,137,0.25)" : "none",
                      }}
                    >
                      <Icon id={l.id} active={active} />
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Bank select + rate badge ── */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-xs">
                <select
                  value={selectedBank}
                  onChange={e => setSelectedBank(e.target.value)}
                  className="w-full appearance-none border rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold focus:outline-none cursor-pointer"
                  style={{ background: T.paper, borderColor: T.line, color: T.ink }}
                >
                  <option value="">Compare all banks</option>
                  {banks.map(b => (
                    <option key={b.id} value={b.id}>{b.label}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke={T.inkSoft} strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-xs font-semibold" style={{ color: T.inkSoft }}>
                {loan.full} starts from <strong style={{ color: T.navy }}>{loan.rate}% p.a.</strong>
              </span>
            </div>

            {/* ── Main card ── */}
            <div className="rounded-3xl overflow-hidden" style={{ background: T.paper, boxShadow: "0 12px 32px rgba(5,66,137,0.08)", border: `1px solid ${T.line}` }}>
              <div className="grid grid-cols-1 lg:grid-cols-5">

                {/* LEFT — Sliders */}
                <div className="lg:col-span-3 p-6 md:p-9 space-y-9" style={{ borderRight: `1px solid ${T.line}` }}>

                  {/* Loan Amount */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-bold" style={{ color: T.ink }}>Loan Amount</label>
                      <div className="flex items-center gap-1 rounded-lg px-3 py-1.5" style={{ background: T.emeraldSoft }}>
                        <span className="font-bold text-sm" style={{ color: T.emerald }}>{"\u20B9"}</span>
                        <input
                          type="number"
                          value={loanAmount}
                          onChange={e => setLoanAmount(Math.min(loan.maxAmt, Math.max(loan.minAmt, Number(e.target.value))))}
                          className="w-28 text-sm font-bold bg-transparent focus:outline-none"
                          style={{ color: T.emerald }}
                        />
                      </div>
                    </div>
                    <Slider value={loanAmount} min={loan.minAmt} max={loan.maxAmt} step={loan.minAmt} onChange={setLoanAmount} color={T.emerald} />
                    <div className="flex justify-between text-xs mt-1.5" style={{ color: T.inkSoft }}>
                      <span>{fmt(loan.minAmt)}</span>
                      <span>{fmt(loan.maxAmt)}</span>
                    </div>
                  </div>

                  {/* Rate of Interest */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-bold" style={{ color: T.ink }}>
                        Rate of Interest <span className="font-normal text-xs" style={{ color: T.inkSoft }}>(% p.a.)</span>
                      </label>
                      <div className="flex items-center gap-1 rounded-lg px-3 py-1.5" style={{ background: T.rustSoft }}>
                        <input
                          type="number" min={1} max={36} step={0.1}
                          value={interestRate}
                          onChange={e => setInterestRate(Math.min(36, Math.max(1, Number(e.target.value))))}
                          className="w-14 text-sm font-bold bg-transparent focus:outline-none"
                          style={{ color: T.rust }}
                        />
                        <span className="font-bold text-sm" style={{ color: T.rust }}>%</span>
                      </div>
                    </div>
                    <Slider value={interestRate} min={1} max={36} step={0.1} onChange={setInterestRate} color={T.rust} />
                    <div className="flex justify-between text-xs mt-1.5" style={{ color: T.inkSoft }}>
                      <span>1%</span><span>36%</span>
                    </div>
                  </div>

                  {/* Loan Tenure */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-bold" style={{ color: T.ink }}>Loan Tenure</label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-lg px-3 py-1.5" style={{ background: T.limeSoft }}>
                          <input
                            type="number"
                            min={tenureUnit === "years" ? loan.minTenure : loan.minTenure * 12}
                            max={tenureUnit === "years" ? loan.maxTenure : loan.maxTenure * 12}
                            value={loanTenure}
                            onChange={e => setLoanTenure(Number(e.target.value))}
                            className="w-10 text-sm font-bold bg-transparent focus:outline-none"
                            style={{ color: T.limeDark }}
                          />
                        </div>
                        <div className="flex rounded-lg p-0.5 text-xs font-bold" style={{ background: T.cream }}>
                          {(["years", "months"] as const).map(u => (
                            <button key={u}
                              onClick={() => { setTenureUnit(u); setLoanTenure(u === "months" ? loanTenure * 12 : Math.round(loanTenure / 12)); }}
                              className="px-2.5 py-1 rounded-md transition-all cursor-pointer"
                              style={{
                                background: tenureUnit === u ? T.paper : "transparent",
                                color: tenureUnit === u ? T.navy : T.inkSoft,
                                boxShadow: tenureUnit === u ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                              }}>
                              {u === "years" ? "Yr" : "Mo"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Slider
                      value={loanTenure}
                      min={tenureUnit === "years" ? loan.minTenure : loan.minTenure * 12}
                      max={tenureUnit === "years" ? loan.maxTenure : loan.maxTenure * 12}
                      step={1}
                      onChange={setLoanTenure}
                      color={T.limeDark}
                    />
                    <div className="flex justify-between text-xs mt-1.5" style={{ color: T.inkSoft }}>
                      <span>{tenureUnit === "years" ? `${loan.minTenure} Yr` : `${loan.minTenure * 12} Mo`}</span>
                      <span>{tenureUnit === "years" ? `${loan.maxTenure} Yr` : `${loan.maxTenure * 12} Mo`}</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT — Results */}
                <div className="lg:col-span-2 p-6 md:p-9 flex flex-col gap-5" style={{ background: T.navy, color: "#fff" }}>

                  <div className="text-center pb-5" style={{ borderBottom: "1px dashed rgba(255,255,255,0.18)" }}>
                    <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: T.goldSoft }}>Your Monthly EMI</p>
                    <p className="text-4xl md:text-[2.6rem] font-bold" style={serif}>{fmt(emiAnimated)}</p>
                  </div>

                  <div className="space-y-3 pb-5" style={{ borderBottom: "1px dashed rgba(255,255,255,0.18)" }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: "#B9C0DC" }}>Total Interest Payable</span>
                      <span className="font-bold">{fmt(interestAnimated)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: "#B9C0DC" }}>Total of Payments</span>
                      <span className="font-bold text-base" style={{ color: T.goldSoft }}>{fmt(totalAnimated)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#B9C0DC" }}>Break-up of Payment</p>
                    <div className="rounded-2xl p-2" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <DonutChart principal={loanAmount} interest={totalInterest} />
                    </div>
                    <div className="flex items-center gap-5 text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: T.emerald }} />
                        Principal
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: T.rustSoft }} />
                        Interest
                      </div>
                    </div>
                  </div>

                  <button onClick={() => navigate("/")}
                    className="mt-1 w-full py-3.5 rounded-xl font-bold text-sm cursor-pointer transition-all hover:opacity-90 active:scale-95"
                    style={{ background: T.gold, color: T.navyDeep }}>
                    Apply Now →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* ════════════════════ AMORTIZATION TABLE ════════════════════ */}
      <div style={{ background: T.paper, borderTop: `1px solid ${T.line}` }}>
        <Container>
          <div className="py-10 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold" style={{ ...serif, color: T.ink }}>Loan Amortization Schedule</h3>
                  <p className="text-sm mt-0.5" style={{ color: T.inkSoft }}>Year-by-year repayment breakdown</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs font-semibold" style={{ color: T.inkSoft }}>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: T.emerald }} />Principal</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: T.rust }} />Interest</span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid ${T.line}` }}>
                <table className="w-full text-sm min-w-140">
                  <thead>
                    <tr style={{ background: T.navy }}>
                      {["Year", "Principal (\u20B9)", "Interest (\u20B9)", "Total Payment (\u20B9)", "Balance (\u20B9)"].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left text-white font-semibold text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {amortRows.map((row, i) => (
                      <tr key={row.yr} className="transition-colors" style={{ background: i % 2 === 0 ? T.paper : T.cream, borderBottom: `1px solid ${T.line}` }}>
                        <td className="px-5 py-3.5 font-bold" style={{ color: T.ink }}>
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white" style={{ background: T.navy }}>
                            {row.yr}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-semibold" style={{ color: T.emerald }}>{fmt(Math.round(row.yPrincipal))}</td>
                        <td className="px-5 py-3.5 font-semibold" style={{ color: T.rust }}>{fmt(Math.round(row.yInterest))}</td>
                        <td className="px-5 py-3.5 font-bold" style={{ color: T.navy }}>{fmt(Math.round(row.yTotal))}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 rounded-full h-1.5 max-w-20 hidden md:block" style={{ background: T.line }}>
                              <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, (row.balance / loanAmount) * 100)}%`, background: T.gold }} />
                            </div>
                            <span className="font-semibold" style={{ color: T.ink }}>{fmt(Math.round(row.balance))}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr style={{ borderTop: `2px solid ${T.gold}`, background: "#FBF3E1" }}>
                      <td className="px-5 py-3.5 font-extrabold text-xs uppercase tracking-wide" style={{ color: T.ink }}>Total</td>
                      <td className="px-5 py-3.5 font-extrabold" style={{ color: T.emerald }}>{fmt(loanAmount)}</td>
                      <td className="px-5 py-3.5 font-extrabold" style={{ color: T.rust }}>{fmt(Math.round(totalInterest))}</td>
                      <td className="px-5 py-3.5 font-extrabold" style={{ color: T.navy }}>{fmt(Math.round(totalPayment))}</td>
                      <td className="px-5 py-3.5 font-extrabold" style={{ color: T.inkSoft }}>—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* ════════════════════════ FAQ ════════════════════════════════ */}
      <div style={{ background: T.cream, borderTop: `1px solid ${T.line}` }}>
        <Container>
          <div className="py-10 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-lg font-bold mb-6 text-center" style={{ ...serif, color: T.ink }}>Frequently Asked Questions</h3>
              <div className="space-y-2.5">
                {[
                  { q: "What is EMI?", a: "EMI (Equated Monthly Installment) is a fixed amount paid every month to repay your loan. It includes both the principal repayment and the interest charged." },
                  { q: "How is EMI calculated?", a: "EMI = [P × R × (1+R)^N] / [(1+R)^N – 1] where P = Principal, R = Monthly Interest Rate, N = Tenure in months." },
                  { q: "Does prepayment reduce my EMI?", a: "Yes. Partial prepayment reduces the outstanding principal, which reduces the interest component. You can either lower your EMI or shorten your tenure." },
                  { q: "Is this calculator accurate?", a: "Our tool uses the standard reducing balance method. Actual EMI may vary slightly based on the lender's processing fee or exact disbursement date." },
                ].map(faq => (
                  <details key={faq.q} className="rounded-2xl group" style={{ background: T.paper, border: `1px solid ${T.line}` }}>
                    <summary className="flex items-center justify-between px-5 py-4 font-semibold text-sm list-none cursor-pointer select-none" style={{ color: T.ink }}>
                      {faq.q}
                      <svg className="w-4 h-4 group-open:rotate-180 transition-transform shrink-0" fill="none" stroke={T.gold} strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </summary>
                    <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: T.inkSoft }}>{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>

    </div>
  );
};

export default EMICalculatorPage;