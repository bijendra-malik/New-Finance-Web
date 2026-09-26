import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ApplicationModal from "../../components/modals/ApplicationModal";
import useSEO from "../../hooks/useSEO";

/**
 * /login route — if user is already logged in redirect to dashboard,
 * otherwise show the ApplicationModal directly (Sign In tab active by default).
 */
const Login = () => {
  useSEO({
    title: "Login",
    description: "Log in to your Indexia Finance account to apply for loans and track your applications.",
    path: "/login",
  });

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Already logged in → go straight to dashboard
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard/personalloan", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-50">
      {/* Modal is always open on this page; closing navigates back home */}
      <ApplicationModal
        isOpen={true}
        onClose={() => navigate("/")}
        productName="Personal Loan"
      />
    </div>
  );
};

export default Login;
