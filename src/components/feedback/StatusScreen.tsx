import * as React from "react"

import { cn } from "../../lib/utils"
import { statusScreenDefaultVariantKey } from "./generated/default-variant-keys"
import type { StatusScreenVariantKey } from "./generated/variant-keys"

export type StatusScreenVariant = StatusScreenVariantKey

export interface StatusScreenProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    /** Selects sensible defaults for code / icon tone / title / description. */
    variant?: StatusScreenVariant
    /** Large code shown at the top, such as "404". Overrides the variant default. */
    code?: React.ReactNode
    /** Icon shown in place of the code for icon-led states. */
    icon?: React.ReactNode
    title?: React.ReactNode
    description?: React.ReactNode
    /** Primary action or action group, usually Button. */
    action?: React.ReactNode
    /** Optional muted detail block, such as request ID or diagnostic text. */
    details?: React.ReactNode
}

type VariantPreset = {
    code?: string
    tone: "default" | "destructive"
    title: string
    description: string
}

const VARIANT_PRESETS: Record<StatusScreenVariantKey, VariantPreset> = {
    "not-found": {
        code: "404",
        tone: "default",
        title: "Page not found",
        description:
            "The page you are looking for doesn't exist or has been moved.",
    },
    error: {
        code: "500",
        tone: "destructive",
        title: "Something went wrong",
        description: "An unexpected error occurred. We've been notified.",
    },
    forbidden: {
        code: "403",
        tone: "destructive",
        title: "Access denied",
        description: "You don't have permission to view this page.",
    },
    offline: {
        tone: "default",
        title: "You're offline",
        description: "Check your connection and try again.",
    },
    maintenance: {
        tone: "default",
        title: "Under maintenance",
        description: "We'll be back shortly. Thanks for your patience.",
    },
    "coming-soon": {
        tone: "default",
        title: "Coming soon",
        description: "This page isn't available yet. Check back soon.",
    },
}

/**
 * Full-page status screen behind 404 / 500 / offline / 403 / maintenance /
 * coming-soon states. Pick a variant for defaults, then override code, icon,
 * title, description, action, or details as needed.
 */
const StatusScreen = React.forwardRef<HTMLDivElement, StatusScreenProps>(
    (
        {
            className,
            variant = statusScreenDefaultVariantKey,
            code,
            icon,
            title,
            description,
            action,
            details,
            children,
            ...props
        },
        ref
    ) => {
        const preset = VARIANT_PRESETS[variant] ?? VARIANT_PRESETS["not-found"]
        const resolvedCode = code ?? preset.code
        const resolvedTitle = title ?? preset.title
        const resolvedDescription = description ?? preset.description

        return (
            <div
                ref={ref}
                data-variant={variant}
                className={cn(
                    "flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 p-8 text-center",
                    className
                )}
                {...props}
            >
                {icon ? (
                    <div
                        className={cn(
                            "flex h-16 w-16 items-center justify-center [&_svg]:h-16 [&_svg]:w-16",
                            preset.tone === "destructive"
                                ? "text-destructive"
                                : "text-muted-foreground"
                        )}
                        aria-hidden="true"
                    >
                        {icon}
                    </div>
                ) : resolvedCode ? (
                    <p
                        className={cn(
                            "text-7xl font-extrabold tracking-tight",
                            preset.tone === "destructive"
                                ? "text-destructive"
                                : "text-foreground"
                        )}
                    >
                        {resolvedCode}
                    </p>
                ) : null}
                <p className="text-2xl font-semibold text-foreground">
                    {resolvedTitle}
                </p>
                <p className="max-w-md text-sm text-muted-foreground">
                    {resolvedDescription}
                </p>
                {action ? <div className="mt-2">{action}</div> : null}
                {details ? (
                    <pre className="mt-4 max-w-xl overflow-x-auto rounded-md bg-muted p-3 text-left font-mono text-xs text-muted-foreground">
                        {details}
                    </pre>
                ) : null}
                {children}
            </div>
        )
    }
)
StatusScreen.displayName = "StatusScreen"

export { StatusScreen }
