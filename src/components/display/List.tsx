import * as React from "react"
import { cn } from "../../lib/utils"
import { IconCheck as Check, IconCircle as Circle, IconPoint as Dot } from "@tabler/icons-react";
import { listVariantKeys, type ListVariantKey } from "./generated/variant-keys"
import { listDefaultVariantKey } from "./generated/default-variant-keys"

type ListMarkerKey = ListVariantKey | "number" | "none"

const listVariantKeySet = new Set<ListVariantKey>(listVariantKeys)

const markerIcons: Record<ListVariantKey, React.ReactNode> = {
    check: <Check className="h-4 w-4 flex-shrink-0 text-primary" />,
    circle: <Circle className="h-3 w-3 flex-shrink-0 text-muted-foreground" fill="currentColor" />,
    dot: <Dot className="h-4 w-4 flex-shrink-0 text-muted-foreground" />,
}

const listLayoutClasses: Record<ListVariantKey, string> = {
    dot: "flex flex-col",
    check: "flex flex-col",
    circle: "flex flex-col",
}

function isListVariantKey(value: ListMarkerKey | undefined): value is ListVariantKey {
    return !!value && listVariantKeySet.has(value as ListVariantKey)
}

export interface ListProps extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
    variant?: "unordered" | "ordered" | "none"
    marker?: ListMarkerKey
    spacing?: "default" | "tight" | "loose"
    divided?: boolean
}

const List = React.forwardRef<HTMLElement, ListProps>(
    ({ className, variant = "unordered", marker, spacing = "default", divided = false, children, ...props }, ref) => {
        const Comp = variant === "ordered" ? "ol" : "ul"

        // Determine default marker based on variant if not specified
        const effectiveMarker =
            marker ||
            (variant === "ordered"
                ? "number"
                : variant === "unordered"
                    ? listDefaultVariantKey
                    : "none");
        const usesCustomMarker = isListVariantKey(effectiveMarker)
        const customMarkerLayout = usesCustomMarker ? listLayoutClasses[effectiveMarker] : undefined

        return (
            <Comp
                ref={ref as any}
                className={cn(
                    "text-muted-foreground",
                    divided ? "flex flex-col divide-y divide-border/70" : customMarkerLayout,
                    divided && spacing === "default" && "[&>li]:py-2",
                    divided && spacing === "tight" && "[&>li]:py-1.5",
                    divided && spacing === "loose" && "[&>li]:py-3",
                    divided && "[&>li:first-child]:pt-0 [&>li:last-child]:pb-0",
                    !divided && spacing === "default" && (usesCustomMarker ? "gap-2" : "space-y-2"),
                    !divided && spacing === "tight" && (usesCustomMarker ? "gap-1" : "space-y-1"),
                    !divided && spacing === "loose" && (usesCustomMarker ? "gap-4" : "space-y-4"),
                    className
                )}
                {...props}
            >
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child) && child.type === ListItem) {
                        const item = child as React.ReactElement<ListItemProps>;
                        return React.cloneElement(item, {
                            marker: item.props.marker || effectiveMarker,
                        })
                    }
                    return child
                })}
            </Comp>
        )
    }
)
List.displayName = "List"

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
    marker?: ListMarkerKey
    icon?: React.ReactNode
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
    ({ className, children, marker, icon, ...props }, ref) => {

        let markerEl = null;
        if (icon) {
            markerEl = <span className="flex-shrink-0 text-muted-foreground">{icon}</span>
        } else if (isListVariantKey(marker)) {
            markerEl = markerIcons[marker]
        } else {
            switch (marker) {
                case "number":
                    // For ordered lists, we typically rely on list-style-type, 
                    // but for custom styling we might want a span. 
                    // Let's use standard list-decimal class for 'number' if no icon
                    break;
                default:
                    break;
            }
        }

        const isStandardOrdered = marker === "number" && !icon;

        return (
            <li
                ref={ref}
                className={cn(
                    isStandardOrdered
                        ? "ml-4 list-inside list-decimal"
                        : "flex flex-row list-none items-center gap-2",
                    className
                )}
                {...props}
            >
                {!isStandardOrdered && markerEl}
                <span className="min-w-0 flex-1 text-sm text-muted-foreground">{children}</span>
            </li>
        )
    }
)
ListItem.displayName = "ListItem"

export { List, ListItem }
