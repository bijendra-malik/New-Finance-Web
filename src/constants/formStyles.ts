export const FORM = {
  // ── Backgrounds / colours ────────────────────────────────────────────────
  /** Dashboard backdrop behind the form column. */
  pageBg: "var(--form-page-bg)",
  /** FormCard / receipt surfaces. */
  cardBg: "var(--form-card-bg)",
  /** Inputs, selects, date fields. */
  fieldBg: "var(--form-field-bg)",
  fieldBgDisabled: "var(--form-field-bg-disabled)",
  fieldBorder: "var(--form-field-border)",
  fieldBorderStrong: "var(--form-field-border-strong)",
  /** Error borders / accents. */
  error: "var(--form-error)",
  /** API-error banner. */
  errorBg: "var(--form-error-bg)",
  errorBorder: "var(--form-error-border)",
  errorText: "var(--form-error-text)",
  /** Receipt row dividers. */
  divider: "var(--form-divider)",
  /** Receipt at-a-glance strip. */
  subtleBg: "var(--form-subtle-bg)",

  // ── Sizing ───────────────────────────────────────────────────────────────
  /** Form column width — replaces `max-w-4xl`. */
  maxWidth: "max-w-(--form-max-w)",
  /** Standard two-column field grid — replaces `grid grid-cols-1 md:grid-cols-2 gap-5`. */
  grid: "grid grid-cols-1 md:grid-cols-2 gap-(--form-gap)",
  /** Shared input/select/date-field box — padding, radius, base text size. */
  field: "w-full px-(--form-field-pad-x) py-(--form-field-pad-y) rounded-(--form-field-radius) text-sm transition-all focus:outline-none",
} as const;
