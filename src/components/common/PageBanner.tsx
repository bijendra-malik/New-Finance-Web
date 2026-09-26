import { Link } from "react-router-dom";

/**
 * Small shared page-banner used by the static pages (Loans index, Franchise,
 * Be An Associate, Contact) to visually match the DocPageLayout banner.
 */
interface PageBannerProps {
  breadcrumb: string;
  title: string;
  highlight?: string;
  tagline?: string;
}

const PageBanner = ({ breadcrumb, title, highlight, tagline }: PageBannerProps) => (
  <section
    className="relative mt-25 flex w-full min-h-70 items-center overflow-hidden md:min-h-80"
    style={{
      background: "linear-gradient(120deg, #0e1e3c 0%, #1b6ca8 55%, #1e90ff 100%)",
    }}
  >
    {/* subtle decorative rings */}
    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-24 border-white/5" />
    <div className="pointer-events-none absolute -bottom-28 left-1/4 h-80 w-80 rounded-full border-32 border-white/5" />

    <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12 md:px-12">
      <nav className="mb-7 flex items-center gap-2 text-sm text-white/50">
        <Link to="/" className="transition-colors hover:text-white">Home</Link>
        <span>›</span>
        <span className="font-medium text-white/85">{breadcrumb}</span>
      </nav>

      <h1 className="mb-3 text-2xl font-extrabold leading-tight text-white md:text-4xl">
        {title}{" "}
        {highlight && <span style={{ color: "var(--brand-yellow)" }}>{highlight}</span>}
      </h1>
      {tagline && (
        <p className="text-lg font-semibold italic md:text-xl" style={{ color: "var(--brand-yellow)" }}>
          {tagline}
        </p>
      )}
    </div>
  </section>
);

export default PageBanner;
