import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import WebsiteLayout from "./components/layout/WebsiteLayout";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./context/authContext";
import ApplicantPrefillProvider from "./context/ApplicantPrefillProvider";
import Home from "./pages/Home";
import NotFoundPage from "./pages/NotFoundPage";

const Login = lazy(() => import("./pages/auth/Login"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const FranchiseLoginPage = lazy(() => import("./pages/FranchiseLoginPage"));
const MyApplicationsPage = lazy(() => import("./pages/MyApplicationsPage"));
const ApplicationStatusPage = lazy(() => import("./pages/ApplicationStatusPage"));
const EligibilityCalculatorPage = lazy(() => import("./pages/EligibilityCalculatorPage"));
const EMICalculatorPage = lazy(() => import("./pages/EMICalculatorPage"));
const BeAFranchisorPage = lazy(() => import("./pages/BeAFranchisorPage"));
const CreditScorePage = lazy(() => import("./pages/CreditScorePage"));

// ── Franchisor partner portal ────────────────────────────────────────────────
const FranchisorDashboardPage = lazy(() => import("./pages/FranchisorDashboardPage"));
const FranchiseFilingDashboard = lazy(() => import("./pages/franchise/loan-forms/FranchiseFilingDashboard"));

// ── Loan dashboards ──────────────────────────────────────────────────────────
const PersonalLoanDashboard = lazy(() => import("./pages/dashboard/loans/PersonalLoan/PersonalLoanDashboard"));
const BusinessLoanDashboard = lazy(() => import("./pages/dashboard/loans/BusinessLoan/BusinessLoanDashboard"));
const HomeLoanDashboard = lazy(() => import("./pages/dashboard/loans/HomeLoan/HomeLoanDashboard"));
const LoanAgainstPropertyDashboard = lazy(() => import("./pages/dashboard/loans/LoanAgainstProperty/LoanAgainstPropertyDashboard"));
const BalanceTransferDashboard = lazy(() => import("./pages/dashboard/loans/BalanceTransfer/BalanceTransferDashboard"));
const ProjectLoanDashboard = lazy(() => import("./pages/dashboard/loans/ProjectLoan/ProjectLoanDashboard"));
const VehicleLoanDashboard = lazy(() => import("./pages/dashboard/loans/VehicleLoan/VehicleLoanDashboard"));
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
const RequiredDocumentLandingPage = lazy(() => import("./pages/requireddocument/RequiredDocumentLandingPage"));
const RequiredDocumentDetailPage = lazy(() => import("./pages/requireddocument/RequiredDocumentDetailPage"));

// ── Loan detail pages ─────────────────────────────────────────────────────────
const PersonalLoanDetail = lazy(() => import("./pages/showdetails/PersonalLoanDetail"));
const BusinessLoanDetail = lazy(() => import("./pages/showdetails/BusinessLoanDetail"));
const HomeLoanDetail = lazy(() => import("./pages/showdetails/HomeLoanDetail"));
const LoanAgainstPropertyDetail = lazy(() => import("./pages/showdetails/LoanAgainstPropertyDetail"));
const BalanceTransferDetail = lazy(() => import("./pages/showdetails/BalanceTransferDetail"));
const VehicleLoanDetail = lazy(() => import("./pages/showdetails/VehicleLoanDetail"));
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function FranchisePortalRedirect() {
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  return (
    <Navigate
      to={section ? `/franchisor-dashboard?section=${encodeURIComponent(section)}` : "/franchisor-dashboard"}
      replace
    />
  );
}

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-(--brand-teal-40) border-t-(--brand-teal)"
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
  ["/dashboard/Vehicleloan", <VehicleLoanDashboard />],
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

const detailRoutes: [string, React.ReactNode][] = [
  ["/showdetails/personal-loan", <PersonalLoanDetail />],
  ["/showdetails/business-loan", <BusinessLoanDetail />],
  ["/showdetails/home-loan", <HomeLoanDetail />],
  ["/showdetails/loanAP-loan", <LoanAgainstPropertyDetail />],
  ["/showdetails/balance-loan", <BalanceTransferDetail />],
  ["/showdetails/vehicle-loan", <VehicleLoanDetail />],
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
        <ApplicantPrefillProvider>
        <WebsiteLayout>
          <ErrorBoundary>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/login" element={<Login />} />

              <Route path="/requireddocument" element={<RequiredDocumentLandingPage />} />
              <Route path="/requireddocument/:slug" element={<RequiredDocumentDetailPage />} />

              {detailRoutes.map(([path, element]) => (
                <Route key={path} path={path} element={element} />
              ))}

              <Route path="/franchise" element={<BeAFranchisorPage />} />
              <Route path="/be-a-franchisor" element={<Navigate to="/franchise" replace />} />
              <Route path="/franchise-login" element={<FranchiseLoginPage />} />
              <Route path="/franchisor-dashboard" element={<FranchisorDashboardPage />} />
              <Route path="/franchisor-dashboard/apply/:productKey" element={<FranchiseFilingDashboard />} />
              <Route path="/franchise/loan-forms" element={<FranchisePortalRedirect />} />
              <Route path="/applications" element={<ProtectedRoute><MyApplicationsPage /></ProtectedRoute>} />
              <Route path="/application-status" element={<ApplicationStatusPage />} />
              <Route path="/franchise-application-status" element={<Navigate to="/application-status#franchise-application-status" replace />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/emi-calculator" element={<EMICalculatorPage />} />
              <Route path="/eligibility-calculator" element={<EligibilityCalculatorPage />} />
              <Route path="/credit-score" element={<CreditScorePage />} />

              {dashboardRoutes.map(([path, element]) => (
                <Route
                  key={path}
                  path={path}
                  element={<ProtectedRoute>{element}</ProtectedRoute>}
                />
              ))}

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </WebsiteLayout>
        </ApplicantPrefillProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
