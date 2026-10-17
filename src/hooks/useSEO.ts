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

interface ManagedMeta {
  el: HTMLMetaElement;
  /** Whether the tag already existed in index.html. */
  existed: boolean;
  /** Its content before this page changed it, so it can be restored. */
  previous: string | null;
}

/**
 * Writes a meta tag and remembers the previous state, so leaving a page puts
 * the head back exactly as it was instead of deleting tags that index.html
 * declared (the default description, OG and Twitter cards, for example).
 */
const upsertMeta = (attr: "name" | "property", key: string, content: string): ManagedMeta => {
  const existing = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  const el = existing ?? document.createElement("meta");

  const managed: ManagedMeta = {
    el,
    existed: Boolean(existing),
    previous: existing?.getAttribute("content") ?? null,
  };

  if (!existing) {
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  return managed;
};

const restoreMeta = ({ el, existed, previous }: ManagedMeta) => {
  if (existed && previous !== null) {
    el.setAttribute("content", previous);
  } else {
    el.remove();
  }
};

/**
 * Sets the page's title, description, canonical URL, Open Graph and Twitter
 * metadata. This is a client-rendered app: these tags improve link previews and
 * per-route titles, but they do not replace server-rendered HTML for crawlers.
 */
const useSEO = ({ title, description, path, image }: SeoOptions) => {
  useEffect(() => {
    const previousTitle = document.title;
    const fullTitle = `${title} | Indexia Finance`;
    const canonical = `${SITE_URL}${path}`;
    const imageUrl = image && !image.startsWith("http") ? `${SITE_URL}${image}` : image;

    document.title = fullTitle;

    const metas: ManagedMeta[] = [
      upsertMeta("name", "description", description),
      // Open Graph
      upsertMeta("property", "og:title", fullTitle),
      upsertMeta("property", "og:description", description),
      upsertMeta("property", "og:type", "website"),
      upsertMeta("property", "og:url", canonical),
      // Twitter/X — kept in step with Open Graph so social cards never show the
      // homepage copy on a loan or status page.
      upsertMeta("name", "twitter:card", "summary_large_image"),
      upsertMeta("name", "twitter:title", fullTitle),
      upsertMeta("name", "twitter:description", description),
    ];

    if (imageUrl) {
      metas.push(upsertMeta("property", "og:image", imageUrl));
      metas.push(upsertMeta("name", "twitter:image", imageUrl));
    }

    // Canonical <link>
    const existingCanonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const canonicalEl = existingCanonical ?? document.createElement("link");
    if (!existingCanonical) {
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    const previousCanonical = existingCanonical?.getAttribute("href") ?? null;
    canonicalEl.setAttribute("href", canonical);

    return () => {
      document.title = previousTitle;
      metas.forEach(restoreMeta);

      if (existingCanonical && previousCanonical !== null) {
        canonicalEl.setAttribute("href", previousCanonical);
      } else {
        canonicalEl.remove();
      }
    };
  }, [title, description, path, image]);
};

export default useSEO;
