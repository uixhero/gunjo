#!/usr/bin/env node

// 面の段差の門番＝「枠を透明にした面が、親の面と見分けられるか」を実画面で測る。
//
// 面で区切る方針（DECISIONS.md 2026-09-22〜24）では、平常時の枠は透明
// （`border border-transparent contrast-more:border-border`）で、境目は面の濃淡が
// 作る。ところが面を親と同じ色の上に置くと、枠があった頃は線で分かれていたのに
// 境目が消える。#1027（第2段）でこの抜けが入り、#1030（第3段）で全ページを
// 測ったら 342 件（ページ×テーマの延べ）残っていた（#1029）。
//
// ⚠️ ソースの字面では捕まえられない。`bg-card` の行が抜けになるかどうかは、
// どの面の中に置かれたか（Card の中か、地の上か）で決まり、それは部品を組んだ
// 結果の DOM にしか無い。だから描いた画面を測る。
//
// 数えるもの（#1030 の「全ページの測定」と同じ定義。数を比べられるように変えない）:
//   - 枠の幅がある（border-width > 0・style が none/hidden でない）辺がある
//   - その辺の色が全部透明（＝「枠を透明にした面」）
//   - 自分の塗りがある（alpha > 0）
//   - 自分の実効色（半透明なら下に重ねた色）と、親の実効色の相対輝度比が 1.05 未満
// 対象は sitemap.xml の全 URL と /embed/*（docs のプレビューは iframe の中なので
// 別に開く）、それぞれ light / dark（CDP の prefers-color-scheme）・1280×900。
//
// 直し方の型（#1029 で 342 件を 0 にしたときのもの）:
//   - 自分の面を持つ部品（Card）の中の行・小箱 → bg-background に沈める
//   - 地の上にも Card の中にも置かれる部品の行 → bg-muted（両方と分かれる）
//   - 面の中に入れた器（Table） → 包む面が bg-card なら塗りをやめる
//   - muted・調子の面（*-subtle）の上の secondary の Badge や同じ調子のチップ
//     → bg-background に沈める（下が bg-background になりうる所は bg-card）
//   ⛔ 新しいトークン名は足さない。面の組の段差は src/globals.css の値で計算できる。
//
// 使い方:
//   node scripts/audit-surface-steps.mjs --start            # .next を next start して測る
//   node scripts/audit-surface-steps.mjs --base-url=http://127.0.0.1:13030
//   node scripts/audit-surface-steps.mjs --start --only=/docs/components/kanban-board
//   node scripts/audit-surface-steps.mjs --self-test        # 検出器そのものの自己テスト
// 先に `npm run build` が要る（--start のとき）。

import { spawn } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import puppeteer from "puppeteer"

const ROOT = fileURLToPath(new URL("..", import.meta.url))
const SCRIPT = "audit-surface-steps"
const MIN_STEP = 1.05
const THEMES = ["light", "dark"]
const VIEWPORT = { width: 1280, height: 900 }

// ⛔ この関数はブラウザの中で動く（page.evaluate に渡す）。外の変数を参照しないこと。
function probe(minStep) {
  const cv = document.createElement("canvas")
  cv.width = cv.height = 1
  const cx = cv.getContext("2d", { willReadFrequently: true })
  const parsed = new Map()
  // computed の色は oklab / color() でも返るので、canvas に塗って sRGB で読み直す
  const parse = (s) => {
    if (parsed.has(s)) return parsed.get(s)
    cx.clearRect(0, 0, 1, 1)
    cx.fillStyle = "rgba(0,0,0,0)"
    cx.fillStyle = s
    cx.fillRect(0, 0, 1, 1)
    const d = cx.getImageData(0, 0, 1, 1).data
    const v = [d[0], d[1], d[2], d[3] / 255]
    parsed.set(s, v)
    return v
  }
  const lum = ([r, g, b]) => {
    const f = (v) => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const ratio = (a, b) => {
    const x = lum(a)
    const y = lum(b)
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
  }
  const over = (fg, bg) => {
    const a = fg[3]
    return [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a), 1]
  }
  const cache = new Map()
  const root = parse(getComputedStyle(document.body).backgroundColor)
  const eff = (el) => {
    if (!el || el.nodeType !== 1 || el === document.documentElement) return root[3] ? root : [255, 255, 255, 1]
    if (cache.has(el)) return cache.get(el)
    const own = parse(getComputedStyle(el).backgroundColor)
    const p = eff(el.parentElement)
    const v = own[3] > 0 ? over(own, p) : p
    cache.set(el, v)
    return v
  }
  const describe = (el) => {
    const c = (typeof el.className === "string" ? el.className : el.getAttribute("class")) || ""
    return `${el.tagName.toLowerCase()} ${c}`.trim().slice(0, 240)
  }
  const weak = []
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el)
    if (cs.display === "none" || cs.visibility === "hidden") continue
    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) continue
    const sides = ["Top", "Right", "Bottom", "Left"]
      .map((s) => ({ w: parseFloat(cs[`border${s}Width`]), st: cs[`border${s}Style`], c: parse(cs[`border${s}Color`]) }))
      .filter((x) => x.w > 0 && x.st !== "none" && x.st !== "hidden")
    if (!sides.length || sides.some((x) => x.c[3] > 0)) continue
    if (parse(cs.backgroundColor)[3] === 0) continue
    const step = ratio(eff(el), eff(el.parentElement))
    if (step >= minStep) continue
    let a = el.parentElement
    while (a && parse(getComputedStyle(a).backgroundColor)[3] === 0) a = a.parentElement
    weak.push({ el: describe(el), parent: a ? describe(a) : "root", step: +step.toFixed(3) })
  }
  return weak
}

function parseArgs(argv) {
  const o = { baseUrl: null, start: false, port: 13131, concurrency: 4, settleMs: 400, only: [], out: join(ROOT, ".next", "surface-steps.json"), selfTest: false }
  for (const a of argv) {
    if (a === "--start") o.start = true
    else if (a === "--self-test") o.selfTest = true
    else if (a.startsWith("--base-url=")) o.baseUrl = a.slice(11).replace(/\/$/, "")
    else if (a.startsWith("--port=")) o.port = Number(a.slice(7))
    else if (a.startsWith("--concurrency=")) o.concurrency = Math.max(1, Number(a.slice(14)))
    else if (a.startsWith("--settle=")) o.settleMs = Number(a.slice(9))
    else if (a.startsWith("--only=")) o.only = a.slice(7).split(",").map((s) => s.trim()).filter(Boolean)
    else if (a.startsWith("--out=")) o.out = a.slice(6)
    else throw new Error(`${SCRIPT}: unknown argument ${a}`)
  }
  if (!o.selfTest && !o.start && !o.baseUrl) throw new Error(`${SCRIPT}: --start か --base-url=… のどちらかが要る`)
  return o
}

async function startServer(port) {
  if (!existsSync(join(ROOT, ".next", "BUILD_ID"))) throw new Error(`${SCRIPT}: .next が無い。先に npm run build`)
  const child = spawn(join(ROOT, "node_modules", ".bin", "next"), ["start", "-p", String(port)], { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" } })
  let log = ""
  child.stdout.on("data", (d) => (log += d))
  child.stderr.on("data", (d) => (log += d))
  const base = `http://127.0.0.1:${port}`
  for (let i = 0; i < 120; i++) {
    if (child.exitCode !== null) throw new Error(`${SCRIPT}: next start が落ちた\n${log}`)
    try {
      const res = await fetch(`${base}/robots.txt`)
      if (res.ok) return { base, stop: () => child.kill("SIGTERM") }
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  child.kill("SIGTERM")
  throw new Error(`${SCRIPT}: next start が 60 秒で上がらない\n${log}`)
}

// sitemap.xml の全 URL ＋ ビルドが持つ /embed/* の静的な経路（docs のプレビューの中身）
async function collectPaths(base) {
  const xml = await (await fetch(`${base}/sitemap.xml`)).text()
  const paths = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))
  const manifest = join(ROOT, ".next", "app-path-routes-manifest.json")
  if (existsSync(manifest)) {
    for (const route of Object.values(JSON.parse(readFileSync(manifest, "utf8")))) {
      if (route.startsWith("/embed/") && !route.includes("[")) paths.add(route)
    }
  }
  if (!paths.size) throw new Error(`${SCRIPT}: 測る URL が 0 本（sitemap.xml を読めていない）`)
  return [...paths].sort()
}

async function crawl(base, paths, { concurrency, settleMs }) {
  // protocolTimeout を短くする＝固まったタブで CDP の呼び出しが既定の 180 秒待たないように
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"], protocolTimeout: 30_000 })
  const results = []
  const errors = []
  let next = 0
  let done = 0
  async function openTab() {
    const page = await browser.newPage()
    page.on("dialog", (d) => d.dismiss().catch(() => {}))
    await page.setViewport(VIEWPORT)
    return { page, cdp: await page.createCDPSession() }
  }
  async function worker() {
    let tab = await openTab()
    while (next < paths.length) {
      const path = paths[next++]
      for (const theme of THEMES) {
        let lastError = null
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            await tab.cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }] })
            await tab.page.goto(base + path, { waitUntil: "load", timeout: 60_000 })
            await new Promise((r) => setTimeout(r, settleMs))
            for (const w of await tab.page.evaluate(probe, MIN_STEP)) results.push({ path, theme, ...w })
            lastError = null
            break
          } catch (e) {
            lastError = String(e).slice(0, 200)
            // ⚠️ 前のページで固まったタブを使い回すと、以降の試行が全部同じ理由で落ちる
            // （/docs/components/kbd で実際に起きた）。失敗したらタブを作り直す。
            await tab.page.close().catch(() => {})
            tab = await openTab()
          }
        }
        if (lastError) errors.push({ path, theme, error: lastError })
      }
      if (++done % 100 === 0) console.log(`${SCRIPT}: ${done} / ${paths.length}`)
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker))
  await browser.close()
  return { results, errors }
}

// 同じ部品の同じ入れ子を1行にまとめる（件数・テーマ・段差・例の URL）
function summarize(results) {
  const groups = new Map()
  for (const r of results) {
    const key = `${r.el}\n    parent: ${r.parent}`
    const g = groups.get(key) ?? { count: 0, themes: new Set(), steps: new Set(), paths: new Set() }
    g.count++
    g.themes.add(r.theme)
    g.steps.add(r.step)
    g.paths.add(r.path)
    groups.set(key, g)
  }
  return [...groups.entries()].sort((a, b) => b[1].count - a[1].count)
}

async function run(options) {
  const server = options.start ? await startServer(options.port) : { base: options.baseUrl, stop: () => {} }
  try {
    const paths = options.only.length ? options.only : await collectPaths(server.base)
    const started = Date.now()
    const { results, errors } = await crawl(server.base, paths, options)
    mkdirSync(dirname(options.out), { recursive: true })
    writeFileSync(options.out, JSON.stringify({ measuredAt: new Date().toISOString(), minStep: MIN_STEP, pages: paths.length, themes: THEMES, results, errors }, null, 1))
    const seconds = Math.round((Date.now() - started) / 1000)
    console.log(`${SCRIPT}: ${paths.length} ページ × ${THEMES.join(" / ")}（${seconds} 秒）→ 段差 ${MIN_STEP} 未満の「枠を透明にした面」${results.length} 件・読めなかったページ ${errors.length}`)
    console.log(`${SCRIPT}: 詳細 ${options.out}`)
    for (const [key, g] of summarize(results)) {
      console.log(`\n  ${g.count} 件 [${[...g.themes].join("/")}] 段差 ${[...g.steps].sort().join(", ")}\n    ${key}\n    例: ${[...g.paths].slice(0, 4).join(" ")}`)
    }
    for (const e of errors) console.log(`  読めなかった: ${e.path} [${e.theme}] ${e.error}`)
    if (results.length || errors.length) {
      console.error(`\n${SCRIPT}: failed — 面を親と ${MIN_STEP}:1 以上ずらす（直し方の型は scripts/audit-surface-steps.mjs の冒頭）`)
      process.exitCode = 1
    } else {
      console.log(`${SCRIPT}: ok`)
    }
  } finally {
    server.stop()
  }
}

// ── 自己テスト ────────────────────────────────────────────────────────────
// 実際のトークン（public/tokens.css）で面を塗り、#1029 で見つかった型そのものを
// 置く。1本目（Card の中の bg-card の行）は 342 件のうち最多の型で、落ちなければ
// この検査は役に立たない。
const SELF_TEST_CASES = [
  {
    name: "Card（bg-card）の中の bg-card の行＝#1029 の最多の型",
    html: `<div class="border border-transparent bg-card p-4"><button class="border border-transparent bg-card px-3 py-2">行</button></div>`,
    expect: { light: 1, dark: 1 },
  },
  {
    name: "同じ行を bg-background に沈める（直した形）",
    html: `<div class="border border-transparent bg-card p-4"><button class="border border-transparent bg-background px-3 py-2">行</button></div>`,
    expect: { light: 0, dark: 0 },
  },
  // #1034 で dark の --secondary を --muted から離した（1.000 → 1.245）。この型は
  // トークンで直ったので、両モード 0 件を期待する＝dark の --secondary を muted と
  // 同じ値に戻すと、ここが 1 件になって自己テストが落ちる（戻したことの見張り）。
  {
    name: "muted の列の上の secondary の Badge（#1034 で dark の --secondary を --muted から離した）",
    html: `<section class="border border-transparent bg-muted p-4"><span class="border border-transparent bg-secondary px-2">3</span></section>`,
    expect: { light: 0, dark: 0 },
  },
  {
    name: "地の上の半透明の面（bg-muted/20）＝重ねた色で比べる",
    html: `<div class="border border-transparent bg-muted-20 p-4">面</div>`,
    expect: { light: 1, dark: 1 },
  },
  {
    name: "枠が見えている同色の面は数えない（線で分かれている）",
    html: `<div class="border border-transparent bg-card p-4"><div class="border border-border bg-card p-2">箱</div></div>`,
    expect: { light: 0, dark: 0 },
  },
  {
    name: "塗りの無い枠だけの箱は数えない",
    html: `<div class="border border-transparent bg-card p-4"><div class="border border-transparent p-2">箱</div></div>`,
    expect: { light: 0, dark: 0 },
  },
]

function selfTestDocument(body, theme) {
  const tokens = readFileSync(join(ROOT, "public", "tokens.css"), "utf8")
  const utilities = `
    body { background: hsl(var(--background)); margin: 0; padding: 16px }
    .border { border-width: 1px; border-style: solid }
    .border-transparent { border-color: transparent }
    .border-border { border-color: hsl(var(--border)) }
    .bg-background { background-color: hsl(var(--background)) }
    .bg-card { background-color: hsl(var(--card)) }
    .bg-muted { background-color: hsl(var(--muted)) }
    .bg-muted-20 { background-color: hsl(var(--muted) / 0.2) }
    .bg-secondary { background-color: hsl(var(--secondary)) }
    .p-2 { padding: 8px } .p-4 { padding: 16px } .px-2 { padding: 0 8px } .px-3 { padding: 0 12px } .py-2 { padding-block: 8px }`
  return `<!doctype html><html class="${theme === "dark" ? "dark" : ""}"><head><style>${tokens}\n${utilities}</style></head><body>${body}</body></html>`
}

async function selfTest() {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] })
  const page = await browser.newPage()
  const failures = []
  for (const c of SELF_TEST_CASES) {
    for (const theme of THEMES) {
      await page.setContent(selfTestDocument(c.html, theme))
      const found = await page.evaluate(probe, MIN_STEP)
      const ok = found.length === c.expect[theme]
      console.log(`  ${ok ? "ok  " : "FAIL"} [${theme}] ${c.name}: 期待 ${c.expect[theme]} 件・実際 ${found.length} 件${found.length ? `（段差 ${found.map((f) => f.step).join(", ")}）` : ""}`)
      if (!ok) failures.push(`${c.name} [${theme}]`)
    }
  }
  await browser.close()
  if (failures.length) {
    console.error(`${SCRIPT}: self-test failed\n${failures.map((f) => `- ${f}`).join("\n")}`)
    process.exitCode = 1
  } else {
    console.log(`${SCRIPT}: self-test passed`)
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    const options = parseArgs(process.argv.slice(2))
    await (options.selfTest ? selfTest() : run(options))
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}
