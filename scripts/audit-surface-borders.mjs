#!/usr/bin/env node

// 「塗り（bg-*）があるのに枠（border）も持っている箇所」を数える検査。
//
// KeEem の決定（new-4px DECISIONS.md 2026-09-22、2026-09-22 の訂正を含む）:
// 1px の枠線をやめて面の濃淡で区切る。面の段差は見える大きさまで上げ、
// ハイコントラスト（prefers-contrast: more / forced-colors: active）では枠線に
// 戻す。ライト・ダークの両方が対象。
//
// 部品は3つの箱に分かれる:
//   A. 塗りのある面 → 枠をやめて面で区切る（この検査が数える対象）
//   B. 塗りの無いもの＝枠が意味そのもの → 枠は残す（除外ポリシーに理由つきで登録）
//   C. A で外した枠は、ハイコントラストで戻す（`contrast-more:` / `forced-colors:`
//      を付けた枠は「戻す枠」なので、通常状態の枠としては数えない）
//
// 2026-09-23（第2段）から門番になった。src/components/** の残りは 0 件で、
// verifySurfaceBorders（design:verify に入っている）が 0 を超えたら落とす。
// つまり「塗りのある面に枠を足す」変更は、除外ポリシーに理由を書かない限り
// CI で止まる。件数だけ数えたいときは --max-remaining に数を渡す。

import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join, relative } from "node:path"
import { ROOT } from "./design-sync/shared.mjs"
import { runVerificationCli, throwLinesError } from "./design-verify-assertions.mjs"

const TARGET_PATH = "src/components"
const EXCLUSION_POLICY_PATH = "design/policy/surface-border-exclusions.json"
const REPORT_PATH = "docs/surface-border-audit.md"

// ---------------------------------------------------------------------------
// クラス名の読み取り
// ---------------------------------------------------------------------------

// `bg-*` のうち色ではないもの（位置・繰り返し・切り抜き・グラデーションの向き）。
// これらは「塗り」ではないので fill として数えない。
const NON_COLOR_BG = new Set([
  "fixed", "local", "scroll", "auto", "cover", "contain", "none",
  "bottom", "center", "left", "right", "top",
  "repeat", "no-repeat", "repeat-x", "repeat-y", "repeat-round", "repeat-space",
])
const NON_COLOR_BG_PREFIXES = ["clip-", "origin-", "blend-", "gradient-", "linear-", "radial", "conic"]
// 色として書かれていても面にならないもの。
const NON_FILL_COLORS = new Set(["transparent", "inherit", "current"])

const SIDE_KEYS = ["top", "right", "bottom", "left"]
// `border-x` のような側面キーワード → 実際に幅が付く側。
const SIDE_GROUPS = {
  t: ["top"], r: ["right"], b: ["bottom"], l: ["left"],
  x: ["left", "right"], y: ["top", "bottom"],
  s: ["left"], e: ["right"],
}

const WIDTH_VALUE = /^(?:[0-9]+|\[[^\]]*\])$/

function tokenize(classString) {
  return classString.split(/\s+/).filter(Boolean)
}

/**
 * 修飾子（`hover:` `md:` `dark:` など）を外して素のクラス名を返す。
 * 返り値の `variants` は付いていた修飾子の配列。
 */
function splitVariants(token) {
  const parts = token.split(":")
  const base = parts.pop()
  return { variants: parts, base }
}

function isFillClass(base) {
  if (!base.startsWith("bg-")) return false
  const value = base.slice(3)
  if (NON_COLOR_BG.has(value)) return false
  if (NON_COLOR_BG_PREFIXES.some((prefix) => value.startsWith(prefix))) return false
  const [name] = value.split("/")
  if (NON_FILL_COLORS.has(name)) return false
  // 画像の任意値（`bg-` に url や image-set を書いたもの）も面ではあるが、
  // 色の濃淡で区切る話ではないので外す。
  // ⚠️ この注釈に Tailwind のクラス名をそのまま書かないこと。Tailwind v4 は
  // scripts/ も走査するので、注釈の中の文字列が本物のユーティリティとして
  // 出力され、解決できない url() を作ってビルドが落ちる（2026-09-22 に実際に
  // 落とした）。
  if (name.startsWith("[url(") || name.startsWith("[image")) return false
  return true
}

/**
 * 枠のクラスを「幅」と「色」に分ける。
 * - `border` / `border-2` / `border-x` / `border-t-4` / `border-[1px]` は幅
 * - `border-border` / `border-t-transparent` / `border-[CanvasText]` は色
 * 区別は末尾の値が数値・角括弧かどうか。`border-0` は幅ゼロ＝枠を消す指定。
 */
function classifyBorderClass(base) {
  if (base !== "border" && !base.startsWith("border-")) return null
  if (base === "border") return { kind: "width", sides: SIDE_KEYS, width: 1 }

  const rest = base.slice("border-".length)
  const segments = rest.split("-")
  const head = segments[0]

  if (Object.prototype.hasOwnProperty.call(SIDE_GROUPS, head)) {
    const sides = SIDE_GROUPS[head]
    const tail = segments.slice(1).join("-")
    if (tail === "") return { kind: "width", sides, width: 1 }
    if (WIDTH_VALUE.test(tail)) return { kind: "width", sides, width: tail === "0" ? 0 : 1 }
    return { kind: "color", sides, color: tail }
  }

  if (WIDTH_VALUE.test(rest)) return { kind: "width", sides: SIDE_KEYS, width: rest === "0" ? 0 : 1 }
  // 幅でも側面でもない = 全周の色。`border-info-border` など。
  return { kind: "color", sides: SIDE_KEYS, color: rest }
}

function isTransparentColor(color) {
  if (color === "transparent") return true
  // `border-border/0` のような完全透過も枠としては見えない。
  return /\/0$/.test(color)
}

/**
 * 1つの「クラスの束」が、通常状態で塗りと見える枠を同時に持つかを判定する。
 *
 * `state` は "base"（修飾子なし）か "dark"（`dark:` の付いたクラスで上書き）。
 * それ以外の修飾子（hover / focus / contrast-more / forced-colors / data-* …）は
 * 通常状態ではないので読まない。とくに `contrast-more:` と `forced-colors:` は
 * 箱 C＝「外した枠をハイコントラストで戻す」ための指定なので、ここで数えると
 * 直した部品がかえって違反に見えてしまう。
 */
export function analyzeClassBag(classString, { state = "base" } = {}) {
  const fills = []
  // 側ごとの「幅があるか」と「色は何か」。後から来たクラスが勝つ。
  const width = { top: false, right: false, bottom: false, left: false }
  const color = { top: null, right: null, bottom: null, left: null }
  const borderClasses = []

  for (const token of tokenize(classString)) {
    const { variants, base } = splitVariants(token)
    if (variants.length > 0) {
      if (state !== "dark") continue
      if (variants.length !== 1 || variants[0] !== "dark") continue
    }

    if (isFillClass(base)) {
      fills.push(token)
      continue
    }

    const border = classifyBorderClass(base)
    if (!border) continue
    borderClasses.push(token)
    for (const side of border.sides) {
      if (border.kind === "width") width[side] = border.width > 0
      else color[side] = border.color
    }
  }

  if (fills.length === 0) return null

  // 色を書いていない側は、globals.css の `* { @apply border-border }` により
  // --border が乗る＝見える枠。だから「色の指定が無い」は「透明」ではない。
  const visibleSides = SIDE_KEYS.filter(
    (side) => width[side] && !(color[side] !== null && isTransparentColor(color[side]))
  )
  if (visibleSides.length === 0) return null

  return { fills, borderClasses, sides: visibleSides }
}

/**
 * 箱 C の戻しが束に入っているか。
 * 箱 A で枠を外した面は、ハイコントラスト（prefers-contrast: more）と
 * forced-colors（Windows ハイコントラスト）で枠を戻す約束になっている。
 * 戻しが無いまま枠を透明にすると、面の濃淡しか区切りが無い利用者にとって
 * 区切りが完全に消える＝この検査が無いと黙って落ちる（2026-09-23 に
 * StatusLevel / Itinerary / WeekView の3件を実際に落とした）。
 */
export function analyzeHighContrastRestore(classString) {
  let width = false
  let transparent = false
  let contrastMore = false
  let forcedColors = false
  const fills = []

  for (const token of tokenize(classString)) {
    const { variants, base } = splitVariants(token)
    const border = classifyBorderClass(base)

    if (variants.length === 0) {
      if (isFillClass(base)) { fills.push(token); continue }
      if (!border) continue
      if (border.kind === "width" && border.width > 0) width = true
      if (border.kind === "color" && isTransparentColor(border.color)) transparent = true
      continue
    }
    // ⚠️ classifyBorderClass は `border-[CanvasText]` の角括弧を「幅」と読む
    // （WIDTH_VALUE が任意値の角括弧に当たるため）。戻しの判定はここで
    // 文字列のまま見る＝`border-transparent` 以外の色指定なら戻しとみなす。
    if (!base.startsWith("border")) continue
    if (/-transparent$|\/0$/.test(base)) continue
    if (base === "border" || /^border(?:-[trblxyse])?(?:-\d+)?$/.test(base)) continue
    if (variants.includes("contrast-more")) contrastMore = true
    if (variants.includes("forced-colors")) forcedColors = true
  }

  if (fills.length === 0 || !width || !transparent) return null
  if (contrastMore && forcedColors) return null
  return { fills, contrastMore, forcedColors }
}

// ---------------------------------------------------------------------------
// ソースからクラスの束を取り出す
// ---------------------------------------------------------------------------

const STRING_LITERAL = /"([^"\\\n]*(?:\\.[^"\\\n]*)*)"|'([^'\\\n]*(?:\\.[^'\\\n]*)*)'|`([^`\\$]*)`/g

function lineNumberAt(content, index) {
  return content.slice(0, index).split(/\r?\n/).length
}

/**
 * className を持つ JSX 要素のタグ名を返す（`<thead className=...>` なら "thead"）。
 * 表のグリッド線のように「どの要素に付いた枠か」で箱が決まるものがあるので、
 * 行番号ではなくタグで除外できるようにするため。見つからなければ null。
 */
function tagNameAt(content, classNameIndex) {
  for (let index = classNameIndex; index >= 0; index -= 1) {
    const char = content[index]
    if (char === ">") return null
    if (char !== "<") continue
    const match = /^<\s*([A-Za-z][\w.]*)/.exec(content.slice(index, index + 64))
    return match ? match[1] : null
  }
  return null
}

/**
 * className の値の範囲（`className="..."` または `className={...}` の中身）を返す。
 * cn("a", cond && "b") のように複数のリテラルに割れていても、1つの要素に付く
 * クラスはまとめて1つの束として読む。
 */
function collectClassNameRegions(content) {
  const regions = []
  const attribute = /\bclassName\s*=\s*/g
  for (const match of content.matchAll(attribute)) {
    const start = match.index + match[0].length
    const opener = content[start]
    if (opener === '"' || opener === "'") {
      const end = content.indexOf(opener, start + 1)
      if (end === -1) continue
      regions.push({
        start,
        end: end + 1,
        line: lineNumberAt(content, start),
        tag: tagNameAt(content, match.index),
      })
      continue
    }
    if (opener !== "{") continue
    let depth = 0
    let index = start
    for (; index < content.length; index += 1) {
      const char = content[index]
      if (char === "{") depth += 1
      else if (char === "}") {
        depth -= 1
        if (depth === 0) break
      }
    }
    if (depth !== 0) continue
    regions.push({
      start,
      end: index + 1,
      line: lineNumberAt(content, start),
      tag: tagNameAt(content, match.index),
    })
  }
  return regions
}

/**
 * `const fooClasses = { default: "...", outline: "..." }` のような variant の表。
 * className から `fooClasses[variant]` で引かれるので、className 側の束だけを
 * 読んでいると見落とす。表そのものを1エントリ＝1束として読む。
 */
function collectClassMapEntries(content) {
  const entries = []
  const declaration = /\b(?:const|let)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]*)?=\s*\{/g
  for (const match of content.matchAll(declaration)) {
    const openIndex = content.indexOf("{", match.index)
    let depth = 0
    let index = openIndex
    for (; index < content.length; index += 1) {
      const char = content[index]
      if (char === "{") depth += 1
      else if (char === "}") {
        depth -= 1
        if (depth === 0) break
      }
    }
    if (depth !== 0) continue
    const body = content.slice(openIndex, index + 1)
    const property = /(?:^|[{,\s])(?:"([^"]+)"|'([^']+)'|\[?([A-Za-z_$][\w$]*)\]?)\s*:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g
    for (const entry of body.matchAll(property)) {
      const key = entry[1] ?? entry[2] ?? entry[3]
      const literal = entry[4]
      const value = literal.slice(1, -1)
      if (!/\b(?:bg|border)-/.test(value) && !/(?:^|\s)border(?:\s|$)/.test(value)) continue
      const absoluteIndex = openIndex + entry.index
      entries.push({
        variable: match[1],
        key,
        classString: value,
        line: lineNumberAt(content, absoluteIndex),
      })
    }
  }
  return entries
}

function literalsIn(source) {
  const values = []
  for (const match of source.matchAll(STRING_LITERAL)) {
    values.push(match[1] ?? match[2] ?? match[3] ?? "")
  }
  return values
}

/**
 * className の束が variant の表を参照しているとき（`fooClasses[variant]`）、
 * その表の各エントリを束に混ぜて評価する。Badge の「素の border は透明・
 * variant 側に bg」のような、2か所に割れている書き方を拾うため。
 */
function expandWithClassMaps(regionSource, classMapEntries) {
  const referenced = new Set()
  for (const entry of classMapEntries) {
    const reference = new RegExp(`\\b${entry.variable}\\s*\\[`)
    if (reference.test(regionSource)) referenced.add(entry.variable)
  }
  return classMapEntries.filter((entry) => referenced.has(entry.variable))
}

/**
 * 箱 C の戻しが欠けている束を集める。findings と同じ region / 表の読み方を
 * 使うので、検出の取りこぼし方も同じに揃う。
 */
export function collectMissingRestores(relativeFilePath, content) {
  const missing = []
  const classMapEntries = collectClassMapEntries(content)
  const seen = new Set()

  const record = (line, classString, source) => {
    const result = analyzeHighContrastRestore(classString)
    if (!result) return
    const key = `${relativeFilePath}:${line}`
    if (seen.has(key)) return
    seen.add(key)
    missing.push({ file: relativeFilePath, line, source, classString, ...result })
  }

  for (const region of collectClassNameRegions(content)) {
    const regionSource = content.slice(region.start, region.end)
    const own = literalsIn(regionSource).join(" ")
    const inherited = expandWithClassMaps(regionSource, classMapEntries)
    if (inherited.length === 0) {
      record(region.line, own, "className")
      continue
    }
    for (const entry of inherited) {
      record(entry.line, `${own} ${entry.classString}`, `className+${entry.variable}.${entry.key}`)
    }
  }

  return missing.sort((a, b) => a.line - b.line)
}

export function collectFileFindings(relativeFilePath, content) {
  const findings = []
  const classMapEntries = collectClassMapEntries(content)
  const seen = new Set()

  const record = (line, classString, source, tag = null) => {
    // `dark:` を1つも書いていない束は dark 状態が base と同じなので、二重に
    // 数えない。書いてある束だけ、base と結果が違うときに dark の行を足す。
    const states = /(?:^|\s)dark:/.test(classString) ? ["base", "dark"] : ["base"]
    let baseSignature = null
    for (const state of states) {
      const result = analyzeClassBag(classString, { state })
      if (state === "base") baseSignature = result && JSON.stringify(result)
      else if (result && JSON.stringify(result) === baseSignature) continue
      if (!result) continue
      const key = `${relativeFilePath}:${line}:${state}`
      if (seen.has(key)) continue
      seen.add(key)
      findings.push({
        file: relativeFilePath,
        line,
        state,
        source,
        tag,
        classString,
        fills: result.fills,
        borderClasses: result.borderClasses,
        sides: result.sides,
      })
    }
  }

  for (const region of collectClassNameRegions(content)) {
    const regionSource = content.slice(region.start, region.end)
    const own = literalsIn(regionSource).join(" ")
    const inherited = expandWithClassMaps(regionSource, classMapEntries)
    if (inherited.length === 0) {
      record(region.line, own, "className", region.tag)
      continue
    }
    for (const entry of inherited) {
      record(
        entry.line,
        `${own} ${entry.classString}`,
        `className+${entry.variable}.${entry.key}`,
        region.tag
      )
    }
  }

  for (const entry of classMapEntries) {
    record(entry.line, entry.classString, `${entry.variable}.${entry.key}`, null)
  }

  return findings.sort((a, b) => a.line - b.line || a.state.localeCompare(b.state))
}

// ---------------------------------------------------------------------------
// 除外ポリシー（箱 B）
// ---------------------------------------------------------------------------

const DATE_PATTERN = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0
}

// scripts/make_public.py の EXCLUDED と同じ考え方＝「なぜ外すか」を書いた者だけが
// 外せる。id / reason / addedOn / expiresOn は必須で、期限切れは報告に出す。
//
// 除外は行番号ではなく「規則」で書く（行はすぐ古くなるため）。`match` に書ける鍵:
//   files       — ファイルパスに対する正規表現の配列
//   tags        — className が付いている JSX のタグ名（`thead` など）
//   sourcePattern — 出どころのラベル（`badgeVariantClasses.outline` など）
//   classPattern  — クラスの束そのもの
// 複数書いた場合は全部に当たったものだけを除外する。
export function loadExclusionPolicy(root, { key = "exclusions" } = {}) {
  const policy = JSON.parse(readFileSync(join(root, EXCLUSION_POLICY_PATH), "utf-8"))
  const rawEntries = Array.isArray(policy?.[key]) ? policy[key] : []
  const entries = []
  const policyIssues = []
  const today = new Date().toISOString().slice(0, 10)

  for (const [index, entry] of rawEntries.entries()) {
    const label = isNonEmptyString(entry?.id) ? entry.id : `exclusions[${index}]`
    if (!isNonEmptyString(entry?.id)) {
      policyIssues.push(`${label} は id が必要です`)
      continue
    }
    if (!isNonEmptyString(entry?.reason)) {
      policyIssues.push(`${label} は reason が必要です`)
      continue
    }
    if (!DATE_PATTERN.test(entry?.addedOn ?? "")) {
      policyIssues.push(`${label} は addedOn を YYYY-MM-DD で記録してください`)
      continue
    }
    const expiresOn = entry?.expiresOn
    if (expiresOn !== "permanent" && !DATE_PATTERN.test(expiresOn ?? "")) {
      policyIssues.push(`${label} は expiresOn を YYYY-MM-DD または "permanent" で記録してください`)
      continue
    }
    if (expiresOn !== "permanent" && expiresOn < today) {
      policyIssues.push(`${label} は ${expiresOn} に期限切れです（再判断が必要）`)
      continue
    }
    const match = entry.match ?? {}
    if (
      !Array.isArray(match.files) &&
      !Array.isArray(match.tags) &&
      !isNonEmptyString(match.sourcePattern) &&
      !isNonEmptyString(match.classPattern)
    ) {
      policyIssues.push(`${label} は match に files / tags / sourcePattern / classPattern のどれかが必要です`)
      continue
    }

    entries.push({
      id: entry.id,
      reason: entry.reason,
      files: Array.isArray(match.files) ? match.files.map((value) => new RegExp(value)) : null,
      tags: Array.isArray(match.tags) ? new Set(match.tags) : null,
      sourcePattern: isNonEmptyString(match.sourcePattern) ? new RegExp(match.sourcePattern) : null,
      classPattern: isNonEmptyString(match.classPattern) ? new RegExp(match.classPattern) : null,
      hits: 0,
    })
  }

  return { entries, policyIssues }
}

export function matchExclusion(finding, exclusions) {
  for (const entry of exclusions) {
    if (entry.files && !entry.files.some((pattern) => pattern.test(finding.file))) continue
    if (entry.tags && !(finding.tag && entry.tags.has(finding.tag))) continue
    if (entry.sourcePattern && !entry.sourcePattern.test(finding.source)) continue
    if (entry.classPattern && !entry.classPattern.test(finding.classString)) continue
    return entry
  }
  return null
}

// ---------------------------------------------------------------------------
// 走査
// ---------------------------------------------------------------------------

function listTsxFiles(rootDir) {
  const files = []
  const stack = [rootDir]
  while (stack.length > 0) {
    const current = stack.pop()
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name === "generated" || entry.name === "node_modules") continue
      const absolutePath = join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(absolutePath)
        continue
      }
      if (entry.isFile() && entry.name.endsWith(".tsx")) files.push(absolutePath)
    }
  }
  return files.sort()
}

export function collectSurfaceBorderReport({ root = ROOT } = {}) {
  const { entries: exclusions, policyIssues } = loadExclusionPolicy(root)
  const { entries: restoreExceptions, policyIssues: restorePolicyIssues } = loadExclusionPolicy(root, {
    key: "highContrastRestoreExceptions",
  })
  const files = listTsxFiles(join(root, TARGET_PATH))

  const remaining = []
  const excluded = []
  const missingRestores = []
  for (const filePath of files) {
    const relativeFilePath = relative(root, filePath)
    const content = readFileSync(filePath, "utf-8")
    for (const missing of collectMissingRestores(relativeFilePath, content)) {
      const exception = matchExclusion({ ...missing, tag: null }, restoreExceptions)
      if (exception) {
        exception.hits += 1
        continue
      }
      missingRestores.push(missing)
    }
    for (const finding of collectFileFindings(relativeFilePath, content)) {
      const exclusion = matchExclusion(finding, exclusions)
      if (exclusion) {
        exclusion.hits += 1
        excluded.push({ ...finding, exclusionId: exclusion.id })
      } else {
        remaining.push(finding)
      }
    }
  }

  const byFile = new Map()
  for (const finding of remaining) {
    byFile.set(finding.file, (byFile.get(finding.file) ?? 0) + 1)
  }

  return {
    scannedFiles: files.length,
    remaining,
    excluded,
    remainingFileCount: byFile.size,
    byFile: [...byFile.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
    missingRestores,
    restoreExceptionEntries: restoreExceptions.map((entry) => ({ id: entry.id, reason: entry.reason, hits: entry.hits })),
    exclusionEntries: exclusions.map((entry) => ({ id: entry.id, reason: entry.reason, hits: entry.hits })),
    policyIssues: [...policyIssues, ...restorePolicyIssues],
  }
}

// ---------------------------------------------------------------------------
// 報告
// ---------------------------------------------------------------------------

function buildMarkdown(report, { root }) {
  const today = new Date().toISOString().slice(0, 10)
  const lines = [
    "# 面と枠の重なり監査（surface borders）",
    "",
    `最終更新: ${today} — \`npm run docs:audit:surface-borders\` の出力。`,
    "",
    "KeEem の決定（DECISIONS.md 2026-09-22）で、塗りのある面は枠をやめて面の濃淡で",
    "区切ることになった。この表は「塗りがあるのに枠も持っている」箇所の残りを数える。",
    "",
    `- 走査したファイル: ${report.scannedFiles}（\`${TARGET_PATH}/**/*.tsx\`）`,
    `- **残り: ${report.remaining.length} 件 / ${report.remainingFileCount} ファイル**`,
    `- 箱 B として除外: ${report.excluded.length} 件（\`${EXCLUSION_POLICY_PATH}\`）`,
    `- 箱 C の戻しが欠けている面: ${report.missingRestores.length} 件` +
      `（方針と無関係な border-transparent の例外は ${report.restoreExceptionEntries.reduce((sum, entry) => sum + entry.hits, 0)} 件）`,
    "",
    "読み方: `dark` 状態の行は `dark:` の付いたクラスで上書きした後の状態。",
    "`contrast-more:` と `forced-colors:` の枠は「ハイコントラストで戻す枠」（箱 C）なので",
    "数えていない。",
    "",
    "## ファイル別の残り",
    "",
    "| ファイル | 件数 |",
    "| --- | --- |",
  ]
  for (const [file, count] of report.byFile) lines.push(`| \`${file}\` | ${count} |`)

  lines.push("", "## 明細", "", "| ファイル:行 | 状態 | 出どころ | 塗り | 枠 | 見える辺 |", "| --- | --- | --- | --- | --- | --- |")
  for (const finding of report.remaining) {
    lines.push(
      `| \`${finding.file}:${finding.line}\` | ${finding.state} | \`${finding.source}\` | ` +
        `\`${finding.fills.join(" ")}\` | \`${finding.borderClasses.join(" ") || "(既定の --border)"}\` | ${finding.sides.join(",")} |`
    )
  }

  if (report.excluded.length > 0) {
    lines.push("", "## 箱 B として除外したもの", "", "| ファイル:行 | 出どころ | 塗り | 枠 |", "| --- | --- | --- | --- |")
    for (const finding of report.excluded) {
      lines.push(
        `| \`${finding.file}:${finding.line}\` | \`${finding.source}\` | ` +
          `\`${finding.fills.join(" ")}\` | \`${finding.borderClasses.join(" ") || "(既定の --border)"}\` |`
      )
    }
  }

  lines.push(
    "",
    "## 注意",
    "",
    "- これはソースの静的検査。描画した結果のコントラストは見ていない（それは",
    "  `design:verify:color-contrast` と実機での確認の仕事）。",
    "- `className` が variant の表（`Record<VariantKey, string>`）を引いている部品は、",
    "  表のエントリごとに1件として数える。",
    "- 除外は理由・追加日・期限つきでしか書けない。許可リストへ足す前に KeEem に確認する。",
    ""
  )
  void root
  return lines.join("\n")
}

// ---------------------------------------------------------------------------
// 自己検査
// ---------------------------------------------------------------------------

// 検出器は毎回この固定文で自分を確かめる。正規表現をいじって黙って検出しなく
// なる事故を、CI で落として気づけるようにするため。
const SELF_TEST_FIXTURES = [
  {
    name: "塗り＋全周の枠を検出する",
    classString: "rounded-lg border border-info-border bg-info-subtle p-3",
    state: "base",
    expect: { fills: ["bg-info-subtle"], sides: ["top", "right", "bottom", "left"] },
  },
  {
    name: "色を書いていない素の border も検出する（既定で --border が乗るため）",
    classString: "rounded-lg border bg-card",
    state: "base",
    expect: { fills: ["bg-card"], sides: ["top", "right", "bottom", "left"] },
  },
  {
    name: "border-transparent は枠として数えない",
    classString: "rounded-full border border-transparent bg-secondary",
    state: "base",
    expect: null,
  },
  {
    name: "contrast-more: で戻した枠は通常状態では数えない（箱 C）",
    classString: "border border-transparent bg-info-subtle contrast-more:border-info-border",
    state: "base",
    expect: null,
  },
  {
    name: "forced-colors: の枠も通常状態では数えない（箱 C）",
    classString: "border border-transparent bg-muted forced-colors:border-[CanvasText]",
    state: "base",
    expect: null,
  },
  {
    name: "片側だけ透明にした残りの辺は検出する",
    classString: "border border-r-transparent bg-muted",
    state: "base",
    expect: { fills: ["bg-muted"], sides: ["top", "bottom", "left"] },
  },
  {
    name: "border-r + border-r-transparent は右辺が消える（Sidebar の形）",
    classString: "border-r border-r-transparent bg-muted",
    state: "base",
    expect: null,
  },
  {
    name: "border-0 は枠を消す指定なので数えない",
    classString: "border-0 bg-card",
    state: "base",
    expect: null,
  },
  {
    name: "塗りが無ければ枠があっても対象外（箱 B の入力欄・Separator）",
    classString: "h-10 rounded-md border border-input bg-transparent px-3",
    state: "base",
    expect: null,
  },
  {
    name: "bg-center / bg-no-repeat / bg-clip-text は塗りではない",
    classString: "border border-border bg-center bg-no-repeat bg-clip-text",
    state: "base",
    expect: null,
  },
  {
    name: "hover: の枠は通常状態ではない",
    classString: "bg-card hover:border hover:border-primary",
    state: "base",
    expect: null,
  },
  {
    name: "dark: で塗りと枠が付く場合は dark 状態で検出する",
    classString: "dark:border dark:border-border dark:bg-card",
    state: "dark",
    expect: { fills: ["dark:bg-card"], sides: ["top", "right", "bottom", "left"] },
  },
  {
    name: "dark: の指定は base 状態では読まない",
    classString: "dark:border dark:border-border dark:bg-card",
    state: "base",
    expect: null,
  },
  {
    name: "border-2 のような幅指定も枠として数える",
    classString: "border-2 border-primary bg-primary-subtle",
    state: "base",
    expect: { fills: ["bg-primary-subtle"], sides: ["top", "right", "bottom", "left"] },
  },
  {
    name: "border-x は左右だけ",
    classString: "border-x bg-card",
    state: "base",
    expect: { fills: ["bg-card"], sides: ["right", "left"] },
  },
  {
    name: "透過ゼロの色（border-border/0）も枠として見えない",
    classString: "border border-border/0 bg-card",
    state: "base",
    expect: null,
  },
]

// 箱 C の戻しの固定文。1本目は「実際に落とした形」＝StatusLevel が
// tone 側を border-transparent にしたのに基底に戻しを書かなかった形。
const RESTORE_FIXTURES = [
  {
    name: "枠を透明にして戻しが無い面を検出する（実際に落とした形）",
    classString: "inline-flex rounded-full border font-semibold border-transparent bg-secondary",
    expectMissing: true,
  },
  {
    name: "contrast-more と forced-colors の両方があれば通す",
    classString:
      "rounded-full border border-transparent contrast-more:border-border forced-colors:border-[CanvasText] bg-secondary",
    expectMissing: false,
  },
  {
    name: "contrast-more だけでは足りない（forced-colors で面が OS 色に消える）",
    classString: "rounded-full border border-transparent contrast-more:border-border bg-secondary",
    expectMissing: true,
  },
  {
    name: "片側だけの罫線も辺付きの戻しで通す",
    classString:
      "border-b border-b-transparent contrast-more:border-b-border forced-colors:border-b-[CanvasText] bg-muted",
    expectMissing: false,
  },
  {
    name: "塗りが無ければ対象外",
    classString: "border border-transparent contrast-more:border-border",
    expectMissing: false,
  },
  {
    name: "枠の幅が無ければ対象外",
    classString: "border-transparent bg-card",
    expectMissing: false,
  },
]

const SOURCE_FIXTURES = [
  {
    name: "variant の表を className から引いている部品を、エントリごとに数える",
    file: "src/components/display/Fixture.tsx",
    content: [
      'const toneClasses = {',
      '    info: "border-info-border bg-info-subtle",',
      '    plain: "border-transparent bg-muted",',
      '}',
      'export function Fixture({ tone }) {',
      '    return <div className={cn("rounded-lg border p-3", toneClasses[tone])} />',
      '}',
    ].join("\n"),
    // 幅は className 側の `border`、色と塗りは表の側＝2か所に割れている Badge の形。
    // `info` だけが塗り＋見える枠になる（`plain` は border-transparent で消える）。
    expectCount: 1,
  },
  {
    // 2026-09-23 に取りこぼしを見つけた分。`border` が長い文字列の末尾に
    // 素で入っている variant（Drawer の bottom / top）は、値に `border-` も
    // 含まれず `"border"` 完全一致でもないので表に採られず、黙って数から
    // 漏れていた。この固定文は実際に漏れた形をそのまま使っている。
    name: "長い文字列の末尾の素の border も variant の表として採る",
    file: "src/components/overlay/Fixture.tsx",
    content: [
      'const sideClasses = {',
      '    bottom: "inset-x-0 bottom-0 mt-24 h-auto rounded-t-[10px] border",',
      '    right: "inset-y-0 right-0 h-full w-80 rounded-l-[10px] border-l",',
      '}',
      'export function Fixture({ side }) {',
      '    return <div className={cn("fixed z-50 bg-background", sideClasses[side])} />',
      '}',
    ].join("\n"),
    expectCount: 2,
  },
  {
    name: "className に直接書かれた塗り＋枠を数える",
    file: "src/components/display/Direct.tsx",
    content: '<div className="rounded border border-border bg-card p-4" />',
    expectCount: 1,
  },
  {
    name: "塗りだけ・枠だけの要素は数えない",
    file: "src/components/display/Clean.tsx",
    content: '<div className="rounded bg-card p-4" /><hr className="h-px bg-border" />',
    expectCount: 0,
  },
]

function describe(result) {
  if (!result) return "null"
  return `fills=[${result.fills.join(" ")}] sides=[${result.sides.join(",")}]`
}

function runSelfTest({ verbose } = {}) {
  const failures = []

  for (const fixture of SELF_TEST_FIXTURES) {
    const result = analyzeClassBag(fixture.classString, { state: fixture.state })
    let ok
    if (fixture.expect === null) {
      ok = result === null
    } else {
      ok =
        result !== null &&
        JSON.stringify(result.fills) === JSON.stringify(fixture.expect.fills) &&
        JSON.stringify(result.sides) === JSON.stringify(fixture.expect.sides)
    }
    if (!ok) {
      failures.push(
        `${fixture.name}: expected ${fixture.expect === null ? "null" : describe(fixture.expect)} but got ${describe(result)}`
      )
    }
    if (verbose) console.log(`${ok ? "ok" : "NG"} - ${fixture.name}`)
  }

  for (const fixture of RESTORE_FIXTURES) {
    const result = analyzeHighContrastRestore(fixture.classString)
    const ok = fixture.expectMissing ? result !== null : result === null
    if (!ok) {
      failures.push(
        `${fixture.name}: expected ${fixture.expectMissing ? "missing" : "ok"} but got ${result ? "missing" : "ok"}`
      )
    }
    if (verbose) console.log(`${ok ? "ok" : "NG"} - ${fixture.name}`)
  }

  for (const fixture of SOURCE_FIXTURES) {
    const found = collectFileFindings(fixture.file, fixture.content)
    const ok = found.length === fixture.expectCount
    if (!ok) {
      failures.push(
        `${fixture.name}: expected ${fixture.expectCount} findings but got ${found.length} (${found
          .map((finding) => finding.source)
          .join(", ")})`
      )
    }
    if (verbose) console.log(`${ok ? "ok" : "NG"} - ${fixture.name}`)
  }

  return failures
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

export function auditSurfaceBorders({ root = ROOT, write = true } = {}) {
  const selfTestFailures = runSelfTest()
  if (selfTestFailures.length > 0) {
    console.error("audit-surface-borders: 検出器の自己検査に失敗しました（検査自体が壊れています）。")
    for (const failure of selfTestFailures) console.error(`- ${failure}`)
    process.exitCode = 1
    return null
  }

  const report = collectSurfaceBorderReport({ root })

  if (report.policyIssues.length > 0) {
    console.error(`audit-surface-borders: ${EXCLUSION_POLICY_PATH} のエントリが不正です。`)
    for (const issue of report.policyIssues) console.error(`- ${issue}`)
    process.exitCode = 1
    return report
  }

  if (write) {
    writeFileSync(join(root, REPORT_PATH), buildMarkdown(report, { root }), "utf-8")
  }

  console.log(
    `audit-surface-borders: 走査 ${report.scannedFiles} ファイル / ` +
      `塗りがあるのに枠もある箇所は残り ${report.remaining.length} 件（${report.remainingFileCount} ファイル）、` +
      `箱 B として除外 ${report.excluded.length} 件`
  )
  for (const [file, count] of report.byFile.slice(0, 15)) {
    console.log(`  ${String(count).padStart(3)}  ${file}`)
  }
  if (report.byFile.length > 15) console.log(`  ... 他 ${report.byFile.length - 15} ファイル`)
  if (write) console.log(`audit-surface-borders: 明細を ${REPORT_PATH} に書きました`)

  return report
}

/**
 * design:verify から呼ぶ門番。残りが `maxRemaining` を超えたら落ちる。
 * 既定は 0＝「塗りがあるのに枠もある」箇所を新しく足せない。
 * 箱 B（枠が意味そのもの）は design/policy/surface-border-exclusions.json に
 * 理由・追加日・期限つきで登録する。⛔ 許可リストへ足す前に KeEem に確認する。
 */
export function verifySurfaceBorders({ root = ROOT, maxRemaining = 0 } = {}) {
  const selfTestFailures = runSelfTest()
  if (selfTestFailures.length > 0) {
    throwLinesError([
      "audit-surface-borders: 検出器の自己検査に失敗しました（検査自体が壊れています）。",
      ...selfTestFailures.map((failure) => `- ${failure}`),
    ])
  }

  const report = collectSurfaceBorderReport({ root })

  if (report.policyIssues.length > 0) {
    throwLinesError([
      `audit-surface-borders: ${EXCLUSION_POLICY_PATH} のエントリが不正です。`,
      ...report.policyIssues.map((issue) => `- ${issue}`),
    ])
  }

  if (report.missingRestores.length > 0) {
    throwLinesError([
      `design:verify: 枠を透明にしたのに、ハイコントラストで戻していない面が ${report.missingRestores.length} 件あります。`,
      "箱 C（DECISIONS.md 2026-09-22）: 箱 A で外した枠は prefers-contrast: more と forced-colors: active で戻す。",
      "戻しが無いと、面の濃淡が見えない利用者にとって区切りが完全に消える。",
      "直し方: その要素の基底クラスに contrast-more:border-border と forced-colors:border-[CanvasText] を足す",
      "（片側だけの罫線なら contrast-more:border-b-border のように辺を付ける）。",
      "この方針と関係ない border-transparent（選択の対の片方・入り切りのつまみなど）は",
      `${EXCLUSION_POLICY_PATH} の highContrastRestoreExceptions に理由つきで登録する。`,
      ...report.missingRestores.map(
        (missing) =>
          `- ${missing.file}:${missing.line}（${missing.source}） 塗り ${missing.fills.join(" ")}` +
          ` / contrast-more:${missing.contrastMore ? "有" : "無"} forced-colors:${missing.forcedColors ? "有" : "無"}`
      ),
    ])
  }

  if (report.remaining.length <= maxRemaining) return report

  throwLinesError([
    `design:verify: 塗りのある面に枠も付いている箇所が ${report.remaining.length} 件あります（上限 ${maxRemaining}）。`,
    "KeEem の決定（new-4px DECISIONS.md 2026-09-22）: 1px の枠線をやめて面の濃淡で区切る（light も dark も）。",
    "⚠️ 枠を外す前に、その面が親の面に対して段差を持っているか測ること（1.05:1 未満なら先に塗りを上げる）。",
    `枠が意味そのもの（表の罫線・入力の境界・破線・格子線など）なら ${EXCLUSION_POLICY_PATH} に理由つきで登録する。`,
    ...report.remaining.map(
      (finding) =>
        `- ${finding.file}:${finding.line}（${finding.state}・${finding.source}）` +
        ` 塗り ${finding.fills.join(" ")} / 枠 ${finding.borderClasses.join(" ") || "(既定の --border)"}`
    ),
  ])
}

const isCli = process.argv[1] && process.argv[1].endsWith("audit-surface-borders.mjs")

if (isCli) {
  if (process.argv.includes("--self-test")) {
    const failures = runSelfTest({ verbose: true })
    if (failures.length > 0) {
      console.error("audit-surface-borders: self-test failed")
      for (const failure of failures) console.error(`- ${failure}`)
      process.exit(1)
    }
    console.log("audit-surface-borders: self-test passed")
  } else if (process.argv.includes("--verify")) {
    // 門番として走らせる（design:verify と同じ判定・報告ファイルは書かない）。
    const index = process.argv.indexOf("--max-remaining")
    const maxRemaining = index === -1 ? 0 : Number(process.argv[index + 1])
    runVerificationCli({
      scriptName: "audit-surface-borders.mjs",
      verify: () => verifySurfaceBorders({ maxRemaining }),
      successMessage: "design:verify: surface borders passed",
    })
  } else {
    auditSurfaceBorders({ write: !process.argv.includes("--no-write") })
  }
}
