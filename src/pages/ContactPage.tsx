import type { IconType } from "react-icons";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import PageBanner from "../components/common/PageBanner";
import LeadForm from "../components/forms/LeadForm";
import useSEO from "../hooks/useSEO";

/**
 * Contact Us page — every way to reach us in the left column, enquiry form on
 * the right. The phone numbers share one box, the email addresses another, and
 * the social profiles a third.
 */

const PHONE_LINES = [
  { label: "Landline", number: "+91 11 4629 1155", href: "tel:+911146291155" },
  { label: "Mobile", number: "86551 68551", href: "tel:+918655168551" },
];

const EMAILS = ["loans@indexiafinance.com", "contactus@indexiafinance.com"];

interface SocialLink {
  name: string;
  handle: string;
  url: string;
  icon: IconType;
  brand: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Facebook",
    handle: "Indexia Finance",
    url: "https://www.facebook.com/IndexiaFin",
    icon: FaFacebookF,
    brand: "#1877F2",
  },
  {
    name: "X",
    handle: "@indexiafinance",
    url: "https://x.com/FinanceIndexia?s=20",
    icon: FaXTwitter,
    brand: "#111827",
  },
  {
    name: "Instagram",
    handle: "@indexiafinance",
    url: "https://www.instagram.com/finance.indexia/",
    icon: FaInstagram,
    brand: "#E4405F",
  },
  {
    name: "LinkedIn",
    handle: "Indexia Finance",
    url: "https://www.linkedin.com/in/indexia-finance",
    icon: FaLinkedinIn,
    brand: "#0A66C2",
  },
  {
    name: "YouTube",
    handle: "Indexia Finance",
    url: "https://youtube.com/@financeindexia?si=jUrZw2npNHxrmKCL",
    icon: FaYoutube,
    brand: "#FF0000",
  },
];

const CARD_STYLE = {
  border: "1px solid rgba(6,106,156,0.12)",
  boxShadow: "0 2px 12px rgba(6,106,156,0.06)",
} as const;

const PhoneIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MailIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShareIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="18" cy="5" r="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="18" cy="19" r="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CardHeading = ({ icon, title, note }: { icon: React.ReactNode; title: string; note?: string }) => (
  <div className="mb-4 flex items-center gap-3">
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
      style={{ background: "linear-gradient(135deg,#27ae90,var(--brand-navy))" }}
    >
      {icon}
    </div>
    <div>
      <h3 className="text-base font-bold text-gray-800">{title}</h3>
      {note && <p className="text-[12px] text-gray-500">{note}</p>}
    </div>
  </div>
);

const ContactPage = () => {
  useSEO({
    title: "Contact Us",
    description:
      "Get in touch with Indexia Finance — call our landline or mobile, email the loans or general team, and follow us on social. Loan enquiries, franchise partnerships and associate onboarding.",
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
          <div className="mb-8">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-(--brand-navy)">
              Send an Enquiry
            </span>
            <h2 className="mt-2 text-2xl font-bold text-gray-800">Have a Question About a Loan?</h2>
            <div
              className="mt-3 h-0.75 w-32 rounded-full"
              style={{ background: "linear-gradient(90deg,#27ae90 0%,var(--brand-navy) 55%,transparent 100%)" }}
            />
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Tell us what you're looking for and our loan experts will guide you to the right product —
              from personal and home loans to gold loans, OD/CC limits and FDI funding.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Contact details on the left, enquiry form on the right */}
            <div className="grid gap-6 lg:col-span-2">
              {/* Phone numbers — landline and mobile share one box */}
              <div className="rounded-2xl p-6" style={CARD_STYLE}>
                <CardHeading icon={<PhoneIcon />} title="Call Us" note="Mon–Sat, 9:30 AM – 6:30 PM IST" />
                <ul className="space-y-2.5">
                  {PHONE_LINES.map((line) => (
                    <li key={line.href}>
                      <a
                        href={line.href}
                        className="flex items-baseline justify-between gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
                      >
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                          {line.label}
                        </span>
                        <span className="text-sm font-bold text-(--brand-navy)">{line.number}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Email addresses share their own box */}
              <div className="rounded-2xl p-6" style={CARD_STYLE}>
                <CardHeading icon={<MailIcon />} title="Email Us" note="We reply within 1 working day" />
                <ul className="space-y-2.5">
                  {EMAILS.map((email) => (
                    <li key={email}>
                      <a
                        href={`mailto:${email}`}
                        className="block truncate rounded-xl px-3 py-2 text-sm font-semibold text-(--brand-navy) transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
                      >
                        {email}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Enquiry form */}
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
                        "Balance Transfer", "Vehicle Loan", "Education Loan", "Credit Card",
                        "Project Loan", "Commercial Purchase", "Working Capital", "Lease Rental Discounting",
                        "OD CC Limit", "Loan Against Share", "Film Funding", "NPA", "Gold Loan", "FDI",
                        "Franchise", "Other",
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

          {/* Social profiles */}
          <div className="rounded-2xl p-6 mt-6" style={CARD_STYLE}>
            <CardHeading icon={<ShareIcon />} title="Follow Us" note="News, offers and loan updates" />
            <ul className="grid gap-3 grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <li key={social.name}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
                        style={{ background: social.brand }}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13.5px] font-bold text-gray-800">{social.name}</span>
                        <span className="block truncate text-[12px] text-gray-500">{social.handle}</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>
      </div>
    </>
  );
};

export default ContactPage;
