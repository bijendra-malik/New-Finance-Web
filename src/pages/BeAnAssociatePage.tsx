import PageBanner from "../components/common/PageBanner";
import LeadForm from "../components/forms/LeadForm";
import useSEO from "../hooks/useSEO";

/**
 * Be An Associate page — referral-partner onboarding enquiry.
 * NOTE: no backend endpoint exists yet; the form succeeds client-side.
 */

const benefits = [
  {
    title: "Zero Investment",
    desc: "Start referring loan cases with no joining fee or upfront investment.",
  },
  {
    title: "Earn Per Disbursal",
    desc: "Get paid for every case that disburses — the more you refer, the more you earn.",
  },
  {
    title: "Simple Online Process",
    desc: "Refer leads through a simple form and track their status with our team.",
  },
  {
    title: "All Products Welcome",
    desc: "Refer any of our 18 loan products — personal, business, home, gold and more.",
  },
];

const BeAnAssociatePage = () => {
  useSEO({
    title: "Become an Associate",
    description:
      "Become an Indexia Finance associate — refer loan cases, earn commissions and grow with India's fastest-growing loan distribution network.",
    path: "/be-an-associate",
  });

  return (
  <>
    <PageBanner
      breadcrumb="Be An Associate"
      title="Become an"
      highlight="Associate"
      tagline="Refer. Earn. Repeat — with zero investment"
    />

    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
        {/* Benefits strip */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl p-5"
              style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 12px rgba(6,106,156,0.06)" }}
            >
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white"
                style={{ background: "linear-gradient(135deg,#27ae90,#066a9c)" }}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="mb-1 text-sm font-bold text-gray-800">{b.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#066a9c]">
              Associate Registration
            </span>
            <h2 className="mt-2 text-2xl font-bold text-gray-800">Start Earning With Us</h2>
            <div
              className="mx-auto mt-3 h-0.75 w-32 rounded-full"
              style={{ background: "linear-gradient(90deg,#27ae90 0%,#066a9c 55%,transparent 100%)" }}
            />
          </div>

          <div
            className="rounded-2xl p-6 md:p-8"
            style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 16px rgba(6,106,156,0.08)" }}
          >
            <LeadForm
              submitLabel="Register as Associate"
              successTitle="Registration Received!"
              successMessage="Welcome aboard! Our associate onboarding team will verify your details and contact you within 2 working days."
              fields={[
                { name: "name", label: "Full Name", required: true, placeholder: "Your full name" },
                { name: "phone", label: "Mobile Number", type: "tel", required: true, placeholder: "10-digit mobile number" },
                { name: "email", label: "Email Address", type: "email", required: true, placeholder: "your@email.com" },
                { name: "city", label: "City", required: true, placeholder: "Your city" },
                {
                  name: "profession",
                  label: "Profession",
                  type: "select",
                  placeholder: "Select profession",
                  options: ["Salaried", "Business Owner", "CA / Tax Consultant", "Insurance Agent", "DSA / Channel Partner", "Builder / Property Consultant", "Student / Fresher", "Other"],
                },
                {
                  name: "products",
                  label: "Products You'd Like to Refer",
                  type: "select",
                  placeholder: "Select a product to start with",
                  options: ["Personal Loan", "Business Loan", "Home Loan", "Loan Against Property", "Gold Loan", "Car Loan", "Any / All Products"],
                },
                {
                  name: "message",
                  label: "Message (Optional)",
                  type: "textarea",
                  placeholder: "Anything you'd like us to know about you",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default BeAnAssociatePage;
