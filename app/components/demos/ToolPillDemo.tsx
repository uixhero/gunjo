"use client";

import { ToolPill } from "@gunjo/ui";
import {
    IconCopy as Copy,
    IconPlus as Plus,
    IconTrash as Trash,
} from "@tabler/icons-react";

export function ToolPillDemo() {
    return (
        <div className="flex items-center gap-4">
            <ToolPill icon={Plus} label="Add" onClick={() => { }} />
            <ToolPill icon={Copy} label="Copy" isActive onClick={() => { }} />
            <ToolPill icon={Trash} label="Delete" variant="danger" onClick={() => { }} />
        </div>
    );
}
