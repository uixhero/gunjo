"use client";

/**
 * Hero background — gunjō ink wash.
 *
 * Layered washes evoking sumi-e ink bleeding into wet paper. All
 * gradients live in app/globals.css under .gunjo-hero-* so the colors
 * are token-driven (no hardcoded literals in this file).
 */

export function HeroBackground() {
    return (
        <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden
        >
            <div className="absolute inset-0 gunjo-hero-base" />
            <div className="absolute inset-0 gunjo-hero-photo" />
            <div className="absolute inset-0 gunjo-hero-lightpulse" />
            <div className="absolute inset-0 gunjo-hero-corners" />
            <svg
                className="absolute inset-0 h-full w-full opacity-[0.06] mix-blend-overlay"
                aria-hidden
            >
                <filter id="hero-grain">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.9"
                        numOctaves="2"
                        stitchTiles="stitch"
                    />
                    <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#hero-grain)" />
            </svg>
            <div className="absolute inset-0 gunjo-hero-vignette" />
            <div className="absolute inset-0 gunjo-hero-scrim" />
            <div className="absolute inset-x-0 bottom-0 h-[26%] gunjo-hero-fade" />
        </div>
    );
}
