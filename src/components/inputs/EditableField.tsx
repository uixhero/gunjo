"use client"

import * as React from "react"
import { IconPencil as Pencil } from "@tabler/icons-react";

import { cn } from "../../lib/utils"
import { Button } from "./Button"
import { Textarea } from "./Textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"

export interface EditableFieldLabels {
    edit?: string
    save?: string
    cancel?: string
}

export interface EditableFieldProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
    label: React.ReactNode
    value: string
    onSave?: (value: string) => void | Promise<void>
    labels?: EditableFieldLabels
    placeholder?: string
    minRows?: number
    maxRows?: number
    fieldClassName?: string
    inputClassName?: string
    disabled?: boolean
    error?: React.ReactNode
}

const rowHeight = 20
const verticalPadding = 18
const borderHeight = 2

function getRowsHeight(rows: number) {
    return rows * rowHeight + verticalPadding
}

const EditableField = React.forwardRef<HTMLDivElement, EditableFieldProps>(
    (
        {
            label,
            value,
            onSave,
            labels,
            placeholder = "-",
            minRows = 1,
            maxRows = 3,
            fieldClassName,
            inputClassName,
            disabled,
            error,
            className,
            ...props
        },
        ref
    ) => {
        const [editing, setEditing] = React.useState(false)
        const [draft, setDraft] = React.useState(value)
        const [saving, setSaving] = React.useState(false)
        const textareaRef = React.useRef<HTMLTextAreaElement>(null)
        const resolvedMinRows = Math.max(1, minRows)
        const resolvedMaxRows = Math.max(resolvedMinRows, maxRows)
        const minHeight = getRowsHeight(resolvedMinRows)
        const maxHeight = getRowsHeight(resolvedMaxRows)

        React.useEffect(() => {
            if (!editing) {
                setDraft(value)
            }
        }, [editing, value])

        React.useLayoutEffect(() => {
            if (!editing || !textareaRef.current) return
            const textarea = textareaRef.current
            textarea.style.height = "auto"
            const nextHeight = Math.min(maxHeight, Math.max(minHeight, textarea.scrollHeight + borderHeight))
            textarea.style.height = `${nextHeight}px`
        }, [draft, editing, maxHeight, minHeight])

        const commit = async () => {
            try {
                setSaving(true)
                await onSave?.(draft.trim())
                setEditing(false)
            } catch {
                // Keep edit mode open so controlled error feedback can explain the failure.
            } finally {
                setSaving(false)
            }
        }

        const surfaceClass = cn(
            "box-border w-full min-w-0 rounded-md border bg-muted/20 px-3 py-2 text-sm leading-5 text-foreground shadow-none",
            "whitespace-pre-wrap break-words",
            error && "border-destructive-border",
            fieldClassName
        )

        return (
            <div ref={ref} className={cn("relative grid w-full gap-1.5 p-0", className)} {...props} data-slot="editable-field">
                <div className="relative flex h-7 items-center pr-28">
                    <div className="min-w-0 text-xs font-medium leading-5 text-foreground">{label}</div>
                    <div className="absolute right-0 top-0 flex h-7 shrink-0 items-center justify-end gap-1">
                        {onSave && !editing ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground"
                                        aria-label={labels?.edit ?? "Edit"}
                                        disabled={disabled}
                                        onClick={() => {
                                            setDraft(value)
                                            setEditing(true)
                                        }}
                                    >
                                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{labels?.edit ?? "Edit"}</TooltipContent>
                            </Tooltip>
                        ) : null}
                        {editing ? (
                            <>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2"
                                    disabled={saving}
                                    onClick={() => {
                                        setDraft(value)
                                        setEditing(false)
                                    }}
                                >
                                    {labels?.cancel ?? "Cancel"}
                                </Button>
                                <Button type="button" size="sm" className="h-7 px-2" disabled={saving} onClick={commit}>
                                    {labels?.save ?? "Save"}
                                </Button>
                            </>
                        ) : null}
                    </div>
                </div>
                {editing ? (
                    <Textarea
                        ref={textareaRef}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        className={cn(surfaceClass, "block h-auto resize-none overflow-y-auto align-top", inputClassName)}
                        rows={resolvedMinRows}
                        aria-invalid={error ? true : undefined}
                        style={{ minHeight, maxHeight }}
                    />
                ) : (
                    <div
                        className={cn(surfaceClass, "overflow-y-auto")}
                        style={{ minHeight, maxHeight }}
                    >
                        {value ? (
                            <span className="min-w-0 break-words">{value}</span>
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>
                )}
                {error ? (
                    <p className="text-xs leading-5 text-destructive" role="alert">
                        {error}
                    </p>
                ) : null}
            </div>
        )
    }
)
EditableField.displayName = "EditableField"

export { EditableField }
