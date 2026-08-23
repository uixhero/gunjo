#!/usr/bin/env node
/**
 * Capture the insurance demo's working screens as thumbnails for the demo
 * entry page's screen list. Run locally against `npm run dev` (port 13030):
 *
 *   npm run dev                    # in another terminal
 *   npm run insurance-demo:shots
 *
 * Or supply a custom base URL:
 *
 *   INSURANCE_DEMO_BASE_URL=http://127.0.0.1:13030 npm run insurance-demo:shots
 *
 * Output: public/insurance-demo-shots/<slug>.<mode>.webp   (600px — card)
 *         public/insurance-demo-shots/<slug>.<mode>.lg.webp (1400px — retina)
 *
 * Capture follows scripts/showcase-capture-thumbs.mjs (in-repo routes, both
 * colour schemes via prefers-color-scheme). Delivery follows
 * scripts/build-coldtest-thumbs.mjs (cwebp q85, which is 5-7x smaller than PNG
 * with no perceptible loss on UI screenshots). Requires `cwebp` on PATH:
 * `brew install webp`.
 *
 * These are deliberately NOT written into public/cold-test-shots/. That folder
 * holds the cold-test round evidence, regenerated from the gunjo-test app; the
 * demo screens are the *adapted* versions living in this repo, so they need
 * their own home or a regeneration would silently overwrite the evidence.
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, "..");
const OUT_DIR = join(ROOT, "public", "insurance-demo-shots");
const BASE_URL =
    process.env.INSURANCE_DEMO_BASE_URL ?? "http://127.0.0.1:13030";
const DEMO_BASE = "/cold-tests/categories/insurance/demo";
const QUALITY = 85;

// 1440x900 desktop, matching the cold-test capture harness. deviceScaleFactor 2
// gives a 2880x1800 source that both output tiers downscale from.
const VIEWPORT = { width: 1440, height: 900, deviceScaleFactor: 2 };
const COLOR_SCHEMES = ["light", "dark"];
const SLUGS = ["policies", "claims", "payments"];
const TIERS = [
    { suffix: "", width: 600 }, // screen-list card
    { suffix: ".lg", width: 1400 }, // retina / full view
];

function toWebp(srcPng, dst, width) {
    const args = ["-q", String(QUALITY), "-mt", "-resize", String(width), "0", srcPng, "-o", dst];
    try {
        execFileSync("cwebp", args, { stdio: ["ignore", "ignore", "pipe"] });
    } catch (err) {
        const stderr = err.stderr ? err.stderr.toString() : "";
        throw new Error(`cwebp failed on ${srcPng} → ${dst}\nargs: ${args.join(" ")}\n${stderr}`);
    }
}

async function main() {
    try {
        execFileSync("cwebp", ["-version"], { stdio: ["ignore", "ignore", "ignore"] });
    } catch {
        console.error("cwebp not found on PATH. Install it once with: brew install webp");
        process.exit(1);
    }

    mkdirSync(OUT_DIR, { recursive: true });

    const browser = await puppeteer.launch({ headless: true, defaultViewport: VIEWPORT });
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);

    let written = 0;
    for (const slug of SLUGS) {
        for (const mode of COLOR_SCHEMES) {
            process.stdout.write(`insurance-demo:shots: ${slug}.${mode} ... `);
            await page.emulateMediaFeatures([
                { name: "prefers-color-scheme", value: mode },
            ]);
            const url = `${BASE_URL}${DEMO_BASE}/${slug}`;
            const response = await page.goto(url, {
                waitUntil: "networkidle0",
                timeout: 60_000,
            });
            if (!response || response.status() >= 400) {
                throw new Error(`${url} returned ${response?.status() ?? "no response"}`);
            }
            // Client components paint after networkidle (charts, drawers).
            await new Promise((r) => setTimeout(r, 500));

            // Clip away the docs-site chrome (global nav + search) so the
            // thumbnail shows the demo screen itself. The demo shell opens with
            // the fictional-company disclaimer, so its top edge is where the
            // screen starts; fall back to the full viewport if it is missing.
            const clip = await page.evaluate(() => {
                const alert = document.querySelector('[role="alert"]');
                if (!alert) return null;
                const top = Math.max(0, Math.floor(alert.getBoundingClientRect().top - 16));
                if (top <= 0 || top >= window.innerHeight - 200) return null;
                return {
                    x: 0,
                    y: top,
                    width: window.innerWidth,
                    height: window.innerHeight - top,
                };
            });

            const tmpPng = join(OUT_DIR, `.${slug}.${mode}.tmp.png`);
            await page.screenshot({ path: tmpPng, type: "png", ...(clip ? { clip } : {}) });
            for (const tier of TIERS) {
                toWebp(tmpPng, join(OUT_DIR, `${slug}.${mode}${tier.suffix}.webp`), tier.width);
                written++;
            }
            rmSync(tmpPng, { force: true });
            console.log("ok");
        }
    }

    await page.close();
    await browser.close();

    let bytes = 0;
    for (const slug of SLUGS) {
        for (const mode of COLOR_SCHEMES) {
            for (const tier of TIERS) {
                bytes += statSync(join(OUT_DIR, `${slug}.${mode}${tier.suffix}.webp`)).size;
            }
        }
    }
    console.log(
        `insurance-demo:shots: ${written} files (WebP q${QUALITY}, ${(bytes / 1024).toFixed(0)} KB total) -> ${relative(ROOT, OUT_DIR)}/`
    );
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
