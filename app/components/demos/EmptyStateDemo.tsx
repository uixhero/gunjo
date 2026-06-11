"use client";

import { Button, EmptyState } from "@gunjo/ui";
import { IconFolderOpen as FolderOpen } from "@tabler/icons-react";

export function EmptyStateDemo() {
    return (
        <div className="w-full max-w-sm">
            <EmptyState
                icon={<FolderOpen className="h-5 w-5" />}
                title="No projects yet"
                description="Get started by creating a project."
                action={<Button size="sm">+ New project</Button>}
            />
        </div>
    );
}
