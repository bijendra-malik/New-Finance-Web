import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import { VehicleLoanStatus } from "../../../../components/form/LoanStatusView";
import type { VehicleLoanApplication } from "./components/ApplicationForm";

const VehicleLoanDashboard = createLoanDashboard<VehicleLoanApplication>({
  productName: "Vehicle Loan",
  icon: "🚗",
  Form: ApplicationForm,
  Status: VehicleLoanStatus,
});

export default VehicleLoanDashboard;
