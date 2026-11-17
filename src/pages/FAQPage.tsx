import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import PageBanner from "../components/common/PageBanner";
import useSEO from "../hooks/useSEO";
import { EMAIL_SUPPORT, PHONE_LANDLINE, PHONE_LANDLINE_HREF } from "../constants/contact";

interface Faq {
  q: string;
  a: string;
}

interface FaqGroup {
  id: string;
  title: string;
  blurb: string;
  items: Faq[];
}

const GROUPS: FaqGroup[] = [
  {
    id: "applying",
    title: "Applying for a loan",
    blurb: "From the first form to money in your account.",
    items: [
      {
        q: "How do I apply for a loan?",
        a: "Pick the product you need, fill the quick form, verify the OTP sent to your mobile, complete the eligibility check and upload your documents. Most applications are approved within 48 hours.",
      },
      {
        q: "Which loan products can I apply for?",
        a: "We facilitate 18 products, including personal, business, home, loan against property, balance transfer, vehicle, education, project, working capital, lease rental discounting, gold, loan against share, OD/CC limit, commercial purchase, film funding, credit cards, FDI and NPA resolution.",
      },
      {
        q: "Who is eligible to apply?",
        a: "Applicants must be Indian residents between 18 and 65 years of age with a steady income and a valid PAN. Each lender also applies its own income and credit-score criteria for the product you choose.",
      },
      {
        q: "Can I apply for more than one product at a time?",
        a: "Yes. Each application is filed separately for the product you choose, and each one needs its own OTP verification. A submitted application for the same product reopens only after the lender's cooling-off period.",
      },
      {
        q: "Is my application really completed online?",
        a: "Yes. Details, KYC, document upload and e-signature are all handled digitally. A lender may still call you to confirm a few details before sanction.",
      },
    ],
  },
  {
    id: "documents",
    title: "Documents & KYC",
    blurb: "What to keep ready, and why we ask for it.",
    items: [
      {
        q: "Which documents are required?",
        a: "Typically Aadhaar and PAN, an address proof, income proof (salary slips or ITR), six months of bank statements and an employment or business proof. Secured products ask for the related property or asset papers as well.",
      },
      {
        q: "Where can I see the list for my product?",
        a: "Every product has its own checklist on the List of Documents page, linked from the home page and from each product page. You can open it before you apply so nothing is missing later.",
      },
      {
        q: "Is a hard copy of any document needed?",
        a: "Not at the application stage. Clear scans or photographs are enough; the lender may ask for originals for verification before disbursal.",
      },
      {
        q: "How is my personal data used?",
        a: "Your details are used to assess the application and are shared only with the lender reviewing it. See our Privacy Policy for the full picture, including how to request correction or deletion.",
      },
    ],
  },
  {
    id: "interest-fees",
    title: "Interest, fees & EMI",
    blurb: "What you pay, and what you never pay.",
    items: [
      {
        q: "What is the processing fee?",
        a: "It ranges from 0.5% to 1.5% of the loan amount and is deducted from the approved amount. There are no hidden charges — the fee is disclosed before you accept the offer.",
      },
      {
        q: "Who decides my interest rate?",
        a: "The lending bank or NBFC sets the rate based on the product, your credit profile and the tenure you pick. We show indicative rates on each product page, but the sanction letter is final.",
      },
      {
        q: "How is my EMI calculated?",
        a: "EMI uses the standard reducing-balance method: EMI = [P × R × (1+R)^N] / [(1+R)^N − 1], where P is the principal, R the monthly rate and N the tenure in months. The EMI Calculator shows the full break-up.",
      },
      {
        q: "Can I prepay or foreclose the loan early?",
        a: "Most products allow part-prepayment or foreclosure. Charges, if any, depend on the lender and the product terms, and are listed in your sanction letter.",
      },
      {
        q: "Does a longer tenure reduce my EMI?",
        a: "It lowers the monthly instalment but raises the total interest paid. Compare a few tenures in the EMI Calculator before you choose.",
      },
    ],
  },
  {
    id: "credit-score",
    title: "Credit score & eligibility",
    blurb: "How lenders read your credit history.",
    items: [
      {
        q: "What is a CIBIL score?",
        a: "A three-digit number between 300 and 900 that summarises your creditworthiness. A higher score usually means better rates and faster approval; many lenders look for 700 or above.",
      },
      {
        q: "Does checking my score lower it?",
        a: "No. Checking your own score is a soft enquiry and has no impact on the number.",
      },
      {
        q: "How much loan can I get?",
        a: "It depends on your net monthly income, existing EMIs, credit score and the product. The Eligibility Calculator gives an instant estimate, but the lender's sanction is final.",
      },
      {
        q: "What if my application is not eligible?",
        a: "You can reapply from the date the lender reopens the product for you. Clearing existing dues, reducing obligations or applying with a co-applicant often changes the outcome.",
      },
    ],
  },
  {
    id: "repayments",
    title: "Repayments & support",
    blurb: "After disbursal — and who to call.",
    items: [
      {
        q: "How do I repay my loan?",
        a: "Repayment is by monthly EMI through an auto-debit mandate or standing instruction on the account you nominate. The lender's schedule shows the exact debit date.",
      },
      {
        q: "What happens if I miss an EMI?",
        a: "Late payment can attract a penalty and is reported to the credit bureaus, which affects your score. Contact the lender as soon as you know a debit will bounce; most will help you restructure.",
      },
      {
        q: "How do I track my application?",
        a: "Use Track Application from the footer or the My Applications page. Status moves through submitted, under review, approved and disbursed.",
      },
      {
        q: "How do I reach a human?",
        a: `Call our landline at ${PHONE_LANDLINE} or email ${EMAIL_SUPPORT}. Our specialists answer loan, repayment and account questions.`,
      },
    ],
  },
];

const FAQPage = () => {
  useSEO({
    title: "Frequently Asked Questions — Loans, Documents & Repayments",
    description:
      "Answers to common questions about applying for a loan with Indexia Finance: eligibility, documents and KYC, interest rates, processing fees, EMI, credit score and repayments.",
    path: "/faqs",
  });

  const [category, setCategory] = useState("all");
  const [openKey, setOpenKey] = useState<string | null>(`${GROUPS[0].id}-0`);

  const groups = category === "all" ? GROUPS : GROUPS.filter((group) => group.id === category);

  return (
    <>
      <PageBanner
        breadcrumb="FAQs"
        title="Frequently Asked"
        highlight="Questions"
        tagline="Everything about applying, documents and repayments"
      />

      <div className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
          {/* Editorial intro */}
          <header className="mb-8 border-t border-slate-200 pt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--brand-navy)">
              Help centre / Loan FAQs
            </p>
            <h2 className="mt-2 max-w-2xl text-3xl font-extrabold leading-[1.05] tracking-tight text-slate-900 md:text-4xl">
              Straight answers, <span className="text-(--brand-teal)">no fine print.</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
              The questions our loan specialists hear most, grouped so you can jump to what matters.
              If yours is not here, we are one call away.
            </p>
          </header>

          {/* Category filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            {[{ id: "all", title: "All questions" }, ...GROUPS].map((group) => {
              const active = category === group.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => { setCategory(group.id); setOpenKey(null); }}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                    active
                      ? "border-(--brand-navy) bg-(--brand-navy) text-white shadow-[0_4px_12px_rgba(6,106,156,0.25)]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-(--brand-teal) hover:text-(--brand-navy)"
                  }`}
                >
                  {group.title}
                </button>
              );
            })}
          </div>

          {/* Question groups */}
          <div className="space-y-10">
            {groups.map((group) => (
              <section key={group.id} aria-labelledby={`faq-group-${group.id}`}>
                <div className="mb-3 flex items-center gap-3">
                  <span aria-hidden="true" className="h-6 w-1 rounded-full bg-(--brand-teal)" />
                  <div>
                    <h3
                      id={`faq-group-${group.id}`}
                      className="text-lg font-bold text-slate-900"
                    >
                      {group.title}
                    </h3>
                    <p className="text-xs text-slate-500">{group.blurb}</p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  {group.items.map((item, index) => {
                    const key = `${group.id}-${index}`;
                    const active = openKey === key;
                    return (
                      <div key={key} className="border-b border-slate-100 last:border-0">
                        <button
                          type="button"
                          aria-expanded={active}
                          aria-controls={`faq-answer-${key}`}
                          onClick={() => setOpenKey(active ? null : key)}
                          className="flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-left sm:px-5"
                        >
                          <h4 className="flex-1 min-w-0 text-[14px] font-semibold leading-snug text-slate-800 sm:text-[15px]">
                            {item.q}
                          </h4>
                          <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300"
                            style={{ background: active ? "var(--brand-teal)" : "#f1f5f9" }}
                          >
                            {active
                              ? <Minus size={13} color="#fff" />
                              : <Plus size={13} style={{ color: "#94a3b8" }} />}
                          </span>
                        </button>
                        <div
                          id={`faq-answer-${key}`}
                          className="overflow-hidden transition-all duration-300"
                          style={{ maxHeight: active ? "320px" : "0px", opacity: active ? 1 : 0 }}
                        >
                          <p className="border-t border-(--brand-teal-20) px-4 pb-4 pt-3 text-sm leading-relaxed text-slate-600 sm:px-5">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Still stuck */}
          <div
            className="mt-12 overflow-hidden rounded-2xl text-white"
            style={{ background: "linear-gradient(135deg, var(--brand-navy-deep) 0%, var(--brand-navy) 100%)" }}
          >
            <div className="flex flex-col gap-4 px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-extrabold">Still have questions?</h3>
                <p className="mt-1 text-sm text-white/75">
                  Call <a href={PHONE_LANDLINE_HREF} className="font-semibold underline underline-offset-4">{PHONE_LANDLINE}</a>{" "}
                  or write to{" "}
                  <a href={`mailto:${EMAIL_SUPPORT}`} className="font-semibold underline underline-offset-4">{EMAIL_SUPPORT}</a>.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                style={{ background: "var(--brand-yellow)", color: "var(--brand-navy)" }}
              >
                Contact us →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;
