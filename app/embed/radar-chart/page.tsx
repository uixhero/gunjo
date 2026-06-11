"use client";

import {
    chartDeltaBaselines,
    RadarChartDemo,
    useChartPreviewBaseline,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues();
    const baseline = useChartPreviewBaseline(chartDeltaBaselines.referenceScore);

    return (
        <div className="flex min-h-[360px] w-full items-center justify-center p-4">
            <RadarChartDemo values={values} baseline={baseline} />
        </div>
    );
}
