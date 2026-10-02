import { buildSuccessSections, resolveOther } from "../../../../../components/form/successSections";
import type { FilmLoanApplication } from "./ApplicationForm";

export const buildProductSections = (app: FilmLoanApplication) =>
  buildSuccessSections(app, {
    productSection: {
      title: "Film Details",
      rows: [
        { label: "Film Category", value: resolveOther(app.filmComesUnder, app.filmComesUnderOther) },
        { label: "Languages", value: app.filmLanguages?.length ? app.filmLanguages.join(", ") : undefined },
        { label: "Star Cast", value: app.starCastNames?.length ? app.starCastNames.join(", ") : undefined },
        { label: "Total Project Cost", value: app.totalProjectCost ? `₹${app.totalProjectCost.toLocaleString("en-IN")}` : undefined },
        { label: "Own Investment", value: app.ownInvestmentAmount ? `₹${app.ownInvestmentAmount.toLocaleString("en-IN")}` : undefined },
      ],
    },

  });
