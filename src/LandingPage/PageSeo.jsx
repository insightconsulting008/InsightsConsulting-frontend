import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import applySeo from "./applySeo";
import { STATIC_PAGES, SITE_URL, staticPageSchema } from "./data/seo";

/**
 * Keeps the head correct on the public non-service routes during client-side
 * navigation. Service pages carry their own richer metadata via ServiceInfo,
 * and blog posts set theirs from the loaded post, so both are skipped here.
 *
 * The values are the same ones the build-time prerenderer writes into each
 * route's HTML, so a client-side visit ends up with an identical head.
 */
export default function PageSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname !== "/" ? pathname.replace(/\/+$/, "") : "/";
    const page = STATIC_PAGES.find((p) => p.path === path);
    if (!page) return;

    applySeo({
      title: page.title,
      description: page.description,
      url: `${SITE_URL}${page.path}`,
      keywords: null,
      schema: staticPageSchema(page),
    });
  }, [pathname]);

  return null;
}
