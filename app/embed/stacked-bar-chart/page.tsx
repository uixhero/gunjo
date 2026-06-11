"use client";

import {
    defaultStackedBarValues,
    StackedBarChartDemo,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues(defaultStackedBarValues);

    return (
        <div className="flex min-h-[620px] w-full items-center justify-center p-4">
            <StackedBarChartDemo values={values} />
        </div>
    );
}
