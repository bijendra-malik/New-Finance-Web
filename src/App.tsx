import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WebsiteLayout from "./components/layout/WebsiteLayout";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./context/authContext";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";

// Static pages (small, always needed)
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import FranchiseLoginPage from "./pages/FranchiseLoginPage";
import BeAnAssociatePage from "./pages/BeAnAssociatePage";
import EligibilityCalculatorPage from "./pages/EligibilityCalculatorPage";
import EMICalculatorPage from "./pages/EMICalculatorPage";

// ── Loan dashboards ──────────────────────────────────────────────────────────
const PersonalLoanDashboard = lazy(() => import("./pages/dashboard/loans/PersonalLoan/PersonalLoanDashboard"));
const BusinessLoanDashboard = lazy(() => import("./pages/dashboard/loans/BusinessLoan/BusinessLoanDashboard"));
const HomeLoanDashboard = lazy(() => import("./pages/dashboard/loans/HomeLoan/HomeLoanDashboard"));
const LoanAgainstPropertyDashboard = lazy(() => import("./pages/dashboard/loans/LoanAgainstProperty/LoanAgainstPropertyDashboard"));
const BalanceTransferDashboard = lazy(() => import("./pages/dashboard/loans/BalanceTransfer/BalanceTransferDashboard"));
const ProjectLoanDashboard = lazy(() => import("./pages/dashboard/loans/ProjectLoan/ProjectLoanDashboard"));
const CarLoanDashboard = lazy(() => import("./pages/dashboard/loans/CarLoan/CarLoanDashboard"));
const EducationLoanDashboard = lazy(() => import("./pages/dashboard/loans/EducationLoan/EducationLoanDashboard"));
const CreditCardDashboard = lazy(() => import("./pages/dashboard/loans/CreditCard/CreditCardDashboard"));
const WorkingCapitalDashboard = lazy(() => import("./pages/dashboard/loans/WorkingCapital/WorkingCapitalDashboard"));
const CommercialPurchaseDashboard = lazy(() => import("./pages/dashboard/loans/CommercialPurchase/CommercialPurchaseDashboard"));
const LeaseRentalDiscountingDashboard = lazy(() => import("./pages/dashboard/loans/LeaseRentalDiscounting/LeaseRentalDiscountingDashboard"));
const ODCCLimitDashboard = lazy(() => import("./pages/dashboard/loans/ODCCLimit/ODCCLimitDashboard"));
const LoanAgainstShareDashboard = lazy(() => import("./pages/dashboard/loans/LoanAgainstShare/LoanAgainstShareDashboard"));
const FilmLoanDashboard = lazy(() => import("./pages/dashboard/loans/FilmLoan/FilmLoanDashboard"));
const NPADashboard = lazy(() => import("./pages/dashboard/loans/NPA/NPADashboard"));
const GoldLoanDashboard = lazy(() => import("./pages/dashboard/loans/GoldLoan/GoldLoanDashboard"));
const FDIDashboard = lazy(() => import("./pages/dashboard/loans/FDI/FDIDashboard"));

// ── Required-documents pages ──────────────────────────────────────────────────
const RequiredDocumentPage = lazy(() => import("./components/sections/RequiredDocumentPage"));
const PersonalLoanDocs = lazy(() => import("./pages/requireddocument/PersonalLoanDocs"));
const BusinessLoanDocs = lazy(() => import("./pages/requireddocument/BusinessLoanDocs"));
const HomeLoanDocs = lazy(() => import("./pages/requireddocument/HomeLoanDocs"));
const LoanAgainstPropertyDocs = lazy(() => import("./pages/requireddocument/LoanAgainstPropertyDocs"));
const BalanceTransferDocs = lazy(() => import("./pages/requireddocument/BalanceTransferDocs"));
const CarLoanDocs = lazy(() => import("./pages/requireddocument/CarLoanDocs"));
const CreditCardDocs = lazy(() => import("./pages/requireddocument/CreditCardDocs"));
const EducationLoanDocs = lazy(() => import("./pages/requireddocument/EducationLoanDocs"));
const ProjectLoanDocs = lazy(() => import("./pages/requireddocument/ProjectLoanDocs"));
const CommercialPurchaseDocs = lazy(() => import("./pages/requireddocument/CommercialPurchaseDocs"));
const LeaseRentalDocs = lazy(() => import("./pages/requireddocument/LeaseRentalDocs"));
const WorkingCapitalDocs = lazy(() => import("./pages/requireddocument/WorkingCapitalDocs"));
const FilmLoanDocs = lazy(() => import("./pages/requireddocument/FilmLoanDocs"));
const ODCCLimitDocs = lazy(() => import("./pages/requireddocument/ODCCLimitDocs"));
const LoanAgainstShareDocs = lazy(() => import("./pages/requireddocument/LoanAgainstShareDocs"));
const NpaDocs = lazy(() => import("./pages/requireddocument/NpaDocs"));
const GoldLoanDocs = lazy(() => import("./pages/requireddocument/GoldLoanDocs"));
const FdiDocs = lazy(() => import("./pages/requireddocument/FdiDocs"));

// ── Loan detail pages ─────────────────────────────────────────────────────────
const PersonalLoanDetail = lazy(() => import("./pages/showdetails/PersonalLoanDetail"));
const BusinessLoanDetail = lazy(() => import("./pages/showdetails/BusinessLoanDetail"));
const HomeLoanDetail = lazy(() => import("./pages/showdetails/HomeLoanDetail"));
const LoanAgainstPropertyDetail = lazy(() => import("./pages/showdetails/LoanAgainstPropertyDetail"));
const BalanceTransferDetail = lazy(() => import("./pages/showdetails/BalanceTransferDetail"));
const CarLoanDetail = lazy(() => import("./pages/showdetails/CarLoanDetail"));
const CreditCardDetail = lazy(() => import("./pages/showdetails/CreditCardDetail"));
const EducationLoanDetail = lazy(() => import("./pages/showdetails/EducationLoanDetail"));
const ProjectLoanDetail = lazy(() => import("./pages/showdetails/ProjectLoanDetail"));
const CommercialPurchaseDetail = lazy(() => import("./pages/showdetails/CommercialPurchaseDetail"));
const LeaseRentalDetail = lazy(() => import("./pages/showdetails/LeaseRentalDetail"));
const WorkingCapitalDetail = lazy(() => import("./pages/showdetails/WorkingCapitalDetail"));
const FilmLoanDetail = lazy(() => import("./pages/showdetails/FilmLoanDetail"));
const ODCCLimitDetail = lazy(() => import("./pages/showdetails/ODCCLimitDetail"));
const LoanAgainstShareDetail = lazy(() => import("./pages/showdetails/LoanAgainstShareDetail"));
const NpalLoanDetail = lazy(() => import("./pages/showdetails/NpalLoanDetail"));
const GoldLoanDetail = lazy(() => import("./pages/showdetails/GoldLoanDetail"));
const FDIDetail = lazy(() => import("./pages/showdetails/FDIDetail"));

/** Redirects to home when the visitor is not logged in. */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

/** Minimal loader shown while a lazy route chunk downloads. */
function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-[#26ae90]/25 border-t-[#26ae90]"
        role="status"
        aria-label="Loading page"
      />
    </div>
  );
}

// ── Route table ───────────────────────────────────────────────────────────────
const dashboardRoutes: [string, React.ReactNode][] = [
  ["/dashboard/personalloan", <PersonalLoanDashboard />],
  ["/dashboard/businessloan", <BusinessLoanDashboard />],
  ["/dashboard/homeloan", <HomeLoanDashboard />],
  ["/dashboard/loanagainstproperty", <LoanAgainstPropertyDashboard />],
  ["/dashboard/balancetransfer", <BalanceTransferDashboard />],
  ["/dashboard/projectloan", <ProjectLoanDashboard />],
  ["/dashboard/carloan", <CarLoanDashboard />],
  ["/dashboard/educationloan", <EducationLoanDashboard />],
  ["/dashboard/creditcard", <CreditCardDashboard />],
  ["/dashboard/workingcapital", <WorkingCapitalDashboard />],
  ["/dashboard/commercialpurchase", <CommercialPurchaseDashboard />],
  ["/dashboard/leaserental", <LeaseRentalDiscountingDashboard />],
  ["/dashboard/odcclimit", <ODCCLimitDashboard />],
  ["/dashboard/loanagainstshare", <LoanAgainstShareDashboard />],
  ["/dashboard/filmfunding", <FilmLoanDashboard />],
  ["/dashboard/npa", <NPADashboard />],
  ["/dashboard/goldloan", <GoldLoanDashboard />],
  ["/dashboard/fdi", <FDIDashboard />],
];

const requiredDocRoutes: [string, React.ReactNode][] = [
  ["/requireddocument/personal-loan", <PersonalLoanDocs />],
  ["/requireddocument/business-loan", <BusinessLoanDocs />],
  ["/requireddocument/home-loan", <HomeLoanDocs />],
  ["/requireddocument/loan-against-property", <LoanAgainstPropertyDocs />],
  ["/requireddocument/balance-transfer", <BalanceTransferDocs />],
  ["/requireddocument/car-loan", <CarLoanDocs />],
  ["/requireddocument/credit-card", <CreditCardDocs />],
  ["/requireddocument/education-loan", <EducationLoanDocs />],
  ["/requireddocument/project-loan", <ProjectLoanDocs />],
  ["/requireddocument/commercial-purchase", <CommercialPurchaseDocs />],
  ["/requireddocument/lease-rental", <LeaseRentalDocs />],
  ["/requireddocument/working-capital", <WorkingCapitalDocs />],
  ["/requireddocument/film-funding", <FilmLoanDocs />],
  ["/requireddocument/od-cc-limit", <ODCCLimitDocs />],
  ["/requireddocument/loan-against-share", <LoanAgainstShareDocs />],
  ["/requireddocument/npa", <NpaDocs />],
  ["/requireddocument/gold-loan", <GoldLoanDocs />],
  ["/requireddocument/fdi", <FdiDocs />],
];

const detailRoutes: [string, React.ReactNode][] = [
  ["/showdetails/personal-loan", <PersonalLoanDetail />],
  ["/showdetails/business-loan", <BusinessLoanDetail />],
  ["/showdetails/home-loan", <HomeLoanDetail />],
  ["/showdetails/loanAP-loan", <LoanAgainstPropertyDetail />],
  ["/showdetails/balance-loan", <BalanceTransferDetail />],
  ["/showdetails/car-loan", <CarLoanDetail />],
  ["/showdetails/credit-card", <CreditCardDetail />],
  ["/showdetails/education-loan", <EducationLoanDetail />],
  ["/showdetails/project-loan", <ProjectLoanDetail />],
  ["/showdetails/commercial-purchase", <CommercialPurchaseDetail />],
  ["/showdetails/lease-rental", <LeaseRentalDetail />],
  ["/showdetails/working-capital", <WorkingCapitalDetail />],
  ["/showdetails/film-funding", <FilmLoanDetail />],
  ["/showdetails/od-cc-limit", <ODCCLimitDetail />],
  ["/showdetails/loan-against-share", <LoanAgainstShareDetail />],
  ["/showdetails/npa", <NpalLoanDetail />],
  ["/showdetails/gold-loan", <GoldLoanDetail />],
  ["/showdetails/fdi", <FDIDetail />],
];

function App() {
  return (
    <Router>
      <AuthProvider>
        <WebsiteLayout>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Home page */}
              <Route path="/" element={<Home />} />

              {/* Login page */}
              <Route path="/login" element={<Login />} />

              {/* Required Documents page (generic / legacy) */}
              <Route path="/requireddocument" element={<RequiredDocumentPage />} />

              {/* Required Documents — per loan type */}
              {requiredDocRoutes.map(([path, element]) => (
                <Route key={path} path={path} element={element} />
              ))}

              {/* Show Details pages */}
              {detailRoutes.map(([path, element]) => (
                <Route key={path} path={path} element={element} />
              ))}

              {/* Static pages */}
              <Route path="/franchise-login" element={<FranchiseLoginPage />} />
              <Route path="/be-an-associate" element={<BeAnAssociatePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/emi-calculator" element={<EMICalculatorPage />} />
              <Route path="/eligibility-calculator" element={<EligibilityCalculatorPage />} />

              {/* Loan Dashboards (Protected — requires login via OTP) */}
              {dashboardRoutes.map(([path, element]) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute>
                      {element}
                    </ProtectedRoute>
                  }
                />
              ))}

              {/* 404 — any unmatched URL */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </WebsiteLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;
