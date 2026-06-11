"use client";

import {
    ChartLegendDemo,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues();

    return (
        <div className="flex min-h-[320px] items-center justify-center p-4">
            <ChartLegendDemo values={values} />
        </div>
    );
}
