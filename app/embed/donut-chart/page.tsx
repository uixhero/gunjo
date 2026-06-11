"use client";

import {
    DonutChartDemo,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues();

    return (
        <div className="flex min-h-[360px] items-center justify-center p-4">
            <DonutChartDemo values={values} />
        </div>
    );
}
