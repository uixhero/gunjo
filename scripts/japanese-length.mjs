// 日本語の分量を数える。4px 共通の実装。
//
// 正（SSOT）= ~/dev/new-4px/skills/japanese-length/reference/japanese-length.mjs
// 各リポにあるのはその写し。⛔ 片方だけ書き換えない。写しがずれていないかは
// skills/japanese-length/scripts/check-parity.mjs が両リポを同時に読んで見る。
//
// どの場面でどれを使うかは SKILL.md の「決まり」節が正。要点だけ再掲する:
//   - schema.org の wordCount   → countWords（語数。schema.org の定義が語数）
//   - 読了時間                   → countCharacters（日本語の読速は文字で測る）
//   - 原稿の分量管理             → countCharacters（+ 必要なら stripCode で本文だけ）
//
// 依存は Node 標準の Intl.Segmenter（ICU 内蔵）だけ。⛔ 辞書パッケージを足さない。
// ⚠️ Intl.Segmenter の分かち書きは ICU のバージョンで揺れる。実行環境をまたいで
//    「同じ数」を期待してはいけない。同一環境で2つの写しが一致することだけを保証する。

/** 実装の版。振る舞いを変えたら上げる。写しの照合にも使う。 */
export const SPEC_VERSION = '1'

// Intl.Segmenter の生成は安くない。記事数ぶん回るので使い回す。
const WORD_SEGMENTER = new Intl.Segmenter('ja', { granularity: 'word' })

const NAMED_ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&nbsp;': ' ',
}

/**
 * 記法を落として、人が読む文字だけにする。
 *
 * 入力は HTML でも Markdown でもよい（UIXHERO は描画済み HTML、GUNJO は
 * Markdown を渡すため、両方を1つの実装で扱う）。
 *
 * ⚠️ コードの中身は落とさない。技術記事ではコードも読む対象なので、語数・文字数に
 *    含める。コードを除いた分量が要るときは stripCode() を先に通す。
 *
 * @param {unknown} source
 * @returns {string}
 */
export function toPlainText(source) {
  if (typeof source !== 'string' || source.length === 0) return ''

  let text = source.replace(/\r\n?/g, '\n')

  // HTML: コメントと script/style は中身ごと落とす
  text = text.replace(/<!--[\s\S]*?-->/g, ' ')
  text = text.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  // HTML: 残りのタグは空白1つに置き換える。詰めると隣り合う語がつながって
  // 1語に数えられてしまう（</p><p> の前後など）。
  text = text.replace(/<[^>]*>/g, ' ')
  // HTML: 主要な実体参照を文字へ戻す。&amp;lt; の二重復号を避けるため一度だけ。
  text = text.replace(/&(?:amp|lt|gt|quot|apos|nbsp);/g, (match) => NAMED_ENTITIES[match] ?? match)
  text = text.replace(/&#(\d{1,7});/g, (match, code) => {
    const value = Number(code)
    return value > 0 && value <= 0x10ffff ? String.fromCodePoint(value) : match
  })

  // Markdown: 記法だけを落とし、本文の文字は残す
  text = text.replace(/^[ \t]*(?:```|~~~).*$/gm, ' ') // コードフェンスの行（中身は残す）
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, ' $1 ') // 画像は alt を残す
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, ' $1 ') // リンクは表示文字を残す
  text = text.replace(/^[ \t]{0,3}#{1,6}[ \t]+/gm, ' ') // 見出し
  text = text.replace(/^[ \t]{0,3}>[ \t]?/gm, ' ') // 引用
  text = text.replace(/^[ \t]{0,3}(?:[-*+]|\d{1,3}\.)[ \t]+/gm, ' ') // 箇条書き
  text = text.replace(/^[ \t]{0,3}\|?[\s:|-]{3,}\|?[ \t]*$/gm, ' ') // 表の区切り行・水平線
  text = text.replace(/\|/g, ' ') // 表の縦棒
  text = text.replace(/[*_~`]/g, '') // 強調・打消し・インラインコードの印

  return text.replace(/\s+/g, ' ').trim()
}

/**
 * コード（フェンス・pre・code・インラインコード）を落とす。
 * 分量管理で「文章そのものの量」を見たいときだけ使う。
 *
 * @param {unknown} source
 * @returns {string}
 */
export function stripCode(source) {
  if (typeof source !== 'string' || source.length === 0) return ''

  let text = source.replace(/\r\n?/g, '\n')
  text = text.replace(/^[ \t]*```[\s\S]*?^[ \t]*```[ \t]*$/gm, '\n')
  text = text.replace(/^[ \t]*~~~[\s\S]*?^[ \t]*~~~[ \t]*$/gm, '\n')
  text = text.replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi, '\n')
  text = text.replace(/<code\b[^>]*>[\s\S]*?<\/code>/gi, ' ')
  text = text.replace(/`[^`\n]*`/g, ' ')
  return text
}

/**
 * 語数。schema.org の wordCount はこれを入れる
 * （"The number of words in the text of the CreativeWork" = 文字数ではない）。
 *
 * ⚠️ 分かち書きは完璧ではない。「安心して」が「安 / 心して」に割れるなど、
 *    語の切れ目を取り違える。桁が合えば足りる用途にだけ使う。
 *
 * @param {unknown} source
 * @returns {number}
 */
export function countWords(source) {
  const text = toPlainText(source)
  if (text.length === 0) return 0

  let words = 0
  for (const segment of WORD_SEGMENTER.segment(text)) {
    if (segment.isWordLike) words += 1
  }
  return words
}

/**
 * 文字数（空白を除く）。日本語の読了時間と原稿の分量はこれで測る。
 * 絵文字・異体字を1つと数えるためコードポイントで数える。
 *
 * @param {unknown} source
 * @returns {number}
 */
export function countCharacters(source) {
  const text = toPlainText(source).replace(/\s+/g, '')
  if (text.length === 0) return 0
  return [...text].length
}
