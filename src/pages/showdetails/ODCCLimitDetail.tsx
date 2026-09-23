import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerBg from "../../assets/loan-images/business-banner.png";
import ODCCImg from "../../assets/personal-loan/business-details02.png";

const ACCENT = "#066a9c";

const BL = ({ items }: { items: (string | [string, string])[] }) => (
  <ul className="space-y-2.5 mt-1">
    {items.map((item, i) => {
      const [t, d] = Array.isArray(item) ? item : [item, undefined];
      return (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
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
    heading: "What is OD / CC Limit?",
    content: (
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        <div className="flex-1 min-w-0 space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Overdraft (OD) and Cash Credit (CC) Limit are working capital facilities designed to help
            businesses manage their day-to-day financial requirements. These facilities provide
            access to funds up to an approved limit, enabling businesses to manage temporary
            cash-flow gaps, operational expenses, inventory purchases, and other working capital
            needs.
          </p>
          <p className="text-gray-600 leading-relaxed">
            An Overdraft (OD) facility allows eligible customers to withdraw funds up to a sanctioned
            limit as required. A Cash Credit (CC) facility is generally provided to businesses to
            meet their working capital requirements and may be secured against eligible assets,
            stock, receivables, or other approved security.
          </p>
          <p className="text-gray-600 leading-relaxed">
            The sanctioned limit, interest rate, repayment terms, security requirements, and other
            conditions are determined based on the applicant's financial profile, business
            requirements, credit assessment, and applicable lending policies.
          </p>
        </div>
        <div className="flex-shrink-0 w-full lg:w-80">
          <img src={ODCCImg} alt="OD CC Limit"
            className="w-full h-72 object-contain grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
      </div>
    ),
  },
  {
    id: "features",
    heading: "Features of OD / CC Limit",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">
          OD/CC facilities offer businesses flexible access to working capital according to their
          operational requirements. Key features may include:
        </p>
        <BL items={[
          "Access to funds up to an approved limit",
          "Flexible utilisation of available funds",
          "Support for short-term working capital requirements",
          "Assistance in managing cash-flow fluctuations",
          "Funding support for inventory and operational expenses",
          "Facility terms based on the applicant's financial and credit profile",
          "Security or collateral may be required depending on the facility and lender's assessment",
          "Periodic review of the sanctioned limit may be applicable",
        ]} />
      </div>
    ),
  },
  {
    id: "eligibility",
    heading: "Eligibility for OD / CC Limit",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">
          OD/CC facilities are generally intended for businesses that require working capital to
          manage their regular operations. Eligible applicants may include:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
          {[
            "Manufacturers",
            "Traders",
            "Wholesalers",
            "Retailers",
            "Distributors",
            "Service Providers",
            "MSMEs",
            "Partnership Firms",
            "LLPs",
            "Private Limited Companies",
            "Other eligible business entities",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
              <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-sm pt-1">
          Eligibility is generally assessed based on factors such as business vintage, turnover,
          profitability, banking history, credit profile, existing liabilities, cash flow, working
          capital requirements, and available security.
        </p>
      </div>
    ),
  },
  {
    id: "process",
    heading: "Application Process",
    content: (
      <BL items={[
        ["Application Submission", "The applicant provides basic personal, business, financial, and facility-related information"],
        ["Documentation", "Required KYC, business, financial, banking, and security documents are submitted"],
        ["Verification", "Submitted information and documents are verified"],
        ["Financial Assessment", "The applicant's financial performance, cash flow, turnover, existing liabilities, and working capital requirements are assessed"],
        ["Credit Assessment", "Credit history, repayment capacity, and overall risk profile are evaluated"],
        ["Security Assessment", "Where applicable, the proposed collateral or security is evaluated"],
        ["Approval", "Based on the assessment, the applicable limit and facility terms are determined"],
        ["Documentation & Activation", "After approval and completion of the required documentation, the OD/CC facility is activated as per the sanctioned terms"],
      ]} />
    ),
  },
  {
    id: "documents",
    heading: "Required Documents",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">Applicants may be required to provide the following documents:</p>
        <BL items={[
          ["Identification Proof", "PAN Card, Aadhaar Card, passport, or other valid identity documents"],
          ["Address Proof", "Utility bills, rental agreement, business address proof, or other valid documents"],
          ["Business Proof", "Business registration certificate, GST certificate, Udyam Registration, partnership deed, incorporation documents, or other applicable business documents"],
          ["Income & Financial Proof", "Income Tax Returns, balance sheets, profit and loss statements, GST returns, and other financial records"],
          ["Bank Statements", "Recent bank statements to assess banking transactions and cash-flow patterns"],
          ["Existing Loan Details", "Details of existing loans, OD/CC facilities, outstanding balances, and repayment obligations"],
          ["Security / Collateral Documents", "Property documents, stock details, receivables, valuation reports, or other applicable security documents"],
          ["Other Supporting Documents", "Any additional documents required for credit assessment and verification"],
        ]} />
      </div>
    ),
  },
  {
    id: "benefits",
    heading: "Benefits of OD / CC Limit",
    content: (
      <BL items={[
        ["Flexible Working Capital", "Access funds according to business requirements within the approved limit"],
        ["Cash-Flow Management", "Helps businesses manage temporary gaps between receivables and payments"],
        ["Operational Support", "Can support eligible day-to-day business expenses and working capital requirements"],
        ["Inventory Management", "Helps businesses manage inventory and supplier payment requirements"],
        ["Business Continuity", "Provides additional financial flexibility for regular business operations"],
        ["Growth Support", "Adequate working capital can help businesses manage expansion and increasing operational requirements"],
      ]} />
    ),
  },
  {
    id: "technology",
    heading: "Role of Technology in OD / CC Management",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">
          Technology plays an important role in improving the management of OD/CC facilities through:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {[
            "Digital application processing",
            "Online document submission",
            "Automated data verification",
            "Financial data analysis",
            "Bank statement analysis",
            "Credit risk assessment",
            "Application status tracking",
            "Digital document management",
            "Limit monitoring",
            "Automated notifications",
            "Portfolio reporting and analytics",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
              <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-sm pt-1">
          These technologies can help improve transparency, reduce processing time, and provide
          better visibility into the customer's financial and credit profile.
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
          OD and CC facilities provide businesses with flexible working capital support to manage
          day-to-day financial requirements and cash-flow fluctuations. By combining appropriate
          credit assessment, proper documentation, responsible utilisation, and effective
          monitoring, these facilities can help businesses maintain smooth operations and manage
          their working capital more efficiently.
        </p>
        <p className="text-gray-600 leading-relaxed">
          The availability, eligibility, sanctioned limit, interest rate, security requirements, and
          other terms are subject to the applicable lender policies and assessment criteria. Apply
          now and let the right bank come to your doorstep.
        </p>
      </div>
    ),
  },
];

const ODCCLimitDetail = () => (
  <ShowDetailLayout
    loanName="OD CC Limit"
    breadcrumb="OD CC Limit"
    bannerTitle="OD / CC Limit"
    bannerTagline="Now, Right Bank will come to your doorstep"
    bannerBg={bannerBg}
    docsHref="/requireddocument/od-cc-limit"
    applySlug="odcclimit"
    sections={sections}
  />
);

export default ODCCLimitDetail;
