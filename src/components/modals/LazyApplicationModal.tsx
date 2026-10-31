import { Suspense, lazy } from "react";
import type { ApplicationModalProps } from "./ApplicationModal";

const ApplicationModal = lazy(() => import("./ApplicationModal"));

const LazyApplicationModal = (props: ApplicationModalProps) => {
  if (!props.isOpen) return null;
  return (
    <Suspense fallback={null}>
      <ApplicationModal {...props} />
    </Suspense>
  );
};

export default LazyApplicationModal;
