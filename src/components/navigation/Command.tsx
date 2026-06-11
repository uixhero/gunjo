"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { IconSearch as Search, IconX as X } from "@tabler/icons-react";

import { cn } from "../../lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"

const Command = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
    <CommandPrimitive
        ref={ref}
        className={cn(
            "flex h-full w-[320px] w-full flex-col overflow-hidden rounded-md border bg-popover text-popover-foreground",
            className
        )}
        {...props}
    />
))
Command.displayName = CommandPrimitive.displayName

type CommandDialogProps = React.ComponentProps<typeof CommandPrimitive.Dialog> & {
    dialogTitle?: React.ReactNode
    portalContainer?: HTMLElement | null
}

const CommandDialog = ({
    children,
    dialogTitle = "Command Menu",
    portalContainer,
    container,
    className,
    overlayClassName,
    contentClassName,
    ...props
}: CommandDialogProps) => {
    const resolvedContainer = portalContainer ?? container

    return (
        <CommandPrimitive.Dialog
            {...props}
            container={resolvedContainer ?? undefined}
            overlayClassName={cn(
                "fixed inset-0 z-50 bg-overlay/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                resolvedContainer && "absolute",
                overlayClassName
            )}
            contentClassName={cn(
                "fixed left-1/2 top-[10%] z-50 w-[calc(100%-2rem)] max-w-[640px] -translate-x-1/2 overflow-hidden rounded-lg bg-popover text-left text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                resolvedContainer && "absolute",
                contentClassName
            )}
            className={cn("flex h-full w-full flex-col overflow-hidden rounded-lg border bg-popover text-left text-popover-foreground", className)}
        >
            <DialogPrimitive.Title className="sr-only">{dialogTitle}</DialogPrimitive.Title>
            {children}
        </CommandPrimitive.Dialog>
    )
}

type CommandInputProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> & {
    clearable?: boolean
    clearLabel?: string
}

function setNativeInputValue(input: HTMLInputElement, value: string) {
    const valueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
    )?.set
    valueSetter?.call(input, value)
    input.dispatchEvent(new Event("input", { bubbles: true }))
}

const CommandInput = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Input>,
    CommandInputProps
>(({ className, clearable = false, clearLabel = "Clear search", onInput, onValueChange, disabled, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const [hasValue, setHasValue] = React.useState(Boolean(props.value ?? props.defaultValue))

    const setRefs = React.useCallback(
        (node: HTMLInputElement | null) => {
            inputRef.current = node
            if (typeof ref === "function") {
                ref(node)
            } else if (ref) {
                ref.current = node
            }
        },
        [ref]
    )

    const handleClear = React.useCallback(() => {
        const input = inputRef.current
        if (!input) return
        onValueChange?.("")
        setNativeInputValue(input, "")
        setHasValue(false)
        input.focus()
    }, [onValueChange])

    React.useEffect(() => {
        setHasValue(Boolean(props.value ?? inputRef.current?.value ?? props.defaultValue))
    }, [props.defaultValue, props.value])

    return (
        <div className="relative flex items-center border-b px-3 py-2" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandPrimitive.Input
                ref={setRefs}
                disabled={disabled}
                className={cn(
                    "flex h-10 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                    clearable && "pr-8",
                    className
                )}
                onInput={(event) => {
                    setHasValue(Boolean(event.currentTarget.value))
                    onInput?.(event)
                }}
                onValueChange={onValueChange}
                {...props}
            />
            {clearable && hasValue && !disabled ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            aria-label={clearLabel}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={handleClear}
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>{clearLabel}</TooltipContent>
                </Tooltip>
            ) : null}
        </div>
    )
})
CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.List
        ref={ref}
        className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
        {...props}
    />
))
CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Empty>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
    <CommandPrimitive.Empty
        ref={ref}
        className="py-6 text-center text-sm"
        {...props}
    />
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Group>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Group
        ref={ref}
        className={cn(
            "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground",
            className
        )}
        {...props}
    />
))
CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Separator
        ref={ref}
        className={cn("-mx-1 h-px bg-border", className)}
        {...props}
    />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

type CommandItemProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> & {
    disabledReason?: React.ReactNode
    disabledReasonLabel?: string
}

const CommandItem = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Item>,
    CommandItemProps
>(({ className, disabledReason, disabledReasonLabel, disabled, ...props }, ref) => {
    const item = (
        <CommandPrimitive.Item
            ref={ref}
            disabled={disabled}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
                className
            )}
            {...props}
        />
    )

    if (!disabled || !disabledReason) return item

    const label =
        disabledReasonLabel ?? (typeof disabledReason === "string" ? disabledReason : "Disabled item reason")

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="block rounded-sm" tabIndex={0} aria-label={label}>
                    {item}
                </span>
            </TooltipTrigger>
            <TooltipContent>{disabledReason}</TooltipContent>
        </Tooltip>
    )
})
CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn(
                "ml-auto text-xs tracking-widest text-muted-foreground",
                className
            )}
            {...props}
        />
    )
}
CommandShortcut.displayName = "CommandShortcut"

export {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator,
}
