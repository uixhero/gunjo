"use client";

import {
    chartDeltaBaselines,
    ChartComponentsDemo,
    useChartPreviewBaseline,
    useChartPreviewReference,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues();
    const baseline = useChartPreviewBaseline(chartDeltaBaselines.referenceScore);
    const showReference = useChartPreviewReference();

    return (
        <div className="flex min-h-[900px] items-center justify-center p-4">
            <ChartComponentsDemo
                values={values}
                baseline={baseline}
                showReference={showReference}
            />
        </div>
    );
}
