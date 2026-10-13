import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

/**
 * The real product application forms, loaded on demand.
 *
 * The franchisor portal does not keep its own copies of the forms: it renders the
 * exact components the customer portal renders, so every field, validation, receipt
 * and future form change applies to both portals at once. Each product module is
 * split into its own chunk and only fetched when that form is opened.
 */

/** Props every product ApplicationForm accepts (the optional success callback is unused here). */
export interface ProductFormProps {
  userName?: string;
  userEmail?: string;
}

export type ProductForm = ComponentType<ProductFormProps>;

const load = <T extends object>(
  loader: () => Promise<{ default: ComponentType<T> }>,
): LazyExoticComponent<ProductForm> =>
  lazy(loader) as unknown as LazyExoticComponent<ProductForm>;

export const PRODUCT_FORMS: Readonly<Record<string, LazyExoticComponent<ProductForm>>> = {
  "personal-loan": load(() => import("../../dashboard/loans/PersonalLoan/components/ApplicationForm")),
  "business-loan": load(() => import("../../dashboard/loans/BusinessLoan/components/ApplicationForm")),
  "home-loan": load(() => import("../../dashboard/loans/HomeLoan/components/ApplicationForm")),
  "loan-against-property": load(() => import("../../dashboard/loans/LoanAgainstProperty/components/ApplicationForm")),
  "balance-transfer": load(() => import("../../dashboard/loans/BalanceTransfer/components/ApplicationForm")),
  "project-loan": load(() => import("../../dashboard/loans/ProjectLoan/components/ApplicationForm")),
  "vehicle-loan": load(() => import("../../dashboard/loans/CarLoan/components/ApplicationForm")),
  "education-loan": load(() => import("../../dashboard/loans/EducationLoan/components/ApplicationForm")),
  "credit-card": load(() => import("../../dashboard/loans/CreditCard/components/ApplicationForm")),
  "commercial-purchase": load(() => import("../../dashboard/loans/CommercialPurchase/components/ApplicationForm")),
  "working-capital": load(() => import("../../dashboard/loans/WorkingCapital/components/ApplicationForm")),
  "lease-rental-discounting": load(() => import("../../dashboard/loans/LeaseRentalDiscounting/components/ApplicationForm")),
  "od-cc-limit": load(() => import("../../dashboard/loans/ODCCLimit/components/ApplicationForm")),
  "loan-against-share": load(() => import("../../dashboard/loans/LoanAgainstShare/components/ApplicationForm")),
  "film-funding": load(() => import("../../dashboard/loans/FilmLoan/components/ApplicationForm")),
  npa: load(() => import("../../dashboard/loans/NPA/components/ApplicationForm")),
  "gold-loan": load(() => import("../../dashboard/loans/GoldLoan/components/ApplicationForm")),
  fdi: load(() => import("../../dashboard/loans/FDI/components/ApplicationForm")),
};
