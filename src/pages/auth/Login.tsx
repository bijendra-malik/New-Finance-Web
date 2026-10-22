import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import ApplicationModal from "../../components/modals/ApplicationModal";
import useSEO from "../../hooks/useSEO";

const Login = () => {
  useSEO({
    title: "Login",
    description: "Log in to your Indexia Finance account to apply for loans and track your applications.",
    path: "/login",
  });

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      // No default loan route after sign-up.
      // navigate("/dashboard/personalloan", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-50">
      {/* The visible content is the sign-in modal, so the page keeps a real H1. */}
      <h1 className="sr-only">Log in to your Indexia Finance account</h1>
      {/* Modal is always open on this page; closing navigates back home */}
      <ApplicationModal
        isOpen={true}
        onClose={() => navigate("/")}
        productName="Log in"
      />
      <p className="mt-2 text-[11px] text-slate-400">
        Sign in to continue. If you don&apos;t have an account yet, use the Apply flow instead — /login is only for existing customers.
      </p>
    </div>
  );
};

export default Login;
