import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

export const containerVariants = cva("mx-auto w-full px-4 sm:px-6 lg:px-8", {
    variants: {
        size: {
            sm: "max-w-screen-sm",
            md: "max-w-screen-md",
            lg: "max-w-screen-lg",
            xl: "max-w-screen-xl",
            "2xl": "max-w-screen-2xl",
            full: "max-w-full",
            prose: "max-w-prose",
        },
    },
    defaultVariants: {
        size: "lg",
    },
})

export interface ContainerProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof containerVariants> {
    as?: keyof React.JSX.IntrinsicElements
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, size, as = "div", ...props }, ref) => {
        const Comp = as as React.ElementType
        return (
            <Comp
                ref={ref}
                className={cn(containerVariants({ size }), className)}
                {...props}
            />
        )
    }
)
Container.displayName = "Container"

export { Container }
