"use client";

import * as React from "react";
import { ComponentPreview, type ViewportSize } from "@/components/doc/ComponentHelpers";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { useLocale } from "@/components/providers/LocaleProvider";

type PreviewBodyWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface DemoState {
    /** Stable id used for keys + heading anchor (e.g. "loading"). */
    key: string;
    /** Display title (e.g. "Loading", "Empty state", "With Tooltip"). */
    title: string;
    /**
     * Optional one-line description shown under the heading. Keeps each
     * state self-explanatory without forcing the reader into the code.
     */
    description?: string;
    /** Live demo for this state. */
    preview: React.ReactNode;
    /** Optional preview frame height for tall demos such as calendars. */
    previewHeight?: number | "auto";
    /** Disable iframe content-height syncing for contained overlays that should not push the docs page. */
    fitEmbedHeightContent?: boolean;
    /** Optional preview surface alignment / sizing override. */
    previewClassName?: string;
    /** Optional preview content width. Wide data components can use this to avoid false mobile/tablet wrapping in FIT mode. */
    previewBodyWidth?: PreviewBodyWidth;
    /** Optional embed URL for responsive demos that need real iframe viewport breakpoints. */
    embedSrc?: string;
    /** Optional viewport to use only in FIT mode for device-specific demos. */
    fitViewport?: ViewportSize;
    /** Self-contained code snippet a reader can drop into their project. */
    code: string;
}

export interface ComponentDemoStatesProps {
    states: DemoState[];
}

/**
 * Renders a vertical stack of named demo blocks — happy path, loading,
 * error, empty, composed, etc. Each block is its own ComponentPreview so
 * users can scan all the practical states for a component on one page.
 *
 * Use when a component has interesting integration-time states beyond a
 * single variant prop. Pair with ComponentControls for components where
 * users mainly want to flip a single dimension.
 */
export function ComponentDemoStates({ states }: ComponentDemoStatesProps) {
    const { sectionLabels } = useLocale();

    return (
        <div className="space-y-10" data-component-demo-states="true">
            {states.map((state) => (
                <section key={state.key} className="space-y-3">
                    <header className="space-y-1">
                        <h3
                            id={`demo-${state.key}`}
                            className="scroll-m-24 text-xl font-semibold tracking-tight"
                        >
                            {state.title}
                        </h3>
                        {state.description ? (
                            <p className="text-sm text-muted-foreground">
                                {state.description}
                            </p>
                        ) : null}
                    </header>
                    <ComponentPreview
                        code={state.code}
                        codeBlock={<CodeBlock code={state.code} />}
                        sectionLabels={sectionLabels}
                        previewHeight={state.previewHeight ?? "auto"}
                        fitEmbedHeightContent={state.fitEmbedHeightContent}
                        className={state.previewClassName}
                        previewBodyWidth={state.previewBodyWidth}
                        embedSrc={state.embedSrc}
                        fitViewport={state.fitViewport}
                    >
                        {state.preview}
                    </ComponentPreview>
                </section>
            ))}
        </div>
    );
}
