// Pure types + helpers for the cold-test findings data layer. Safe to import
// from client components — no node:fs use here. The reader that pulls the JSON
// off disk lives in cold-test-findings-server.ts.
//
//   app/data/cold-test-rounds/<n>.json      <- the round itself (generated)
//   app/data/cold-test-findings/<n>.json    <- what the round found (hand-written)
//
// They are separate files on purpose: `scripts/build-coldtest-rounds.mjs`
// rewrites every round file wholesale from promotion/ + the gunjo-test app, so
// anything hand-written inside them would be destroyed on the next
// regeneration. The generator never writes into cold-test-findings/.
//
// One data layer, two renderings: the round page shows its own findings, the
// industry door page aggregates every round in the category. See
// app/data/cold-test-findings/README.md for the schema and how to write one.

const GITHUB_REPO_URL = "https://github.com/uixhero/gunjo";

/** この業界で要るもの / 先に踏んだ穴。 */
export type FindingKind = "requirement" | "pitfall";

/**
 * Current state, measured when the finding was written — not the state at the
 * time of the round. `resolved` requires that the behaviour actually changed in
 * src, not just that an issue is closed.
 */
export type FindingStatus = "resolved" | "fix-known" | "tracking";

export type FindingLink =
    | { kind: "issue"; id: number }
    | { kind: "pr"; id: number }
    | { kind: "component"; slug: string; label: string }
    | { kind: "docs"; href: string; label: string };

export interface FindingWhere {
    /** The round whose article records this finding. Always present. */
    round: number;
    /** Other rounds the same article names as having hit it too. */
    alsoRounds?: number[];
    screen: string;
    spot: string;
}

export interface Finding {
    /** Unique across every findings file — used as a React key and for grouping. */
    id: string;
    kind: FindingKind;
    /** Set on the same hole seen in more than one round; the door page merges them. */
    group?: string;
    phenomenon: string;
    where: FindingWhere;
    /** `pitfall` only — a requirement is a fact about the industry, not a defect. */
    cause?: string;
    status: FindingStatus;
    links: FindingLink[];
    selfCheck?: string;
}

export interface RoundFindings {
    schemaVersion: number;
    round: number;
    lang: "ja";
    findings: Finding[];
}

/**
 * One finding as the door page shows it: the same hole seen in three rounds is
 * one row with three pieces of evidence, not three near-identical rows.
 */
export interface AggregatedFinding {
    key: string;
    kind: FindingKind;
    /** The earliest round's wording — where the hole was first felt. */
    representative: Finding;
    /** Every round that is evidence for it, ascending. */
    rounds: number[];
    /** The least-resolved status across the group, so nothing overclaims. */
    status: FindingStatus;
    /** Every link across the group, de-duplicated, in first-seen order. */
    links: FindingLink[];
}

const STATUS_RANK: Record<FindingStatus, number> = {
    tracking: 0,
    "fix-known": 1,
    resolved: 2,
};

export function findingLinkKey(link: FindingLink): string {
    switch (link.kind) {
        case "issue":
        case "pr":
            return `${link.kind}:${link.id}`;
        case "component":
            return `component:${link.slug}`;
        case "docs":
            return `docs:${link.href}`;
    }
}

export function findingLinkHref(link: FindingLink): string {
    switch (link.kind) {
        case "issue":
            return `${GITHUB_REPO_URL}/issues/${link.id}`;
        case "pr":
            return `${GITHUB_REPO_URL}/pull/${link.id}`;
        case "component":
            return `/docs/components/${link.slug}`;
        case "docs":
            return link.href;
    }
}

export function findingLinkLabel(link: FindingLink): string {
    switch (link.kind) {
        case "issue":
        case "pr":
            return `#${link.id}`;
        case "component":
        case "docs":
            return link.label;
    }
}

/** True for links that leave gunjo.jp. */
export function isExternalFindingLink(link: FindingLink): boolean {
    return link.kind === "issue" || link.kind === "pr";
}

/**
 * Collapse several rounds' findings into what the door page renders. Grouped
 * findings keep the earliest round's wording and take the least-resolved status
 * in the group; ungrouped ones pass through as a group of one. `payloads` must
 * arrive in round order.
 */
export function aggregateFindings(payloads: RoundFindings[]): AggregatedFinding[] {
    const byKey = new Map<string, AggregatedFinding>();

    for (const payload of [...payloads].sort((a, b) => a.round - b.round)) {
        for (const finding of payload.findings) {
            const key = finding.group ?? finding.id;
            const evidence = [finding.where.round, ...(finding.where.alsoRounds ?? [])];
            const existing = byKey.get(key);
            if (!existing) {
                byKey.set(key, {
                    key,
                    kind: finding.kind,
                    representative: finding,
                    rounds: evidence,
                    status: finding.status,
                    links: [...finding.links],
                });
                continue;
            }
            existing.rounds.push(...evidence);
            if (STATUS_RANK[finding.status] < STATUS_RANK[existing.status]) {
                existing.status = finding.status;
            }
            const seen = new Set(existing.links.map(findingLinkKey));
            for (const link of finding.links) {
                if (seen.has(findingLinkKey(link))) continue;
                seen.add(findingLinkKey(link));
                existing.links.push(link);
            }
        }
    }

    return [...byKey.values()].map((entry) => ({
        ...entry,
        rounds: [...new Set(entry.rounds)].sort((a, b) => a - b),
    }));
}
