"use client";

import * as React from "react";
import { CodeCopyButton, ComponentLayout } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates, type DemoState } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ChartPreviewWithControls } from "@/components/doc/ChartPreviewWithControls";
import { useLocale } from "@/components/providers/LocaleProvider";

type Locale = "en" | "ja";

interface PropDef {
    name: string;
    type: string;
    default?: string;
    description: string;
}

interface DocLink {
    name: string;
    href: string;
}

interface ChartDocPageProps {
    title: Record<Locale, string>;
    description: Record<Locale, string>;
    code: Record<Locale, string>;
    usageCode: Record<Locale, string>;
    propsData: Record<Locale, readonly PropDef[]>;
    demo: React.ComponentProps<typeof ChartPreviewWithControls>["demo"];
    embedBase: string;
    previewHeight: number;
    states: Record<Locale, readonly DemoState[]>;
    usedComponents: Record<Locale, DocLink[]>;
    relatedComponents: Record<Locale, DocLink[]>;
}

export function ChartDocPage({
    title,
    description,
    code,
    usageCode,
    propsData,
    demo,
    embedBase,
    previewHeight,
    states,
    usedComponents,
    relatedComponents,
}: ChartDocPageProps) {
    const { locale, sectionLabels } = useLocale();
    const currentCode = code[locale];
    const currentUsageCode = usageCode[locale];

    return (
        <ComponentLayout
            title={title[locale]}
            description={description[locale]}
            sectionLabels={sectionLabels}
            usedComponents={usedComponents[locale]}
            relatedComponents={relatedComponents[locale]}
        >
            <ChartPreviewWithControls
                code={currentCode}
                demo={demo}
                embedBase={embedBase}
                previewHeight={previewHeight}
            />

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates states={[...states[locale]]} />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">{sectionLabels.props}</h2>
                <PropsTable data={propsData[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">{sectionLabels.usage}</h2>
                    <CodeCopyButton code={currentUsageCode} />
                </div>
                <CodeBlock code={currentUsageCode} />
            </div>
        </ComponentLayout>
    );
}
