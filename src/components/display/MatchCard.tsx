import * as React from "react"
import { IconArrowsExchange } from "@tabler/icons-react"

import { cn } from "../../lib/utils"

export type MatchFactorTone = "default" | "success" | "warning" | "destructive" | "muted"

export interface MatchFactor {
  /** Criterion label — 業種 / エリア / 補助率 / 価格. */
  label: React.ReactNode
  /** The judgement / value — a ◎○△× chip, a Meter, a grade, text. */
  value: React.ReactNode
  /** Tone for the value chip. Default `default`. */
  tone?: MatchFactorTone
  /** Optional detail under the row (自社 vs 制度 の値). */
  detail?: React.ReactNode
}

export interface MatchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left entity — a CompanyCell / PersonCell / any identity node (NOT assumed to be a person). */
  left: React.ReactNode
  /** Right entity — the counterpart (the OTHER side of the pairing; may be a different kind). */
  right: React.ReactNode
  /** The center connector / match score — a 適合度 number, a Meter, a Badge. Default a ⟷ glyph. */
  score?: React.ReactNode
  /** Factor-by-factor match breakdown (要件適合 / 評価項目 — 業種◎ / エリア△ …). */
  factors?: MatchFactor[]
  /** Heading above the factor breakdown. Default `"Match factors"`. */
  factorsLabel?: React.ReactNode
  /** Trailing actions (打診する / 申請する / NDA). */
  actions?: React.ReactNode
  /** Accessible name. */
  label?: React.ReactNode
}

const FACTOR_TONE: Record<MatchFactorTone, string> = {
  default: "bg-secondary text-secondary-foreground",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  destructive: "bg-destructive-subtle text-destructive",
  muted: "bg-muted text-muted-foreground",
}

/**
 * MatchCard — the two-sided pairing detail: a LEFT entity and a RIGHT entity side by side with a
 * center match score, plus a factor-by-factor breakdown and actions. The heart of every
 * matching / recommendation / deal-pairing / compare console — 求貨求車 (荷物×空車), M&A
 * (売り手×買い手), 補助金 (自社×制度), candidate×job, buyer×seller. **Entity-agnostic**: `left`
 * and `right` are arbitrary identity nodes (pair with `CompanyCell` / `PersonCell` / anything),
 * and the two sides may be DIFFERENT kinds (a company and a program). Distinct from
 * `RelationshipRow`, which hardcodes two `PersonCell`s (person⟷person) and has no score/factor
 * region. RSC-safe except opt-in handlers in the slots.
 */
const MatchCard = React.forwardRef<HTMLDivElement, MatchCardProps>(
  ({ className, left, right, score, factors, factorsLabel, actions, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        aria-label={typeof label === "string" ? label : undefined}
        className={cn("flex w-full flex-col gap-3 rounded-lg border border-border bg-card p-4", className)}
        data-slot="match-card"
        {...props}
      >
        {/* Pairing: left | score | right */}
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">{left}</div>
          <div className="flex shrink-0 flex-col items-center gap-0.5">
            {score ?? <IconArrowsExchange className="size-5 text-muted-foreground" aria-hidden="true" />}
          </div>
          <div className="flex min-w-0 flex-1 justify-end text-right">{right}</div>
        </div>

        {/* Factor-by-factor breakdown */}
        {factors != null && factors.length > 0 ? (
          <div className="flex flex-col gap-1.5 border-t border-border pt-3">
            {factorsLabel != null ? (
              <p className="text-xs font-medium text-muted-foreground">{factorsLabel}</p>
            ) : (
              <p className="text-xs font-medium text-muted-foreground">Match factors</p>
            )}
            <ul className="flex flex-col gap-1">
              {factors.map((f, i) => (
                <li key={i} className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm text-foreground">{f.label}</span>
                    {f.detail != null ? (
                      <span className="truncate text-xs text-muted-foreground">{f.detail}</span>
                    ) : null}
                  </span>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-xs font-medium",
                      FACTOR_TONE[f.tone ?? "default"]
                    )}
                  >
                    {f.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {actions != null ? <div className="flex flex-wrap justify-end gap-2 pt-1">{actions}</div> : null}
      </div>
    )
  }
)
MatchCard.displayName = "MatchCard"

export { MatchCard }
