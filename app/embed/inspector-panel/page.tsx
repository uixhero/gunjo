"use client";

import { Button, HStack, Input, InspectorField, InspectorPanel, InspectorSection, Switch } from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function Embed() {
    const { locale } = useLocale();

    return (
        <div className="grid place-items-center p-4">
            <InspectorPanel
                title={locale === "ja" ? "長方形 1" : "Rectangle 1"}
                className="h-[420px] w-[320px] rounded-lg border shadow-sm"
                footer={
                    <HStack justify="between" className="w-full">
                        <Button variant="ghost" size="sm">{locale === "ja" ? "リセット" : "Reset"}</Button>
                        <Button size="sm">{locale === "ja" ? "適用" : "Apply"}</Button>
                    </HStack>
                }
            >
                <InspectorSection title={locale === "ja" ? "レイアウト" : "Layout"}>
                    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2">
                        <InspectorField label="X"><Input defaultValue="24" className="h-8 w-full min-w-0" /></InspectorField>
                        <InspectorField label="Y"><Input defaultValue="48" className="h-8 w-full min-w-0" /></InspectorField>
                        <InspectorField label="W"><Input defaultValue="240" className="h-8 w-full min-w-0" /></InspectorField>
                        <InspectorField label="H"><Input defaultValue="160" className="h-8 w-full min-w-0" /></InspectorField>
                    </div>
                </InspectorSection>
                <InspectorSection title={locale === "ja" ? "外観" : "Appearance"}>
                    <InspectorField label={locale === "ja" ? "塗り" : "Fill"}>
                        <Input defaultValue="Primary" className="h-8 w-full min-w-0" />
                    </InspectorField>
                    <HStack justify="between">
                        <span className="text-xs text-foreground">{locale === "ja" ? "表示" : "Visible"}</span>
                        <Switch defaultChecked />
                    </HStack>
                </InspectorSection>
            </InspectorPanel>
        </div>
    );
}
