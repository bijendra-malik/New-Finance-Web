import PageBanner from "../components/common/PageBanner";
import useSEO from "../hooks/useSEO";

/**
 * Terms & Conditions — mirrored from indexiafinance.com/terms-conditions.
 */

const TERMS: string[] = [
  "The content of the pages of this website is for your general information and use only. It is subject to change without notice.",
  "Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.",
  "Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.",
  "This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.",
  "All trade marks reproduced in this website which are not the property of, or licensed to, the operator are acknowledged on the website.",
  "Unauthorised use of this website may give rise to a claim for damages and/or be a criminal offence.",
  "From time to time this website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).",
  "You may not create a link to this website from another website or document without Indexia Finance's prior written consent.",
  "Your use of this website and any dispute arising out of such use of the website is subject to the laws of India or other regulatory authority.",
];

const TermsConditionsPage = () => {
  useSEO({
    title: "Terms & Conditions",
    description:
      "Indexia Finance website terms and conditions — use of content, trademarks, linked websites and governing law.",
    path: "/terms-conditions",
  });

  return (
    <>
      <PageBanner
        breadcrumb="Terms & Conditions"
        title="Terms &"
        highlight="Conditions"
        tagline="Now, Right Bank will come at your doorstep"
      />

      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-12 md:px-8">
          {/* Owner / welcome block */}
          <section aria-labelledby="tnc-owner-heading" className="max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--brand-navy)">
              Our terms
            </p>
            <h2 id="tnc-owner-heading" className="mt-2 mb-4 text-2xl font-extrabold leading-tight text-slate-900 md:text-3xl">
              Website owner &amp; scope
            </h2>
            <div className="space-y-4 text-sm leading-7 text-gray-600 md:text-[15px]">
              <p>
                The Website Owner, including subsidiaries and affiliates — Indexia
                Finance, Bijendra Malik, or "we", "us" or "our" — provides the
                information contained on this website, or any of the pages comprising
                the website, to visitors and applicants (cumulatively referred to as
                "you" or "your") subject to the terms and conditions set out in these
                website terms and conditions, the privacy policy, and any other
                relevant terms and conditions, policies and notices which may be
                applicable to a specific section or module of the website.
              </p>
              <p>
                Welcome to our website. If you continue to browse and use this
                website, you are agreeing to comply with and be bound by the
                following terms and conditions of use, which together with our
                privacy policy govern Indexia Finance's relationship with you in
                relation to this website.
              </p>
              <p>
                The term "Indexia Finance" or "us" or "we" refers to the owner of the
                website whose registered office is 2A, 1402, New Mhada Complex, Near
                Lokhandwala Circle, Andheri West, Mumbai-400053. Our company
                registration number is AMAPM9608ASD001, Mumbai. The term "you"
                refers to the user or viewer of our website.
              </p>
            </div>
          </section>

          {/* Numbered conditions */}
          <section aria-labelledby="tnc-conditions-heading" className="mt-10 border-t border-slate-200 pt-6">
            <h2
              id="tnc-conditions-heading"
              className="mb-5 text-2xl font-extrabold tracking-tight text-slate-900"
            >
              The use of this website is subject to the following terms of use
            </h2>
            <ol className="space-y-4">
              {TERMS.map((term, index) => (
                <li
                  key={term.slice(0, 24)}
                  className="flex items-start gap-4 rounded-xl p-4"
                  style={{ background: "rgba(6,106,156,0.035)" }}
                >
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold text-white"
                    style={{ background: "linear-gradient(135deg, var(--brand-navy), var(--brand-teal))" }}
                  >
                    {index + 1}
                  </span>
                  <p className="pt-0.5 text-sm leading-7 text-gray-600 md:text-[15px]">{term}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Boilerplate / card-liability clause */}
          <section aria-labelledby="tnc-card-heading" className="mt-10 border-t border-slate-200 pt-6">
            <h2 id="tnc-card-heading" className="mb-3 text-xl font-extrabold tracking-tight text-slate-900">
              Card payment liability
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-gray-600 md:text-[15px]">
              "We, as a service provider, shall be under no liability whatsoever in
              respect of any loss or damage arising directly or indirectly out of
              the decline of authorisation for any transaction, on account of the
              cardholder having exceeded the preset limit mutually agreed by us with
              our acquiring bank from time to time."
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default TermsConditionsPage;
