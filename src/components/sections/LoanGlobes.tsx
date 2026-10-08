/** Decorative globe graphics for the loan-product cards. */
import { useState } from "react";

export const GlobeWireframe = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#dbeafe" />
    {/* Latitude lines */}
    <ellipse cx="50" cy="50" rx="46" ry="15" fill="none" stroke="#93c5fd" strokeWidth="1" />
    <ellipse cx="50" cy="50" rx="46" ry="30" fill="none" stroke="#93c5fd" strokeWidth="1" />
    <line x1="4" y1="50" x2="96" y2="50" stroke="#93c5fd" strokeWidth="1" />
    {/* Longitude lines */}
    <ellipse cx="50" cy="50" rx="17" ry="46" fill="none" stroke="#93c5fd" strokeWidth="1" />
    <ellipse cx="50" cy="50" rx="32" ry="46" fill="none" stroke="#93c5fd" strokeWidth="1" />
    <line x1="50" y1="4" x2="50" y2="96" stroke="#93c5fd" strokeWidth="1" />
    <circle cx="50" cy="50" r="46" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
  </svg>
);

// ── Earth Globe with real-looking world map (on hover) ────────────────────────
export const GlobeEarth = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="earth-clip">
        <circle cx="50" cy="50" r="46" />
      </clipPath>
    </defs>

    {/* Ocean */}
    <circle cx="50" cy="50" r="46" fill="#1a6fa8" />

    {/* Continents (real outlines, simplified & scaled to fit) */}
    <g clipPath="url(#earth-clip)" fill="#2ecc71" stroke="#27ae60" strokeWidth="0.3">

      {/* North America */}
      <path d="
        M 10 18 L 14 15 L 20 14 L 26 12 L 30 14 L 28 18
        L 32 20 L 34 24 L 30 28 L 26 32 L 24 38 L 20 42
        L 16 44 L 12 40 L 10 34 L 8 28 Z
      "/>
      {/* Central America / Caribbean bump */}
      <path d="M 20 42 L 24 44 L 22 48 L 18 46 Z"/>

      {/* South America */}
      <path d="
        M 22 50 L 28 48 L 34 50 L 36 56 L 35 64
        L 32 72 L 28 76 L 24 74 L 20 68 L 19 60
        L 20 54 Z
      "/>

      {/* Greenland */}
      <path d="M 28 6 L 34 4 L 38 6 L 36 12 L 30 13 L 27 10 Z"/>

      {/* Europe */}
      <path d="
        M 44 16 L 48 14 L 52 15 L 54 18 L 52 22
        L 50 26 L 47 27 L 44 25 L 42 21 Z
      "/>
      {/* Iberian peninsula bump */}
      <path d="M 42 24 L 44 26 L 42 29 L 40 27 Z"/>
      {/* Scandinavia */}
      <path d="M 48 12 L 52 10 L 54 14 L 51 16 L 48 15 Z"/>

      {/* Africa */}
      <path d="
        M 44 28 L 50 27 L 56 28 L 58 34 L 58 42
        L 56 50 L 54 58 L 50 64 L 46 62 L 42 54
        L 41 46 L 42 38 L 42 30 Z
      "/>

      {/* Asia (main body) */}
      <path d="
        M 54 14 L 62 12 L 70 11 L 78 13 L 84 16
        L 88 22 L 86 28 L 80 32 L 74 34 L 68 36
        L 62 38 L 56 36 L 52 32 L 52 26 L 54 20 Z
      "/>
      {/* Indian subcontinent */}
      <path d="M 64 36 L 68 38 L 68 46 L 65 50 L 62 46 L 62 38 Z"/>
      {/* Southeast Asia peninsula */}
      <path d="M 74 36 L 78 38 L 76 44 L 73 42 L 72 38 Z"/>
      {/* Japan islands */}
      <path d="M 86 24 L 89 22 L 90 26 L 87 28 Z"/>
      <path d="M 88 28 L 90 27 L 91 30 L 89 31 Z"/>

      {/* Australia */}
      <path d="
        M 76 56 L 84 54 L 90 56 L 92 62 L 90 68
        L 84 70 L 78 68 L 74 63 L 74 58 Z
      "/>
      {/* New Zealand */}
      <path d="M 92 66 L 94 64 L 95 68 L 93 70 Z"/>
      <path d="M 93 70 L 95 69 L 96 73 L 94 74 Z"/>
    </g>

    {/* Grid lines over earth */}
    <ellipse cx="50" cy="50" rx="46" ry="15" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" clipPath="url(#earth-clip)"/>
    <ellipse cx="50" cy="50" rx="46" ry="30" fill="none" stroke="rgba(253, 149, 149, 0.12)" strokeWidth="0.8" clipPath="url(#earth-clip)"/>
    <line x1="4" y1="50" x2="96" y2="50" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" clipPath="url(#earth-clip)"/>
    <ellipse cx="50" cy="50" rx="17" ry="46" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" clipPath="url(#earth-clip)"/>
    <line x1="50" y1="4" x2="50" y2="96" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" clipPath="url(#earth-clip)"/>

    {/* Subtle light sheen top-left */}
    <ellipse cx="34" cy="32" rx="14" ry="10" fill="rgba(255,255,255,0.08)" clipPath="url(#earth-clip)"/>

    {/* Border */}
    <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
  </svg>
);

// ── Colored 4-segment Ring ────────────────────────────────────────────────────
let ringCounter = 0;
export const ColoredRing = ({ colors, size = 128 }: { colors: string[]; size?: number }) => {
  const [uid] = useState(() => `ring-${++ringCounter}`);
  const [c1, c2, c3, c4] = colors;
  return (
    <>
      <svg
        viewBox="0 0 128 128"
        width={size}
        height={size}
        className="absolute inset-0 pointer-events-none color-ring-spin"
        style={{ zIndex: 2 }}
      >
        <defs>
          <mask id={uid}>
            <circle cx="64" cy="64" r="62" fill="white" />
            <circle cx="64" cy="64" r="50" fill="black" />
          </mask>
        </defs>
        <path d="M64 2 A62 62 0 0 1 126 64"  fill="none" stroke={c1} strokeWidth="13" mask={`url(#${uid})`} />
        <path d="M126 64 A62 62 0 0 1 64 126" fill="none" stroke={c2} strokeWidth="13" mask={`url(#${uid})`} />
        <path d="M64 126 A62 62 0 0 1 2 64"  fill="none" stroke={c3} strokeWidth="13" mask={`url(#${uid})`} />
        <path d="M2 64 A62 62 0 0 1 64 2"   fill="none" stroke={c4} strokeWidth="13" mask={`url(#${uid})`} />
      </svg>
      <style>{`
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .color-ring-spin {
          transform-origin: 50% 50%;
          animation: ringRotate 6s linear infinite;
        }
      `}</style>
    </>
  );
};

// ── LoanCard ──────────────────────────────────────────────────────────────────
