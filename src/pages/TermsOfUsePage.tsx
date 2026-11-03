import type { ReactNode } from "react";
import PageBanner from "../components/common/PageBanner";
import useSEO from "../hooks/useSEO";

/**
 * Terms of Use — covers use of the website, the information the loan,
 * eligibility and franchise flows actually collect, how it is used and shared,
 * browser storage, security, retention, user rights under the DPDP Act, 2023,
 * fees, cancellations and refunds.
 */

/** Keeps the "last updated" stamp in sync with the current policy revision. */
const LAST_UPDATED = "3 November 2026";

const CONTACT_INFO: [string, string][] = [
  ["Company", "Indexia Finserve Pvt. Ltd. (Indexia Finance) — an Indexia Group company"],
  [
    "Office",
    "213, Second Floor, Imperial Tower, Near Gurudwara, C Block Commercial Complex, Naraina Vihar, New Delhi – 110028",
  ],
  ["Phone", "+91 11 4629 1155 (landline) · 86551 68551 (mobile)"],
  ["Email", "contactus@indexiafinance.com · loans@indexiafinance.com"],
  [
    "Privacy and grievance requests",
    "contactus@indexiafinance.com — please put “Privacy request” or “Grievance” in the subject line",
  ],
];

interface InfoGroup {
  title: string;
  note?: string;
  items: string[];
}

const INFO_GROUPS: InfoGroup[] = [
  {
    title: "Identity and contact details",
    items: [
      "Full name and date of birth",
      "Mobile number and email address",
      "PAN (and, for business applications, the company PAN)",
      "Current residential address — state, city and pincode — and the status of your residence",
    ],
  },
  {
    title: "Account and verification",
    items: [
      "The mobile number you register or sign in with, and the one-time passwords (OTPs) sent to verify it",
      "Your customer ID and account status",
      "Your sign-in session and the account details we show you on this device",
    ],
  },
  {
    title: "Employment, business and income",
    items: [
      "Employment type, employer or business name, and company or business type",
      "Monthly net salary and whether it is received in cash or into a bank account, with the bank name",
      "Profession, turnover and net income for the current and previous years, and the date the business was established",
      "GSTIN, nature of business, industry and sub-industry, and the banks you transact with",
      "Business address, business premises status, and the number of years you have been in business",
    ],
  },
  {
    title: "Existing borrowings",
    items: [
      "Total monthly EMI and total outstanding loan amount",
      "Names of your existing lenders and the types of loans you already hold",
    ],
  },
  {
    title: "Loan-specific details",
    note: "Only the fields relevant to the product you choose are requested.",
    items: [
      "Loan amount required and the tenure you want",
      "Property type, age and location — for home, loan against property, commercial purchase, lease rental discounting and OD/CC applications",
      "Vehicle type, transmission, manufacturer, model, fuel type and whether the vehicle is new or used",
      "Course, institution, study country and parent or co-applicant details for education loans",
      "Gold, security, share portfolio and pledge details for gold and loan-against-share applications",
      "Project, film, FDI, NPA and credit-card information where that product applies",
    ],
  },
  {
    title: "Eligibility and credit information",
    items: [
      "The credit score you enter for your application (it can be entered once and cannot be changed after submission)",
      "The eligibility outcome, the date of your application, and any waiting period before you can apply again",
    ],
  },
  {
    title: "Application and status records",
    items: [
      "Application reference number, product, amount and the details you filed",
      "Current status, stage, timeline, lender decision and any notes we share with you",
    ],
  },
  {
    title: "Franchise and partner applications",
    items: [
      "Name, mobile number, email, date of birth, PAN and GSTIN",
      "Business name and type, years in business, address and location (continent, country, state, city, pincode)",
      "The plan you select, and — if you are onboarded — the agreement, onboarding and payout records you give us",
    ],
  },
  {
    title: "Enquiries and correspondence",
    items: [
      "The name, mobile number, email, topic and message you submit through our enquiry form",
      "Emails, call notes and other correspondence with our support team",
    ],
  },
  {
    title: "Technical and usage information",
    note: "Collected automatically when your browser requests a page.",
    items: [
      "IP address, browser and device type, the pages requested, timestamps and error logs",
      "We use this to keep the site secure, diagnose faults and understand which pages are used. We do not use it to build advertising profiles.",
    ],
  },
];

const USE_POINTS = [
  "Create and verify your account, send OTPs and keep you signed in securely.",
  "Prepare, save, review and submit your loan application, including prefilling details you have already given us.",
  "Run the initial eligibility assessment and match your application with banks and NBFCs whose product criteria fit your profile.",
  "Share your application with the lender or lenders so they can assess it and contact you about the next steps.",
  "Let you track your application and see its status, stage and timeline.",
  "Process franchise and partner applications, onboard partners, calculate payouts and manage the partner relationship.",
  "Respond to enquiries, provide support and resolve complaints.",
  "Verify identity, prevent fraud and misuse, secure the site and enforce these terms.",
  "Meet legal, regulatory, tax, audit, KYC and anti-money-laundering obligations that apply to us or to the lenders we work with, and establish, exercise or defend legal claims.",
  "Improve our forms, products and website, using aggregated or de-identified information wherever possible.",
  "Send you service messages about your application and, where you have opted in or the law permits, information about products and offers.",
];

const SHARING_POINTS: { lead: string; text: string }[] = [
  {
    lead: "Lenders and financial institutions.",
    text: "Banks, NBFCs and other lenders we match you with — and their authorised agents and service providers — receive the application details needed to assess it, make a credit decision and contact you.",
  },
  {
    lead: "Franchise partners.",
    text: "Where an application is filed through a franchise, the franchise that filed it can see the application and its status so it can assist you.",
  },
  {
    lead: "Service providers.",
    text: "Companies that host our website, run our backend and cloud infrastructure, send SMS and email, provide security and IT support, or operate our support desk. They may use the information only to provide those services to us and are bound by confidentiality and data-protection obligations.",
  },
  {
    lead: "Professional advisers.",
    text: "Lawyers, auditors and insurers, where needed and under duties of confidentiality.",
  },
  {
    lead: "Regulators and authorities.",
    text: "Courts, regulators, law-enforcement agencies, credit bureaus and statutory bodies where the law requires or permits disclosure, or where we need to protect our rights, users or the public.",
  },
  {
    lead: "Group companies and successors.",
    text: "Other companies in the Indexia Group for the purposes described above, and a buyer or successor in a merger, acquisition or transfer of the business, subject to equivalent protection.",
  },
];

const STORAGE_POINTS = [
  "Keep you signed in — we store your authentication token and basic account details in your browser's local storage.",
  "Let you resume an application — the application draft, including the details you entered, is stored locally for up to 24 hours so you can complete the credit-score step. It is removed when you finish, discard the application or the window expires.",
  "Remember applications submitted from this device, so the site does not invite you to apply for the same product again.",
  "Remember your franchise sign-in and which notifications you have already read.",
  "Keep an application-status lookup (customer ID, PAN and mobile number) for the current browser session, so you can continue where you left off.",
];

const RIGHTS_POINTS = [
  "Access a summary of the personal data we hold about you and how we process it.",
  "Ask us to correct, complete or update information that is inaccurate or out of date.",
  "Ask us to erase personal data that we no longer need, subject to records we must keep by law.",
  "Withdraw a consent you have given at any time. Withdrawal does not affect processing already carried out, and may mean we can no longer continue an application.",
  "Raise a grievance about how we have handled your data and receive a response.",
  "Nominate another person to exercise your rights in the event of your death or incapacity.",
];

const Section = ({ id, title, children }: { id?: string; title: string; children: ReactNode }) => (
  <section id={id} className="mt-10 scroll-mt-28 border-t border-slate-200 pt-6">
    <h3 className="mb-3 text-xl font-extrabold tracking-tight text-slate-900">{title}</h3>
    <div className="space-y-3 text-sm leading-7 text-gray-600 md:text-[15px]">{children}</div>
  </section>
);

const SubHeading = ({ children }: { children: ReactNode }) => (
  <h4 className="pt-2 text-base font-bold text-slate-800">{children}</h4>
);

const Bullets = ({ items }: { items: readonly string[] }) => (
  <ul className="list-disc space-y-1.5 pl-5">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

const TermsOfUsePage = () => {
  useSEO({
    title: "Terms of Use",
    description:
      "Indexia Finance terms of use — what information we collect, how we use and share it, browser storage, security, your privacy rights, and our cancellation and refund policies.",
    path: "/terms-of-use",
  });

  return (
    <>
      <PageBanner
        breadcrumb="Terms of Use"
        title="Terms of"
        highlight="Use"
        tagline="Now, Right Bank will come at your doorstep"
      />

      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-12 md:px-8">
          <header className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--brand-navy)">
                Policy
              </p>
              <span className="rounded-full bg-(--brand-teal-14) px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-(--brand-teal)">
                Last updated: {LAST_UPDATED}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-gray-600 md:text-[15px]">
              These terms govern your use of the Indexia Finance website and the loan
              application, eligibility and partner services offered through it. They
              also explain what information we collect when you use the site, why we
              collect it, who we share it with and the choices you have. Please read
              them before you create an account or submit an application.
            </p>
          </header>

          {/* At a glance */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "What we collect",
                text: "Your identity and contact details, PAN, employment or business and income details, existing borrowings, loan-specific details, the credit score you enter, and your application records.",
                href: "#information-we-collect",
                cta: "See the full list",
              },
              {
                label: "How we use it",
                text: "To verify you, prepare and assess your application, share it with matching banks and NBFCs, support you, prevent fraud and meet legal obligations.",
                href: "#how-we-use-information",
                cta: "See how we use it",
              },
              {
                label: "Your controls",
                text: "Access, correct or erase your data, withdraw consent and raise a grievance. You can also clear the data this site stores in your browser.",
                href: "#your-rights",
                cta: "See your rights",
              },
            ].map((card) => (
              <a
                key={card.label}
                href={card.href}
                className="group rounded-2xl border p-4 transition hover:border-(--brand-teal) hover:bg-(--brand-teal-14)"
                style={{ borderColor: "rgba(6,106,156,0.14)" }}
              >
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-(--brand-navy)">
                  {card.label}
                </p>
                <p className="mt-2 text-[13px] leading-6 text-gray-600">{card.text}</p>
                <span className="mt-3 inline-block text-[11.5px] font-bold text-(--brand-teal) group-hover:underline">
                  {card.cta} →
                </span>
              </a>
            ))}
          </div>

          <Section title="Who we are">
            <p>
              The website is operated by Indexia Finserve Pvt. Ltd. (Indexia Finance),
              an Indexia Group company, with its office at 213, Second Floor, Imperial
              Tower, Near Gurudwara, C Block Commercial Complex, Naraina Vihar, New
              Delhi – 110028. In these terms, “we”, “us” and “our” refer to Indexia
              Finance, and “you” and “your” refer to the person using this website.
            </p>
            <p>
              Indexia Finance helps you apply for loans offered by banks, non-banking
              financial companies (NBFCs) and other lenders, check your initial
              eligibility, track your application, and apply to partner with us as a
              franchisee. Loan applications submitted through this website are assessed
              and decided by the lender, not by us.
            </p>
            <p>
              By browsing this website, creating an account or submitting an application,
              you agree to these terms. If you do not agree with them, please do not use
              the site. These terms should be read with our website terms and conditions
              and any terms shown for a specific product, form or offer. Where those
              specific terms conflict with this page, the specific terms apply to that
              product or service.
            </p>
          </Section>

          <Section title="Using this website">
            <Bullets
              items={[
                "You must be at least 18 years old and legally able to enter into a contract. Loan products are offered to applicants who meet the lender's eligibility and geographic criteria.",
                "Information you give us must be true, accurate, current and your own. Submitting another person's PAN or mobile number, or false income or employment details, is a misuse of the service and may amount to an offence.",
                "Keep your OTPs, account access and device secure. You are responsible for activity carried out through your account or device. Tell us immediately if you suspect unauthorised access.",
                "Do not scrape or copy the site, attempt to reverse engineer it, introduce malware, probe or bypass security or rate limits, or use the site for any unlawful purpose.",
                "We may refuse, suspend or withdraw access to the site or an application where we suspect fraud, misuse or a breach of these terms, or where a legal or regulatory requirement makes it necessary.",
              ]}
            />
          </Section>

          <Section id="information-we-collect" title="Information we collect">
            <p>
              We collect only the information we need to provide the service you ask
              for. Most of it you give us directly in the forms on this site; some is
              created when you use the site. The categories are set out below.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {INFO_GROUPS.map((group) => (
                <div
                  key={group.title}
                  className="rounded-xl border p-4"
                  style={{ borderColor: "rgba(6,106,156,0.12)", background: "rgba(6,106,156,0.035)" }}
                >
                  <h4 className="text-[13.5px] font-extrabold text-slate-800">{group.title}</h4>
                  {group.note && <p className="mt-1 text-[11.5px] leading-5 text-slate-500">{group.note}</p>}
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-[12.5px] leading-5 text-gray-600">
                    {group.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <SubHeading>Documents and children's data</SubHeading>
            <p>
              This website does not currently accept document uploads. If you email
              documents to us or share them with our team, they form part of your
              application record and are handled in the same way as the information
              described above. Our services are for people aged 18 and over, and we do
              not knowingly collect personal data from children.
            </p>
          </Section>

          <Section id="how-we-use-information" title="How we use your information">
            <p>We use the information described above to:</p>
            <Bullets items={USE_POINTS} />
            <p>
              We process personal data on the basis of the consent you give when you
              submit a form or accept these terms, to perform the service you have
              requested, and to comply with the law. Where we rely on consent, you may
              withdraw it at any time — but we may then be unable to process your
              application, and we may still need to keep records that the law requires
              us to retain.
            </p>
          </Section>

          <Section title="How we share your information">
            <p>We share personal data only as needed for the purposes above:</p>
            <ul className="space-y-2.5">
              {SHARING_POINTS.map((point) => (
                <li key={point.lead} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-(--brand-teal)" />
                  <span>
                    <strong className="font-bold text-slate-800">{point.lead}</strong>{" "}
                    {point.text}
                  </span>
                </li>
              ))}
            </ul>
            <p>
              We do not sell your personal information, and we do not share it with
              advertisers. We do not use your data for third-party advertising.
            </p>
          </Section>

          <Section title="Credit score, eligibility and lender decisions">
            <p>
              As part of your application you enter the credit score shown on your
              credit report. The score can be entered only once for an application and
              cannot be changed after submission, so please check it before you submit.
            </p>
            <p>
              Our eligibility check is an initial assessment based on the details you
              provide. It is not an approval, sanction letter or offer of credit. The
              lender independently assesses your application, and approval, loan amount,
              interest rate, tenure, fees and disbursal are decided by the lender under
              its own policy and applicable Reserve Bank of India directions. We do not
              guarantee that an application will be approved, the terms you will be
              offered, or any timeline for disbursal.
            </p>
            <p>
              We may receive a fee or commission from a lender or partner when an
              application is successfully referred. This does not change the information
              we collect, the eligibility assessment or the lender's decision.
            </p>
          </Section>

          <Section title="Cookies, local storage and third-party content">
            <p>
              We do not use cookies for advertising, profiling or cross-site tracking,
              and this website does not load third-party analytics or advertising
              scripts. We do use your browser's local and session storage to make the
              site work:
            </p>
            <Bullets items={STORAGE_POINTS} />
            <p>
              This stored data stays on your device until the site removes it, you sign
              out, or you clear your browser storage. Clearing it may sign you out or
              lose an application that is still in progress; applications already sent
              to us are not affected. You can block or delete browser storage through
              your browser settings, although some features may then not work.
            </p>
            <SubHeading>Third-party content</SubHeading>
            <p>
              Some pages embed or link to third-party services — for example the Google
              Maps map on our Contact page, links to our social media profiles, and
              lender or partner websites. Those services may set their own cookies and
              handle your information under their own privacy policies. We do not
              control their content or their data practices, and we encourage you to
              read their policies before sharing information with them.
            </p>
          </Section>

          <Section title="Fees, cancellations and refunds">
            <SubHeading>Fees</SubHeading>
            <p>
              Where Indexia Finance charges a fee for a service — for example a franchise
              plan fee — the amount, what it covers, its validity and whether GST is
              included are shown to you before you pay. Franchise plan fees are exclusive
              of GST, and the agreement fee is adjustable against payout under the
              monthly plan as described on the Franchise page.
            </p>
            <p>
              Interest, processing fees, insurance, valuation, legal and other
              loan-related charges are set by the lender, not by us, and are disclosed in
              the lender's sanction letter and Key Fact Statement. If your offer changes,
              those charges may change too. We will never ask you to share an OTP or make
              a payment to “release” a loan; if you receive such a request, do not act on
              it and report it to us.
            </p>

            <SubHeading>Cancellation policy</SubHeading>
            <p>
              We aim to help customers as far as possible and therefore keep a liberal
              cancellation policy. Under this policy:
            </p>
            <Bullets
              items={[
                "A cancellation request for a service you paid Indexia Finance for is accepted only if we receive it within 72 hours of the payment. We cannot cancel once your details have been passed to a bank, NBFC, vendor or other third party and that party has begun processing; in that case the third party's terms apply.",
                "Same-day services cannot be cancelled.",
                "Offers and promotions run on special occasions carry the validity and cancellation terms stated with the offer.",
                "If a service is not as described or does not meet your expectations, tell us within 24 hours of receiving it. Our support team will review your complaint and decide what is appropriate.",
                "If you are charged for something you did not request, report it within 21 days of the charge so we can investigate.",
                "To cancel, email contactus@indexiafinance.com with your name, registered mobile number, payment reference and the service concerned.",
                "These timelines do not limit any right you have under consumer law.",
              ]}
            />

            <SubHeading>Refund policy</SubHeading>
            <p>
              Fees paid to Indexia Finance are not automatically refundable. If you are
              not satisfied with a service, we will take the issue seriously and try to
              resolve it as quickly as possible.
            </p>
            <p>
              To request a refund, contact us with your payment details and payment
              reference within ninety (90) days of the payment, and tell us why you are
              asking. We use that feedback to improve our services. We do not refund a
              service that has been delivered in full — for example completed franchise
              onboarding or a service that has been fully performed — or a payment where
              a lender or other third party has already begun processing at your request
              and its own charges apply.
            </p>
            <p>
              Approved refunds are processed within 21 days to the original payment
              method. Your bank or payment provider may take additional time to credit
              the amount. Charges levied by a lender are refunded only under that
              lender's policy.
            </p>
          </Section>

          <Section title="Keeping your information secure">
            <p>
              We use technical and organisational measures to protect your information,
              including encrypted connections (HTTPS), OTP verification, token-based
              sessions, restricted access for staff and service providers, and logging
              and monitoring to detect misuse. Access is limited to people who need it
              to provide the service.
            </p>
            <p>
              No method of transmission or storage is completely secure. Please protect
              your OTP and device, avoid using shared or public computers for your
              application, sign out when you finish, and tell us promptly at
              contactus@indexiafinance.com or support@indexiafinance.com if you believe
              your account or information has been compromised.
            </p>
          </Section>

          <Section title="How long we keep information">
            <p>
              We keep account and application records for as long as your account is
              active and afterwards for as long as needed to meet legal, regulatory, tax,
              audit, KYC and anti-money-laundering requirements, to resolve complaints
              and to establish or defend legal claims. Records relating to the lenders we
              work with may need to be kept for the periods those lenders are required to
              observe.
            </p>
            <p>
              Application drafts held in your browser are kept for up to 24 hours, and
              other browser data remains until you clear it. Franchise records are kept
              for the term of the agreement and the statutory retention period afterwards.
              Enquiries are kept for as long as needed to respond and keep a record of the
              conversation.
            </p>
            <p>
              When information is no longer needed, we delete it or anonymise it, unless
              we are required to keep it. If you ask us to delete your data, we will
              explain what can be deleted and what must be retained by law.
            </p>
          </Section>

          <Section id="your-rights" title="Your rights and choices">
            <p>
              If you are in India, the Digital Personal Data Protection Act, 2023 gives
              you the right to:
            </p>
            <Bullets items={RIGHTS_POINTS} />
            <p>
              To exercise any of these rights, email contactus@indexiafinance.com with
              “Privacy request” in the subject line. We may need to verify your identity
              before we act, and we will respond within the time required by law. If you
              are not satisfied with our response, you may complain to the Data
              Protection Board of India.
            </p>
            <p>
              You can also clear the data this website stores in your browser through
              your browser settings, sign out of your account, and opt out of marketing
              messages using the unsubscribe link in the message or by writing to us.
            </p>
          </Section>

          <Section title="Marketing communications">
            <p>
              We send service messages about your application, OTPs and security notices
              as part of providing the service; you cannot opt out of these while you
              have an active application. We send promotional messages about products,
              offers or third-party services only where you have opted in or where the
              law permits it. You can opt out at any time, and we will stop sending
              promotional messages within a reasonable period.
            </p>
          </Section>

          <Section title="Third-party links">
            <p>
              This website may link to websites we do not control, including lender,
              partner and social media sites. A link is provided for convenience and does
              not mean we endorse that site or its content. We are not responsible for
              the accuracy, availability or privacy practices of other websites, and
              their terms and privacy policies apply when you visit them.
            </p>
          </Section>

          <Section title="Disclaimer">
            <p>
              The information on this website — including indicative interest rates,
              loan limits, tenures, eligibility criteria and timelines — is provided for
              general information only. It is not an offer, sanction or commitment of
              credit, and it may change without notice. Approval, loan amount, interest
              rate, fees and disbursal are decided solely by the lender under its policy
              and applicable regulatory directions.
            </p>
            <p>
              Our EMI and eligibility calculators produce estimates based on the inputs
              you provide and the assumptions shown on the page. They are not quotations
              and should not be relied on as a commitment from us or from any lender. You
              should confirm the final terms with the lender before acting on them.
            </p>
            <p>
              We try to keep the information on this site accurate and up to date, but we
              do not warrant that it is complete, accurate or suitable for your purpose.
              Any reliance you place on it is at your own risk. To the extent permitted
              by law, we are not liable for indirect or consequential loss, loss of data
              or profits, or for the website being unavailable because of technical issues
              beyond our control.
            </p>
            <p>
              Nothing in these terms excludes or limits any liability that cannot lawfully
              be excluded, or any right you have under applicable consumer law.
            </p>
          </Section>

          <Section title="BO clause">
            <p>
              We, as a service provider, are under no liability whatsoever in respect of
              any loss or damage arising directly or indirectly out of the decline of
              authorisation for any transaction, on account of the cardholder having
              exceeded the preset limit mutually agreed by us with our acquiring bank
              from time to time.
            </p>
          </Section>

          <Section title="Changes to these terms">
            <p>
              We may update these terms and the privacy information on this page as our
              services, technology or the law change. The “last updated” date at the top
              of the page will change when we do. Where a change materially affects how we
              use your personal data, we will notify you on the site or by email or SMS
              before it takes effect where practicable. Continuing to use the site after an
              update means you accept the revised terms.
            </p>
          </Section>

          <Section title="Governing law and disputes">
            <p>
              These terms are governed by the laws of India. Subject to any right you have
              under consumer law, the courts at New Delhi have exclusive jurisdiction over
              disputes arising from your use of this website. Before starting proceedings,
              please write to us at contactus@indexiafinance.com so we can try to resolve
              the issue.
            </p>
          </Section>

          <Section title="Contacting us">
            <p>
              If you have any questions about these terms, the information we collect, or
              how we use it, please contact us:
            </p>
            <dl className="mt-2 overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(6,106,156,0.12)" }}>
              {CONTACT_INFO.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-1 gap-0.5 border-b border-slate-100 px-5 py-3 last:border-b-0 sm:grid-cols-[200px_1fr] sm:gap-4"
                >
                  <dt className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-(--brand-navy)">{label}</dt>
                  <dd className="text-sm text-gray-600">{value}</dd>
                </div>
              ))}
            </dl>
          </Section>
        </div>
      </div>
    </>
  );
};

export default TermsOfUsePage;
