import { Link } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import CustomerStatusLookup from "../components/status/CustomerStatusLookup";
import useSEO from "../hooks/useSEO";

const ApplicationStatusPage = () => {
  useSEO({
    title: "Check Application Status",
    description:
      "Check your Indexia Finance application status with your customer ID, PAN and registered mobile number, verified by OTP.",
    path: "/application-status",
  });

  return (
    <>
      <PageBanner
        breadcrumb="Check Application Status"
        title="Track your"
        highlight="Application"
        tagline="Verify your mobile number, then see the latest update on every application."
      />
      <section className="bg-slate-50 px-5 py-12 md:py-16">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="pt-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--brand-teal)">Application support</p>
            <h1 className="mt-3 max-w-md text-3xl font-extrabold leading-tight text-(--brand-navy) md:text-4xl">
              Your application, with a clear next step.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">
              Enter your customer ID, PAN and registered mobile number. We send a one-time password to
              that mobile first, so the application details are only shown to you.
            </p>
            <div className="mt-7 border-l-2 border-(--brand-teal) pl-4 text-sm leading-6 text-slate-500">
              Your customer ID was issued with your application (for example CUST000001).
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-500">
              Applying for a franchise instead?{" "}
              <Link
                to="/franchise-application-status"
                className="font-semibold text-(--brand-navy) underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-(--brand-teal)/40 rounded"
              >
                Check your franchise application status →
              </Link>
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <CustomerStatusLookup />
          </div>
        </div>
      </section>
    </>
  );
};

export default ApplicationStatusPage;
