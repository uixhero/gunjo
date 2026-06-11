"use client";

import {
    PieChartDemo,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues();

    return (
        <div className="flex min-h-[360px] w-full items-center justify-center p-4">
            <PieChartDemo values={values} />
        </div>
    );
}
