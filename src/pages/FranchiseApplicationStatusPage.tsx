import { Link } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import FranchiseStatusCheck from "../components/franchise/FranchiseStatusCheck";
import useSEO from "../hooks/useSEO";

const FranchiseApplicationStatusPage = () => {
  useSEO({
    title: "Check Franchise Application Status",
    description:
      "Check the status of your Indexia Finance franchise application with the registered mobile number and PAN from your application, verified by OTP. No portal login needed.",
    path: "/franchise-application-status",
  });

  return (
    <>
      <PageBanner
        breadcrumb="Franchise Application Status"
        title="Check your"
        highlight="Franchise Application"
        tagline="Verify the mobile number from your application, then see the latest update."
      />

      <section className="bg-slate-50 px-5 py-12 md:py-16">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="pt-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--brand-teal)">Franchise support</p>
            <h1 className="mt-3 max-w-md text-3xl font-extrabold leading-tight text-(--brand-navy) md:text-4xl">
              Follow your application from submitted to approved.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">
              Enter the mobile number and PAN you used on your franchise application. We send a
              one-time password to that mobile first, so the status is only shown to you.
            </p>
            <div className="mt-7 border-l-2 border-(--brand-teal) pl-4 text-sm leading-6 text-slate-500">
              Portal sign-in opens once your agreement is approved — this lookup works before that,
              with no account needed.
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-500">
              Not applied yet?{" "}
              <Link
                to="/franchise"
                className="font-semibold text-(--brand-navy) underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-(--brand-teal)/40 rounded"
              >
                See the franchise opportunity →
              </Link>
            </p>
          </div>

          <div className="pt-1">
            <FranchiseStatusCheck />
          </div>
        </div>
      </section>
    </>
  );
};

export default FranchiseApplicationStatusPage;