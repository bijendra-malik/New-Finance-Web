import { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { cx } from "./cx";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** id of the element that labels the dialog. */
  labelledBy: string;
  children: ReactNode;
  /** Tailwind max-width class for the panel. */
  maxWidth?: string;
}

/**
 * Portal-rendered dialog with backdrop, Escape handling and body scroll lock.
 * Portalled to <body> so an ancestor stacking context can't trap it under the header.
 */
const Modal = ({ open, onClose, labelledBy, children, maxWidth = "max-w-lg" }: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-90 bg-black/55 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-110 flex items-start justify-center overflow-y-auto p-3 sm:items-center sm:p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          className={cx(
            "relative flex w-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[92vh]",
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
