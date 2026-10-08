/**
 * Builds a mailto: URL with a pre-filled subject and body.
 * Used by the franchise forms, which have no backend endpoint to post to.
 */
export const buildMailtoUrl = (
  to: string,
  subject: string,
  rows: ReadonlyArray<{ label: string; value: string }>,
): string => {
  const body = rows.map(r => `${r.label}: ${r.value}`).join("\r\n");
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
