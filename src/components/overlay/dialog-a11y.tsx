"use client"

import * as React from "react"

/**
 * Shared a11y wiring for Radix-dialog-backed overlays (Dialog, Sheet, Drawer,
 * AlertDialog).
 *
 * Radix's contract: a dialog `Content` must have a `Description` **or** an
 * explicit `aria-describedby={undefined}` opt-out. A newcomer who renders only a
 * title hits a runtime dev warning
 * (`Missing \`Description\` or \`aria-describedby={undefined}\` for {…}`) — see #322.
 *
 * These helpers make the Content opt out **only when no description exists**, so:
 * - title-only dialogs stop warning (documented `aria-describedby={undefined}`), and
 * - dialogs that DO render a `*Description` keep Radix's wiring, so the
 *   description stays associated for screen readers (no regression).
 *
 * A caller-supplied `aria-describedby` always wins (we never override it).
 */

const DialogDescriptionContext = React.createContext<(() => () => void) | null>(null)

/**
 * Call inside a dialog `Content`. Pass whether the caller supplied their own
 * `aria-describedby`. Returns:
 * - `describedByProps` — spread onto the Radix `*.Content` **after** `{...props}`.
 * - `DescriptionProvider` + `register` — wrap the Content children so any
 *   `*Description` can announce itself via {@link useRegisterDialogDescription}.
 */
export function useDialogDescribedBy(hasAriaDescribedByProp: boolean): {
    describedByProps: { "aria-describedby"?: string }
    register: () => () => void
    DescriptionProvider: React.Provider<(() => () => void) | null>
} {
    const [descriptionCount, setDescriptionCount] = React.useState(0)
    const register = React.useCallback(() => {
        setDescriptionCount((c) => c + 1)
        return () => setDescriptionCount((c) => c - 1)
    }, [])

    // Override to `undefined` (documented opt-out) only when nobody provides a
    // description. If the caller passed `aria-describedby`, or a `*Description`
    // child has registered, leave Radix's own wiring untouched.
    const describedByProps =
        hasAriaDescribedByProp || descriptionCount > 0
            ? {}
            : { "aria-describedby": undefined }

    return { describedByProps, register, DescriptionProvider: DialogDescriptionContext.Provider }
}

/**
 * Call inside a dialog `*Description` so its parent `Content` knows a description
 * exists and keeps Radix's `aria-describedby` wiring. No-op outside a dialog. (#322)
 */
export function useRegisterDialogDescription(): void {
    const register = React.useContext(DialogDescriptionContext)
    React.useEffect(() => {
        if (!register) return
        return register()
    }, [register])
}
