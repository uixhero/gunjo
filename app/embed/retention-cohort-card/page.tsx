"use client";

import {
    defaultRetentionCohortSelectionValues,
    RetentionCohortCardDemo,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues(defaultRetentionCohortSelectionValues);

    return (
        <div className="flex min-h-[420px] w-full items-center justify-center p-4">
            <RetentionCohortCardDemo values={values} />
        </div>
    );
}
