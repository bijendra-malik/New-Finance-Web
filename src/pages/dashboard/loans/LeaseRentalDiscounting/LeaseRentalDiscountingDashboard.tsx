import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import { LeaseRentalStatus } from "../../../../components/form/LoanStatusView";
import type { LeaseRentalApplication } from "./components/ApplicationForm";

const LeaseRentalDiscountingDashboard = createLoanDashboard<LeaseRentalApplication>({
  productName: "Lease Rental Discounting",
  icon: "📃",
  Form: ApplicationForm,
  Status: LeaseRentalStatus,
});

export default LeaseRentalDiscountingDashboard;
