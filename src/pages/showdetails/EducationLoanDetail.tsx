import ShowDetailLayout from "./ShowDetailLayout";
import type { DetailSection } from "./ShowDetailLayout";
import bannerBg from "../../assets/loan-images/Education-banner.webp";
import EducationLoanImg from "../../assets/personal-loan/educationloan-details.webp";
import { NumberedSteps, NumberedList, BulletList } from "../../components/ui/DetailContent";

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
            <BulletList gap="tight" items={[
              "Books, uniforms, equipment, and instruments",
              "Essential computers or laptops required for course completion",
              "Fees for exams, library, laboratories, and hostel accommodation",
              "Building fund, caution deposit, refundable deposit (supported by receipts/bills)",
              "Travel costs for studies abroad",
              "Extra expenses such as study tours and thesis work",
            ]} />
          </div>
        </div>
        <div className="shrink-0 w-full lg:w-80">
          <img loading="lazy" decoding="async" src={EducationLoanImg} alt="Education Loan"
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
        ["Maximum Limits", "Up to ₹2 crore for study in India and ₹3 crore abroad, usually against collateral."],
        ["Flexible Repayment", "Standard 5–7 years with flexible options extending to 10–15 years."],
      ]} />
    ),
  },
  {
    id: "eligibility",
    heading: "Eligibility Criteria",
    content: (
      <BulletList gap="tight" items={[
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
      <NumberedSteps
        className="space-y-5"
        items={[
          { num: "1", title: "Best Education Loan Provider", desc: "Known for competitive rates and flexible repayment — with loan amounts tailored to your educational needs." },
          { num: "2", title: "Best Education Loan", desc: "From undergraduate loans to postgraduate funding — solutions for students at every stage of their academic journey." },
          { num: "3", title: "Best Education Loan Company", desc: "Transparent terms and dedicated support — streamlined application processes make financing your education stress-free." },
          { num: "4", title: "Best Education Loan Provider Company", desc: "Whether studying locally or abroad, committed to empowering students with the financial support they need to succeed." },
        ]}
      />
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
    applySlug="education-loan"
    sections={sections}
  />
);

export default EducationLoanDetail;
