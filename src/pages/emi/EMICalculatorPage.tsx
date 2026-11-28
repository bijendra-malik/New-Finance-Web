import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/common/Container";
import PageBanner from "../../components/common/PageBanner";
import useSEO from "../../hooks/useSEO";
import { T, serif, loanTypes, banks, bankById, fmt } from "./emiCalculatorData";
import { Icon } from "./emiCalculatorIcons";
import { Slider } from "./emiCalculatorControls";
import { useCountUp } from "../../hooks/useCountUp";
import { amountInWords, digitsOnly, formatIndianNumber } from "../../utils/formatters";

const EMICalculatorPage = () => {
  useSEO({
    title: "EMI Calculator — Monthly Instalment & Interest",
    description:
      "Calculate your loan EMI, total interest and full repayment schedule for personal, home, vehicle and other loans. Free, instant and no sign-up needed.",
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

  const rateFor = (bankId: string, loanId: string, fallback: number) => {
    const rate = bankById(bankId)?.rates[loanId];
    return typeof rate === "number" ? rate : fallback;
  };

  const handleLoanTypeChange = (id: string) => {
    const l = loanTypes.find(x => x.id === id)!;
    const bankRate = bankById(selectedBank)?.rates[id];
    if (selectedBank && typeof bankRate !== "number") setSelectedBank("");
    setSelectedLoanId(id);
    setInterestRate(typeof bankRate === "number" ? bankRate : l.rate);
    setLoanAmount(Math.round((l.minAmt + l.maxAmt) / 10 / 1000) * 1000);
    setLoanTenure(Math.round((l.minTenure + l.maxTenure) / 2));
    setTenureUnit("years");
  };

  const handleBankChange = (id: string) => {
    setSelectedBank(id);
    setInterestRate(rateFor(id, loan.id, loan.rate));
  };

  const handleRateChange = (rate: number) => {
    setSelectedBank("");
    setInterestRate(rate);
  };

  const selectedBankOffer = bankById(selectedBank);
  const selectedBankRate = selectedBankOffer?.rates[loan.id];
  const bankRateVerified = selectedBankOffer ? selectedBankOffer.verified.includes(loan.id) : false;
  const showsBankRate = selectedBankOffer !== undefined && typeof selectedBankRate === "number";
  const banksForLoan = banks.filter(b => typeof b.rates[loan.id] === "number");

  const amountSliderMax = Math.max(loan.maxAmt, loanAmount);

  const tenureInMonths = tenureUnit === "years" ? loanTenure * 12 : loanTenure;
  const monthlyRate    = interestRate / 12 / 100;
  const emi = loanAmount <= 0 || tenureInMonths <= 0
    ? 0
    : monthlyRate === 0
      ? loanAmount / tenureInMonths
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) /
        (Math.pow(1 + monthlyRate, tenureInMonths) - 1);

  const totalPayment  = emi * tenureInMonths;
  const totalInterest = totalPayment - loanAmount;

  const emiAnimated      = useCountUp(emi);
  const interestAnimated = useCountUp(totalInterest);
  const totalAnimated    = useCountUp(totalPayment);

  const tenureLabel = tenureInMonths > 0
    ? tenureInMonths % 12 === 0
      ? `${tenureInMonths / 12} year${tenureInMonths === 12 ? "" : "s"}`
      : `${tenureInMonths} months`
    : "0 months";

  const interestShare  = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;
  const principalShare = 100 - interestShare;

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
      rows.push({ yr, yPrincipal, yInterest, balance: Math.max(0, balance) });
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

      <PageBanner
        breadcrumb="EMI Calculator"
        title="Know Your EMI"
        highlight="Before You Borrow"
        tagline="Set the amount, rate and tenure — your monthly instalment, total interest and year-by-year schedule update as you go."
      />

      <Container>
        <div className="px-4 py-10 md:px-8">
          <div className="mx-auto max-w-6xl">

            {/* STEP 1 — loan type */}
            <section aria-labelledby="emi-step-loan" className="mb-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <label htmlFor="emi-loan-type" className="text-sm font-bold" style={{ color: T.ink }}>
                  What are you borrowing for?
                </label>
                <div className="relative w-full sm:max-w-xs">
                  <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 [&>svg]:h-4 [&>svg]:w-4">
                    <Icon id={loan.id} active={false} />
                  </span>
                  <select
                    id="emi-loan-type"
                    value={selectedLoanId}
                    onChange={e => handleLoanTypeChange(e.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-xl border bg-white py-2.5 pl-10 pr-9 text-[13px] font-bold focus:outline-none"
                    style={{ borderColor: T.line, color: T.ink }}
                  >
                    {loanTypes.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.full} · from {l.rate}% p.a.
                      </option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
                    fill="none"
                    stroke={T.inkSoft}
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </section>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">

              {/* CONTROLS */}
              <div
                className="rounded-3xl border p-4 md:p-6"
                style={{ background: T.paper, borderColor: T.line, boxShadow: "0 18px 44px -34px rgba(4,78,116,0.5)" }}
              >
                <div className="space-y-3">

                  {/* Loan amount */}
                  <div className="rounded-2xl p-4" style={{ background: "#FBFDFD", border: `1px solid ${T.line}` }}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-[0.16em]" style={{ color: T.inkSoft }}>
                          Step 1
                        </p>
                        <p className="mt-0.5 text-sm font-bold" style={{ color: T.ink }}>How much do you need?</p>
                        <p className="mt-0.5 text-[11.5px]" style={{ color: T.inkSoft }}>
                          The loan amount, before interest.
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div
                          className="flex items-center gap-1 rounded-xl border bg-white px-3 py-2"
                          style={{ borderColor: T.emerald }}
                        >
                          <span className="text-sm font-bold" style={{ color: T.emerald }}>{"\u20B9"}</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            aria-label="Loan amount"
                            value={formatIndianNumber(String(loanAmount))}
                            onChange={e => setLoanAmount(Number(digitsOnly(e.target.value)) || 0)}
                            onBlur={() => setLoanAmount(v => Math.max(0, v))}
                            className="w-32 bg-transparent text-right text-lg font-extrabold tabular-nums focus:outline-none"
                            style={{ color: T.emerald }}
                          />
                        </div>
                        <p className="text-[11px] tabular-nums" style={{ color: T.inkSoft }}>
                          {amountInWords(loanAmount)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Slider value={loanAmount} min={0} max={amountSliderMax} step={1000} onChange={setLoanAmount} color={T.emerald} />
                    </div>
                    <div className="mt-1.5 flex justify-between text-[11px]" style={{ color: T.inkSoft }}>
                      <span>{fmt(0)}</span>
                      <span>{fmt(amountSliderMax)}</span>
                    </div>
                  </div>

                  {/* Interest rate + bank */}
                  <div className="rounded-2xl p-4" style={{ background: "#FBFDFD", border: `1px solid ${T.line}` }}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-[0.16em]" style={{ color: T.inkSoft }}>
                          Step 2
                        </p>
                        <p className="mt-0.5 text-sm font-bold" style={{ color: T.ink }}>At what interest rate?</p>
                        <p className="mt-0.5 text-[11.5px]" style={{ color: T.inkSoft }}>
                          % per year, on the reducing balance.
                        </p>
                      </div>
                      <div
                        className="flex items-center gap-1 rounded-xl border bg-white px-3 py-2"
                        style={{ borderColor: T.rust }}
                      >
                        <input
                          type="number"
                          min={1}
                          max={36}
                          step={0.1}
                          aria-label="Interest rate"
                          value={interestRate}
                          onChange={e => handleRateChange(Math.min(36, Math.max(1, Number(e.target.value))))}
                          className="w-16 bg-transparent text-right text-lg font-extrabold tabular-nums focus:outline-none"
                          style={{ color: T.rust }}
                        />
                        <span className="text-sm font-bold" style={{ color: T.rust }}>%</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Slider value={interestRate} min={1} max={36} step={0.1} onChange={handleRateChange} color={T.rust} />
                    </div>
                    <div className="mt-1.5 flex justify-between text-[11px]" style={{ color: T.inkSoft }}>
                      <span>1%</span>
                      <span>36%</span>
                    </div>

                    {banksForLoan.length > 0 && (
                    <div className="mt-4 rounded-xl px-3 py-2.5" style={{ background: T.cream }}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label htmlFor="emi-bank" className="text-[11.5px] font-bold" style={{ color: T.ink }}>
                          Not sure? Start from a bank
                        </label>
                        <div className="relative">
                          <select
                            id="emi-bank"
                            value={selectedBank}
                            onChange={e => handleBankChange(e.target.value)}
                            className="cursor-pointer appearance-none rounded-lg border bg-white py-1.5 pl-3 pr-8 text-[12px] font-bold focus:outline-none"
                            style={{ borderColor: T.line, color: T.ink }}
                          >
                            <option value="">Select a bank</option>
                            {banksForLoan.map(b => (
                              <option key={b.id} value={b.id}>{b.label}</option>
                            ))}
                          </select>
                          <svg
                            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
                            fill="none"
                            stroke={T.inkSoft}
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-4" style={{ color: T.inkSoft }}>
                        {showsBankRate && selectedBankOffer ? (
                          <>
                            {selectedBankOffer.label} {loan.full} at{" "}
                            <strong style={{ color: T.navy }}>{interestRate}% p.a.</strong>
                            {!bankRateVerified && (
                              <span
                                className="ml-1.5 inline-block whitespace-nowrap rounded-full px-2 py-0.5 align-middle text-[10px] font-bold"
                                style={{ background: "#FDF3D8", color: "#8A6100" }}
                              >
                                indicative — confirm with the lender
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            {loan.full} at <strong style={{ color: T.navy }}>{interestRate}% p.a.</strong>
                            {interestRate !== loan.rate ? " (your rate)" : ""} — pick a bank above to compare.
                          </>
                        )}
                      </p>
                    </div>
                    )}
                  </div>

                  {/* Tenure */}
                  <div className="rounded-2xl p-4" style={{ background: "#FBFDFD", border: `1px solid ${T.line}` }}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-[0.16em]" style={{ color: T.inkSoft }}>
                          Step 3
                        </p>
                        <p className="mt-0.5 text-sm font-bold" style={{ color: T.ink }}>Over how long?</p>
                        <p className="mt-0.5 text-[11.5px]" style={{ color: T.inkSoft }}>
                          A longer tenure lowers the EMI but costs more in interest.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="flex items-center rounded-xl border bg-white px-3 py-2"
                          style={{ borderColor: T.limeDark }}
                        >
                          <input
                            type="number"
                            aria-label="Loan tenure"
                            min={tenureUnit === "years" ? loan.minTenure : loan.minTenure * 12}
                            max={tenureUnit === "years" ? loan.maxTenure : loan.maxTenure * 12}
                            value={loanTenure}
                            onChange={e => setLoanTenure(Number(e.target.value))}
                            className="w-12 bg-transparent text-right text-lg font-extrabold tabular-nums focus:outline-none"
                            style={{ color: T.limeDark }}
                          />
                        </div>
                        <div className="flex rounded-xl p-0.5 text-[11px] font-bold" style={{ background: T.cream }}>
                          {(["years", "months"] as const).map(u => (
                            <button
                              key={u}
                              type="button"
                              onClick={() => {
                                setTenureUnit(u);
                                setLoanTenure(u === "months" ? loanTenure * 12 : Math.round(loanTenure / 12));
                              }}
                              className="cursor-pointer rounded-lg px-2.5 py-1.5 transition-all"
                              style={{
                                background: tenureUnit === u ? T.paper : "transparent",
                                color: tenureUnit === u ? T.navy : T.inkSoft,
                                boxShadow: tenureUnit === u ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                              }}
                            >
                              {u === "years" ? "Yr" : "Mo"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Slider
                        value={loanTenure}
                        min={tenureUnit === "years" ? loan.minTenure : loan.minTenure * 12}
                        max={tenureUnit === "years" ? loan.maxTenure : loan.maxTenure * 12}
                        step={1}
                        onChange={setLoanTenure}
                        color={T.limeDark}
                      />
                    </div>
                    <div className="mt-1.5 flex justify-between text-[11px]" style={{ color: T.inkSoft }}>
                      <span>{tenureUnit === "years" ? `${loan.minTenure} Yr` : `${loan.minTenure * 12} Mo`}</span>
                      <span>{tenureUnit === "years" ? `${loan.maxTenure} Yr` : `${loan.maxTenure * 12} Mo`}</span>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-[11px] leading-5" style={{ color: T.inkSoft }}>
                  Estimates use the reducing-balance method and exclude processing fees, insurance and taxes.
                </p>
              </div>

              {/* SUMMARY */}
              <aside
                className="overflow-hidden rounded-3xl lg:sticky lg:top-24"
                style={{
                  background: "linear-gradient(158deg,#044e74 0%,#066a9c 58%,#0a6f7f 100%)",
                  color: "#fff",
                  boxShadow: "0 26px 60px -32px rgba(4,78,116,0.75)",
                }}
              >
                <div className="p-6 md:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: T.goldSoft }}>
                      Your monthly EMI
                    </p>
                    <span
                      className="rounded-full px-2.5 py-1 text-[10px] font-bold leading-none"
                      style={{ background: "rgba(255,255,255,0.16)" }}
                    >
                      {loan.full}
                    </span>
                  </div>

                  <p className="mt-2 text-[2.5rem] font-bold leading-none tabular-nums md:text-[2.9rem]" style={serif}>
                    {fmt(emiAnimated)}
                  </p>
                  <p className="mt-2 text-[12.5px]" style={{ color: T.onNavyMuted }}>
                    paid every month for {tenureLabel} at {interestRate}% p.a.
                  </p>

                  <div className="mt-6">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[10.5px] font-bold uppercase tracking-[0.14em]" style={{ color: T.onNavyMuted }}>
                        What you pay back
                      </p>
                      <p className="text-sm font-bold tabular-nums">{fmt(totalAnimated)}</p>
                    </div>
                    <div
                      className="mt-2 flex h-2.5 w-full overflow-hidden rounded-full"
                      style={{ background: "rgba(255,255,255,0.16)" }}
                      role="img"
                      aria-label={`Principal ${principalShare.toFixed(0)}%, interest ${interestShare.toFixed(0)}%`}
                    >
                      <div style={{ width: `${principalShare}%`, background: T.emerald, transition: "width .35s ease" }} />
                      <div style={{ width: `${interestShare}%`, background: T.gold, transition: "width .35s ease" }} />
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2.5">
                      <div className="rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.09)" }}>
                        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: T.onNavyMuted }}>
                          <span className="h-2 w-2 rounded-full" style={{ background: T.emerald }} />
                          Principal
                        </p>
                        <p className="mt-1 text-[13px] font-bold tabular-nums">{fmt(loanAmount)}</p>
                        <p className="text-[10px]" style={{ color: T.onNavyMuted }}>{principalShare.toFixed(0)}% of payments</p>
                      </div>
                      <div className="rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.09)" }}>
                        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: T.onNavyMuted }}>
                          <span className="h-2 w-2 rounded-full" style={{ background: T.gold }} />
                          Interest
                        </p>
                        <p className="mt-1 text-[13px] font-bold tabular-nums">{fmt(interestAnimated)}</p>
                        <p className="text-[10px]" style={{ color: T.onNavyMuted }}>{interestShare.toFixed(0)}% of payments</p>
                      </div>
                    </div>
                  </div>

                  <dl
                    className="mt-5 space-y-2 border-t pt-4 text-[13px]"
                    style={{ borderColor: T.onNavyLine }}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <dt style={{ color: T.onNavyMuted }}>Total interest</dt>
                      <dd className="font-bold tabular-nums">{fmt(interestAnimated)}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt style={{ color: T.onNavyMuted }}>Total of {tenureInMonths} payments</dt>
                      <dd className="font-bold tabular-nums" style={{ color: T.goldSoft }}>{fmt(totalAnimated)}</dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="mt-5 w-full cursor-pointer rounded-xl py-3.5 text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: T.gold, color: T.navyDeep }}
                  >
                    Apply Now →
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </Container>

      {/* YEAR-BY-YEAR SCHEDULE */}
      <div style={{ background: T.paper, borderTop: `1px solid ${T.line}` }}>
        <Container>
          <div className="px-4 py-10 md:px-8">
            <div className="mx-auto max-w-6xl">
              <h3 className="text-lg font-bold" style={{ ...serif, color: T.ink }}>Year-by-year repayment</h3>
              <p className="mt-1 text-sm" style={{ color: T.inkSoft }}>
                How much you repay each year, and how much is still owed.
              </p>

              <div className="mt-5 overflow-x-auto rounded-2xl" style={{ border: `1px solid ${T.line}` }}>
                <table className="w-full text-[13px] sm:text-sm">
                  <thead>
                    <tr style={{ background: T.navy }}>
                      {["Year", "Principal", "Interest", "Balance"].map(h => (
                        <th
                          key={h}
                          className="whitespace-nowrap px-2 py-3 sm:px-4 text-left text-[10.5px] font-semibold uppercase tracking-wide text-white"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {amortRows.map((row, i) => (
                      <tr
                        key={row.yr}
                        className="transition-colors"
                        style={{
                          background: i % 2 === 0 ? T.paper : "#F7FBFB",
                          borderBottom: `1px solid ${T.line}`,
                        }}
                      >
                        <td className="whitespace-nowrap px-2 py-3 sm:px-4 font-bold" style={{ color: T.ink }}>
                          Year {row.yr}
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 sm:px-4 font-semibold tabular-nums" style={{ color: T.emerald }}>
                          {fmt(Math.round(row.yPrincipal))}
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 sm:px-4 font-semibold tabular-nums" style={{ color: T.rust }}>
                          {fmt(Math.round(row.yInterest))}
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 sm:px-4 font-bold tabular-nums" style={{ color: T.navy }}>
                          {fmt(Math.round(row.balance))}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ borderTop: `2px solid ${T.gold}`, background: "#FBF7E6" }}>
                      <td className="px-2 py-3 sm:px-4 text-[10.5px] font-extrabold uppercase tracking-wide" style={{ color: T.ink }}>
                        Total
                      </td>
                      <td className="whitespace-nowrap px-2 py-3 sm:px-4 font-extrabold tabular-nums" style={{ color: T.emerald }}>
                        {fmt(loanAmount)}
                      </td>
                      <td className="whitespace-nowrap px-2 py-3 sm:px-4 font-extrabold tabular-nums" style={{ color: T.rust }}>
                        {fmt(Math.round(totalInterest))}
                      </td>
                      <td className="px-2 py-3 sm:px-4 font-extrabold" style={{ color: T.inkSoft }}>—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* FAQ */}
      <div style={{ background: T.cream, borderTop: `1px solid ${T.line}` }}>
        <Container>
          <div className="px-4 py-10 md:px-8">
            <div className="mx-auto max-w-3xl">
              <h3 className="mb-6 text-center text-lg font-bold" style={{ ...serif, color: T.ink }}>
                Frequently asked questions
              </h3>
              <div className="space-y-2.5">
                {[
                  { q: "What is EMI?", a: "EMI (Equated Monthly Installment) is a fixed amount paid every month to repay your loan. It includes both the principal repayment and the interest charged." },
                  { q: "How is EMI calculated?", a: "EMI = [P × R × (1+R)^N] / [(1+R)^N – 1] where P = Principal, R = Monthly Interest Rate, N = Tenure in months." },
                  { q: "Does prepayment reduce my EMI?", a: "Yes. Partial prepayment reduces the outstanding principal, which reduces the interest component. You can either lower your EMI or shorten your tenure." },
                  { q: "Is this calculator accurate?", a: "Our tool uses the standard reducing balance method. Actual EMI may vary slightly based on the lender's processing fee or exact disbursement date." },
                ].map(faq => (
                  <details
                    key={faq.q}
                    className="group rounded-2xl"
                    style={{ background: T.paper, border: `1px solid ${T.line}` }}
                  >
                    <summary
                      className="flex cursor-pointer select-none list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold"
                      style={{ color: T.ink }}
                    >
                      {faq.q}
                      <svg
                        className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
                        fill="none"
                        stroke={T.gold}
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
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
