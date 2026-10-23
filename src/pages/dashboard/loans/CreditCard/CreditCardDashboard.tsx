import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import { CreditCardStatus } from "../../../../components/form/LoanStatusView";
import type { CreditCardApplication } from "./components/ApplicationForm";

const CreditCardDashboard = createLoanDashboard<CreditCardApplication>({
  productName: "Credit Card",
  icon: "💳",
  applicationDesc: "Fill your card details",
  Form: ApplicationForm,
  Status: CreditCardStatus,
});

export default CreditCardDashboard;
