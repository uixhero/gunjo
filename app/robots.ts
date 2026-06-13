import type { MetadataRoute } from "next";

const BASE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gunjo.jp"
).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
