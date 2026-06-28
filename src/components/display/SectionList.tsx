import * as React from "react"

import { cn } from "../../lib/utils"

export interface SectionListSection {
  /** Stable key for the section. */
  key: string | number
  /** Section heading — the group label (荷主名 / 2026年6月締め / 6月 / カテゴリ). */
  title: React.ReactNode
  /** Secondary on the heading (期間 / 件数の説明). */
  sublabel?: React.ReactNode
  /** Right-aligned group aggregate in the header (小計 ¥… / N件 / 合計). */
  meta?: React.ReactNode
  /** The section body — the caller's rows (ListCards, a Table, ledger rows…). */
  content: React.ReactNode
  /** Optional per-group footer band (小計 / subtotal / 合計). */
  footer?: React.ReactNode
}

export interface SectionListProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Pre-grouped sections (the caller owns the `groupBy`). Each is a heading band + the
   * caller's body + an optional per-group subtotal footer.
   */
  sections: SectionListSection[]
  /** Stick the section headers to the top while scrolling that section. Default `false`. */
  stickyHeaders?: boolean
  /** Accessible name for the whole grouped list. */
  label?: React.ReactNode
}

/**
 * SectionList — the grouped-list / sectioned layout: a sequence of sections, each a heading
 * band (title + sublabel + a right-aligned group aggregate) over the caller's body rows, with
 * an optional per-group subtotal footer. The grouping spine every history / 利用明細 / 取引履歴
 * / statement / invoice-by-客先 screen hand-rolls — `groupBy` + a section header + a per-group
 * subtotal. Body-agnostic: drop in ListCards (mobile history), a Table (desktop invoices), or
 * signed ledger rows. The caller owns the grouping + the subtotal math (and any cross-group
 * selection); this owns the consistent header/footer chrome + the sectioned a11y structure.
 * Distinct from StatusBoard.groups (status tiles) and Itinerary.days (a trip timeline). RSC-safe.
 */
const SectionList = React.forwardRef<HTMLDivElement, SectionListProps>(
  ({ className, sections, stickyHeaders = false, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        aria-label={typeof label === "string" ? label : undefined}
        className={cn("flex w-full flex-col gap-4", className)}
        data-slot="section-list"
        {...props}
      >
        {sections.map((section) => (
          <section
            key={section.key}
            aria-label={typeof section.title === "string" ? section.title : undefined}
            className="flex flex-col"
          >
            <div
              className={cn(
                "flex items-baseline justify-between gap-2 border-b border-border bg-muted/60 px-3 py-1.5",
                stickyHeaders && "sticky top-0 z-10 backdrop-blur"
              )}
            >
              <div className="flex min-w-0 items-baseline gap-2">
                <h3 className="truncate text-sm font-semibold text-foreground">{section.title}</h3>
                {section.sublabel != null ? (
                  <span className="truncate text-xs text-muted-foreground">{section.sublabel}</span>
                ) : null}
              </div>
              {section.meta != null ? (
                <span className="shrink-0 text-sm font-medium tabular-nums text-foreground">{section.meta}</span>
              ) : null}
            </div>

            <div className="min-w-0">{section.content}</div>

            {section.footer != null ? (
              <div className="flex items-baseline justify-between gap-2 border-t border-border bg-accent/40 px-3 py-1.5 text-sm font-medium tabular-nums text-foreground">
                {section.footer}
              </div>
            ) : null}
          </section>
        ))}
      </div>
    )
  }
)
SectionList.displayName = "SectionList"

export { SectionList }
