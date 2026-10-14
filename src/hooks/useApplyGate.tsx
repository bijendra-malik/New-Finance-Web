import { useCallback, useState } from "react";
import ApplicationModal from "../components/modals/ApplicationModal";
import { products } from "../components/sections/productDetailsData";
export const useApplyAccess = () => ({ blocked: false as const, reason: "unauthenticated" as const });

const productLabelById = (id: string) => products.find((p) => p.id === id)?.label ?? id;

export const useApplyGate = () => {
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const requestApply = useCallback(
    (productId: string) => {
      setActiveProductId(productId);
    },
    [],
  );

  const close = useCallback(() => {
    setActiveProductId(null);
  }, []);

  const gate = (
    <>
      <ApplicationModal
        isOpen={!!activeProductId}
        onClose={close}
        productName={activeProductId ? productLabelById(activeProductId) : "Loan application"}
        activeProduct={activeProductId ? { id: activeProductId} : null}
      />
    </>
  );

  return { requestApply, close, gate };
};
