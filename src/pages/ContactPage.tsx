import PageBanner from "../components/common/PageBanner";
import LeadForm from "../components/forms/LeadForm";
import useSEO from "../hooks/useSEO";

/**
 * Contact Us page — contact details + enquiry form.
 * NOTE: no backend endpoint exists yet; the form succeeds client-side.
 */

const contactCards = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Call Us",
    lines: ["+91 92117 79004", "Mon–Sat, 9:30 AM – 6:30 PM IST"],
    href: "tel:+919211779004",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Email Us",
    lines: ["info@indexiafinance.com", "We reply within 1 working day"],
    href: "mailto:info@indexiafinance.com",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="11" r="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Social Media",
    lines: ["Facebook · LinkedIn", "Instagram · YouTube"],
    href: "https://www.linkedin.com/in/indexia-finance/",
  },
];

const ContactPage = () => {
  useSEO({
    title: "Contact Us",
    description:
      "Get in touch with Indexia Finance — loan enquiries, franchise partnerships and associate onboarding. Our team responds within one working day.",
    path: "/contact",
  });

  return (
  <>
    <PageBanner
      breadcrumb="Contact Us"
      title="We're Here to"
      highlight="Help You"
      tagline="Now, Right Bank will come at your doorstep"
    />

    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
        {/* Contact cards */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {contactCards.map((c) => (
            <a
              key={c.title}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 12px rgba(6,106,156,0.06)" }}
            >
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-white"
                style={{ background: "linear-gradient(135deg,#27ae90,#066a9c)" }}
              >
                {c.icon}
              </div>
              <h3 className="mb-1 text-base font-bold text-gray-800">{c.title}</h3>
              {c.lines.map((l) => (
                <p key={l} className="text-sm text-gray-500">{l}</p>
              ))}
            </a>
          ))}
        </div>

        {/* Enquiry form */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#066a9c]">
              Send an Enquiry
            </span>
            <h2 className="mt-2 text-2xl font-bold text-gray-800">
              Have a Question About a Loan?
            </h2>
            <div
              className="mt-3 h-0.75 w-32 rounded-full"
              style={{ background: "linear-gradient(90deg,#27ae90 0%,#066a9c 55%,transparent 100%)" }}
            />
            <p className="mt-6 text-sm leading-relaxed text-gray-500">
              Tell us what you're looking for and our loan experts will guide you to the right
              product — from personal and home loans to gold loans, OD/CC limits and FDI funding.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Prefer to apply directly? Head to any product page and click{" "}
              <span className="font-semibold text-[#066a9c]">Apply Now</span> to start your
              application with OTP verification.
            </p>
          </div>

          <div className="lg:col-span-3">
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 16px rgba(6,106,156,0.08)" }}
            >
              <LeadForm
                submitLabel="Send Enquiry"
                successTitle="Enquiry Sent!"
                successMessage="Thank you for reaching out. Our team will get back to you within 1 working day."
                fields={[
                  { name: "name", label: "Full Name", required: true, placeholder: "Your full name" },
                  { name: "phone", label: "Mobile Number", type: "tel", required: true, placeholder: "10-digit mobile number" },
                  { name: "email", label: "Email Address", type: "email", required: true, placeholder: "your@email.com" },
                  {
                    name: "topic",
                    label: "I'm interested in",
                    type: "select",
                    required: true,
                    placeholder: "Select a topic",
                    options: [
                      "Personal Loan", "Business Loan", "Home Loan", "Loan Against Property",
                      "Balance Transfer", "Car Loan", "Education Loan", "Credit Card",
                      "Project Loan", "Commercial Purchase", "Working Capital", "Lease Rental Discounting",
                      "OD CC Limit", "Loan Against Share", "Film Funding", "NPA", "Gold Loan", "FDI",
                      "Franchise / Associate", "Other",
                    ],
                  },
                  {
                    name: "message",
                    label: "Your Message",
                    type: "textarea",
                    required: true,
                    placeholder: "Briefly describe your requirement",
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

export default ContactPage;
