"use client";

import {
    chartDeltaBaselines,
    defaultHeatmapSelectionValues,
    HeatmapChartDemo,
    useChartPreviewBaseline,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues(defaultHeatmapSelectionValues);
    const baseline = useChartPreviewBaseline(chartDeltaBaselines.referenceScore);

    return (
        <div className="flex min-h-[360px] w-full items-center justify-center p-4">
            <HeatmapChartDemo values={values} baseline={baseline} />
        </div>
    );
}
