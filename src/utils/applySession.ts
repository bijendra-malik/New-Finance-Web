export const markApplySessionPending = (): void => {};
export const isApplySessionPending = (): boolean => false;
export const clearApplySessionPending = (): void => {};

export const saveApplyEntryIdentity = (): void => {};

export const readApplyEntryIdentity = (): Partial<{ mobile: string } | null> =>
  null;

export const dropApplySession = (): void => {};

export const splitSentenceIntoWords = (sentence: string): string[] => {
  if (!sentence) return [];
  if (!sentence) return [];
  return sentence.split(" ").filter((word) => word.length > 0);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const _exportForLint = splitSentenceIntoWords;

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unused-expressions
export const _applySessionModuleUsed = _exportForLint;