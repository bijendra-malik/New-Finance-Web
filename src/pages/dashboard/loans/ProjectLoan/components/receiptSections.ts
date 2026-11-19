import { formatINR } from "../../../../../utils/formatters";
import { buildSuccessSections, fmtDate, resolveOther } from "../../../../../components/form/successSections";
import type { ProjectLoanApplication } from "../../../../../api/loanApplications/ProjectLoan";

export const buildProductSections = (app: ProjectLoanApplication) =>
  buildSuccessSections(app, {
    productSection: {
      title: "Project Details",
      rows: [
        { label: "Project Type", value: resolveOther(app.projectType, app.projectTypeOther) },
        { label: "Total Project Cost", value: app.totalProjectCost ? formatINR(app.totalProjectCost) : undefined },
        { label: "Own Investment", value: app.ownInvestment ? formatINR(app.ownInvestment) : undefined },
        { label: "Start Date", value: fmtDate(app.projectStartDate) },
        { label: "Completion Date", value: fmtDate(app.projectCompletionDate) },
      ],
    },

  });
