/** Line icon per loan type, rendered through the Icon component. */
import type { ReactElement } from "react";
import { T } from "./emiCalculatorData";

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
  vehicle: (
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
  project: (
    <>
      <path d="M3 8.5 12 4l9 4.5-9 4.5z" />
      <path d="M3 13.5 12 18l9-4.5" />
    </>
  ),
  commercial: (
    <>
      <path d="M4 9V6h16v3" />
      <path d="M5 9v11h14V9" />
      <path d="M9.5 20v-5.5h5V20" />
    </>
  ),
  working: (
    <>
      <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8" />
      <path d="M20 4.5V8h-3.5" />
      <path d="M20 12a8 8 0 0 1-13.7 5.7L4 16" />
      <path d="M4 19.5V16h3.5" />
    </>
  ),
  lrd: (
    <>
      <path d="M6 3.5h8l4 4V20.5H6z" />
      <path d="M14 3.5v4h4" />
      <path d="M9 12.5h6" />
      <path d="M9 16h4" />
    </>
  ),
  gold: (
    <>
      <path d="M6.5 4h11l3 5.5-8.5 10L3.5 9.5z" />
      <path d="M3.5 9.5h17" />
      <path d="M9 4l1.4 5.5L12 4l1.6 5.5L15 4" />
    </>
  ),
  shares: (
    <>
      <path d="M4 4.5v15h15.5" />
      <path d="M7 15.5l4-4 3 3 5-6" />
      <path d="M19 8.5v-3h-3" />
    </>
  ),
};

export const Icon = ({ id, active }: { id: string; active: boolean }) => (
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
