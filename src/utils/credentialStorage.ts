export type CredentialFlow = "customer-status" | "franchise-status" | "franchisee-verification";

export interface StoredCredentials {
  fullName?: string;
  email?: string;
  mobile?: string;
  pan?: string;
  customerId?: string;
}

const keyFor = (flow: CredentialFlow) => `indexia_credentials_${flow}`;

export const readCredentials = (flow: CredentialFlow): StoredCredentials | null => {
  try {
    const raw = localStorage.getItem(keyFor(flow));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCredentials;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

/** Merge freshly typed details into the stored set and return the result. */
export const saveCredentials = (
  flow: CredentialFlow,
  patch: StoredCredentials,
): StoredCredentials => {
  const merged: StoredCredentials = { ...(readCredentials(flow) ?? {}), ...patch };
  try {
    localStorage.setItem(keyFor(flow), JSON.stringify(merged));
  } catch {
    // ignore storage errors so a full browser does not break the flow
  }
  return merged;
};

export const clearCredentials = (flow: CredentialFlow): void => {
  try {
    localStorage.removeItem(keyFor(flow));
  } catch {
    // ignore storage errors so a full browser does not break the flow
  }
};
