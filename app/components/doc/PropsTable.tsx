"use client";

import * as React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PropDef {
    name: string;
    type: string;
    default?: string;
    description: string;
}

interface PropsTableProps {
    data: readonly PropDef[];
}

export function PropsTable({ data }: PropsTableProps) {
    const { locale } = useLocale();
    const scrollRef = React.useRef<HTMLDivElement | null>(null);
    const [scrollState, setScrollState] = React.useState({
        canScroll: false,
        atStart: true,
        atEnd: true,
    });
    const labels = locale === "ja"
        ? {
            prop: "プロパティ",
            type: "型",
            default: "初期値",
            description: "説明",
        }
        : {
            prop: "Prop",
            type: "Type",
            default: "Default",
            description: "Description",
        };
    const scrollHint = locale === "ja" ? "表は横にスクロールできます" : "Scroll horizontally to view the table";
    const headerCellClassName =
        "border px-4 py-3 text-left font-bold whitespace-nowrap [&[align=center]]:text-center [&[align=right]]:text-right";
    const bodyCellClassName =
        "border px-4 py-3 text-left align-top whitespace-normal break-words [overflow-wrap:anywhere] [&[align=center]]:text-center [&[align=right]]:text-right";

    const updateScrollState = React.useCallback(() => {
        const element = scrollRef.current;
        if (!element) return;
        const maxScrollLeft = element.scrollWidth - element.clientWidth;
        setScrollState({
            canScroll: maxScrollLeft > 1,
            atStart: element.scrollLeft <= 1,
            atEnd: element.scrollLeft >= maxScrollLeft - 1,
        });
    }, []);

    React.useEffect(() => {
        updateScrollState();
        window.addEventListener("resize", updateScrollState);

        const element = scrollRef.current;
        if (!element || typeof ResizeObserver === "undefined") {
            return () => window.removeEventListener("resize", updateScrollState);
        }

        const observer = new ResizeObserver(updateScrollState);
        observer.observe(element);
        return () => {
            window.removeEventListener("resize", updateScrollState);
            observer.disconnect();
        };
    }, [data.length, updateScrollState]);

    return (
        <div className="my-6 space-y-2">
            <div className="flex items-center justify-end">
                <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground md:hidden">
                    {scrollHint}
                </span>
            </div>
            <div className="relative">
                {scrollState.canScroll && !scrollState.atStart ? (
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent" />
                ) : null}
                {scrollState.canScroll && !scrollState.atEnd ? (
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent" />
                ) : null}
                <div
                    ref={scrollRef}
                    className="w-full overflow-x-auto overflow-y-hidden rounded-md border border-border"
                    onScroll={updateScrollState}
                >
                    <table className="w-full min-w-[860px] table-fixed border-collapse">
                        <colgroup>
                            <col className="w-[180px]" />
                            <col className="w-[360px]" />
                            <col className="w-[120px]" />
                            <col className="w-[300px]" />
                        </colgroup>
                        <thead>
                            <tr className="m-0 border-t p-0 even:bg-muted">
                                <th className={headerCellClassName}>{labels.prop}</th>
                                <th className={headerCellClassName}>{labels.type}</th>
                                <th className={headerCellClassName}>{labels.default}</th>
                                <th className={headerCellClassName}>{labels.description}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((prop) => (
                                <tr key={prop.name} className="m-0 border-t p-0 even:bg-muted">
                                    <td className={`${bodyCellClassName} font-mono text-sm text-primary-strong`}>{prop.name}</td>
                                    <td className={`${bodyCellClassName} font-mono text-xs text-muted-foreground`}>{prop.type}</td>
                                    <td className={`${bodyCellClassName} font-mono text-xs`}>{prop.default || "-"}</td>
                                    <td className={`${bodyCellClassName} text-sm leading-relaxed`}>{prop.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
