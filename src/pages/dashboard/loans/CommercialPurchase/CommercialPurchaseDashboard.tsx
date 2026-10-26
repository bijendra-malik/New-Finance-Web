import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import type { CommercialPurchaseApplication } from "./components/ApplicationForm";

const CommercialPurchaseDashboard = createLoanDashboard<CommercialPurchaseApplication>({
  productName: "Commercial Purchase",
  icon: "🏬",
  Form: ApplicationForm,
});

export default CommercialPurchaseDashboard;
