"use client";

import * as React from "react";
import { CodeCopyButton, ComponentLayout } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates, type DemoState } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ChartPreviewWithControls } from "@/components/doc/ChartPreviewWithControls";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { UixheroLink } from "@/lib/uixhero-links";

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
    /**
     * "Design decisions" list items per locale, supplied by each page so the
     * UIXHERO reference it cites lives next to the component it is about.
     */
    designDecisions?: Record<Locale, React.ReactNode>;
    /**
     * このページが自分で持つ UIXHERO の記事リンク。ラベルが言語で変わるので
     * locale ごとに受け、「いつ・なぜ使うか（UIXHERO）」の節へ渡す。
     */
    uixheroLinks?: Record<Locale, UixheroLink[]>;
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
    designDecisions,
    uixheroLinks,
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
            uixheroLinks={uixheroLinks?.[locale]}
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

            {designDecisions ? (
                <section className="space-y-4">
                    <div className="border-b pb-2">
                        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                            {locale === "ja" ? "設計の判断" : "Design decisions"}
                        </h2>
                    </div>
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        {designDecisions[locale]}
                    </ul>
                </section>
            ) : null}
        </ComponentLayout>
    );
}
