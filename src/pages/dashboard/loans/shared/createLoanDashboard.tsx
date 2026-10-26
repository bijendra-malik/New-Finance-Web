import type { ComponentType } from "react";
import DashboardShell from "./DashboardShell";

export interface LoanDashboardFormProps<T> {
  userName?: string;
  userEmail?: string;
  onSubmit?: (id: string, app: T) => void;
}

export interface LoanDashboardConfig<T> {
  productName: string;
  icon: string;
  applicationDesc?: string;
  Form: ComponentType<LoanDashboardFormProps<T>>;
}

export const createLoanDashboard = <T,>({
  productName,
  icon,
  applicationDesc,
  Form,
}: LoanDashboardConfig<T>) => {
  const LoanDashboard = () => (
    <DashboardShell<T>
      productName={productName}
      icon={icon}
      applicationDesc={applicationDesc}
      renderForm={({ userName, userEmail, onSubmit }) => (
        <Form userName={userName} userEmail={userEmail} onSubmit={onSubmit} />
      )}
    />
  );

  return LoanDashboard;
};
