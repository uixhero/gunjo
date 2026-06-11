"use client";

import * as React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
    HStack,
    NumberInput,
    RangeSlider,
} from "@gunjo/ui";

export function RangeSliderDemo() {
    const { locale } = useLocale();
    const [range, setRange] = React.useState<[number, number]>([24, 72]);
    const minLabel = locale === "ja" ? "最小値" : "Minimum";
    const maxLabel = locale === "ja" ? "最大値" : "Maximum";

    return (
        <FormGroup className="w-full max-w-sm">
            <HStack justify="between">
                <FormLabel htmlFor="price-range">{locale === "ja" ? "価格帯" : "Price range"}</FormLabel>
                <span className="font-mono text-sm text-muted-foreground">
                    {range[0]} - {range[1]}
                </span>
            </HStack>
            <FormControl>
                <RangeSlider
                    id="price-range"
                    className="w-full"
                    value={range}
                    onValueChange={setRange}
                    min={0}
                    max={100}
                    step={1}
                    minLabel={minLabel}
                    maxLabel={maxLabel}
                />
            </FormControl>
            <div className="grid grid-cols-2 gap-2">
                <NumberInput
                    value={range[0]}
                    min={0}
                    max={range[1]}
                    onValueChange={(value) => setRange([Math.min(value, range[1]), range[1]])}
                    aria-label={minLabel}
                    incrementLabel={locale === "ja" ? "最小値を増やす" : "Increase minimum"}
                    decrementLabel={locale === "ja" ? "最小値を減らす" : "Decrease minimum"}
                />
                <NumberInput
                    value={range[1]}
                    min={range[0]}
                    max={100}
                    onValueChange={(value) => setRange([range[0], Math.max(value, range[0])])}
                    aria-label={maxLabel}
                    incrementLabel={locale === "ja" ? "最大値を増やす" : "Increase maximum"}
                    decrementLabel={locale === "ja" ? "最大値を減らす" : "Decrease maximum"}
                />
            </div>
            <FormDescription>
                {locale === "ja"
                    ? "2つのつまみ、または連動する入力欄で範囲を指定します。"
                    : "Use two thumbs or linked inputs to set a bounded range."}
            </FormDescription>
        </FormGroup>
    );
}
