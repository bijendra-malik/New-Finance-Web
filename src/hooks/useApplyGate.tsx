import { useCallback, useEffect, useState } from "react";
import ApplicationModal from "../components/modals/ApplicationModal";
import { readStoredProfile } from "../utils/accountProfile";
import { consumePendingProduct, onAccountReady, requestSignUp } from "../utils/signInGate";

export const useApplyGate = () => {
  const [productName, setProductName] = useState<string | null>(null);

  useEffect(
    () =>
      onAccountReady(() => {
        const pending = consumePendingProduct();
        if (pending) setProductName(pending);
      }),
    []
  );

  const requestApply = useCallback((product: string) => {
    if (!readStoredProfile()) {
      requestSignUp(product);
      return;
    }
    setProductName(product);
  }, []);

  const close = useCallback(() => setProductName(null), []);

  const gate = (
    <ApplicationModal
      isOpen={!!productName}
      onClose={close}
      productName={productName ?? "Personal Loan"}
    />
  );

  return { requestApply, close, gate };
};