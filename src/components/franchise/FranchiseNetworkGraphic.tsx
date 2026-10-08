/**
 * Hero graphic — a franchise partner desk in the middle, customers on the left,
 * bank / NBFC partners on the right. Pure SVG so it scales with the container.
 */

const Card = ({
  x, y, w, h, label, sub, accent,
}: { x: number; y: number; w: number; h: number; label: string; sub: string; accent: string }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="12" fill="rgba(255,255,255,0.94)" />
    <rect x={x} y={y} width="3.5" height={h} rx="1.75" fill={accent} />
    <text x={x + 16} y={y + 23} fontSize="11.5" fontWeight="700" fill="#1e293b">{label}</text>
    <text x={x + 16} y={y + 39} fontSize="9.5" fontWeight="600" fill="#94a3b8">{sub}</text>
  </g>
);

const FranchiseNetworkGraphic = () => (
  <svg
    viewBox="0 0 460 340"
    className="w-full max-w-130"
    role="img"
    aria-label="A franchise partner desk receiving customer leads and placing them with partner banks and NBFCs"
  >
    <defs>
      <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#26ae90" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#26ae90" />
      </linearGradient>
      <linearGradient id="lineOut" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#4fa3d1" />
        <stop offset="100%" stopColor="#4fa3d1" stopOpacity="0.25" />
      </linearGradient>
      <style>{`
        .fx-flow { animation: fxFlow 1.6s linear infinite; }
        @keyframes fxFlow { to { stroke-dashoffset: -24; } }
        @media (prefers-reduced-motion: reduce) { .fx-flow { animation: none; } }
      `}</style>
    </defs>

    {/* Connectors — customers in, partners out */}
    <g fill="none" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round">
      <path className="fx-flow" d="M122 80 C 148 80, 152 132, 166 150" stroke="url(#line)" />
      <path className="fx-flow" d="M122 248 C 148 248, 152 205, 166 190" stroke="url(#line)" />
      <path className="fx-flow" d="M294 150 C 308 132, 312 80, 338 80" stroke="url(#lineOut)" />
      <path className="fx-flow" d="M294 190 C 308 205, 312 248, 338 248" stroke="url(#lineOut)" />
    </g>

    {/* Customers */}
    <Card x={8} y={54} w={114} h={52} label="Customer Lead" sub="Personal · Business" accent="#26ae90" />
    <Card x={8} y={222} w={114} h={52} label="Customer Lead" sub="Home · Secured" accent="#26ae90" />

    {/* Bank / NBFC partners */}
    <Card x={338} y={54} w={114} h={52} label="Partner Bank" sub="Credit policy applies" accent="#1b6ca8" />
    <Card x={338} y={222} w={114} h={52} label="Partner NBFC" sub="Credit policy applies" accent="#1b6ca8" />

    {/* Hub — the franchise partner */}
    <g>
      <rect x="163" y="130" width="134" height="80" rx="16" fill="#ffffff" />
      <rect x="163" y="130" width="134" height="80" rx="16" fill="none" stroke="#26ae90" strokeWidth="2" />
      <circle cx="230" cy="156" r="13" fill="#26ae90" />
      <path d="M224.5 156.5l3.4 3.4 7-7.6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <text x="230" y="184" fontSize="12" fontWeight="800" textAnchor="middle" fill="#0f172a">Franchise Partner</text>
      <text x="230" y="199" fontSize="9" fontWeight="600" textAnchor="middle" fill="#94a3b8">Indexia Finance desk</text>
    </g>

    {/* Payout badge */}
    <g>
      <rect x="168" y="226" width="124" height="30" rx="15" fill="rgba(242,242,49,0.16)" stroke="rgba(242,242,49,0.55)" />
      <text x="230" y="245" fontSize="11" fontWeight="800" textAnchor="middle" fill="#f2f231">
        Revenue share on payout
      </text>
    </g>
  </svg>
);

export default FranchiseNetworkGraphic;
