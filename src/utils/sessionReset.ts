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
