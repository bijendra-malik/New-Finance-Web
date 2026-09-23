import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WebsiteLayout from "./components/layout/WebsiteLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import PersonalLoanDashboard from "./pages/dashboard/loans/PersonalLoan/PersonalLoanDashboard";
import BusinessLoanDashboard from "./pages/dashboard/loans/BusinessLoan/BusinessLoanDashboard";
import HomeLoanDashboard from "./pages/dashboard/loans/HomeLoan/HomeLoanDashboard";
import LoanAgainstPropertyDashboard from "./pages/dashboard/loans/LoanAgainstProperty/LoanAgainstPropertyDashboard";
import BalanceTransferDashboard from "./pages/dashboard/loans/BalanceTransfer/BalanceTransferDashboard";
import ProjectLoanDashboard from "./pages/dashboard/loans/ProjectLoan/ProjectLoanDashboard";
import CarLoanDashboard from "./pages/dashboard/loans/CarLoan/CarLoanDashboard";
import EducationLoanDashboard from "./pages/dashboard/loans/EducationLoan/EducationLoanDashboard";
import CreditCardDashboard from "./pages/dashboard/loans/CreditCard/CreditCardDashboard";
import WorkingCapitalDashboard from "./pages/dashboard/loans/WorkingCapital/WorkingCapitalDashboard";
import CommercialPurchaseDashboard from "./pages/dashboard/loans/CommercialPurchase/CommercialPurchaseDashboard";
import LeaseRentalDiscountingDashboard from "./pages/dashboard/loans/LeaseRentalDiscounting/LeaseRentalDiscountingDashboard";
import ODCCLimitDashboard from "./pages/dashboard/loans/ODCCLimit/ODCCLimitDashboard";
import LoanAgainstShareDashboard from "./pages/dashboard/loans/LoanAgainstShare/LoanAgainstShareDashboard";
import FilmLoanDashboard from "./pages/dashboard/loans/FilmLoan/FilmLoanDashboard";
import NPADashboard from "./pages/dashboard/loans/NPA/NPADashboard";
import GoldLoanDashboard from "./pages/dashboard/loans/GoldLoan/GoldLoanDashboard";
import FDIDashboard from "./pages/dashboard/loans/FDI/FDIDashboard";
import RequiredDocumentPage from "./components/sections/RequiredDocumentPage";
import PersonalLoanDocs from "./pages/requireddocument/PersonalLoanDocs";
import BusinessLoanDocs from "./pages/requireddocument/BusinessLoanDocs";
import HomeLoanDocs from "./pages/requireddocument/HomeLoanDocs";
import LoanAgainstPropertyDocs from "./pages/requireddocument/LoanAgainstPropertyDocs";
import BalanceTransferDocs from "./pages/requireddocument/BalanceTransferDocs";
import CarLoanDocs from "./pages/requireddocument/CarLoanDocs";
import CreditCardDocs from "./pages/requireddocument/CreditCardDocs";
import PersonalLoanDetail from "./pages/showdetails/PersonalLoanDetail";
import BusinessLoanDetail from "./pages/showdetails/BusinessLoanDetail";
import HomeLoanDetail from "./pages/showdetails/HomeLoanDetail";
import LoanAgainstPropertyDetail from "./pages/showdetails/LoanAgainstPropertyDetail";
import BalanceTransferDetail from "./pages/showdetails/BalanceTransferDetail";
import CarLoanDetail from "./pages/showdetails/CarLoanDetail";
import CreditCardDetail from "./pages/showdetails/CreditCardDetail";
import EducationLoanDetail from "./pages/showdetails/EducationLoanDetail";
import ProjectLoanDetail from "./pages/showdetails/ProjectLoanDetail";
import CommercialPurchaseDetail from "./pages/showdetails/CommercialPurchaseDetail";
import LeaseRentalDetail from "./pages/showdetails/LeaseRentalDetail";
import WorkingCapitalDetail from "./pages/showdetails/WorkingCapitalDetail";
import FilmLoanDetail from "./pages/showdetails/FilmLoanDetail";
import ODCCLimitDetail from "./pages/showdetails/ODCCLimitDetail";
import LoanAgainstShareDetail from "./pages/showdetails/LoanAgainstShareDetail";
import NpalLoanDetail from "./pages/showdetails/NpalLoanDetail";
import GoldLoanDetail from "./pages/showdetails/GoldLoanDetail";
import FDIDetail from "./pages/showdetails/FDIDetail";
import EligibilityCalculatorPage from "./pages/EligibilityCalculatorPage";
import EMICalculatorPage from "./pages/EMICalculatorPage";
import EducationLoanDocs from "./pages/requireddocument/EducationLoanDocs";
import ProjectLoanDocs from "./pages/requireddocument/ProjectLoanDocs";
import CommercialPurchaseDocs from "./pages/requireddocument/CommercialPurchaseDocs";
import LeaseRentalDocs from "./pages/requireddocument/LeaseRentalDocs";
import WorkingCapitalDocs from "./pages/requireddocument/WorkingCapitalDocs";
import FilmLoanDocs from "./pages/requireddocument/FilmLoanDocs";
import ODCCLimitDocs from "./pages/requireddocument/ODCCLimitDocs";
import LoanAgainstShareDocs from "./pages/requireddocument/LoanAgainstShareDocs";

// Protected wrapper — redirects to home if not logged in
function ProtectedDashboard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // PersonalLoanDashboard reads user directly from useAuth() — no props needed
  return <PersonalLoanDashboard />;
}

function ProtectedBusinessDashboard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <BusinessLoanDashboard />;
}

function ProtectedHomeDashboard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <HomeLoanDashboard />;
}

function ProtectedLoanAgainstPropertyDashboard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <LoanAgainstPropertyDashboard />;
}

function ProtectedBalanceTransferDashboard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <BalanceTransferDashboard />;
}

function ProtectedProjectLoanDashboard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <ProjectLoanDashboard />;
}

function ProtectedCarLoanDashboard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <CarLoanDashboard />;
}

function ProtectedEducationLoanDashboard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <EducationLoanDashboard />;
}

function ProtectedCreditCardDashboard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <CreditCardDashboard />;
}

function ProtectedWorkingCapitalDashboard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <WorkingCapitalDashboard />;
}

function ProtectedCommercialPurchaseDashboard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <CommercialPurchaseDashboard />;
}

function ProtectedLeaseRentalDiscountingDashboard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <LeaseRentalDiscountingDashboard />;
}

function ProtectedODCCLimitDashboard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <ODCCLimitDashboard />;
}

function ProtectedLoanAgainstShareDashboard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <LoanAgainstShareDashboard />;
}

function ProtectedFilmLoanDashboard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <FilmLoanDashboard />;
}

function ProtectedNPADashboard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <NPADashboard />;
}

function ProtectedGoldLoanDashboard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <GoldLoanDashboard />;
}

function ProtectedFDIDashboard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <FDIDashboard />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <WebsiteLayout>
          <Routes>
            {/* Home page */}
            <Route path="/" element={<Home />} />

            {/* Login page */}
            <Route path="/login" element={<Login />} />

            {/* Required Documents page (generic / legacy) */}
            <Route path="/requireddocument" element={<RequiredDocumentPage />} />

            {/* Required Documents — per loan type */}
            <Route path="/requireddocument/personal-loan"          element={<PersonalLoanDocs />} />
            <Route path="/requireddocument/business-loan"          element={<BusinessLoanDocs />} />
            <Route path="/requireddocument/home-loan"              element={<HomeLoanDocs />} />
            <Route path="/requireddocument/loan-against-property"  element={<LoanAgainstPropertyDocs />} />
            <Route path="/requireddocument/balance-transfer"       element={<BalanceTransferDocs />} />
            <Route path="/requireddocument/car-loan"               element={<CarLoanDocs />} />
            <Route path="/requireddocument/credit-card"            element={<CreditCardDocs />} />
            <Route path="/requireddocument/education-loan"         element={<EducationLoanDocs />} />
            <Route path="/requireddocument/project-loan"           element={<ProjectLoanDocs />} />
            <Route path="/requireddocument/commercial-purchase"    element={<CommercialPurchaseDocs />} />
            <Route path="/requireddocument/lease-rental"           element={<LeaseRentalDocs />} />
            <Route path="/requireddocument/working-capital"        element={<WorkingCapitalDocs />} />
            <Route path="/requireddocument/film-funding"           element={<FilmLoanDocs />} />
            <Route path="/requireddocument/od-cc-limit"            element={<ODCCLimitDocs />} />
            <Route path="/requireddocument/loan-against-share"     element={<LoanAgainstShareDocs />} />

            {/* Show Details pages */}
            <Route path="/showdetails/personal-loan"       element={<PersonalLoanDetail />} />
            <Route path="/showdetails/business-loan"       element={<BusinessLoanDetail />} />
            <Route path="/showdetails/home-loan"           element={<HomeLoanDetail />} />
            <Route path="/showdetails/loanAP-loan"         element={<LoanAgainstPropertyDetail />} />
            <Route path="/showdetails/balance-loan"        element={<BalanceTransferDetail />} />
            <Route path="/showdetails/car-loan"            element={<CarLoanDetail />} />
            <Route path="/showdetails/credit-card"         element={<CreditCardDetail />} />
            <Route path="/showdetails/education-loan"      element={<EducationLoanDetail />} />
            <Route path="/showdetails/project-loan"        element={<ProjectLoanDetail />} />
            <Route path="/showdetails/commercial-purchase" element={<CommercialPurchaseDetail />} />
            <Route path="/showdetails/lease-rental"        element={<LeaseRentalDetail />} />
            <Route path="/showdetails/working-capital"     element={<WorkingCapitalDetail />} />
            <Route path="/showdetails/film-funding"         element={<FilmLoanDetail />} />
            <Route path="/showdetails/od-cc-limit"         element={<ODCCLimitDetail />} />
            <Route path="/showdetails/loan-against-share"  element={<LoanAgainstShareDetail />} />
            <Route path="/showdetails/npa"                 element={<NpalLoanDetail />} />
            <Route path="/showdetails/gold-loan"           element={<GoldLoanDetail />} />
            <Route path="/showdetails/fdi"                 element={<FDIDetail />} />

            {/* EMI Calculator */}
            <Route path="/emi-calculator" element={<EMICalculatorPage />} />

            {/* Eligibility Calculator */}
            <Route path="/eligibility-calculator" element={<EligibilityCalculatorPage />} />

            {/* Loan Dashboards (Protected — requires login via OTP) */}
            <Route path="/dashboard/personalloan" element={<ProtectedDashboard />} />
            <Route path="/dashboard/businessloan" element={<ProtectedBusinessDashboard />} />
            <Route path="/dashboard/homeloan" element={<ProtectedHomeDashboard />} />
            <Route path="/dashboard/loanagainstproperty" element={<ProtectedLoanAgainstPropertyDashboard />} />
            <Route path="/dashboard/balancetransfer" element={<ProtectedBalanceTransferDashboard />} />
            <Route path="/dashboard/projectloan" element={<ProtectedProjectLoanDashboard />} />
            <Route path="/dashboard/carloan" element={<ProtectedCarLoanDashboard />} />
            <Route path="/dashboard/educationloan" element={<ProtectedEducationLoanDashboard />} />
            <Route path="/dashboard/creditcard" element={<ProtectedCreditCardDashboard />} />
            <Route path="/dashboard/workingcapital" element={<ProtectedWorkingCapitalDashboard />} />
            <Route path="/dashboard/commercialpurchase" element={<ProtectedCommercialPurchaseDashboard />} />
            <Route path="/dashboard/leaserental" element={<ProtectedLeaseRentalDiscountingDashboard />} />
            <Route path="/dashboard/odcclimit" element={<ProtectedODCCLimitDashboard />} />
            <Route path="/dashboard/loanagainstshare" element={<ProtectedLoanAgainstShareDashboard />} />
            <Route path="/dashboard/filmfunding" element={<ProtectedFilmLoanDashboard />} />
            <Route path="/dashboard/npa" element={<ProtectedNPADashboard />} />
            <Route path="/dashboard/goldloan" element={<ProtectedGoldLoanDashboard />} />
            <Route path="/dashboard/fdi" element={<ProtectedFDIDashboard />} />

            {/* Fallback to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WebsiteLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;