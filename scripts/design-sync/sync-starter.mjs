import { join } from "node:path";
import { ROOT, readText, writeText } from "./shared.mjs";

// Generates public/starter.html — the self-contained single-file starter for
// npm-less environments (Claude Artifacts, single-file HTML, sandboxes). It
// inlines public/tokens.css + public/patterns.css and a demo dashboard that
// exercises every pattern, so an AI or human can copy the whole file (or open
// the URL) and see the full GunjoUI-look kit working. Because it is assembled
// from the two checked-in CSS files, it can never drift from them. (#685)

// Custom properties that patterns.css expects the *markup* to supply inline
// (gantt/meter positioning), so they are not required to exist in tokens.css.
const LOCAL_PATTERN_VARS = new Set(["--from", "--to", "--at", "--value"]);

function definedTokens(tokensCss) {
  const names = new Set();
  const pattern = /(--[a-z0-9-]+)\s*:/g;
  let match = pattern.exec(tokensCss);
  while (match) {
    names.add(match[1]);
    match = pattern.exec(tokensCss);
  }
  return names;
}

function referencedTokens(patternsCss) {
  const names = new Set();
  const pattern = /var\((--[a-z0-9-]+)/g;
  let match = pattern.exec(patternsCss);
  while (match) {
    names.add(match[1]);
    match = pattern.exec(patternsCss);
  }
  return names;
}

/**
 * Every var(--token) referenced by patterns.css (minus the inline-only
 * positioning vars) must be defined in tokens.css. Guards against a pattern
 * silently referencing a token the standalone sheet does not ship.
 */
export function findUndefinedPatternTokens({ root = ROOT } = {}) {
  const tokensCss = readText(join(root, "public", "tokens.css"));
  const patternsCss = readText(join(root, "public", "patterns.css"));
  const defined = definedTokens(tokensCss);
  const referenced = referencedTokens(patternsCss);
  return [...referenced].filter(
    (name) => !LOCAL_PATTERN_VARS.has(name) && !defined.has(name)
  );
}

const DEMO_BODY = `<div class="page">
    <header class="page__head">
        <div>
            <h1 class="page__title">今月のステータス</h1>
            <p class="page__sub">GunjoUI パターン（patterns.css）だけで組んだ単一 HTML のデモ画面です。</p>
        </div>
        <button class="gj-btn gj-btn--outline gj-btn--sm" onclick="document.documentElement.classList.toggle('dark')">
            ダーク切替
        </button>
    </header>

    <div class="gj-tabs" role="tablist">
        <button class="gj-tab" role="tab" aria-selected="true" aria-controls="panel-overview">概要</button>
        <button class="gj-tab" role="tab" aria-selected="false" aria-controls="panel-plan">予定</button>
    </div>

    <section id="panel-overview" class="gj-tabpanel gj-stack" role="tabpanel">
        <div class="gj-grid">
            <div class="gj-stat">
                <span class="gj-stat__label">今月の予約</span>
                <span class="gj-stat__value">1,284</span>
                <span class="gj-stat__delta gj-stat__delta--ok">前月比 +12%</span>
            </div>
            <div class="gj-stat">
                <span class="gj-stat__label">キャンセル率</span>
                <span class="gj-stat__value">4.2%</span>
                <span class="gj-stat__delta gj-stat__delta--warn">前月比 +0.8pt</span>
            </div>
            <div class="gj-stat">
                <span class="gj-stat__label">未対応の問い合わせ</span>
                <span class="gj-stat__value">7</span>
                <span class="gj-stat__delta gj-stat__delta--crit">SLA 超過 2 件</span>
            </div>
        </div>

        <div class="gj-card gj-card--bar gj-card--bar-ok">
            <div class="gj-cluster">
                <span class="gj-badge gj-badge--ok">稼働中</span>
                <span class="gj-badge gj-badge--primary">処理中 3</span>
                <span class="gj-badge gj-badge--warn">要確認 2</span>
                <span class="gj-badge gj-badge--outline">全店舗</span>
            </div>
            <h2 class="gj-card__title">店舗別の予約</h2>
            <p class="gj-card__desc">タップで詳細。数値は当月確定分。</p>
            <div class="gj-card__body">
                <div class="gj-table-wrap">
                    <table class="gj-table gj-table--striped">
                        <thead>
                            <tr><th>店舗</th><th>状態</th><th class="gj-num">予約</th><th class="gj-num">稼働率</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>本店</td><td><span class="gj-badge gj-badge--ok">稼働中</span></td><td class="gj-num">642</td><td class="gj-num">88%</td></tr>
                            <tr><td>駅前店</td><td><span class="gj-badge gj-badge--warn">混雑</span></td><td class="gj-num">418</td><td class="gj-num">96%</td></tr>
                            <tr><td>郊外店</td><td><span class="gj-badge gj-badge--neutral">通常</span></td><td class="gj-num">224</td><td class="gj-num">61%</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="gj-card">
            <h2 class="gj-card__title">目標の進捗</h2>
            <div class="gj-card__body gj-stack">
                <div>
                    <div class="gj-cluster" style="justify-content: space-between;">
                        <span class="gj-stat__label">月間予約 目標 1,400</span>
                        <span class="gj-stat__delta">92%</span>
                    </div>
                    <div class="gj-meter" style="margin-top: 6px;"><div class="gj-meter__fill gj-meter__fill--ok" style="--value: 92%;"></div></div>
                </div>
                <div>
                    <div class="gj-cluster" style="justify-content: space-between;">
                        <span class="gj-stat__label">スタッフ充足</span>
                        <span class="gj-stat__delta">67%</span>
                    </div>
                    <div class="gj-meter" style="margin-top: 6px;"><div class="gj-meter__fill gj-meter__fill--warn" style="--value: 67%;"></div></div>
                </div>
            </div>
        </div>
    </section>

    <section id="panel-plan" class="gj-tabpanel gj-stack" role="tabpanel" hidden>
        <div class="gj-card">
            <h2 class="gj-card__title">導入スケジュール</h2>
            <div class="gj-card__body">
                <div class="gj-gantt">
                    <div class="gj-gantt__row">
                        <span class="gj-gantt__label">要件定義</span>
                        <div class="gj-gantt__track"><div class="gj-gantt__bar gj-gantt__bar--ok" style="--from: 0%; --to: 25%;"></div></div>
                    </div>
                    <div class="gj-gantt__row">
                        <span class="gj-gantt__label">設計・実装</span>
                        <div class="gj-gantt__track">
                            <div class="gj-gantt__bar" style="--from: 20%; --to: 70%;"></div>
                            <div class="gj-gantt__today" style="--at: 42%;"></div>
                        </div>
                    </div>
                    <div class="gj-gantt__row">
                        <span class="gj-gantt__label">検証・本番</span>
                        <div class="gj-gantt__track">
                            <div class="gj-gantt__bar gj-gantt__bar--warn" style="--from: 65%; --to: 95%;"></div>
                            <div class="gj-gantt__milestone" style="--at: 95%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="gj-card">
            <h2 class="gj-card__title">直近の動き</h2>
            <div class="gj-card__body">
                <div class="gj-timeline">
                    <div class="gj-timeline__item gj-timeline__item--ok">
                        <span class="gj-timeline__when">7/10</span>
                        <div class="gj-timeline__body">
                            <div class="gj-timeline__title">要件定義 完了</div>
                            <div class="gj-timeline__desc">3 店舗のヒアリングを反映。</div>
                        </div>
                    </div>
                    <div class="gj-timeline__item">
                        <span class="gj-timeline__when">7/18</span>
                        <div class="gj-timeline__body">
                            <div class="gj-timeline__title">実装 着手</div>
                            <div class="gj-timeline__desc">予約導線から先行。</div>
                        </div>
                    </div>
                    <div class="gj-timeline__item gj-timeline__item--warn">
                        <span class="gj-timeline__when">7/24</span>
                        <div class="gj-timeline__body">
                            <div class="gj-timeline__title">仕様変更の相談</div>
                            <div class="gj-timeline__desc">キャンセル料の扱いを再検討中。</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="gj-card">
            <h2 class="gj-card__title">連絡先を登録</h2>
            <div class="gj-card__body gj-stack" style="max-width: 360px;">
                <div class="gj-field">
                    <label class="gj-label" for="demo-name">担当者名</label>
                    <input class="gj-input" id="demo-name" placeholder="山田 太郎">
                </div>
                <div class="gj-field">
                    <label class="gj-label" for="demo-note">メモ</label>
                    <textarea class="gj-input" id="demo-note" rows="2" placeholder="任意"></textarea>
                </div>
                <div class="gj-cluster">
                    <button class="gj-btn gj-btn--primary">保存</button>
                    <button class="gj-btn gj-btn--ghost">キャンセル</button>
                </div>
            </div>
        </div>
    </section>
</div>`;

// Tabs behavior is intentionally tiny — a starter, not a framework. patterns.css
// styles the tab bar; this switches which panel is visible.
const DEMO_SCRIPT = `<script>
document.querySelectorAll('[role="tab"]').forEach(function (tab) {
    tab.addEventListener('click', function () {
        var group = tab.parentElement.querySelectorAll('[role="tab"]');
        group.forEach(function (t) {
            var on = t === tab;
            t.setAttribute('aria-selected', on ? 'true' : 'false');
            document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
        });
    });
});
</script>`;

const PAGE_STYLE = `        .page { max-width: 880px; margin: 0 auto; padding: 32px 20px; display: flex; flex-direction: column; gap: 20px; }
        .page__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
        .page__title { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.01em; }
        .page__sub { margin: 4px 0 0; font-size: 14px; color: hsl(var(--muted-foreground)); }`;

export function buildStarterHtml({ root = ROOT } = {}) {
  const tokensCss = readText(join(root, "public", "tokens.css"));
  const patternsCss = readText(join(root, "public", "patterns.css"));

  return `<!doctype html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>GunjoUI スターター（単一 HTML）</title>
    <!--
      GunjoUI single-file starter. Self-contained: no npm, no CDN, no build.
      配布元: https://www.gunjo.jp/starter.html ／ 解説: https://www.gunjo.jp/docs/no-npm
      このファイルは tokens.css + patterns.css + デモから生成されています。
      値を変えたいときは編集元の CSS（gunjo.jp/tokens.css, gunjo.jp/patterns.css）を使ってください。
    -->
    <style>
/* === tokens.css （https://www.gunjo.jp/tokens.css） === */
${tokensCss}
    </style>
    <style>
/* === patterns.css （https://www.gunjo.jp/patterns.css） === */
${patternsCss}
    </style>
    <style>
${PAGE_STYLE}
    </style>
</head>
<body>
${DEMO_BODY}
${DEMO_SCRIPT}
</body>
</html>
`;
}

export function syncStarter({ root = ROOT } = {}) {
  const outputPath = join(root, "public", "starter.html");
  writeText(outputPath, buildStarterHtml({ root }));
  console.log(
    "design:sync: Updated public/starter.html from public/tokens.css + public/patterns.css"
  );
}
