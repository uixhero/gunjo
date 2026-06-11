"use client";

import { Icon } from "@gunjo/ui";
import { IconBell, IconCheck, IconChevronDown, IconSparkles } from "@tabler/icons-react";

export default function Embed() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="flex items-center gap-4 text-muted-foreground">
                <Icon icon={IconChevronDown} size="sm" />
                <Icon icon={IconCheck} size="md" className="text-success" />
                <Icon icon={IconBell} size="lg" className="text-primary" />
                <Icon icon={IconSparkles} size="xl" className="text-foreground" />
            </div>
        </div>
    );
}
