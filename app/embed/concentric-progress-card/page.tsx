"use client";

import {
    ConcentricProgressCardDemo,
    defaultConcentricProgressSelectionValues,
    useChartPreviewValues,
} from "@/components/demos/ChartComponentsDemo";

export default function Embed() {
    const values = useChartPreviewValues(defaultConcentricProgressSelectionValues, 1024);

    return (
        <div className="flex min-h-[520px] items-center justify-center p-4">
            <ConcentricProgressCardDemo values={values} />
        </div>
    );
}
