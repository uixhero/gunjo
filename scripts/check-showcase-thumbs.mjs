#!/usr/bin/env node
/**
 * Pre-commit warning (non-blocking) — flags when a contributor stages
 * a change that likely affects a showcase preview without also
 * regenerating the matching thumbnail in public/showcase-thumbs/.
 *
 * Trigger: any of the following are staged
 *   - app/components/demos/**
 *   - app/embed/<category>/<slug>/page.tsx
 *   - src/components/atoms|molecules|organisms/**
 *   - app/patterns/<slug>/** (Patterns thumbnails — see #76)
 *
 * Skip when:
 *   - Nothing component-related is staged.
 *   - At least one public/showcase-thumbs/**.png is also staged
 *     (treated as evidence the dev re-ran `npm run showcase:thumbs`).
 *   - For pattern changes: at least one public/patterns-thumbs/**.png
 *     is also staged.
 *
 * Exits 0 always. This is a reminder, not a gate — both
 * `npm run showcase:thumbs` and `npm run patterns:thumbs` are local-only
 * by design (#58).
 */

import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function staged() {
    try {
        const out = execSync("git diff --cached --name-only --diff-filter=ACMR", {
            cwd: ROOT,
            encoding: "utf8",
        });
        return out.split("\n").filter(Boolean);
    } catch {
        return [];
    }
}

const SHOWCASE_EMBED_CATEGORIES = ["atoms", "molecules", "organisms", "patterns"];

function looksLikeComponentChange(path) {
    if (path.startsWith("app/components/demos/")) return true;
    if (
        path.startsWith("app/embed/") &&
        path.endsWith("/page.tsx") &&
        SHOWCASE_EMBED_CATEGORIES.some((cat) =>
            path.startsWith(`app/embed/${cat}/`)
        )
    )
        return true;
    if (
        path.startsWith("src/components/atoms/") ||
        path.startsWith("src/components/molecules/") ||
        path.startsWith("src/components/organisms/")
    ) {
        // Skip generated files — they don't affect the rendered demo.
        if (path.includes("/generated/")) return false;
        return path.endsWith(".tsx") || path.endsWith(".ts");
    }
    return false;
}

function looksLikePatternChange(path) {
    // The patterns index itself isn't a pattern preview — only nested
    // /patterns/<slug>/** routes contribute to a thumbnail.
    if (!path.startsWith("app/patterns/")) return false;
    if (path === "app/patterns/page.tsx") return false;
    if (path === "app/patterns/layout.tsx") return false;
    return path.endsWith(".tsx") || path.endsWith(".ts");
}

function looksLikeShowcaseThumbChange(path) {
    return path.startsWith("public/showcase-thumbs/") && path.endsWith(".png");
}

function looksLikePatternsThumbChange(path) {
    return path.startsWith("public/patterns-thumbs/") && path.endsWith(".png");
}

function reminder({ kind, changes, refreshCommand, gridLabel }) {
    const sample = changes.slice(0, 3).join(", ");
    const more =
        changes.length > 3 ? ` (+${changes.length - 3} more)` : "";
    console.log("");
    console.log(
        `${kind} reminder ─ ${kind === "showcase:thumbs" ? "component" : "pattern"} change without thumbnail update`
    );
    console.log(`  staged: ${sample}${more}`);
    console.log(
        `  did you re-run \`npm run dev\` + \`${refreshCommand}\` so the`
    );
    console.log(
        `  ${gridLabel} keeps matching the live ${kind === "showcase:thumbs" ? "demos" : "patterns"}? Skip this if the`
    );
    console.log(
        "  change is invisible (refactors, comments, types) — see SSOT_RUNBOOK §4.5.1."
    );
    console.log("");
}

function main() {
    const files = staged();

    const componentChanges = files.filter(looksLikeComponentChange);
    const showcaseThumbChanges = files.filter(looksLikeShowcaseThumbChange);
    if (componentChanges.length > 0 && showcaseThumbChanges.length === 0) {
        reminder({
            kind: "showcase:thumbs",
            changes: componentChanges,
            refreshCommand: "npm run showcase:thumbs",
            gridLabel: "/showcase grid",
        });
    }

    const patternChanges = files.filter(looksLikePatternChange);
    const patternsThumbChanges = files.filter(looksLikePatternsThumbChange);
    if (patternChanges.length > 0 && patternsThumbChanges.length === 0) {
        reminder({
            kind: "patterns:thumbs",
            changes: patternChanges,
            refreshCommand: "npm run patterns:thumbs",
            gridLabel: "/patterns grid",
        });
    }
}

main();
