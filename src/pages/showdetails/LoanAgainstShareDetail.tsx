import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerBg from "../../assets/loan-images/AgainstProperty-banner.png";
import LASImg from "../../assets/personal-loan/againstloan-details.png";

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
    heading: "What is Loan Against Shares?",
    content: (
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        <div className="flex-1 min-w-0 space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Loan Against Shares (LAS) is a secured financing facility that allows eligible
            individuals or businesses to raise funds by pledging eligible shares as security with a
            lender. Instead of selling their investments, borrowers can use the value of their
            eligible shares to access funds for approved financial requirements.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Under a Loan Against Shares facility, the lender determines the eligible value of the
            pledged shares and provides a loan or credit limit based on applicable lending criteria
            and margin requirements. The shares remain subject to the lender's security interest
            until the loan is repaid as per the agreed terms.
          </p>
          <p className="text-gray-600 leading-relaxed">
            The sanctioned loan amount, interest rate, eligible securities, margin requirements,
            tenure, and other conditions depend on the lender's assessment and applicable policies.
          </p>
        </div>
        <div className="shrink-0 w-full lg:w-80">
          <img src={LASImg} alt="Loan Against Share"
            className="w-full h-72 object-contain grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
      </div>
    ),
  },
  {
    id: "features",
    heading: "Features of Loan Against Shares",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">
          Loan Against Shares offers several features designed to provide liquidity against eligible
          investments:
        </p>
        <BL items={[
          "Access to funds without immediately selling eligible shares",
          "Shares can be used as collateral for obtaining financing",
          "Loan amount is determined based on the eligible value of the pledged securities",
          "Flexible financing options may be available depending on the lender and facility structure",
          "Interest is charged according to the applicable loan terms",
          "The facility may have a defined tenure or approved credit limit",
          "The value of pledged shares may be monitored periodically",
          "Additional margin or repayment may be required if the value of the pledged securities falls below the required level",
        ]} />
      </div>
    ),
  },
  {
    id: "eligibility",
    heading: "Eligibility for Loan Against Shares",
    content: (
      <div className="space-y-4">
        <div>
          <p className="text-gray-500 text-sm mb-2">Loan Against Shares may be available to eligible:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
            {[
              "Salaried Individuals",
              "Self-Employed Individuals",
              "Business Owners",
              "Professionals",
              "Investors",
              "Other eligible applicants",
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
              "Applicant's age and profile",
              "Credit history",
              "Income and repayment capacity",
              "Ownership of eligible securities",
              "Value of pledged shares",
              "Type of shares/securities",
              "Applicable margin requirements",
              "Existing financial obligations",
              "Lender's internal policies",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
                <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Only securities that meet the lender's eligibility criteria may be accepted as collateral.
        </p>
      </div>
    ),
  },
  {
    id: "process",
    heading: "Application Process",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">The application process generally involves the following steps:</p>
        <BL items={[
          ["Application Submission", "The applicant provides personal, financial, and investment-related details"],
          ["KYC Verification", "Identity and address information is verified"],
          ["Demat Verification", "The applicant's demat account and eligible securities are reviewed"],
          ["Security Assessment", "The eligible value of the proposed shares is determined"],
          ["Credit Assessment", "The applicant's financial profile and repayment capacity are assessed"],
          ["Pledge of Shares", "Eligible shares are pledged in favour of the lender as security"],
          ["Approval", "The applicable loan amount, interest rate, margin, and other terms are determined"],
          ["Disbursement", "After completion of the required documentation and pledge process, the approved funds are made available as per the facility terms"],
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
          ["Identification Proof", "PAN Card, Aadhaar Card, passport, or other valid identity documents"],
          ["Address Proof", "Utility bills, rental agreement, or other valid address documents"],
          ["Income Proof", "Salary slips, Income Tax Returns, bank statements, or other income-related documents, where applicable"],
          ["Bank Statements", "Recent bank statements to assess financial transactions and repayment capacity"],
          ["Demat Account Details", "Demat account statement and details of the securities proposed to be pledged"],
          ["Shareholding / Investment Details", "Details of eligible shares and securities held by the applicant"],
          ["Financial Documents", "Relevant financial statements or other documents where required"],
          ["Existing Loan Details", "Details of existing loans or financial obligations, where applicable"],
          ["Security / Pledge Documents", "Documents and declarations required for pledging the eligible shares"],
          ["Other Supporting Documents", "Any additional documents required for verification and credit assessment"],
        ]} />
      </div>
    ),
  },
  {
    id: "benefits",
    heading: "Benefits of Loan Against Shares",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">Loan Against Shares can provide several benefits to eligible borrowers:</p>
        <BL items={[
          ["Access to Liquidity", "Provides funds against eligible investments without requiring an immediate sale of the shares"],
          ["Investment Continuity", "Allows borrowers to retain their investments while accessing financing, subject to the facility terms"],
          ["Flexible Financial Support", "Can help meet eligible personal or business financial requirements"],
          ["Quick Access to Funds", "The process can be streamlined when eligible securities and required documentation are readily available"],
          ["Secured Financing", "Shares serve as collateral for the facility"],
          ["Potentially Lower Cost", "As a secured facility, pricing may be more favourable than some unsecured borrowing options, subject to lender terms"],
        ]} />
      </div>
    ),
  },
  {
    id: "technology",
    heading: "Role of Technology in Share-Backed Lending",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">
          Technology can simplify and improve the share-backed lending process through:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {[
            "Digital KYC verification",
            "Online application processing",
            "Demat account verification",
            "Digital pledge management",
            "Real-time or periodic securities valuation",
            "Automated margin monitoring",
            "Credit assessment",
            "Digital document management",
            "Loan status tracking",
            "Automated alerts and notifications",
            "Portfolio and risk monitoring",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
              <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-sm pt-1">
          Technology helps lenders monitor the value of pledged securities and manage the facility
          more efficiently.
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
          Before taking a Loan Against Shares, applicants should understand that the value of shares
          can fluctuate. If the market value of pledged securities falls significantly, the borrower
          may be required to provide additional security, repay part of the outstanding amount, or
          maintain the required margin as specified by the lender.
        </p>
        <p className="text-gray-600 leading-relaxed">
          The lender may also have the right to take appropriate action against the pledged
          securities in accordance with the applicable agreement and regulations if the borrower
          fails to meet the required obligations.
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
          Loan Against Shares provides eligible borrowers with a way to access funds by using
          eligible shares as collateral. It can offer financial flexibility while allowing borrowers
          to retain their investments, subject to the terms of the facility.
        </p>
        <p className="text-gray-600 leading-relaxed">
          The eligible securities, loan amount, margin, interest rate, tenure, repayment
          requirements, and other terms are subject to the lender's policies, applicable
          regulations, and individual credit assessment. Apply now and let the right bank come to
          your doorstep.
        </p>
      </div>
    ),
  },
];

const LoanAgainstShareDetail = () => (
  <ShowDetailLayout
    loanName="Loan Against Share"
    breadcrumb="Loan Against Share"
    bannerTitle="Loan Against Share"
    bannerTagline="Now, Right Bank will come to your doorstep"
    bannerBg={bannerBg}
    docsHref="/requireddocument/loan-against-share"
    applySlug="loanagainstshare"
    sections={sections}
  />
);

export default LoanAgainstShareDetail;
