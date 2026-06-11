"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview, type UsedComponent } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import inputsMetadata from "@design/inputs-metadata.json";
import type * as React from "react";

type ComponentState = {
    key: string;
    title: string;
    description: string;
    preview: React.ReactNode;
    previewHeight?: number;
    code: string;
};

type PropRow = {
    name: string;
    type: string;
    default?: string;
    description: string;
};

type InputCompositionDocPageProps = {
    metadataKey: string;
    title?: string;
    description?: string;
    embedSrc: string;
    preview: React.ReactNode;
    code: string;
    usageCode: string;
    propsData: PropRow[];
    states: ComponentState[];
    usedComponents: UsedComponent[];
    relatedComponents: UsedComponent[];
    previewBodyWidth?: "sm" | "md" | "lg" | "xl" | "full";
};

export function InputCompositionDocPage({
    metadataKey,
    title,
    description,
    embedSrc,
    preview,
    code,
    usageCode,
    propsData,
    states,
    usedComponents,
    relatedComponents,
    previewBodyWidth = "md",
}: InputCompositionDocPageProps) {
    const { locale, sectionLabels } = useLocale();
    const metadata = inputsMetadata as Record<string, { title: string; description: string }>;
    const componentMetadata = metadata[metadataKey];

    return (
        <ComponentLayout
            title={title ?? componentMetadata.title}
            description={description ?? componentMetadata.description}
            sectionLabels={sectionLabels}
            usedComponents={usedComponents}
            relatedComponents={relatedComponents}
        >
            <ComponentPreview
                embedSrc={embedSrc}
                code={code}
                codeBlock={<CodeBlock code={code} />}
                sectionLabels={sectionLabels}
                previewBodyWidth={previewBodyWidth}
            >
                {preview}
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates states={states} />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={usageCode} />
                </div>
            </section>
        </ComponentLayout>
    );
}
