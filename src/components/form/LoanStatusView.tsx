import ApplicationDetails from "../../pages/dashboard/loans/shared/ApplicationDetails";
import LoanStatusShell from "../../pages/dashboard/loans/shared/LoanStatusShell";
import type { SuccessSection } from "./successSections";
import {
  fetchPersonalLoanApplications, fetchBusinessLoanApplications, fetchHomeLoanApplications,
  fetchBalanceTransferApplications, fetchCarLoanApplications, fetchCommercialPurchaseApplications,
  fetchCreditCardApplications, fetchEducationLoanApplications, fetchFDIApplications,
  fetchFilmLoanApplications, fetchGoldLoanApplications, fetchLeaseRentalApplications,
  fetchLoanAgainstPropertyApplications, fetchLoanAgainstShareApplications, fetchNPAApplications,
  fetchODCCLimitApplications, fetchProjectLoanApplications, fetchWorkingCapitalApplications,
} from "../../api/loanApplications";
import * as personalReceipts from "../../pages/dashboard/loans/PersonalLoan/components/receiptSections";
import * as businessReceipts from "../../pages/dashboard/loans/BusinessLoan/components/receiptSections";
import * as homeReceipts from "../../pages/dashboard/loans/HomeLoan/components/receiptSections";
import * as balanceTransferReceipts from "../../pages/dashboard/loans/BalanceTransfer/components/receiptSections";
import * as carReceipts from "../../pages/dashboard/loans/CarLoan/components/receiptSections";
import * as commercialPurchaseReceipts from "../../pages/dashboard/loans/CommercialPurchase/components/receiptSections";
import * as creditCardReceipts from "../../pages/dashboard/loans/CreditCard/components/receiptSections";
import * as educationReceipts from "../../pages/dashboard/loans/EducationLoan/components/receiptSections";
import * as fdiReceipts from "../../pages/dashboard/loans/FDI/components/receiptSections";
import * as filmReceipts from "../../pages/dashboard/loans/FilmLoan/components/receiptSections";
import * as goldReceipts from "../../pages/dashboard/loans/GoldLoan/components/receiptSections";
import * as leaseRentalReceipts from "../../pages/dashboard/loans/LeaseRentalDiscounting/components/receiptSections";
import * as loanAgainstPropertyReceipts from "../../pages/dashboard/loans/LoanAgainstProperty/components/receiptSections";
import * as loanAgainstShareReceipts from "../../pages/dashboard/loans/LoanAgainstShare/components/receiptSections";
import * as npaReceipts from "../../pages/dashboard/loans/NPA/components/receiptSections";
import * as odccReceipts from "../../pages/dashboard/loans/ODCCLimit/components/receiptSections";
import * as projectReceipts from "../../pages/dashboard/loans/ProjectLoan/components/receiptSections";
import * as workingCapitalReceipts from "../../pages/dashboard/loans/WorkingCapital/components/receiptSections";

interface LoanStatusViewProps<TApplication> {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: TApplication | null;
}

const makeLoanStatus = <TApplication extends { _id: string; createdAt: string; mobile: string; email: string }>(
  fetcher: () => Promise<{ success: boolean; data: TApplication[] }>,
  buildSections: (app: TApplication) => SuccessSection[],
  emptyMessage: string,
) => ({ applicationId, isSubmitted, submittedApp }: LoanStatusViewProps<TApplication>) => (
  <LoanStatusShell<TApplication>
    applicationId={applicationId}
    isSubmitted={isSubmitted}
    submittedApp={submittedApp}
    emptyMessage={emptyMessage}
    fetcher={fetcher}
    renderApp={app => (
      <ApplicationDetails
        sections={buildSections(app)}
        contact={{ mobile: app.mobile, email: app.email }}
      />
    )}
  />
);

export const PersonalLoanStatus = makeLoanStatus(
  fetchPersonalLoanApplications, personalReceipts.buildProductSections,
  "Submit your personal loan application to track its status here.",
);
export const BusinessLoanStatus = makeLoanStatus(
  fetchBusinessLoanApplications, businessReceipts.buildProductSections,
  "Submit your business loan application to track its status here.",
);
export const HomeLoanStatus = makeLoanStatus(
  fetchHomeLoanApplications, homeReceipts.buildProductSections,
  "Submit your home loan application to track its status here.",
);
export const BalanceTransferStatus = makeLoanStatus(
  fetchBalanceTransferApplications, balanceTransferReceipts.buildProductSections,
  "Submit your balance transfer application to track its status here.",
);
export const CarLoanStatus = makeLoanStatus(
  fetchCarLoanApplications, carReceipts.buildProductSections,
  "Submit your vehicle loan application to track its status here.",
);
export const CommercialPurchaseStatus = makeLoanStatus(
  fetchCommercialPurchaseApplications, commercialPurchaseReceipts.buildProductSections,
  "Submit your commercial purchase application to track its status here.",
);
export const CreditCardStatus = makeLoanStatus(
  fetchCreditCardApplications, creditCardReceipts.buildProductSections,
  "Submit your credit card application to track its status here.",
);
export const EducationLoanStatus = makeLoanStatus(
  fetchEducationLoanApplications, educationReceipts.buildProductSections,
  "Submit your education loan application to track its status here.",
);
export const FDIStatus = makeLoanStatus(
  fetchFDIApplications, fdiReceipts.buildProductSections,
  "Submit your FDI application to track its status here.",
);
export const FilmLoanStatus = makeLoanStatus(
  fetchFilmLoanApplications, filmReceipts.buildProductSections,
  "Submit your film funding application to track its status here.",
);
export const GoldLoanStatus = makeLoanStatus(
  fetchGoldLoanApplications, goldReceipts.buildProductSections,
  "Submit your gold loan application to track its status here.",
);
export const LeaseRentalStatus = makeLoanStatus(
  fetchLeaseRentalApplications, leaseRentalReceipts.buildProductSections,
  "Submit your lease rental discounting application to track its status here.",
);
export const LoanAgainstPropertyStatus = makeLoanStatus(
  fetchLoanAgainstPropertyApplications, loanAgainstPropertyReceipts.buildProductSections,
  "Submit your loan against property application to track its status here.",
);
export const LoanAgainstShareStatus = makeLoanStatus(
  fetchLoanAgainstShareApplications, loanAgainstShareReceipts.buildProductSections,
  "Submit your loan against share application to track its status here.",
);
export const NPAStatus = makeLoanStatus(
  fetchNPAApplications, npaReceipts.buildProductSections,
  "Submit your NPA application to track its status here.",
);
export const ODCCLimitStatus = makeLoanStatus(
  fetchODCCLimitApplications, odccReceipts.buildProductSections,
  "Submit your OD / CC limit application to track its status here.",
);
export const ProjectLoanStatus = makeLoanStatus(
  fetchProjectLoanApplications, projectReceipts.buildProductSections,
  "Submit your project loan application to track its status here.",
);
export const WorkingCapitalStatus = makeLoanStatus(
  fetchWorkingCapitalApplications, workingCapitalReceipts.buildProductSections,
  "Submit your working capital application to track its status here.",
);
