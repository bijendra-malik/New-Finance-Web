import { Link } from "react-router-dom";

interface PageBannerProps {
  breadcrumb: string;
  title: string;
  highlight?: string;
  tagline?: string;
}

const PageBanner = ({ breadcrumb, title, highlight, tagline }: PageBannerProps) => (
  <section className="relative mt-(--header-h) flex min-h-64 w-full items-center overflow-hidden">
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background: "linear-gradient(115deg, #072338 0%, #066a9c 58%, #0f7f7a 100%)",
      }}
    />
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-15"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage: "radial-gradient(ellipse at 72% 35%, #000 0%, transparent 76%)",
        WebkitMaskImage: "radial-gradient(ellipse at 72% 35%, #000 0%, transparent 76%)",
      }}
    />
    <div
      aria-hidden="true"
      className="absolute -right-20 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
      style={{ background: "var(--brand-teal)" }}
    />

    <div className="section-inner relative z-10 py-12 md:py-16">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-white/55"
      >
        <Link to="/" className="transition-colors hover:text-white">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="text-white/85">
          {breadcrumb}
        </span>
      </nav>

      <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
        {title}{" "}
        {highlight && <span style={{ color: "var(--brand-yellow)" }}>{highlight}</span>}
      </h1>

      {tagline && (
        <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-white/75 md:text-base">
          {tagline}
        </p>
      )}
    </div>
  </section>
);

export default PageBanner;
