// An "apply session" is the token a signed-out visitor gets while they file one
// application. It is disposable: leaving the dashboard without submitting must
// drop it, so a half-finished session never keeps holding a token.
//
// The pending flag lives in sessionStorage (per tab, cleared on tab close)
// because it only describes the current apply flow.
const APPLY_SESSION_PENDING_KEY = "indexia_apply_session_pending";

export const markApplySessionPending = (): void => {
  try {
    sessionStorage.setItem(APPLY_SESSION_PENDING_KEY, "1");
  } catch {
    // ignore storage errors so a full browser does not break the apply flow
  }
};

export const isApplySessionPending = (): boolean => {
  try {
    return sessionStorage.getItem(APPLY_SESSION_PENDING_KEY) === "1";
  } catch {
    return false;
  }
};

export const clearApplySessionPending = (): void => {
  try {
    sessionStorage.removeItem(APPLY_SESSION_PENDING_KEY);
  } catch {
    // ignore storage errors so a full browser does not break the apply flow
  }
};

/**
 * Drop the disposable apply session. The caller signs out separately, which is
 * what removes the token and user record.
 */
export const dropApplySession = (): void => {
  clearApplySessionPending();
};

// ── Draft application ─────────────────────────────────────────────────────────
//
// POST /auth/:loanKey opens a draft application for the product and hands back
// its id. POST /customer/loan-apply then "takes" that draftId and
// POST /customer/credit-score is sent with it, so the backend keeps every step
// on the same draft. Keyed by the canonical LOAN_SLUGS key, which is exactly
// the `product` field the loan-apply payload carries; a re-register for the
// same product simply replaces the entry.
const APPLY_DRAFTS_KEY = "indexia_apply_drafts";

interface ApplyDrafts {
  byProduct: Record<string, string>;
  lastProduct: string | null;
}

const readDrafts = (): ApplyDrafts => {
  try {
    const raw = sessionStorage.getItem(APPLY_DRAFTS_KEY);
    if (!raw) return { byProduct: {}, lastProduct: null };
    const parsed = JSON.parse(raw) as Partial<ApplyDrafts>;
    return {
      byProduct:
        parsed.byProduct && typeof parsed.byProduct === "object"
          ? parsed.byProduct
          : {},
      lastProduct:
        typeof parsed.lastProduct === "string" ? parsed.lastProduct : null,
    };
  } catch {
    return { byProduct: {}, lastProduct: null };
  }
};

const writeDrafts = (drafts: ApplyDrafts): void => {
  try {
    sessionStorage.setItem(APPLY_DRAFTS_KEY, JSON.stringify(drafts));
  } catch {
    // ignore storage errors so a full browser does not break the apply flow
  }
};

export const rememberDraftId = (loanKey: string, draftId: string): void => {
  const drafts = readDrafts();
  drafts.byProduct[loanKey] = draftId;
  drafts.lastProduct = loanKey;
  writeDrafts(drafts);
};

/**
 * The draft id for a product. Called without a key (or with a label that maps
 * to no product) it returns the most recently registered draft, which is the
 * one belonging to the flow the customer is in.
 */
export const getDraftId = (loanKey?: string | null): string | null => {
  const drafts = readDrafts();
  const key = loanKey ?? drafts.lastProduct;
  if (!key) return null;
  const id = drafts.byProduct[key];
  return typeof id === "string" && id ? id : null;
};
