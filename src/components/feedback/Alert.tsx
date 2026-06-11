import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import type { AlertVariantKey } from "./generated/variant-keys"
import { alertDefaultVariantKey } from "./generated/default-variant-keys"

const alertVariantClasses: Record<AlertVariantKey, string> = {
    default: "border-border bg-background text-foreground [&_[data-alert-description]]:text-muted-foreground",
    info:
        "border-info-border bg-info-subtle text-info-subtle-foreground [&>svg]:text-info [&_[data-alert-description]]:text-info-subtle-foreground/85",
    success:
        "border-success-border bg-success-subtle text-success-subtle-foreground [&>svg]:text-success [&_[data-alert-description]]:text-success-subtle-foreground/85",
    warning:
        "border-warning-border bg-warning-subtle text-warning-subtle-foreground [&>svg]:text-warning [&_[data-alert-description]]:text-warning-subtle-foreground/85",
    destructive:
        "border-destructive-border bg-destructive-subtle text-destructive-subtle-foreground [&>svg]:text-destructive [&_[data-alert-description]]:text-destructive-subtle-foreground/85",
}

const alertVariants = cva(
    "relative inline-flex h-fit w-[320px] max-w-full flex-col items-center gap-1 rounded-lg border px-4 py-3 text-sm [&>*]:self-start [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-3 [&>svg]:text-foreground [&>svg~*]:w-full [&>svg~*]:pl-7",
    {
        variants: {
            variant: alertVariantClasses,
        },
        defaultVariants: {
            variant: alertDefaultVariantKey,
        },
    }
)

const Alert = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
    <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
    />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h5
        ref={ref}
        className={cn("flex min-h-4 items-center font-medium font-semibold leading-none tracking-tight", className)}
        {...props}
    />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        data-alert-description=""
        className={cn("text-xs leading-relaxed [&_p]:leading-relaxed", className)}
        {...props}
    />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
