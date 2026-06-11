"use client";

import {
    defaultLineChartValues,
    LineChartDemo,
    useChartPreviewReference,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues(defaultLineChartValues);
    const showReference = useChartPreviewReference();

    return (
        <div className="flex min-h-[520px] w-full items-center justify-center p-4">
            <LineChartDemo values={values} showReference={showReference} />
        </div>
    );
}
