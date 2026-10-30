// modal, API interceptor, credit-score page, and submission hook storage logic
export const CREDIT_SCORE_WINDOW_MS = 24 * 60 * 60 * 1000;

export const creditScoreWindowMs = CREDIT_SCORE_WINDOW_MS;

const SUBMITTED_APPLICATIONS_KEY = "indexia_submitted_applications";
const PENDING_CREDIT_SCORE_KEY = "indexia_pending_credit_score_draft";

export type ApplicationOutcome = "eligible" | "rejected";

export interface SubmittedApplicationRecord {
  at: string;
  outcome: ApplicationOutcome;
}

export const rememberSubmittedApplication = (
  ownerId: string,
  productKey: string,
  submittedAt: string,
  outcome: ApplicationOutcome = "eligible",
): void => {
  if (!ownerId || !productKey) return;
  try {
    const raw = localStorage.getItem(SUBMITTED_APPLICATIONS_KEY);
    const map: Record<string, SubmittedApplicationRecord> = raw
      ? (JSON.parse(raw) as Record<string, SubmittedApplicationRecord>) ?? {} : {};
    if (typeof map !== "object" || Array.isArray(map)) throw new Error("stored map");
    map[`${ownerId}:${productKey}`] = { at: submittedAt, outcome };
    localStorage.setItem(SUBMITTED_APPLICATIONS_KEY, JSON.stringify(map));
  } catch {
    // ignore storage errors so a full browser does not break the apply flow
  }
};

export const readSubmittedApplication = (
  ownerId: string | null | undefined,
  productKey: string | null | undefined,
): SubmittedApplicationRecord | null => {
  if (!ownerId || !productKey) return null;
  try {
    const raw = localStorage.getItem(SUBMITTED_APPLICATIONS_KEY);
    if (!raw) return null;
    const map: unknown = JSON.parse(raw);
    if (typeof map !== "object" || Array.isArray(map) || map === null) return null;
    const entry = (map as Record<string, unknown>)[`${ownerId}:${productKey}`];
    if (typeof entry === "string" && entry) return { at: entry, outcome: "eligible" };
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
    const { at, outcome } = entry as Partial<SubmittedApplicationRecord>;
    if (typeof at !== "string" || !at) return null;
    return { at, outcome: outcome === "rejected" ? "rejected" : "eligible" };
  } catch {
    return null;
  }
};

export interface PendingCreditScoreDraft {
  ownerId: string;
  loanKey: string;
  draftId: string;
  createdAt: string;
  /** Saved form data returned to the dashboard when the customer goes back. */
  application?: Record<string, unknown>;
}

export const franchiseDraftOwner = (customerId: string): string =>
  `franchise:${customerId}`;

const draftListeners = new Set<() => void>();

export const onPendingCreditScoreDraftChange = (listener: () => void): (() => void) => {
  draftListeners.add(listener);
  return () => {
    draftListeners.delete(listener);
  };
};

const notifyDraftChange = (): void => {
  draftListeners.forEach((listener) => listener());
};

export const rememberPendingCreditScoreDraft = (
  ownerId: string,
  loanKey: string,
  draftId: string,
  createdAt: string,
  application?: Record<string, unknown>,
): void => {
  if (!ownerId || !loanKey || !draftId) return;
  try {
    localStorage.setItem(
      PENDING_CREDIT_SCORE_KEY,
      JSON.stringify({ ownerId, loanKey, draftId, createdAt, application }),
    );
    notifyDraftChange();
  } catch {
    // ignore storage errors so a full browser does not break the apply flow
  }
};

export const readPendingCreditScoreDraft = (
  ownerId: string | null | undefined,
): PendingCreditScoreDraft | null => {
  if (!ownerId) return null;
  try {
    const raw = localStorage.getItem(PENDING_CREDIT_SCORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PendingCreditScoreDraft>;
    if (typeof parsed.ownerId !== "string" || parsed.ownerId !== ownerId) return null;
    if (typeof parsed.loanKey !== "string" || !parsed.loanKey) return null;
    if (typeof parsed.draftId !== "string" || !parsed.draftId) return null;
    if (typeof parsed.createdAt !== "string" || !parsed.createdAt) return null;
    if (parsed.application !== undefined && (typeof parsed.application !== "object" || parsed.application === null || Array.isArray(parsed.application))) return null;
    return parsed as PendingCreditScoreDraft;
  } catch {
    return null;
  }
};

export const clearPendingCreditScoreDraft = (): void => {
  try {
    localStorage.removeItem(PENDING_CREDIT_SCORE_KEY);
  } catch {
    // ignore storage errors so a full browser does not break the apply flow
  }
  notifyDraftChange();
};

export const remainingCreditScoreWindow = (
  createdAt: string,
  now = Date.now(),
): { expiresAt: Date; remainingMs: number; expired: boolean } => {
  const createdMs = Date.parse(createdAt);
  if (Number.isNaN(createdMs)) {
    return { expiresAt: new Date(0), remainingMs: 0, expired: true };
  }
  const elapsed = now - createdMs;
  const remainingMs = Math.max(0, creditScoreWindowMs - elapsed);
  return {
    expiresAt: new Date(createdMs + creditScoreWindowMs),
    remainingMs,
    expired: remainingMs === 0,
  };
};
