"use client";

import {
    BarChartDemo,
    useChartPreviewReference,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues();
    const showReference = useChartPreviewReference();

    return (
        <div className="flex min-h-[560px] items-center justify-center p-4">
            <BarChartDemo values={values} showReference={showReference} />
        </div>
    );
}
