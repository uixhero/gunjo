#!/usr/bin/env node

// デザイン言語の物差し＝原則 P1〜P7 を、描いた画面で判定する。
//
// 原則の言葉と合格の線は DESIGN.md の「Design Language（原則7本）」が正
// （KeEem 2026-10-07・new-4px DECISIONS.md）。ここはその判定の実装で、線を
// 変えるときは DESIGN.md と同じ PR で変える。
//
// 測る画面＝下の SCREENS の5つ × light / dark・1440×900（CDP の
// prefers-color-scheme）。5画面で 7/7 になったら、1.0 の条件（#1040）の
// 「見た目」は完成。
//
// ⚠️ 字面ではなく画面を測る理由：角丸・影・数字の組み方は、部品を組んだ結果の
// DOM にしか出ない（トークンを直しても、値を直書きした部品は残る）。
//
// 使い方:
//   node scripts/check-design-language.mjs --start          # .next を next start して測る（報告だけ）
//   node scripts/check-design-language.mjs --start --strict # 7/7 でなければ落とす
//   node scripts/check-design-language.mjs --base-url=http://127.0.0.1:13030
//   node scripts/check-design-language.mjs --self-test      # 検出器そのものの自己テスト
// 先に `npm run build` が要る（--start のとき）。
// ⛔ 本番（www.gunjo.jp）には向けない：10回続けて読み込む＝Vercel の Checkpoint で 403 になる。

import { spawn } from "node:child_process"
import { createServer } from "node:net"
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import puppeteer from "puppeteer"

const ROOT = fileURLToPath(new URL("..", import.meta.url))
const SCRIPT = "check-design-language"
const THEMES = ["light", "dark"]
const VIEWPORT = { width: 1440, height: 900 }

export const SCREENS = [
  ["top", "/"],
  ["docs", "/docs/introduction"],
  ["data-table", "/docs/components/data-table"],
  ["showcase", "/showcase"],
  ["dashboard", "/patterns/dashboard/overview"],
]

// ── 合格の線（DESIGN.md「Design Language」と同じ値） ──
// P1：DESIGN.md に書かれた群青（#4D5AAF）
export const DECLARED_GUNJO = { h: 232, s: 39, l: 49 }
const P1_TOLERANCE = { h: 2, s: 3, l: 3 }
const P3_MIN_DELTA_E = 3
const P4_MIN_LINE_HEIGHT = 1.7
const P6_MAX_KINDS = 2
const P7_MIN_RATIO = 0.95

// P3 の比べる相手＝既製の中立色（Tailwind v3 slate の全段＋shadcn v3 slate／v4 neutral・slate。純白・純黒は除く）
const READY_MADE = {
  "slate-50": [248, 250, 252], "slate-100": [241, 245, 249], "slate-200": [226, 232, 240], "slate-300": [203, 213, 225],
  "slate-400": [148, 163, 184], "slate-500": [100, 116, 139], "slate-600": [71, 85, 105], "slate-700": [51, 65, 85],
  "slate-800": [30, 41, 59], "slate-900": [15, 23, 42], "slate-950": [2, 6, 23],
  "shadcn-v3-slate dark bg": [2, 8, 23], "shadcn-v4 neutral fg": [10, 10, 10], "shadcn-v4 neutral muted": [245, 245, 245],
  "shadcn-v4 neutral muted-fg": [115, 115, 115], "shadcn-v4 neutral border": [229, 229, 229], "shadcn-v4 neutral dark muted": [38, 38, 38],
  "shadcn-v4 neutral dark muted-fg": [161, 161, 161], "shadcn-v4 neutral fg dark": [250, 250, 250],
  "shadcn-v4 slate muted-fg": [98, 116, 142], "shadcn-v4 slate dark bg": [2, 6, 24], "shadcn-v4 slate dark muted": [29, 41, 61],
  "shadcn-v4 slate dark muted-fg": [144, 161, 185],
}
const NEUTRALS = ["--background", "--foreground", "--muted", "--muted-foreground", "--border"]

// ── 色差（sRGB → Lab → CIEDE2000） ──
const lin = (v) => {
  v /= 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}
function lab([r, g, b]) {
  const [R, G, B] = [lin(r), lin(g), lin(b)]
  const X = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047
  const Y = 0.2126 * R + 0.7152 * G + 0.0722 * B
  const Z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116)
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))]
}
export function deltaE2000(c1, c2) {
  const [L1, a1, b1] = lab(c1)
  const [L2, a2, b2] = lab(c2)
  const rad = Math.PI / 180
  const C1 = Math.hypot(a1, b1)
  const C2 = Math.hypot(a2, b2)
  const Cb = (C1 + C2) / 2
  const G = 0.5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)))
  const a1p = (1 + G) * a1
  const a2p = (1 + G) * a2
  const C1p = Math.hypot(a1p, b1)
  const C2p = Math.hypot(a2p, b2)
  const hue = (a, b) => {
    const x = Math.atan2(b, a) / rad
    return x < 0 ? x + 360 : x
  }
  const h1p = hue(a1p, b1)
  const h2p = hue(a2p, b2)
  const dLp = L2 - L1
  const dCp = C2p - C1p
  let dhp = C1p * C2p === 0 ? 0 : h2p - h1p
  if (dhp > 180) dhp -= 360
  else if (dhp < -180) dhp += 360
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp / 2) * rad)
  const Lbp = (L1 + L2) / 2
  const Cbp = (C1p + C2p) / 2
  let hbp = h1p + h2p
  if (C1p * C2p !== 0) {
    hbp = Math.abs(h1p - h2p) > 180 ? (h1p + h2p + 360) / 2 : (h1p + h2p) / 2
    if (hbp >= 360) hbp -= 360
  }
  const T = 1 - 0.17 * Math.cos((hbp - 30) * rad) + 0.24 * Math.cos(2 * hbp * rad) + 0.32 * Math.cos((3 * hbp + 6) * rad) - 0.2 * Math.cos((4 * hbp - 63) * rad)
  const dTh = 30 * Math.exp(-(((hbp - 275) / 25) ** 2))
  const Rc = 2 * Math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7))
  const Sl = 1 + (0.015 * (Lbp - 50) ** 2) / Math.sqrt(20 + (Lbp - 50) ** 2)
  const Sc = 1 + 0.045 * Cbp
  const Sh = 1 + 0.015 * Cbp * T
  const Rt = -Math.sin(2 * dTh * rad) * Rc
  return Math.sqrt((dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh))
}
const nearestReadyMade = (rgb) =>
  Object.entries(READY_MADE)
    .map(([name, ref]) => ({ ref: name, de: deltaE2000(rgb, ref) }))
    .sort((a, b) => a.de - b.de)[0]

// ⛔ この関数はブラウザの中で動く（page.evaluate に渡す）。外の変数を参照しないこと。
function probe() {
  const cv = document.createElement("canvas")
  cv.width = cv.height = 1
  const cx = cv.getContext("2d", { willReadFrequently: true })
  // computed の色は oklab / color() でも返るので、canvas に塗って sRGB で読み直す
  const rgba = (s) => {
    cx.clearRect(0, 0, 1, 1)
    cx.fillStyle = "rgba(0,0,0,0)"
    cx.fillStyle = s
    cx.fillRect(0, 0, 1, 1)
    const d = cx.getImageData(0, 0, 1, 1).data
    return [d[0], d[1], d[2], d[3] / 255]
  }
  const vis = (el) => {
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    return cs.display !== "none" && cs.visibility !== "hidden" && r.width > 0 && r.height > 0
  }
  const ownText = (el) => [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim()
  const all = [...document.querySelectorAll("body *")].filter(vis)

  // トークンの実効色（P1・P3）
  const tok = {}
  const d = document.createElement("div")
  document.body.appendChild(d)
  for (const k of ["--background", "--foreground", "--muted", "--muted-foreground", "--border", "--primary"]) {
    d.style.color = `hsl(var(${k}))`
    tok[k] = rgba(getComputedStyle(d).color).slice(0, 3)
  }
  d.remove()
  const primaryRaw = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim()

  // P1 の「画面に出ている」：群青そのもの（±2）で塗られた要素の数
  const near = (a, b) => a[3] > 0.5 && Math.abs(a[0] - b[0]) <= 2 && Math.abs(a[1] - b[1]) <= 2 && Math.abs(a[2] - b[2]) <= 2
  let primaryOnScreen = 0
  for (const el of all) {
    const cs = getComputedStyle(el)
    const paints = [cs.backgroundColor, cs.borderTopColor, cs.fill, cs.stroke]
    if (ownText(el)) paints.push(cs.color)
    if (paints.some((p) => p && p !== "none" && !p.startsWith("url(") && near(rgba(p), tok["--primary"]))) primaryOnScreen++
  }

  // P2：1画面目（サイトのヘッダー＝最初の header と、サイトのフッター＝最後の footer を除く）に出自があるか
  const siteHeader = document.querySelector("header")
  const footers = document.querySelectorAll("footer")
  const siteFooter = footers[footers.length - 1]
  const kinds = new Set()
  for (const el of all) {
    if ((siteHeader && siteHeader.contains(el)) || (siteFooter && siteFooter.contains(el))) continue
    const r = el.getBoundingClientRect()
    if (!(r.top < innerHeight && r.bottom > 0)) continue
    const cs = getComputedStyle(el)
    const own = ownText(el)
    if (own && /Shippori|Mincho|明朝/i.test(cs.fontFamily)) kinds.add("明朝")
    if (/renew\/|bg001/.test(cs.backgroundImage)) kinds.add("写真")
    if (/title_[vh]/.test(`${cs.backgroundImage} ${cs.maskImage || ""} ${cs.webkitMaskImage || ""}`)) kinds.add("群青の字")
    if (el.tagName === "IMG" && /renew\/|title_[vh]/.test(el.getAttribute("src") || "")) kinds.add("群青の字")
    if (/群青|なりつつ|Becoming/i.test(own)) kinds.add("群青の言葉")
  }

  // P4：本文の書体の並びに和文の書体があるか・和文20字以上の段落の行送り÷字の大きさ
  // next/font は書体名を「__Noto_Sans_JP_xxxx」に書き換えるので、空白と _ の両方を許す
  const bodyFont = getComputedStyle(document.body).fontFamily
  const jpFont = /Hiragino|Noto[ _]Sans[ _]JP|Noto[ _]Serif[ _]JP|BIZ[ _]UD|Yu[ _]?Gothic|Meiryo|Zen[ _]|M[ _]PLUS|Shippori|Mincho/i.test(bodyFont)
  const lineRatio = (p) => {
    const cs = getComputedStyle(p)
    const fs = parseFloat(cs.fontSize)
    if (cs.lineHeight !== "normal") return parseFloat(cs.lineHeight) / fs
    // normal は書体まかせ＝同じ字で1行の高さを測る（normal を除外すると、指定の無い段落が判定から抜ける）
    const s = document.createElement("span")
    s.textContent = "あ"
    s.style.cssText = `font:${cs.font};line-height:normal;display:inline-block;position:absolute;visibility:hidden`
    document.body.appendChild(s)
    const h = s.getBoundingClientRect().height
    s.remove()
    return h / fs
  }
  const ratios = [...document.querySelectorAll("p")]
    .filter((p) => vis(p) && (p.textContent.match(/[぀-ヿ一-鿿]/g) || []).length >= 20)
    .map(lineRatio)
    .filter((x) => Number.isFinite(x))
    .sort((a, b) => a - b)
  const lhMedian = ratios.length ? ratios[Math.floor(ratios.length / 2)] : null

  // P5：浮かない要素に付いた影（浮くものの中と、フォーカスの輪＝ぼかし0・ずれ0 は除く）
  const FLOAT = "[role=dialog],[role=alertdialog],[role=menu],[role=listbox],[role=tooltip],[data-radix-popper-content-wrapper]"
  const COLOR = /rgba?\([^)]*\)|oklab\([^)]*\)|oklch\([^)]*\)|hsla?\([^)]*\)|color\([^)]*\)/
  const shadowed = []
  for (const el of all) {
    const bs = getComputedStyle(el).boxShadow
    if (bs === "none" || el.closest(FLOAT)) continue
    const real = bs.split(/,(?![^(]*\))/).some((layer) => {
      const col = layer.match(COLOR)
      if (col && rgba(col[0])[3] === 0) return false
      const [x = 0, y = 0, blur = 0] = (layer.replace(COLOR, "").match(/-?[\d.]+px/g) || []).map(parseFloat)
      return blur > 0 || x !== 0 || y !== 0
    })
    if (real) shadowed.push(`${el.tagName.toLowerCase()}.${String(el.className).split(/\s+/).slice(0, 6).join(".")}`)
  }

  // P6：角丸の種類（4隅とも。0 と丸＝999px 以上・幅の半分以上の % は除く）
  const radii = new Map()
  for (const el of all) {
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    for (const corner of ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"]) {
      const raw = cs[corner].split(" ")[0]
      if (raw.endsWith("%")) {
        const pct = parseFloat(raw)
        if (pct <= 0 || pct >= 50) continue
        const px = Math.round((pct / 100) * Math.min(r.width, r.height) * 10) / 10
        if (px > 0) radii.set(px, radii.get(px) ?? `${el.tagName.toLowerCase()}.${String(el.className).split(/\s+/).slice(0, 6).join(".")}`)
        continue
      }
      const v = parseFloat(raw)
      if (!(v > 0 && v < 999)) continue
      const key = Math.round(v * 10) / 10
      if (!radii.has(key)) radii.set(key, `${el.tagName.toLowerCase()}.${String(el.className).split(/\s+/).slice(0, 6).join(".")}`)
    }
  }

  // P7：数字だけの文字列のうち、等幅数字（tabular-nums）が効いている割合
  let num = 0
  let tab = 0
  const proportional = []
  for (const el of all) {
    const own = ownText(el)
    if (!own || !/\d.*\d/.test(own) || !/^[\d,.\s%+\-−/:¥$円件個人]+$/.test(own)) continue
    num++
    if (/tabular-nums/.test(getComputedStyle(el).fontVariantNumeric)) tab++
    else if (proportional.length < 12) proportional.push(`${el.tagName.toLowerCase()}「${own.slice(0, 20)}」`)
  }

  return {
    tok, primaryRaw, primaryOnScreen, kinds: [...kinds], bodyFont, jpFont, lhMedian, paraCount: ratios.length,
    shadowed, radii: [...radii.entries()].sort((a, b) => a[0] - b[0]), num, tab, proportional,
  }
}

// 1画面×1テーマの測定を、原則ごとの値にする
function measure(m, theme) {
  const hsl = m.primaryRaw.split(/\s+/).map(parseFloat)
  return {
    ...m,
    P1value: theme === "dark" ? null
      : Math.abs(hsl[0] - DECLARED_GUNJO.h) <= P1_TOLERANCE.h && Math.abs(hsl[1] - DECLARED_GUNJO.s) <= P1_TOLERANCE.s && Math.abs(hsl[2] - DECLARED_GUNJO.l) <= P1_TOLERANCE.l,
    P3: Object.fromEntries(NEUTRALS.map((k) => {
      const { ref, de } = nearestReadyMade(m.tok[k])
      return [k, { ref, de: +de.toFixed(2) }]
    })),
  }
}

// 全部の行（画面×テーマ）から、原則ごとの合否を出す
export function judge(rows) {
  const light = rows.filter((r) => r.theme === "light")
  const names = [...new Set(rows.map((r) => r.name))]
  const p3 = rows.flatMap((r) => Object.entries(r.P3).map(([k, x]) => ({ label: `${r.theme} ${k}`, ...x })))
  const p3Unique = [...new Map(p3.map((x) => [x.label, x])).values()].sort((a, b) => a.de - b.de)
  const minDe = Math.min(...p3Unique.map((x) => x.de))
  const lhs = rows.filter((r) => r.lhMedian != null)
  const radii = new Map()
  for (const r of rows) for (const [v, where] of r.radii) if (!radii.has(v)) radii.set(v, `${r.name}/${r.theme} ${where}`)
  const num = light.reduce((a, r) => a + r.num, 0)
  const tab = light.reduce((a, r) => a + r.tab, 0)
  return {
    P1: {
      pass: light.every((r) => r.P1value && r.primaryOnScreen > 0),
      detail: `--primary ${[...new Set(light.map((r) => r.primaryRaw))].join(" / ")}（基準 ${DECLARED_GUNJO.h} ${DECLARED_GUNJO.s}% ${DECLARED_GUNJO.l}%）・群青で塗られた要素 ${light.map((r) => `${r.name} ${r.primaryOnScreen}`).join("・")}`,
    },
    P2: {
      pass: names.every((n) => rows.filter((r) => r.name === n).every((r) => r.kinds.length >= 1)),
      detail: names.map((n) => `${n} ${rows.find((r) => r.name === n && r.theme === "light")?.kinds.join("/") || "なし"}`).join("・"),
    },
    P3: {
      pass: minDe >= P3_MIN_DELTA_E,
      detail: `最小 ΔE ${minDe.toFixed(2)}（近い順：${p3Unique.slice(0, 3).map((x) => `${x.label}→${x.ref} ${x.de}`).join("、")}）`,
    },
    P4: {
      pass: rows.every((r) => r.jpFont) && lhs.every((r) => r.lhMedian >= P4_MIN_LINE_HEIGHT),
      detail: `和文の書体の明示 ${rows.every((r) => r.jpFont) ? "あり" : `なし（${rows.filter((r) => !r.jpFont).map((r) => `${r.name}/${r.theme}`).join("・")}）`}・段落の行送り ${lhs.filter((r) => r.theme === "light").map((r) => `${r.name} ${r.lhMedian.toFixed(2)}`).join("・")}`,
    },
    P5: {
      pass: rows.every((r) => r.shadowed.length === 0),
      detail: rows.map((r) => `${r.name}/${r.theme} ${r.shadowed.length}`).join("・"),
      examples: [...new Set(rows.flatMap((r) => r.shadowed.map((s) => `${r.name}/${r.theme} ${s}`)))].slice(0, 10),
    },
    P6: {
      pass: radii.size <= P6_MAX_KINDS,
      detail: `${radii.size}種（${[...radii.keys()].sort((a, b) => a - b).map((v) => `${v}px`).join("・") || "なし"}）`,
      examples: [...radii.entries()].sort((a, b) => a[0] - b[0]).map(([v, where]) => `${v}px ${where}`),
    },
    P7: {
      pass: num > 0 && tab / num >= P7_MIN_RATIO,
      detail: `${tab} / ${num}（${num ? Math.round((tab / num) * 100) : 0}%）`,
      examples: light.flatMap((r) => r.proportional.map((p) => `${r.name} ${p}`)).slice(0, 10),
    },
  }
}

function parseArgs(argv) {
  const o = { baseUrl: null, start: false, port: 13171, settleMs: 2000, strict: false, out: join(ROOT, ".next", "design-language.json"), selfTest: false }
  for (const a of argv) {
    if (a === "--start") o.start = true
    else if (a === "--strict") o.strict = true
    else if (a === "--self-test") o.selfTest = true
    else if (a.startsWith("--base-url=")) o.baseUrl = a.slice(11).replace(/\/$/, "")
    else if (a.startsWith("--port=")) o.port = Number(a.slice(7))
    else if (a.startsWith("--settle=")) o.settleMs = Number(a.slice(9))
    else if (a.startsWith("--out=")) o.out = a.slice(6)
    else throw new Error(`${SCRIPT}: unknown argument ${a}`)
  }
  if (!o.selfTest && !o.start && !o.baseUrl) throw new Error(`${SCRIPT}: --start か --base-url=… のどちらかが要る`)
  return o
}

// ⚠️ 他のセッションのサーバーが同じポートにいると、自分の next start は EADDRINUSE で
// 落ちるのに、robots.txt は相手が返すので「上がった」と読めてしまう（実際に別の
// ビルドを測った）。起動の前に、ポートが空いていることを確かめる。
const portIsFree = (port) =>
  new Promise((resolve) => {
    const probeServer = createServer()
    probeServer.once("error", () => resolve(false))
    probeServer.once("listening", () => probeServer.close(() => resolve(true)))
    probeServer.listen(port)
  })

async function startServer(port) {
  if (!existsSync(join(ROOT, ".next", "BUILD_ID"))) throw new Error(`${SCRIPT}: .next が無い。先に npm run build`)
  if (!(await portIsFree(port))) throw new Error(`${SCRIPT}: ポート ${port} は使用中（別のサーバーを測ってしまうので止める）。--port=… で空いているポートを指定する`)
  const child = spawn(join(ROOT, "node_modules", ".bin", "next"), ["start", "-p", String(port)], { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" } })
  let log = ""
  child.stdout.on("data", (d) => (log += d))
  child.stderr.on("data", (d) => (log += d))
  const base = `http://127.0.0.1:${port}`
  for (let i = 0; i < 120; i++) {
    if (child.exitCode !== null) throw new Error(`${SCRIPT}: next start が落ちた\n${log}`)
    try {
      const res = await fetch(`${base}/robots.txt`)
      if (res.ok) return { base, stop: () => child.kill("SIGTERM"), log: () => log }
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  child.kill("SIGTERM")
  throw new Error(`${SCRIPT}: next start が 60 秒で上がらない\n${log}`)
}

async function crawl(base, { settleMs }) {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"], protocolTimeout: 60_000 })
  const rows = []
  const errors = []
  try {
    for (const theme of THEMES) {
      for (const [name, path] of SCREENS) {
        let lastError = null
        for (let attempt = 0; attempt < 3; attempt++) {
          const page = await browser.newPage()
          try {
            await page.setViewport(VIEWPORT)
            const cdp = await page.createCDPSession()
            await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }] })
            const res = await page.goto(base + path, { waitUntil: "load", timeout: 120_000 })
            if (!res || res.status() >= 400) throw new Error(`HTTP ${res?.status()}`)
            await new Promise((r) => setTimeout(r, settleMs))
            rows.push({ name, path, theme, ...measure(await page.evaluate(probe), theme) })
            lastError = null
            break
          } catch (e) {
            lastError = String(e).slice(0, 200)
          } finally {
            await page.close().catch(() => {})
          }
        }
        if (lastError) errors.push({ name, path, theme, error: lastError })
      }
    }
  } finally {
    await browser.close()
  }
  return { rows, errors }
}

const PRINCIPLES = {
  P1: "群青は一つの値で、それが画面に出ている",
  P2: "どの画面の1画面目にも、群青の出自が1つ以上見える",
  P3: "中立色10色が既製の色と ΔE2000 3 以上離れている",
  P4: "和文を前提に組む（和文の書体を明示・段落の行送り 1.7 以上）",
  P5: "影は浮くものだけ（それ以外の影 0）",
  P6: "角丸は2種類まで（0 と丸を除く）",
  P7: "数字だけの文字列の 95% 以上が tabular-nums",
}

function report(verdict, errors, strict) {
  const passed = Object.values(verdict).filter((v) => v.pass).length
  const lines = [`${SCRIPT}: ${passed} / 7（${SCREENS.length} 画面 × ${THEMES.join(" / ")}）${strict ? "" : "・報告だけ（--strict で落とす）"}`]
  for (const [k, v] of Object.entries(verdict)) {
    lines.push(`  ${v.pass ? "✅" : "❌"} ${k} ${PRINCIPLES[k]}\n      ${v.detail}`)
    if (!v.pass && v.examples?.length) lines.push(...v.examples.map((e) => `        - ${e}`))
  }
  for (const e of errors) lines.push(`  読めなかった: ${e.path} [${e.theme}] ${e.error}`)
  console.log(lines.join("\n"))
  if (process.env.GITHUB_STEP_SUMMARY) {
    const md = [
      `### デザイン言語の原則：${passed} / 7${strict ? "" : "（報告だけ）"}`,
      "",
      "| | 原則 | 判定 | 実測 |",
      "|---|---|---|---|",
      ...Object.entries(verdict).map(([k, v]) => `| ${k} | ${PRINCIPLES[k]} | ${v.pass ? "✅" : "❌"} | ${v.detail.replace(/\|/g, "／")} |`),
      ...(errors.length ? ["", ...errors.map((e) => `- 読めなかった: \`${e.path}\` [${e.theme}] ${e.error}`)] : []),
      "",
    ]
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, md.join("\n"))
  }
  return passed
}

async function run(options) {
  const server = options.start ? await startServer(options.port) : { base: options.baseUrl, stop: () => {} }
  try {
    const { rows, errors } = await crawl(server.base, options)
    // 読めなかった画面があると判定そのものが成り立たない＝報告だけのときも落とす
    if (errors.length || rows.length !== SCREENS.length * THEMES.length) {
      for (const e of errors) console.error(`  読めなかった: ${e.path} [${e.theme}] ${e.error}`)
      if (server.log) console.error(`--- next start の出力（末尾） ---\n${server.log().slice(-4000)}`)
      throw new Error(`${SCRIPT}: ${SCREENS.length * THEMES.length} 回のうち ${rows.length} 回しか測れなかった`)
    }
    const verdict = judge(rows)
    mkdirSync(dirname(options.out), { recursive: true })
    writeFileSync(options.out, JSON.stringify({ measuredAt: new Date().toISOString(), base: server.base, verdict, rows }, null, 1))
    const passed = report(verdict, errors, options.strict)
    console.log(`${SCRIPT}: 詳細 ${options.out}`)
    if (options.strict && passed < 7) {
      console.error(`${SCRIPT}: failed — 原則 ${7 - passed} 本を満たしていない（線は DESIGN.md「Design Language」）`)
      process.exitCode = 1
    }
  } finally {
    server.stop()
  }
}

// ── 自己テスト ────────────────────────────────────────────────────────────
// 原則ごとに「落ちる形」と「通る形」を1つずつ置く。落ちる側の1本目は、
// 2026-10-06 の実測で GunjoUI に実際にあった値にする（落ちなければ、この
// 物差しはいまの画面を見逃す）。⭐ P5・P6 は、材料の段階で「通る側」を一度も
// 見ていなかった＝ここで両側を確かめる。
const GUNJO = "232 39% 49%"
const BASE_VARS = `--background: 44 42% 90%; --foreground: 228 30% 11%; --muted: 42 23% 83.5%; --muted-foreground: 30 8% 33%; --border: 40 18% 79.7%; --primary: ${GUNJO};`
const SLATE_VARS = "--background: 210 40% 96%; --foreground: 222.2 84% 4.9%; --muted: 217.2 32.6% 17.5%; --muted-foreground: 215 20.2% 65.1%; --border: 214.3 31.8% 91.4%; --primary: 220 62% 49%;"
const JA = "群青は、まだ青ではなく、青になりつつある色の名前として使っています。"
const SELF_TEST_CASES = [
  {
    principle: "P1",
    name: "2026-10-06 の --primary（220 62% 49%）は落ちる",
    vars: BASE_VARS.replace(GUNJO, "220 62% 49%"),
    html: `<a style="color:hsl(var(--primary))">リンク</a>`,
    expect: (m) => m.P1value === false,
  },
  {
    principle: "P1",
    name: "値が合っていても、群青で塗られた要素が無ければ落ちる",
    vars: BASE_VARS,
    html: `<p>群青の無い画面</p>`,
    expect: (m) => m.P1value === true && m.primaryOnScreen === 0,
  },
  {
    principle: "P1",
    name: "232 39% 49% で塗られた要素がある（通る）",
    vars: BASE_VARS,
    html: `<a style="color:hsl(var(--primary))">リンク</a>`,
    expect: (m) => m.P1value === true && m.primaryOnScreen === 1,
  },
  {
    principle: "P2",
    name: "1画面目に出自が無い（docs の 2026-10-06 の形）",
    vars: BASE_VARS,
    html: `<header>GunjoUI 群青</header><main><h1 style="font-family:Inter,sans-serif">Introduction</h1></main><footer>Becoming blue.</footer>`,
    expect: (m) => m.kinds.length === 0,
  },
  {
    principle: "P2",
    name: "明朝の見出し（通る）・1画面目より下の言葉は数えない",
    vars: BASE_VARS,
    html: `<header>x</header><main><h1 style="font-family:'Shippori Mincho',serif">はじめに</h1><div style="height:2000px"></div><p>群青</p></main><footer>x</footer>`,
    expect: (m) => m.kinds.join() === "明朝",
  },
  {
    principle: "P3",
    name: "light の地が slate-100（2026-10-06 の形）は落ちる",
    vars: SLATE_VARS,
    html: `<p>x</p>`,
    expect: (m) => Object.values(m.P3).some((x) => x.de < P3_MIN_DELTA_E),
  },
  {
    principle: "P3",
    name: "鳥の子の地と墨の文字（通る）",
    vars: BASE_VARS,
    html: `<p>x</p>`,
    expect: (m) => Object.values(m.P3).every((x) => x.de >= P3_MIN_DELTA_E),
  },
  {
    principle: "P4",
    name: "和文の書体の指定なし・行送り 20/14（text-sm の既定）は落ちる",
    vars: BASE_VARS,
    bodyFont: "Inter, sans-serif",
    html: `<p style="font-size:14px;line-height:20px">${JA}</p>`,
    expect: (m) => !m.jpFont && m.lhMedian < P4_MIN_LINE_HEIGHT,
  },
  {
    principle: "P4",
    name: "行送りの指定が無い段落（normal）も測る＝落ちる",
    vars: BASE_VARS,
    bodyFont: "Inter, 'Hiragino Sans', sans-serif",
    html: `<p style="font-size:14px;line-height:normal">${JA}</p>`,
    expect: (m) => m.jpFont && m.lhMedian != null && m.lhMedian < P4_MIN_LINE_HEIGHT,
  },
  {
    principle: "P4",
    name: "next/font の名前（__Noto_Sans_JP_…）を和文の書体と読む・行送り 1.9（通る）",
    vars: BASE_VARS,
    bodyFont: "__Inter_abc, '__Noto_Sans_JP_def', sans-serif",
    html: `<p style="font-size:14px;line-height:1.9">${JA}</p><p style="font-size:14px;line-height:1">短い文</p>`,
    expect: (m) => m.jpFont && Math.abs(m.lhMedian - 1.9) < 0.01 && m.paraCount === 1,
  },
  {
    principle: "P5",
    name: "カードの影（2026-10-06 最多の 0 1px 2px）は落ちる",
    vars: BASE_VARS,
    html: `<div style="box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05)">カード</div>`,
    expect: (m) => m.shadowed.length === 1,
  },
  {
    principle: "P5",
    name: "浮くもの（dialog・menu・tooltip）の影・フォーカスの輪・透明な影は数えない（通る）",
    vars: BASE_VARS,
    html: `<div role="dialog" style="box-shadow:0 8px 24px rgb(0 0 0 / .2)"><div style="box-shadow:0 1px 2px #000">中</div></div><div role="menu" style="box-shadow:0 4px 8px #000">m</div><div role="tooltip" style="box-shadow:0 2px 4px #000">t</div><button style="box-shadow:0 0 0 2px hsl(232 39% 49%)">輪</button><div style="box-shadow:0 1px 2px rgb(0 0 0 / 0)">透明</div>`,
    expect: (m) => m.shadowed.length === 0,
  },
  {
    principle: "P6",
    name: "2026-10-06 の6種（3・4・6・8・12・16px）は落ちる",
    vars: BASE_VARS,
    html: [3, 4, 6, 8, 12, 16].map((v) => `<div style="border-radius:${v}px">r</div>`).join(""),
    expect: (m) => m.radii.length === 6,
  },
  {
    principle: "P6",
    name: "片側だけの角丸も数える（左上だけを見ると逃げる）",
    vars: BASE_VARS,
    html: `<div style="border-radius:0 6px 6px 0">r</div>`,
    expect: (m) => m.radii.length === 1 && m.radii[0][0] === 6,
  },
  {
    principle: "P6",
    name: "2px と 4px と 0・丸・50%（円）だけ（通る）",
    vars: BASE_VARS,
    html: `<div style="border-radius:2px">a</div><div style="border-radius:4px">b</div><div style="border-radius:0">c</div><div style="border-radius:9999px">d</div><div style="width:20px;height:20px;border-radius:50%">e</div>`,
    expect: (m) => m.radii.map(([v]) => v).join() === "2,4",
  },
  {
    principle: "P7",
    name: "比例数字の「129 / 223」は等幅に数えない",
    vars: BASE_VARS,
    html: `<span>129 / 223</span><span style="font-variant-numeric:tabular-nums">2026-05-26</span><span>件数</span>`,
    expect: (m) => m.num === 2 && m.tab === 1,
  },
]

function selfTestDocument(c) {
  return `<!doctype html><html><head><style>:root{${c.vars}} body{margin:0;font-family:${c.bodyFont ?? "Inter, 'Hiragino Sans', sans-serif"}}</style></head><body>${c.html}</body></html>`
}

async function selfTest() {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] })
  const page = await browser.newPage()
  await page.setViewport(VIEWPORT)
  const failures = []
  for (const c of SELF_TEST_CASES) {
    await page.setContent(selfTestDocument(c))
    const m = measure(await page.evaluate(probe), "light")
    const ok = c.expect(m)
    const seen = { P1: `${m.primaryRaw}・塗り ${m.primaryOnScreen}`, P2: m.kinds.join("/") || "なし", P3: Object.values(m.P3).map((x) => x.de).join("・"), P4: `${m.jpFont ? "和文あり" : "和文なし"}・${m.lhMedian?.toFixed(2)}`, P5: `${m.shadowed.length} 件`, P6: m.radii.map(([v]) => `${v}px`).join("・") || "なし", P7: `${m.tab}/${m.num}` }[c.principle]
    console.log(`  ${ok ? "ok  " : "FAIL"} ${c.principle} ${c.name}（実測 ${seen}）`)
    if (!ok) failures.push(`${c.principle} ${c.name}`)
  }
  await browser.close()
  if (failures.length) {
    console.error(`${SCRIPT}: self-test failed\n${failures.map((f) => `- ${f}`).join("\n")}`)
    process.exitCode = 1
  } else {
    console.log(`${SCRIPT}: self-test passed（${SELF_TEST_CASES.length} 本）`)
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
