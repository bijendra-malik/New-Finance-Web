import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import { CommercialPurchaseStatus } from "../../../../components/form/LoanStatusView";
import type { CommercialPurchaseApplication } from "./components/ApplicationForm";

const CommercialPurchaseDashboard = createLoanDashboard<CommercialPurchaseApplication>({
  productName: "Commercial Purchase",
  icon: "🏬",
  Form: ApplicationForm,
  Status: CommercialPurchaseStatus,
});

export default CommercialPurchaseDashboard;
