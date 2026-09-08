"use client";

import * as React from "react";
import Link from "next/link";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";
import { Badge, ListCard, Tag } from "@gunjo/ui";
import type { BadgeProps } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    findingLinkHref,
    findingLinkKey,
    findingLinkLabel,
    isExternalFindingLink,
} from "@/lib/cold-test-findings";
import type { FindingKind, FindingLink, FindingStatus } from "@/lib/cold-test-findings";

/**
 * One finding, flattened for rendering. The round page and the industry door
 * page build this from the same JSON — the door page merges the rounds of a
 * grouped finding into `rounds`, the round page passes only the *other* rounds
 * that hit the same thing (linking a round page to itself is noise).
 */
export interface FindingCardModel {
    id: string;
    kind: FindingKind;
    status: FindingStatus;
    phenomenon: string;
    screen: string;
    spot: string;
    cause?: string;
    selfCheck?: string;
    links: FindingLink[];
    rounds: number[];
}

// Status is carried by the written badge alone. ListCard `severity` (a
// full-perimeter border + tint since PR #871) would read as urgency these
// mostly-resolved rows don't have.
const STATUS_BADGE: Record<FindingStatus, NonNullable<BadgeProps["variant"]>> = {
    resolved: "success",
    "fix-known": "warning",
    tracking: "info",
};

function FindingChip({
    href,
    label,
    external,
}: {
    href: string;
    label: string;
    external: boolean;
}) {
    return (
        <Link
            href={href}
            className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
            <Tag
                variant="outline"
                size="sm"
                icon={external ? <ArrowUpRight /> : undefined}
                className="transition-colors hover:border-primary-border hover:text-primary"
            >
                {label}
            </Tag>
        </Link>
    );
}

export function FindingList({ items }: { items: FindingCardModel[] }) {
    const { pages } = useLocale();
    const tf = pages.coldTests.findings;

    if (items.length === 0) return null;

    return (
        <ul className="space-y-3">
            {items.map((item) => (
                <li key={item.id}>
                    <ListCard
                        title={item.phenomenon}
                        status={
                            <Badge
                                variant={STATUS_BADGE[item.status]}
                                className="whitespace-nowrap text-[11px]"
                            >
                                <span className="sr-only">{tf.statusPrefix} </span>
                                {tf.status[item.status]}
                            </Badge>
                        }
                        description={
                            <>
                                <span className="block">
                                    {tf.whereText(item.screen, item.spot)}
                                </span>
                                {item.cause ? (
                                    <span className="mt-1 block">
                                        <span className="font-medium text-foreground">
                                            {tf.causeLabel}
                                        </span>{" "}
                                        {item.cause}
                                    </span>
                                ) : null}
                                {item.selfCheck ? (
                                    <span className="mt-1 block">
                                        <span className="font-medium text-foreground">
                                            {tf.selfCheckLabel}
                                        </span>{" "}
                                        {item.selfCheck}
                                    </span>
                                ) : null}
                            </>
                        }
                        tags={
                            item.rounds.length > 0 || item.links.length > 0 ? (
                                <>
                                    <span className="text-xs text-muted-foreground">
                                        {tf.evidenceLabel}
                                    </span>
                                    {item.rounds.map((round) => (
                                        <FindingChip
                                            key={`round-${round}`}
                                            href={`/cold-tests/${round}`}
                                            label={tf.roundLinkLabel(round)}
                                            external={false}
                                        />
                                    ))}
                                    {item.links.map((link) => (
                                        <FindingChip
                                            key={findingLinkKey(link)}
                                            href={findingLinkHref(link)}
                                            label={findingLinkLabel(link)}
                                            external={isExternalFindingLink(link)}
                                        />
                                    ))}
                                </>
                            ) : null
                        }
                    />
                </li>
            ))}
        </ul>
    );
}
