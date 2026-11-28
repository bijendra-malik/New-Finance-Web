import { GalleryHorizontal, Type } from "lucide-react";
import PageBanner from "../components/common/PageBanner";
import LeadForm from "../components/form/LeadForm";
import useSEO from "../hooks/useSEO";
import { submitContactEnquiry } from "../api/contact";
import startingImage from "../assets/advertise-with-us/starting-img.webp";
import textAdsImage from "../assets/advertise-with-us/text-ads.webp";
import bannerAdsImage from "../assets/advertise-with-us/banner-ads.webp";
import bannerSizesImage from "../assets/advertise-with-us/banner-specifications.webp";

const INTRO_PARAGRAPHS = [
  "More than 4 Billion people of the world use the internet to stay connected and informed. Since the early 1990's there has been an exponential increase in the growth of online advertising, which has evolved into a standard for any size organisation whether small or large.",
  "Indexiafinance.com offers a medium to target and obtain website traffic for your products to deliver a marketing message to the right customers. Indexiafinance.com is geared toward defining markets through unique and useful applications so that you can expand your reach by finding new clients for your products the smart, easy and cost effective method.",
  "Indexiafinance.com has a very large viewership per day due to its high-quality content and extremely focussed Financial Product Range that lets you target the right audiences with greater precision and scale than ever before. Whether it's building awareness of your business or launching a new product, Indexiafinance.com can help you reach people that matter to you. Leverage the power of the internet and use it to increase awareness of your products.",
  "Promote your products and services using IndexiaFinance.com and get your message out to a wide prospective audience at an effective cost.",
];

const AD_OPTIONS = [
  {
    title: "Text Ads",
    icon: Type,
    image: textAdsImage,
    alt: "Illustration of a text ad headline and call to action in an Indexia Finance browser window",
    desc: "Let IndexiaFinance.com make money for you. Place a text Ad. Text ads are the most basic type of ad on the Internet. It usually allows a headline, some text, and a call to action with a URL.",
  },
  {
    title: "Banner Ads",
    icon: GalleryHorizontal,
    image: bannerAdsImage,
    alt: "Banner ads from the 1990s to today, how rich media beats plain text links, and why banners work",
    desc: "Banner ads have been around since the start of Internet time. They are basically like text ads, except that they use pictures and rich media to get the point across. If you are looking for an effective way to advertise your website, a banner ad is far more effective. They have to be in a standard size.",
  },
];

const BANNER_SPECS: { width: number; height: number; weightKb: number }[] = [
  { width: 728, height: 90, weightKb: 35 },
  { width: 300, height: 250, weightKb: 35 },
  { width: 250, height: 250, weightKb: 35 },
  { width: 120, height: 240, weightKb: 30 },
  { width: 180, height: 150, weightKb: 20 },
  { width: 125, height: 125, weightKb: 20 },
  { width: 120, height: 90, weightKb: 20 },
  { width: 120, height: 60, weightKb: 20 },
];

const BANNER_WEIGHT_GROUPS = BANNER_SPECS.reduce<
  { weightKb: number; sizes: { width: number; height: number }[] }[]
>((groups, { width, height, weightKb }) => {
  const group = groups.find((entry) => entry.weightKb === weightKb);
  if (group) group.sizes.push({ width, height });
  else groups.push({ weightKb, sizes: [{ width, height }] });
  return groups;
}, []);

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
          <section
            aria-labelledby="advertise-intro-heading"
            className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12"
          >
            <div>
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
            </div>

            <figure className="lg:sticky lg:top-24">
              <img
                src={startingImage}
                alt="A phone showing the Indexia Finance site, with the message: place your ad on this site"
                width={1254}
                height={1254}
                loading="lazy"
                className="w-full rounded-2xl object-cover shadow-[0_24px_48px_-32px_rgba(6,106,156,0.55)] ring-1 ring-slate-200"
              />
              <figcaption className="mt-3 text-xs leading-5 text-slate-500">
                Your ad in front of a finance-focused audience.
              </figcaption>
            </figure>
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
              {AD_OPTIONS.map((option) => {
                const Icon = option.icon;

                return (
                <div
                  key={option.title}
                  className="overflow-hidden rounded-2xl bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-32px_rgba(6,106,156,0.45)]"
                  style={{
                    border: "1px solid rgba(6,106,156,0.12)",
                    boxShadow: "0 2px 12px rgba(6,106,156,0.06)",
                  }}
                >
                  <img
                    src={option.image}
                    alt={option.alt}
                    loading="lazy"
                    className="aspect-video w-full border-b border-slate-100 bg-white object-contain"
                  />
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                        style={{ background: "linear-gradient(135deg, var(--brand-teal), var(--brand-navy))" }}
                      >
                        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <h3 className="text-lg font-bold text-gray-800">{option.title}</h3>
                    </div>
                    <p className="text-sm leading-7 text-gray-600">{option.desc}</p>
                  </div>
                </div>
                );
              })}
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
            <figure className="mb-6">
              <img
                src={bannerSizesImage}
                alt="Banner ads mocked up in the eight standard sizes, from 728 x 90 to 120 x 60 pixels"
                width={1536}
                height={1024}
                loading="lazy"
                className="w-full rounded-2xl border border-slate-200 bg-white object-contain"
              />
              <figcaption className="mt-3 text-xs leading-5 text-slate-500">
                Our standard banner sizes, shown to relative scale.
              </figcaption>
            </figure>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
              <div
                aria-hidden="true"
                className="hidden items-center gap-6 border-b border-slate-200 bg-slate-50/80 px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-(--brand-navy) sm:flex"
              >
                <span className="w-24 shrink-0">Weight</span>
                <span>Sizes</span>
              </div>
              <dl className="divide-y divide-slate-100">
              {BANNER_WEIGHT_GROUPS.map((group) => (
                <div
                  key={group.weightKb}
                  className="flex flex-col gap-2.5 px-5 py-4 sm:flex-row sm:items-center sm:gap-6"
                >
                  <dt className="flex shrink-0 items-baseline gap-1.5 sm:w-24">
                    <span className="text-[13px] font-bold tabular-nums text-slate-800">
                      {group.weightKb} KB
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
                      max
                    </span>
                  </dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {group.sizes.map((size) => (
                      <span
                        key={`${size.width}x${size.height}`}
                        className="rounded-md bg-slate-50 px-2 py-1 text-[12px] font-semibold tabular-nums text-slate-600 ring-1 ring-slate-200/80"
                      >
                        {size.width} × {size.height} px
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
              </dl>
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
                submitErrorMessage="We could not send your enquiry just now. Please try again."
                onSubmit={async (values) => {
                  const company = values.company?.trim();
                  const message = [
                    company ? `Company / Brand: ${company}` : "",
                    values.message.trim(),
                  ]
                    .filter(Boolean)
                    .join("\n\n");

                  const response = await submitContactEnquiry({
                    name: values.name.trim(),
                    mobile: values.phone.trim(),
                    email: values.email.trim(),
                    topic: "Advertising",
                    message,
                    source: "website-advertise-with-us",
                  });

                  return response.message;
                }}
                fields={[
                  { name: "name", label: "Full Name", required: true, placeholder: "Your Full Name" },
                  { name: "phone", label: "Mobile Number", type: "tel", required: true, placeholder: "10-Digit Mobile Number" },
                  { name: "email", label: "Email Address", type: "email", required: true, placeholder: "your@email.com" },
                  { name: "company", label: "Company / Brand", placeholder: "Your Company Or Brand Name" },
                  {
                    name: "message",
                    label: "Your Message",
                    type: "textarea",
                    required: true,
                    minLength: 50,
                    placeholder: "Tell Us Briefly What You'd Like To Advertise (Minimum 50 Characters)",
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
