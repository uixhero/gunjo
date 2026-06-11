"use client";

import {
    SparklineChartDemo,
    useChartPreviewReference,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues();
    const showReference = useChartPreviewReference();

    return (
        <div className="flex min-h-[280px] w-full items-center justify-center p-4">
            <SparklineChartDemo values={values} showReference={showReference} />
        </div>
    );
}
