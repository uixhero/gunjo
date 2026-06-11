"use client"

import * as React from "react"
import { IconExternalLink } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Icon } from "../display/Icon"
import { textLinkDefaultVariantKey } from "./generated/default-variant-keys"
import type { TextLinkVariantKey } from "./generated/variant-keys"

const textLinkVariantClasses: Record<TextLinkVariantKey, string> = {
    default: "font-medium text-primary underline underline-offset-4 hover:text-primary-strong",
    muted: "font-medium text-foreground underline underline-offset-4 hover:text-primary",
}

export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    variant?: TextLinkVariantKey
    newTabLabel?: string
    external?: boolean
}

function normalizeRel(rel: string | undefined, opensNewTab: boolean): string | undefined {
    if (!opensNewTab) return rel
    const tokens = new Set((rel ?? "").split(/\s+/).filter(Boolean))
    tokens.add("noreferrer")
    return Array.from(tokens).join(" ")
}

const TextLink = React.forwardRef<HTMLAnchorElement, TextLinkProps>(
    (
        {
            children,
            className,
            external,
            newTabLabel = "opens in a new tab",
            rel,
            target,
            variant = textLinkDefaultVariantKey,
            ...props
        },
        ref
    ) => {
        const opensNewTab = target === "_blank"
        const showExternalIcon = opensNewTab || Boolean(external)

        return (
            <a
                ref={ref}
                className={cn(
                    "inline-flex items-center gap-1 p-0 align-baseline text-sm transition-colors",
                    textLinkVariantClasses[variant],
                    className
                )}
                rel={normalizeRel(rel, opensNewTab)}
                target={target}
                {...props}
            >
                <span>{children}</span>
                {showExternalIcon ? (
                    <>
                        <Icon icon={IconExternalLink} size="xs" decorative className="translate-y-px" />
                        {opensNewTab && newTabLabel ? <span className="sr-only">({newTabLabel})</span> : null}
                    </>
                ) : null}
            </a>
        )
    }
)
TextLink.displayName = "TextLink"

export { TextLink }
