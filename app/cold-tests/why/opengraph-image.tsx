import { ImageResponse } from "next/og";
import gallery from "@/data/cold-test-gallery.json";

// Next.js Metadata Route conventions — these named exports configure the
// generated <meta property="og:image"> tags. Bumping `size` requires no
// other code changes because the spec is read from this module.
export const alt =
    "GunjoUI cold tests — a context-free AI keeps building real-industry screens";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface GalleryShape {
    count: number;
}

// Mirrors the `CRYSTALLISED` list in WhyView; trimmed to fit the OG canvas.
// These are the primitives the cold-test run produced — shown here to make
// the share preview tangible rather than abstract methodology copy.
const PRIMITIVES = [
    "ScanGate",
    "ReferenceValue",
    "SafetyBanner",
    "CoSign",
    "SignedRecord",
    "MatchCard",
    "Stringline",
    "StatusBoard",
];

// Brand palette pulled from app/gunjo-tokens.css dark theme so the OG card
// reads as a darker, more saturated extension of the site. Keep in sync if
// the tokens move — these are baked at build time, not read live.
const BG = "#020817"; // --background dark
const SURFACE = "#0b1124"; // slightly lighter accent
const TEXT = "#f8fafc"; // slate-50
const MUTED = "#94a3b8"; // slate-400
const ACCENT = "#3b82f6"; // --primary dark (gunjō blue)

export default async function Image() {
    const count = (gallery as GalleryShape).count;
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
                {/* Diffuse blue glow in the upper-right — the "gunjō" colour
                    bleeding through. Positioned absolutely so layout above
                    is unaffected. */}
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
                        fontSize: 28,
                        letterSpacing: 4,
                        color: ACCENT,
                        fontWeight: 700,
                        textTransform: "uppercase",
                    }}
                >
                    GUNJO
                    <span style={{ color: MUTED, letterSpacing: 2, fontWeight: 500 }}>
                        / cold tests
                    </span>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: 28,
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
                            {count}
                        </span>
                        <span
                            style={{
                                fontSize: 48,
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
                            marginTop: 20,
                            fontSize: 30,
                            color: TEXT,
                            maxWidth: 980,
                            lineHeight: 1.3,
                            letterSpacing: -0.5,
                        }}
                    >
                        A context-free AI builds real-industry screens with
                        gunjo/ui — round after round.
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
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 10,
                        }}
                    >
                        {PRIMITIVES.map((name) => (
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
                            gunjo.jp/cold-tests/why
                        </span>
                    </div>
                </div>
            </div>
        ),
        size
    );
}
