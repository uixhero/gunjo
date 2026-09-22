"use client"

import * as React from "react"
import { IconX } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Skeleton } from "../display/Skeleton"

/**
 * One value in the panel. Three states, told apart by `value` alone:
 *
 * - `undefined` — still loading. The label is shown; the value is a skeleton
 *   of fixed width.
 * - `null` — could not be fetched. Settles to `—` and stops pulsing.
 * - anything else — the value.
 */
export type PlacePanelValue = React.ReactNode | null | undefined

export interface PlacePanelField {
    id: string
    label: React.ReactNode
    value: PlacePanelValue
}

export interface PlacePanelProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
    /** The place's name. `undefined` while it is being looked up. */
    title: PlacePanelValue
    /**
     * The one value that matters most, large (the temperature), and a few words
     * beside it (the sky: "Light cloud"). Both follow the three states. Omit the
     * whole prop for a panel with no headline; omit `caption` for no caption.
     */
    headline?: { value: PlacePanelValue; caption?: PlacePanelValue }
    /**
     * Every value the panel will ever show, from the first render. Rows are
     * never added when data arrives — see the note on the component.
     */
    fields: PlacePanelField[]
    /** Columns for the fields. Default 2. */
    columns?: 1 | 2
    /** Called by the close button. Omit to render no close button. */
    onClose?: () => void
    /** Accessible name for the close button. Default `"Close"`. */
    closeLabel?: string
    /** What the panel is, for assistive tech. Default `"Place details"`. */
    label?: string
    /** Heading level of the title, to fit the page outline. Default `"h2"`. */
    titleAs?: "h2" | "h3" | "h4"
}

function Value({
    value,
    skeletonClassName,
}: {
    value: PlacePanelValue
    skeletonClassName: string
}) {
    if (value === undefined) {
        return <Skeleton aria-hidden className={cn("inline-block align-middle", skeletonClassName)} />
    }
    if (value === null || value === "") return <>—</>
    return <>{value}</>
}

/**
 * PlacePanel — the details of one place picked on a map, in a panel that comes
 * up from the bottom edge: its name, one large value, and a grid of the rest.
 *
 * ⭐ **All the rows are there from the first frame.** Values arrive at different
 * times (the name from one service, the weather from another), and swapping the
 * rows in as they land changes the row count and shakes the panel. So every
 * label is drawn at once, only the values wait as skeletons, and the panel's
 * height does not change between loading and loaded — the map above it stays
 * still.
 *
 * ⭐ **A value that could not be fetched settles to `—`.** A skeleton that keeps
 * pulsing after the request gave up says "still coming" when nothing is.
 *
 * It is not a `Sheet`: a Sheet is modal (an overlay, a focus trap, the page
 * behind it locked), and the reader of a map needs to keep panning while the
 * panel is up. This panel is a plain landmark in the flow — place it yourself,
 * usually `absolute inset-x-0 bottom-0` inside the map's container, or beside
 * the map on a wide screen. `aria-busy` is set while any value is loading.
 *
 * The skeletons stop pulsing under `prefers-reduced-motion: reduce`.
 */
const PlacePanel = React.forwardRef<HTMLElement, PlacePanelProps>(
    (
        {
            className,
            title,
            headline,
            fields,
            columns = 2,
            onClose,
            closeLabel = "Close",
            label = "Place details",
            titleAs: Title = "h2",
            ...props
        },
        ref
    ) => {
        const hasCaption = headline !== undefined && "caption" in headline
        const loading =
            title === undefined ||
            (headline !== undefined && headline.value === undefined) ||
            (hasCaption && headline.caption === undefined) ||
            fields.some((field) => field.value === undefined)

        return (
            <section
                ref={ref}
                aria-label={label}
                aria-busy={loading || undefined}
                className={cn(
                    "@container flex flex-col gap-3 rounded-t-2xl border border-b-0 border-transparent contrast-more:border-border forced-colors:border-[CanvasText] bg-card p-4 pt-2 text-card-foreground shadow-lg",
                    className
                )}
                {...props}
            >
                <div aria-hidden className="mx-auto h-1 w-9 rounded-full bg-border" />
                <div className="flex min-h-6 items-center gap-3">
                    <Title className="min-w-0 flex-1 truncate text-sm font-medium text-primary">
                        <Value value={title} skeletonClassName="h-4 w-40" />
                    </Title>
                    {onClose ? (
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label={closeLabel}
                            className="-my-2.5 -mr-3 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <IconX className="h-4 w-4" />
                        </button>
                    ) : null}
                </div>
                {headline ? (
                    <div className="flex h-9 items-center gap-2">
                        <span className="font-mono text-3xl leading-9 tabular-nums">
                            <Value value={headline.value} skeletonClassName="h-7 w-28" />
                        </span>
                        {hasCaption ? (
                            <span className="text-sm text-muted-foreground">
                                <Value value={headline.caption} skeletonClassName="h-4 w-14" />
                            </span>
                        ) : null}
                    </div>
                ) : null}
                <dl
                    className={cn(
                        "grid gap-x-6 gap-y-2",
                        columns === 2 ? "grid-cols-1 @[20rem]:grid-cols-2" : "grid-cols-1"
                    )}
                >
                    {fields.map((field) => (
                        <div
                            key={field.id}
                            className="flex h-6 min-w-0 items-center justify-between gap-3 text-sm"
                        >
                            <dt className="shrink-0 text-muted-foreground">{field.label}</dt>
                            <dd className="min-w-0 truncate text-right font-mono font-medium tabular-nums">
                                <Value value={field.value} skeletonClassName="h-4 w-14" />
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>
        )
    }
)
PlacePanel.displayName = "PlacePanel"

export { PlacePanel }
