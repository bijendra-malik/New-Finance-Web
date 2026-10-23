import { useEffect, useState } from "react";
import PageBanner from "../components/common/PageBanner";
import FranchiseStatusCheck from "../components/franchise/FranchiseStatusCheck";
import CustomerStatusLookup from "../components/status/CustomerStatusLookup";
import useSEO from "../hooks/useSEO";

type StatusPanel = "customer" | "franchise";

const panelFromHash = (): StatusPanel =>
  window.location.hash === "#franchise-application-status" ? "franchise" : "customer";

const ApplicationStatusPage = () => {
  const [activePanel, setActivePanel] = useState<StatusPanel>(panelFromHash);

  useEffect(() => {
    const syncPanelFromHash = () => setActivePanel(panelFromHash());
    window.addEventListener("hashchange", syncPanelFromHash);
    return () => window.removeEventListener("hashchange", syncPanelFromHash);
  }, []);

  const selectPanel = (panel: StatusPanel) => {
    setActivePanel(panel);
    window.history.replaceState(
      null,
      "",
      panel === "franchise" ? "#franchise-application-status" : window.location.pathname,
    );
  };

  const support = activePanel === "customer"
    ? {
        eyebrow: "Customer application support",
        heading: "Your application, with a clear next step.",
        description: "Enter your customer ID, PAN and registered mobile number. We send a one-time password to that mobile first, so the application details are only shown to you.",
        note: "Your customer ID was issued with your application (for example CUST000001).",
        switchLead: "Applied to become a franchisee instead?",
        switchAction: "Check your franchise application status",
        switchTo: "franchise" as const,
      }
    : {
        eyebrow: "Franchise application support",
        heading: "Follow your franchise application.",
        description: "Enter the mobile number and PAN used in your franchise application. We send a one-time password to that mobile before showing its latest update.",
        note: "Portal sign-in opens once your agreement is approved. You can check its status here at any time.",
        switchLead: "Checking a customer loan application instead?",
        switchAction: "Check your customer application status",
        switchTo: "customer" as const,
      };

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
        <div className="mx-auto grid max-w-6xl gap-8 xl:grid-cols-[0.7fr_1.3fr] xl:items-start">
          <div className="pt-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--brand-teal)">{support.eyebrow}</p>
            <h1 className="mt-3 max-w-md text-3xl font-extrabold leading-tight text-(--brand-navy) md:text-4xl">
              {support.heading}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">
              {support.description}
            </p>
            <div className="mt-7 border-l-2 border-(--brand-teal) pl-4 text-sm leading-6 text-slate-500">
              {support.note}
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-500">
              {support.switchLead}{" "}
              <button
                type="button"
                onClick={() => selectPanel(support.switchTo)}
                className="font-semibold text-(--brand-navy) underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-(--brand-teal)/40 rounded"
              >
                {support.switchAction}
              </button>
            </p>
          </div>

          <div>
            <div
              role="tablist"
              aria-label="Application type"
              className="grid grid-cols-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm"
            >
              <button
                id="customer-status-tab"
                role="tab"
                type="button"
                aria-selected={activePanel === "customer"}
                aria-controls="customer-status-panel"
                onClick={() => selectPanel("customer")}
                className={`rounded-lg px-3 py-3 text-left text-[12px] font-extrabold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33) ${
                  activePanel === "customer"
                    ? "bg-(--brand-navy) text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-(--brand-navy)"
                }`}
              >
                Customer application
              </button>
              <button
                id="franchise-status-tab"
                role="tab"
                type="button"
                aria-selected={activePanel === "franchise"}
                aria-controls="franchise-application-status"
                onClick={() => selectPanel("franchise")}
                className={`rounded-lg px-3 py-3 text-left text-[12px] font-extrabold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33) ${
                  activePanel === "franchise"
                    ? "bg-(--brand-navy) text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-(--brand-navy)"
                }`}
              >
                Franchise application
              </button>
            </div>

            {activePanel === "customer" && (
              <div
                id="customer-status-panel"
                role="tabpanel"
                aria-labelledby="customer-status-tab"
                className="mt-4"
              >
                <CustomerStatusLookup />
              </div>
            )}

            {activePanel === "franchise" && (
              <div
                id="franchise-application-status"
                role="tabpanel"
                aria-labelledby="franchise-status-tab"
                className="mt-4"
              >
                <FranchiseStatusCheck />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ApplicationStatusPage;
