import { buildSuccessSections, fmtDate } from "../../../../../components/form/successSections";
import type { ProjectLoanApplication } from "./ApplicationForm";

export const buildProductSections = (app: ProjectLoanApplication) =>
  buildSuccessSections(app, {
    productSection: {
      title: "Project Details",
      rows: [
        { label: "Project Type", value: app.projectType },
        { label: "Total Project Cost", value: app.totalProjectCost ? `₹${app.totalProjectCost.toLocaleString("en-IN")}` : undefined },
        { label: "Own Investment", value: app.ownInvestment ? `₹${app.ownInvestment.toLocaleString("en-IN")}` : undefined },
        { label: "Start Date", value: fmtDate(app.projectStartDate) },
        { label: "Completion Date", value: fmtDate(app.projectCompletionDate) },
      ],
    },

  });
