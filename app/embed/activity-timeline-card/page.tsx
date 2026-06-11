"use client";

import {
    ActivityTimelineCardDemo,
    defaultActivityTimelineSelectionValues,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues(defaultActivityTimelineSelectionValues);

    return (
        <div className="flex min-h-[420px] items-center justify-center p-4">
            <ActivityTimelineCardDemo values={values} />
        </div>
    );
}
