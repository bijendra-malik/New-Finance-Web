import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import type { CreditCardApplication } from "./components/ApplicationForm";

const CreditCardDashboard = createLoanDashboard<CreditCardApplication>({
  productName: "Credit Card",
  icon: "💳",
  applicationDesc: "Fill your card details",
  Form: ApplicationForm,
});

export default CreditCardDashboard;
