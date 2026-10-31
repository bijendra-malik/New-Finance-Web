import type { IconType } from "react-icons";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import PageBanner from "../components/common/PageBanner";
import LeadForm from "../components/forms/LeadForm";
import useSEO from "../hooks/useSEO";

/**
 * Contact Us — a single navy direct-lines panel beside a squared enquiry
 * sheet, followed by the registered office address and map. Contact channels
 * share one panel so the page does not repeat the same card four times.
 */

const PHONE_LINES = [
  { label: "Landline", number: "+91 11 4629 1155", href: "tel:+911146291155" },
  { label: "Mobile", number: "86551 68551", href: "tel:+918655168551" },
];

const EMAILS = ["loans@indexiafinance.com", "contactus@indexiafinance.com"];

const OFFICE = {
  name: "Indexia Finserve Pvt Ltd - An Indexia Group Company",
  addressLines: [
    "213, Second Floor, Imperial Tower",
    "Near Gurudwara, C Block Commercial Complex",
    "Naraina Vihar, New Delhi \u2013 110028",
  ],
  phone: { label: "+91 11 4629 1155", href: "tel:+911146291155" },
  mapQuery:
    "Indexia Finserve Pvt Ltd, 213, Imperial Tower, C Block Commercial Complex, Naraina Vihar, New Delhi 110028",
};

const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(OFFICE.mapQuery)}&output=embed`;
const MAP_DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE.mapQuery)}`;

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

const PhoneIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MailIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
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
          {/* Editorial intro — a statement, not another card heading */}
          <header className="mb-8 border-t border-slate-200 pt-5">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--brand-navy)">
                  Contact / Loan help desk
                </p>
                <h2 className="mt-2 max-w-2xl text-3xl font-extrabold leading-[1.05] tracking-tight text-slate-900 md:text-4xl">
                  Loans begin with a <span className="text-(--brand-teal)">conversation.</span>
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-slate-500 md:justify-self-end md:pb-1 md:text-right">
                Share the product and the amount. A loan specialist will take it from there.
              </p>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Contact channels — one navy panel instead of separate cards */}
            <aside
              aria-labelledby="contact-desk-heading"
              className="relative flex flex-col overflow-hidden text-white lg:col-span-2"
              style={{
                background: "linear-gradient(160deg, var(--brand-navy-deep) 0%, var(--brand-navy) 100%)",
                borderRadius: "2px",
              }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, rgba(255,255,255,0.045) 0, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 16px)",
                }}
              />

              <div className="relative flex flex-1 flex-col">
                <div className="border-b border-white/15 px-6 py-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--brand-yellow)">
                    Direct lines
                  </p>
                  <h2 id="contact-desk-heading" className="mt-1 text-xl font-extrabold tracking-tight">
                    Talk to a person.
                  </h2>
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/75">
                    Mon–Sat · 9:30 AM – 6:30 PM IST
                  </p>
                </div>

                <section aria-labelledby="contact-call-heading" className="border-b border-white/15 px-6 py-5">
                  <h3
                    id="contact-call-heading"
                    className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/85"
                  >
                    <PhoneIcon className="h-3.5 w-3.5 text-(--brand-teal)" />
                    Call
                  </h3>
                  <ul className="mt-3 space-y-1">
                    {PHONE_LINES.map((line) => (
                      <li key={line.href}>
                        <a
                          href={line.href}
                          className="group flex items-baseline justify-between gap-3 rounded-sm py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-yellow)"
                        >
                          <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/80">
                            {line.label}
                          </span>
                          <span className="text-[15px] font-bold tracking-tight text-white transition-colors group-hover:text-(--brand-yellow)">
                            {line.number}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>

                <section aria-labelledby="contact-write-heading" className="px-6 py-5">
                  <h3
                    id="contact-write-heading"
                    className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/85"
                  >
                    <MailIcon className="h-3.5 w-3.5 text-(--brand-teal)" />
                    Write
                  </h3>
                  <ul className="mt-3 space-y-1">
                    {EMAILS.map((email) => (
                      <li key={email}>
                        <a
                          href={`mailto:${email}`}
                          className="group flex items-center justify-between gap-3 rounded-sm py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-yellow)"
                        >
                          <span className="min-w-0 break-all text-[12px] font-semibold text-white/85 transition-colors group-hover:text-(--brand-yellow)">
                            {email}
                          </span>
                          <span
                            aria-hidden="true"
                            className="shrink-0 text-[13px] leading-none text-white/35 transition group-hover:translate-x-0.5 group-hover:text-(--brand-yellow)"
                          >
                            ↗
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>

                <div className="mt-auto border-t border-white/15 px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/75">Follow</p>
                    <ul aria-label="Indexia Finance social profiles" className="flex items-center gap-1.5">
                      {SOCIAL_LINKS.map((social) => {
                        const Icon = social.icon;
                        return (
                          <li key={social.name}>
                            <a
                              href={social.url}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`${social.name} — ${social.handle}`}
                              title={`${social.name} — ${social.handle}`}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-white ring-1 ring-white/20 transition-transform hover:-translate-y-0.5 hover:ring-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-yellow)"
                              style={{ background: social.brand }}
                            >
                              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </aside>

            {/* Enquiry sheet — squared paper with its own header, not another rounded card */}
            <section
              aria-labelledby="enquiry-form-heading"
              className="lg:col-span-3"
              style={{ border: "1px solid rgba(6,106,156,0.16)", background: "#fbfcfd" }}
            >
              <div className="h-1 w-full bg-(--brand-teal)" />
              <div className="p-6 md:p-8">
                <div className="mb-7 flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--brand-navy)">
                      Enquiry form
                    </p>
                    <h2
                      id="enquiry-form-heading"
                      className="mt-1 text-xl font-extrabold tracking-tight text-slate-900"
                    >
                      Send an enquiry
                    </h2>
                  </div>
                  <p className="max-w-xs text-[11.5px] leading-5 text-slate-500">
                    We will use the mobile number or email you give us to reply.
                  </p>
                </div>

                <LeadForm
                  submitLabel="Send Enquiry"
                  successTitle="Enquiry Sent!"
                  successMessage="Thank you for reaching out. Our team will get back to you shortly."
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
                        "Franchisee", "Other",
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
            </section>
          </div>

          {/* Office — address and Google Map, after the enquiry form */}
          <section
            aria-labelledby="office-heading"
            className="mt-6 overflow-hidden rounded-2xl"
            style={CARD_STYLE}
          >
            <div
              className="border-b px-6 py-5"
              style={{
                borderColor: "rgba(6,106,156,0.12)",
                background: "linear-gradient(90deg, rgba(6,106,156,0.06), rgba(39,174,144,0.06))",
              }}
            >
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-(--brand-navy)">
                Our Office
              </p>
              <h2 id="office-heading" className="mt-1 text-lg font-bold text-gray-800 md:text-xl">
                Indexia Finserve Pvt Ltd - An Indexia Group Company
              </h2>
            </div>

            <div className="grid lg:grid-cols-5">
              <div className="flex flex-col justify-center gap-4 p-6 lg:col-span-2">
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ background: "linear-gradient(135deg,#27ae90,var(--brand-navy))" }}
                    aria-hidden="true"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path
                        d="M12 21s-7-5.686-7-11a7 7 0 1114 0c0 5.314-7 11-7 11z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="10" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <address className="not-italic text-sm leading-7 text-gray-600">
                    {OFFICE.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>

                <a
                  href={OFFICE.phone.href}
                  className="w-fit rounded-xl px-3 py-2 text-sm font-bold text-(--brand-navy) transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
                >
                  Call {OFFICE.phone.label}
                </a>

                <a
                  href={MAP_DIRECTIONS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="w-fit text-[12.5px] font-bold text-(--brand-teal) hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
                >
                  Get directions on Google Maps ↗
                </a>
              </div>

              <div className="min-h-72 lg:col-span-3">
                <iframe
                  src={MAP_EMBED_URL}
                  title="Indexia Finserve Pvt Ltd, Naraina Vihar, New Delhi on Google Maps"
                  className="h-full min-h-72 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
