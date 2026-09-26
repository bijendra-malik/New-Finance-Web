import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerBg from "../../assets/loan-images/Film-banner.png";

const ACCENT = "var(--brand-navy)";

const BL = ({ items }: { items: (string | [string, string])[] }) => (
  <ul className="space-y-2.5 mt-1">
    {items.map((item, i) => {
      const [t, d] = Array.isArray(item) ? item : [item, undefined];
      return (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
          <span className="text-sm text-gray-600 leading-relaxed">
            {d ? <><span className="font-semibold text-gray-800">{t}: </span>{d}</> : t}
          </span>
        </li>
      );
    })}
  </ul>
);

const sections: DetailSection[] = [
  {
    id: "intro",
    heading: "What is Film Funding?",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 leading-relaxed">
          Film Funding is a financing facility that provides financial support for the development
          and production of films and other eligible audiovisual projects. It can help producers and
          production companies meet expenses such as pre-production, production, post-production,
          marketing, distribution, and other approved project-related requirements.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Under a Film Funding facility, the lender or financier assesses the proposed project,
          production budget, business plan, expected revenues, promoter or production company's
          financial profile, and other relevant factors. Funding may be structured through loans,
          project finance, or other approved financing arrangements depending on the financier and
          project structure.
        </p>
        <p className="text-gray-600 leading-relaxed">
          The sanctioned funding amount, interest rate or financing cost, repayment terms, security
          requirements, disbursement schedule, project conditions, and other terms depend on the
          financier's assessment, project viability, applicable policies, and agreed financing
          structure.
        </p>
      </div>
    ),
  },
  {
    id: "features",
    heading: "Features of Film Funding",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">
          Film Funding can provide financial support for eligible film and audiovisual projects. Key
          features may include:
        </p>
        <BL items={[
          "Funding support for eligible film production and related project expenses",
          "Financing may cover approved pre-production, production, and post-production requirements",
          "Funding may be provided based on the project's estimated budget and financial requirements",
          "Disbursement may be linked to project milestones or agreed production stages",
          "Project viability and expected revenue may be considered during the assessment",
          "Financing terms may vary depending on the project, applicant, and financier",
          "Security or collateral may be required depending on the financing structure",
          "Periodic monitoring of project progress and utilisation of funds may be applicable",
        ]} />
      </div>
    ),
  },
  {
    id: "eligibility",
    heading: "Eligibility for Film Funding",
    content: (
      <div className="space-y-4">
        <div>
          <p className="text-gray-500 text-sm mb-2">Film Funding may be available to eligible:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
            {[
              "Film Production Companies",
              "Producers",
              "Production Houses",
              "Studios",
              "Media & Entertainment Companies",
              "Established Film Production Entities",
              "Other eligible applicants or project entities",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
                <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-gray-500 text-sm mb-2">Eligibility may depend on:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
            {[
              "Applicant's business and financial profile",
              "Experience of the producer or production team",
              "Viability of the proposed film project",
              "Estimated project budget",
              "Funding requirement",
              "Production plan and timeline",
              "Expected revenue and commercial prospects",
              "Existing financial obligations",
              "Availability of security, where applicable",
              "Financier's internal policies and assessment criteria",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
                <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          The project and applicant must meet the financier's applicable eligibility and credit
          requirements.
        </p>
      </div>
    ),
  },
  {
    id: "process",
    heading: "Application Process for Film Funding",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">The application process generally involves the following steps:</p>
        <BL items={[
          ["Application Submission", "The applicant provides personal, business, project, financial, and funding-related details"],
          ["Project Documentation", "The film concept, screenplay, budget, production plan, agreements, and other required documents are submitted"],
          ["KYC & Business Verification", "The identity, address, business registration, and other relevant details are verified"],
          ["Project Assessment", "The proposed film, production plan, estimated budget, commercial viability, and expected revenues are evaluated"],
          ["Financial Assessment", "The applicant's financial statements, banking history, cash flow, existing liabilities, and repayment capacity are assessed"],
          ["Credit Assessment", "The applicant and project are evaluated based on the applicable credit and risk criteria"],
          ["Security Assessment", "Where applicable, the proposed collateral, rights, receivables, or other security arrangements are evaluated"],
          ["Approval", "Based on the assessment, the applicable funding amount, financing cost, repayment terms, disbursement schedule, and other conditions are determined"],
          ["Documentation & Agreement", "Financing agreements and other required documentation are completed"],
          ["Disbursement", "Approved funds are released according to the agreed financing structure and applicable project milestones"],
        ]} />
      </div>
    ),
  },
  {
    id: "documents",
    heading: "Required Documents",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">Applicants may be required to provide the following documents:</p>
        <BL items={[
          ["Identification Proof", "PAN Card, Aadhaar Card, passport, or other valid identity documents of the applicant, promoters, or authorised representatives"],
          ["Address Proof", "Utility bills, rental agreement, registered office proof, or other valid address documents"],
          ["Business Proof", "Certificate of Incorporation, GST certificate, partnership deed, LLP documents, or other applicable business registration documents"],
          ["Film Project Details", "Film concept, synopsis, screenplay, project profile, production plan, and other relevant project information"],
          ["Detailed Project Report", "Project budget, production schedule, funding requirement, estimated revenues, and financial projections"],
          ["Financial Statements", "Balance sheets, profit and loss statements, Income Tax Returns, and other financial records of the production company or applicant"],
          ["Bank Statements", "Recent bank statements to assess financial transactions, cash flow, and repayment capacity"],
          ["Production Agreements", "Relevant agreements with producers, directors, actors, distributors, studios, or other parties, where applicable"],
          ["Rights & Intellectual Property Documents", "Details of ownership or rights relating to the screenplay, story, music, distribution, or other relevant intellectual property"],
          ["Existing Loan Details", "Details of existing loans, financial obligations, and outstanding liabilities, where applicable"],
          ["Security / Collateral Documents", "Details and documents relating to any collateral or other security offered for the financing, where applicable"],
          ["Other Supporting Documents", "Any additional documents required for project evaluation, verification, and credit assessment"],
        ]} />
      </div>
    ),
  },
  {
    id: "benefits",
    heading: "Benefits of Film Funding",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">Film Funding can provide several benefits to eligible applicants:</p>
        <BL items={[
          ["Production Support", "Provides financial resources for eligible film production requirements"],
          ["Project Continuity", "Helps producers manage expenses across different stages of a film project"],
          ["Working Capital Support", "Can assist with approved production-related cash-flow requirements"],
          ["Structured Funding", "Financing may be structured according to the project's production schedule and requirements"],
          ["Growth Opportunities", "Can support production companies in undertaking eligible projects that require significant upfront capital"],
          ["Financial Flexibility", "Provides an additional source of funding alongside the producer's or company's own resources"],
          ["Milestone-Based Funding", "Where applicable, staged disbursement can align funding with project progress"],
        ]} />
      </div>
    ),
  },
  {
    id: "technology",
    heading: "Role of Technology in Film Funding",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">Technology can simplify and improve the Film Funding process through:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {[
            "Digital application processing",
            "Online document submission",
            "Digital KYC and business verification",
            "Project and financial data management",
            "Digital document management",
            "Financial statement analysis",
            "Credit risk assessment",
            "Project progress monitoring",
            "Digital agreement management",
            "Funding and disbursement tracking",
            "Automated alerts and notifications",
            "Portfolio reporting and analytics",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
              <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-sm pt-1">
          Technology can help financiers evaluate project information more efficiently, improve
          documentation, and provide better visibility into funding utilisation and project
          progress.
        </p>
      </div>
    ),
  },
  {
    id: "considerations",
    heading: "Important Considerations",
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed">
          Before availing Film Funding, applicants should carefully evaluate the project's budget,
          production schedule, expected revenues, financing costs, repayment obligations, and other
          applicable terms.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Film projects can involve commercial, production, and revenue-related uncertainties.
          Changes in production schedules, project costs, distribution arrangements, or expected
          revenues may affect the project's financial position and ability to meet repayment
          obligations.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Applicants should also understand the applicable security requirements, disbursement
          conditions, project monitoring requirements, fees, financing costs, and other terms before
          entering into a financing arrangement.
        </p>
      </div>
    ),
  },
  {
    id: "conclusion",
    heading: "Conclusion",
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed">
          Film Funding provides eligible producers and production companies with access to financing
          for approved film and audiovisual projects. It can help support production-related
          expenses and manage funding requirements across different stages of a project, subject to
          the agreed financing structure.
        </p>
        <p className="text-gray-600 leading-relaxed">
          The eligible project, funding amount, financing cost, repayment requirements, security,
          disbursement schedule, and other terms are subject to the financier's policies, applicable
          regulations, project assessment, and individual credit evaluation. Apply now and let the
          right bank come to your doorstep.
        </p>
      </div>
    ),
  },
];

const FilmLoanDetail = () => (
  <ShowDetailLayout
    loanName="Film Funding"
    breadcrumb="Film Funding"
    bannerTitle="Film Funding"
    bannerTagline="Bank will come to your doorstep"
    bannerBg={bannerBg}
    docsHref="/requireddocument/film-funding"
    applySlug="filmfunding"
    sections={sections}
  />
);

export default FilmLoanDetail;
