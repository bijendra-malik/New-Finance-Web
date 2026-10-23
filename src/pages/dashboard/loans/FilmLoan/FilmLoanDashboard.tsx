import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import { FilmLoanStatus } from "../../../../components/form/LoanStatusView";
import type { FilmLoanApplication } from "./components/ApplicationForm";

const FilmLoanDashboard = createLoanDashboard<FilmLoanApplication>({
  productName: "Film Funding",
  icon: "🎬",
  applicationDesc: "Fill your funding details",
  Form: ApplicationForm,
  Status: FilmLoanStatus,
});

export default FilmLoanDashboard;
