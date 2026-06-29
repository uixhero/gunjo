import * as React from "react"

import { cn } from "../../lib/utils"

export interface DocumentRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Document name (2026年6月分 給与明細 / 請求書 2026-06). */
  title: React.ReactNode
  /** Secondary line under the title. */
  description?: React.ReactNode
  /** Meta — format / size / date (PDF・124KB・発行日 2026/06/25). */
  meta?: React.ReactNode
  /** File-type icon (IconFileTypePdf …), shown in a tinted tile. */
  icon?: React.ReactNode
  /**
   * A leading control — a `Checkbox` for bulk-select. Rendered as an INDEPENDENT hit target
   * before the identity, so selecting a row never conflicts with opening or downloading it.
   */
  control?: React.ReactNode
  /** Status pill (新着 / 発行済). */
  status?: React.ReactNode
  /**
   * Trailing action(s) — the download `Button` (and ⋯ menu). An INDEPENDENT button, separate
   * from `onOpen`, so a list row can carry a checkbox, a tap-to-preview, AND a download at once.
   */
  actions?: React.ReactNode
  /** Make the file identity (icon + title + meta) a tap-to-preview button — kept separate from `actions`. */
  onOpen?: () => void
}

/**
 * DocumentRow — the downloadable document / file row: a leading control slot (a `Checkbox` for
 * bulk-select), a file-type icon, the document name + meta (format / size / 発行日), and a
 * trailing independent action button (download). The spine of every 帳票 / 明細 / 書類 / 添付 /
 * download surface. Unlike `ListCard` (whose `onSelect` makes the WHOLE card one `<button>`, so
 * a nested download button is invalid HTML), DocumentRow keeps **multiple independent hit
 * targets** — select, open-to-preview (`onOpen`), and the trailing download action. Group rows
 * with `SectionList` (by year / type) for headings + subtotals. RSC-safe except the opt-in
 * `onOpen` / action handlers.
 */
const DocumentRow = React.forwardRef<HTMLDivElement, DocumentRowProps>(
  ({ className, title, description, meta, icon, control, status, actions, onOpen, ...props }, ref) => {
    const identity = (
      <>
        {icon != null ? (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            {icon}
          </span>
        ) : null}
        <span className="flex min-w-0 flex-col">
          <span className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-foreground">{title}</span>
            {status}
          </span>
          {description != null ? (
            <span className="truncate text-xs text-muted-foreground">{description}</span>
          ) : null}
          {meta != null ? (
            <span className="truncate text-xs tabular-nums text-muted-foreground">{meta}</span>
          ) : null}
        </span>
      </>
    )

    return (
      <div
        ref={ref}
        data-slot="document-row"
        className={cn("flex w-full items-center gap-3 px-3 py-2.5", className)}
        {...props}
      >
        {control != null ? <span className="flex shrink-0 items-center">{control}</span> : null}

        {onOpen ? (
          <button
            type="button"
            onClick={onOpen}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-left transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {identity}
          </button>
        ) : (
          <span className="flex min-w-0 flex-1 items-center gap-3">{identity}</span>
        )}

        {actions != null ? <span className="flex shrink-0 items-center gap-1">{actions}</span> : null}
      </div>
    )
  }
)
DocumentRow.displayName = "DocumentRow"

export { DocumentRow }
