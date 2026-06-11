"use client";

import {
    FormControl,
    FormDescription,
    FormGroup,
    FormLabel,
    Progress,
    Select,
    Slider,
    Spinner,
} from "@gunjo/ui";
import { useState, useEffect } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";

export function SpinnerDemo() {
    return (
        <div className="flex items-center gap-4">
            <Spinner size="sm" />
            <Spinner />
            <Spinner size="lg" />
        </div>
    );
}

export function SliderDemo() {
    const { locale } = useLocale();
    const [volume, setVolume] = useState(50);

    return (
        <FormGroup className="w-full max-w-sm">
            <div className="flex items-center justify-between gap-3">
                <FormLabel htmlFor="preview-volume">{locale === "ja" ? "音量" : "Volume"}</FormLabel>
                <span className="font-mono text-sm text-muted-foreground">{volume}%</span>
            </div>
            <FormControl>
                <Slider id="preview-volume" value={volume} onValueChange={setVolume} max={100} step={1} className="w-full" />
            </FormControl>
            <FormDescription>
                {locale === "ja" ? "ドラッグまたはキーボードで値を調整します。" : "Drag or use the keyboard to adjust the value."}
            </FormDescription>
        </FormGroup>
    )
}

export function ProgressDemo() {
    const [progress, setProgress] = useState(13)

    useEffect(() => {
        const timer = setTimeout(() => setProgress(66), 500)
        return () => clearTimeout(timer)
    }, [])

    return <Progress value={progress} className="w-[60%]" />
}

export function SelectDemo() {
    const { locale } = useLocale();

    return (
        <FormGroup className="w-full max-w-sm">
            <FormLabel htmlFor="fruit">{locale === "ja" ? "フルーツ" : "Fruit"}</FormLabel>
            <FormControl>
                <Select id="fruit" className="w-full">
                    <option value="">{locale === "ja" ? "選択してください" : "Select an option"}</option>
                    <option value="apple">{locale === "ja" ? "りんご" : "Apple"}</option>
                    <option value="banana">{locale === "ja" ? "バナナ" : "Banana"}</option>
                    <option value="blueberry">{locale === "ja" ? "ブルーベリー" : "Blueberry"}</option>
                    <option value="grapes">{locale === "ja" ? "ぶどう" : "Grapes"}</option>
                    <option value="pineapple">{locale === "ja" ? "パイナップル" : "Pineapple"}</option>
                </Select>
            </FormControl>
            <FormDescription>
                {locale === "ja" ? "他の入力欄と同じ幅で使える標準のセレクトです。" : "Native select with the same field width as other inputs."}
            </FormDescription>
        </FormGroup>
    )
}
