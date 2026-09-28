import { useEffect } from "react";
import { SITE_URL } from "../constants/siteLinks";

interface SeoOptions {
  /** Page title; the site name is appended automatically. */
  title: string;
  /** 150–160 character summary shown in search results and social cards. */
  description: string;
  /** Path for the canonical URL, e.g. "/showdetails/personal-loan". */
  path: string;
  /** Optional image (bundled asset import or absolute URL) for social cards. */
  image?: string;
}

/** Upsert a <meta> tag in document head; returns a cleanup that removes it. */
const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  return el;
};

const resetToDefaults = () => {
  document.title = "Indexia Finance | An Entire Loan Destination";
  const description =
    "Apply online for personal, business, home and 15+ other loan products with Indexia Finance. Quick eligibility check, transparent pricing and approvals within 48 hours.";
  upsertMeta("name", "description", description);
  upsertMeta("property", "og:title", "Indexia Finance | An Entire Loan Destination");
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:url", `${SITE_URL}/`);
  const link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (link) link.setAttribute("href", `${SITE_URL}/`);
};

const useSEO = ({ title, description, path, image }: SeoOptions) => {
  useEffect(() => {
    const fullTitle = `${title} | Indexia Finance`;
    const canonical = `${SITE_URL}${path}`;
    const imageUrl = image && !image.startsWith("http") ? `${SITE_URL}${image}` : image;

    document.title = fullTitle;

    const nodes: HTMLMetaElement[] = [
      upsertMeta("name", "description", description),
      // Open Graph
      upsertMeta("property", "og:title", fullTitle),
      upsertMeta("property", "og:description", description),
      upsertMeta("property", "og:type", "website"),
      upsertMeta("property", "og:url", canonical),
    ];
    if (imageUrl) {
      nodes.push(upsertMeta("property", "og:image", imageUrl));
      nodes.push(upsertMeta("name", "twitter:image", imageUrl));
    }

    // Canonical <link>
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);

    return () => {
      nodes.forEach(n => n.remove());
      resetToDefaults();
    };
  }, [title, description, path, image]);
};

export default useSEO;
