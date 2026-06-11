"use client";

import * as React from "react";
import {
    Avatar,
    AvatarFallback,
    Sidebar,
    SidebarBody,
    SidebarFooter,
    SidebarHeader,
    SidebarProvider,
    SidebarToggle,
    useSidebar,
} from "@gunjo/ui";

const NAV_ITEMS = [
    { id: "dashboard", icon: "📊", label: "Dashboard", active: true },
    { id: "projects", icon: "📁", label: "Projects" },
    { id: "team", icon: "👥", label: "Team" },
    { id: "settings", icon: "⚙️", label: "Settings" },
];

function SidebarBodyDemo() {
    const { collapsed } = useSidebar();
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="h-6 w-6 rounded bg-foreground" aria-hidden />
                {!collapsed && (
                    <span className="text-sm font-semibold">Workspace</span>
                )}
            </SidebarHeader>
            <SidebarBody>
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted ${
                            item.active ? "bg-muted font-medium" : ""
                        }`}
                    >
                        <span>{item.icon}</span>
                        {!collapsed && <span>{item.label}</span>}
                    </button>
                ))}
            </SidebarBody>
            <SidebarFooter>
                <Avatar className="h-6 w-6">
                    <AvatarFallback>HK</AvatarFallback>
                </Avatar>
                {!collapsed && <span className="text-sm">hikaby</span>}
            </SidebarFooter>
            <SidebarToggle />
        </Sidebar>
    );
}

export function SidebarDemo() {
    return (
        <div className="flex h-[400px] w-full overflow-hidden rounded-md border">
            <SidebarProvider>
                <SidebarBodyDemo />
            </SidebarProvider>
            <div className="flex-1 p-4 text-sm text-muted-foreground">
                Main content area. Toggle the sidebar with the chevron on the
                boundary.
            </div>
        </div>
    );
}
