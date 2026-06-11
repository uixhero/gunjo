"use client";

import * as React from "react";
import { TreeView, type TreeNode } from "@gunjo/ui";
import { IconFile as File, IconFolder as Folder } from "@tabler/icons-react";

const NODES: TreeNode[] = [
    {
        id: "src",
        label: "src",
        icon: <Folder className="h-4 w-4" />,
        children: [
            {
                id: "src/components",
                label: "components",
                icon: <Folder className="h-4 w-4" />,
                children: [
                    {
                        id: "src/components/Button.tsx",
                        label: "Button.tsx",
                        icon: <File className="h-4 w-4" />,
                    },
                    {
                        id: "src/components/Card.tsx",
                        label: "Card.tsx",
                        icon: <File className="h-4 w-4" />,
                    },
                ],
            },
            {
                id: "src/utils",
                label: "utils",
                icon: <Folder className="h-4 w-4" />,
                children: [
                    {
                        id: "src/utils/cn.ts",
                        label: "cn.ts",
                        icon: <File className="h-4 w-4" />,
                    },
                ],
            },
        ],
    },
    {
        id: "package.json",
        label: "package.json",
        icon: <File className="h-4 w-4" />,
    },
];

export function TreeViewDemo() {
    const [selected, setSelected] = React.useState<string>("");

    return (
        <div className="w-full max-w-xs">
            <TreeView
                nodes={NODES}
                defaultExpanded={["src", "src/components"]}
                selectedId={selected}
                onSelectedIdChange={setSelected}
                className="rounded-md border bg-background p-2"
            />
            {selected ? (
                <p className="mt-2 text-xs text-muted-foreground">
                    selected: {selected}
                </p>
            ) : null}
        </div>
    );
}
