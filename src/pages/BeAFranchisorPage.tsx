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
import FranchiseFAQ from "../components/franchise/FranchiseFAQ";
import FranchiseCTA from "../components/franchise/FranchiseCTA";
import FranchisorFormModal from "../components/franchise/FranchisorFormModal";
import FranchiseeApplicationModal from "../components/franchise/FranchiseeApplicationModal";
import HowItWorksModal from "../components/franchise/HowItWorksModal";

/**
 * Be a Franchisee — the franchise page: what the business is, what it pays, what
 * it costs, and the application.
 *
 * Section order is deliberate. Each fact is stated exactly once:
 *   - the journey owns the process (there is no second step list)
 *   - the payout section owns every figure about earning, including the 80:20
 *     split, the worked example and the "what it depends on" caveats
 *   - the plans section owns fees
 *   - the benefits section owns the reasons to join
 *   - the FAQ only answers what the sections above do not
 *
 * The application itself is a popup: the hero, the sticky sub-nav, a plan card
 * and the closing band all open the same form, so there is no second copy of it
 * on the page.
 */
const BeAFranchisorPage = () => {
  useSEO({
    title: "Be a Franchisee",
    description:
      "Become an Indexia Finance franchisee — five published plans from \u20B924,000 + GST, an 80:20 payout share on eligible disbursed cases, and access to partner banks and NBFCs.",
    path: "/franchise",
  });

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    FRANCHISE_PLANS.find((p) => p.recommended)?.id ?? FRANCHISE_PLANS[0].id,
  );
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  // Deep links such as /franchise#become-a-franchisor must scroll to the anchor —
  // pushState navigation does not scroll to the hash on its own.
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
      <FranchiseSubNav onApply={openApplication} />
      <FranchiseJourney onOpenModal={() => setHowItWorksOpen(true)} />
      <FranchisePayout />
      <FranchisePlans
        selectedPlanId={selectedPlanId}
        onSelectPlan={(plan) => {
          // Selecting a plan carries straight into the application, where that plan
          // is already selected in the package field.
          setSelectedPlanId(plan.id);
          setApplicationOpen(true);
        }}
      />
      <FranchiseBenefits />
      <FranchiseFAQ />
      <FranchiseCTA onApply={openApplication} onEnquire={() => setEnquiryOpen(true)} />

      <FranchiseeApplicationModal
        open={applicationOpen}
        onClose={() => setApplicationOpen(false)}
        packageId={selectedPlanId}
        onPackageChange={setSelectedPlanId}
      />
      <FranchisorFormModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
      <HowItWorksModal open={howItWorksOpen} onClose={() => setHowItWorksOpen(false)} />
    </div>
  );
};

export default BeAFranchisorPage;
