import { createLoanDashboard } from "../shared/createLoanDashboard";
import ApplicationForm from "./components/ApplicationForm";
import type { FilmLoanApplication } from "./components/ApplicationForm";

const FilmLoanDashboard = createLoanDashboard<FilmLoanApplication>({
  productName: "Film Funding",
  icon: "🎬",
  applicationDesc: "Fill your funding details",
  Form: ApplicationForm,
});

export default FilmLoanDashboard;
