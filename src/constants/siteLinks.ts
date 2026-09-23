// Base URL of the main Indexia Finance marketing site.
// Configure via VITE_SITE_URL in .env — falls back to production domain.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://indexiafinance.com").replace(/\/+$/, "");
