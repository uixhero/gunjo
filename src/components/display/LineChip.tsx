import * as React from "react"

import { cn } from "../../lib/utils"

export type LineChipSize = "sm" | "default"

export interface LineChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The line / route identifier — 渋66 / JY / 丸ノ内線 / G. Always carries the meaning (colour-independent). */
  label: React.ReactNode
  /**
   * The line's brand colour as a **hex** string (`#f5a200`, `#0079c2`). Renders a filled chip
   * with auto-contrast text (black/white by luminance). A non-hex / omitted value renders a
   * neutral chip — the `label` still reads. Colour is decoration; the label is the meaning.
   */
  color?: string
  /** Optional leading icon (a mode glyph). */
  icon?: React.ReactNode
  /** Chip size. Default `"default"`. */
  size?: LineChipSize
}

const SIZE: Record<LineChipSize, string> = {
  sm: "h-5 min-w-[1.5rem] px-1 text-[11px]",
  default: "h-6 min-w-[1.75rem] px-1.5 text-xs",
}

/** Black/white text for a hex bg by relative luminance — pure + SSR-deterministic. Returns null for non-hex. */
function readableText(color?: string): string | null {
  if (!color) return null
  const m = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(color.trim())
  if (!m) return null
  let h = m[1]
  if (h.length === 3) h = h.split("").map((c) => c + c).join("")
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return lum > 0.6 ? "#000000" : "#ffffff"
}

/**
 * LineChip — the transit line / route identity chip: a small pill showing a line/route number
 * (渋66 / 東98 / JY / 丸ノ内線) in the line's official brand colour, with auto-contrast text so
 * it stays readable on any hue. The label carries the meaning, so it works colour-blind / in
 * mono. The *identity* counterpart to Badge (which is a *status/semantic* tone): this keys a
 * chip to a transit line. For approach lists, route candidates, leg details, run-diagram labels —
 * rail / bus / subway. Pass `color` as a hex; omit it for a neutral chip.
 */
const LineChip = React.forwardRef<HTMLSpanElement, LineChipProps>(
  ({ className, label, color, icon, size = "default", style, ...props }, ref) => {
    const text = readableText(color)
    const filled = text != null
    return (
      <span
        ref={ref}
        data-slot="line-chip"
        className={cn(
          "inline-flex shrink-0 items-center justify-center gap-1 rounded font-semibold tabular-nums",
          "ring-1 ring-inset ring-border",
          !filled && "bg-secondary text-secondary-foreground",
          SIZE[size],
          className
        )}
        style={filled ? { backgroundColor: color, color: text, ...style } : style}
        {...props}
      >
        {icon != null ? <span aria-hidden="true" className="shrink-0">{icon}</span> : null}
        <span className="truncate">{label}</span>
      </span>
    )
  }
)
LineChip.displayName = "LineChip"

export { LineChip }
