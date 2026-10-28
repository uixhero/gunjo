import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

// `break-words` lets one long token — a path, a URL, an identifier — wrap
// instead of widening the page on a narrow viewport, the same contract as code
// spans in MarkdownRenderer. It only acts on a word that cannot fit a line.
//
// `inherit` sets no colour and no weight, so the code reads in the colour and
// weight of the sentence around it (muted inside a muted paragraph). Only the
// background sets it apart. Keep `font-medium` out of the base for that reason.
export const codeVariants = cva(
    "relative rounded font-mono text-sm break-words",
    {
        variants: {
            variant: {
                default: "bg-muted text-foreground font-medium px-1",
                muted: "bg-secondary text-muted-foreground font-medium border border-border px-1",
                inherit: "bg-muted px-1",
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
