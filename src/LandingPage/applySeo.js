/**
 * Applies SEO tags to <head> at runtime.
 *
 * The build-time prerenderer already bakes these tags into each route's HTML —
 * this keeps them correct during client-side navigation, where no new document
 * is fetched. Every tag is upserted (never appended), so a route change updates
 * the prerendered tags in place and can't produce duplicates.
 */
import { OG_IMAGE } from "./data/seo";

const upsertMeta = (attr, key, content) => {
  const existing = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!content) {
    existing?.remove();
    return;
  }
  const el = existing || document.createElement("meta");
  if (!existing) {
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertLink = (rel, href) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const upsertJsonLd = (schema) => {
  const existing = document.head.querySelector('script[data-seo="service"]');
  if (!schema) {
    existing?.remove();
    return;
  }
  const el = existing || document.createElement("script");
  if (!existing) {
    el.type = "application/ld+json";
    el.dataset.seo = "service";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schema);
};

/**
 * @param {{title: string, description: string, url: string,
 *          keywords?: string|null, schema?: object[]|null,
 *          image?: string|null}} seo
 */
export default function applySeo({
  title,
  description,
  url,
  keywords,
  schema,
  image,
}) {
  if (!title) return;

  const ogImage = image || OG_IMAGE;

  document.title = title;
  upsertMeta("name", "description", description);
  upsertMeta("name", "keywords", keywords || null);
  upsertMeta("name", "robots", "index, follow");
  upsertMeta("name", "author", "Insight Consulting");
  upsertLink("canonical", url);

  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:site_name", "Insight Consulting");
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:image", ogImage);

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:image", ogImage);

  upsertJsonLd(schema || null);
}
