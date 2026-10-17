import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useSEO from "../hooks/useSEO";
import { useFranchisePlans } from "../hooks/useFranchisePlans";
import FranchiseHero from "../components/franchise/FranchiseHero";
import FranchiseSubNav from "../components/franchise/FranchiseSubNav";
import FranchiseJourney from "../components/franchise/FranchiseJourney";
import FranchisePayout from "../components/franchise/FranchisePayout";
import FranchisePlans from "../components/franchise/FranchisePlans";
import FranchiseBenefits from "../components/franchise/FranchiseBenefits";
import FranchiseFAQ from "../components/franchise/FranchiseFAQ";
import FranchiseCTA from "../components/franchise/FranchiseCTA";
import FranchiseeApplicationModal from "../components/franchise/FranchiseeApplicationModal";

const BeAFranchisorPage = () => {
  useSEO({
    title: "Be a Franchisee",
    description:
      "Become an Indexia Finance franchisee — published plans with clear fees and validity, an 80:20 payout share on eligible disbursed cases, and access to partner banks and NBFCs.",
    path: "/franchise",
  });

  const { plans, loading: plansLoading, error: plansError, selectedPlanCode, reload: reloadPlans } =
    useFranchisePlans();
  const [chosenPlanId, setChosenPlanId] = useState<string | null>(null);
  const [applicationOpen, setApplicationOpen] = useState(false);

  const selectedPlanId =
    chosenPlanId && plans.some((plan) => plan.id === chosenPlanId)
      ? chosenPlanId
      : selectedPlanCode || plans[0]?.id || null;

  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const target = document.getElementById(hash.slice(1));
    if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [hash]);

  const openApplication = () => setApplicationOpen(true);

  return (
    <div className="bg-white">
      <FranchiseHero onApply={openApplication} />
      <FranchiseSubNav />
      <FranchiseJourney />
      <FranchisePayout />
      <FranchisePlans
        plans={plans}
        loading={plansLoading}
        error={plansError}
        onRetry={reloadPlans}
        selectedPlanId={selectedPlanId}
        onSelectPlan={(plan) => {
          setChosenPlanId(plan.id);
          setApplicationOpen(true);
        }}
      />
      <FranchiseBenefits />
      <FranchiseFAQ />
      <FranchiseCTA onApply={openApplication} />

      <FranchiseeApplicationModal
        open={applicationOpen}
        onClose={() => setApplicationOpen(false)}
        packageId={selectedPlanId}
        onPackageChange={setChosenPlanId}
      />
    </div>
  );
};

export default BeAFranchisorPage;
