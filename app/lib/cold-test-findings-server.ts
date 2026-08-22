import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { RoundFindings } from "./cold-test-findings";

// Reads the per-round findings payloads. Types and the pure helpers the client
// components need live in cold-test-findings.ts.

const FINDINGS_DIR = path.join(process.cwd(), "app", "data", "cold-test-findings");

/** Null when the round has no findings file, or the file has an empty list. */
export function readRoundFindings(round: number): RoundFindings | null {
    const file = path.join(FINDINGS_DIR, `${round}.json`);
    if (!fs.existsSync(file)) return null;
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as RoundFindings;
    return parsed.findings.length > 0 ? parsed : null;
}

/** Every round that has findings, ascending. */
export function listFindingRounds(): number[] {
    if (!fs.existsSync(FINDINGS_DIR)) return [];
    const rounds: number[] = [];
    for (const name of fs.readdirSync(FINDINGS_DIR)) {
        const match = /^(\d+)\.json$/.exec(name);
        if (!match) continue;
        rounds.push(Number(match[1]));
    }
    return rounds.sort((a, b) => a - b);
}

/** The findings for a set of rounds (an industry's, typically), in round order. */
export function readFindingsForRounds(rounds: number[]): RoundFindings[] {
    return [...rounds]
        .sort((a, b) => a - b)
        .map((round) => readRoundFindings(round))
        .filter((payload): payload is RoundFindings => payload !== null);
}
