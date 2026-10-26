import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import type { VehicleLoanApplication } from "./components/ApplicationForm";

const VehicleLoanDashboard = createLoanDashboard<VehicleLoanApplication>({
  productName: "Vehicle Loan",
  icon: "🚗",
  Form: ApplicationForm,
});

export default VehicleLoanDashboard;
