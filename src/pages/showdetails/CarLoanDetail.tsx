import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerBg from "../../assets/loan-images/car-banner.png";
import carloanDetails from "../../assets/personal-loan/carloan-details.png";

const ACCENT = "#066a9c";

const NumberedList = ({ items }: { items: string[] }) => (
  <ol className="space-y-2.5 mt-1">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3">
        <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white mt-0.5" style={{ background: ACCENT }}>{i + 1}</span>
        <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
      </li>
    ))}
  </ol>
);

const sections: DetailSection[] = [
  {
    id: "intro",
    heading: "Car Loan at Indexia Finance",
    content: (
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        <div className="flex-1 min-w-0">
          <div className="space-y-3">
            <p className="text-gray-600 leading-relaxed">
              Looking for the best car loan? At Indexia Finance, securing a car loan is simpler than ever.
              We provide car loans across India and internationally, with doorstep convenience so the right
              bank comes to you.
            </p>
            <div className="rounded-xl p-4 mt-2" style={{ background: "#EFF7FF", border: "1px solid #066a9c22" }}>
              <p className="text-sm font-semibold text-gray-800 mb-2">Why Indexia Finance for Car Loans?</p>
              <div className="grid grid-cols-2 gap-2">
                {["Competitive interest rates", "Transparent terms", "Hassle-free application", "Expert guidance", "Doorstep bank service", "Pan-India coverage"].map((point) => (
                  <div key={point} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#26ae90" }} />{point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="shrink-0 w-full lg:w-80">
          <img src={carloanDetails} alt="Car Loan"
            className="w-full h-72 object-contain grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
      </div>
    ),
  },
  {
    id: "access",
    heading: "Easy Access to Leading Banks",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Indexia Finance gives you direct access to various leading banks in the country.
        Simply fill out our online form — it takes just a few minutes. Once submitted, our
        partner banks evaluate your details and present you with the most appropriate deal.
      </p>
    ),
  },
  {
    id: "tips",
    heading: "Tips for Choosing the Right Car Financing",
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 text-sm leading-relaxed">Keep these tips in mind when financing your car:</p>
        <NumberedList items={[
          "Know the type of car you want and check if it suits your estimated budget.",
          "Narrow down your choices to two or three shortlisted models.",
          "Compare rates from different banks and dealers to get the best deal.",
          "Clear old debts to improve your credit history before applying.",
          "Understand both flat rate and reducing balance interest methods.",
          "Check for processing fees and pre-payment penalties upfront.",
          "Remember to insure your car — driving uninsured is against the law.",
        ]} />
      </div>
    ),
  },
  {
    id: "repayment",
    heading: "Understanding Loan Repayment",
    content: (
      <div className="space-y-3">
        <p className="text-gray-600 leading-relaxed">
          Car loan repayment happens through EMIs — comprising the principal amount and interest.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            ["Don't judge by EMI alone", "Calculate the total amount you'll pay over the full tenure."],
            ["Flat vs Reducing Balance", "The Reducing Balance method results in lower total interest."],
            ["Processing Fees", "Be aware of fees charged at the start of the loan period."],
            ["Pre-payment Penalties", "Some banks restrict part-payment — confirm flexibility before signing."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-xl border border-gray-100 p-3.5" style={{ background: "#FAFAFA" }}>
              <p className="font-semibold text-gray-800 text-sm mb-1">{title}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "insurance",
    heading: "Mandatory Car Insurance",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Car insurance is mandatory by law. The insurance policy is typically bundled into the
        EMI for the loan tenure, ensuring coverage against unexpected events.
      </p>
    ),
  },
  {
    id: "best-options",
    heading: "Best Car Loan Options",
    content: (
      <div className="space-y-5">
        {[
          { num: "1", title: "Best Car Loan Provider Company", desc: "Indexia Finance stands out for competitive interest rates, transparent terms, and an efficient hassle-free application process with expert guidance at every step." },
          { num: "2", title: "Best Car Loan Solutions", desc: "A variety of loan solutions catering to different preferences — ensuring you find the perfect financing match for your dream car." },
          { num: "3", title: "Best Car Loan Finance", desc: "Whether you need the best car loan finance or simply the best car loan in India, expert guidance helps you navigate the options." },
          { num: "4", title: "Apply with Indexia Finance", desc: "As one of India's best car loan companies, the application process is simple and fully online." },
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
    heading: "Ready to Drive Your Dream Car?",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Indexia Finance is your go-to for the best loan from top banks across India. Fill out the
        application form now — it takes just a few minutes — and drive home in your dream car sooner
        than you think.
      </p>
    ),
  },
];

const CarLoanDetail = () => (
  <ShowDetailLayout
    loanName="Car Loan"
    breadcrumb="Car Loan"
    bannerTitle="Drive Your Dream Car with the Best Car Loan"
    bannerBg={bannerBg}
    docsHref="/requireddocument/car-loan"
    applySlug="carloan"
    sections={sections}
  />
);

export default CarLoanDetail;
