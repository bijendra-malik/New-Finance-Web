export const exposureState = (
  existingEMI: string | number,
  existingLoanAmount: string | number,
  bankSelections: (readonly string[] | undefined)[],
  loanTypeSelections: (readonly string[] | undefined)[],
) => ({
  hasExposure: parseInt(String(existingEMI)) > 0 || parseInt(String(existingLoanAmount)) > 0,
  pillBanksSelected: bankSelections.some((selected) => (selected?.length ?? 0) > 0),
  pillLoanTypesSelected: loanTypeSelections.some((selected) => (selected?.length ?? 0) > 0),
});
