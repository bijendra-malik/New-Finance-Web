type Handler = () => void;

const handlers = new Set<Handler>();

export const emitAuthCleared = (): void => {
  handlers.forEach((handler) => handler());
};

export const onAuthCleared = (handler: Handler): (() => void) => {
  handlers.add(handler);
  return () => {
    handlers.delete(handler);
  };
};
