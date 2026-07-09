import * as React from "react"

import { cn } from "../../lib/utils"

export type TicketCodeFormat = "code128" | "qr"

export interface TicketStubProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The encoded value — barcode/QR content (会員番号 / 予約番号 / クーポンコード). */
  value: string
  /** Code format. `code128` = a 1-D barcode (default); `qr` = a QR matrix. */
  format?: TicketCodeFormat
  /** Human-readable label under the code. Defaults to `value`. */
  codeLabel?: React.ReactNode
  /** Accessible name for the code image. Default derived from `value`. */
  codeAlt?: string
  /** Main content above the perforation (flight OD-pair / coupon detail / member info). */
  children?: React.ReactNode
  /** Show the perforation notch + dashed divider between content and code. Default `true`. */
  perforation?: boolean
  /**
   * Override the rendered code with a real scannable barcode (e.g. from a barcode lib). The
   * built-in renderer is a deterministic *visual* code — fine for previews/non-critical use;
   * pass `code` for a production-scannable one.
   */
  code?: React.ReactNode
  /** Labels used to derive the code image accessible name when `codeAlt` is omitted. */
  codeKindLabels?: {
    barcode?: string
    qr?: string
  }
  /**
   * Compose the code image accessible name from its parts (when `codeAlt` is omitted).
   * Instance-level localization override — defaults to `${kindLabel}：${value}` (JP-first).
   * `codeAlt` (a full override) still wins over this. (#558)
   */
  formatCodeAlt?: (parts: { kindLabel: string; value: string; format: TicketCodeFormat }) => string
}

// Deterministic (SSR-safe) PRNG seeded from the value, so the visual code never hydration-mismatches.
function seed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
function rng(a: number): () => number {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function Barcode({ value, alt }: { value: string; alt: string }) {
  const next = rng(seed(value))
  const bars: { x: number; w: number }[] = []
  let x = 0
  while (x < 240) {
    const w = 1 + Math.floor(next() * 3)
    bars.push({ x, w })
    x += w + (1 + Math.floor(next() * 2))
  }
  return (
    <svg viewBox={`0 0 ${x} 60`} className="h-14 w-full text-foreground" preserveAspectRatio="none" role="img" aria-label={alt}>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height="60" fill="currentColor" />
      ))}
    </svg>
  )
}

function QrCode({ value, alt }: { value: string; alt: string }) {
  const N = 25
  const next = rng(seed(value))
  const cells: boolean[][] = Array.from({ length: N }, () => Array.from({ length: N }, () => next() > 0.5))
  const finder = (r0: number, c0: number) => {
    for (let r = -1; r <= 7; r++)
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r
        const cc = c0 + c
        if (rr < 0 || rr >= N || cc < 0 || cc >= N) continue
        if (r === -1 || r === 7 || c === -1 || c === 7) cells[rr][cc] = false
        else cells[rr][cc] = r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)
      }
  }
  finder(0, 0)
  finder(0, N - 7)
  finder(N - 7, 0)
  return (
    <svg viewBox={`0 0 ${N} ${N}`} className="size-32 text-foreground" shapeRendering="crispEdges" role="img" aria-label={alt}>
      {cells.flatMap((row, r) =>
        row.map((on, c) => (on ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="currentColor" /> : null))
      )}
    </svg>
  )
}

function Perforation() {
  return (
    <div className="relative flex items-center py-1" aria-hidden="true">
      <span className="-ml-[10px] size-4 shrink-0 rounded-full bg-background" />
      <span className="flex-1 border-t border-dashed border-border" />
      <span className="-mr-[10px] size-4 shrink-0 rounded-full bg-background" />
    </div>
  )
}

/**
 * TicketStub — the scannable pass / ticket / coupon / member-card stub: a card with a
 * barcode or QR (real value in the SR name), a human-readable code label, an optional
 * perforation notch (the look that *reads* as a ticket), and a content slot above for the
 * domain detail (flight OD-pair + seat/gate, coupon discount, member tier). The thing the
 * traveller holds up at the gate / register — the consumer mirror of ScanInput/ScanGate
 * (which capture a code; this displays one). RSC-safe; the built-in code render is a
 * deterministic visual placeholder — pass `code` for a production-scannable barcode.
 */
export const TicketStub = React.forwardRef<HTMLDivElement, TicketStubProps>(
  ({ className, value, format = "code128", codeLabel, codeAlt, children, perforation = true, code, codeKindLabels, formatCodeAlt, ...props }, ref) => {
    const kindLabel = format === "qr" ? codeKindLabels?.qr ?? "QRコード" : codeKindLabels?.barcode ?? "バーコード"
    const alt = codeAlt ?? (formatCodeAlt ? formatCodeAlt({ kindLabel, value, format }) : `${kindLabel}：${value}`)
    return (
      <div ref={ref} className={cn("w-full overflow-hidden rounded-xl border bg-card text-card-foreground", className)} {...props}>
        {children != null && <div className="p-4">{children}</div>}
        {perforation && children != null && <Perforation />}
        <div className="flex flex-col items-center gap-2 p-4">
          {code ?? (format === "qr" ? <QrCode value={value} alt={alt} /> : <Barcode value={value} alt={alt} />)}
          <span className="text-xs font-medium tabular-nums tracking-widest text-muted-foreground">{codeLabel ?? value}</span>
        </div>
      </div>
    )
  }
)
TicketStub.displayName = "TicketStub"
