"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { DocNote, TextLink } from "@gunjo/ui";

const codeByLocale = {
    ja: `import { DocNote } from "@gunjo/ui";

export function Example() {
  return (
    <DocNote heading="GitHub Flavored Markdown の拡張">
      GFM は標準 Markdown に表、チェックリスト、取り消し線などを加えた記法です。
    </DocNote>
  );
}`,
    en: `import { DocNote } from "@gunjo/ui";

export function Example() {
  return (
    <DocNote heading="GitHub Flavored Markdown extensions">
      GFM extends standard Markdown with tables, task lists, strikethrough, and similar syntax.
    </DocNote>
  );
}`,
} as const;

const referenceCodeByLocale = {
    ja: `import { DocNote, TextLink } from "@gunjo/ui";

export function References() {
  return (
    <DocNote heading="参考文献" variant="reference">
      <TextLink href="https://www.w3.org/WAI/tutorials/images/decorative/" target="_blank" newTabLabel="新しいタブで開きます">
        W3C WAI: Decorative Images
      </TextLink>
    </DocNote>
  );
}`,
    en: `import { DocNote, TextLink } from "@gunjo/ui";

export function References() {
  return (
    <DocNote heading="References" variant="reference">
      <TextLink href="https://www.w3.org/WAI/tutorials/images/decorative/" target="_blank">
        W3C WAI: Decorative Images
      </TextLink>
    </DocNote>
  );
}`,
} as const;

const calloutCodeByLocale = {
    ja: `import { DocNote } from "@gunjo/ui";

const CALLOUTS = [
  {
    variant: "note",
    heading: "補足",
    body: "表の中では改行が使えません。長い説明は表の外に出します。",
  },
  {
    variant: "warning",
    heading: "注意",
    body: "生の HTML は既定で無効です。有効にすると入力がそのまま描画されます。",
  },
  {
    variant: "tip",
    heading: "コツ",
    body: "見出しは1段ずつ下げます。h2 の次に h4 を置くと読み上げの目次が飛びます。",
  },
] as const;

export function Callouts() {
  return (
    <div className="flex flex-col gap-3">
      {CALLOUTS.map((callout) => (
        <DocNote key={callout.variant} heading={callout.heading} variant={callout.variant}>
          {callout.body}
        </DocNote>
      ))}
    </div>
  );
}`,
    en: `import { DocNote } from "@gunjo/ui";

const CALLOUTS = [
  {
    variant: "note",
    heading: "Note",
    body: "Line breaks are not available inside tables. Move long explanations outside the table.",
  },
  {
    variant: "warning",
    heading: "Warning",
    body: "Raw HTML is disabled by default. Enabling it renders whatever the input contains.",
  },
  {
    variant: "tip",
    heading: "Tip",
    body: "Step headings down one level at a time; jumping h2 to h4 breaks the outline.",
  },
] as const;

export function Callouts() {
  return (
    <div className="flex flex-col gap-3">
      {CALLOUTS.map((callout) => (
        <DocNote key={callout.variant} heading={callout.heading} variant={callout.variant}>
          {callout.body}
        </DocNote>
      ))}
    </div>
  );
}`,
} as const;

const propsByLocale = {
    ja: [
        { name: "heading", type: "ReactNode", description: "注釈の短い見出しです。" },
        { name: "variant", type: "\"default\" | \"reference\" | \"note\" | \"warning\" | \"tip\"", default: "\"default\"", description: "補足説明・参考リンク・注意喚起（note / warning / tip）に合わせた見た目です。note 以降はアイコンと role=\"note\" が付きます。" },
        { name: "children", type: "ReactNode", required: true, description: "注釈本文です。" },
        { name: "className", type: "string", description: "必要に応じて外側に追加するクラスです。" },
    ],
    en: [
        { name: "heading", type: "ReactNode", description: "Short heading for the note." },
        { name: "variant", type: "\"default\" | \"reference\" | \"note\" | \"warning\" | \"tip\"", default: "\"default\"", description: "Visual style for explanation notes, reference links, or callouts. note, warning, and tip also add an icon and role=\"note\"." },
        { name: "children", type: "ReactNode", required: true, description: "Note body content." },
        { name: "className", type: "string", description: "Optional class added to the root element." },
    ],
} as const;

export default function DocNotePage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/doc-note", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const usageCode = codeByLocale[locale];
    const referenceCode = referenceCodeByLocale[locale];

    return (
        <ComponentLayout
            title={content?.title ?? meta.docNote.title}
            description={content?.description ?? meta.docNote.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "DocNote", href: "/docs/components/doc-note" },
                { name: "TextLink", href: "/docs/components/text-link" },
            ]}
            relatedComponents={[
                { name: "MarkdownRenderer", href: "/docs/components/markdown-renderer" },
                { name: "TextLink", href: "/docs/components/text-link" },
                { name: "Alert", href: "/docs/components/alert" },
                { name: "Card", href: "/docs/components/card" },
            ]}
        >
            <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} previewBodyWidth="md" previewHeight="auto">
                <DocNote heading={locale === "ja" ? "GitHub Flavored Markdown の拡張" : "GitHub Flavored Markdown extensions"} className="w-full">
                    {locale === "ja"
                        ? "GFM は標準 Markdown に表、チェックリスト、取り消し線などを加えた記法です。"
                        : "GFM extends standard Markdown with tables, task lists, strikethrough, and similar syntax."}
                </DocNote>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "default",
                            title: locale === "ja" ? "通常" : "Default",
                            description: locale === "ja"
                                ? "本文の流れを止めずに、補足説明や用語説明を背景色だけで本文から分けます。"
                                : "Separate supplemental explanation from body copy with a quiet background-only treatment.",
                            preview: (
                                <DocNote heading={locale === "ja" ? "GitHub Flavored Markdown の拡張" : "GitHub Flavored Markdown extensions"} className="w-full max-w-xl">
                                    {locale === "ja"
                                        ? "GFM は標準 Markdown に表、チェックリスト、取り消し線などを加えた記法です。"
                                        : "GFM extends standard Markdown with tables, task lists, strikethrough, and similar syntax."}
                                </DocNote>
                            ),
                            code: usageCode,
                        },
                        {
                            key: "reference",
                            title: locale === "ja" ? "参考リンク" : "Reference links",
                            description: locale === "ja"
                                ? "外部資料や判断根拠を本文から少し分けて示します。"
                                : "Separate source links or rationale from the main body copy.",
                            preview: (
                                <DocNote heading={locale === "ja" ? "参考文献" : "References"} variant="reference" className="w-full max-w-xl">
                                    <TextLink
                                        href="https://www.w3.org/WAI/tutorials/images/decorative/"
                                        target="_blank"
                                        newTabLabel={locale === "ja" ? "新しいタブで開きます" : "opens in a new tab"}
                                    >
                                        W3C WAI: Decorative Images
                                    </TextLink>
                                </DocNote>
                            ),
                            code: referenceCode,
                        },
                        {
                            key: "callouts",
                            title: locale === "ja" ? "注意喚起の3種" : "The three callouts",
                            description: locale === "ja"
                                ? "note・warning・tip はアイコンと role=\"note\" が付きます。種類が色だけに乗らないので、色が読めなくても区別できます。"
                                : "note, warning, and tip add an icon and role=\"note\", so the kind never rides on colour alone.",
                            preview: (
                                <div className="flex w-full max-w-xl flex-col gap-3">
                                    <DocNote heading={locale === "ja" ? "補足" : "Note"} variant="note">
                                        {locale === "ja"
                                            ? "表の中では改行が使えません。長い説明は表の外に出します。"
                                            : "Line breaks are not available inside tables. Move long explanations outside the table."}
                                    </DocNote>
                                    <DocNote heading={locale === "ja" ? "注意" : "Warning"} variant="warning">
                                        {locale === "ja"
                                            ? "生の HTML は既定で無効です。有効にすると入力がそのまま描画されます。"
                                            : "Raw HTML is disabled by default. Enabling it renders whatever the input contains."}
                                    </DocNote>
                                    <DocNote heading={locale === "ja" ? "コツ" : "Tip"} variant="tip">
                                        {locale === "ja"
                                            ? "見出しは1段ずつ下げます。h2 の次に h4 を置くと読み上げの目次が飛びます。"
                                            : "Step headings down one level at a time; jumping h2 to h4 breaks the screen-reader outline."}
                                    </DocNote>
                                </div>
                            ),
                            code: calloutCodeByLocale[locale],
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={usageCode} />
                </div>
            </div>
        </ComponentLayout>
    );
}
