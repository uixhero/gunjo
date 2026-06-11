"use client";

import {
    defaultLabeledDonutSelectionValues,
    LabeledDonutCardDemo,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues(defaultLabeledDonutSelectionValues);

    return (
        <div className="flex min-h-[420px] w-full items-center justify-center p-4">
            <LabeledDonutCardDemo values={values} />
        </div>
    );
}
