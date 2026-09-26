import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerBg from "../../assets/loan-images/construction-banner.png";

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
    heading: "What is FDI?",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 leading-relaxed">
          Foreign Direct Investment (FDI) is an investment made by a person or entity resident
          outside India into an Indian company or eligible Indian business structure. FDI enables
          foreign investors to participate in Indian businesses by investing in eligible capital
          instruments, subject to applicable laws, sectoral conditions, investment limits, and
          regulatory requirements.
        </p>
        <p className="text-gray-600 leading-relaxed">
          FDI can provide Indian businesses with access to foreign capital, international expertise,
          technology, business networks, and potential opportunities for expansion. The investment
          may be made through the Automatic Route or Government Route, depending on the sector,
          investment amount, and applicable conditions. Under the Automatic Route, prior Government
          approval is generally not required, while investments under the Government Route require
          prior Government approval.
        </p>
        <p className="text-gray-600 leading-relaxed">
          The permitted investment amount, sectoral cap, entry route, pricing requirements,
          reporting obligations, security conditions, and other requirements depend on the nature of
          the business, applicable regulations, and the investor and investee company's
          circumstances.
        </p>
      </div>
    ),
  },
  {
    id: "features",
    heading: "Features of FDI",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">
          Foreign Direct Investment offers several features that support international investment
          into eligible Indian businesses:
        </p>
        <BL items={[
          "Enables foreign investors to invest capital into eligible Indian businesses",
          "Can provide access to long-term foreign capital",
          "May support business expansion, infrastructure development, and growth initiatives",
          "Can facilitate access to international technology, expertise, and business networks",
          "Investment may be made through the Automatic Route or Government Route, depending on the applicable sector and conditions",
          "Investment is subject to applicable sectoral caps and statutory limits",
          "Foreign investment may be subject to pricing guidelines and other regulatory conditions",
          "Reporting and compliance requirements may apply to the Indian investee company and other relevant parties",
        ]} />
      </div>
    ),
  },
  {
    id: "eligibility",
    heading: "Eligibility for FDI",
    content: (
      <div className="space-y-4">
        <div>
          <p className="text-gray-500 text-sm mb-2">FDI may be available to eligible:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
            {[
              "Foreign Individuals",
              "Foreign Companies",
              "Foreign Investment Entities",
              "Foreign Institutional / Investment Entities, where permitted",
              "Other eligible persons or entities resident outside India",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
                <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-gray-500 text-sm mb-2">Eligibility and permitted investment may depend on:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
            {[
              "Nature of the proposed business activity",
              "Investor's residential status and legal structure",
              "Indian company's legal structure",
              "Applicable sectoral cap",
              "Applicable entry route",
              "Ownership and control structure",
              "Foreign investment regulations",
              "Security and regulatory conditions",
              "Applicable pricing requirements",
              "Government or regulatory approvals, where required",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
                <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Foreign investment is permitted up to applicable limits in eligible sectors, subject to
          the relevant laws, regulations, sectoral caps, and conditions.
        </p>
      </div>
    ),
  },
  {
    id: "process",
    heading: "FDI Investment Process",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">The investment process generally involves the following steps:</p>
        <BL items={[
          ["Investment Planning", "The foreign investor and Indian company determine the proposed investment structure, amount, ownership, and business objectives"],
          ["Eligibility Assessment", "The proposed business activity is reviewed to determine whether foreign investment is permitted and what conditions apply"],
          ["Entry Route Assessment", "The investment is assessed to determine whether it falls under the Automatic Route or Government Route"],
          ["Sectoral Cap Assessment", "The applicable foreign investment limit and sector-specific conditions are determined"],
          ["Due Diligence", "The investor and Indian company may conduct legal, financial, commercial, and regulatory due diligence"],
          ["Valuation & Pricing", "The applicable valuation and pricing requirements are assessed"],
          ["Approvals", "Where required, applicable Government or regulatory approvals are obtained"],
          ["Investment & Share Issuance / Transfer", "The investment is made and the relevant capital instruments are issued or transferred in accordance with applicable requirements"],
          ["Regulatory Reporting", "Required investment details and transaction-related information are reported to the relevant authorities within the prescribed timelines"],
          ["Post-Investment Compliance", "The Indian investee company continues to comply with applicable FDI, corporate, tax, regulatory, and reporting requirements"],
        ]} />
      </div>
    ),
  },
  {
    id: "documents",
    heading: "Required Documents",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">The investor and Indian investee company may be required to provide the following documents:</p>
        <BL items={[
          ["Investor Identification Proof", "Passport, certificate of incorporation, registration documents, or other valid identification documents of the foreign investor"],
          ["Address Proof", "Registered office address, utility documents, or other applicable address verification documents"],
          ["Company Documents", "Certificate of Incorporation, Memorandum and Articles of Association, PAN, GST registration, and other applicable corporate documents"],
          ["Board / Shareholder Approvals", "Board resolutions, shareholder resolutions, or other approvals required for the proposed investment"],
          ["Investment Details", "Details of the proposed investment amount, capital instruments, ownership structure, and proposed shareholding"],
          ["Business Plan", "Business profile, proposed activities, expansion plans, financial projections, and other relevant business information"],
          ["Financial Statements", "Audited financial statements, balance sheets, profit and loss statements, and other relevant financial records"],
          ["Valuation Report", "Valuation or pricing-related documents, where applicable"],
          ["Ownership & Control Details", "Details of the investor's ownership structure, beneficial ownership, and controlling parties, where required"],
          ["Government / Regulatory Approvals", "Applicable approvals or supporting documents where the investment falls under the Government Route or requires specific regulatory clearances"],
          ["Existing Investment Details", "Details of existing foreign investments, shareholding, or other relevant investments, where applicable"],
          ["Other Supporting Documents", "Any additional documents required for regulatory compliance, due diligence, verification, and reporting"],
        ]} />
      </div>
    ),
  },
  {
    id: "benefits",
    heading: "Benefits of FDI",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">FDI can provide several benefits to eligible businesses and the broader economy:</p>
        <BL items={[
          ["Access to Foreign Capital", "Provides Indian businesses with access to international sources of capital"],
          ["Business Expansion", "Can support expansion into new markets, products, and business segments"],
          ["Technology Access", "Foreign investment can facilitate access to international technologies and technical expertise"],
          ["Global Expertise", "Can provide access to international management practices, knowledge, and industry experience"],
          ["International Networks", "May help businesses establish relationships with global partners, suppliers, and markets"],
          ["Employment Opportunities", "Expansion supported by foreign investment can contribute to employment generation"],
          ["Long-Term Growth", "Foreign capital and strategic participation can support the long-term development of eligible businesses"],
        ]} />
      </div>
    ),
  },
  {
    id: "technology",
    heading: "Role of Technology in FDI Management",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">Technology can simplify and improve the FDI investment and compliance process through:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {[
            "Digital investor onboarding",
            "Digital KYC and identity verification",
            "Online document submission",
            "Investment structure management",
            "Digital due diligence",
            "Automated regulatory checks",
            "Cap table and ownership tracking",
            "Digital valuation documentation",
            "Regulatory reporting management",
            "Compliance monitoring",
            "Investment status tracking",
            "Automated alerts and notifications",
            "Financial and portfolio reporting",
            "Document and agreement management",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
              <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-sm pt-1">
          Technology can help investors and Indian companies maintain accurate investment records,
          improve compliance visibility, and streamline documentation and reporting processes.
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
          Before making or accepting an FDI investment, investors and Indian companies should
          understand the applicable sectoral cap, entry route, pricing requirements, ownership and
          control conditions, reporting obligations, and other regulatory requirements.
        </p>
        <p className="text-gray-600 leading-relaxed">
          FDI regulations can vary depending on the sector and structure of the proposed investment.
          Some sectors may permit foreign investment through the Automatic Route, while others may
          require prior Government approval or additional conditions.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Investors and investee companies should also consider applicable tax, corporate, foreign
          exchange, beneficial ownership, security, and other regulatory requirements before
          proceeding with the investment.
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
          Foreign Direct Investment (FDI) provides eligible foreign investors with an opportunity to
          invest in Indian businesses while enabling Indian companies to access international
          capital, expertise, technology, and global business networks.
        </p>
        <p className="text-gray-600 leading-relaxed">
          The permitted investment amount, sectoral cap, entry route, ownership structure,
          approvals, pricing requirements, reporting obligations, and other conditions are subject
          to applicable Indian laws, regulations, sector-specific policies, and the circumstances of
          the investment. Apply now and let the right bank come to your doorstep.
        </p>
      </div>
    ),
  },
];

const FDIDetail = () => (
  <ShowDetailLayout
    loanName="FDI"
    breadcrumb="FDI"
    bannerTitle="Foreign Direct Investment (FDI)"
    bannerTagline="Now, Right Bank will come to your doorstep"
    bannerBg={bannerBg}
    applySlug="fdi"
    docsHref="/requireddocument/fdi"
    sections={sections}
  />
);

export default FDIDetail;
