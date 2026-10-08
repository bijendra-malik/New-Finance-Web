/**
 * Line-icon set for the Franchise Opportunity page. One component, selected by name,
 * so content modules stay free of JSX and the react-refresh rule stays satisfied.
 */

export type FranchiseIconName =
  | "network" | "products" | "share" | "plans" | "opportunity" | "support" | "digital" | "scale"
  | "join" | "lead" | "process"
  | "unsecured" | "secured"
  | "check" | "shield" | "rupee" | "clock" | "doc" | "lock" | "mail" | "phone" | "user" | "handshake";

const PATHS: Record<FranchiseIconName, React.ReactNode> = {
  network: (
    <>
      <path d="M12 3v6M6 21v-5M18 21v-5" />
      <circle cx="12" cy="4" r="2" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
      <path d="M12 9v4M12 13 7.5 16M12 13l4.5 3" />
    </>
  ),
  products: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12h18" />
    </>
  ),
  share: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" />
      <path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" stroke="none" opacity="0.28" />
    </>
  ),
  plans: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h8M8 13h5M8 17h3" />
    </>
  ),
  opportunity: (
    <>
      <path d="M4 20V10l8-6 8 6v10" />
      <path d="M9 20v-6h6v6" />
      <path d="M12 8.5v.01" />
    </>
  ),
  support: (
    <>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <path d="M4 13v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2zM20 13v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z" />
      <path d="M17 18v1a2 2 0 0 1-2 2h-2" />
    </>
  ),
  digital: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M7 12l2.5-2.5L12 12l4-4" />
    </>
  ),
  scale: (
    <>
      <path d="M4 20V6M4 20h16" />
      <path d="M8 20v-6M13 20v-10M18 20v-4" />
    </>
  ),
  join: (
    <>
      <circle cx="10" cy="8" r="3.4" />
      <path d="M3.5 20c1-4 3.4-5.8 6.5-5.8 1.4 0 2.6.3 3.6.9" />
      <path d="M15 18l2 2 4-4" />
    </>
  ),
  lead: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c1-4 3.2-5.6 6-5.6s5 1.6 6 5.6" />
      <path d="M18 6v6M15 9h6" />
    </>
  ),
  process: (
    <>
      <path d="M4 7h9M4 12h16M4 17h9" />
      <circle cx="17" cy="7" r="2" />
      <circle cx="17" cy="17" r="2" />
    </>
  ),
  unsecured: (
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M15 3v4h4" />
      <path d="M10 13h4M12 11v4" />
    </>
  ),
  secured: (
    <>
      <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6z" />
      <path d="M9.5 12.2l1.8 1.8 3.4-3.6" />
    </>
  ),
  check: <path d="M5 13l4 4L19 7" strokeWidth="2.6" />,
  shield: (
    <>
      <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6z" />
      <path d="M12 9v4M12 16v.01" />
    </>
  ),
  rupee: (
    <>
      <path d="M7 5h10M7 9h10" />
      <path d="M14 5c0 4-2.6 4-6 4l5.5 10" />
      <path d="M8 9s3 0 5 1" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h4" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </>
  ),
  phone: (
    <>
      <path d="M6 3.5h3l1.5 4-2 1.4a11 11 0 0 0 5.6 5.6l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 5.7 2 2 0 0 1 6 3.5z" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.4" />
      <path d="M5 20c1.1-4.1 3.8-6 7-6s5.9 1.9 7 6" />
    </>
  ),
  handshake: (
    <>
      <path d="M3 12l3-3 3 2 3-2 3 2 3-2 3 3" />
      <path d="M6 9v5l3 3 3-3 3 3 3-3V9" />
    </>
  ),
};

const FranchiseIcon = ({
  name,
  className = "h-5 w-5",
  strokeWidth = 1.7,
  filled = false,
}: {
  name: FranchiseIconName;
  className?: string;
  strokeWidth?: number;
  /** White strokes for use on a brand gradient tile. */
  filled?: boolean;
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={filled ? "#fff" : "currentColor"}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {PATHS[name]}
  </svg>
);

export default FranchiseIcon;
