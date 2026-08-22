#!/usr/bin/env node
// Compares each English cold-test round against its Japanese original and
// reports the rounds where a human should look.
//
//     npm run coldtest-en:parity
//     npm run coldtest-en:parity -- --json out.json
//     npm run coldtest-en:parity -- --round 160 --verbose
//
// This is the machine half of the English review. It answers exactly one
// question: "does the English round still line up with the Japanese one?"
// Images, the scoreboard, and the series rows are structural, so they can be
// diffed. Two more checks (title claims, proper nouns) do not decide anything;
// they only nominate rounds for the human to read.
//
// It deliberately does NOT decide whether a title matches its article. Only a
// reader can judge that, which is why the ledger asks for a human verdict on
// every round regardless of what this prints. See
// scripts/build-coldtest-en-review-ledger.mjs.
//
// Sibling of scripts/check-coldtest-en.mjs, which validates the translation
// files' own shape (required fields, staleness, banned characters).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const JA_DIR = path.join(ROOT, "app", "data", "cold-test-rounds");
const EN_DIR = path.join(JA_DIR, "en");

// ---------------------------------------------------------------------------
// markdown helpers
// ---------------------------------------------------------------------------

/** Body of the first `## ` section whose heading contains `marker`. */
function sectionAfter(markdown, marker) {
    const lines = markdown.split("\n");
    const out = [];
    let inside = false;
    for (const line of lines) {
        if (line.startsWith("## ")) {
            if (inside) break;
            inside = line.includes(marker);
            continue;
        }
        if (inside) out.push(line);
    }
    return out.join("\n").trim();
}

function headings(markdown) {
    return markdown.split("\n").filter((l) => l.startsWith("## "));
}

/** `![alt](src)` sources, in order. Alt text is translated; the source is not. */
function imageSources(markdown) {
    return [...markdown.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)].map((m) => m[1]);
}

/** Every link target except the placeholder `#`, as a sorted multiset. */
function linkTargets(markdown) {
    return [...markdown.matchAll(/(?<!!)\[[^\]]*\]\(([^)\s]+)\)/g)]
        .map((m) => m[1])
        .filter((href) => href !== "#")
        .sort();
}

/** `[#N](#)` round references, sorted. These are the series rows. */
function roundRefs(text) {
    return [...text.matchAll(/\[#(\d+)\]\(#\)/g)].map((m) => Number(m[1])).sort((a, b) => a - b);
}

const SPELLED = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
    seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
};

// ---------------------------------------------------------------------------
// individual checks
// ---------------------------------------------------------------------------

function sameMultiset(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
}

/** In-body images. The gallery screenshots are not checked here: `mergeEnRound`
 *  only swaps title/summary/markdown, so every other field is shared by
 *  construction and cannot drift. */
function checkImages(ja, en) {
    const j = imageSources(ja);
    const e = imageSources(en);
    if (sameMultiset(j, e)) return null;
    return {
        code: "IMAGE",
        label: "画像",
        message: `本文の画像が JA と違う（JA ${j.length}枚 / EN ${e.length}枚）: JAのみ=[${j.filter((x) => !e.includes(x)).join(", ")}] ENのみ=[${e.filter((x) => !j.includes(x)).join(", ")}]`,
    };
}

function builtCount(ja, en) {
    const j = /作成済\s*\*{0,2}\s*(\d+)\s*個/.exec(ja);
    const e = /\*{0,2}(\d+)\*{0,2}\s+built/.exec(en);
    if (!j && !e) return null;
    if (!j || !e) {
        return {
            code: "SCORE_BOARD_COUNT",
            label: "スコアボード",
            message: `作成済の個数が片方にしかない（JA=${j ? j[1] : "なし"} / EN=${e ? e[1] : "なし"}）`,
        };
    }
    if (j[1] !== e[1]) {
        return {
            code: "SCORE_BOARD_COUNT",
            label: "スコアボード",
            message: `作成済の個数が違う（JA ${j[1]}個 / EN ${e[1]}）`,
        };
    }
    return null;
}

/** Every Latin token in the Japanese scoreboard is a component name, because
 *  the surrounding prose is Japanese. So the check runs one way: each of those
 *  names must survive into the English scoreboard. English-only connective
 *  words ("In progress", "plus earlier components") are ignored by design. */
function scoreboardNames(ja, en) {
    const j = sectionAfter(ja, "スコアボード");
    const e = sectionAfter(en, "📊") || sectionAfter(en, "coreboard");
    if (!j) return null;
    const names = [...new Set((j.match(/[A-Za-z][A-Za-z0-9]{2,}/g) ?? []))];
    const missing = names.filter((n) => !e.toLowerCase().includes(n.toLowerCase()));
    if (missing.length === 0) return null;
    return {
        code: "SCORE_BOARD_NAMES",
        label: "スコアボード",
        message: `JA のスコアボードにある名前が EN に無い: ${missing.join(", ")}`,
    };
}

/** `(2/3)` in Japanese vs "at two of three" in English. */
function scoreboardProgress(ja, en) {
    const j = sectionAfter(ja, "スコアボード");
    const e = sectionAfter(en, "📊") || sectionAfter(en, "coreboard");
    if (!j || !e) return null;
    const jf = [...j.matchAll(/(\d)\s*\/\s*3/g)].map((m) => Number(m[1])).sort();
    const ef = [...e.matchAll(/(one|two|three|\d)(?:\s+\w+){0,2}\s+of\s+three/gi)]
        .map((m) => SPELLED[m[1].toLowerCase()] ?? Number(m[1]))
        .sort();
    if (sameMultiset(jf, ef)) return null;
    return {
        code: "SCORE_BOARD_PROGRESS",
        label: "スコアボード",
        message: `進行中の「N/3」が違う（JA [${jf.join(",")}] / EN [${ef.join(",")}]）`,
    };
}

/** The 📋 progress section: one bullet per mode, with ✅ marking finished ones. */
function checkProgressRows(ja, en) {
    const j = sectionAfter(ja, "📋");
    const e = sectionAfter(en, "📋");
    if (!j && !e) return null;
    if (!j || !e) {
        return {
            code: "PROGRESS_SECTION",
            label: "シリーズの行",
            message: `📋 の進捗節が片方にしかない（JA=${j ? "あり" : "なし"} / EN=${e ? "あり" : "なし"}）`,
        };
    }
    const bullets = (t) => t.split("\n").filter((l) => /^\s*[-*]\s/.test(l)).length;
    const ticks = (t) => (t.match(/✅/g) ?? []).length;
    const modes = (t) => (t.match(/[✈\u{1F680}-\u{1F6FF}]\u{FE0F}?/gu) ?? []).join("");
    const problems = [];
    if (bullets(j) !== bullets(e)) problems.push(`行数 JA ${bullets(j)} / EN ${bullets(e)}`);
    if (ticks(j) !== ticks(e)) problems.push(`✅ の数 JA ${ticks(j)} / EN ${ticks(e)}`);
    if (modes(j) !== modes(e)) problems.push(`モードの絵文字 JA ${modes(j) || "なし"} / EN ${modes(e) || "なし"}`);
    if (problems.length === 0) return null;
    return { code: "PROGRESS_ROWS", label: "シリーズの行", message: `📋 の進捗節がずれている（${problems.join(" / ")}）` };
}

/** "前回まで [#1](#)〜[#159](#)" vs "previous rounds [#1](#) through [#159](#)". */
function checkRunRow(ja, en) {
    const j = roundRefs(sectionAfter(ja, "試す"));
    const e = roundRefs(sectionAfter(en, "The run"));
    if (sameMultiset(j, e)) return null;
    return {
        code: "RUN_ROW",
        label: "シリーズの行",
        message: `締めの「前回まで」の回番号が違う（JA [${j.join(",")}] / EN [${e.join(",")}]）`,
    };
}

function checkNextUp(ja, en) {
    const j = /##.*次回予告.*?#(\d+)/.exec(ja);
    const e = /##\s*Next up.*?#(\d+)/.exec(en);
    if (!j && !e) return null;
    if (!j || !e) return null; // both styles allow a number-less heading
    if (j[1] === e[1]) return null;
    return {
        code: "NEXT_UP",
        label: "シリーズの行",
        message: `次回予告の回番号が違う（JA #${j[1]} / EN #${e[1]}）`,
    };
}

function checkHeadingCount(ja, en) {
    const j = headings(ja).length;
    const e = headings(en).length;
    if (j === e) return null;
    return {
        code: "HEADING_COUNT",
        label: "節の数",
        message: `## 見出しの数が違う（JA ${j} / EN ${e}）＝節が落ちたか増えた疑い`,
    };
}

/** Link targets, compared as sets. The same URL legitimately appears a
 *  different number of times in each language (the Japanese series blockquote
 *  links gunjo.jp a second time), so only presence is comparable.
 *
 *  A URL that the Japanese round has and the English one lost is a real drift.
 *  A URL only the English round has is usually the issue-to-PR bridging that
 *  glossary §40 asks for, so it is reported separately and more quietly. */
function checkLinksDropped(ja, en) {
    const j = new Set(linkTargets(ja));
    const e = new Set(linkTargets(en));
    const dropped = [...j].filter((x) => !e.has(x));
    if (dropped.length === 0) return null;
    return {
        code: "LINKS_DROPPED",
        label: "リンク",
        message: `JA にあるリンクが EN に無い: ${dropped.join(", ")}`,
    };
}

function checkLinksAdded(ja, en) {
    const j = new Set(linkTargets(ja));
    const e = new Set(linkTargets(en));
    // A link the Japanese round already names in plain text ("#352") and the
    // English one turned into a real link is not a difference worth a glance.
    // A number that appears nowhere in the Japanese round is: it was produced
    // during translation, so it has never been checked against GitHub.
    const added = [...e].filter((url) => {
        if (j.has(url)) return false;
        const number = /\/(\d+)\/?$/.exec(url)?.[1];
        return !number || !ja.includes(`#${number}`);
    });
    if (added.length === 0) return null;
    return {
        code: "LINKS_ADDED",
        label: "リンク",
        message: `EN にだけあるリンク＝翻訳のときに足された番号（原文はこの番号に一度も触れていない）。そのPR/issueが本当にこの回の話か確認: ${added.join(", ")}`,
    };
}

function checkScore(jaRound, en) {
    const score = jaRound.score;
    if (!score || !/^\d/.test(score)) return null;
    if (en.includes(score)) return null;
    return {
        code: "SCORE",
        label: "点数",
        message: `一覧の点数 ${score} が英語本文に出てこない`,
    };
}

// --- human candidates -------------------------------------------------------

/** A count in the title is the shape that has failed before: "four components"
 *  in the title against six in the body (#159), "six screens" against three
 *  ticks (#152). The machine cannot resolve it, so it nominates the round. */
function titleCountCandidate(title) {
    const stripped = title
        .replace(/\b\d+\s*\/\s*\d+\b/g, "") // 4/5 is a score, not a count
        .replace(/#\d+/g, ""); // round references
    const found = [
        ...[...stripped.matchAll(/(?<![\w/])\d+(?![\w/])/g)].map((m) => m[0]),
        ...[...stripped.matchAll(/(?<![A-Za-z])(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)(?![A-Za-z])/gi)].map((m) => m[0]),
    ];
    if (found.length === 0) return null;
    return {
        code: "TITLE_COUNT",
        label: "タイトル",
        message: `タイトルが数を主張している（${[...new Set(found)].join(", ")}）＝本文の列挙と数が合うか人が数える`,
    };
}

/** A component or proper name in the title that never appears in the article. */
function titleTokenCandidate(title, markdown) {
    const body = markdown.split("\n").slice(1).join("\n").toLowerCase();
    const tokens = new Set();
    for (const m of title.matchAll(/`([^`]+)`/g)) tokens.add(m[1]);
    for (const m of title.matchAll(/\b[A-Z][a-z0-9]*[A-Z][A-Za-z0-9]*\b/g)) tokens.add(m[0]);
    // Capitalised ordinary words only when they are not sentence-initial.
    for (const m of title.matchAll(/(?<=\S\s)\b[A-Z][a-z]{2,}\b/g)) tokens.add(m[0]);
    const missing = [...tokens].filter((t) => !body.includes(t.toLowerCase()));
    if (missing.length === 0) return null;
    return {
        code: "TITLE_TOKEN",
        label: "タイトル",
        message: `タイトルの語が本文に出てこない: ${missing.join(", ")}`,
    };
}

// §40-b: the series' own protagonist is "the agent" (the AI), so an industry
// "agent" (a licensed broker, an insurance rep, a travel agency) must not be
// translated as "agent". Flag rounds whose Japanese source names such a role.
const ROLE_WORDS_HIGH = ["宅建", "代理店", "仲介", "ブローカー", "旅行会社", "保険会社", "不動産会社"];
const ROLE_WORDS_INFO = ["担当者", "窓口"];

function nameCollisionCandidate(jaText, enText) {
    const high = ROLE_WORDS_HIGH.filter((w) => jaText.includes(w));
    const info = ROLE_WORDS_INFO.filter((w) => jaText.includes(w));
    if (high.length === 0 && info.length === 0) return null;
    const agents = (enText.match(/(?<![A-Za-z])agents?(?![A-Za-z])/gi) ?? []).length;
    const brokers = (enText.match(/(?<![A-Za-z])(brokers?|agenc(?:y|ies)|realtors?)(?![A-Za-z])/gi) ?? []).length;
    if (high.length > 0) {
        return {
            code: "NAME_COLLISION",
            label: "固有名詞",
            message: `原文に業種側の役職語（${high.join("・")}）＝規約 §40-b の衝突ガード対象。EN の "agent" ${agents}回 / "broker・agency" ${brokers}回 が全部 AI を指しているか人が確認`,
        };
    }
    return {
        code: "NAME_ROLE",
        label: "固有名詞",
        message: `原文に役職語（${info.join("・")}）。EN の "agent" ${agents}回 が AI 以外を指していないか確認`,
    };
}

/** Proper nouns the reviewer may want to eyeball, minus the design system's own
 *  vocabulary (component names live in the Japanese source too, so anything
 *  that also appears there is not a translation decision). */
function properNouns(enText, jaText) {
    const found = new Set();
    for (const m of enText.replace(/```[\s\S]*?```/g, "").matchAll(/(?<=[a-z,)]\s)\b[A-Z][A-Za-z]{2,}(?:\s+[A-Z][A-Za-z]{2,})*\b/g)) {
        const token = m[0];
        if (jaText.includes(token)) continue;
        found.add(token);
    }
    return [...found].sort();
}

// ---------------------------------------------------------------------------
// driver
// ---------------------------------------------------------------------------

export function listRounds() {
    return fs
        .readdirSync(EN_DIR)
        .filter((n) => /^\d+\.json$/.test(n))
        .map((n) => parseInt(n, 10))
        .sort((a, b) => a - b);
}

export function inspectRound(round) {
    const enFile = path.join(EN_DIR, `${round}.json`);
    const jaFile = path.join(JA_DIR, `${round}.json`);
    const en = JSON.parse(fs.readFileSync(enFile, "utf8"));
    const ja = JSON.parse(fs.readFileSync(jaFile, "utf8"));
    const enMd = en.article?.markdown ?? "";
    const jaMd = ja.article?.markdown ?? "";
    const jaAll = [ja.title, ja.summary, jaMd].join("\n");
    const enAll = [en.title, en.summary, enMd].join("\n");

    const machine = [
        checkImages(jaMd, enMd),
        builtCount(jaMd, enMd),
        scoreboardNames(jaMd, enMd),
        scoreboardProgress(jaMd, enMd),
        checkProgressRows(jaMd, enMd),
        checkRunRow(jaMd, enMd),
        checkNextUp(jaMd, enMd),
        checkHeadingCount(jaMd, enMd),
        checkLinksDropped(jaMd, enMd),
        checkScore(ja, enMd),
    ].filter(Boolean);

    const human = [
        checkLinksAdded(jaMd, enMd),
        titleCountCandidate(en.title),
        titleTokenCandidate(en.title, enMd),
        nameCollisionCandidate(jaAll, enAll),
    ].filter(Boolean);

    return {
        round,
        status: en.status,
        category: ja.category,
        slug: ja.slug,
        score: ja.score,
        title: en.title,
        jaTitle: ja.title,
        machine,
        human,
        properNouns: properNouns(enMd, jaMd).slice(0, 12),
    };
}

export function inspectAll() {
    return listRounds().map(inspectRound);
}

function main() {
    const argv = process.argv.slice(2);
    const jsonAt = argv.indexOf("--json");
    const roundAt = argv.indexOf("--round");
    const verbose = argv.includes("--verbose");

    const results = roundAt >= 0 ? [inspectRound(Number(argv[roundAt + 1]))] : inspectAll();

    const clean = results.filter((r) => r.machine.length === 0 && r.human.length === 0);
    const flagged = results.filter((r) => r.machine.length > 0 || r.human.length > 0);
    const mismatched = results.filter((r) => r.machine.length > 0);

    console.log(`English cold-test rounds checked: ${results.length}`);
    console.log(`  機械の指摘なし          : ${clean.length}`);
    console.log(`  人が見るべき（指摘あり）: ${flagged.length}`);
    console.log(`    うち JA とのずれ      : ${mismatched.length}`);
    console.log(`    候補出しのみ          : ${flagged.length - mismatched.length}`);
    console.log("");
    console.log("⚠️ 機械が言えるのは「JA とずれていない」までです。");
    console.log("   タイトルが記事の中身と合っているかは、機械の指摘の有無に関わらず人が読んで決めます。");

    if (flagged.length > 0) {
        console.log("");
        for (const r of flagged) {
            console.log(`#${r.round} [${r.category}] ${r.title}`);
            for (const f of r.machine) console.log(`   ずれ  ${f.label}: ${f.message}`);
            for (const f of r.human) console.log(`   候補  ${f.label}: ${f.message}`);
            if (verbose && r.properNouns.length) console.log(`   名詞  ${r.properNouns.join(", ")}`);
        }
    }

    if (jsonAt >= 0) {
        const out = argv[jsonAt + 1];
        fs.mkdirSync(path.dirname(out), { recursive: true });
        fs.writeFileSync(out, JSON.stringify(results, null, 2) + "\n");
        console.log(`\nWrote ${out}`);
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
