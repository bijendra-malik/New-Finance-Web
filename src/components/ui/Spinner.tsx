const SIZES = { 14: "w-3.5 h-3.5", 16: "w-4 h-4", 20: "w-5 h-5" } as const;

/** Inline CSS spinner sized for buttons and small loading states. */
const Spinner = ({ size = 16, className = "" }: { size?: 14 | 16 | 20; className?: string }) => (
  <svg className={`${SIZES[size]} animate-spin shrink-0 ${className}`} fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

export default Spinner;
