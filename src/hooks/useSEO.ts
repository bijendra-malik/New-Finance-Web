import { useEffect } from "react";
const SITE_URL = "https://indexiafinance.com";

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
}

interface ManagedMeta {
  el: HTMLMetaElement;
  existed: boolean;
  previous: string | null;
}

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

const useSEO = ({ title, description, path, image }: SeoOptions) => {
  useEffect(() => {
    const previousTitle = document.title;
    const fullTitle = `${title} | Indexia Finance`;
    const canonical = `${SITE_URL}${path}`;
    const imageUrl = image && !image.startsWith("http") ? `${SITE_URL}${image}` : image;

    document.title = fullTitle;

    const metas: ManagedMeta[] = [
      upsertMeta("name", "description", description),
      upsertMeta("property", "og:title", fullTitle),
      upsertMeta("property", "og:description", description),
      upsertMeta("property", "og:type", "website"),
      upsertMeta("property", "og:url", canonical),
      upsertMeta("name", "twitter:card", "summary_large_image"),
      upsertMeta("name", "twitter:title", fullTitle),
      upsertMeta("name", "twitter:description", description),
    ];

    if (imageUrl) {
      metas.push(upsertMeta("property", "og:image", imageUrl));
      metas.push(upsertMeta("name", "twitter:image", imageUrl));
    }

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
