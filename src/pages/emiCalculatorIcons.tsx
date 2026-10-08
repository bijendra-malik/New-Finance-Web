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
