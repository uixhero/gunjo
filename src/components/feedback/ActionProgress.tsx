"use client"

import * as React from "react"
import { useFormStatus } from "react-dom"

import { cn } from "../../lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../overlay/Dialog"
import { useLocale } from "../utility/LocaleProvider"
import { Progress } from "./Progress"
import { Spinner } from "./Spinner"

export interface ActionProgressProps {
    /** The work is pending. The dialog appears only if it is still pending after `delayMs`. */
    open: boolean
    title: React.ReactNode
    description?: React.ReactNode
    /** Replaces the default spinner. */
    icon?: React.ReactNode
    /** Wait before showing, so work that finishes quickly never flashes a modal. Default 350. */
    delayMs?: number
    /**
     * Once shown, stay at least this long even if `open` turns false sooner, so
     * work that ends just after `delayMs` does not flash either. Default 500.
     */
    minVisibleMs?: number
    /** Render the dialog inside this element instead of `document.body`. */
    portalContainer?: HTMLElement | null
    className?: string
}

const preventDismiss = (event: Event) => event.preventDefault()

/**
 * Delayed show with a minimum visible time: true once `active` has stayed true
 * for `delayMs`; after that it stays true for at least `minVisibleMs`, then
 * follows `active` back to false.
 */
function useDelayedVisibility(active: boolean, delayMs: number, minVisibleMs: number) {
    const [shown, setShown] = React.useState(false)
    const shownAt = React.useRef(0)

    React.useEffect(() => {
        if (active) {
            if (shown) return
            const show = () => {
                shownAt.current = Date.now()
                setShown(true)
            }
            if (delayMs <= 0) {
                show()
                return
            }
            const timer = window.setTimeout(show, delayMs)
            return () => window.clearTimeout(timer)
        }
        if (!shown) return
        const remaining = minVisibleMs - (Date.now() - shownAt.current)
        if (remaining <= 0) {
            setShown(false)
            return
        }
        const timer = window.setTimeout(() => setShown(false), remaining)
        return () => window.clearTimeout(timer)
    }, [active, shown, delayMs, minVisibleMs])

    return shown
}

/**
 * Blocking feedback for a short action (save, send, redirect). It waits
 * `delayMs` before appearing, and once shown stays for at least
 * `minVisibleMs`, so it never flashes. It never shows a percentage — a short
 * action has none to report. It cannot be dismissed; it closes when `open`
 * turns false (after the minimum visible time).
 */
const ActionProgress = React.forwardRef<HTMLDivElement, ActionProgressProps>(
    ({ open, title, description, icon, delayMs = 350, minVisibleMs = 500, portalContainer, className }, ref) => {
        const { strings } = useLocale()
        const visible = useDelayedVisibility(open, delayMs, minVisibleMs)
        const progressName = typeof title === "string" ? title : strings.loading

        return (
            <Dialog open={visible} onOpenChange={() => undefined}>
                <DialogContent
                    ref={ref}
                    portalContainer={portalContainer}
                    showCloseButton={false}
                    onEscapeKeyDown={preventDismiss}
                    onPointerDownOutside={preventDismiss}
                    onInteractOutside={preventDismiss}
                    aria-busy="true"
                    className={cn("gap-0 overflow-hidden p-0 sm:max-w-sm", className)}
                >
                    <Progress
                        indeterminate
                        aria-label={progressName}
                        tone="primary"
                        className="h-1 rounded-none bg-primary/10"
                    />
                    <DialogHeader className="flex-row items-start gap-4 space-y-0 p-6 pr-6">
                        <span
                            aria-hidden="true"
                            className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary [&_svg]:size-5"
                        >
                            {icon ?? <Spinner className="text-primary motion-reduce:animate-none [[data-motion=reduce]_&]:animate-none" />}
                        </span>
                        <div role="status" aria-live="polite" className="min-w-0 space-y-1.5">
                            <DialogTitle>{title}</DialogTitle>
                            {description ? <DialogDescription>{description}</DialogDescription> : null}
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        )
    }
)
ActionProgress.displayName = "ActionProgress"

export type FormActionProgressProps = Omit<ActionProgressProps, "open">

/**
 * `ActionProgress` driven by the enclosing `<form>`'s pending state (React 19
 * `useFormStatus`). Render it inside the form whose submission it reports.
 */
function FormActionProgress(props: FormActionProgressProps) {
    const { pending } = useFormStatus()
    return <ActionProgress open={pending} {...props} />
}
FormActionProgress.displayName = "FormActionProgress"

export { ActionProgress, FormActionProgress }
