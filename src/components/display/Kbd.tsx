import * as React from "react"
import { cn } from "../../lib/utils"

export interface KbdProps extends React.HTMLAttributes<HTMLSpanElement> { }

const Kbd = React.forwardRef<HTMLSpanElement, KbdProps>(
    ({ className, ...props }, ref) => {
        return (
            <kbd
                className={cn(
                    "pointer-events-none inline-flex h-5 w-fit select-none items-center gap-1 rounded-[4px] border border-input bg-secondary py-1 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Kbd.displayName = "Kbd"

export { Kbd }
