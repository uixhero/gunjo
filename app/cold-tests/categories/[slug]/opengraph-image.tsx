import { ImageResponse } from "next/og";
import categoriesData from "@/data/cold-test-categories.json";
import gallery from "@/data/cold-test-gallery.json";

// Next.js Metadata Route conventions — Next uses `generateStaticParams` from
// page.tsx to know which slugs to prerender, and this module ships a PNG per
// slug at build time. `alt` / `size` / `contentType` shape the meta tags.
export const alt =
    "GunjoUI cold tests — an industry door page's share card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface DiscoveredComponent {
    name: string;
}

interface PublishedCategory {
    slug: string;
    jaCategory: string;
    copy: {
        ja: {
            title: string;
            description: string;
        };
    };
    discoveredComponents: DiscoveredComponent[];
}

interface CategoriesShape {
    published: PublishedCategory[];
}

interface GalleryShape {
    entries: { category: string }[];
}

const catData = categoriesData as CategoriesShape;
const galleryData = gallery as GalleryShape;

// Same palette as /cold-tests/why so category cards read as siblings of the
// thesis card. Keep in sync when the thesis OG's tokens shift.
const BG = "#020817";
const SURFACE = "#0b1124";
const TEXT = "#f8fafc";
const MUTED = "#94a3b8";
const ACCENT = "#3b82f6";

// Latin labels for the OG card. next/og has no CJK font bundled, so the JA
// category names would render as tofu (□□□) on shared cards. This map is
// deliberately English-only for the OG surface — the page itself keeps the JA
// heading via LocaleProvider.
const LATIN_LABEL: Record<string, string> = {
    foundation: "Foundation / generic UI",
    finance: "Finance",
    accounting: "Accounting / payroll",
    retail: "Retail / e-commerce",
    logistics: "Logistics",
    medical: "Healthcare",
    realestate: "Real estate",
    manufacturing: "Manufacturing",
    education: "Education",
    publicsector: "Public sector",
    media: "Media / publishing",
    hr: "HR / recruiting",
    care: "Care / welfare",
    food: "Food / restaurants",
    insurance: "Insurance",
    "transport-rail": "Transport: rail",
    "transport-air": "Transport: air",
    "transport-bus": "Transport: bus",
    "transport-taxi": "Transport: taxi",
    "transport-truck": "Transport: trucking",
};

// Static params come from the same list Next uses for pages — Next will
// prerender one PNG per slug. Colocating this here rather than importing
// from page.tsx keeps the OG module standalone (page.tsx exports async
// generateStaticParams; ImageResponse routes don't need async here).
export function generateStaticParams() {
    return catData.published.map((c) => ({ slug: c.slug }));
}

export default async function Image({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const category = catData.published.find((c) => c.slug === slug);
    if (!category) {
        // Should never happen because generateStaticParams above matches the
        // page's own list. Return a minimal fallback rather than throwing so
        // a broken deploy still produces something shareable.
        return new ImageResponse(
            (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        background: BG,
                        color: TEXT,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontSize: 48,
                        fontWeight: 700,
                    }}
                >
                    GUNJO / cold tests
                </div>
            ),
            size
        );
    }

    const roundCount = galleryData.entries.filter(
        (e) => e.category === category.jaCategory
    ).length;

    // 8 chips max keeps the OG breathing on 4-primitive categories and
    // avoids a second row on transport arcs.
    const chips = category.discoveredComponents.slice(0, 8).map((c) => c.name);

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: BG,
                    color: TEXT,
                    display: "flex",
                    flexDirection: "column",
                    padding: "60px 88px",
                    position: "relative",
                    fontFamily: "Inter, system-ui, sans-serif",
                }}
            >
                {/* Same brand glow as /why so the card reads as a sibling. */}
                <div
                    style={{
                        position: "absolute",
                        top: -240,
                        right: -240,
                        width: 700,
                        height: 700,
                        borderRadius: 9999,
                        background: ACCENT,
                        opacity: 0.18,
                        filter: "blur(80px)",
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        fontSize: 24,
                        letterSpacing: 4,
                        color: ACCENT,
                        fontWeight: 700,
                        textTransform: "uppercase",
                    }}
                >
                    GUNJO
                    <span
                        style={{
                            color: MUTED,
                            letterSpacing: 2,
                            fontWeight: 500,
                        }}
                    >
                        / cold tests / industry
                    </span>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: 24,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 24,
                            lineHeight: 1,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 168,
                                fontWeight: 900,
                                lineHeight: 1,
                                letterSpacing: -5,
                            }}
                        >
                            {roundCount}
                        </span>
                        <span
                            style={{
                                fontSize: 44,
                                fontWeight: 700,
                                color: MUTED,
                                letterSpacing: -1,
                                paddingBottom: 10,
                            }}
                        >
                            cold tests
                        </span>
                    </div>
                    <div
                        style={{
                            marginTop: 18,
                            fontSize: 40,
                            fontWeight: 700,
                            color: TEXT,
                            maxWidth: 980,
                            lineHeight: 1.25,
                            letterSpacing: -0.5,
                        }}
                    >
                        {LATIN_LABEL[slug] ?? category.jaCategory}
                    </div>
                </div>

                <div
                    style={{
                        marginTop: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 18,
                    }}
                >
                    {chips.length > 0 ? (
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 10,
                            }}
                        >
                            {chips.map((name) => (
                                <span
                                    key={name}
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 600,
                                        color: ACCENT,
                                        background: SURFACE,
                                        padding: "6px 14px",
                                        borderRadius: 8,
                                        border: "1px solid #1e293b",
                                    }}
                                >
                                    {name}
                                </span>
                            ))}
                        </div>
                    ) : null}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: 22,
                            color: MUTED,
                        }}
                    >
                        <span>3-confirm · build · ship</span>
                        <span style={{ fontWeight: 600, color: TEXT }}>
                            gunjo.jp/cold-tests/categories/{slug}
                        </span>
                    </div>
                </div>
            </div>
        ),
        size
    );
}
