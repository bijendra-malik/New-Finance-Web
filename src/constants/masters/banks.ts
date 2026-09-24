// Bank master. The list is server-driven (GET /masters → data.bankNames) —
// this array is only the offline fallback when the backend has no banks seeded.
export const BANK_NAMES = [] as const;
