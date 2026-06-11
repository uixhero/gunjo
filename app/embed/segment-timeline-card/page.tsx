"use client";

import {
    SegmentTimelineCardDemo,
    useSegmentTimelinePreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useSegmentTimelinePreviewValues();

    return (
        <div className="flex min-h-[420px] w-full items-center justify-center p-4">
            <SegmentTimelineCardDemo values={values} />
        </div>
    );
}
