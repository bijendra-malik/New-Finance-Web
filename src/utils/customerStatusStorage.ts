const CUSTOMER_STATUS_SEARCH_KEY = "indexia_customer_status_search";

export interface StoredCustomerStatusSearch {
  customerId?: string;
  pan?: string;
  mobile?: string;
}

export const setStoredCustomerStatusSearch = (search: StoredCustomerStatusSearch): void => {
  try {
    localStorage.setItem(CUSTOMER_STATUS_SEARCH_KEY, JSON.stringify(search));
  } catch {
    // ignore storage errors so a full browser does not break the lookup flow
  }
};

export const loadStoredCustomerStatusSearch = (): StoredCustomerStatusSearch | null => {
  try {
    const raw = localStorage.getItem(CUSTOMER_STATUS_SEARCH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCustomerStatusSearch;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    // unreadable or malformed storage: start the form empty instead of failing
    return null;
  }
};

export const clearStoredSearchCriteria = (): void => {
  try {
    localStorage.removeItem(CUSTOMER_STATUS_SEARCH_KEY);
  } catch {
    // ignore storage errors so a full browser does not break the lookup flow
  }
};
