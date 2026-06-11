import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

export const codeVariants = cva(
    "relative rounded font-mono text-sm font-medium",
    {
        variants: {
            variant: {
                default: "bg-muted text-foreground px-[0.4rem] py-[0.15rem]",
                muted: "bg-secondary text-muted-foreground border border-border px-[0.4rem] py-[0.15rem]",
            },
            size: {
                sm: "text-xs",
                default: "text-sm",
                lg: "text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface CodeProps
    extends React.HTMLAttributes<HTMLElement>,
        VariantProps<typeof codeVariants> {}

const Code = React.forwardRef<HTMLElement, CodeProps>(
    ({ className, variant, size, ...props }, ref) => (
        <code
            ref={ref}
            className={cn(codeVariants({ variant, size }), className)}
            {...props}
        />
    )
)
Code.displayName = "Code"

export { Code }
