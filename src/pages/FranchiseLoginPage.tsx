import { Link } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import LeadForm from "../components/forms/LeadForm";
import useSEO from "../hooks/useSEO";

/**
 * Franchise Login page — currently a franchise-enquiry form.
 * NOTE: no backend endpoint exists yet; the form succeeds client-side.
 * When the franchise portal API is ready, swap LeadForm for the real login.
 */

const FranchiseLoginPage = () => {
  useSEO({
    title: "Franchise Partner With Us",
    description:
      "Join India's fastest-growing loan distribution network. Offer 18 loan products from a single franchise desk with zero investment.",
    path: "/franchise-login",
  });

  return (
  <>
    <PageBanner
      breadcrumb="Franchise Login"
      title="Franchise"
      highlight="Partner With Us"
      tagline="Join India's fastest-growing loan distribution network"
    />

    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Left: value props */}
          <div className="lg:col-span-2">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#066a9c]">
              Why Partner With Indexia Finance
            </span>
            <h2 className="mt-2 text-2xl font-bold text-gray-800">
              Grow Your Business With Us
            </h2>
            <div
              className="mt-3 h-0.75 w-32 rounded-full"
              style={{ background: "linear-gradient(90deg,#27ae90 0%,#066a9c 55%,transparent 100%)" }}
            />

            <div className="mt-8 space-y-6">
              {[
                {
                  title: "18 Loan Products",
                  desc: "Offer personal, business, home, gold and niche loans from a single franchise desk.",
                },
                {
                  title: "Attractive Payouts",
                  desc: "Industry-leading commissions paid promptly on every disbursed case.",
                },
                {
                  title: "Dedicated Support",
                  desc: "Relationship managers, marketing kit and training for you and your team.",
                },
                {
                  title: "Fast Sanctions",
                  desc: "Digital-first processing with verification completed within 24 hours.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div
                    className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ background: "linear-gradient(135deg,#27ae90,#066a9c)" }}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">{item.title}</h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm text-gray-500">
              Already a franchise partner and looking for the partner portal?{" "}
              <Link to="/contact" className="font-semibold text-[#066a9c] hover:underline">
                Contact us
              </Link>{" "}
              for access.
            </p>
          </div>

          {/* Right: enquiry form */}
          <div className="lg:col-span-3">
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 16px rgba(6,106,156,0.08)" }}
            >
              <h2 className="mb-1 text-xl font-bold text-gray-800">Become a Franchise</h2>
              <p className="mb-6 text-sm text-gray-500">
                Share your details and our franchise team will reach out within 2 working days.
              </p>

              <LeadForm
                submitLabel="Submit Franchise Enquiry"
                successTitle="Enquiry Received!"
                successMessage="Thank you for your interest in the Indexia Finance franchise programme. Our franchise team will contact you within 2 working days."
                fields={[
                  { name: "name", label: "Full Name", required: true, placeholder: "Your full name" },
                  { name: "phone", label: "Mobile Number", type: "tel", required: true, placeholder: "10-digit mobile number" },
                  { name: "email", label: "Email Address", type: "email", required: true, placeholder: "your@email.com" },
                  { name: "city", label: "City", required: true, placeholder: "Your city" },
                  {
                    name: "experience",
                    label: "Experience in Financial Services",
                    type: "select",
                    placeholder: "Select experience",
                    options: ["Less than 1 year", "1–3 years", "3–5 years", "5–10 years", "10+ years", "New to financial services"],
                  },
                  {
                    name: "currentBusiness",
                    label: "Current Business / Occupation",
                    placeholder: "e.g. CA firm, DSA, insurance agency, retail business",
                  },
                  {
                    name: "message",
                    label: "Message",
                    type: "textarea",
                    placeholder: "Tell us briefly about your interest in the franchise",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default FranchiseLoginPage;
