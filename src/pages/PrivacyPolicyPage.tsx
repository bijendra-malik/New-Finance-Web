import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import useSEO from "../hooks/useSEO";

/**
 * Privacy Policy — based on the policy published at
 * indexiafinance.com/privacy-policy, updated to describe the information the
 * loan, eligibility and franchise flows on this site actually collect, the
 * browser storage the site uses, and the rights available under the Digital
 * Personal Data Protection Act, 2023.
 */

const LAST_UPDATED = "3 November 2026";

const CONTACT_INFO: [string, string][] = [
  ["Company", "Indexia Finserve Pvt. Ltd. (Indexia Finance) — an Indexia Group company"],
  [
    "Office",
    "213, Second Floor, Imperial Tower, Near Gurudwara, C Block Commercial Complex, Naraina Vihar, New Delhi – 110028",
  ],
  ["Phone", "+91 11 4629 1155 (landline) · 86551 68551 (mobile)"],
  ["Email", "contactus@indexiafinance.com · support@indexiafinance.com"],
  [
    "Privacy requests and grievances",
    "contactus@indexiafinance.com — please put “Privacy request” or “Grievance” in the subject line",
  ],
];

interface CollectGroup {
  title: string;
  note?: string;
  items: string[];
}

const COLLECT_GROUPS: CollectGroup[] = [
  {
    title: "Identity and contact details",
    items: [
      "Full name and date of birth",
      "Mobile number and email address",
      "PAN, and the company PAN for business applications",
      "Residential address — state, city and pincode — and the status of your residence",
    ],
  },
  {
    title: "Employment, business and income",
    items: [
      "Employment type, employer or business name, job title and business type",
      "Monthly net salary, whether it is received in cash or into a bank account, and the bank name",
      "Profession, turnover and net income for the current and previous years, and how long the business has been running",
      "GSTIN, nature of business, industry and sub-industry, and the banks you transact with",
      "Business address, business premises status and years in business",
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
      "Property type, age and location for home, loan against property, commercial purchase, lease rental discounting and OD/CC applications",
      "Vehicle type, transmission, manufacturer, model, fuel type and whether the vehicle is new or used",
      "Course, institution, study country and parent or co-applicant details for education loans",
      "Gold, security, share portfolio and pledge details for gold and loan-against-share applications",
      "Project, film, FDI, NPA and credit-card information where that product applies",
    ],
  },
  {
    title: "Credit and eligibility information",
    items: [
      "The credit score you enter for your application (it can be entered once and cannot be changed after submission)",
      "The eligibility outcome, the date of your application and any waiting period before you can apply again",
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
      "The plan you select and, if you are onboarded, the agreement, onboarding and payout records you give us",
    ],
  },
  {
    title: "Enquiries, feedback and correspondence",
    items: [
      "The name, mobile number, email, topic and message you submit through our enquiry or feedback form",
      "Emails, call notes and other correspondence with our support team",
      "Responses you give to customer surveys or offers, where you choose to take part",
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
  "Keep internal records and administer your account.",
  "Create and verify your account, send OTPs and keep you signed in securely.",
  "Prepare, save, review and submit your loan application, including prefilling details you have already given us.",
  "Run the initial eligibility assessment and match your application with banks and NBFCs whose criteria fit your profile.",
  "Share your application with the lender or lenders so they can assess it, make a credit decision and contact you about the next steps.",
  "Let you track your application and see its status, stage and timeline.",
  "Process franchise and partner applications, onboard partners, calculate payouts and manage the partner relationship.",
  "Respond to enquiries and feedback, provide support and resolve complaints.",
  "Verify identity, prevent fraud and misuse, secure the site and enforce our terms.",
  "Meet legal, regulatory, tax, audit, KYC and anti-money-laundering obligations that apply to us or to the lenders we work with, and establish, exercise or defend legal claims.",
  "Improve our forms, products and website, using aggregated or de-identified information wherever possible.",
  "Send you service messages about your application and, where you have opted in or the law permits, promotional messages about products, offers or group and partner services.",
  "Contact you for market research — by email, phone, SMS or messaging apps — and customise the website around the products you are interested in.",
];

const SHARING_POINTS: { lead: string; text: string }[] = [
  {
    lead: "Lenders and financial institutions.",
    text: "Banks, NBFCs and other lenders we match you with — and their authorised agents and service providers — receive the application details needed to assess it, make a credit decision and contact you. A lender may also obtain your credit information from credit bureaus under its own process and with your consent.",
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
  "Opt out of promotional messages at any time without affecting service messages about your application.",
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

const PrivacyPolicyPage = () => {
  useSEO({
    title: "Privacy Policy",
    description:
      "How Indexia Finance collects, uses, shares, stores and protects your personal information when you use this website or apply for a loan or franchise.",
    path: "/privacy-policy",
  });

  return (
    <>
      <PageBanner
        breadcrumb="Privacy Policy"
        title="Privacy"
        highlight="Policy"
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
              This privacy policy sets out how Indexia Finance uses and protects any
              information that you give us when you use this website, apply for a loan
              or apply to partner with us as a franchisee.
            </p>
            <p className="mt-3 text-sm leading-7 text-gray-600 md:text-[15px]">
              Indexia Finance is committed to ensuring that your privacy is protected.
              Where we ask you to provide information by which you can be identified, it
              will be used only in the way described in this policy. This policy should
              be read with our{" "}
              <Link to="/terms-of-use" className="font-semibold text-(--brand-navy) underline">
                Terms of Use
              </Link>
              , which explain how you may use the site, and our{" "}
              <Link to="/terms-conditions" className="font-semibold text-(--brand-navy) underline">
                Terms &amp; Conditions
              </Link>
              .
            </p>
          </header>

          {/* At a glance */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "What we collect",
                text: "Your identity and contact details, PAN, employment or business and income details, existing borrowings, loan-specific details, the credit score you enter, and your application records.",
                href: "#what-we-collect",
              },
              {
                label: "How we use it",
                text: "To verify you, prepare and assess your application, share it with matching banks and NBFCs, support you, prevent fraud and meet legal obligations.",
                href: "#what-we-do",
              },
              {
                label: "Your choices",
                text: "Access, correct or erase your data, withdraw consent, opt out of marketing and raise a grievance. You can also clear the data this site stores in your browser.",
                href: "#controlling-your-information",
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
                  Read more →
                </span>
              </a>
            ))}
          </div>

          <Section title="Who we are">
            <p>
              This website is operated by Indexia Finserve Pvt. Ltd. (Indexia Finance),
              an Indexia Group company, with its office at 213, Second Floor, Imperial
              Tower, Near Gurudwara, C Block Commercial Complex, Naraina Vihar, New
              Delhi – 110028. In this policy, “we”, “us” and “our” refer to Indexia
              Finance, and “you” and “your” refer to the person using this website.
            </p>
            <p>
              We help you apply for loans offered by banks, non-banking financial
              companies (NBFCs) and other lenders, check your initial eligibility, track
              your application, and apply to partner with us as a franchisee. Loan
              applications are assessed and decided by the lender, not by us.
            </p>
          </Section>

          <Section id="what-we-collect" title="What we collect">
            <p>
              We collect only the information we need to provide the service you ask
              for. Most of it you give us directly in the forms on this site; some is
              created when you use the site. The categories are set out below.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {COLLECT_GROUPS.map((group) => (
                <div
                  key={group.title}
                  className="rounded-xl border p-4"
                  style={{ borderColor: "rgba(6,106,156,0.12)", background: "rgba(6,106,156,0.035)" }}
                >
                  <h4 className="text-[13.5px] font-extrabold text-slate-800">{group.title}</h4>
                  {group.note && (
                    <p className="mt-1 text-[11.5px] leading-5 text-slate-500">{group.note}</p>
                  )}
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

          <Section id="what-we-do" title="What we do with the information we gather">
            <p>
              We require this information to understand your needs and provide you with
              a better service, and in particular to:
            </p>
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

          <Section title="Credit information and lender decisions">
            <p>
              As part of your application you enter the credit score shown on your
              credit report. The score can be entered only once for an application and
              cannot be changed after submission, so please check it before you submit.
            </p>
            <p>
              We do not pull your credit report through this website — the score is the
              one you enter. If you proceed with a lender, that lender may obtain your
              credit information from one or more credit bureaus under its own process
              and with your consent, and will handle it under its own privacy policy.
            </p>
            <p>
              Our eligibility check is an initial assessment based on the details you
              provide. It is not an approval, sanction letter or offer of credit. The
              lender independently assesses your application, and approval, loan amount,
              interest rate, tenure, fees and disbursal are decided by the lender under
              its own policy and applicable Reserve Bank of India directions.
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
              We will not sell, distribute or lease your personal information to third
              parties unless we have your permission or are required by law to do so. We
              do not share your data with advertisers and do not use it for third-party
              advertising. We may tell you about products or offers from our group
              companies or partners only where you have opted in, and you can opt out at
              any time.
            </p>
          </Section>

          <Section title="Security">
            <p>
              We are committed to ensuring that your information is secure. In order to
              prevent unauthorised access or disclosure, we have put in place suitable
              physical, electronic and managerial procedures to safeguard and secure the
              information we collect online.
            </p>
            <p>
              These measures include encrypted connections (HTTPS), OTP verification,
              token-based sessions, restricted access for staff and service providers,
              and logging and monitoring to detect misuse. Access is limited to people
              who need it to provide the service.
            </p>
            <p>
              No method of transmission or storage is completely secure. Please protect
              your OTP and device, avoid using shared or public computers for your
              application, sign out when you finish, and tell us promptly at
              contactus@indexiafinance.com or support@indexiafinance.com if you believe
              your account or information has been compromised.
            </p>
          </Section>

          <Section title="How we use cookies and browser storage">
            <p>
              A cookie is a small file that a website asks your browser to store. Cookies
              and similar technologies can help a site remember your preferences or
              understand how pages are used.
            </p>
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
              to us are not affected. You can choose to accept, block or delete browser
              storage through your browser settings, although some features may then not
              work.
            </p>
            <SubHeading>Third-party content</SubHeading>
            <p>
              Some pages embed or link to third-party services — for example the Google
              Maps map on our Contact page, links to our social media profiles, and
              lender or partner websites. Those services may set their own cookies and
              handle your information under their own privacy policies. We do not
              control their content or their data practices.
            </p>
          </Section>

          <Section title="Links to other websites">
            <p>
              Our website may contain links to other websites of interest. However, once
              you have used these links to leave our site, you should note that we do
              not have any control over that other website. Therefore, we cannot be
              responsible for the protection and privacy of any information which you
              provide while visiting such sites, and such sites are not governed by this
              privacy policy. You should exercise caution and look at the privacy
              statement applicable to the website in question.
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

          <Section id="controlling-your-information" title="Controlling your personal information">
            <p>
              You may choose to restrict the collection or use of your personal
              information, and if you are in India the Digital Personal Data Protection
              Act, 2023 gives you the right to:
            </p>
            <Bullets items={RIGHTS_POINTS} />
            <p>
              To exercise any of these rights, email contactus@indexiafinance.com with
              “Privacy request” in the subject line. Requests are free of charge. We may
              need to verify your identity before we act, and we will respond within the
              time required by law. If you are not satisfied with our response, you may
              complain to the Data Protection Board of India.
            </p>
            <p>
              If you have previously agreed to us using your personal information for
              direct marketing, you can change your mind at any time by using the
              unsubscribe link in the message or by writing to us at
              contactus@indexiafinance.com. We will stop sending promotional messages
              within a reasonable period. You will still receive service messages about
              an active application.
            </p>
            <p>
              You can also clear the data this website stores in your browser through
              your browser settings and sign out of your account.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              Indexia Finance may change this policy from time to time by updating this
              page. You should check this page from time to time to ensure that you are
              happy with any changes. Where a change materially affects how we use your
              personal data, we will notify you on the site or by email or SMS before it
              takes effect where practicable.
            </p>
            <p>
              This policy is effective from {LAST_UPDATED} and replaces the version
              previously published on 3 July 2017.
            </p>
          </Section>

          <Section title="Contacting us">
            <p>
              If there are any questions regarding this privacy policy, or about the
              information we hold about you, you may contact us using the information
              below:
            </p>
            <dl
              className="mt-2 overflow-hidden rounded-2xl"
              style={{ border: "1px solid rgba(6,106,156,0.12)" }}
            >
              {CONTACT_INFO.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-1 gap-0.5 border-b border-slate-100 px-5 py-3 last:border-b-0 sm:grid-cols-[200px_1fr] sm:gap-4"
                >
                  <dt className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-(--brand-navy)">
                    {label}
                  </dt>
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

export default PrivacyPolicyPage;
