"use client";

import {
    defaultSegmentedGaugeSelectionValues,
    SegmentedGaugeCardDemo,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues(defaultSegmentedGaugeSelectionValues);

    return (
        <div className="flex min-h-[420px] w-full items-center justify-center p-4">
            <SegmentedGaugeCardDemo values={values} />
        </div>
    );
}
