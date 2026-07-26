"use client";

import * as React from "react";
import {
    Avatar,
    AvatarFallback,
    Sidebar,
    SidebarBody,
    SidebarFooter,
    SidebarHeader,
    SidebarItem,
    SidebarProvider,
    SidebarToggle,
    useSidebar,
} from "@gunjo/ui";

const NAV_ITEMS = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "projects", icon: "📁", label: "Projects" },
    { id: "team", icon: "👥", label: "Team" },
    { id: "settings", icon: "⚙️", label: "Settings" },
];

function SidebarBodyDemo() {
    const { collapsed } = useSidebar();
    const [active, setActive] = React.useState("dashboard");
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="h-6 w-6 shrink-0 rounded bg-foreground" aria-hidden />
                {!collapsed && (
                    <span className="text-sm font-semibold">Workspace</span>
                )}
            </SidebarHeader>
            <SidebarBody>
                {/* SidebarItem reads the collapse from the provider, so the
                    rows go icon-only with a tooltip on their own. */}
                {NAV_ITEMS.map((item) => (
                    <SidebarItem
                        key={item.id}
                        id={item.id}
                        icon={<span aria-hidden>{item.icon}</span>}
                        label={item.label}
                        isActive={active === item.id}
                        reserveChevronSpace={false}
                        onClick={() => setActive(item.id)}
                    />
                ))}
            </SidebarBody>
            <SidebarFooter>
                <Avatar className="h-6 w-6 shrink-0">
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
