import { useCallback, useEffect, useMemo, useState } from "react";
import ApplicationModal from "../components/modals/ApplicationModal";
import { readStoredProfile } from "../utils/accountProfile";
import { consumePendingProduct, onAccountReady, requestSignUp } from "../utils/signInGate";
import { useAuth } from "../context/authContext";
import type { Role } from "../utils/accountProfile";

export const useApplyAccess = () => {
  const profile = readStoredProfile();
  const { user } = useAuth();
  return useMemo(
    () => {
      const roleFromAuth = user && user.role === "Customer" || user && user.role === "Franchise" ? user.role : undefined;
      const roleFromGate = profile?.role;
      let role: Role | undefined;
      if (roleFromAuth) {
        role = roleFromAuth;
      } else if (roleFromGate) {
        role = roleFromGate;
      }
      if (role === "Franchise") return { blocked: true, reason: "franchise", role };
      if (role === "Customer") return { blocked: false, reason: "customer", role };
      return { blocked: false, reason: "unauthenticated", role };
    },
    [profile, user],
  );
};

export const useApplyGate = () => {
  const [productName, setProductName] = useState<string | null>(null);
  const access = useApplyAccess();

  useEffect(
    () =>
      onAccountReady(() => {
        const pending = consumePendingProduct();
        if (pending) setProductName(pending);
      }),
    []
  );

  const [blockedToast, setBlockedToast] = useState<{ message: string } | null>(null);

  const requestApply = useCallback(
    (product: string) => {
      if (access.blocked && access.reason === "franchise") {
        setBlockedToast({ message: "Loan applications are for Customer accounts. As a Franchise partner, use the Franchise menu to apply or sign in to the portal." });
        setTimeout(() => setBlockedToast(null), 5000);
        return;
      }
      if (!readStoredProfile() && !useAuth().isLoggedIn) {
        requestSignUp(product);
        return;
      }
      setProductName(product);
    },
    [access],
  );

  const close = useCallback(() => {
    setProductName(null);
    setBlockedToast(null);
  }, []);

  const gate = (
    <>
      {blockedToast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-120 w-[calc(100%-2rem)] max-w-lg rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-[13px] leading-relaxed text-amber-800 shadow-lg ring-1 ring-amber-200/60"
        >
          <div className="flex items-start gap-2.5">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="min-w-0">
              <p className="font-semibold">Access restricted</p>
              <p className="mt-0.5 text-amber-700">{blockedToast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setBlockedToast(null)}
              className="shrink-0 rounded-lg px-1.5 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      <ApplicationModal
        isOpen={!!productName && productName !== "__apply_blocked__"}
        onClose={close}
        productName={productName ?? "Personal Loan"}
      />
    </>
  );

  return { requestApply, close, gate };
};