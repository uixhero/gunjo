#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, "..");
const NAVIGATION_PATH = join(ROOT, "app", "lib", "navigation.ts");
const REPORT_PATH = join(ROOT, "docs", "component-page-crawl-audit.md");
const JSON_PATH = join(ROOT, "docs", "component-page-crawl-audit.json");

const COMPONENT_CATEGORIES = [
    "Inputs",
    "Display",
    "Charts",
    "Feedback",
    "Navigation",
    "Overlay",
    "Layout",
];

const VIEWPORTS = {
    desktop: { width: 1440, height: 1000, deviceScaleFactor: 1 },
    mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

const THEMES = ["light", "dark"];

function parseArgs(argv) {
    const options = {
        baseUrl: process.env.DOCS_CRAWL_BASE_URL ?? "http://127.0.0.1:13030",
        timeoutMs: 30_000,
        settleMs: 600,
        only: [],
        limit: null,
        categories: new Set(COMPONENT_CATEGORIES),
        viewports: new Set(Object.keys(VIEWPORTS)),
        themes: new Set(THEMES),
        includeOverview: true,
        reportPath: REPORT_PATH,
        jsonPath: JSON_PATH,
        mergeJsonPaths: [],
    };

    for (const arg of argv) {
        if (arg.startsWith("--base-url=")) {
            options.baseUrl = arg.slice("--base-url=".length);
            continue;
        }
        if (arg.startsWith("--timeout=")) {
            const value = Number(arg.slice("--timeout=".length));
            if (Number.isFinite(value) && value > 0) options.timeoutMs = value;
            continue;
        }
        if (arg.startsWith("--settle=")) {
            const value = Number(arg.slice("--settle=".length));
            if (Number.isFinite(value) && value >= 0) options.settleMs = value;
            continue;
        }
        if (arg.startsWith("--only=")) {
            options.only = arg
                .slice("--only=".length)
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
            continue;
        }
        if (arg.startsWith("--limit=")) {
            const value = Number(arg.slice("--limit=".length));
            if (Number.isFinite(value) && value > 0) options.limit = value;
            continue;
        }
        if (arg.startsWith("--category=")) {
            options.categories = new Set(
                arg
                    .slice("--category=".length)
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => COMPONENT_CATEGORIES.includes(item))
            );
            continue;
        }
        if (arg.startsWith("--viewports=")) {
            options.viewports = new Set(
                arg
                    .slice("--viewports=".length)
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => item in VIEWPORTS)
            );
            continue;
        }
        if (arg.startsWith("--themes=")) {
            options.themes = new Set(
                arg
                    .slice("--themes=".length)
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => THEMES.includes(item))
            );
            continue;
        }
        if (arg === "--no-overview") {
            options.includeOverview = false;
            continue;
        }
        if (arg.startsWith("--report=")) {
            options.reportPath = arg.slice("--report=".length);
            continue;
        }
        if (arg.startsWith("--json=")) {
            options.jsonPath = arg.slice("--json=".length);
            continue;
        }
        if (arg.startsWith("--merge-json=")) {
            options.mergeJsonPaths = arg
                .slice("--merge-json=".length)
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
        }
    }

    return options;
}

function parseRoutesFromNavigation() {
    const source = readFileSync(NAVIGATION_PATH, "utf8");
    const sectionPattern =
        /title:\s*"([^"]+)",\s*\n\s*items:\s*\[([\s\S]*?)\n\s*\]/g;
    const itemPattern = /\{\s*title:\s*"([^"]+)",\s*href:\s*"\/docs\/components\/([^"]+)"/g;

    const routes = [];
    const seen = new Set();
    for (const sectionMatch of source.matchAll(sectionPattern)) {
        const [, category, itemsSource] = sectionMatch;
        if (!COMPONENT_CATEGORIES.includes(category)) continue;
        for (const itemMatch of itemsSource.matchAll(itemPattern)) {
            const [, title, slug] = itemMatch;
            const key = `${category}/${slug}`;
            if (seen.has(key)) continue;
            seen.add(key);
            routes.push({
                category,
                title,
                slug,
                href: `/docs/components/${slug}`,
                isOverview: title.endsWith("Overview"),
            });
        }
    }

    return routes;
}

function matchesOnlyFilter(route, onlyItems) {
    if (onlyItems.length === 0) return true;
    return onlyItems.some(
        (item) =>
            item === route.slug ||
            item === route.href ||
            item === route.title ||
            item === `${route.category}/${route.slug}`
    );
}

function normalizeRelativePath(pathValue) {
    return pathValue.split("\\").join("/");
}

function escapeCell(value) {
    return String(value ?? "")
        .replace(/\|/g, "\\|")
        .replace(/\n/g, "<br>");
}

function shortText(value, max = 140) {
    const text = String(value ?? "").replace(/\s+/g, " ").trim();
    if (text.length <= max) return text;
    return `${text.slice(0, max - 1)}…`;
}

function classifyRequestUrl(url) {
    try {
        const parsed = new URL(url);
        return `${parsed.pathname}${parsed.search}`;
    } catch {
        return url;
    }
}

async function collectFrameMetrics(page) {
    const frames = page
        .frames()
        .filter((frame) => frame.url().includes("/embed/"));

    const metrics = [];
    for (const frame of frames) {
        try {
            metrics.push(
                await frame.evaluate(() => {
                    const wrap = document.querySelector("[data-embed-preview-wrap]");
                    const rect = wrap?.getBoundingClientRect();
                    const root = document.documentElement;
                    const body = document.body;
                    return {
                        url: window.location.pathname + window.location.search,
                        hasWrap: Boolean(wrap),
                        wrapWidth: rect ? Math.round(rect.width) : 0,
                        wrapHeight: rect ? Math.round(rect.height) : 0,
                        bodyTextLength: body?.innerText?.trim().length ?? 0,
                        bodyChildCount: body?.children.length ?? 0,
                        horizontalOverflow: root.scrollWidth > root.clientWidth + 2,
                        verticalOverflow: root.scrollHeight > root.clientHeight + 2,
                        scrollWidth: root.scrollWidth,
                        clientWidth: root.clientWidth,
                        scrollHeight: root.scrollHeight,
                        clientHeight: root.clientHeight,
                    };
                })
            );
        } catch (error) {
            metrics.push({
                url: frame.url(),
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    return metrics;
}

async function inspectPage(page) {
    return page.evaluate(() => {
        const layout = document.querySelector("[data-doc-component-layout]");
        const previewSurfaces = Array.from(
            document.querySelectorAll("[data-doc-component-preview-surface]")
        );
        const iframes = Array.from(document.querySelectorAll("iframe"));
        const root = document.documentElement;
        const body = document.body;
        const h1 = document.querySelector("h1");

        const previewMetrics = previewSurfaces.map((surface, index) => {
            const rect = surface.getBoundingClientRect();
            return {
                index,
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                textLength: surface.textContent?.trim().length ?? 0,
                childCount: surface.children.length,
                horizontalOverflow: surface.scrollWidth > surface.clientWidth + 2,
                verticalOverflow: surface.scrollHeight > surface.clientHeight + 2,
                scrollWidth: surface.scrollWidth,
                clientWidth: surface.clientWidth,
                scrollHeight: surface.scrollHeight,
                clientHeight: surface.clientHeight,
            };
        });

        return {
            title: h1?.textContent?.trim() ?? "",
            hasLayout: Boolean(layout),
            previewSurfaceCount: previewSurfaces.length,
            iframeCount: iframes.length,
            codeTabCount: document.querySelectorAll('[role="tab"], button').length,
            bodyTextLength: body?.innerText?.trim().length ?? 0,
            documentHorizontalOverflow: root.scrollWidth > root.clientWidth + 2,
            documentScrollWidth: root.scrollWidth,
            documentClientWidth: root.clientWidth,
            previewMetrics,
        };
    });
}

async function collectCodeExampleMetrics(page, enabled) {
    if (!enabled) return [];

    const previews = await page.$$("[data-doc-component-preview]");
    for (const preview of previews) {
        const tabs = await preview.$$('[role="tab"]');
        for (const tab of tabs) {
            const isCodeTab = await tab.evaluate((element) => {
                const controls = element.getAttribute("aria-controls") ?? "";
                const text = element.textContent?.trim() ?? "";
                return controls.endsWith("content-code") || text === "Code" || text === "コード";
            });
            if (!isCodeTab) continue;
            try {
                await tab.click();
            } catch {
                // Some overlay demos can keep an inactive tab outside the clickable viewport.
                // Treat missing code as a snippet warning instead of failing the page crawl.
            }
            break;
        }
    }

    await new Promise((resolve) => setTimeout(resolve, 2_000));

    return page.evaluate(() =>
        Array.from(document.querySelectorAll("[data-doc-component-preview]")).map((preview, index) => {
            const selectedTab = Array.from(preview.querySelectorAll('[role="tab"]')).find(
                (tab) => tab.getAttribute("aria-selected") === "true"
            );
            const code = preview.querySelector("pre")?.textContent ?? "";
            const heading =
                preview.closest("section")?.querySelector("h2, h3, h4")?.textContent?.replace(/\s+/g, " ").trim() ??
                "";
            return {
                index,
                heading,
                selectedTab: selectedTab?.textContent?.replace(/\s+/g, " ").trim() ?? "",
                code,
                codeLength: code.trim().length,
                lineCount: code.trim() ? code.trim().split(/\r?\n/).length : 0,
            };
        })
    );
}

function stripImportsAndComments(code) {
    return code
        .replace(/^\s*import\b[^\n]*(?:\n|$)/gm, "")
        .replace(/^\s*\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .trim();
}

function hasDeclaration(code, identifier) {
    const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:const|let|var|function|class|type|interface)\\s+${escaped}\\b`).test(code);
}

function findMissingReferencedIdentifiers(code) {
    const propPattern =
        /\b(?:data|items|source|rows|columns|series|segments|rings|layers|cohorts|periods|regions|slots|labels|values)\s*=\s*\{\s*([A-Za-z_$][\w$]*)\s*\}/g;
    const missing = new Set();
    for (const match of code.matchAll(propPattern)) {
        const identifier = match[1];
        if (!hasDeclaration(code, identifier)) missing.add(identifier);
    }
    return Array.from(missing);
}

function formatCodeSurface(codeMetric) {
    return codeMetric.heading
        ? `surface ${codeMetric.index} (${codeMetric.heading})`
        : `surface ${codeMetric.index}`;
}

function analyzeCodeExample(codeMetric) {
    const findings = [];
    const code = codeMetric.code.trim();
    const surface = formatCodeSurface(codeMetric);
    if (!code) {
        findings.push({
            severity: "warning",
            type: "code-missing",
            detail: `${surface}: no code block found`,
        });
        return findings;
    }

    const executableBody = stripImportsAndComments(code);
    if (executableBody.length < 30) {
        findings.push({
            severity: "warning",
            type: "code-import-only",
            detail: `${surface}: code body is too small after imports/comments`,
        });
    }

    if (/\/\*\s*\.\.\.\s*\*\/|\{\s*\/\*\s*\.\.\.\s*\*\/\s*\}|\/\/\s*\.\.\.|…/.test(code)) {
        findings.push({
            severity: "warning",
            type: "code-placeholder",
            detail: `${surface}: placeholder ellipsis remains in copyable code`,
        });
    }

    if (/console\.log\s*\(/.test(code)) {
        findings.push({
            severity: "warning",
            type: "code-console-action",
            detail: `${surface}: console.log action should be replaced with a realistic handler`,
        });
    }

    const missingIdentifiers = findMissingReferencedIdentifiers(code);
    if (missingIdentifiers.length > 0) {
        findings.push({
            severity: "warning",
            type: "code-missing-data-definition",
            detail: `${surface}: ${missingIdentifiers.join(", ")} referenced but not defined in snippet`,
        });
    }

    return findings;
}

function isTransientResourceFailureText(text) {
    return /net::ERR_INSUFFICIENT_RESOURCES/.test(text);
}

function buildFindings({ route, variant, responseStatus, consoleMessages, pageErrors, requestFailures, failedResponses, pageMetrics, frameMetrics, codeMetrics }) {
    const findings = [];

    if (!responseStatus || responseStatus >= 400) {
        findings.push({
            severity: "error",
            type: "page-status",
            detail: `Page returned ${responseStatus ?? "no response"}`,
        });
    }

    for (const error of pageErrors) {
        findings.push({ severity: "error", type: "page-error", detail: error });
    }

    for (const message of consoleMessages.filter((item) => item.type === "error" && !isTransientResourceFailureText(item.text))) {
        findings.push({ severity: "error", type: "console-error", detail: message.text });
    }

    for (const message of consoleMessages.filter((item) => item.type === "warning")) {
        findings.push({ severity: "warning", type: "console-warning", detail: message.text });
    }

    for (const failure of requestFailures) {
        if (isTransientResourceFailureText(failure.failureText)) continue;
        findings.push({
            severity: "error",
            type: "request-failed",
            detail: `${classifyRequestUrl(failure.url)}: ${failure.failureText}`,
        });
    }

    for (const response of failedResponses) {
        findings.push({
            severity: "error",
            type: "http-status",
            detail: `${response.status} ${classifyRequestUrl(response.url)}`,
        });
    }

    if (!route.isOverview && !pageMetrics.hasLayout) {
        findings.push({ severity: "error", type: "missing-layout", detail: "data-doc-component-layout not found" });
    }

    if (!route.isOverview && pageMetrics.previewSurfaceCount === 0) {
        findings.push({ severity: "error", type: "missing-preview", detail: "No ComponentPreview surface found" });
    }

    if (pageMetrics.documentHorizontalOverflow) {
        findings.push({
            severity: "warning",
            type: "page-horizontal-overflow",
            detail: `${pageMetrics.documentScrollWidth}px > ${pageMetrics.documentClientWidth}px`,
        });
    }

    for (const preview of pageMetrics.previewMetrics) {
        if (preview.width <= 0 || preview.height <= 0) {
            findings.push({
                severity: "error",
                type: "empty-preview-surface",
                detail: `surface ${preview.index} has ${preview.width}x${preview.height}`,
            });
        }
        if (preview.horizontalOverflow) {
            findings.push({
                severity: "warning",
                type: "preview-horizontal-overflow",
                detail: `surface ${preview.index}: ${preview.scrollWidth}px > ${preview.clientWidth}px`,
            });
        }
    }

    for (const frame of frameMetrics) {
        if (frame.error) {
            findings.push({
                severity: "error",
                type: "iframe-read-error",
                detail: `${frame.url}: ${frame.error}`,
            });
            continue;
        }
        if (!frame.hasWrap) {
            findings.push({
                severity: "error",
                type: "iframe-missing-wrap",
                detail: `${frame.url}: data-embed-preview-wrap not found`,
            });
        }
        if (frame.bodyChildCount === 0 || frame.bodyTextLength === 0) {
            findings.push({
                severity: "warning",
                type: "iframe-empty",
                detail: `${frame.url}: text=${frame.bodyTextLength}, children=${frame.bodyChildCount}`,
            });
        }
        if (frame.horizontalOverflow) {
            findings.push({
                severity: "warning",
                type: "iframe-horizontal-overflow",
                detail: `${frame.url}: ${frame.scrollWidth}px > ${frame.clientWidth}px`,
            });
        }
        if (frame.verticalOverflow && variant.viewport === "mobile") {
            findings.push({
                severity: "warning",
                type: "iframe-mobile-vertical-overflow",
                detail: `${frame.url}: ${frame.scrollHeight}px > ${frame.clientHeight}px`,
            });
        }
    }

    for (const codeMetric of codeMetrics) {
        findings.push(...analyzeCodeExample(codeMetric));
    }

    return findings.map((finding) => ({
        ...finding,
        category: route.category,
        slug: route.slug,
        title: route.title,
        viewport: variant.viewport,
        theme: variant.theme,
    }));
}

async function crawlRouteVariant(browser, route, variant, options) {
    const page = await browser.newPage();
    const consoleMessages = [];
    const pageErrors = [];
    const requestFailures = [];
    const failedResponses = [];
    const url = `${options.baseUrl}${route.href}`;

    await page.setViewport(VIEWPORTS[variant.viewport]);
    await page.emulateMediaFeatures([
        { name: "prefers-color-scheme", value: variant.theme },
    ]);

    page.on("console", (message) => {
        const type = message.type();
        if (type !== "error" && type !== "warning") return;
        consoleMessages.push({
            type,
            text: message.text(),
            location: message.location(),
        });
    });

    page.on("pageerror", (error) => {
        pageErrors.push(error instanceof Error ? error.message : String(error));
    });

    page.on("requestfailed", (request) => {
        requestFailures.push({
            url: request.url(),
            failureText: request.failure()?.errorText ?? "request failed",
        });
    });

    page.on("response", (response) => {
        const status = response.status();
        if (status < 400) return;
        failedResponses.push({
            url: response.url(),
            status,
        });
    });

    let responseStatus = null;
    let pageMetrics = null;
    let frameMetrics = [];
    let codeMetrics = [];
    try {
        const response = await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: options.timeoutMs,
        });
        responseStatus = response?.status() ?? null;
        await page.waitForSelector("main", { timeout: options.timeoutMs });
        if (options.settleMs > 0) {
            await new Promise((resolve) => setTimeout(resolve, options.settleMs));
        }
        pageMetrics = await inspectPage(page);
        frameMetrics = await collectFrameMetrics(page);
        const consoleMessageCountBeforeCodeCheck = consoleMessages.length;
        const requestFailureCountBeforeCodeCheck = requestFailures.length;
        const failedResponseCountBeforeCodeCheck = failedResponses.length;
        codeMetrics = await collectCodeExampleMetrics(page, variant.viewport === "desktop" && variant.theme === "light");
        consoleMessages.splice(consoleMessageCountBeforeCodeCheck);
        requestFailures.splice(requestFailureCountBeforeCodeCheck);
        failedResponses.splice(failedResponseCountBeforeCodeCheck);
    } catch (error) {
        pageErrors.push(error instanceof Error ? error.message : String(error));
        pageMetrics = {
            hasLayout: false,
            previewSurfaceCount: 0,
            documentHorizontalOverflow: false,
            previewMetrics: [],
            documentScrollWidth: 0,
            documentClientWidth: 0,
        };
        codeMetrics = [];
    }

    try {
        await page.close();
    } catch {
        // If Chromium already closed, keep the collected findings and let the
        // caller restart the browser for the next route.
    }

    const findings = buildFindings({
        route,
        variant,
        responseStatus,
        consoleMessages,
        pageErrors,
        requestFailures,
        failedResponses,
        pageMetrics,
        frameMetrics,
        codeMetrics,
    });

    return {
        route,
        variant,
        url,
        responseStatus,
        pageMetrics,
        frameMetrics,
        consoleMessages,
        pageErrors,
        requestFailures,
        failedResponses,
        findings,
        codeMetrics,
    };
}

function browserIsConnected(browser) {
    if (!browser) return false;
    if (typeof browser.isConnected === "function") return browser.isConnected();
    return browser.connected !== false;
}

async function launchBrowser() {
    return puppeteer.launch({ headless: true });
}

function buildFatalResult(route, variant, options, error) {
    const detail = error instanceof Error ? error.message : String(error);
    const finding = {
        severity: "error",
        type: "crawl-fatal",
        detail,
        category: route.category,
        slug: route.slug,
        title: route.title,
        viewport: variant.viewport,
        theme: variant.theme,
    };
    return {
        route,
        variant,
        url: `${options.baseUrl}${route.href}`,
        responseStatus: null,
        pageMetrics: null,
        frameMetrics: [],
        consoleMessages: [],
        pageErrors: [detail],
        requestFailures: [],
        failedResponses: [],
        findings: [finding],
        codeMetrics: [],
    };
}

function summarizeResults(results) {
    const pages = new Map();
    let errorFindings = 0;
    let warningFindings = 0;

    for (const result of results) {
        const key = result.route.href;
        const summary = pages.get(key) ?? {
            category: result.route.category,
            title: result.route.title,
            slug: result.route.slug,
            href: result.route.href,
            errors: 0,
            warnings: 0,
            variants: 0,
        };
        summary.variants += 1;
        for (const finding of result.findings) {
            if (finding.severity === "error") {
                summary.errors += 1;
                errorFindings += 1;
            } else {
                summary.warnings += 1;
                warningFindings += 1;
            }
        }
        pages.set(key, summary);
    }

    return {
        totalVariants: results.length,
        pages: Array.from(pages.values()),
        pagesWithErrors: Array.from(pages.values()).filter((page) => page.errors > 0).length,
        pagesWithWarnings: Array.from(pages.values()).filter((page) => page.warnings > 0).length,
        errorFindings,
        warningFindings,
    };
}

function buildMarkdown({ generatedAt, options, routes, results, summary }) {
    const findings = results.flatMap((result) => result.findings);
    const errorFindings = findings.filter((finding) => finding.severity === "error");
    const warningFindings = findings.filter((finding) => finding.severity === "warning");

    const lines = [
        "# Component Page Crawl Audit",
        "",
        `Generated: ${generatedAt}`,
        "",
        "This report is generated by `npm run docs:crawl:components`.",
        "",
        "## Scope",
        "",
        `- Base URL: ${options.baseUrl}`,
        `- Routes: ${routes.length}`,
        `- Viewports: ${Array.from(options.viewports).join(", ")}`,
        `- Themes: ${Array.from(options.themes).join(", ")}`,
        `- Variants checked: ${summary.totalVariants}`,
        "",
        "## Summary",
        "",
        `- Pages with errors: ${summary.pagesWithErrors}`,
        `- Pages with warnings: ${summary.pagesWithWarnings}`,
        `- Error findings: ${summary.errorFindings}`,
        `- Warning findings: ${summary.warningFindings}`,
        "",
        "## Page Matrix",
        "",
        "| Category | Page | Errors | Warnings | Variants |",
        "| --- | --- | ---: | ---: | ---: |",
        ...summary.pages.map((page) =>
            `| ${escapeCell(page.category)} | [${escapeCell(page.title)}](${page.href}) | ${page.errors} | ${page.warnings} | ${page.variants} |`
        ),
        "",
        "## Error Findings",
        "",
    ];

    if (errorFindings.length === 0) {
        lines.push("No error findings.", "");
    } else {
        lines.push("| Page | Viewport | Theme | Type | Detail |");
        lines.push("| --- | --- | --- | --- | --- |");
        for (const finding of errorFindings) {
            lines.push(
                `| [${escapeCell(finding.title)}](/docs/components/${finding.slug}) | ${finding.viewport} | ${finding.theme} | ${escapeCell(finding.type)} | ${escapeCell(shortText(finding.detail, 220))} |`
            );
        }
        lines.push("");
    }

    lines.push("## Warning Findings", "");
    if (warningFindings.length === 0) {
        lines.push("No warning findings.", "");
    } else {
        lines.push("| Page | Viewport | Theme | Type | Detail |");
        lines.push("| --- | --- | --- | --- | --- |");
        for (const finding of warningFindings) {
            lines.push(
                `| [${escapeCell(finding.title)}](/docs/components/${finding.slug}) | ${finding.viewport} | ${finding.theme} | ${escapeCell(finding.type)} | ${escapeCell(shortText(finding.detail, 220))} |`
            );
        }
        lines.push("");
    }

    lines.push(
        "## Notes",
        "",
        "- `iframe-mobile-vertical-overflow` is reported as a warning because some demos intentionally contain scrollable content. Review these manually before treating them as failures.",
        "- `code-*` warnings are static checks against copyable examples. They flag missing snippets, placeholders, console-only handlers, and referenced data identifiers that are not declared in the snippet.",
        "- Overview pages are included in the route count but are not required to contain a `ComponentPreview` surface.",
        "- The JSON report contains raw console messages, failed responses, and frame metrics for follow-up automation.",
        ""
    );

    return lines.join("\n");
}

function writeReport({ options, generatedAt, routes, results }) {
    const summary = summarizeResults(results);
    const output = {
        generatedAt,
        baseUrl: options.baseUrl,
        routes,
        summary,
        results,
    };

    mkdirSync(dirname(options.reportPath), { recursive: true });
    mkdirSync(dirname(options.jsonPath), { recursive: true });
    writeFileSync(options.jsonPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
    writeFileSync(
        options.reportPath,
        buildMarkdown({ generatedAt, options, routes, results, summary }),
        "utf8"
    );

    console.log(`docs:crawl:components: wrote ${normalizeRelativePath(relative(ROOT, options.reportPath))}`);
    console.log(`docs:crawl:components: wrote ${normalizeRelativePath(relative(ROOT, options.jsonPath))}`);
    console.log(
        `docs:crawl:components: ${summary.pagesWithErrors} pages with errors, ${summary.pagesWithWarnings} pages with warnings`
    );
}

function mergeReports(options) {
    const routeMap = new Map();
    const results = [];
    const viewports = new Set();
    const themes = new Set();
    let baseUrl = options.baseUrl;

    for (const jsonPath of options.mergeJsonPaths) {
        const report = JSON.parse(readFileSync(jsonPath, "utf8"));
        baseUrl = report.baseUrl ?? baseUrl;
        for (const route of report.routes ?? []) {
            if (!routeMap.has(route.href)) routeMap.set(route.href, route);
        }
        for (const result of report.results ?? []) {
            results.push(result);
            if (result.variant?.viewport) viewports.add(result.variant.viewport);
            if (result.variant?.theme) themes.add(result.variant.theme);
        }
    }

    options.baseUrl = baseUrl;
    if (viewports.size > 0) options.viewports = viewports;
    if (themes.size > 0) options.themes = themes;

    const routes = Array.from(routeMap.values()).sort((a, b) => {
        const categoryDelta =
            COMPONENT_CATEGORIES.indexOf(a.category) - COMPONENT_CATEGORIES.indexOf(b.category);
        if (categoryDelta !== 0) return categoryDelta;
        return a.href.localeCompare(b.href);
    });

    writeReport({
        options,
        generatedAt: new Date().toISOString(),
        routes,
        results,
    });
}

async function main() {
    const options = parseArgs(process.argv.slice(2));
    if (options.mergeJsonPaths.length > 0) {
        mergeReports(options);
        return;
    }

    const routes = parseRoutesFromNavigation()
        .filter((route) => options.categories.has(route.category))
        .filter((route) => options.includeOverview || !route.isOverview)
        .filter((route) => matchesOnlyFilter(route, options.only));
    const targetRoutes = options.limit == null ? routes : routes.slice(0, options.limit);

    if (targetRoutes.length === 0) {
        console.log("docs:crawl:components: no routes matched");
        return;
    }

    const variants = [];
    for (const viewport of options.viewports) {
        for (const theme of options.themes) {
            variants.push({ viewport, theme });
        }
    }

    let browser = await launchBrowser();
    const results = [];

    try {
        for (const route of targetRoutes) {
            for (const variant of variants) {
                const label = `${route.href} (${variant.viewport}/${variant.theme})`;
                console.log(`docs:crawl:components: ${label}`);
                try {
                    if (!browserIsConnected(browser)) {
                        browser = await launchBrowser();
                    }
                    results.push(await crawlRouteVariant(browser, route, variant, options));
                } catch (error) {
                    results.push(buildFatalResult(route, variant, options, error));
                    try {
                        await browser.close();
                    } catch {
                        // The browser may already be gone.
                    }
                    browser = await launchBrowser();
                }
            }
        }
    } finally {
        try {
            await browser.close();
        } catch {
            // The browser may already be gone.
        }
    }

    writeReport({
        options,
        generatedAt: new Date().toISOString(),
        routes: targetRoutes,
        results,
    });
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
