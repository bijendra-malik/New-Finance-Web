// Lets a completed application submission tell the rest of the UI (the header
// chip, the applications page) to refresh its counts — same module-level Set
// pattern as signInGate.

type Handler = () => void;

const handlers = new Set<Handler>();

/** Fired after an application is saved, so counts refresh without a reload. */
export const emitApplicationSubmitted = (): void => {
  handlers.forEach((handler) => handler());
};

export const onApplicationSubmitted = (handler: Handler): (() => void) => {
  handlers.add(handler);
  return () => {
    handlers.delete(handler);
  };
};
