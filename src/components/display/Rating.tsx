import * as React from "react"
import { IconStar, IconStarFilled, IconStarHalfFilled } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import type { RatingVariantKey } from "./generated/variant-keys"
import { ratingDefaultVariantKey } from "./generated/default-variant-keys"

// Star pixel size per size variant. (#168)
const ratingSizeClasses: Record<RatingVariantKey, string> = {
    sm: "h-3.5 w-3.5",
    default: "h-4 w-4",
    lg: "h-5 w-5",
}

const ratingTextSizeClasses: Record<RatingVariantKey, string> = {
    sm: "text-xs",
    default: "text-sm",
    lg: "text-base",
}

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    /** Current rating, e.g. `4.5`. Rounded to the nearest half-star for display. */
    value: number
    /** Maximum number of stars. Default `5`. */
    max?: number
    /** Star size. Default `"default"`. */
    size?: RatingVariantKey
    /** Optional review count rendered after the stars (e.g. `(128)`). */
    reviewCount?: number
    /** Render the numeric value (e.g. `4.5`) before the stars. */
    showValue?: boolean
    /** Override the accessible label. Defaults to `"{value} out of {max} stars"`. */
    label?: string
}

/**
 * Read-only star rating with half-star support. The stars are decorative; the
 * rating is exposed to assistive tech via a single `role="img"` label so it is
 * announced as one value, not N separate icons. (#168)
 */
export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
    ({ className, value, max = 5, size = ratingDefaultVariantKey, reviewCount, showValue, label, ...props }, ref) => {
        const rounded = Math.round(value * 2) / 2
        const starClass = ratingSizeClasses[size]
        const ariaLabel = label ?? `${value} out of ${max} stars`

        return (
            <div
                ref={ref}
                role="img"
                aria-label={ariaLabel}
                className={cn("inline-flex items-center gap-1", ratingTextSizeClasses[size], className)}
                {...props}
            >
                {showValue ? (
                    <span className="font-medium tabular-nums text-foreground" aria-hidden="true">
                        {value}
                    </span>
                ) : null}
                <span className="inline-flex items-center" aria-hidden="true">
                    {Array.from({ length: max }, (_, i) => {
                        const position = i + 1
                        if (rounded >= position) {
                            return <IconStarFilled key={i} className={cn(starClass, "text-warning")} />
                        }
                        if (rounded >= position - 0.5) {
                            return <IconStarHalfFilled key={i} className={cn(starClass, "text-warning")} />
                        }
                        return <IconStar key={i} className={cn(starClass, "text-muted-foreground")} />
                    })}
                </span>
                {reviewCount !== undefined ? (
                    <span className="tabular-nums text-muted-foreground" aria-hidden="true">
                        ({reviewCount})
                    </span>
                ) : null}
            </div>
        )
    }
)

Rating.displayName = "Rating"
