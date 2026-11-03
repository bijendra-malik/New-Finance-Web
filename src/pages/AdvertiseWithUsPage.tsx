import PageBanner from "../components/common/PageBanner";
import LeadForm from "../components/forms/LeadForm";
import useSEO from "../hooks/useSEO";

/**
 * Advertise With Us — content mirrored from indexiafinance.com/advertise-with-us:
 * intro on online advertising, ad options (text + banner), standard banner
 * specifications and an advertising-enquiry form.
 */

const INTRO_PARAGRAPHS = [
  "More than 4 Billion people of the world use the internet to stay connected and informed. Since the early 1990's there has been an exponential increase in the growth of online advertising, which has evolved into a standard for any size organisation whether small or large.",
  "Indexiafinance.com offers a medium to target and obtain website traffic for your products to deliver a marketing message to the right customers. Indexiafinance.com is geared toward defining markets through unique and useful applications so that you can expand your reach by finding new clients for your products the smart, easy and cost effective method.",
  "Indexiafinance.com has a very large viewership per day due to its high-quality content and extremely focussed Financial Product Range that lets you target the right audiences with greater precision and scale than ever before. Whether it's building awareness of your business or launching a new product, Indexiafinance.com can help you reach people that matter to you. Leverage the power of the internet and use it to increase awareness of your products.",
  "Promote your products and services using IndexiaFinance.com and get your message out to a wide prospective audience at an effective cost.",
];

const AD_OPTIONS = [
  {
    title: "Text Ads",
    desc: "Let IndexiaFinance.com make money for you. Place a text Ad. Text ads are the most basic type of ad on the Internet. It usually allows a headline, some text, and a call to action with a URL.",
  },
  {
    title: "Banner Ads",
    desc: "Banner ads have been around since the start of Internet time. They are basically like text ads, except that they use pictures and rich media to get the point across. If you are looking for an effective way to advertise your website, a banner ad is far more effective. They have to be in a standard size.",
  },
];

const BANNER_SPECS: { size: string; weight: string }[] = [
  { size: "728 x 90 px",  weight: "35 KB" },
  { size: "300 x 250 px", weight: "35 KB" },
  { size: "250 x 250 px", weight: "35 KB" },
  { size: "120 x 240 px", weight: "30 KB" },
  { size: "180 x 150 px", weight: "20 KB" },
  { size: "125 x 125 px", weight: "20 KB" },
  { size: "120 x 90 px",  weight: "20 KB" },
  { size: "120 x 60 px",  weight: "20 KB" },
];

const AdvertiseWithUsPage = () => {
  useSEO({
    title: "Advertise With Us",
    description:
      "Promote your products and services on IndexiaFinance.com and reach a wide prospective audience at an effective cost. Text and banner ad options with standard banner specifications.",
    path: "/advertise-with-us",
  });

  return (
    <>
      <PageBanner
        breadcrumb="Advertise With Us"
        title="Let's Join Hands and"
        highlight="Advertise With Us"
        tagline="Now, Right Bank will come at your doorstep"
      />

      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
          {/* Intro — mirrored from the original Advertise page */}
          <section aria-labelledby="advertise-intro-heading" className="max-w-4xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--brand-navy)">
              Advertise
            </p>
            <h2
              id="advertise-intro-heading"
              className="mt-2 mb-5 text-2xl font-extrabold leading-tight text-slate-900 md:text-3xl"
            >
              Reach the right audience at the right cost
            </h2>
            <div className="space-y-4 text-sm leading-7 text-gray-600 md:text-[15px]">
              {INTRO_PARAGRAPHS.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
          </section>

          {/* Ad options */}
          <section aria-labelledby="ad-options-heading" className="mt-12">
            <h2
              id="ad-options-heading"
              className="mb-6 text-2xl font-extrabold text-slate-900 md:text-3xl"
            >
              Ad options on <span className="text-(--brand-teal)">IndexiaFinance.com</span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {AD_OPTIONS.map((option) => (
                <div
                  key={option.title}
                  className="rounded-2xl p-6"
                  style={{
                    border: "1px solid rgba(6,106,156,0.12)",
                    boxShadow: "0 2px 12px rgba(6,106,156,0.06)",
                  }}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                      style={{ background: "linear-gradient(135deg, var(--brand-teal), var(--brand-navy))" }}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path
                          d="M11 5.882V19.24a1.76 1.76 0 01-3.177.918l-2.9-3.646a1.76 1.76 0 01.02-2.215l3.056-3.804A1.76 1.76 0 0111 5.882zM21 8.5v7.5a2 2 0 01-2 2h-1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <h3 className="text-lg font-bold text-gray-800">{option.title}</h3>
                  </div>
                  <p className="text-sm leading-7 text-gray-600">{option.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Banner specifications */}
          <section aria-labelledby="banner-specs-heading" className="mt-12">
            <h2
              id="banner-specs-heading"
              className="mb-2 text-2xl font-extrabold text-slate-900 md:text-3xl"
            >
              Banner specifications
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              Size &amp; weight, all in 72 dpi.
            </p>
            <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(6,106,156,0.12)" }}>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr
                    style={{
                      background: "linear-gradient(90deg, rgba(6,106,156,0.06), rgba(39,174,144,0.06))",
                    }}
                  >
                    <th scope="col" className="px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-(--brand-navy)">
                      Size
                    </th>
                    <th scope="col" className="px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-(--brand-navy)">
                      Weight
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {BANNER_SPECS.map((spec) => (
                    <tr key={spec.size} className="border-t border-slate-100">
                      <td className="px-5 py-3 font-semibold text-gray-700">{spec.size}</td>
                      <td className="px-5 py-3 text-gray-500">{spec.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Enquiry */}
          <section aria-labelledby="advertise-enquiry-heading" className="mt-12">
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{ border: "1px solid rgba(6,106,156,0.16)", background: "#fbfcfd" }}
            >
              <div className="mb-6 border-b border-slate-200 pb-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--brand-navy)">
                  For all advertising enquiries
                </p>
                <h2
                  id="advertise-enquiry-heading"
                  className="mt-1 text-xl font-extrabold tracking-tight text-slate-900"
                >
                  Send an enquiry
                </h2>
              </div>

              <LeadForm
                submitLabel="Send Enquiry"
                successTitle="Enquiry Sent!"
                successMessage="Thank you for your advertising enquiry. Our team will get back to you shortly."
                fields={[
                  { name: "name", label: "Full Name", required: true, placeholder: "Your full name" },
                  { name: "phone", label: "Mobile Number", type: "tel", required: true, placeholder: "10-digit mobile number" },
                  { name: "email", label: "Email Address", type: "email", required: true, placeholder: "your@email.com" },
                  { name: "company", label: "Company / Brand", placeholder: "Your company or brand name" },
                  {
                    name: "message",
                    label: "Your Message",
                    type: "textarea",
                    required: true,
                    placeholder: "Tell us briefly what you'd like to advertise",
                  },
                ]}
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default AdvertiseWithUsPage;
