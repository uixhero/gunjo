"use client";

import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import { getCategoryVariantUnionType } from "@/lib/docs-spec";
import displayMetadata from "@design/display-metadata.json";
import { ToolPill } from "@gunjo/ui";
import { IconArrowsMove as Move, IconCopy as Copy, IconEraser as Eraser, IconPencil as PenLine, IconPlus as Plus, IconPointer as MousePointer2, IconTrash as Trash2 } from "@tabler/icons-react";

const codeByLocale = {
    ja: `import { ToolPill } from "@gunjo/ui";
import { IconArrowsMove as Move, IconPencil as PenLine, IconPointer as MousePointer2, IconTrash as Trash2 } from "@tabler/icons-react";

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <ToolPill icon={MousePointer2} label="選択" isActive onClick={() => {}} />
      <ToolPill icon={Move} label="移動" onClick={() => {}} />
      <ToolPill icon={PenLine} label="編集" variant="primary" onClick={() => {}} />
      <ToolPill icon={Trash2} label="削除" variant="danger" onClick={() => {}} />
    </div>
  );
}`,
    en: `import { ToolPill } from "@gunjo/ui";
import { IconArrowsMove as Move, IconPencil as PenLine, IconPointer as MousePointer2, IconTrash as Trash2 } from "@tabler/icons-react";

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <ToolPill icon={MousePointer2} label="Select" isActive onClick={() => {}} />
      <ToolPill icon={Move} label="Move" onClick={() => {}} />
      <ToolPill icon={PenLine} label="Edit" variant="primary" onClick={() => {}} />
      <ToolPill icon={Trash2} label="Delete" variant="danger" onClick={() => {}} />
    </div>
  );
}`,
} as const;

const variantsCodeByLocale = {
    ja: `import { ToolPill } from "@gunjo/ui";
import { IconCopy as Copy, IconPlus as Plus, IconTrash as Trash2 } from "@tabler/icons-react";

export function ToolPillVariants() {
  return (
    <div className="flex items-center gap-3">
      <ToolPill icon={Copy} label="複製" />
      <ToolPill icon={Plus} label="追加" variant="primary" />
      <ToolPill icon={Trash2} label="削除" variant="danger" />
    </div>
  );
}`,
    en: `import { ToolPill } from "@gunjo/ui";
import { IconCopy as Copy, IconPlus as Plus, IconTrash as Trash2 } from "@tabler/icons-react";

export function ToolPillVariants() {
  return (
    <div className="flex items-center gap-3">
      <ToolPill icon={Copy} label="Duplicate" />
      <ToolPill icon={Plus} label="Add" variant="primary" />
      <ToolPill icon={Trash2} label="Delete" variant="danger" />
    </div>
  );
}`,
} as const;

const sizesCodeByLocale = {
    ja: `import { ToolPill } from "@gunjo/ui";
import { IconPencil as PenLine } from "@tabler/icons-react";

export function ToolPillSizes() {
  return (
    <div className="flex items-center gap-3">
      <ToolPill icon={PenLine} label="小" size="sm" />
      <ToolPill icon={PenLine} label="中" />
      <ToolPill icon={PenLine} label="大" size="lg" />
    </div>
  );
}`,
    en: `import { ToolPill } from "@gunjo/ui";
import { IconPencil as PenLine } from "@tabler/icons-react";

export function ToolPillSizes() {
  return (
    <div className="flex items-center gap-3">
      <ToolPill icon={PenLine} label="Small" size="sm" />
      <ToolPill icon={PenLine} label="Medium" />
      <ToolPill icon={PenLine} label="Large" size="lg" />
    </div>
  );
}`,
} as const;

const verticalCodeByLocale = {
    ja: `import { ToolPill } from "@gunjo/ui";
import { IconArrowsMove as Move, IconEraser as Eraser, IconPencil as PenLine, IconPointer as MousePointer2 } from "@tabler/icons-react";

export function VerticalToolPillToolbar() {
  return (
    <div className="flex flex-col items-center gap-3">
      <ToolPill icon={MousePointer2} label="選択" tooltipSide="right" isActive />
      <ToolPill icon={Move} label="移動" tooltipSide="right" />
      <ToolPill icon={PenLine} label="編集" tooltipSide="right" variant="primary" />
      <ToolPill icon={Eraser} label="消去" tooltipSide="right" />
    </div>
  );
}`,
    en: `import { ToolPill } from "@gunjo/ui";
import { IconArrowsMove as Move, IconEraser as Eraser, IconPencil as PenLine, IconPointer as MousePointer2 } from "@tabler/icons-react";

export function VerticalToolPillToolbar() {
  return (
    <div className="flex flex-col items-center gap-3">
      <ToolPill icon={MousePointer2} label="Select" tooltipSide="right" isActive />
      <ToolPill icon={Move} label="Move" tooltipSide="right" />
      <ToolPill icon={PenLine} label="Edit" tooltipSide="right" variant="primary" />
      <ToolPill icon={Eraser} label="Erase" tooltipSide="right" />
    </div>
  );
}`,
} as const;

const propsByLocale = {
    ja: (variantType: string) => [
        { name: "icon", type: "ComponentType", required: true, description: "表示するアイコンコンポーネントです。" },
        { name: "label", type: "string", description: "支援技術に伝える名前とツールチップに表示する文言です。" },
        { name: "isActive", type: "boolean", default: "false", description: "現在選択されているツールとして表示します。" },
        { name: "variant", type: variantType, default: "\"primary\"", description: "通常操作、主要操作、危険操作の見た目です。" },
        { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "アイコンボタンの大きさです。" },
        { name: "tooltipSide", type: "\"top\" | \"right\" | \"bottom\" | \"left\"", default: "\"top\"", description: "ツールチップを出す方向です。横並びでは上または下、縦並びでは右または左を指定します。" },
        { name: "onClick", type: "MouseEventHandler<HTMLButtonElement>", description: "クリック時に呼び出されます。" },
        { name: "className", type: "string", description: "必要に応じて外側に追加するクラスです。" },
    ],
    en: (variantType: string) => [
        { name: "icon", type: "ComponentType", required: true, description: "Icon component to render." },
        { name: "label", type: "string", description: "Accessible name and tooltip copy for the tool." },
        { name: "isActive", type: "boolean", default: "false", description: "Shows the tool as currently selected." },
        { name: "variant", type: variantType, default: "\"primary\"", description: "Visual treatment for standard, primary, and destructive tools." },
        { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Size of the icon button." },
        { name: "tooltipSide", type: "\"top\" | \"right\" | \"bottom\" | \"left\"", default: "\"top\"", description: "Tooltip placement. Use top or bottom for horizontal toolbars and right or left for vertical toolbars." },
        { name: "onClick", type: "MouseEventHandler<HTMLButtonElement>", description: "Called when the tool is clicked." },
        { name: "className", type: "string", description: "Optional class added to the button." },
    ],
} as const;

function ToolPillToolbar({ locale }: { locale: "ja" | "en" }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
            <ToolPill icon={MousePointer2} label={locale === "ja" ? "選択" : "Select"} isActive onClick={() => undefined} />
            <ToolPill icon={Move} label={locale === "ja" ? "移動" : "Move"} onClick={() => undefined} />
            <ToolPill icon={PenLine} label={locale === "ja" ? "編集" : "Edit"} variant="primary" onClick={() => undefined} />
            <ToolPill icon={Trash2} label={locale === "ja" ? "削除" : "Delete"} variant="danger" onClick={() => undefined} />
        </div>
    );
}

export default function ToolPillPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/tool-pill", locale);
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const variantType = getCategoryVariantUnionType("display", "toolPill");
    const code = codeByLocale[locale];

    return (
        <ComponentLayout
            title={content?.title ?? meta.toolPill.title}
            description={content?.description ?? meta.toolPill.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "ToolPill", href: "/docs/components/tool-pill" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "Button", href: "/docs/components/button" },
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
                { name: "Icon", href: "/docs/components/icon" },
                { name: "Tag", href: "/docs/components/tag" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewBodyWidth="md" previewHeight="auto">
                <ToolPillToolbar locale={locale} />
            </ComponentPreview>

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "toolbar",
                            title: locale === "ja" ? "横並びツールバー" : "Horizontal toolbar",
                            description: locale === "ja"
                                ? "横並びでは、隣のアイコンに重ならないようツールチップを上に出します。"
                                : "In horizontal toolbars, tooltips appear above the row so they do not cover neighboring icons.",
                            preview: <ToolPillToolbar locale={locale} />,
                            code,
                        },
                        {
                            key: "vertical-toolbar",
                            title: locale === "ja" ? "縦並びツールバー" : "Vertical toolbar",
                            description: locale === "ja"
                                ? "縦並びでは tooltipSide を right または left にして、上下のツールを隠さないようにします。"
                                : "In vertical toolbars, set tooltipSide to right or left so adjacent tools remain visible.",
                            preview: (
                                <div className="rounded-lg border bg-muted/30 p-3">
                                    <div className="flex flex-col items-center gap-3">
                                        <ToolPill icon={MousePointer2} label={locale === "ja" ? "選択" : "Select"} tooltipSide="right" isActive onClick={() => undefined} />
                                        <ToolPill icon={Move} label={locale === "ja" ? "移動" : "Move"} tooltipSide="right" onClick={() => undefined} />
                                        <ToolPill icon={PenLine} label={locale === "ja" ? "編集" : "Edit"} tooltipSide="right" variant="primary" onClick={() => undefined} />
                                        <ToolPill icon={Eraser} label={locale === "ja" ? "消去" : "Erase"} tooltipSide="right" onClick={() => undefined} />
                                    </div>
                                </div>
                            ),
                            code: verticalCodeByLocale[locale],
                        },
                        {
                            key: "variants",
                            title: locale === "ja" ? "操作の種類" : "Action variants",
                            description: locale === "ja"
                                ? "通常操作、主要操作、削除などの危険操作で variant を切り替えます。"
                                : "Switch variants for standard, primary, and destructive tool actions.",
                            preview: (
                                <div className="flex items-center gap-3">
                                    <ToolPill icon={Copy} label={locale === "ja" ? "複製" : "Duplicate"} onClick={() => undefined} />
                                    <ToolPill icon={Plus} label={locale === "ja" ? "追加" : "Add"} variant="primary" onClick={() => undefined} />
                                    <ToolPill icon={Trash2} label={locale === "ja" ? "削除" : "Delete"} variant="danger" onClick={() => undefined} />
                                </div>
                            ),
                            code: variantsCodeByLocale[locale],
                        },
                        {
                            key: "active",
                            title: locale === "ja" ? "選択中" : "Active",
                            description: locale === "ja"
                                ? "現在のモードや選択中ツールは isActive で固定表示します。"
                                : "Use isActive for the current mode or selected tool.",
                            preview: (
                                <div className="flex items-center gap-3">
                                    <ToolPill icon={MousePointer2} label={locale === "ja" ? "選択" : "Select"} isActive onClick={() => undefined} />
                                    <ToolPill icon={Eraser} label={locale === "ja" ? "消去" : "Erase"} onClick={() => undefined} />
                                </div>
                            ),
                            code: locale === "ja"
                                ? `import { ToolPill } from "@gunjo/ui";
import { IconEraser as Eraser, IconPointer as MousePointer2 } from "@tabler/icons-react";

export function ActiveToolPill() {
  return (
    <div className="flex items-center gap-3">
      <ToolPill icon={MousePointer2} label="選択" isActive />
      <ToolPill icon={Eraser} label="消去" />
    </div>
  );
}`
                                : `import { ToolPill } from "@gunjo/ui";
import { IconEraser as Eraser, IconPointer as MousePointer2 } from "@tabler/icons-react";

export function ActiveToolPill() {
  return (
    <div className="flex items-center gap-3">
      <ToolPill icon={MousePointer2} label="Select" isActive />
      <ToolPill icon={Eraser} label="Erase" />
    </div>
  );
}`,
                        },
                        {
                            key: "sizes",
                            title: locale === "ja" ? "サイズ" : "Sizes",
                            description: locale === "ja"
                                ? "周辺 UI の密度に合わせてアイコンボタンの大きさを変えます。"
                                : "Match the icon button size to the density of the surrounding UI.",
                            preview: (
                                <div className="flex items-center gap-3">
                                    <ToolPill icon={PenLine} label={locale === "ja" ? "小" : "Small"} size="sm" onClick={() => undefined} />
                                    <ToolPill icon={PenLine} label={locale === "ja" ? "中" : "Medium"} onClick={() => undefined} />
                                    <ToolPill icon={PenLine} label={locale === "ja" ? "大" : "Large"} size="lg" onClick={() => undefined} />
                                </div>
                            ),
                            code: sizesCodeByLocale[locale],
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsByLocale[locale](variantType)} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={code} />
                </div>
                <CodeBlock code={code} />
            </div>
        </ComponentLayout>
    );
}
