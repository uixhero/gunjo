#!/usr/bin/env node
// サイトマップとビルドの出力を突き合わせる門番。
//
//   npm run build && npm run design:verify:sitemap
//   npm run design:verify:sitemap:self-test   （検査自体が両方向で止まるか）
//
// なぜ要るか: サイトマップは docs の URL を左メニューからだけ集めていたので、
// メニューに載らないページ25件がずっと抜けていた（issue #1016）。集め方を
// 直すだけだと、次にページが増えた日にまた静かに漏れる。⭐ ここが本体＝
// 「ビルドが出したページ」と「サイトマップの URL」が食い違ったら止める。
//
// ⛔ ブラウザは使わない。`.next/` の中だけを読む:
//   - `.next/prerender-manifest.json`   … 前もって描かれた URL の全部
//   - `.next/server/app/<path>.meta`    … その URL の HTTP status（無ければ 200）
//   - `.next/server/app/<path>.html`    … ページかどうか（画像や .txt の経路は無い）
//   - `.next/app-path-routes-manifest.json` … 実行時に描くページ（/pack など）
//   - `.next/server/app/sitemap.xml.body`   … 出来上がったサイトマップ
//
// 見るのは3つ:
//   1. ビルドが 200 で出したページが、全部サイトマップにあるか（漏れ）
//   2. サイトマップの URL が、全部ビルドの実在ページか（幽霊）
//   3. 転送（307）や 404・500 になる URL がサイトマップに入っていないか
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs";

export const ROOT = fileURLToPath(new URL("..", import.meta.url));

const POLICY_PATH = "design/policy/sitemap-exclusions.json";

function readPolicy(root) {
    const raw = JSON.parse(readFileSync(join(root, POLICY_PATH), "utf8"));
    return raw.exclusions ?? [];
}

/** サイトマップから外す URL か（出す側 app/lib/seo/sitemap-exclusions.ts と同じ表）。 */
export function isExcluded(path, exclusions) {
    return exclusions.some(
        (rule) =>
            (rule.path !== undefined && rule.path === path) ||
            (rule.prefix !== undefined && path.startsWith(rule.prefix))
    );
}

/** `/` → `index`、`/docs/x` → `docs/x`。`.next/server/app/` の下の名前。 */
function outputName(route) {
    return route === "/" ? "index" : route.slice(1);
}

/**
 * ビルドの出力から「実在するページ」を読む。
 * 返すのは `{ served: string[], nonPage: string[], notServed: Map<string, number> }`。
 */
export function readBuiltPages(root = ROOT) {
    const next = join(root, ".next");
    const prerenderPath = join(next, "prerender-manifest.json");
    const appRoutesPath = join(next, "app-path-routes-manifest.json");
    if (!existsSync(prerenderPath) || !existsSync(appRoutesPath)) {
        throwLinesError([
            "design:verify: サイトマップの検査にはビルドの出力が要ります。",
            "- `npm run build` を先に実行してください（.next/prerender-manifest.json が見つかりません）。",
        ]);
    }
    const prerender = JSON.parse(readFileSync(prerenderPath, "utf8"));
    const appRoutes = JSON.parse(readFileSync(appRoutesPath, "utf8"));

    const served = [];
    const nonPage = [];
    const notServed = new Map();
    const seen = new Set();

    for (const route of Object.keys(prerender.routes ?? {}).sort()) {
        if (route.startsWith("/_")) continue;
        seen.add(route);
        const name = outputName(route);
        const metaPath = join(next, "server/app", `${name}.meta`);
        const status = existsSync(metaPath)
            ? (JSON.parse(readFileSync(metaPath, "utf8")).status ?? 200)
            : 200;
        if (status !== 200) {
            notServed.set(route, status);
            continue;
        }
        // ページか、画像・テキストの経路か。ページだけが .html を持つ。
        if (!existsSync(join(next, "server/app", `${name}.html`))) {
            nonPage.push(route);
            continue;
        }
        served.push(route);
    }

    // 実行時に描くページ（前もって描かれないので prerender-manifest に出ない）。
    // 動的セグメント（`[slug]`）を含むものは、元データ側が URL を持つので外す。
    for (const [file, url] of Object.entries(appRoutes)) {
        if (!file.endsWith("/page")) continue;
        if (url.includes("[")) continue;
        if (url.startsWith("/_")) continue;
        if (seen.has(url)) continue;
        served.push(url);
    }

    served.sort();
    return { served, nonPage, notServed };
}

/** 出来上がったサイトマップの URL（パスだけ）。 */
export function readSitemapPaths(root = ROOT) {
    const body = join(root, ".next/server/app/sitemap.xml.body");
    if (!existsSync(body)) {
        throwLinesError([
            "design:verify: .next/server/app/sitemap.xml.body が見つかりません。",
            "- `npm run build` を先に実行してください。",
        ]);
    }
    const xml = readFileSync(body, "utf8");
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    return locs.map((loc) => {
        const path = loc.replace(/^https?:\/\/[^/]+/, "");
        return path === "" ? "/" : path;
    });
}

/**
 * 突き合わせる。`built` と `sitemapPaths` を渡せるようにしてあるのは、
 * 自己検査（わざと壊して止まるか）が同じ関数を通るようにするため。
 */
export function collectSitemapIssues({ built, sitemapPaths, exclusions }) {
    const issues = { missing: [], ghost: [], notServed: [], duplicated: [] };
    const sitemapSet = new Set(sitemapPaths);

    if (sitemapSet.size !== sitemapPaths.length) {
        const counts = new Map();
        for (const path of sitemapPaths) counts.set(path, (counts.get(path) ?? 0) + 1);
        for (const [path, count] of counts) if (count > 1) issues.duplicated.push(path);
    }

    for (const route of built.served) {
        if (isExcluded(route, exclusions)) continue;
        if (!sitemapSet.has(route)) issues.missing.push(route);
    }

    const servedSet = new Set(built.served);
    for (const path of sitemapPaths) {
        if (built.notServed.has(path)) {
            issues.notServed.push(`${path}（HTTP ${built.notServed.get(path)}）`);
            continue;
        }
        if (isExcluded(path, exclusions)) {
            issues.ghost.push(`${path}（${POLICY_PATH} で除外しているのに載っている）`);
            continue;
        }
        if (!servedSet.has(path)) issues.ghost.push(path);
    }

    return issues;
}

function totalIssues(issues) {
    return (
        issues.missing.length +
        issues.ghost.length +
        issues.notServed.length +
        issues.duplicated.length
    );
}

function issueLines(issues) {
    const lines = [];
    const show = (label, items, hint) => {
        if (items.length === 0) return;
        lines.push(`${label}（${items.length}件）${hint}`);
        for (const item of items.slice(0, 25)) lines.push(`- ${item}`);
        if (items.length > 25) lines.push(`- ...ほか ${items.length - 25} 件`);
    };
    show(
        "サイトマップに無い実在ページ",
        issues.missing,
        "＝`app/sitemap.ts` の集め方を直すか、載せない理由を " + POLICY_PATH + " に書く"
    );
    show("サイトマップにあるが実在しない URL", issues.ghost, "＝消すか、ページを作る");
    show("転送や 404 になる URL がサイトマップにある", issues.notServed, "＝転送先を載せる");
    show("サイトマップの中で重複している URL", issues.duplicated, "");
    return lines;
}

/** 検査自体が両方向で止まるか。⛔ 片側しか見ていない検査は門番にならない。 */
export function runSelfTest() {
    const failures = [];
    const exclusions = [{ prefix: "/embed/", reason: "self-test", addedOn: "2026-09-20" }];
    const built = {
        served: ["/", "/docs/a", "/docs/b", "/embed/x"],
        nonPage: [],
        notServed: new Map([["/old", 307]]),
    };

    const clean = collectSitemapIssues({
        built,
        sitemapPaths: ["/", "/docs/a", "/docs/b"],
        exclusions,
    });
    if (totalIssues(clean) !== 0) {
        failures.push(`揃っているのに止まった: ${JSON.stringify(clean)}`);
    }

    // ① 実在ページを1つ落とす
    const dropped = collectSitemapIssues({
        built,
        sitemapPaths: ["/", "/docs/a"],
        exclusions,
    });
    if (!dropped.missing.includes("/docs/b")) {
        failures.push("実在ページを落としたのに「漏れ」で止まらなかった");
    }

    // ② 実在しない URL を1つ足す
    const added = collectSitemapIssues({
        built,
        sitemapPaths: ["/", "/docs/a", "/docs/b", "/docs/ghost"],
        exclusions,
    });
    if (!added.ghost.includes("/docs/ghost")) {
        failures.push("実在しない URL を足したのに「幽霊」で止まらなかった");
    }

    // ③ 転送になる URL を足す
    const redirected = collectSitemapIssues({
        built,
        sitemapPaths: ["/", "/docs/a", "/docs/b", "/old"],
        exclusions,
    });
    if (redirected.notServed.length !== 1) {
        failures.push("転送（307）の URL を足したのに止まらなかった");
    }

    // ④ 除外したページを足す
    const excluded = collectSitemapIssues({
        built,
        sitemapPaths: ["/", "/docs/a", "/docs/b", "/embed/x"],
        exclusions,
    });
    if (excluded.ghost.length !== 1) {
        failures.push("除外している URL を足したのに止まらなかった");
    }

    return failures;
}

/**
 * 検査自体の自己検査だけ。ビルドの出力が要らないので `design:verify` から呼べる
 * （突き合わせ本体はビルドの後＝CI の build の次の段で回す）。
 */
export function verifySitemapCheckerSelfTest() {
    const failures = runSelfTest();
    if (failures.length === 0) return;
    throwLinesError([
        "check-sitemap-coverage: 検査自体の自己検査に失敗しました（門番が壊れています）。",
        ...failures.map((line) => `- ${line}`),
    ]);
}

export function verifySitemapCoverage({ root = ROOT } = {}) {
    verifySitemapCheckerSelfTest();

    const exclusions = readPolicy(root);
    const built = readBuiltPages(root);
    const sitemapPaths = readSitemapPaths(root);
    const issues = collectSitemapIssues({ built, sitemapPaths, exclusions });

    if (totalIssues(issues) === 0) {
        const excludedCount = built.served.filter((route) => isExcluded(route, exclusions)).length;
        console.log(
            `[sitemap] ビルドのページ ${built.served.length} 件（うち除外 ${excludedCount} 件）` +
                ` / サイトマップ ${sitemapPaths.length} 件 / 転送・404 ${built.notServed.size} 件は対象外`
        );
        return;
    }

    throwLinesError([
        "design:verify: サイトマップとビルドの出力が食い違っています。",
        ...issueLines(issues),
        `除外の表: ${POLICY_PATH}（⛔ 足す前に KeEem に確認する）`,
    ]);
}

if (process.argv[1]?.endsWith("check-sitemap-coverage.mjs") && process.argv.includes("--self-test")) {
    const failures = runSelfTest();
    if (failures.length > 0) {
        for (const line of failures) console.error(`- ${line}`);
        console.error("check-sitemap-coverage: self-test failed");
        process.exit(1);
    }
    console.log("check-sitemap-coverage: self-test passed（漏れ・幽霊・転送・除外の4方向）");
} else {
    runVerificationCli({
        scriptName: "check-sitemap-coverage.mjs",
        verify: verifySitemapCoverage,
        successMessage: "design:verify: sitemap coverage check passed",
    });
}
