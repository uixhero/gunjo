"use client"

import * as React from "react"
import { IconBell as Bell, IconCheck as Check } from "@tabler/icons-react";
import { Button } from "../inputs/Button"
import { Popover, PopoverContent, PopoverTrigger } from "../overlay/Popover"
import { ScrollArea } from "../layout/ScrollArea"
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip"
import { cn } from "../../lib/utils"

export interface Notification {
    id: string
    title: string
    description: string
    timestamp: string
    read: boolean
}

export interface NotificationCenterLabels {
    toggle?: string
    title?: string
    clearAll?: string
    emptyTitle?: string
    markAsRead?: string
    viewHistory?: string
}

export interface NotificationCenterProps {
    notifications: Notification[]
    onMarkAsRead?: (id: string) => void
    onLinkClick?: (id: string) => void
    onClearAll?: () => void
    labels?: NotificationCenterLabels
}

const NotificationCenter = ({
    notifications,
    onMarkAsRead,
    onLinkClick,
    onClearAll,
    labels,
}: NotificationCenterProps) => {
    const unreadCount = notifications.filter((n) => !n.read).length
    const [isOpen, setIsOpen] = React.useState(false)
    const resolvedLabels: Required<NotificationCenterLabels> = {
        toggle: labels?.toggle ?? "Toggle notifications",
        title: labels?.title ?? "Notifications",
        clearAll: labels?.clearAll ?? "Clear all",
        emptyTitle: labels?.emptyTitle ?? "No notifications",
        markAsRead: labels?.markAsRead ?? "Mark as read",
        viewHistory: labels?.viewHistory ?? "View all notification history",
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <Tooltip>
                <PopoverTrigger asChild>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-muted-foreground hover:text-foreground"
                            aria-label={resolvedLabels.toggle}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                            )}
                        </Button>
                    </TooltipTrigger>
                </PopoverTrigger>
                <TooltipContent>{resolvedLabels.toggle}</TooltipContent>
            </Tooltip>
            <PopoverContent align="end" className="w-[320px] w-80 p-0" sideOffset={8}>
                <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/50 backdrop-blur">
                    <h4 className="font-semibold text-sm">{resolvedLabels.title}</h4>
                    {unreadCount > 0 && onClearAll && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 text-xs text-muted-foreground hover:text-foreground"
                            onClick={onClearAll}
                        >
                            {resolvedLabels.clearAll}
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center p-4 text-center text-muted-foreground">
                            <Bell className="h-8 w-8 mb-2 opacity-20" />
                            <p className="text-sm">{resolvedLabels.emptyTitle}</p>
                        </div>
                    ) : (
                        <div className="grid">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "flex flex-col gap-1 border-b p-4 text-sm transition-colors hover:bg-muted/50",
                                        !notification.read && "bg-primary-subtle"
                                    )}
                                    onClick={() => onLinkClick?.(notification.id)}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="font-medium leading-none text-foreground">
                                            {notification.title}
                                        </p>
                                        {!notification.read && onMarkAsRead && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 -mr-2 -mt-1 text-muted-foreground hover:text-primary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onMarkAsRead(notification.id);
                                                        }}
                                                        aria-label={resolvedLabels.markAsRead}
                                                    >
                                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>{resolvedLabels.markAsRead}</TooltipContent>
                                            </Tooltip>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground line-clamp-2">
                                        {notification.description}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {notification.timestamp}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="border-t p-2">
                    <Button variant="ghost" className="h-8 w-full text-xs text-muted-foreground hover:text-foreground">
                        {resolvedLabels.viewHistory}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
NotificationCenter.displayName = "NotificationCenter"

export { NotificationCenter }
