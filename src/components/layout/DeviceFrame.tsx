"use client"

import * as React from "react"
import { IconLock as Lock, IconDeviceDesktop as Monitor, IconDeviceMobile as Smartphone, IconDeviceTablet as Tablet } from "@tabler/icons-react";

import { cn } from "../../lib/utils"
import { deviceFrameDefaultVariantKey } from "./generated/default-variant-keys"
import type { DeviceFrameVariantKey } from "./generated/variant-keys"
import { TooltipButton } from "../inputs/TooltipButton"

export type MarqueeViewport = "desktop" | "tablet" | "mobile"

export interface DeviceFrameLabels {
    url?: string
    desktop?: string
    tablet?: string
    mobile?: string
}

export interface DeviceFrameProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Fake host shown in the URL bar, without a trailing slash. */
    host: string
    /** Current path inside the fake host. */
    path: string
    /** Path used when the URL bar is submitted as `/`. */
    defaultPath?: string
    /** Optional tab title shown beside the URL on tablet and desktop frames. */
    tabTitle?: string
    viewport: MarqueeViewport
    variant?: DeviceFrameVariantKey
    onViewportChange: (next: MarqueeViewport) => void
    /** Optional whitelist for URL-bar navigation. */
    navigablePaths?: string[]
    /** Called with the normalized path after a valid URL-bar submit. */
    onPathChange?: (path: string) => void
    labels?: DeviceFrameLabels
    children: React.ReactNode
}

const VIEWPORTS: {
    key: MarqueeViewport
    Icon: typeof Monitor
    labelKey: keyof DeviceFrameLabels
    fallback: string
}[] = [
    { key: "desktop", Icon: Monitor, labelKey: "desktop", fallback: "Desktop" },
    { key: "tablet", Icon: Tablet, labelKey: "tablet", fallback: "Tablet" },
    { key: "mobile", Icon: Smartphone, labelKey: "mobile", fallback: "Mobile" },
]

interface DeviceFrameClassNames {
    root: string
    shell: string
    chrome: string
    url: string
    viewportActive: string
    viewportIdle: string
}

const variantClasses: Record<DeviceFrameVariantKey, DeviceFrameClassNames> = {
    default: {
        root: "p-0",
        shell: "overflow-hidden rounded-xl border border-border/60 bg-background shadow-2xl",
        chrome: "border-b border-border/60 bg-muted/40",
        url: "border-border/40 bg-background/60 focus-within:border-primary focus-within:ring-primary-border",
        viewportActive: "bg-foreground/10 text-foreground",
        viewportIdle: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
    },
    windows11: {
        root: "p-0",
        shell: "overflow-hidden rounded-lg border border-border bg-background shadow-xl",
        chrome: "border-b border-border bg-background",
        url: "border-border/70 bg-muted/50 focus-within:border-primary focus-within:ring-primary-border",
        viewportActive: "bg-primary-subtle text-primary-subtle-foreground",
        viewportIdle: "text-muted-foreground hover:bg-muted hover:text-foreground",
    },
}

function normalizeFramePath(value: string, host: string, defaultPath: string) {
    let candidate = value
        .trim()
        .replace(/^https?:\/\//, "")
        .replace(new RegExp(`^${host.replace(/\./g, "\\.")}`), "")

    if (!candidate.startsWith("/")) candidate = `/${candidate}`
    return candidate === "/" ? defaultPath : candidate
}

const DeviceFrame = React.forwardRef<HTMLDivElement, DeviceFrameProps>(
    (
        {
            host,
            path,
            defaultPath = "/",
            tabTitle,
            viewport,
            variant = deviceFrameDefaultVariantKey,
            onViewportChange,
            navigablePaths,
            onPathChange,
            labels,
            children,
            className,
            ...props
        },
        ref
    ) => {
        const classes = variantClasses[variant]
        const [draftUrl, setDraftUrl] = React.useState(`${host}${path}`)
        const [editing, setEditing] = React.useState(false)
        const inputRef = React.useRef<HTMLInputElement | null>(null)

        React.useEffect(() => {
            if (!editing) setDraftUrl(`${host}${path}`)
        }, [host, path, editing])

        const commitDraftUrl = () => {
            const candidate = normalizeFramePath(draftUrl, host, defaultPath)
            if (!navigablePaths || navigablePaths.includes(candidate)) {
                inputRef.current?.blur()
                onPathChange?.(candidate)
                return
            }
            setDraftUrl(`${host}${path}`)
            inputRef.current?.blur()
        }

        const isCompact = viewport === "mobile"
        const chromeOuter = cn(
            isCompact
                ? "flex items-center gap-2 px-2 py-2.5"
                : "flex items-center gap-3 px-4 py-2.5",
            classes.chrome
        )
        const urlBoxClass = cn(
            isCompact
                ? "flex min-w-0 w-full items-center gap-1.5 rounded-md border px-2 py-1 text-xs focus-within:ring-1"
                : "flex min-w-0 w-full max-w-md items-center gap-2 rounded-md border px-3 py-1 text-xs focus-within:ring-1",
            classes.url
        )
        const isWindows11 = variant === "windows11"

        return (
            <div ref={ref} className={cn("w-full", classes.root, className)} {...props}>
                <div className={classes.shell}>
                    <div className={chromeOuter}>
                        {!isCompact && !isWindows11 ? (
                            <div className="flex items-center gap-1.5" aria-hidden="true">
                                <span className="h-3 w-3 rounded-full bg-destructive" />
                                <span className="h-3 w-3 rounded-full bg-warning" />
                                <span className="h-3 w-3 rounded-full bg-success" />
                            </div>
                        ) : null}
                        <form
                            onSubmit={(event) => {
                                event.preventDefault()
                                commitDraftUrl()
                            }}
                            className="flex min-w-0 flex-1 items-center justify-center"
                        >
                            <div className={urlBoxClass}>
                                <Lock className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
                                {tabTitle && !isCompact ? (
                                    <span className="shrink-0 font-medium text-foreground">
                                        {tabTitle}
                                    </span>
                                ) : null}
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={draftUrl}
                                    onChange={(event) => setDraftUrl(event.currentTarget.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault()
                                            commitDraftUrl()
                                        }
                                    }}
                                    onFocus={() => setEditing(true)}
                                    onBlur={() => setEditing(false)}
                                    className="min-w-0 flex-1 truncate bg-transparent font-mono text-xs text-muted-foreground outline-none placeholder:text-muted-foreground/60"
                                    spellCheck={false}
                                    aria-label={labels?.url ?? "URL"}
                                />
                            </div>
                        </form>
                        <div className="flex shrink-0 items-center gap-0.5">
                            {VIEWPORTS.map(({ key, Icon, labelKey, fallback }) => {
                                const label = labels?.[labelKey] ?? fallback
                                return (
                                    <TooltipButton
                                        key={key}
                                        type="button"
                                        onClick={() => onViewportChange(key)}
                                        aria-label={label}
                                        aria-pressed={viewport === key}
                                        tooltip={label}
                                        tooltipSide="bottom"
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "h-7 w-7 rounded-md p-1.5",
                                            viewport === key ? classes.viewportActive : classes.viewportIdle
                                        )}
                                    >
                                        <Icon className="h-3.5 w-3.5" />
                                    </TooltipButton>
                                )
                            })}
                        </div>
                        {!isCompact && isWindows11 ? (
                            <div className="ml-1 flex h-6 shrink-0 items-center overflow-hidden rounded-md border border-border/60 text-muted-foreground" aria-hidden="true">
                                <span className="flex h-6 w-8 items-center justify-center text-xs leading-none">-</span>
                                <span className="flex h-6 w-8 items-center justify-center text-[10px] leading-none">□</span>
                                <span className="flex h-6 w-8 items-center justify-center text-xs leading-none">×</span>
                            </div>
                        ) : null}
                    </div>
                    <div className="bg-background">{children}</div>
                </div>
            </div>
        )
    }
)
DeviceFrame.displayName = "DeviceFrame"

export { DeviceFrame }
