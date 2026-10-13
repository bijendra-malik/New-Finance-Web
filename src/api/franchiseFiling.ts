import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// ── File scope ───────────────────────────────────────────────────────────────

export interface FranchiseFiling {
  customerId: string;
  productKey: string;
  slug: string;
  identity: {
    fullName?: string;
    mobile?: string;
    email?: string;
  };
}

let active: FranchiseFiling | null = null;

export const beginFranchiseFiling = (filing: FranchiseFiling): void => {
  active = filing;
};

export const endFranchiseFiling = (): void => {
  active = null;
};

export const readFranchiseFiling = (): FranchiseFiling | null => active;

// ── Product apply paths ──────────────────────────────────────────────────────

const APPLY_PATHS: Readonly<Record<string, string>> = {
  "/personal-loan/apply": "personal-loan",
  "/business-loan/apply": "business-loan",
  "/home-loan/apply": "home-loan",
  "/loan-against-property/apply": "loan-against-property",
  "/balance-transfer/apply": "balance-transfer",
  "/project-loan/apply": "project-loan",
  "/car-loan/apply": "vehicle-loan",
  "/education-loan/apply": "education-loan",
  "/credit-card/apply": "credit-card",
  "/commercial-purchase/apply": "commercial-purchase",
  "/working-capital/apply": "working-capital",
  "/lease-rental-discounting/apply": "lease-rental-discounting",
  "/od-cc-limit/apply": "od-cc-limit",
  "/loan-against-share/apply": "loan-against-share",
  "/film-funding/apply": "film-funding",
  "/npa/apply": "npa",
  "/gold-loan/apply": "gold-loan",
  "/fdi/apply": "fdi",
};

export const productKeyForApplyPath = (url: string): string | null =>
  APPLY_PATHS[url.split("?")[0].replace(/\/+$/, "")] ?? null;

// ── Request rewrite ──────────────────────────────────────────────────────────

const filingsByRequest = new WeakMap<InternalAxiosRequestConfig, FranchiseFiling>();

export const wasFranchiseFiling = (
  config?: InternalAxiosRequestConfig,
): boolean => Boolean(config && filingsByRequest.has(config));

export const franchiseApplyRequestInterceptor = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const filing = readFranchiseFiling();
  if (!filing) return config;
  if ((config.method ?? "get").toLowerCase() !== "post") return config;

  const url = config.url ?? "";
  if (url.startsWith("/franchise/")) return config;

  const productKey = productKeyForApplyPath(url);
  if (productKey !== filing.productKey) return config;

  const payload =
    config.data && typeof config.data === "object"
      ? { ...(config.data as Record<string, unknown>) }
      : {};
  payload.franchiseCustomerId = filing.customerId;

  config.url = `/franchise/customer/${filing.slug}/applyloan`;
  config.data = payload;
  filingsByRequest.set(config, filing);
  return config;
};

// ── Response handling ────────────────────────────────────────────────────────

/**
 * Keep the receipt coherent. The product forms render their success view from the
 * returned application (`_id`, `createdAt`, and the applicant's identity), and the
 * franchise endpoint's document may omit some of those — so the client's
 * registered identity is used as the fallback wherever the response is silent.
 */
export const franchiseApplyResponseInterceptor = (response: AxiosResponse): AxiosResponse => {
  const filing = filingsByRequest.get(response.config);
  if (!filing) return response;

  const body = response.data as { data?: unknown } | undefined;
  const data = body?.data;
  if (!data || typeof data !== "object") return response;

  const app = data as Record<string, unknown>;
  response.data = {
    ...body,
    data: {
      ...filing.identity,
      ...app,
      _id: String(app._id ?? app.applicationNo ?? ""),
      createdAt: typeof app.createdAt === "string" ? app.createdAt : new Date().toISOString(),
    },
  };
  return response;
};

/**
 * Turn franchise failures into the same messages the rest of the portal uses.
 * `getApiErrorMessage` (used by the form's submit hook) reads
 * `error.response.data.message`, so the mapped text is written there.
 */
export const franchiseApplyErrorInterceptor = (error: AxiosError): Promise<never> => {
  const config = error.config as InternalAxiosRequestConfig | undefined;
  if (wasFranchiseFiling(config)) {
    const status = error.response?.status;
    const data = error.response?.data;
    const reported =
      data && typeof data === "object" && typeof (data as { message?: unknown }).message === "string"
        ? ((data as { message: string }).message).trim()
        : "";

    if (!reported) {
      const message =
        status === 401
          ? "Your franchise session expired. Sign in again and try submitting."
          : status === 403
            ? "This franchise account is not permitted to submit applications right now."
            : status
              ? `The franchise service responded with an error (${status}).`
              : "Could not reach the franchise service. Check your connection and try again.";
      if (error.response) {
        error.response.data = {
          ...(data && typeof data === "object" ? data : {}),
          message,
        };
      } else {
        error.message = message;
      }
    }
  }
  return Promise.reject(error);
};
