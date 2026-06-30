import * as React from "react"

import { cn } from "../../lib/utils"

export type LoyaltyTone = "brand" | "default"

export interface LoyaltyProgress {
  /** Current value (年間購入額 / ステータスポイント / 来店回数). */
  value: number
  /** Goal value (the next-tier threshold). */
  max: number
  /** Remaining-to-goal label ("プラチナまであと ¥13,800" / "ゴールドまであと 850P"). */
  label?: React.ReactNode
  /** Optional value caption ("2,150 / 3,000P"). */
  caption?: React.ReactNode
}

export interface LoyaltySummaryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The hero balance — the big number (3,480 / 42,180). */
  balance: React.ReactNode
  /** Small label above the balance ("ポイント残高"). */
  balanceLabel?: React.ReactNode
  /** Unit after the balance ("P" / "マイル" / "円"). */
  unit?: React.ReactNode
  /** Program title / member name / number (top-left). */
  meta?: React.ReactNode
  /** Tier / rank badge (top-right) — pass a Badge or any node. */
  tier?: React.ReactNode
  /** Secondary value(s) shown under the hero (IC残高 / 当年実績 など). */
  secondary?: { label: React.ReactNode; value: React.ReactNode }[]
  /** Progress toward the next tier (higher-is-better; never auto-reds). */
  progress?: LoyaltyProgress
  /** Accessible label used when `progress.label` is not plain text. */
  progressLabel?: string
  /** Expiry / alert line (失効予定 など). */
  alert?: React.ReactNode
  /** Primary action (a Button node — show card / redeem / charge). */
  action?: React.ReactNode
  /** Surface. `brand` = filled gradient hero (default); `default` = plain card. */
  tone?: LoyaltyTone
}

/**
 * LoyaltySummaryCard — the points/balance/tier hero every consumer loyalty screen opens with:
 * a prominent balance, a tier/rank badge, optional secondary values, a higher-is-better
 * progress-to-next-tier (with a remaining label — never auto-reds like a capacity Meter), an
 * expiry-warning slot and a primary action. The `brand` tone is a filled gradient surface so
 * the hero has shine without reaching for arbitrary brand-token classes. For airline マイル,
 * 鉄道 IC/ポイント, retail/EC rewards, membership tiers.
 *
 * For the back-office KPI strip use StatGroup; for a money breakdown use AmountBreakdown; for
 * the points/coupon/history list under the hero use ListCard. Presentational (the action slot
 * owns its own interactivity) — RSC-safe.
 */
export const LoyaltySummaryCard = React.forwardRef<HTMLDivElement, LoyaltySummaryCardProps>(
  (
    { balance, balanceLabel, unit, meta, tier, secondary, progress, progressLabel = "Progress to next tier", alert, action, tone = "brand", className, ...props },
    ref
  ) => {
    const brand = tone === "brand"
    const subtle = brand ? "text-primary-foreground/70" : "text-muted-foreground"
    const pct =
      progress && progress.max > 0 ? Math.max(0, Math.min(100, (progress.value / progress.max) * 100)) : null

    return (
      <div
        ref={ref}
        className={cn(
          "w-full overflow-hidden rounded-xl p-5",
          brand
            ? "bg-gradient-to-br from-gunjo-deep to-gunjo-deepest text-primary-foreground shadow-sm"
            : "border bg-card text-card-foreground",
          className
        )}
        {...props}
      >
        {(meta != null || tier != null) && (
          <div className="flex items-start justify-between gap-3">
            {meta != null ? <div className={cn("min-w-0 text-sm", subtle)}>{meta}</div> : <span />}
            {tier != null && <div className="shrink-0">{tier}</div>}
          </div>
        )}

        <div className="mt-2">
          {balanceLabel != null && <div className={cn("text-xs", subtle)}>{balanceLabel}</div>}
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tabular-nums leading-none">{balance}</span>
            {unit != null && <span className={cn("text-base font-medium", subtle)}>{unit}</span>}
          </div>
        </div>

        {secondary != null && secondary.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
            {secondary.map((s, i) => (
              <div key={i} className="min-w-0">
                <span className={cn("text-[11px]", subtle)}>{s.label}</span>
                <div className="text-sm font-semibold tabular-nums">{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {progress != null && (
          <div className="mt-4">
            {(progress.label != null || progress.caption != null) && (
              <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                <span className={brand ? "text-primary-foreground" : "text-foreground"}>{progress.label}</span>
                {progress.caption != null && <span className={cn("tabular-nums", subtle)}>{progress.caption}</span>}
              </div>
            )}
            <div
              role="progressbar"
              aria-valuenow={progress.value}
              aria-valuemin={0}
              aria-valuemax={progress.max}
              aria-label={typeof progress.label === "string" ? progress.label : progressLabel}
              className={cn("h-2 w-full overflow-hidden rounded-full", brand ? "bg-primary-foreground/25" : "bg-muted")}
            >
              <div
                className={cn("h-full rounded-full", brand ? "bg-primary-foreground" : "bg-primary")}
                style={{ width: `${pct ?? 0}%` }}
              />
            </div>
          </div>
        )}

        {alert != null && (
          <div
            className={cn(
              "mt-3 rounded-md px-2.5 py-1.5 text-xs",
              brand ? "bg-primary-foreground/15 text-primary-foreground" : "bg-warning-subtle text-warning-subtle-foreground"
            )}
          >
            {alert}
          </div>
        )}

        {action != null && <div className="mt-4">{action}</div>}
      </div>
    )
  }
)
LoyaltySummaryCard.displayName = "LoyaltySummaryCard"
