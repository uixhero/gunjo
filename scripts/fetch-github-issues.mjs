// Refreshes `app/data/github-issues.json` — the titles, open/closed state and
// body excerpts behind the `issue#N` previews in cold-test articles.
//
// Runs as `prebuild`, so a deploy always re-reads the tracker rather than
// trusting what an article said months ago ("直した" in the prose, still OPEN
// on GitHub is exactly the mismatch this is here to expose).
//
// It must never be able to fail a build: no token, no network, a rate limit or
// a malformed response all leave the committed JSON in place and exit 0. The
// committed file is therefore the floor, and a successful fetch is the bonus.
//
// Only issues an article actually cites are stored (the repo has far more), so
// the payload stays proportional to what the pages can show.
//
//   node scripts/fetch-github-issues.mjs [--quiet]

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const ROUND_DIR = join(ROOT, "app", "data", "cold-test-rounds");
const OUTPUT = join(ROOT, "app", "data", "github-issues.json");
const EXCERPT_LIMIT = 220;

const quiet = process.argv.includes("--quiet");
const log = (message) => {
    if (!quiet) console.log(`[github-issues] ${message}`);
};
/** Reasons to stop are notices, never failures — the build carries on. */
const bail = (message) => {
    log(`${message} — keeping the committed data`);
    process.exit(0);
};

function articleFiles(dir) {
    const files = [];
    if (!existsSync(dir)) return files;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) files.push(...articleFiles(path));
        else if (entry.name.endsWith(".json")) files.push(path);
    }
    return files;
}

// Which issues the corpus cites, and which repo they live in. Both are read
// out of the articles so this script needs no configuration of its own.
const ISSUE_URL = /https?:\/\/github\.com\/([^/\s)]+)\/([^/\s)]+)\/issues\/(\d+)/g;
const referenced = new Set();
const repoCounts = new Map();
for (const file of articleFiles(ROUND_DIR)) {
    let markdown;
    try {
        markdown = JSON.parse(readFileSync(file, "utf8"))?.article?.markdown;
    } catch {
        continue;
    }
    if (typeof markdown !== "string") continue;
    ISSUE_URL.lastIndex = 0;
    let match;
    while ((match = ISSUE_URL.exec(markdown)) !== null) {
        const repo = `${match[1]}/${match[2]}`;
        repoCounts.set(repo, (repoCounts.get(repo) ?? 0) + 1);
        referenced.add(Number(match[3]));
    }
}

if (referenced.size === 0) bail("no issue citations found in the cold-test articles");

const repo = [...repoCounts].sort((a, b) => b[1] - a[1])[0][0];

function resolveToken() {
    const fromEnv = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (fromEnv) return fromEnv;
    try {
        // `gh` keeps the token in the OS keychain locally. Captured, used as a
        // header, never printed or written anywhere.
        return execFileSync("gh", ["auth", "token"], {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
        }).trim();
    } catch {
        return "";
    }
}

const token = resolveToken();
const headers = {
    accept: "application/vnd.github+json",
    "user-agent": "gunjo-docs-build",
    ...(token ? { authorization: `Bearer ${token}` } : {}),
};

/** First readable lines of an issue body, with the markdown noise taken out. */
function excerpt(body) {
    if (typeof body !== "string") return "";
    const text = body
        .replace(/\r\n/g, "\n")
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/<!--[\s\S]*?-->/g, " ")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/^\s{0,3}#{1,6}\s+/gm, "")
        .replace(/[*_`>]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    if (text.length <= EXCERPT_LIMIT) return text;
    return `${text.slice(0, EXCERPT_LIMIT).trimEnd()}…`;
}

const fetched = new Map();
try {
    for (let page = 1; page <= 20; page += 1) {
        const url =
            `https://api.github.com/repos/${repo}/issues` +
            `?state=all&per_page=100&page=${page}&sort=created&direction=desc`;
        const response = await fetch(url, { headers });
        if (!response.ok) {
            bail(`GitHub API returned ${response.status} for ${repo} (page ${page})`);
        }
        const batch = await response.json();
        if (!Array.isArray(batch) || batch.length === 0) break;
        for (const item of batch) {
            // The issues endpoint also returns pull requests; the articles cite
            // those with their own `PR#N` wording and never through this map.
            if (item.pull_request) continue;
            if (!referenced.has(item.number)) continue;
            fetched.set(item.number, {
                title: String(item.title ?? "").trim(),
                state: item.state === "closed" ? "closed" : "open",
                excerpt: excerpt(item.body),
            });
        }
        if (batch.length < 100) break;
    }
} catch (error) {
    bail(`could not reach the GitHub API (${error instanceof Error ? error.name : "error"})`);
}

if (fetched.size === 0) bail(`GitHub returned no matching issues for ${repo}`);

const issues = Object.fromEntries(
    [...fetched].sort((a, b) => a[0] - b[0]).map(([number, data]) => [String(number), data])
);

// Only rewrite when the tracker actually moved, so a build that changes
// nothing leaves no diff behind.
let previous = null;
try {
    previous = JSON.parse(readFileSync(OUTPUT, "utf8"));
} catch {
    previous = null;
}
if (previous && JSON.stringify(previous.issues) === JSON.stringify(issues)) {
    log(`${fetched.size} issues unchanged (${repo})`);
    process.exit(0);
}

const open = Object.values(issues).filter((i) => i.state === "open").length;
writeFileSync(
    OUTPUT,
    `${JSON.stringify(
        {
            // Regenerated by scripts/fetch-github-issues.mjs — do not hand-edit.
            repo,
            fetchedAt: new Date().toISOString().slice(0, 10),
            issues,
        },
        null,
        2
    )}\n`,
    "utf8"
);
log(
    `wrote ${fetched.size} issues from ${repo}` +
        ` (${open} open, ${fetched.size - open} closed)` +
        `${token ? "" : " — unauthenticated"}`
);
