#!/usr/bin/env node
// Validates the English cold-test translations in
// app/data/cold-test-rounds/en/*.json.
//
// Run it after every Codex translation batch:
//
//     npm run coldtest-en:check
//
// It checks four things:
//   1. Shape      — required fields, known status values, a Japanese original.
//   2. Staleness  — sourceHash still matches the Japanese round it was made
//                   from. The Japanese files are regenerated wholesale by
//                   build-coldtest-rounds.mjs, so a prose edit upstream
//                   silently invalidates a translation without this check.
//   3. Guardrails — the characters banned for published prose
//                   (promotion/handoff/WRITING-GUARDRAILS.md §3).
//   4. Leftovers  — Japanese characters left in the English text.
//
// Exits non-zero when anything fails, so it can gate a batch before review.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const JA_DIR = path.join(ROOT, "app", "data", "cold-test-rounds");
const EN_DIR = path.join(JA_DIR, "en");

const BANNED = [
    ["em-dash", "—"],
    ["right arrow", "→"],
    ["left arrow", "←"],
    ["up arrow", "↑"],
    ["down arrow", "↓"],
    ["guillemet", "»"],
    ["ellipsis", "…"],
];
// Hiragana, katakana and the CJK ideograph block. Code fences are stripped
// before this runs, so component names and paths are not flagged.
const JA_CHARS = /[぀-ヿ一-龯]/;
const STATUSES = new Set(["draft", "reviewed"]);
const REQUIRED = [
    "round",
    "status",
    "title",
    "summary",
    "article",
    "sourceHash",
    "translatedAt",
    "translator",
    "glossary",
];

function sourceHash(ja) {
    const material = [ja.title, ja.summary, ja.article?.markdown ?? ""].join("\n \n");
    return `sha256:${crypto.createHash("sha256").update(material, "utf8").digest("hex")}`;
}

function stripCode(markdown) {
    return markdown.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
}

if (!fs.existsSync(EN_DIR)) {
    console.log("No English translations yet (app/data/cold-test-rounds/en/ is absent).");
    process.exit(0);
}

const files = fs
    .readdirSync(EN_DIR)
    .filter((name) => /^\d+\.json$/.test(name))
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

const errors = [];
const warnings = [];
const batchSeries = {};
let reviewed = 0;
let draft = 0;

for (const name of files) {
    const where = `en/${name}`;
    const expectedRound = parseInt(name, 10);
    let en;
    try {
        en = JSON.parse(fs.readFileSync(path.join(EN_DIR, name), "utf8"));
    } catch (error) {
        errors.push(`${where}: not valid JSON (${error.message})`);
        continue;
    }

    for (const key of REQUIRED) {
        if (en[key] === undefined) errors.push(`${where}: missing "${key}"`);
    }
    if (en.round !== expectedRound) {
        errors.push(`${where}: round is ${en.round} but the filename says ${expectedRound}`);
    }
    if (!STATUSES.has(en.status)) {
        errors.push(`${where}: status "${en.status}" is not draft or reviewed`);
    }
    if (typeof en.article?.markdown !== "string" || en.article.markdown.trim() === "") {
        errors.push(`${where}: article.markdown is empty`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(en.translatedAt ?? "")) {
        errors.push(`${where}: translatedAt must be YYYY-MM-DD`);
    }

    const jaFile = path.join(JA_DIR, `${expectedRound}.json`);
    if (!fs.existsSync(jaFile)) {
        errors.push(`${where}: no Japanese round ${expectedRound}.json to translate from`);
        continue;
    }
    const ja = JSON.parse(fs.readFileSync(jaFile, "utf8"));
    const current = sourceHash(ja);
    if (en.sourceHash !== current) {
        errors.push(
            `${where}: stale. The Japanese round changed since it was translated ` +
                `(expected ${current.slice(0, 22)}..., file has ${String(en.sourceHash).slice(0, 22)}...). ` +
                `Retranslate, then update sourceHash.`
        );
    }

    const prose = [en.title ?? "", en.summary ?? "", en.article?.markdown ?? ""].join("\n");
    for (const [label, char] of BANNED) {
        if (prose.includes(char)) {
            errors.push(`${where}: contains a banned ${label} (${char})`);
        }
    }
    const proseNoCode = stripCode(prose);
    if (JA_CHARS.test(proseNoCode)) {
        const sample = proseNoCode.match(new RegExp(`.{0,25}${JA_CHARS.source}.{0,25}`))?.[0] ?? "";
        warnings.push(`${where}: Japanese text left outside code spans: ...${sample.trim()}...`);
    }

    if (en.status === "reviewed") reviewed += 1;
    else draft += 1;

    // §33（COLDTEST-GLOSSARY-EN.md・2026-08-19）：バッチ生成の型崩れ。
    // 41本を1発注で生成したとき最後の1本だけ summary / series 行 / 見出しが別物になった（#170）ので、
    // 「全本に必ずある定型」だけを機械で見る。節の構成（core observation の数・What it flagged の有無）は
    // 回ごとに正当に違うので、ここでは見ない（独立レビューの領域）。
    const md = en.article?.markdown ?? "";
    const headings = md.split("\n").filter((l) => l.startsWith("## "));
    if (!headings.some((h) => h.startsWith("## Result"))) {
        errors.push(`${where}: missing "## Result" heading (§33 template drift)`);
    }
    if (!md.includes("**Build log series**") && !md.includes("**Cold Test series**")) {
        errors.push(`${where}: missing the series blockquote line (§33 template drift)`);
    }
    const batch = en.translator ?? "(none)";
    const seriesLabel = md.includes("**Build log series**") ? "Build log series" : "Cold Test series";
    (batchSeries[batch] ??= new Map()).set(name, seriesLabel);
    // §36（2026-08-20）：本文の画像行は落とさない（altだけ英訳）。原文と行数を照合する。
    const imgCount = (t) => ((t ?? "").match(/!\[/g) ?? []).length;
    if (imgCount(md) !== imgCount(ja.article?.markdown)) {
        errors.push(`${where}: image lines differ from the Japanese original (ja=${imgCount(ja.article?.markdown)}, en=${imgCount(md)}) (§36)`);
    }
    if (typeof en.summary === "string" && en.summary.length < 40) {
        warnings.push(`${where}: summary is very short (${en.summary.length} chars) — check it is not a leftover (§33)`);
    }
}

// 同じ translator（＝同じバッチ）内で series 行の呼び名が割れていたら error（#170 が Cold Test series になった件）
for (const [batch, m] of Object.entries(batchSeries)) {
    const labels = new Set(m.values());
    if (labels.size > 1) {
        const tally = {};
        for (const v of m.values()) tally[v] = (tally[v] ?? 0) + 1;
        const majority = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
        for (const [file, v] of m) if (v !== majority) errors.push(`en/${file}: series line says "${v}" but the rest of batch "${batch}" says "${majority}" (§33)`);
    }
}

const jaCount = fs
    .readdirSync(JA_DIR)
    .filter((name) => /^\d+\.json$/.test(name)).length;

console.log(
    `${files.length} of ${jaCount} rounds translated (${reviewed} reviewed, ${draft} draft).`
);
for (const warning of warnings) console.warn(`warn  ${warning}`);
for (const error of errors) console.error(`error ${error}`);
if (errors.length > 0) {
    console.error(`\n${errors.length} problem(s) found.`);
    process.exit(1);
}
console.log("All translations look well formed.");
