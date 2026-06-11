"use client";

import {
    ChoroplethMapDemo,
    defaultChoroplethSelectionValues,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues(defaultChoroplethSelectionValues);

    return (
        <div className="flex min-h-[480px] w-full items-center justify-center p-4">
            <ChoroplethMapDemo values={values} />
        </div>
    );
}
