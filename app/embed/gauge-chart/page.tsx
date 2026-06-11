"use client";

import {
    chartDeltaBaselines,
    GaugeChartDemo,
    useChartPreviewBaseline,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

const defaultGaugeValues = [82, 82, 82, 82, 82, 82];

export default function Embed() {
    const values = useChartPreviewValues(defaultGaugeValues);
    const baseline = useChartPreviewBaseline(chartDeltaBaselines.previousGaugeScore);

    return (
        <div className="flex min-h-[320px] w-full items-center justify-center p-4">
            <GaugeChartDemo values={values} baseline={baseline} />
        </div>
    );
}
