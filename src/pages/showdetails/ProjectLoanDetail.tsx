import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerBg from "../../assets/loan-images/project-banner.png";

const ACCENT = "var(--brand-navy)";

const BulletList = ({ items }: { items: [string, string][] }) => (
  <ul className="space-y-2.5 mt-1">
    {items.map(([title, desc], i) => (
      <li key={i} className="flex items-start gap-3">
        <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
        <span className="text-sm text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-800">{title}: </span>{desc}
        </span>
      </li>
    ))}
  </ul>
);

const sections: DetailSection[] = [
  {
    id: "intro",
    heading: "What is a Project Loan?",
    content: (
      <p className="text-gray-600 leading-relaxed">
        A project loan is a specialised form of financing designed to fund specific ventures —
        construction projects, infrastructure developments, or large-scale business initiatives.
        These loans provide the necessary capital to undertake and complete projects, enabling
        businesses and individuals to achieve their goals efficiently and effectively.
      </p>
    ),
  },
  {
    id: "indexia",
    heading: "Indexia Finance — Project Finance Specialist",
    content: (
      <BulletList items={[
        ["Foreign Currency Financing", "Specialisation in Project Finance relying on large-scale foreign currency financing."],
        ["Bank Collaboration", "Collaboration with multiple banks and financial institutions for optimal deal structuring."],
        ["In-House Expertise", "Dedicated in-house Project Financing team for project analysis, evaluation, and funding arrangement."],
        ["Advisory Services", "Acts as liaison between loan seekers and lenders; expertise in financial modelling and spreadsheets."],
      ]} />
    ),
  },
  {
    id: "financing",
    heading: "How Project Financing Works",
    content: (
      <BulletList items={[
        ["Distinct Entity Development", "Projects are developed through a separate, single-purpose financial and legal entity."],
        ["Debt-to-Equity Leverage", "Sponsors aim to maximise debt-to-equity leverage, linking debt to cash flow potential and project asset values."],
        ["Risk Coverage", "Project assets and revenues are pledged as security, along with contractual commitments from third parties."],
      ]} />
    ),
  },
  {
    id: "team-roles",
    heading: "Roles of the Project Finance Team",
    content: (
      <BulletList items={[
        ["Optimal Loan Facility", "Advising clients on the most suitable loan facility for their project type."],
        ["Creditworthiness Assessment", "Assessing the loan-seeking entity's creditworthiness and determining project requirements."],
        ["Accelerated Processing", "Facilitating faster loan processes through established lender relationships."],
        ["Document Compilation", "Assisting in compiling all necessary documents for the loan process."],
        ["Tailored Finance", "Customising project finance structures to meet specific project needs and timelines."],
        ["Project Structuring", "Structuring projects for economic, technical, and environmental feasibility."],
      ]} />
    ),
  },
  {
    id: "best-options",
    heading: "Best Project Loan Options",
    content: (
      <div className="space-y-5">
        {[
          { num: "1", title: "Best Project Loan Provider", desc: "Known for competitive rates and tailored financing solutions — expertise in project funding helps turn your vision into reality." },
          { num: "2", title: "Best Project Loan Options", desc: "From startup capital to expansion funding — flexible loan terms designed to support projects of all sizes and stages." },
          { num: "3", title: "Best Project Loan Company", desc: "Transparent terms and reliable service — focused on customer satisfaction from application through to final disbursement." },
          { num: "4", title: "Best Project Loan Provider Company", desc: "Whether in construction, real estate, or infrastructure, these providers offer comprehensive financial support for your project." },
        ].map((item) => (
          <div key={item.num} className="flex items-start gap-4">
            <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5" style={{ background: ACCENT }}>{item.num}</span>
            <div>
              <p className="font-semibold text-gray-800 text-sm mb-1">{item.title}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "conclusion",
    heading: "Ready to Bring Your Project to Life?",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Indexia Finance is a premier project loan provider in India. Simply fill in a few details
        on the portal and the right bank will be at your doorstep. Explore your options today and
        bring your projects to fruition with confidence.
      </p>
    ),
  },
];

const ProjectLoanDetail = () => (
  <ShowDetailLayout
    loanName="Project Loan"
    breadcrumb="Project Loan"
    bannerTitle="Project Loan"
    bannerTagline="Now, Right Bank will come to your doorstep"
    bannerBg={bannerBg}
    docsHref="/requireddocument/project-loan"
    applySlug="projectloan"
    sections={sections}
  />
);

export default ProjectLoanDetail;
