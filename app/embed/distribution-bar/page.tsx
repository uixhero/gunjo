"use client";

import {
    DistributionBarDemo,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues();

    return (
        <div className="flex min-h-[280px] items-center justify-center p-4">
            <DistributionBarDemo values={values} />
        </div>
    );
}
