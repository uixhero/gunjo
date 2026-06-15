#!/usr/bin/env node
/**
 * Capture every /patterns/<slug> route as a static PNG thumbnail for
 * the Patterns index grid. Run locally against `npm run dev` (port 13030):
 *
 *   npm run dev               # in another terminal
 *   npm run patterns:thumbs
 *
 * Or supply a custom base URL:
 *
 *   PATTERNS_BASE_URL=http://127.0.0.1:13030 npm run patterns:thumbs
 *
 * Output: public/patterns-thumbs/<slug>.png
 *
 * Mirrors scripts/showcase-capture-thumbs.mjs. The differences:
 *   - target route is /embed/patterns/<slug>, which renders the pattern
 *     inside the chrome-less embed layout (no top nav, no breadcrumbs).
 *     The route is defined in app/embed/patterns/[slug]/page.tsx.
 *   - no per-demo bbox clipping; pattern pages are designed to fill the
 *     viewport.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, "..");

// Match the iframe dimensions the previous PreviewFrame used so the PNG
// can drop into the existing 0.39-scale slot without a visual jump.
// deviceScaleFactor: 2 so the 1280-wide capture stays crisp when the
// homepage carousel renders it near full width on HiDPI/retina screens
// (at 1x it was upscaled ~1.7x and looked blurry).
const VIEWPORT = { width: 1280, height: 800, deviceScaleFactor: 2 };

function parseArgs(argv) {
    const options = {
        baseUrl: process.env.PATTERNS_BASE_URL ?? "http://127.0.0.1:13030",
        outDir: "public/patterns-thumbs",
        only: [],
        limit: null,
        timeoutMs: 30_000,
    };

    for (const arg of argv) {
        if (arg.startsWith("--base-url=")) {
            options.baseUrl = arg.slice("--base-url=".length);
            continue;
        }
        if (arg.startsWith("--out-dir=")) {
            options.outDir = arg.slice("--out-dir=".length);
            continue;
        }
        if (arg.startsWith("--only=")) {
            options.only = arg
                .slice("--only=".length)
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean);
            continue;
        }
        if (arg.startsWith("--limit=")) {
            const value = Number(arg.slice("--limit=".length));
            if (!Number.isNaN(value) && value > 0) options.limit = value;
            continue;
        }
        if (arg.startsWith("--timeout=")) {
            const value = Number(arg.slice("--timeout=".length));
            if (!Number.isNaN(value) && value > 0) options.timeoutMs = value;
            continue;
        }
    }

    return options;
}

function parseSlugsFromPatternsModule() {
    const patternsPath = join(ROOT, "app", "lib", "patterns.ts");
    const source = readFileSync(patternsPath, "utf8");
    const pattern = /slug:\s*"([^"]+)"/g;

    const slugs = [];
    const seen = new Set();
    for (const match of source.matchAll(pattern)) {
        const [, slug] = match;
        if (seen.has(slug)) continue;
        seen.add(slug);
        slugs.push(slug);
    }
    return slugs;
}

function matchesOnlyFilter(slug, onlyItems) {
    if (onlyItems.length === 0) return true;
    return onlyItems.includes(slug);
}

function normalizeRelativePath(p) {
    return p.split("\\").join("/");
}

const COLOR_SCHEMES = ["light", "dark"];

async function captureSlugForMode(page, slug, options, outputRoot, mode) {
    const url = `${options.baseUrl}/embed/patterns/${slug}`;
    mkdirSync(outputRoot, { recursive: true });
    const imagePath = join(outputRoot, `${slug}.${mode}.png`);

    try {
        // The /embed layout uses next-themes with defaultTheme=system, so
        // emulating prefers-color-scheme flips it on first paint.
        await page.emulateMediaFeatures([
            { name: "prefers-color-scheme", value: mode },
        ]);

        await page.goto(url, {
            waitUntil: "networkidle0",
            timeout: options.timeoutMs,
        });
        // Give client components a moment to paint after networkidle (some
        // patterns animate in via useEffect).
        await new Promise((r) => setTimeout(r, 300));

        await page.screenshot({ path: imagePath, type: "png" });

        return {
            slug,
            mode,
            status: "captured",
            file: normalizeRelativePath(relative(ROOT, imagePath)),
            error: null,
        };
    } catch (error) {
        return {
            slug,
            mode,
            status: "failed",
            file: null,
            error:
                error instanceof Error ? error.message : String(error),
        };
    }
}

async function captureRoute(page, slug, options, outputRoot) {
    const results = [];
    for (const mode of COLOR_SCHEMES) {
        results.push(
            await captureSlugForMode(page, slug, options, outputRoot, mode)
        );
    }
    return results;
}

async function main() {
    const options = parseArgs(process.argv.slice(2));
    const outRoot = join(ROOT, options.outDir);
    mkdirSync(outRoot, { recursive: true });

    const slugs = parseSlugsFromPatternsModule().filter((slug) =>
        matchesOnlyFilter(slug, options.only)
    );

    const targets = options.limit == null ? slugs : slugs.slice(0, options.limit);

    if (targets.length === 0) {
        console.log("patterns:thumbs: no target slugs.");
        return;
    }

    console.log(
        `patterns:thumbs: capturing ${targets.length} routes from ${options.baseUrl}`
    );

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: VIEWPORT,
    });
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);

    const results = [];
    for (const slug of targets) {
        process.stdout.write(`patterns:thumbs: ${slug} ... `);
        const slugResults = await captureRoute(page, slug, options, outRoot);
        results.push(...slugResults);
        const ok = slugResults.every((r) => r.status === "captured");
        if (ok) {
            console.log("ok (light + dark)");
        } else {
            const failures = slugResults
                .filter((r) => r.status !== "captured")
                .map((r) => `${r.mode}: ${r.error}`)
                .join("; ");
            console.log(`FAIL (${failures})`);
        }
    }

    await page.close();
    await browser.close();

    const captured = results.filter((r) => r.status === "captured").length;
    const failed = results.length - captured;

    const manifestPath = join(outRoot, "manifest.json");
    writeFileSync(
        manifestPath,
        `${JSON.stringify(
            {
                generatedAt: new Date().toISOString(),
                baseUrl: options.baseUrl,
                viewport: VIEWPORT,
                total: results.length,
                captured,
                failed,
                results,
            },
            null,
            2
        )}\n`,
        "utf8"
    );

    console.log(
        `patterns:thumbs: ${captured}/${results.length} captured (${failed} failed) -> ${normalizeRelativePath(
            relative(ROOT, outRoot)
        )}`
    );

    if (failed > 0) process.exit(1);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
