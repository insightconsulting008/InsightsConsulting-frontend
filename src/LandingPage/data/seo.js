/**
 * Single source of truth for service-page SEO.
 *
 * Consumed by:
 *   - ServiceInfo.jsx        → keeps the head correct during client-side navigation
 *   - scripts/prerender-seo  → bakes the same tags into the static HTML at build time
 *
 * Nothing here reads or alters rendered page copy; every value is derived from
 * servicesData.
 */
import { servicesData } from "./servicesData";

export const SITE_URL = "https://insightconsulting.info";
export const OG_IMAGE =
  "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/Screenshot%202026-04-25%20at%2010.53.55%E2%80%AFPM.png";

const ORGANIZATION = {
  "@type": "Organization",
  name: "Insight Consulting",
  url: SITE_URL,
  email: "enquiry@insightconsulting.info",
  telephone: "+91 73390 09906",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Flat No 6, Door No 6, Second Floor, Radial House, 14/1, Welcome Colony, Anna Nagar West Extension",
    addressLocality: "Chennai",
    postalCode: "600101",
    addressCountry: "IN",
  },
};


const HOME_DESCRIPTION =
  "Insight Consulting is a trusted professional services firm offering bookkeeping, GST filing, income tax services, MCA compliance, CFO services, and business advisory solutions for startups, SMEs, and growing enterprises. We help organizations scale with confidence, control, and clarity.";

/**
 * Static (non-service) routes. These carried the same values in the old
 * react-helmet blocks, which never applied on React 19 — they are now
 * prerendered into the HTML instead.
 */
export const staticPageSchema = ({ path, title, description }) => [
  path === "/"
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Insight Consulting",
        url: SITE_URL,
        email: "enquiry@insightconsulting.info",
        telephone: "+91 73390 09906",
        description,
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description,
        url: `${SITE_URL}${path}`,
        isPartOf: {
          "@type": "WebSite",
          name: "Insight Consulting",
          url: SITE_URL,
        },
        publisher: { "@type": "Organization", name: "Insight Consulting", url: SITE_URL },
      },
];

export const STATIC_PAGES = [
  {
    path: "/",
    title: "Insight Consulting - where Clarity meets Growth",
    description: HOME_DESCRIPTION,
    priority: "1.0",
  },
  {
    path: "/about",
    title: "About Us | Insight Consulting",
    description:
      "About Insight Consulting — a Chennai-based professional services firm supporting startups, SMEs and growing businesses across registrations, taxation and compliance.",
    priority: "0.9",
  },
  {
    path: "/contact",
    title: "Contact | Insight Consulting",
    description:
      "Contact Insight Consulting for registrations, GST, income tax, MCA compliance, DPDP compliance and CFO services. Call +91 73390 09906 or email enquiry@insightconsulting.info.",
    priority: "0.8",
  },
  {
    path: "/resource",
    title: "Blogs | Insight Consulting",
    description:
      "Insights, updates and practical guidance on business registration, GST, income tax, MCA compliance and data protection from the Insight Consulting team.",
    priority: "0.7",
  },
  {
    path: "/terms-conditions",
    title: "Terms & Conditions | Insight Consulting",
    description: "Read the terms and conditions of Insight Consulting.",
    priority: "0.6",
  },
];

export const stripEmoji = (text) => {
  if (!text || typeof text !== "string") return text;
  return text
    .replace(/^(?:\p{Extended_Pictographic}[️⃣]?‍?)+\s*/gu, "")
    .replace(/\*/g, "")
    .trim();
};

/* First meaningful prose in a service, whatever shape the data takes */
const firstProse = (service) => {
  const pools = [
    service?.whyChoose?.paragraphs,
    service?.heroSections?.flatMap((s) => s.paragraphs || []),
    service?.contentSections?.flatMap((s) => s.paragraphs || []),
  ];
  for (const pool of pools) {
    const hit = pool?.find((p) => typeof p === "string" && p.length > 40);
    if (hit) return hit;
  }
  return null;
};

const buildDescription = (service, categoryName, name) => {
  const parts = [
    stripEmoji(service?.tagline),
    stripEmoji(firstProse(service)),
  ].filter(Boolean);
  const text =
    parts.join(" ") ||
    `${name} from Insight Consulting${
      categoryName && categoryName !== name ? ` — ${categoryName}` : ""
    }. Expert registration, tax and compliance support for startups, SMEs and growing businesses in India.`;
  if (text.length <= 160) return text;
  const cut = text.slice(0, 157);
  return `${cut.slice(0, cut.lastIndexOf(" ")).trim()}...`;
};

/**
 * Build every SEO value for one route.
 * `service` may be null for subcategory landing pages.
 */
export function buildServiceSeo({
  service,
  categoryName,
  subCategoryName,
  path,
  canonicalPath,
}) {
  const name = stripEmoji(service?.name || subCategoryName);
  if (!name) return null;

  const title = `${name}${
    categoryName && categoryName !== name ? ` | ${categoryName}` : ""
  } | Insight Consulting`;
  const description = buildDescription(service, categoryName, name);
  // A landing page that duplicates its only service consolidates onto it,
  // so search engines index one URL instead of two near-identical ones.
  const canonical = `${SITE_URL}${canonicalPath || path}`;
  const keywords = [
    ...new Set(
      [
        name,
        `${name} India`,
        `${name} Chennai`,
        categoryName,
        subCategoryName,
        "Insight Consulting",
        "compliance services India",
      ].filter(Boolean),
    ),
  ].join(", ");

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name,
      description,
      url: canonical,
      serviceType: categoryName || name,
      areaServed: { "@type": "Country", name: "India" },
      provider: ORGANIZATION,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        categoryName && {
          "@type": "ListItem",
          position: 2,
          name: categoryName,
          item: canonical,
        },
        { "@type": "ListItem", position: 3, name, item: canonical },
      ].filter(Boolean),
    },
  ];

  return { name, title, description, url: canonical, keywords, schema, path };
}

/** Every service + subcategory route, with its SEO payload. Used by the prerenderer. */
export function buildAllServiceSeo() {
  const routes = [];
  servicesData.forEach((cat) => {
    cat.subcategories.forEach((sub) => {
      const base = `/our-services/${cat.categoryId}/${sub.subCategoryId}`;
      // Single-service subcategory whose name matches the service: the landing
      // page is a near-duplicate, so it canonicalises onto the service page and
      // stays out of the sitemap.
      const only = sub.services.length === 1 ? sub.services[0] : null;
      const duplicateLanding =
        only && stripEmoji(only.name) === stripEmoji(sub.subCategoryName);
      routes.push({
        ...buildServiceSeo({
          service: duplicateLanding ? only : null,
          categoryName: cat.categoryName,
          subCategoryName: sub.subCategoryName,
          path: base,
          canonicalPath: duplicateLanding ? `${base}/${only.serviceId}` : base,
        }),
        isDuplicateLanding: !!duplicateLanding,
      });
      sub.services.forEach((service) => {
        routes.push(
          buildServiceSeo({
            service,
            categoryName: cat.categoryName,
            subCategoryName: sub.subCategoryName,
            path: `${base}/${service.serviceId}`,
          }),
        );
      });
    });
  });
  return routes.filter(Boolean);
}
