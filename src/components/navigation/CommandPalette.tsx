"use client"

import * as React from "react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "./Command"
import { cn } from "../../lib/utils"

export interface CommandPaletteAction {
    id: string
    label: string
    icon?: React.ReactNode
    shortcut?: string
    action: () => void
}

export interface CommandPaletteGroup {
    heading: string
    items: CommandPaletteAction[]
}

export interface CommandPaletteProps extends Omit<React.ComponentPropsWithoutRef<typeof CommandDialog>, "children"> {
    groups: CommandPaletteGroup[]
    placeholder?: string
    emptyMessage?: React.ReactNode
    dialogTitle?: React.ReactNode
    clearLabel?: string
}

export function CommandPalette({
    groups,
    placeholder = "Type a command or search...",
    emptyMessage = "No results found.",
    dialogTitle = "Command Menu",
    clearLabel = "Clear search",
    className,
    contentClassName,
    ...props
}: CommandPaletteProps) {
    return (
        <CommandDialog
            dialogTitle={dialogTitle}
            className={cn("flex-col w-[480px] w-full max-h-[min(32rem,calc(100%-2rem))] rounded-lg border", className)}
            contentClassName={cn("max-w-[640px]", contentClassName)}
            {...props}
        >
            <CommandInput placeholder={placeholder} clearable clearLabel={clearLabel} autoFocus />
            <CommandList>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                {groups.map((group, groupIndex) => (
                    <React.Fragment key={group.heading}>
                        <CommandGroup heading={group.heading}>
                            {group.items.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={item.id}
                                    keywords={[item.label, item.shortcut].filter(Boolean) as string[]}
                                    onSelect={item.action}
                                >
                                    {item.icon ? (
                                        <span className="mr-2 flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4">
                                            {item.icon}
                                        </span>
                                    ) : null}
                                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                                    {item.shortcut ? <CommandShortcut>{item.shortcut}</CommandShortcut> : null}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        {groupIndex < groups.length - 1 ? <CommandSeparator /> : null}
                    </React.Fragment>
                ))}
            </CommandList>
        </CommandDialog>
    )
}
