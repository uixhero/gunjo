#!/usr/bin/env node
// Builds the fill-in ledger KeEem uses to eyeball the English cold-test rounds
// before they are promoted from `draft` to `reviewed`.
//
//     npm run coldtest-en:ledger
//     npm run coldtest-en:ledger -- --out some/dir
//
// Re-running is safe: the 判定 and メモ columns already written into the batch
// files are read back and carried over, so the machine half can be refreshed
// after a retranslation without losing a single human note.
//
// The ledger always lands in the MAIN checkout (promotion/ is gitignored, so a
// worktree copy would be invisible to everyone else). Pass --out to override.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { inspectAll } from "./check-coldtest-en-parity.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEV_ORIGIN = process.env.COLDTEST_DEV_ORIGIN ?? "http://localhost:13060";
const TODO = "⬜";

/** ~10 rounds per batch, never splitting an industry across a batch boundary
 *  unless the industry is large enough to need more than one sitting. */
const TARGET_BATCH = 10;

function mainWorktree() {
    try {
        const common = execFileSync("git", ["rev-parse", "--path-format=absolute", "--git-common-dir"], {
            cwd: ROOT,
            encoding: "utf8",
        }).trim();
        return path.dirname(common);
    } catch {
        return ROOT;
    }
}

function chunk(list, target) {
    const parts = Math.max(1, Math.round(list.length / target));
    const size = Math.ceil(list.length / parts);
    const out = [];
    for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
    return out;
}

function buildBatches(rounds) {
    const byCategory = new Map();
    for (const r of rounds) {
        if (!byCategory.has(r.category)) byCategory.set(r.category, []);
        byCategory.get(r.category).push(r);
    }
    // Categories run in series order, so a batch reads as a continuous stretch
    // of the build log rather than a jump around the timeline.
    const categories = [...byCategory.entries()].sort(
        (a, b) => a[1][0].round - b[1][0].round
    );
    const batches = [];
    for (const [category, list] of categories) {
        const parts = chunk(list, TARGET_BATCH);
        parts.forEach((part, i) => {
            batches.push({
                category,
                part: parts.length > 1 ? `${i + 1}/${parts.length}` : null,
                rounds: part,
            });
        });
    }
    return batches.map((b, i) => ({ ...b, id: String(i + 1).padStart(2, "0") }));
}

/** "#31, #42〜#46, #118" — the rounds in a batch are rarely contiguous. */
function compactRange(rounds) {
    const ns = rounds.map((r) => r.round).sort((a, b) => a - b);
    const parts = [];
    let start = ns[0];
    let prev = ns[0];
    for (const n of ns.slice(1)) {
        if (n === prev + 1) { prev = n; continue; }
        parts.push(start === prev ? `#${start}` : `#${start}〜#${prev}`);
        start = prev = n;
    }
    parts.push(start === prev ? `#${start}` : `#${start}〜#${prev}`);
    return parts.join(", ");
}

function shortLabels(entry) {
    const labels = [];
    for (const f of entry.machine) labels.push(`⚠️${f.label}`);
    for (const f of entry.human) labels.push(f.label);
    return [...new Set(labels)];
}

/** Reads 判定 / メモ back out of a ledger file so a rebuild keeps them. */
function readExisting(file) {
    const kept = new Map();
    if (!fs.existsSync(file)) return kept;
    for (const line of fs.readFileSync(file, "utf8").split("\n")) {
        const m = /^\|\s*([^|]*?)\s*\|\s*#(\d+)\s*\|.*\|\s*([^|]*?)\s*\|\s*$/.exec(line);
        if (!m) continue;
        kept.set(Number(m[2]), { verdict: m[1].trim() || TODO, memo: m[3].trim() });
    }
    return kept;
}

function cell(text) {
    return String(text).replace(/\|/g, "\\|");
}

function batchFile(batch, kept) {
    const title = `バッチ${batch.id} — ${batch.category}${batch.part ? `（${batch.part}）` : ""}`;
    const done = batch.rounds.filter((r) => (kept.get(r.round)?.verdict ?? TODO) !== TODO).length;
    const flagged = batch.rounds.filter((r) => r.machine.length + r.human.length > 0);

    const lines = [];
    lines.push(`# ${title}`);
    lines.push("");
    lines.push(`**${batch.rounds.length}本**（${compactRange(batch.rounds)}）　`);
    lines.push(`進捗 **${done} / ${batch.rounds.length}** 済　`);
    lines.push(`機械の指摘なし **${batch.rounds.length - flagged.length}本** ／ 機械が何か挙げた **${flagged.length}本**`);
    lines.push("");
    lines.push("## 記入のしかた");
    lines.push("");
    lines.push("`判定` の `⬜` を **`OK`・`要修正`・`保留`** のどれかに書き換えるだけ。気づいたことは `メモ` に一言。");
    lines.push("途中でやめて構いません。`⬜` が残っている行が、次に見る行です。");
    lines.push("");
    lines.push("⚠️ **`機械` 欄が空でも、その回は読んでください。** 機械が言えるのは「日本語版とずれていない」までです。");
    lines.push("**タイトルが記事の中身と合っているか**は、機械には判定できません。");
    lines.push("");
    lines.push("見るのは3点です。");
    lines.push("");
    lines.push("1. タイトルが記事の中身と合っているか（**機械では見られない・毎回これを見る**）");
    lines.push("2. 画像・スコアボード・シリーズの行が日本語版とずれていないか（機械が先に見た結果が `機械` 欄）");
    lines.push("3. 社名・固有名詞の扱い（`agent` は常に AI を指しているか。宅建士は the licensed broker）");
    lines.push("");
    lines.push("## 台帳");
    lines.push("");
    lines.push("| 判定 | 回 | 見る | タイトル | 機械 | メモ |");
    lines.push("| --- | --- | --- | --- | --- | --- |");
    for (const r of batch.rounds) {
        const k = kept.get(r.round) ?? { verdict: TODO, memo: "" };
        const links = `[EN](${DEV_ORIGIN}/en/cold-tests/${r.round}) / [JA](${DEV_ORIGIN}/cold-tests/${r.round})`;
        const labels = shortLabels(r);
        lines.push(
            `| ${k.verdict} | #${r.round} | ${links} | ${cell(r.title)} | ${labels.length ? labels.join("・") : ""} | ${cell(k.memo)} |`
        );
    }
    lines.push("");

    if (flagged.length > 0) {
        lines.push("## 機械が挙げた点（この欄がある回は、その点も一緒に見る）");
        lines.push("");
        for (const r of flagged) {
            lines.push(`### #${r.round} ${r.title}`);
            lines.push("");
            for (const f of r.machine) lines.push(`- ⚠️ **JAとのずれ・${f.label}** — ${f.message}`);
            for (const f of r.human) lines.push(`- 候補・**${f.label}** — ${f.message}`);
            if (r.properNouns.length > 0) {
                lines.push(`- 参考・英語本文の固有名詞: ${r.properNouns.join(", ")}`);
            }
            lines.push("");
        }
    }

    lines.push("---");
    lines.push("");
    lines.push("見終わったら [索引](./README.md) に戻る。");
    lines.push("");
    lines.push("⛔ この台帳では記事を直しません。見つけた不一致は `メモ` に書くだけで、直すのは別の起票です。");
    lines.push("");
    return { title, text: lines.join("\n"), done, flagged: flagged.length };
}

function readme(batches, files, results) {
    const clean = results.filter((r) => r.machine.length === 0 && r.human.length === 0).length;
    const drift = results.filter((r) => r.machine.length > 0).length;
    const flagged = results.length - clean;

    const lines = [];
    lines.push("# 英語版コールドテスト 目視台帳");
    lines.push("");
    lines.push(`対象 **${results.length}本**（\`app/data/cold-test-rounds/en/*.json\`・全部 \`status: "draft"\`＝本番には1本も出ていない）`);
    lines.push("");
    lines.push("## 機械で先に絞った結果");
    lines.push("");
    lines.push("| | 本数 | 中身 |");
    lines.push("| --- | ---: | --- |");
    lines.push(`| 機械で見て問題が無かった | **${clean}** | 画像・スコアボード・シリーズの行・リンク・点数が日本語版と一致。**ただしタイトルと中身が合っているかは別＝下の注記** |`);
    lines.push(`| 人が見るべき | **${flagged}** | 内訳＝**JAとのずれ ${drift}本**（機械が「違う」と言い切れるもの）／**候補出しのみ ${flagged - drift}本**（疑いを挙げただけ・人が決める） |`);
    lines.push("");
    lines.push("⚠️ **「機械が○だから人は見なくてよい」ではありません。**");
    lines.push("機械が言えるのは **「日本語版とずれていない」まで**です。");
    lines.push("**タイトルが記事の中身と合っているか**は文章の意味の話で、機械には判定できません。");
    lines.push("だから台帳は **117本すべてに 判定欄** を持っています。上の表は **読む順番と、どこで手を止めるか**を決めるためのものです。");
    lines.push("");
    lines.push("## 機械が見たもの・見られないもの");
    lines.push("");
    lines.push("| 見た | 中身 |");
    lines.push("| --- | --- |");
    lines.push("| 画像 | 本文の `![]()` の**参照先と枚数**が JA と一致するか。⭐ 一覧のスクリーンショットは英語ページでも**日本語版と同じ画像を出す作り**（`mergeEnRound` が差し替えるのは題・要約・本文だけ）なので、そもそもずれる余地がありません |");
    lines.push("| スコアボード | 「作成済 N個」の**数**／JA に出ている**コンポーネント名が全部 EN にもあるか**／進行中の **N/3** |");
    lines.push("| シリーズの行 | 📋 進捗節の**行数・✅の数・モードの絵文字**／締めの「前回まで #a〜#b」の**回番号**／次回予告の**回番号**／`##` 見出しの**数** |");
    lines.push("| リンク | JA のリンクが EN で**落ちていないか**／EN にだけある番号（翻訳で足された PR・issue） |");
    lines.push("| 点数 | 一覧の `score`（例 4/5）が英語本文にも出ているか |");
    lines.push("");
    lines.push("| 見られない | なぜ |");
    lines.push("| --- | --- |");
    lines.push("| **タイトルが記事の中身と合っているか** | 文章の意味の一致は機械には測れません。代わりに**候補出し**だけします＝タイトルが数を主張している回（過去に #152「6画面」対 ✅3つ、#159「4個」対 列挙6個 の実例あり）と、タイトルの語が本文に一度も出てこない回 |");
    lines.push("| **固有名詞の扱いが妥当か** | 語を拾うことしかできません。原文に業種側の役職語（宅建士・代理店・仲介など）がある回を挙げ、その回の英語の `agent` が全部 AI を指しているかは人が読んで決めます（規約 §40-b） |");
    lines.push("| **英語の正しさ** | このタスクの対象外です（3巡・のべ9体の独立レビュー済み） |");
    lines.push("");
    lines.push("## バッチ");
    lines.push("");
    lines.push("| バッチ | 業種 | 本数 | 回 | 機械の指摘なし | 人が見るべき | 進捗 |");
    lines.push("| --- | --- | ---: | --- | ---: | ---: | ---: |");
    batches.forEach((b, i) => {
        const f = files[i];
        const range = compactRange(b.rounds);
        lines.push(
            `| [${b.id}](./batch-${b.id}.md) | ${b.category}${b.part ? `（${b.part}）` : ""} | ${b.rounds.length} | ${range} | ${b.rounds.length - f.flagged} | ${f.flagged} | ${f.done} / ${b.rounds.length} |`
        );
    });
    lines.push("");
    lines.push("## 進め方");
    lines.push("");
    lines.push(`1. 開発サーバは **${DEV_ORIGIN}**（HQ が \`~/dev/gunjo\` で立てているもの。別に立てる必要はありません）`);
    lines.push("2. バッチのファイルを開き、上から1行ずつ。各行の `EN` と `JA` を並べて開く");
    lines.push("3. `判定` の `⬜` を `OK` / `要修正` / `保留` に書き換える。気づいたことは `メモ` に一言");
    lines.push("4. 途中でやめてよい。`⬜` が残っている行が次に見る行");
    lines.push("");
    lines.push("## この台帳が答えないこと");
    lines.push("");
    lines.push("- **英語の正しさ**は対象外です（3巡・のべ9体の独立レビュー済み）");
    lines.push("- **記事は1文字も直しません**。見つけた不一致は `メモ` に書くだけ。直すのは別の起票です");
    lines.push("- **昇格の操作もここではしません**。判定が出そろってから、`en/<回>.json` の `status` を `draft` から `reviewed` にします");
    lines.push("");
    lines.push("## 作り直し");
    lines.push("");
    lines.push("翻訳を直したあとに機械の欄だけ更新したいときは、リポジトリで:");
    lines.push("");
    lines.push("```");
    lines.push("npm run coldtest-en:ledger");
    lines.push("```");
    lines.push("");
    lines.push("`判定` と `メモ` は読み戻して引き継ぐので、記入済みの内容は消えません。");
    lines.push("");
    lines.push("機械の検査だけを見たいときは `npm run coldtest-en:parity`（`-- --verbose` で固有名詞も出ます）。");
    lines.push("");
    return lines.join("\n");
}

function main() {
    const argv = process.argv.slice(2);
    const outAt = argv.indexOf("--out");
    const outDir = outAt >= 0
        ? path.resolve(argv[outAt + 1])
        : path.join(mainWorktree(), "promotion", "handoff", "en-review");

    const results = inspectAll();
    const batches = buildBatches(results);
    fs.mkdirSync(outDir, { recursive: true });

    const files = batches.map((b) => {
        const file = path.join(outDir, `batch-${b.id}.md`);
        const built = batchFile(b, readExisting(file));
        fs.writeFileSync(file, built.text);
        return built;
    });

    fs.writeFileSync(path.join(outDir, "README.md"), readme(batches, files, results));
    fs.writeFileSync(
        path.join(outDir, "machine-report.json"),
        JSON.stringify(results, null, 2) + "\n"
    );

    const clean = results.filter((r) => r.machine.length === 0 && r.human.length === 0).length;
    console.log(`Ledger written to ${outDir}`);
    console.log(`  ${results.length} rounds in ${batches.length} batches`);
    console.log(`  機械で見て問題が無かった: ${clean}`);
    console.log(`  人が見るべき            : ${results.length - clean}`);
    console.log(`  索引: ${path.join(outDir, "README.md")}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
