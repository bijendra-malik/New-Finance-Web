import { Link } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import useSEO from "../hooks/useSEO";

const NotFoundPage = () => {
  useSEO({
    title: "Page Not Found",
    description: "The page you are looking for does not exist. Explore Indexia Finance loan products, calculators and contact options instead.",
    path: "/404",
  });

  return (
    <>
      <PageBanner
        breadcrumb="Page Not Found"
        title="404 — Page"
        highlight="Not Found"
        tagline="The page you're looking for doesn't exist or has moved"
      />

      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-6 py-10 text-center">
          <p className="text-7xl font-extrabold" style={{ color: "#066a9c" }}>404</p>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            Sorry, we couldn't find that page. It may have been moved, or the link
            may be out of date. Try one of these instead:
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              { to: "/", label: "Go to Homepage" },
              { to: "/emi-calculator", label: "EMI Calculator" },
              { to: "/eligibility-calculator", label: "Eligibility Calculator" },
              { to: "/contact", label: "Contact Us" },
            ].map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-lg px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: i === 0
                    ? "linear-gradient(135deg, #26ae90 0%, #066a9c 100%)"
                    : "#066a9c",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
