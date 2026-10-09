import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useSEO from "../hooks/useSEO";
import { FRANCHISE_PLANS } from "../components/franchise/franchiseData";
import FranchiseHero from "../components/franchise/FranchiseHero";
import FranchiseSubNav from "../components/franchise/FranchiseSubNav";
import FranchiseJourney from "../components/franchise/FranchiseJourney";
import FranchisePayout from "../components/franchise/FranchisePayout";
import FranchisePlans from "../components/franchise/FranchisePlans";
import FranchiseBenefits from "../components/franchise/FranchiseBenefits";
import FranchiseeApplication from "../components/franchise/FranchiseeApplication";
import FranchiseFAQ from "../components/franchise/FranchiseFAQ";
import FranchiseCTA from "../components/franchise/FranchiseCTA";
import FranchisorFormModal from "../components/franchise/FranchisorFormModal";

/**
 * Be a Franchisor — the franchise partner page: what the business is, what it
 * pays, what it costs, and the application.
 *
 * Section order is deliberate. Each fact is stated exactly once:
 *   - the journey owns the process (there is no second step list)
 *   - the payout section owns every figure about earning, including the 80:20
 *     split, the worked example and the "what it depends on" caveats
 *   - the plans section owns fees
 *   - the benefits section owns the reasons to join
 *   - the FAQ only answers what the sections above do not
 *
 * NOTE: the application form still hands the completed details to the user's mail
 * client; POST /franchise/apply is not wired into this form yet.
 */
const BeAFranchisorPage = () => {
  useSEO({
    title: "Be a Franchisor",
    description:
      "Become an Indexia Finance franchise partner — five published plans from \u20B924,000 + GST, an 80:20 payout share on eligible disbursed cases, and access to partner banks and NBFCs.",
    path: "/franchise",
  });


  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    FRANCHISE_PLANS.find((p) => p.recommended)?.id ?? FRANCHISE_PLANS[0].id,
  );
  const [franchisorFormOpen, setFranchisorFormOpen] = useState(false);

  // Deep links such as /franchise#become-a-franchisor must scroll to the anchor —
  // pushState navigation does not scroll to the hash on its own.
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const target = document.getElementById(hash.slice(1));
    if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [hash]);

  return (
    <div className="bg-white">
      <FranchiseHero />
      <FranchiseSubNav />
      <FranchiseJourney />
      <FranchisePayout />
      <FranchisePlans
        selectedPlanId={selectedPlanId}
        onSelectPlan={(plan) => {
          setSelectedPlanId(plan.id);
          document.getElementById("franchisee-application")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />
      <FranchiseBenefits />
      <FranchiseeApplication packageId={selectedPlanId} onPackageChange={setSelectedPlanId} />
      <FranchiseFAQ />
      <FranchiseCTA onBecomeFranchisor={() => setFranchisorFormOpen(true)} />

      <FranchisorFormModal open={franchisorFormOpen} onClose={() => setFranchisorFormOpen(false)} />
    </div>
  );
};

export default BeAFranchisorPage;
