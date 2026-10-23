import type { ComponentType } from "react";
import DashboardShell from "./DashboardShell";

export interface LoanDashboardFormProps<T> {
  userName?: string;
  userEmail?: string;
  onSubmit?: (id: string, app: T) => void;
}

export interface LoanDashboardStatusProps<T> {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: T | null;
}

export interface LoanDashboardConfig<T> {
  productName: string;
  icon: string;
  applicationDesc?: string;
  Form: ComponentType<LoanDashboardFormProps<T>>;
  Status: ComponentType<LoanDashboardStatusProps<T>>;
}

export const createLoanDashboard = <T,>({
  productName,
  icon,
  applicationDesc,
  Form,
  Status,
}: LoanDashboardConfig<T>) => {
  const LoanDashboard = () => (
    <DashboardShell<T>
      productName={productName}
      icon={icon}
      applicationDesc={applicationDesc}
      renderForm={({ userName, userEmail, onSubmit }) => (
        <Form userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
      )}
      renderStatus={({ applicationId, isSubmitted, submittedApp }) => (
        <Status
          applicationId={applicationId}
          isSubmitted={isSubmitted}
          submittedApp={submittedApp}
        />
      )}
    />
  );

  return LoanDashboard;
};
