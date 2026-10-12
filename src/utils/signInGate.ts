type Handler = () => void;

const openHandlers = new Set<Handler>();
const completeHandlers = new Set<Handler>();

/** Product id from productDetailsData.tsx that triggered the panel, consumed by the first taker. */
let pendingProduct = "";

/** Ask the header's account panel to open, remembering the product id clicked. */
export const requestSignUp = (productId = ""): void => {
  pendingProduct = productId;
  openHandlers.forEach((handler) => handler());
};

/**
 * Fired by AccountMenu once the visitor has an account — whether they just
 * signed up or signed back in — so a gated "Apply Now" can carry on.
 */
export const emitAccountReady = (): void => {
  completeHandlers.forEach((handler) => handler());
};

/** Take the product id that opened the panel ("" when there was none). */
export const consumePendingProduct = (): string => {
  const product = pendingProduct;
  pendingProduct = "";
  return product;
};

export const onSignUpRequested = (handler: Handler): (() => void) => {
  openHandlers.add(handler);
  return () => {
    openHandlers.delete(handler);
  };
};

export const onAccountReady = (handler: Handler): (() => void) => {
  completeHandlers.add(handler);
  return () => {
    completeHandlers.delete(handler);
  };
};