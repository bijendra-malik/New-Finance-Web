import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerBg from "../../assets/loan-images/Education-banner.png";
import EducationLoanImg from "../../assets/personal-loan/educationloan-details.png";

const ACCENT = "#066a9c";

const BulletList = ({ items }: { items: (string | [string, string])[] }) => (
  <ul className="space-y-2 mt-1">
    {items.map((item, i) => {
      const [title, desc] = Array.isArray(item) ? item : [item, undefined];
      return (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
          <span className="text-sm text-gray-600 leading-relaxed">
            {desc ? <><span className="font-semibold text-gray-800">{title}: </span>{desc}</> : title}
          </span>
        </li>
      );
    })}
  </ul>
);

const NumberedList = ({ items }: { items: [string, string][] }) => (
  <ol className="space-y-3 mt-1">
    {items.map(([title, desc], i) => (
      <li key={i} className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5" style={{ background: ACCENT }}>{i + 1}</span>
        <span className="text-sm text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-800">{title}: </span>{desc}
        </span>
      </li>
    ))}
  </ol>
);

const sections: DetailSection[] = [
  {
    id: "intro",
    heading: "Invest in Your Child's Future with an Education Loan",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Investing in your child's education is a commitment to their future happiness and success.
        With escalating costs of higher education in India and abroad, Indexia Finance offers an
        Education Loan that empowers deserving students to pursue excellence — without financial
        barriers standing in the way.
      </p>
    ),
  },
  {
    id: "coverage",
    heading: "What Does the Indexia Finance Education Loan Cover?",
    content: (
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        <div className="flex-1 min-w-0">
          <div className="space-y-3">
            <p className="text-gray-600 leading-relaxed">
              Covering graduate, postgraduate, professional, and doctoral courses, our education
              loans go beyond just tuition fees:
            </p>
            <BulletList items={[
              "Books, uniforms, equipment, and instruments",
              "Essential computers or laptops required for course completion",
              "Fees for exams, library, laboratories, and hostel accommodation",
              "Building fund, caution deposit, refundable deposit (supported by receipts/bills)",
              "Travel costs for studies abroad",
              "Extra expenses such as study tours and thesis work",
            ]} />
          </div>
        </div>
        <div className="flex-shrink-0 w-full lg:w-80">
          <img src={EducationLoanImg} alt="Education Loan"
            className="w-full h-72 object-contain grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
      </div>
    ),
  },
  {
    id: "features",
    heading: "Features & Benefits",
    content: (
      <NumberedList items={[
        ["Eligibility", "Open to anyone pursuing education in India or abroad."],
        ["Co-Signor Requirement", "A parent or guardian must act as co-signor for the loan."],
        ["Female Student Benefits", "Discounts or lower interest rates for female students."],
        ["Loan Amount", "Based on annual family income and the chosen course."],
        ["Security Requirements", "Loans below ₹4 lakhs typically require no security. Higher amounts may need collateral."],
        ["Maximum Limits", "Up to ₹10–15 lakhs for Indian students; up to ₹20 lakhs for those studying abroad."],
        ["Flexible Repayment", "Standard 5–7 years with flexible options extending to 10–15 years."],
      ]} />
    ),
  },
  {
    id: "eligibility",
    heading: "Eligibility Criteria",
    content: (
      <BulletList items={[
        "Indian citizenship is a prerequisite",
        ["NRI Applicants", "Must possess a valid Indian Passport"],
        "Must meet the age requirements defined by the respective bank",
        "Confirmation of admission from a recognised college / institution is mandatory",
        "Co-applicants with a regular source of income are required",
        "Good academic record and positive credit history of the co-borrower (parent or guardian)",
        "Some banks may require national-level entrance exam qualification as a prerequisite",
      ]} />
    ),
  },
  {
    id: "best-options",
    heading: "Best Education Loan Options",
    content: (
      <div className="space-y-5">
        {[
          { num: "1", title: "Best Education Loan Provider", desc: "Known for competitive rates and flexible repayment — with loan amounts tailored to your educational needs." },
          { num: "2", title: "Best Education Loan", desc: "From undergraduate loans to postgraduate funding — solutions for students at every stage of their academic journey." },
          { num: "3", title: "Best Education Loan Company", desc: "Transparent terms and dedicated support — streamlined application processes make financing your education stress-free." },
          { num: "4", title: "Best Education Loan Provider Company", desc: "Whether studying locally or abroad, committed to empowering students with the financial support they need to succeed." },
        ].map((item) => (
          <div key={item.num} className="flex items-start gap-4">
            <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5" style={{ background: ACCENT }}>{item.num}</span>
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
    heading: "Start Your Educational Journey Today",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Trust the expertise and reliability of the best providers. Invest in your future today
        and pursue your educational dreams with confidence. Explore your options with Indexia
        Finance and take the first step toward a brighter tomorrow.
      </p>
    ),
  },
];

const EducationLoanDetail = () => (
  <ShowDetailLayout
    loanName="Education Loan"
    breadcrumb="Education Loan"
    bannerTitle="Education Loan"
    bannerBg={bannerBg}
    docsHref="/requireddocument/education-loan"
    applySlug="educationloan"
    sections={sections}
  />
);

export default EducationLoanDetail;
