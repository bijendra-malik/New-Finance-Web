// Customer-scoped state that lives in module memory (application lists, cached
// identifiers) must not survive a sign-out or a switch to another account.
// Modules that keep such state register a reset here; the auth boundary fires
// it when a session starts or ends.
type ResetHandler = () => void;

const handlers = new Set<ResetHandler>();

export const onSessionReset = (handler: ResetHandler): (() => void) => {
  handlers.add(handler);
  return () => {
    handlers.delete(handler);
  };
};

export const resetSessionCaches = (): void => {
  handlers.forEach((handler) => handler());
};
