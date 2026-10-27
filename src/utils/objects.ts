/**
 * Narrowing helpers for the untyped JSON the API returns.
 *
 * Responses nest the useful data at different depths (`data`, `customer`,
 * `application`, …), so every reader has to prove "this is an object, not an
 * array or null" before touching a field. One guard keeps that check identical
 * everywhere instead of four slightly different copies.
 */

/** The value as a plain object, or `null` when it is null, an array or a primitive. */
export const asRecord = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
