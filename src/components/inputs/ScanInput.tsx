"use client"

import * as React from "react"
import { IconAlertCircle, IconBarcode, IconCircleCheck } from "@tabler/icons-react"

import { cn } from "../../lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"

/** Outcome of resolving a scanned code. Returned from `onScan`. */
export interface ScanResult {
    /** Did the code resolve to a valid target? Drives tone (success vs destructive). */
    ok: boolean
    /** Message announced to screen readers and shown in the result line / feed. */
    message: string
}

/** One entry in the scan feed. */
export interface ScanFeedEntry extends ScanResult {
    /** The raw scanned code. */
    code: string
    /** Component-assigned key. */
    id: number
}

export interface ScanInputAction {
    /** Commit a scanned code immediately, as if a scanner typed it and sent Enter. */
    commit: (code: string) => void
    /** Fill the input without committing yet. Useful for camera preview confirmation flows. */
    setCode: (code: string) => void
    /** The underlying text input, for focus management when a scan UI closes. */
    input: HTMLInputElement | null
}

export interface ScanInputProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        "value" | "defaultValue" | "onChange" | "type" | "results"
    > {
    /**
     * Fires when a code is committed — a scan gun types the code then sends Enter,
     * or the user types and presses Enter. Return a `ScanResult` to drive the
     * announcement, tone and feed; return nothing to stay silent.
     */
    onScan: (code: string) => ScanResult | void
    /** Accessible label rendered above the field. */
    label?: React.ReactNode
    /** Helper text rendered under the field. */
    description?: React.ReactNode
    /** Re-focus the field after each scan so a scan gun fires continuously. Default `true`. */
    retainFocus?: boolean
    /** Clear the field after each scan. Default `true`. */
    clearOnScan?: boolean
    /** Ignore repeat commits within this many ms (scan guns can double-fire). Default `150`. */
    lockMs?: number
    /** Render a running feed of recent scans (newest first). Default `false`. */
    showFeed?: boolean
    /** Max feed entries retained. Default `8`. */
    feedLimit?: number
    /** Leading adornment. Default a barcode icon; pass `null` to hide. */
    icon?: React.ReactNode
    /** Called when the leading barcode icon is activated. Turns the icon into an accessible scan action. */
    onScannerOpen?: (action: ScanInputAction) => void
    /** Accessible label and tooltip for the scanner action. */
    scannerLabel?: string
    /**
     * Announce results assertively (`role="alert"` + `aria-live="assertive"`)
     * instead of politely. Use for safety-critical scanning where a mismatch
     * must interrupt the screen reader. Default `false`. (#237)
     */
    assertive?: boolean
    /** Localized strings. */
    labels?: { feedTitle?: string; empty?: string }
}

/**
 * Barcode / QR scan field. A scan gun acts as a keyboard that types a code then
 * sends Enter; `ScanInput` fires `onScan`, announces the returned result in a
 * live region, auto-clears and re-focuses for the next scan, debounces double
 * fires, and keeps an optional feed. For POS, stocktake, returns and
 * goods-receiving — scan → match → tick up. (#220)
 */
const ScanInput = React.forwardRef<HTMLInputElement, ScanInputProps>(
    (
        {
            className,
            onScan,
            label,
            description,
            retainFocus = true,
            clearOnScan = true,
            lockMs = 150,
            showFeed = false,
            feedLimit = 8,
            icon,
            onScannerOpen,
            scannerLabel = "スキャン画面を開く",
            assertive = false,
            labels,
            disabled,
            id,
            placeholder,
            inputMode,
            onKeyDown,
            "aria-invalid": ariaInvalid,
            ...props
        },
        ref
    ) => {
        const reactId = React.useId()
        const inputId = id ?? `${reactId}-input`
        const descId = description != null ? `${reactId}-desc` : undefined
        const resultId = `${reactId}-result`

        const innerRef = React.useRef<HTMLInputElement | null>(null)
        const setRefs = React.useCallback(
            (node: HTMLInputElement | null) => {
                innerRef.current = node
                if (typeof ref === "function") ref(node)
                else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
            },
            [ref]
        )

        const [code, setCode] = React.useState("")
        const [result, setResult] = React.useState<ScanResult | null>(null)
        const [feed, setFeed] = React.useState<ScanFeedEntry[]>([])
        const feedSeq = React.useRef(0)
        const locked = React.useRef(false)

        const commitValue = React.useCallback((nextCode: string) => {
            const trimmed = nextCode.trim()
            if (trimmed === "" || locked.current || disabled) return
            locked.current = true
            setTimeout(() => {
                locked.current = false
            }, lockMs)

            const res = onScan(trimmed) || undefined
            if (res) {
                setResult(res)
                const entry: ScanFeedEntry = { ...res, code: trimmed, id: feedSeq.current++ }
                setFeed((prev) => [entry, ...prev].slice(0, feedLimit))
            }
            if (clearOnScan) setCode("")
            else setCode(trimmed)
            if (retainFocus) innerRef.current?.focus()
        }, [clearOnScan, disabled, feedLimit, lockMs, onScan, retainFocus])

        const commit = () => commitValue(code)

        const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
            onKeyDown?.(event)
            if (event.defaultPrevented) return
            if (event.key === "Enter") {
                event.preventDefault()
                commit()
            }
        }

        const describedBy = [descId, resultId].filter(Boolean).join(" ") || undefined

        return (
            <div className={cn("flex w-full flex-col gap-1.5", className)} data-slot="scan-input">
                {label != null ? (
                    <label htmlFor={inputId} className="text-sm font-medium text-foreground">
                        {label}
                    </label>
                ) : null}

                <div
                    className={cn(
                        "inline-flex h-9 w-full max-w-full items-center gap-2 rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring",
                        ariaInvalid && "border-destructive-border focus-within:ring-destructive-border",
                        disabled && "cursor-not-allowed opacity-50"
                    )}
                >
                    {icon === null ? null : onScannerOpen ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    className="-ml-1 inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label={scannerLabel}
                                    disabled={disabled}
                                    onClick={() => {
                                        onScannerOpen({
                                            commit: commitValue,
                                            setCode,
                                            input: innerRef.current,
                                        })
                                    }}
                                >
                                    {icon ?? <IconBarcode className="h-4 w-4" />}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>{scannerLabel}</TooltipContent>
                        </Tooltip>
                    ) : (
                        <span className="shrink-0 text-muted-foreground" aria-hidden="true">
                            {icon ?? <IconBarcode className="h-4 w-4" />}
                        </span>
                    )}
                    <input
                        ref={setRefs}
                        id={inputId}
                        type="text"
                        inputMode={inputMode}
                        autoComplete="off"
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        placeholder={placeholder}
                        aria-invalid={ariaInvalid}
                        aria-describedby={describedBy}
                        className="w-full bg-transparent font-mono text-foreground placeholder:font-sans placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed"
                        {...props}
                    />
                </div>

                {description != null ? (
                    <p id={descId} className="text-xs text-muted-foreground">
                        {description}
                    </p>
                ) : null}

                {/* Always-mounted polite live region: announces each scan result.
                    Polite (not assertive) so rapid scanning doesn't interrupt itself. */}
                <p
                    id={resultId}
                    role={assertive ? "alert" : "status"}
                    aria-live={assertive ? "assertive" : "polite"}
                    aria-atomic="true"
                    className="min-h-5 text-sm"
                >
                    {result ? (
                        <span
                            className={cn(
                                "inline-flex items-center gap-1.5",
                                result.ok ? "text-success-strong" : "text-destructive"
                            )}
                        >
                            {result.ok ? (
                                <IconCircleCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                            ) : (
                                <IconAlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                            )}
                            {result.message}
                        </span>
                    ) : null}
                </p>

                {showFeed ? (
                    <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-muted/30 p-3">
                        <p className="text-xs font-medium text-muted-foreground">{labels?.feedTitle ?? "スキャン履歴"}</p>
                        {feed.length === 0 ? (
                            <p className="text-sm text-muted-foreground">{labels?.empty ?? "—"}</p>
                        ) : (
                            <ul className="flex flex-col gap-1">
                                {feed.map((entry) => (
                                    <li key={entry.id} className="flex items-center gap-2 text-sm">
                                        <span
                                            className={cn(
                                                "shrink-0 rounded px-1.5 py-0.5 text-xs font-medium",
                                                entry.ok
                                                    ? "bg-success-subtle text-success-subtle-foreground"
                                                    : "bg-destructive-subtle text-destructive-subtle-foreground"
                                            )}
                                        >
                                            {entry.ok ? "OK" : "対象外"}
                                        </span>
                                        <span className="shrink-0 font-mono text-xs text-muted-foreground">{entry.code}</span>
                                        <span className="min-w-0 truncate text-foreground">{entry.message}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ) : null}
            </div>
        )
    }
)
ScanInput.displayName = "ScanInput"

export { ScanInput }
