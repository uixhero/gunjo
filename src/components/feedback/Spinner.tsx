import { ComponentProps } from "react"
import { IconLoader2 as Loader2 } from "@tabler/icons-react";
import { cn } from "../../lib/utils"
import type { SpinnerVariantKey } from "./generated/variant-keys"
import { spinnerDefaultVariantKey } from "./generated/default-variant-keys"

type SpinnerSize = SpinnerVariantKey | "icon"

const spinnerSizeClasses: Record<SpinnerVariantKey, string> = {
    default: "h-4 w-4",
    lg: "h-6 w-6",
    sm: "h-3 w-3",
}

function isSpinnerVariantKey(size: SpinnerSize): size is SpinnerVariantKey {
    return Object.prototype.hasOwnProperty.call(spinnerSizeClasses, size)
}

export interface SpinnerProps extends ComponentProps<"svg"> {
    size?: SpinnerSize
}

export function Spinner({ className, size = spinnerDefaultVariantKey, ...props }: SpinnerProps) {
    return (
        <Loader2
            className={cn(
                "animate-spin text-muted-foreground",
                isSpinnerVariantKey(size) ? spinnerSizeClasses[size] : "h-10 w-10",
                className
            )}
            {...props}
        />
    )
}
