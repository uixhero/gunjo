"use client";

import {
    defaultRibbonChartValues,
    RibbonChartDemo,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues(defaultRibbonChartValues);

    return (
        <div className="flex min-h-[520px] w-full items-center justify-center p-4">
            <RibbonChartDemo values={values} />
        </div>
    );
}
