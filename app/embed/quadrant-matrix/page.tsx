"use client";

import {
    chartDeltaBaselines,
    defaultQuadrantMatrixSelectionValues,
    QuadrantMatrixDemo,
    useChartPreviewBaseline,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues(defaultQuadrantMatrixSelectionValues);
    const baseline = useChartPreviewBaseline(chartDeltaBaselines.referenceScore);

    return (
        <div className="flex min-h-[420px] w-full items-center justify-center p-4">
            <QuadrantMatrixDemo values={values} baseline={baseline} />
        </div>
    );
}
