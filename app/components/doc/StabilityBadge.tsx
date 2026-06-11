"use client";

import * as React from "react";
import Link from "next/link";
import { Badge, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { StabilityLevel } from "@/lib/component-spec-builder";

interface StabilityBadgeProps {
    level: StabilityLevel;
}

const VARIANT_BY_LEVEL: Record<
    StabilityLevel,
    "default" | "secondary" | "outline"
> = {
    stable: "default",
    beta: "secondary",
    experimental: "outline",
};

export function StabilityBadge({ level }: StabilityBadgeProps) {
    const { stabilityBadge: strings } = useLocale();
    const labels = strings.labels[level];

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href="/docs/stability"
                    className="inline-flex items-center"
                    aria-label={`${labels.label} — ${labels.tooltip}`}
                >
                    <Badge variant={VARIANT_BY_LEVEL[level]}>{labels.label}</Badge>
                </Link>
            </TooltipTrigger>
            <TooltipContent>
                <span className="block max-w-xs text-xs leading-relaxed">
                    {labels.tooltip}
                </span>
            </TooltipContent>
        </Tooltip>
    );
}
