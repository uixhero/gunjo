#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, "..");
const CATEGORIES = ["atoms", "molecules", "organisms", "patterns"];

function parseArgs(argv) {
  const options = {
    baseUrl: process.env.DESIGN_DOCS_BASE_URL ?? "http://127.0.0.1:3002",
    outDir: ".design-audit/docs",
    categories: new Set(CATEGORIES),
    only: [],
    limit: null,
    timeoutMs: 90_000,
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
      const values = arg
        .slice("--category=".length)
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      options.categories = new Set(values);
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

function slugToKey(slug) {
  return String(slug)
    .split("-")
    .filter(Boolean)
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join("");
}

function docsKeysFromHref(category, slug) {
  const baseKey = slugToKey(slug);
  if (category === "patterns") return [`${baseKey}Template`];
  return [baseKey];
}

function parseRoutesFromNavigation() {
  const navigationPath = join(ROOT, "app", "lib", "navigation.ts");
  const source = readFileSync(navigationPath, "utf8");
  const pattern =
    /href:\s*"\/docs\/components\/(atoms|molecules|organisms|templates)\/([^"]+)"/g;

  const routes = [];
  const seen = new Set();
  for (const match of source.matchAll(pattern)) {
    const [, category, slug] = match;
    const routeKey = `${category}/${slug}`;
    if (seen.has(routeKey)) continue;
    seen.add(routeKey);
    routes.push({
      category,
      slug,
      pageId: `components/${category}/${slug}`,
      docsKeys: docsKeysFromHref(category, slug),
    });
  }

  return routes;
}

function normalizeRelativePath(pathValue) {
  return pathValue.split("\\").join("/");
}

function matchesOnlyFilter(route, onlyItems) {
  if (onlyItems.length === 0) return true;
  const routeKey = `${route.category}/${route.slug}`;
  const pageId = route.pageId;
  const componentKeys = new Set(route.docsKeys);
  return onlyItems.some((item) => {
    if (item === routeKey || item === pageId || item === route.slug) return true;
    if (componentKeys.has(item)) return true;
    return false;
  });
}

async function captureRoute(page, route, options, outputRoot) {
  const url = `${options.baseUrl}/docs/components/${route.category}/${route.slug}`;
  const categoryDir = join(outputRoot, route.category);
  mkdirSync(categoryDir, { recursive: true });

  const pageImagePath = join(categoryDir, `${route.slug}.page.png`);
  const previewImagePath = join(categoryDir, `${route.slug}.preview.png`);

  const result = {
    ...route,
    url,
    status: "captured",
    screenshots: {
      page: normalizeRelativePath(relative(ROOT, pageImagePath)),
      preview: null,
    },
    error: null,
  };

  try {
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: options.timeoutMs,
    });

    await page.waitForSelector(
      "[data-doc-component-layout], main",
      { timeout: options.timeoutMs }
    );

    await page.screenshot({ path: pageImagePath, fullPage: true });

    const previewElement =
      (await page.$("[data-doc-component-preview-surface]")) ??
      (await page.$("[data-doc-component-preview]")) ??
      (await page.$("[data-doc-component-layout]"));

    if (previewElement) {
      await previewElement.screenshot({ path: previewImagePath });
      result.screenshots.preview = normalizeRelativePath(
        relative(ROOT, previewImagePath)
      );
    } else {
      result.status = "captured_without_preview";
    }
  } catch (error) {
    result.status = "failed";
    result.error = error instanceof Error ? error.message : String(error);
  }

  return result;
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

  const targetRoutes =
    options.limit == null ? routes : routes.slice(0, options.limit);

  if (targetRoutes.length === 0) {
    console.log("design:audit: No target component routes found.");
    return;
  }

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1600, height: 1200, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();

  const results = [];
  for (const route of targetRoutes) {
    console.log(`design:audit: capturing ${route.pageId}`);
    const result = await captureRoute(page, route, options, outRoot);
    results.push(result);
    if (result.status === "failed") {
      console.log(`design:audit: failed ${route.pageId} (${result.error})`);
    }
  }

  await page.close();
  await browser.close();

  const captured = results.filter((item) => item.status !== "failed").length;
  const failed = results.length - captured;

  const manifest = {
    generatedAt: new Date().toISOString(),
    baseUrl: options.baseUrl,
    outDir: normalizeRelativePath(relative(ROOT, outRoot)),
    total: results.length,
    captured,
    failed,
    results,
  };

  const manifestPath = join(outRoot, "manifest.json");
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(
    `design:audit: captured ${captured}/${results.length} routes (${failed} failed)`
  );
  console.log(`design:audit: manifest -> ${normalizeRelativePath(relative(ROOT, manifestPath))}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
