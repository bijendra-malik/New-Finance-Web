import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerBg from "../../assets/loan-images/personal-banner.png";
import personaldetails from "../../assets/personal-loan/personal-loan.png";

const ACCENT = "#066a9c";

const BulletList = ({ items }: { items: [string, string][] }) => (
  <ul className="space-y-2.5 mt-1">
    {items.map(([title, desc]) => (
      <li key={title} className="flex items-start gap-3">
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
        <span className="text-sm md:text-base text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-800">{title}: </span>{desc}
        </span>
      </li>
    ))}
  </ul>
);

const sections: DetailSection[] = [
  {
    id: "what-is",
    heading: "What is a Personal Loan?",
    content: (
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-25">
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 leading-relaxed">
            A Personal Loan is an unsecured loan — no collateral needed — designed to cover a wide
            range of financial needs: weddings, holidays, medical emergencies, home renovation, or
            purchasing consumer durables. You can access anywhere from{" "}
            <strong className="text-gray-800">₹50,000 to ₹30 lakh</strong> with repayment tenures of{" "}
            <strong className="text-gray-800">1 to 5 years</strong>, all through a fast, paperless process.
          </p>
        </div>
        <div className="shrink-0 w-full lg:w-80">
          <img
            src={personaldetails}
            alt="Personal Loan"
            className="w-full h-85 object-contain grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>
        
      </div>
    ),
  },
  {
    id: "choosing",
    heading: "Choosing the Right Personal Loan",
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed">
          The key to securing the best personal loan lies in making an informed decision. Focus on
          interest rates, repayment terms, and associated fees — all factors that directly affect
          your total cost of borrowing.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Start by assessing your financial situation: how much do you need, and how comfortably
          can you repay? Understanding your repayment capacity upfront helps you avoid over-borrowing
          and ensures you choose a tenure that doesn't strain your monthly budget.
        </p>
      </div>
    ),
  },
  {
    id: "providers",
    heading: "Top Personal Loan Providers",
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed">
          Indexia Finance has partnered with a curated network of personal loan providers —
          evaluated on customer satisfaction, disbursal speed, interest rates, and transparency.
        </p>
        <p className="text-gray-600 leading-relaxed">
          From established banks to modern digital lenders, the options span a wide spectrum.
          Whether you prioritise low interest rates, fast approvals, or a dedicated relationship
          manager, there is a provider that fits your needs.
        </p>
      </div>
    ),
  },
  {
    id: "companies",
    heading: "Navigating Personal Loan Companies",
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed">
          Trust is paramount when choosing a lending company. Look beyond just the rate — evaluate
          reputation, customer service quality, grievance redressal, and any additional perks such
          as prepayment flexibility or financial education resources.
        </p>
        <p className="text-gray-600 leading-relaxed">
          The right company aligns with your values: transparent terms, ethical lending practices,
          and a support team that guides you from application to final repayment.
        </p>
      </div>
    ),
  },
  {
    id: "benefits",
    heading: "Benefits of Personal Loans",
    content: (
      <ol className="space-y-3 mt-1">
        {[
          ["No Collateral Required", "Fully unsecured — no property, gold, or guarantor needed."],
          ["Streamlined Documentation", "Minimal paperwork with digital KYC and e-signature support."],
          ["Complete Usage Freedom", "Spend the funds however you need — banks only evaluate repayment capacity."],
          ["High Loan Amounts", "Access up to ₹30 lakh to meet large financial requirements."],
        ].map(([title, desc], i) => (
          <li key={title} className="flex items-start gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5" style={{ background: ACCENT }}>
              {i + 1}
            </span>
            <span className="text-sm md:text-base text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-800">{title}: </span>{desc}
            </span>
          </li>
        ))}
      </ol>
    ),
  },
  {
    id: "comparing",
    heading: "Comparing Indexia Finance Personal Loans",
    content: (
      <BulletList
        items={[
          ["Interest Rates", "Compare rates across our partner banks to find the most competitive option."],
          ["Additional Charges", "Factor in processing fees, prepayment penalties, and documentation fees."],
          ["Total Loan Cost", "Calculate the full cost of the loan — not just the interest rate."],
          ["EMIs", "Use our EMI Calculator to compare monthly instalment plans side by side."],
          ["Loan Tenure", "A shorter tenure means higher EMIs but less total interest paid, and vice versa."],
          ["Eligibility", "Criteria differ for salaried and self-employed individuals — check before applying."],
        ]}
      />
    ),
  },
  {
    id: "charges",
    heading: "Charges Involved in Personal Loans",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 text-sm md:text-base">
          Beyond the interest rate, several charges can affect the total cost of your loan.
          Always read the fine print before signing.
        </p>
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          {[
            ["Processing Fee", "1 – 3% of the loan amount"],
            ["Prepayment Fee", "2 – 5% of the outstanding principal"],
            ["Late Payment Penalty", "2 – 3% of the overdue EMI"],
            ["Cheque Bounce Charges", "₹250 – ₹750 per instance"],
            ["Documentation Charges", "₹500 – ₹3,000 (varies by lender)"],
          ].map(([charge, amount], i) => (
            <div key={charge} className="flex justify-between items-center px-4 py-3 text-sm"
              style={{ background: i % 2 === 0 ? "#F8FAFC" : "#FFFFFF" }}>
              <span className="font-medium text-gray-700">{charge}</span>
              <span className="text-gray-500">{amount}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-400 text-xs">* Charges vary across lenders. Confirm with your specific bank or NBFC before applying.</p>
      </div>
    ),
  },
  {
    id: "criteria",
    heading: "Eligibility Criteria by Various Banks",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Banks assess income, employment type, job stability, and business continuity (for
        self-employed) when processing loan applications. Indexia Finance's partner lenders
        evaluate eligibility across two primary profiles —{" "}
        <strong className="text-gray-800">salaried</strong> and{" "}
        <strong className="text-gray-800">self-employed</strong>. Additional factors include
        age, work experience, existing banking relationship, and current debt obligations.
      </p>
    ),
  },
  {
    id: "cibil",
    heading: "How Does Your CIBIL Score Affect Your Loan?",
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed">
          Before approving a personal loan, every lender checks your CIBIL score — a 3-digit
          credit score ranging from <strong className="text-gray-800">300 to 900</strong>. A
          score above <strong className="text-gray-800">750</strong> is generally considered
          excellent and leads to faster processing, lower interest rates, and higher loan amounts.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Improve your score by paying loan EMIs on time, clearing credit card dues in full, and
          avoiding multiple loan applications in a short period.
        </p>
      </div>
    ),
  },
  {
    id: "interest-type",
    heading: "Reducing Rate vs. Flat Rate: Which is Better?",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 leading-relaxed">
          Personal loan interest is typically quoted between 10.5% and 25% p.a. How that rate
          is applied determines your actual repayment amount:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              type: "Reducing Balance Rate",
              desc: "Interest is calculated only on the outstanding principal. As you repay, the interest component decreases each month — resulting in lower total interest paid.",
              recommended: true,
            },
            {
              type: "Flat Interest Rate",
              desc: "Interest is calculated on the original principal throughout the tenure, even as you repay. This results in a higher effective interest rate.",
              recommended: false,
            },
          ].map((item) => (
            <div key={item.type} className="rounded-xl border p-4"
              style={{ borderColor: item.recommended ? "#066a9c33" : "#e5e7eb", background: item.recommended ? "#EFF7FF" : "#FAFAFA" }}>
              <p className="font-semibold text-gray-800 text-sm mb-1.5">
                {item.type}
                {item.recommended && (
                  <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#066a9c", color: "#fff" }}>
                    Recommended
                  </span>
                )}
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "pointers",
    heading: "Important Tips Before You Apply",
    content: (
      <BulletList
        items={[
          ["Boost Your Eligibility", "Add your spouse's income to qualify for a higher loan amount."],
          ["Use Existing Relationships", "Your current bank may offer preferential rates or waive fees for existing customers."],
          ["Check Your CIBIL Score First", "A score above 750 significantly improves your chances and reduces your rate."],
          ["Watch Out for Penalties", "Understand prepayment charges, early closure norms, and late payment fees upfront."],
        ]}
      />
    ),
  },
  {
    id: "apply",
    heading: "Apply with Indexia Finance",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Indexia Finance simplifies the personal loan journey — from comparing offers across
        top lenders to a fully digital application with minimal documentation. Whether you are
        salaried or self-employed, our team helps you find the right loan at the right rate,
        and guides you through every step until disbursal.
      </p>
    ),
  },
  {
    id: "best-providers",
    heading: "Why Borrowers Choose Indexia Finance",
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
        {[
          ["Hassle-free Process", "Apply online in minutes — no branch visits, no long queues."],
          ["Best Rate Guarantee", "We compare rates across 30+ lenders to get you the lowest available."],
          ["Transparent Lending", "No hidden fees. All charges disclosed upfront before you sign."],
          ["Dedicated Support", "A personal finance advisor assists you from application to disbursal."],
        ].map(([title, desc]) => (
          <div key={title} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="font-semibold text-gray-800 text-sm mb-1">{title}</p>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "conclusion",
    heading: "Ready to Get Started?",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Personal loans are one of the most flexible financial tools available — and with the right
        lender, the process is fast and straightforward. Trust Indexia Finance to match you with
        the best offer available today. Apply now and get a callback within 30 minutes.
      </p>
    ),
  },
];

const PersonalLoanDetail = () => (
  <ShowDetailLayout
    loanName="Personal Loan"
    breadcrumb="Personal Loan"
    bannerTitle="Personal Loan"
    bannerBg={bannerBg}
    docsHref="/requireddocument/personal-loan"
    applySlug="personalloan"
    sections={sections}
  />
);

export default PersonalLoanDetail;
