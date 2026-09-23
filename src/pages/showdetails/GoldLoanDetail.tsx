import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerBg from "../../assets/loan-images/personal-banner.png";

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
    heading: "What is Gold Loan?",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 leading-relaxed">
          A Gold Loan is a secured financing facility that allows eligible individuals to raise
          funds by pledging eligible gold jewellery or other approved gold assets as security with a
          lender. Instead of selling their gold, borrowers can use its value to access funds for
          approved personal, business, or other financial requirements.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Under a Gold Loan facility, the lender assesses the purity and value of the pledged gold
          and determines the eligible loan amount based on applicable lending criteria, valuation,
          and margin requirements. The gold remains in the lender's custody as security until the
          loan is repaid as per the agreed terms.
        </p>
        <p className="text-gray-600 leading-relaxed">
          The sanctioned loan amount, interest rate, eligible gold items, margin requirements,
          tenure, repayment schedule, and other conditions depend on the lender's assessment and
          applicable policies.
        </p>
      </div>
    ),
  },
  {
    id: "features",
    heading: "Features of Gold Loan",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">
          Gold Loan offers several features designed to provide liquidity against eligible gold
          assets:
        </p>
        <BL items={[
          "Access to funds without immediately selling eligible gold",
          "Gold jewellery or other approved gold assets can be used as collateral for obtaining financing",
          "Loan amount is determined based on the assessed value and eligibility of the pledged gold",
          "Flexible financing options may be available depending on the lender and facility structure",
          "Interest is charged according to the applicable loan terms",
          "The facility may have a defined tenure and repayment schedule",
          "Gold is held by the lender as security during the loan period",
          "Additional repayment or other action may be required if the borrower fails to meet the agreed repayment obligations",
        ]} />
      </div>
    ),
  },
  {
    id: "eligibility",
    heading: "Eligibility for Gold Loan",
    content: (
      <div className="space-y-4">
        <div>
          <p className="text-gray-500 text-sm mb-2">Gold Loans may be available to eligible:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
            {[
              "Salaried Individuals",
              "Self-Employed Individuals",
              "Business Owners",
              "Professionals",
              "Individuals with eligible gold assets",
              "Other eligible applicants",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
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
              "Credit history, where applicable",
              "Income and repayment capacity",
              "Ownership of eligible gold",
              "Purity and quality of the gold",
              "Assessed value of the pledged gold",
              "Type of gold jewellery or approved gold assets",
              "Existing financial obligations",
              "Lender's internal policies",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
                <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Only gold assets that meet the lender's eligibility and valuation criteria may be accepted
          as collateral.
        </p>
      </div>
    ),
  },
  {
    id: "process",
    heading: "Application Process for Gold Loan",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">The application process generally involves the following steps:</p>
        <BL items={[
          ["Application Submission", "The applicant provides personal, financial, and loan-related details"],
          ["KYC Verification", "Identity and address information is verified"],
          ["Gold Assessment", "The proposed gold is examined to determine its purity, quality, weight, and eligible value"],
          ["Security Assessment", "The lender determines the eligible loan amount based on the assessed value of the gold and applicable margin requirements"],
          ["Credit Assessment", "The applicant's financial profile and repayment capacity are assessed, where applicable"],
          ["Pledge of Gold", "The eligible gold is deposited and pledged in favour of the lender as security"],
          ["Approval", "The applicable loan amount, interest rate, tenure, repayment terms, and other conditions are determined"],
          ["Disbursement", "After completion of the required documentation and security process, the approved funds are made available as per the facility terms"],
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
          ["Bank Statements", "Recent bank statements to assess financial transactions and repayment capacity, where required"],
          ["Gold Ownership Details", "Documents or declarations establishing ownership of the gold proposed to be pledged, where applicable"],
          ["Gold / Security Details", "Details of the jewellery or other eligible gold assets proposed as security"],
          ["Existing Loan Details", "Details of existing loans or financial obligations, where applicable"],
          ["Valuation Documents", "Gold valuation or appraisal documents, where required by the lender"],
          ["Other Supporting Documents", "Any additional documents required for verification and credit assessment"],
        ]} />
      </div>
    ),
  },
  {
    id: "benefits",
    heading: "Benefits of Gold Loan",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">Gold Loans can provide several benefits to eligible borrowers:</p>
        <BL items={[
          ["Access to Liquidity", "Provides funds against eligible gold without requiring an immediate sale of the asset"],
          ["Retention of Gold Ownership", "Allows borrowers to retain their gold, subject to repayment of the loan and applicable terms"],
          ["Secured Financing", "Gold serves as collateral for the facility"],
          ["Flexible Financial Support", "Can help meet eligible personal, business, or other financial requirements"],
          ["Potentially Faster Processing", "The process can be streamlined when eligible gold and required documentation are readily available"],
          ["Collateral-Based Financing", "Financing is primarily supported by the value of the pledged gold, subject to lender assessment"],
          ["Repayment Flexibility", "Different repayment structures may be available depending on the lender and facility terms"],
        ]} />
      </div>
    ),
  },
  {
    id: "technology",
    heading: "Role of Technology in Gold Loan Management",
    content: (
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">Technology can simplify and improve the Gold Loan process through:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {[
            "Digital KYC verification",
            "Online application processing",
            "Digital document submission",
            "Gold valuation and assessment systems",
            "Digital loan documentation",
            "Automated credit assessment",
            "Loan account management",
            "Digital repayment facilities",
            "Application and loan status tracking",
            "Automated alerts and notifications",
            "Security and collateral records management",
            "Portfolio and risk monitoring",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
              <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-sm pt-1">
          Technology helps lenders improve operational efficiency, maintain accurate records, and
          provide better visibility into loan applications and accounts.
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
          Before taking a Gold Loan, applicants should understand the repayment obligations,
          applicable interest charges, tenure, and other terms of the facility. The eligible loan
          amount depends on the assessed value and eligibility of the pledged gold and the lender's
          applicable margin requirements.
        </p>
        <p className="text-gray-600 leading-relaxed">
          The borrower is required to meet the repayment obligations within the agreed terms. If the
          borrower fails to repay the loan as required, the lender may take appropriate action
          against the pledged gold in accordance with the loan agreement and applicable regulations.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Applicants should also understand all applicable charges, repayment conditions, valuation
          requirements, and other terms before availing the facility.
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
          Gold Loan provides eligible borrowers with a way to access funds by using eligible gold
          assets as collateral. It can offer financial flexibility while allowing borrowers to
          retain their gold, subject to the terms of the facility.
        </p>
        <p className="text-gray-600 leading-relaxed">
          The eligible gold, loan amount, margin, interest rate, tenure, repayment requirements,
          applicable charges, and other terms are subject to the lender's policies, applicable
          regulations, and individual assessment. Apply now and let the right bank come to your
          doorstep.
        </p>
      </div>
    ),
  },
];

const GoldLoanDetail = () => (
  <ShowDetailLayout
    loanName="Gold Loan"
    breadcrumb="Gold Loan"
    bannerTitle="Gold Loan"
    bannerTagline="Now, Right Bank will come to your doorstep"
    bannerBg={bannerBg}
    applySlug="goldloan"
    sections={sections}
  />
);

export default GoldLoanDetail;
