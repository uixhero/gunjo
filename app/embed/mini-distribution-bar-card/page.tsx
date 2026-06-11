"use client";

import {
    defaultMiniDistributionSelectionValues,
    MiniDistributionBarCardDemo,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues(defaultMiniDistributionSelectionValues);

    return (
        <div className="flex min-h-[380px] w-full items-center justify-center p-4">
            <MiniDistributionBarCardDemo values={values} />
        </div>
    );
}
