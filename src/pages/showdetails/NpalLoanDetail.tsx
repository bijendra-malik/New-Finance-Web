import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerBg from "../../assets/loan-images/commercial-banner.png";

const ACCENT = "#066a9c";

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
    heading: "What is an NPA (Non-Performing Asset)?",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Non-performing assets (NPAs) represent loans or advances that no longer generate income for
        the lender — in simpler terms, borrowers have ceased paying interest or repaying the
        principal amount on these assets. NPAs hold significant importance within the banking
        sector, directly impacting the financial health and stability of banks. An NPA Loan
        from Indexia Finance helps eligible borrowers and businesses address stressed accounts
        through structured financing solutions.
      </p>
    ),
  },
  {
    id: "measures",
    heading: "Measures to Tackle NPAs",
    content: (
      <p className="text-gray-600 leading-relaxed">
        To effectively address NPAs, various measures are employed, including regulatory
        interventions, loan restructuring, and asset quality reviews. Regulatory bodies implement
        policies to strengthen risk management practices and ensure compliance with lending
        standards. Banks undertake initiatives to restructure loans, providing relief to borrowers
        facing financial difficulties. Asset quality reviews enable banks to accurately identify and
        classify NPAs, allowing for timely corrective actions.
      </p>
    ),
  },
  {
    id: "technology",
    heading: "Role of Technology in NPA Management",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Technology plays a crucial role in managing NPAs by facilitating data analytics, digital
        lending platforms, and risk management systems. Data analytics tools help banks analyse
        customer behaviour, assess creditworthiness, and predict loan defaults. Digital lending
        platforms streamline the loan application process, enhancing transparency and improving the
        customer experience. Risk management systems enable banks to monitor and mitigate credit
        risks associated with NPAs effectively.
      </p>
    ),
  },
  {
    id: "process",
    heading: "Application Process for NPA",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">The application process for NPAs involves several steps:</p>
        <BL items={[
          ["Documentation Required", "Applicants must gather necessary documents to support their NPA application"],
          ["Eligibility Criteria", "Banks typically establish specific eligibility criteria regarding creditworthiness, business viability, and adherence to regulatory guidelines"],
          ["Approval Process", "Once the application is submitted along with the required documents, it undergoes a thorough review by the bank's credit assessment team — the approval process may vary based on the type and amount of the loan"],
        ]} />
      </div>
    ),
  },
  {
    id: "documents",
    heading: "Required Documents for NPA Application",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">When applying for an NPA, applicants must provide the following documents:</p>
        <BL items={[
          ["Identification Proof", "A valid identification document such as a passport or driver's licence"],
          ["Address Proof", "Documents like utility bills or rental agreements to verify the applicant's residential address"],
          ["Income Proof", "Salary slips or income tax returns to assess the applicant's financial stability and repayment capacity"],
          ["Business Proof", "For business loans, documents like business registration certificates or GST certificates to validate the existence and legality of the business"],
          ["Financial Statements", "Balance sheets and profit and loss statements to demonstrate financial health and business performance"],
        ]} />
      </div>
    ),
  },
  {
    id: "benefits",
    heading: "Benefits of Taking NPA",
    content: (
      <BL items={[
        ["Access to Funds", "NPAs provide access to much-needed funds for various purposes, including business expansion and infrastructure development"],
        ["Flexible Repayment Options", "Borrowers benefit from flexible repayment terms tailored to their financial capabilities and business cycles, reducing the burden of repayment"],
        ["Potential for Business Growth", "Proper utilisation of NPA funds can catalyse business growth, leading to increased revenue generation and market expansion opportunities"],
      ]} />
    ),
  },
  {
    id: "best-options",
    heading: "Choosing the Right NPA Partner",
    content: (
      <div className="space-y-5">
        {[
          { num: "1", title: "Best Non-Performing Assets Provider", desc: "Renowned for its expertise in managing distressed assets and maximising recovery outcomes, with a track record of success and a proactive approach to NPA resolution." },
          { num: "2", title: "Best Non-Performing Company", desc: "Known for its extensive portfolio of distressed assets and innovative strategies for asset disposition — tailored solutions whether offloading NPAs or seeking opportunities in distressed assets." },
          { num: "3", title: "Best Non-Performing Assets Company", desc: "Combines industry experience, financial acumen, and strategic insights to deliver superior results, with a focus on transparency, integrity, and client satisfaction." },
          { num: "4", title: "Best Non-Performing Assets Solutions", desc: "Tailored to your specific requirements — asset recovery services, portfolio management assistance, or investment opportunities in distressed assets, with a collaborative approach to optimise returns." },
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
    heading: "Conclusion",
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed">
          NPAs pose significant challenges to the banking sector and the broader economy. However,
          with effective measures such as regulatory interventions, technological advancements, and
          prudent risk management practices, NPAs can be managed and mitigated. Collaboration among
          banks, regulators, and borrowers is essential in addressing NPAs to ensure a stable and
          resilient financial system.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Navigating the landscape of non-performing assets requires expertise, diligence, and
          strategic planning. Apply for an NPA Loan with Indexia Finance today — apply now
          and let the right bank come to your doorstep.
        </p>
      </div>
    ),
  },
];

const NpalLoanDetail = () => (
  <ShowDetailLayout
    loanName="NPA"
    breadcrumb="NPA"
    bannerTitle="NPA (Non-Performing Assets)"
    bannerTagline="Now, Right Bank will come to your doorstep"
    bannerBg={bannerBg}
    applySlug="npa"
    docsHref="/requireddocument/npa"
    sections={sections}
  />
);

export default NpalLoanDetail;
