"use client";

import {
    AnalyticsCardDemo,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues();

    return (
        <div className="flex min-h-[560px] items-center justify-center p-4">
            <AnalyticsCardDemo values={values} />
        </div>
    );
}
