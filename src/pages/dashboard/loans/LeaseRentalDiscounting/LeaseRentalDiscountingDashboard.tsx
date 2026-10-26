import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import type { LeaseRentalApplication } from "./components/ApplicationForm";

const LeaseRentalDiscountingDashboard = createLoanDashboard<LeaseRentalApplication>({
  productName: "Lease Rental Discounting",
  icon: "📃",
  Form: ApplicationForm,
});

export default LeaseRentalDiscountingDashboard;
