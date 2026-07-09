import type { MetadataRoute } from "next";

const BASE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gunjo.jp"
).replace(/\/$/, "");

// Only the production deployment invites crawling. Preview/branch deploys
// (VERCEL_ENV="preview") disallow everything so the *.vercel.app URLs never get
// indexed — matching the per-page noindex meta in layout.tsx. (#553)
const allowCrawling = process.env.VERCEL_ENV === "production";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            ...(allowCrawling ? { allow: "/" } : { disallow: "/" }),
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
