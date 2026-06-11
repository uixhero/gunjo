"use client";

import {
    Timeline,
    TimelineDescription,
    TimelineItem,
    TimelineTime,
    TimelineTitle,
} from "@gunjo/ui";

export function TimelineDemo() {
    return (
        <div className="w-full max-w-md">
            <Timeline>
                <TimelineItem variant="default">
                    <TimelineTime dateTime="2026-05-01">May 1, 2026</TimelineTime>
                    <TimelineTitle>Project created</TimelineTitle>
                    <TimelineDescription>
                        Initial commit and CI configured.
                    </TimelineDescription>
                </TimelineItem>
                <TimelineItem variant="active">
                    <TimelineTime dateTime="2026-05-04">May 4, 2026</TimelineTime>
                    <TimelineTitle>First npm publish</TimelineTitle>
                    <TimelineDescription>
                        @gunjo/ui@0.0.1-alpha.0 released to npm.
                    </TimelineDescription>
                </TimelineItem>
                <TimelineItem variant="outline" connector={false}>
                    <TimelineTime dateTime="2026-05-05">May 5, 2026</TimelineTime>
                    <TimelineTitle>Component expansion</TimelineTitle>
                    <TimelineDescription>
                        Tier 1 + Tier 2 components added (28/42).
                    </TimelineDescription>
                </TimelineItem>
            </Timeline>
        </div>
    );
}
