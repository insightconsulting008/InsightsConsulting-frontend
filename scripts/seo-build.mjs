/**
 * One SEO build step: sitemap + per-route HTML prerendering.
 *
 *   npm run seo:build      sitemap + prerender (runs as part of `npm run build`)
 *   npm run sitemap        sitemap only
 *
 * Routes covered: static pages, every service and subcategory, and every
 * published blog post (fetched from the API at build time).
 *
 * The blog fetch is fail-soft: if the API is unreachable or slow the build
 * still succeeds, it just prerenders no blog posts and logs a warning. A
 * deploy must never fail because the backend was cold.
 */
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import {
  buildAllServiceSeo,
  staticPageSchema,
  STATIC_PAGES,
  SITE_URL,
  OG_IMAGE,
} from "../src/LandingPage/data/seo.js";

const DIST = resolve(process.cwd(), "dist");
const PUBLIC = resolve(process.cwd(), "public");
const SITEMAP_ONLY = process.argv.includes("--sitemap-only");

const API_BASE =
  process.env.VITE_API_BASE_URL ||
  "https://insightsconsulting-normal-backend.onrender.com/api";
const BLOG_PAGE_SIZE = 100;
const REQUEST_TIMEOUT_MS = 20000;
const MAX_PAGES = 20;

/* ── Blog posts ─────────────────────────────────────────────────────────── */

async function getJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchBlogs() {
  const posts = [];
  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const payload = await getJson(
        `${API_BASE}/blogs?page=${page}&limit=${BLOG_PAGE_SIZE}`,
      );
      const batch = payload?.data || [];
      posts.push(...batch.filter((b) => b?.slug));
      const totalPages = payload?.totalPages ?? 1;
      if (page >= totalPages || batch.length === 0) break;
    }
  } catch (error) {
    console.warn(
      `  ! blog posts skipped — ${API_BASE}/blogs unreachable (${error.message}). ` +
        `Sitemap and prerender continue without them.`,
    );
    return [];
  }
  return posts;
}

const trim = (text, max = 160) => {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 3);
  return `${cut.slice(0, cut.lastIndexOf(" ")).trim()}...`;
};

function blogSeo(blog) {
  const path = `/resource/${blog.slug}`;
  const url = `${SITE_URL}${path}`;
  const title = `${blog.title} | Insight Consulting`;
  const description =
    trim(blog.description) ||
    `${blog.title} — insights from the Insight Consulting team.`;
  return {
    path,
    url,
    title,
    description,
    keywords: null,
    image: blog.thumbnail || OG_IMAGE,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: blog.title,
        description,
        url,
        ...(blog.thumbnail && { image: blog.thumbnail }),
        ...(blog.author && { author: { "@type": "Person", name: blog.author } }),
        ...(blog.createdAt && { datePublished: blog.createdAt }),
        ...(blog.updatedAt && { dateModified: blog.updatedAt }),
        publisher: {
          "@type": "Organization",
          name: "Insight Consulting",
          url: SITE_URL,
        },
      },
    ],
    priority: "0.7",
  };
}

/* ── Sitemap ────────────────────────────────────────────────────────────── */

function writeSitemap(routes, lastmod) {
  const urls = routes
    .map(
      ({ path, priority }) => `<url>
\t<loc>${SITE_URL}${path}</loc>
\t<lastmod>${lastmod}</lastmod>
\t<priority>${priority || "0.8"}</priority>
</url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  writeFileSync(join(PUBLIC, "sitemap.xml"), xml, "utf8");
  if (existsSync(DIST)) writeFileSync(join(DIST, "sitemap.xml"), xml, "utf8");
}

/* ── Prerender ──────────────────────────────────────────────────────────── */

const escape = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/* Strip the template's own SEO tags so a route can never end up with two. */
const stripDefaults = (html) =>
  html
    .replace(/\s*<title>[\s\S]*?<\/title>/i, "")
    .replace(/\s*<link\s+rel="canonical"[^>]*>/gi, "")
    .replace(
      /\s*<meta\s+(?=[^>]*\bname="(?:description|keywords|author|robots|twitter:[^"]+)")[^>]*>/gi,
      "",
    )
    .replace(/\s*<meta\s+(?=[^>]*\bproperty="og:[^"]+")[^>]*>/gi, "")
    // also drop a previously injected JSON-LD block, so re-running this step
    // over an already-prerendered dist stays idempotent
    .replace(
      /\s*<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi,
      "",
    );

const headFor = ({ title, description, url, keywords, schema, image }) => `
    <title>${escape(title)}</title>
    <meta name="description" content="${escape(description)}" />
    ${keywords ? `<meta name="keywords" content="${escape(keywords)}" />` : ""}
    <meta name="author" content="Insight Consulting" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${escape(url)}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Insight Consulting" />
    <meta property="og:url" content="${escape(url)}" />
    <meta property="og:title" content="${escape(title)}" />
    <meta property="og:description" content="${escape(description)}" />
    <meta property="og:image" content="${escape(image || OG_IMAGE)}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(title)}" />
    <meta name="twitter:description" content="${escape(description)}" />
    <meta name="twitter:image" content="${escape(image || OG_IMAGE)}" />
${
  schema
    ? `    <script type="application/ld+json" data-seo="service">${JSON.stringify(
        schema,
      ).replace(/</g, "\\u003c")}</script>\n`
    : ""
}  </head>`;

function prerender(routes) {
  const template = readFileSync(join(DIST, "index.html"), "utf8");
  const shell = stripDefaults(template);
  routes.forEach((seo) => {
    const file =
      seo.path === "/"
        ? join(DIST, "index.html")
        : join(DIST, seo.path, "index.html");
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, shell.replace(/\s*<\/head>/i, headFor(seo)), "utf8");
  });
}

/* ── Run ────────────────────────────────────────────────────────────────── */

const staticRoutes = STATIC_PAGES.map((page) => ({
  ...page,
  url: `${SITE_URL}${page.path}`,
  keywords: null,
  schema: staticPageSchema(page),
}));
const serviceRoutes = buildAllServiceSeo();
const blogRoutes = (await fetchBlogs()).map(blogSeo);

// Landing pages that canonicalise onto their single service stay out of the
// sitemap; the canonical URL is the one that belongs there.
const sitemapRoutes = [...staticRoutes, ...serviceRoutes, ...blogRoutes].filter(
  (r) => !r.isDuplicateLanding,
);

writeSitemap(sitemapRoutes, new Date().toISOString());
console.log(
  `sitemap.xml written — ${sitemapRoutes.length} URLs ` +
    `(${serviceRoutes.filter((r) => !r.isDuplicateLanding).length} service, ` +
    `${blogRoutes.length} blog, ${staticRoutes.length} static)`,
);

if (SITEMAP_ONLY) process.exit(0);

if (!existsSync(join(DIST, "index.html"))) {
  console.error("dist/index.html not found — run `vite build` first.");
  process.exit(1);
}

const allRoutes = [...staticRoutes, ...serviceRoutes, ...blogRoutes];
prerender(allRoutes);
console.log(
  `prerendered ${allRoutes.length} routes ` +
    `(${serviceRoutes.length} service pages, ${blogRoutes.length} blog posts, ` +
    `${staticRoutes.length} static pages)`,
);
