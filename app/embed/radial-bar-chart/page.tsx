"use client";

import {
    defaultRadialBarValues,
    RadialBarChartDemo,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues(defaultRadialBarValues);

    return (
        <div className="flex min-h-[500px] items-center justify-center p-4">
            <RadialBarChartDemo values={values} />
        </div>
    );
}
