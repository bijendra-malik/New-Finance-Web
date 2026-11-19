import { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { cx } from "./cx";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  maxWidth?: string;
}

const Modal = ({ open, onClose, labelledBy, children, maxWidth = "max-w-lg" }: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useBodyScrollLock(open);

  if (!open) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-sm"
        style={{ zIndex: "var(--z-backdrop)" }}
        onClick={onClose}
      />

      <div
        className="fixed inset-0 flex items-start justify-center overflow-y-auto p-3 sm:items-center sm:p-4"
        style={{ zIndex: "var(--z-modal)" }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          className={cx(
            "relative flex max-h-[92vh] w-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl",
            maxWidth,
          )}
        >
          {children}
        </div>
      </div>
    </>,
    document.body,
  );
};

export default Modal;
