/**
 * CSV export helpers. Every data table / admin list / bank statement needs a
 * "CSVで保存" affordance, and consumers hand-roll the BOM + quote-escaping each
 * time (cold-test #34 did). `toCsv` is pure/SSR-safe; `downloadCsv` is the
 * browser trigger. (#189)
 */

/** UTF-8 byte-order mark — makes Excel read multibyte (e.g. 日本語) correctly. */
const UTF8_BOM = "﻿"

export interface ToCsvOptions {
    /**
     * Object keys to emit, in order. Defaults to the keys of the first row.
     * Ignored when rows are arrays.
     */
    columns?: string[]
    /** Header row. Defaults to `columns` (object rows) / none (array rows). */
    headers?: string[]
    /** Prepend a UTF-8 BOM so Excel reads multibyte text correctly. Default `true`. */
    bom?: boolean
    /** Field delimiter. Default `","`. */
    delimiter?: string
}

type CsvCell = string | number | boolean | null | undefined
type CsvRow = Record<string, CsvCell> | CsvCell[]

function escapeCsvCell(value: CsvCell, delimiter: string): string {
    if (value === null || value === undefined) return ""
    const str = String(value)
    // RFC 4180: quote when the field contains the delimiter, a quote, or a newline.
    if (str.includes(delimiter) || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`
    }
    return str
}

/** Serialize rows (objects or arrays) to an RFC-4180 CSV string. */
export function toCsv(rows: CsvRow[], options: ToCsvOptions = {}): string {
    const { bom = true, delimiter = "," } = options
    const first = rows[0]
    const isObjectRows = first !== undefined && !Array.isArray(first)
    const columns = options.columns ?? (isObjectRows ? Object.keys(first as Record<string, CsvCell>) : undefined)
    const headers = options.headers ?? (isObjectRows ? columns : undefined)

    const lines: string[] = []
    if (headers) lines.push(headers.map((h) => escapeCsvCell(h, delimiter)).join(delimiter))

    for (const row of rows) {
        const cells = Array.isArray(row)
            ? row
            : (columns ?? Object.keys(row)).map((key) => (row as Record<string, CsvCell>)[key])
        lines.push(cells.map((cell) => escapeCsvCell(cell, delimiter)).join(delimiter))
    }

    const body = lines.join("\r\n")
    return bom ? `${UTF8_BOM}${body}` : body
}

/** Trigger a browser download of `csv` as `filename`. No-op outside the browser. */
export function downloadCsv(csv: string, filename = "export.csv"): void {
    if (typeof document === "undefined" || typeof URL === "undefined") return
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}
