#!/usr/bin/env node
/**
 * Capture every /embed/<slug> route as a static PNG thumbnail
 * for the Showcase grid. Run locally against `npm run dev` (port 13030):
 *
 *   npm run dev               # in another terminal
 *   npm run showcase:thumbs
 *
 * Or supply a custom base URL:
 *
 *   SHOWCASE_BASE_URL=http://127.0.0.1:13030 npm run showcase:thumbs
 *
 * Output: public/showcase-thumbs/<slug>.<mode>.png
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, "..");
const CATEGORIES = [
    "Inputs",
    "Display",
    "Charts",
    "Feedback",
    "Navigation",
    "Overlay",
    "Layout",
    "Patterns",
];

// Capture viewport — wide enough that template-scale demos (Calendar,
// Bannalyze, DataTable, Kanban) render at their natural width. We then
// clip the screenshot down to the demo's actual bounding box so small
// demos (single Button, Tag, Breadcrumb) don't leave the showcase grid
// awash in empty space.
// deviceScaleFactor: 2 renders thumbnails at retina resolution so the
// showcase grid stays crisp on high-DPI displays (clip math stays in CSS px).
const VIEWPORT = { width: 1280, height: 720, deviceScaleFactor: 2 };
const DEMO_PADDING = 32; // px of breathing room around the clipped demo

function parseArgs(argv) {
    const options = {
        baseUrl: process.env.SHOWCASE_BASE_URL ?? "http://127.0.0.1:13030",
        outDir: "public/showcase-thumbs",
        categories: new Set(CATEGORIES),
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
        if (arg.startsWith("--category=")) {
            options.categories = new Set(
                arg
                    .slice("--category=".length)
                    .split(",")
                    .map((v) => v.trim())
                    .filter(Boolean)
            );
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

function parseRoutesFromNavigation() {
    const navigationPath = join(ROOT, "app", "lib", "navigation.ts");
    const source = readFileSync(navigationPath, "utf8");
    const sectionPattern =
        /title:\s*"([^"]+)",\s*\n\s*items:\s*\[([\s\S]*?)\n\s*\]/g;
    const hrefPattern = /href:\s*"\/docs\/components\/([^"]+)"/g;

    const routes = [];
    const seen = new Set();
    for (const sectionMatch of source.matchAll(sectionPattern)) {
        const [, category, itemsSource] = sectionMatch;
        if (!CATEGORIES.includes(category)) continue;
        for (const itemMatch of itemsSource.matchAll(hrefPattern)) {
            const [, slug] = itemMatch;
            const routeKey = `${category}/${slug}`;
            if (seen.has(routeKey)) continue;
            seen.add(routeKey);
            routes.push({ category, slug });
        }
    }

    return routes;
}

function matchesOnlyFilter(route, onlyItems) {
    if (onlyItems.length === 0) return true;
    const routeKey = `${route.category}/${route.slug}`;
    return onlyItems.some(
        (item) => item === routeKey || item === route.slug
    );
}

function normalizeRelativePath(p) {
    return p.split("\\").join("/");
}

const COLOR_SCHEMES = ["light", "dark"];

async function captureRouteForMode(page, route, options, outputRoot, mode) {
    const url = `${options.baseUrl}/embed/${route.slug}`;
    const imagePath = join(outputRoot, `${route.slug}.${mode}.png`);

    try {
        // Tell the embed page which mode to render. The /embed layout uses
        // next-themes with defaultTheme=system, so emulating prefers-color-scheme
        // flips it on first paint.
        await page.emulateMediaFeatures([
            { name: "prefers-color-scheme", value: mode },
        ]);

        const response = await page.goto(url, {
            waitUntil: "networkidle0",
            timeout: options.timeoutMs,
        });
        if (!response || response.status() >= 400) {
            return await captureDocsPreviewForMode(page, route, options, outputRoot, mode);
        }
        // Give client components a moment to paint after networkidle (some
        // demos animate in via useEffect).
        await new Promise((r) => setTimeout(r, 300));

        // Find the demo's bounding box. Embed pages render
        //   <div className="flex min-h-screen items-center justify-center p-4">
        //     <DemoComponent />
        //   </div>
        // so the demo is the first child of the centering wrapper. Falls back
        // to a full-viewport screenshot if the wrapper isn't there.
        const bbox = await page.evaluate((padding) => {
            const wrapper = document.querySelector(
                ".flex.min-h-screen.items-center.justify-center"
            );
            const demo = wrapper?.firstElementChild;
            if (!demo) return null;
            const rect = demo.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return null;
            const w = window.innerWidth;
            const h = window.innerHeight;
            return {
                x: Math.max(0, Math.floor(rect.x - padding)),
                y: Math.max(0, Math.floor(rect.y - padding)),
                width: Math.min(
                    w,
                    Math.ceil(rect.width + padding * 2)
                ),
                height: Math.min(
                    h,
                    Math.ceil(rect.height + padding * 2)
                ),
            };
        }, DEMO_PADDING);

        const screenshotOpts = { path: imagePath, type: "png" };
        if (bbox && bbox.width >= 64 && bbox.height >= 32) {
            screenshotOpts.clip = bbox;
        }
        await page.screenshot(screenshotOpts);

        return {
            ...route,
            mode,
            status: "captured",
            file: normalizeRelativePath(relative(ROOT, imagePath)),
            clip: screenshotOpts.clip ?? null,
            error: null,
        };
    } catch (error) {
        return {
            ...route,
            mode,
            status: "failed",
            file: null,
            error:
                error instanceof Error ? error.message : String(error),
        };
    }
}

async function captureDocsPreviewForMode(page, route, options, outputRoot, mode) {
    const url = `${options.baseUrl}/docs/components/${route.slug}`;
    const imagePath = join(outputRoot, `${route.slug}.${mode}.png`);

    const response = await page.goto(url, {
        waitUntil: "networkidle0",
        timeout: options.timeoutMs,
    });
    if (!response || response.status() >= 400) {
        throw new Error(
            `No preview source for ${route.slug}: /embed and /docs both returned ${response?.status() ?? "no response"}`
        );
    }

    await new Promise((r) => setTimeout(r, 300));

    const preview = await page.$("[data-doc-component-preview-surface='true']");
    if (!preview) {
        throw new Error(`No docs preview surface found for ${route.slug}`);
    }

    await preview.screenshot({ path: imagePath, type: "png" });

    return {
        ...route,
        mode,
        status: "captured",
        file: normalizeRelativePath(relative(ROOT, imagePath)),
        clip: "docs-preview-surface",
        error: null,
    };
}

async function captureRoute(page, route, options, outputRoot) {
    const results = [];
    for (const mode of COLOR_SCHEMES) {
        results.push(
            await captureRouteForMode(page, route, options, outputRoot, mode)
        );
    }
    return results;
}

async function main() {
    const options = parseArgs(process.argv.slice(2));
    const outRoot = join(ROOT, options.outDir);
    mkdirSync(outRoot, { recursive: true });

    const routes = parseRoutesFromNavigation().filter(
        (route) =>
            options.categories.has(route.category) &&
            matchesOnlyFilter(route, options.only)
    );

    const targets =
        options.limit == null ? routes : routes.slice(0, options.limit);

    if (targets.length === 0) {
        console.log("showcase:thumbs: no target routes.");
        return;
    }

    console.log(
        `showcase:thumbs: capturing ${targets.length} routes from ${options.baseUrl}`
    );

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: VIEWPORT,
    });
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);

    const results = [];
    for (const route of targets) {
        process.stdout.write(
            `showcase:thumbs: ${route.category}/${route.slug} ... `
        );
        const routeResults = await captureRoute(page, route, options, outRoot);
        results.push(...routeResults);
        const ok = routeResults.every((r) => r.status === "captured");
        if (ok) {
            console.log("ok (light + dark)");
        } else {
            const failures = routeResults
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

    const isFullCapture =
        options.only.length === 0 &&
        CATEGORIES.every((category) => options.categories.has(category));
    if (isFullCapture) {
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
    }

    console.log(
        `showcase:thumbs: ${captured}/${results.length} captured (${failed} failed) -> ${normalizeRelativePath(
            relative(ROOT, outRoot)
        )}`
    );

    if (failed > 0) process.exit(1);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
