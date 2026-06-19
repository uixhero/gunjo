import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const skeletonVariants = cva(
    "animate-pulse rounded-md bg-muted",
    {
        variants: {
            shape: {
                rectangle: "h-4 w-full",
                circle: "h-10 w-10 rounded-full",
                text: "h-3.5 w-full rounded-full",
            },
        },
        defaultVariants: {
            shape: "rectangle",
        },
    }
)

export interface SkeletonProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
    ({ className, shape, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(skeletonVariants({ shape }), className)}
            {...props}
        />
    )
)
Skeleton.displayName = "Skeleton"

export { Skeleton, skeletonVariants }
