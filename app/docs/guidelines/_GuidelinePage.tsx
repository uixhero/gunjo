"use client";

import {
    Badge,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    DocNote,
    Separator,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

type LocalizedText = {
    ja: string;
    en: string;
};

type GuidelineItem = {
    title: LocalizedText;
    body: LocalizedText;
};

type GuidelineExample = {
    context: LocalizedText;
    avoid: LocalizedText;
    prefer: LocalizedText;
    reason: LocalizedText;
};

type GuidelineSection = {
    eyebrow?: LocalizedText;
    title: LocalizedText;
    body?: LocalizedText;
    note?: LocalizedText;
    items: GuidelineItem[];
    steps?: GuidelineItem[];
    examples?: GuidelineExample[];
    checklist?: GuidelineItem[];
};

export interface GuidelinePageProps {
    badge: LocalizedText;
    title: LocalizedText;
    description: LocalizedText;
    sections: GuidelineSection[];
}

export function GuidelinePage({
    badge,
    title,
    description,
    sections,
}: GuidelinePageProps) {
    const { locale } = useLocale();
    const lang = locale === "ja" ? "ja" : "en";

    return (
        <article className="space-y-10">
            <header className="space-y-4 border-b border-border/40 pb-8">
                <Badge variant="outline">{badge[lang]}</Badge>
                <div className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight">
                        {title[lang]}
                    </h1>
                    <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
                        {description[lang]}
                    </p>
                </div>
            </header>

            <div className="space-y-10">
                {sections.map((section) => (
                    <section key={section.title.en} className="space-y-4">
                        <div className="space-y-2">
                            {section.eyebrow ? (
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                    {section.eyebrow[lang]}
                                </p>
                            ) : null}
                            <h2 className="text-2xl font-semibold tracking-tight">
                                {section.title[lang]}
                            </h2>
                            {section.body ? (
                                <p className="max-w-3xl leading-7 text-muted-foreground">
                                    {section.body[lang]}
                                </p>
                            ) : null}
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {section.items.map((item) => (
                                <Card key={item.title.en} className="h-full">
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            {item.title[lang]}
                                        </CardTitle>
                                        <CardDescription className="leading-6">
                                            {item.body[lang]}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                        {section.steps?.length ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        {lang === "ja"
                                            ? "判断フロー"
                                            : "Decision flow"}
                                    </CardTitle>
                                    <CardDescription>
                                        {lang === "ja"
                                            ? "上から順に確認し、途中で判断できる場合はそこで決めます。"
                                            : "Read from top to bottom and stop when the decision is clear."}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="space-y-4">
                                        {section.steps.map((step, index) => (
                                            <li
                                                key={step.title.en}
                                                className="grid gap-3 rounded-md border border-border/70 p-4 sm:grid-cols-[2.5rem_1fr]"
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    className="flex size-9 items-center justify-center rounded-md text-sm"
                                                >
                                                    {index + 1}
                                                </Badge>
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold">
                                                        {step.title[lang]}
                                                    </h3>
                                                    <p className="text-sm leading-6 text-muted-foreground">
                                                        {step.body[lang]}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </CardContent>
                            </Card>
                        ) : null}
                        {section.examples?.length ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        {lang === "ja"
                                            ? "判断例"
                                            : "Decision examples"}
                                    </CardTitle>
                                    <CardDescription>
                                        {lang === "ja"
                                            ? "抽象的な原則を、実装・レビュー時の具体的な判断に落とします。"
                                            : "Translate abstract rules into concrete implementation and review decisions."}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    {lang === "ja"
                                                        ? "場面"
                                                        : "Context"}
                                                </TableHead>
                                                <TableHead>
                                                    {lang === "ja"
                                                        ? "避ける"
                                                        : "Avoid"}
                                                </TableHead>
                                                <TableHead>
                                                    {lang === "ja"
                                                        ? "推奨"
                                                        : "Prefer"}
                                                </TableHead>
                                                <TableHead>
                                                    {lang === "ja"
                                                        ? "理由"
                                                        : "Reason"}
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {section.examples.map((example) => (
                                                <TableRow
                                                    key={example.context.en}
                                                >
                                                    <TableCell className="font-medium">
                                                        {example.context[lang]}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {example.avoid[lang]}
                                                    </TableCell>
                                                    <TableCell>
                                                        {example.prefer[lang]}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {example.reason[lang]}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        ) : null}
                        {section.checklist?.length ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        {lang === "ja"
                                            ? "確認チェック"
                                            : "Review checklist"}
                                    </CardTitle>
                                    <CardDescription>
                                        {lang === "ja"
                                            ? "PR 前、または人間の目視確認前に見る項目です。"
                                            : "Use this before opening a PR or before human visual review."}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="grid gap-3 md:grid-cols-2">
                                        {section.checklist.map((item) => (
                                            <li
                                                key={item.title.en}
                                                className="rounded-md border border-border/70 p-4"
                                            >
                                                <p className="font-medium">
                                                    {item.title[lang]}
                                                </p>
                                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                                    {item.body[lang]}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ) : null}
                        {section.note ? (
                            <DocNote>{section.note[lang]}</DocNote>
                        ) : null}
                    </section>
                ))}
            </div>

            <Separator />
            <Card>
                <CardContent className="pt-6 text-sm leading-7 text-muted-foreground">
                    {lang === "ja"
                        ? "このガイドは固定ルールではなく、GunjoUI のコンポーネントや docs で繰り返し確認する判断基準です。迷った場合は、既存コンポーネント、SSOT、アクセシビリティ、プレビューとコードの一致を優先します。"
                        : "These guides are decision rules for GunjoUI components and docs, not a static rulebook. When in doubt, prefer existing components, SSOT alignment, accessibility, and preview-code parity."}
                </CardContent>
            </Card>
        </article>
    );
}
