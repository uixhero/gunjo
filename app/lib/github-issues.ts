import issuesData from "@/data/github-issues.json";

import { issueNumberFromHref } from "./cold-test-hash-refs";
import type { IssueRefCardData } from "@/components/cold-test/HashRefCard";

// Server-only. `app/data/github-issues.json` is refreshed by
// `scripts/fetch-github-issues.mjs` on every build (`prebuild`), so an article
// that says "直した" is checked against what the tracker says today rather than
// against what was true when the round was written. If the refresh cannot run
// — no token, no network, a rate limit — the committed snapshot is served
// instead and nothing on the page breaks.
//
// The whole map is deliberately not handed to the client: pages pass only the
// issues their own article cites, which is a handful rather than 259.

interface IssuesFile {
    repo: string;
    fetchedAt: string;
    issues: Record<string, { title: string; state: string; excerpt: string }>;
}

const data = issuesData as IssuesFile;

/** ISO date the snapshot was taken. */
export const issuesFetchedAt = data.fetchedAt;

export function issueUrl(issue: number): string {
    return `https://github.com/${data.repo}/issues/${issue}`;
}

/**
 * Preview data for every GitHub issue `markdown` links to. Issue numbers with
 * no entry — a pull request cited through an `/issues/N` URL, or an issue that
 * the last refresh could not see — are simply absent, and the renderer leaves
 * those links as ordinary links.
 */
export function readCitedIssues(markdown: string): Record<number, IssueRefCardData> {
    const cards: Record<number, IssueRefCardData> = {};
    const link = /\[[^\]\n]*\]\((\S+?)(?:\s+"[^"]*")?\)/g;
    let match: RegExpExecArray | null;
    while ((match = link.exec(markdown)) !== null) {
        const issue = issueNumberFromHref(match[1]);
        if (issue === null || cards[issue]) continue;
        const found = data.issues[String(issue)];
        if (!found) continue;
        cards[issue] = {
            number: issue,
            title: found.title,
            state: found.state === "closed" ? "closed" : "open",
            excerpt: found.excerpt,
            url: issueUrl(issue),
        };
    }
    return cards;
}
