import * as React from "react"

import { cn } from "../../lib/utils"

const SIZE = {
  sm: { tile: "size-7 text-xs rounded", name: "text-sm", gap: "gap-2" },
  default: { tile: "size-9 text-sm rounded-md", name: "text-sm", gap: "gap-2.5" },
  lg: { tile: "size-11 text-base rounded-md", name: "text-base", gap: "gap-3" },
} as const

function deriveInitial(name: React.ReactNode): string {
  if (typeof name !== "string") return ""
  return name.trim().charAt(0)
}

export interface CompanyCellProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Primary line — the company / organization / entity name (○○製作所 / IT導入補助金). */
  name: React.ReactNode
  /** Secondary line — 業種 / 所在地 / 制度区分 / 法人番号. */
  secondary?: React.ReactNode
  /** Logo node (an `<img>` / icon). When omitted, a SQUARE initial tile is derived from `name`. */
  logo?: React.ReactNode
  /** Size. Default `"default"`. */
  size?: keyof typeof SIZE
  /** Extra classes on the logo tile (e.g. a brand background). */
  logoClassName?: string
}

/**
 * CompanyCell — the organization / entity identity cell: a SQUARE logo tile (or an initial
 * fallback) + name + a secondary line (業種 / 所在地 / 制度区分). The org analogue of
 * `PersonCell` (which is a ROUND avatar + person name) — use this for companies, programs,
 * vendors, accounts, any non-person entity, so a card or a `MatchCard` side isn't forced into
 * a person's avatar/presence model. RSC-safe.
 */
const CompanyCell = React.forwardRef<HTMLDivElement, CompanyCellProps>(
  ({ className, name, secondary, logo, size = "default", logoClassName, ...props }, ref) => {
    const s = SIZE[size]
    return (
      <div ref={ref} className={cn("flex min-w-0 items-center", s.gap, className)} data-slot="company-cell" {...props}>
        <span
          aria-hidden="true"
          className={cn(
            "flex shrink-0 items-center justify-center overflow-hidden border border-border bg-muted font-semibold text-muted-foreground",
            s.tile,
            logoClassName
          )}
        >
          {logo ?? deriveInitial(name)}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className={cn("truncate font-medium text-foreground", s.name)}>{name}</span>
          {secondary != null ? (
            <span className="truncate text-xs text-muted-foreground">{secondary}</span>
          ) : null}
        </span>
      </div>
    )
  }
)
CompanyCell.displayName = "CompanyCell"

export { CompanyCell }
