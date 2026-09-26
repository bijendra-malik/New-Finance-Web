import aphelion       from "../../assets/partners/aphelion-finance.jpg";
import axis           from "../../assets/partners/axis-bank.jpg";
import bajaj          from "../../assets/partners/bajaj-finserv.jpg";
import capitalFirst   from "../../assets/partners/capital-first.jpg";
import cholaman       from "../../assets/partners/cholaman.jpg";
import citibank       from "../../assets/partners/citibank.jpg";
import dcb            from "../../assets/partners/dcb.jpg";
import deutsche       from "../../assets/partners/deutsche-bank.jpg";
import dhfl           from "../../assets/partners/dhfl.jpg";
import edelweiss      from "../../assets/partners/edelweiss.jpg";
import federal        from "../../assets/partners/federal-bank.jpg";
import fullerton      from "../../assets/partners/fullerton-india-bank.jpg";
import hdb            from "../../assets/partners/HDB-financial.jpg";
import hdfcBank       from "../../assets/partners/hdfc-bank.jpg";
import hdfc           from "../../assets/partners/hdfc.jpg";
import hsbc           from "../../assets/partners/hsbc-bank.jpg";
import icici          from "../../assets/partners/icici-bank.jpg";
import idbi           from "../../assets/partners/idbi.jpg";
import indiaInfoline  from "../../assets/partners/india-infoline.jpg";
import indiabulls     from "../../assets/partners/indiabulls.jpg";
import indostar       from "../../assets/partners/indostar.jpg";
import induslnd       from "../../assets/partners/indusland-bank.jpg";
import ing            from "../../assets/partners/ing-vysya-bank.jpg";
import jana           from "../../assets/partners/jana-lakshmi.jpg";
import karvy          from "../../assets/partners/karvy-finance.jpg";
import kotak          from "../../assets/partners/kotak-mahindra-bank.jpg";
import lendingkart    from "../../assets/partners/lendingkart.jpg";
import lt             from "../../assets/partners/lt-finance.jpg";
import magma          from "../../assets/partners/magma-fincorp.jpg";
import neogrow        from "../../assets/partners/neogrow.jpg";
import pnb            from "../../assets/partners/pnb-housing.jpg";
import ratnakar       from "../../assets/partners/ratnakar-bank.jpg";
import reliance       from "../../assets/partners/reliance.jpg";
import religare       from "../../assets/partners/religare.jpg";
import shriram        from "../../assets/partners/shriram-finance.jpg";
import standard       from "../../assets/partners/standard-chartered-bank.jpg";
import sbi            from "../../assets/partners/state-bank.jpg";
import tata           from "../../assets/partners/tata-capital.jpg";

// All logos in one array
const ALL_LOGOS: { src: string; name: string }[] = [
  { src: aphelion,      name: "Aphelion Finance" },
  { src: axis,          name: "Axis Bank" },
  { src: bajaj,         name: "Bajaj Finserv" },
  { src: capitalFirst,  name: "Capital First" },
  { src: cholaman,      name: "Cholamandalam" },
  { src: citibank,      name: "Citibank" },
  { src: dcb,           name: "DCB Bank" },
  { src: deutsche,      name: "Deutsche Bank" },
  { src: dhfl,          name: "DHFL" },
  { src: edelweiss,     name: "Edelweiss" },
  { src: federal,       name: "Federal Bank" },
  { src: fullerton,     name: "Fullerton India" },
  { src: hdb,           name: "HDB Financial" },
  { src: hdfcBank,      name: "HDFC Bank" },
  { src: hdfc,          name: "HDFC" },
  { src: hsbc,          name: "HSBC Bank" },
  { src: icici,         name: "ICICI Bank" },
  { src: idbi,          name: "IDBI Bank" },
  { src: indiaInfoline, name: "India Infoline" },
  { src: indiabulls,    name: "Indiabulls" },
  { src: indostar,      name: "Indostar" },
  { src: induslnd,      name: "IndusInd Bank" },
  { src: ing,           name: "ING Vysya" },
  { src: jana,          name: "Jana Lakshmi" },
  { src: karvy,         name: "Karvy Finance" },
  { src: kotak,         name: "Kotak Mahindra" },
  { src: lendingkart,   name: "Lendingkart" },
  { src: lt,            name: "L&T Finance" },
  { src: magma,         name: "Magma Fincorp" },
  { src: neogrow,       name: "Neogrow" },
  { src: pnb,           name: "PNB Housing" },
  { src: ratnakar,      name: "Ratnakar Bank" },
  { src: reliance,      name: "Reliance" },
  { src: religare,      name: "Religare" },
  { src: shriram,       name: "Shriram Finance" },
  { src: standard,      name: "Standard Chartered" },
  { src: sbi,           name: "State Bank" },
  { src: tata,          name: "Tata Capital" },
];

// Split into two rows
const ROW1 = ALL_LOGOS.slice(0, 19);
const ROW2 = ALL_LOGOS.slice(19);

// Each row is duplicated so the loop is seamless
const LogoCard = ({ logo }: { logo: { src: string; name: string } }) => (
  <div
    className="shrink-0 flex items-center justify-center bg-white rounded-xl mx-3 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
    style={{ width: 140, height: 72, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}
    title={logo.name}
  >
    <img
      src={logo.src}
      alt={logo.name}
      width={110}
      height={52}
      loading="lazy"
      className="max-w-27.5 max-h-13 object-contain"
      draggable={false}
    />
  </div>
);

import { useRef } from "react";

// ── Animated counter hook ─────────────────────────────────────────────────────
// const useCounter = (target: number, duration = 1800, started = false) => {
//   const [count, setCount] = useState(0);
//   const raf = useRef<number | null>(null);
//   const start = useRef<number | null>(null);

//   useEffect(() => {
//     if (!started) return;
//     const animate = (ts: number) => {
//       if (!start.current) start.current = ts;
//       const progress = Math.min((ts - start.current) / duration, 1);
//       const eased = 1 - Math.pow(1 - progress, 3);
//       setCount(Math.round(eased * target));
//       if (progress < 1) raf.current = requestAnimationFrame(animate);
//     };
//     raf.current = requestAnimationFrame(animate);
//     return () => { if (raf.current) cancelAnimationFrame(raf.current); };
//   }, [started, target, duration]);

//   return count;
// };

// ── Stats config with SVG icons & descriptions ────────────────────────────────
// const STATS = [
//   {
//     target: 38,
//     suffix: "+",
//     label: "Partner Banks",
//     desc: "Trusted by India's top financial institutions",
//     color: "#0891b2",
//     icon: (
//       <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//         <path d="M3 6h18M3 12h18m-9-6v12m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     target: 500,
//     suffix: "Cr+",
//     prefix: "₹",
//     label: "Loans Disbursed",
//     desc: "Transforming lives with accessible credit",
//     color: "#059669",
//     icon: (
//       <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//         <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     target: 100,
//     suffix: "K+",
//     label: "Happy Customers",
//     desc: "Successfully empowering Indian households",
//     color: "#7c3aed",
//     icon: (
//       <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//         <path d="M12 4.354a4 4 0 110 5.292M19 12a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
// ];

const Partners = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Start counters when section enters viewport
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => { if (entry.isIntersecting) setStarted(true); },
  //     { threshold: 0.3 }
  //   );
  //   if (sectionRef.current) observer.observe(sectionRef.current);
  //   return () => observer.disconnect();
  // }, []);

  return (
    <section ref={sectionRef} className="w-full bg-slate-50 py-8 md:py-15 overflow-hidden">

      {/* ── Heading — two lines only ── */}
      <div className="text-center mb-8 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-snug">
          Trusted by India's Leading Institutions —{" "}
          <span className="bg-linear-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
            Our Business Partners
          </span>
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          43+ top banks &amp; NBFCs bringing you the best loan offers at the lowest rates
        </p>
      </div>

      {/* ── Row 1 — scrolls LEFT ── */}
      <div className="relative mb-10">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #f8fafc, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #f8fafc, transparent)" }} />
        <div className="flex" style={{ animation: "scrollLeft 40s linear infinite", width: "max-content" }}>
          {[...ROW1, ...ROW1].map((logo, i) => <LogoCard key={`r1-${i}`} logo={logo} />)}
        </div>
      </div>

      {/* ── Row 2 — scrolls RIGHT ── */}
      <div className="relative mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #f8fafc, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #f8fafc, transparent)" }} />
        <div className="flex" style={{ animation: "scrollRight 35s linear infinite", width: "max-content" }}>
          {[...ROW2, ...ROW2].map((logo, i) => <LogoCard key={`r2-${i}`} logo={logo} />)}
        </div>
      </div>

      {/* ── Stats row — 3 cards only, animated count-up with hover effects ── */}
      {/* <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pb-12">
        {STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} started={started} />
        ))}
      </div> */}

      <style>{`
        @keyframes scrollLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};

export default Partners;
