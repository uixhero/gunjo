"use client";

import { SidebarItem } from "@gunjo/ui";
import {
    IconFolder as Folder,
    IconPhoto as Image,
    IconVideo as FileVideo,
} from "@tabler/icons-react";
import { useState } from "react";

export function SidebarItemDemo() {
    const [activeId, setActiveId] = useState("item-1");
    const [expanded, setExpanded] = useState<Record<string, boolean>>({ "item-1": true });

    const toggleExpand = (id: string) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="w-64 rounded-lg border border-border bg-muted/50 p-2">
            <SidebarItem
                id="item-1"
                icon={<Folder size={16} />}
                label="Projects"
                count={3}
                isActive={activeId === "item-1"}
                onClick={() => setActiveId("item-1")}
                hasChildren
                isExpanded={expanded["item-1"]}
                onToggleExpand={() => toggleExpand("item-1")}
            />

            {expanded["item-1"] && (
                <>
                    <SidebarItem
                        id="item-1-1"
                        level={1}
                        icon={<Image size={16} />}
                        label="Banner A"
                        isActive={activeId === "item-1-1"}
                        onClick={() => setActiveId("item-1-1")}
                    />
                    <SidebarItem
                        id="item-1-2"
                        level={1}
                        icon={<FileVideo size={16} />}
                        label="Promo Video"
                        isActive={activeId === "item-1-2"}
                        onClick={() => setActiveId("item-1-2")}
                    />
                </>
            )}

            <SidebarItem
                id="item-2"
                icon={<Trash2DemoIcon />}
                label="Trash"
                isActive={activeId === "item-2"}
                onClick={() => setActiveId("item-2")}
                onDelete={() => alert("Deleted!")}
            />
        </div>
    );
}

function Trash2DemoIcon() {
    // Lucide Trash2 wrapper to avoid import colllision if needed, or simple direct usage
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
    )
}
