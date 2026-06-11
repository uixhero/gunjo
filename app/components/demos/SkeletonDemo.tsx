"use client";

import { Skeleton } from "@gunjo/ui";

export function SkeletonDemo() {
    return (
        <div className="flex items-center gap-6">
            <Skeleton shape="circle" />
            <div className="flex flex-col gap-2">
                <Skeleton shape="rectangle" />
                <Skeleton shape="text" />
                <Skeleton shape="text" />
            </div>
        </div>
    );
}
