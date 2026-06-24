"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import {
    Badge,
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@gunjo/ui";
import { IconCheck, IconChevronDown, IconPlus, IconSparkles, IconX } from "@tabler/icons-react";
import { useState } from "react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

function BadgeVariantSummary({ locale }: { locale: "en" | "ja" }) {
    const rows: Array<{ key: BadgeVariant; label: string; description: string }> = [
        {
            key: "default",
            label: locale === "ja" ? "公開中" : "Live",
            description: locale === "ja" ? "主要な状態や、最も伝えたい分類に使います。" : "Use for primary status or the category that needs the strongest emphasis.",
        },
        {
            key: "secondary",
            label: locale === "ja" ? "下書き" : "Draft",
            description: locale === "ja" ? "補助的な状態や、控えめに見せたい分類に使います。" : "Use for secondary status and lower-emphasis categories.",
        },
        {
            key: "outline",
            label: locale === "ja" ? "審査中" : "Review",
            description: locale === "ja" ? "背景を強く塗らず、境界だけで区切りたい時に使います。" : "Use when the label needs a boundary without a strong fill.",
        },
        {
            key: "destructive",
            label: locale === "ja" ? "要対応" : "Action needed",
            description: locale === "ja" ? "エラーや期限切れなど、注意が必要な状態に使います。" : "Use for error, expired, or attention-required states.",
        },
    ];

    return (
        <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-3">
            {rows.map((row) => (
                <div key={row.key} className="grid gap-3 rounded-md bg-background p-3 sm:grid-cols-[8rem_minmax(8rem,auto)_minmax(0,1fr)] sm:items-center">
                    <code className="text-xs font-semibold text-muted-foreground">{row.key}</code>
                    <Badge variant={row.key} className="justify-self-start">{row.label}</Badge>
                    <p className="text-xs leading-relaxed text-muted-foreground">{row.description}</p>
                </div>
            ))}
        </div>
    );
}

function RemovableBadgePreview({ locale }: { locale: "en" | "ja" }) {
    const [tags, setTags] = useState(["react", "design-system", "docs"]);
    const visibleTags = tags.length > 0 ? tags : ["docs"];
    const maxTags = 3;
    const canAdd = tags.length < maxTags;

    return (
        <div className="flex flex-wrap gap-2">
            {visibleTags.map((tag) => {
                const canRemove = tags.length > 1;

                return (
                    <Badge key={tag} variant="secondary" className="gap-1.5 pr-1">
                        {tag}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="inline-flex">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 rounded-full"
                                        aria-label={locale === "ja" ? `${tag} を削除` : `Remove ${tag}`}
                                        disabled={!canRemove}
                                        onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                                    >
                                        <IconX className="h-3 w-3" />
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                {canRemove
                                    ? locale === "ja" ? "削除します" : "Remove this tag"
                                    : locale === "ja" ? "最後の 1 件は残します" : "Keep at least one tag"}
                            </TooltipContent>
                        </Tooltip>
                    </Badge>
                );
            })}
            {canAdd ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-6 rounded-full border-dashed px-2.5 text-xs font-semibold"
                            onClick={() => setTags((current) => {
                                if (current.length >= maxTags) {
                                    return current;
                                }

                                return [
                                    ...current,
                                    locale === "ja" ? `テスト${current.length + 1}` : `Test ${current.length + 1}`,
                                ];
                            })}
                        >
                            <IconPlus className="h-3 w-3" />
                            {locale === "ja" ? "追加" : "Add"}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {locale === "ja" ? "削除した分を追加できます。最大 3 件までです。" : "Add a tag back. Up to 3 tags."}
                    </TooltipContent>
                </Tooltip>
            ) : null}
        </div>
    );
}

function DisabledBadgePreview({ locale }: { locale: "en" | "ja" }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="inline-flex">
                    <Badge
                        variant="secondary"
                        aria-disabled="true"
                        className="cursor-not-allowed opacity-55"
                    >
                        {locale === "ja" ? "固定タグ" : "Locked tag"}
                    </Badge>
                </span>
            </TooltipTrigger>
            <TooltipContent>
                {locale === "ja" ? "このタグはシステムで固定されているため変更できません。" : "This tag is locked by the system and cannot be changed."}
            </TooltipContent>
        </Tooltip>
    );
}

function AddableBadgePreview({ locale }: { locale: "en" | "ja" }) {
    const [tags, setTags] = useState<string[]>([]);
    const maxTags = 3;
    const canAdd = tags.length < maxTags;

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1.5 pr-1">
                    {tag}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="inline-flex">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 rounded-full"
                                    aria-label={locale === "ja" ? `${tag} を削除` : `Remove ${tag}`}
                                    onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                                >
                                    <IconX className="h-3 w-3" />
                                </Button>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>{locale === "ja" ? "削除します" : "Remove this tag"}</TooltipContent>
                    </Tooltip>
                </Badge>
            ))}
            {canAdd ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-6 rounded-full border-dashed px-2.5 text-xs font-semibold"
                            onClick={() => setTags((current) => {
                                if (current.length >= maxTags) {
                                    return current;
                                }

                                return [
                                    ...current,
                                    locale === "ja" ? `テスト${current.length + 1}` : `Test ${current.length + 1}`,
                                ];
                            })}
                        >
                            <IconPlus className="h-3 w-3" />
                            {locale === "ja" ? "タグを追加" : "Add tag"}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {locale === "ja" ? "クリックするとテストバッジを追加します。最大 3 件まで追加できます。" : "Click to add a test badge. You can add up to 3."}
                    </TooltipContent>
                </Tooltip>
            ) : null}
        </div>
    );
}

function SelectableBadgePreview({ locale }: { locale: "en" | "ja" }) {
    const options = [
        { value: "low", label: locale === "ja" ? "低" : "Low" },
        { value: "medium", label: locale === "ja" ? "中" : "Medium" },
        { value: "high", label: locale === "ja" ? "高" : "High" },
    ];
    const [selected, setSelected] = useState(options[1]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="h-6 rounded-full px-2.5 text-xs font-semibold"
                    aria-label={locale === "ja" ? "優先度を選択" : "Select priority"}
                >
                    {locale === "ja" ? "優先度" : "Priority"}: {selected.label}
                    <IconChevronDown className="h-3 w-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
                {options.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onSelect={() => setSelected(option)}
                        className="gap-2"
                    >
                        <span className="flex h-4 w-4 items-center justify-center">
                            {selected.value === option.value ? <IconCheck className="h-3 w-3" /> : null}
                        </span>
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function BadgePage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/badge", locale);
    const title = content?.title ?? displayMetadata.badge.title;
    const description = content?.description ?? displayMetadata.badge.description;

    const code = locale === "ja"
        ? `import { Badge } from "@gunjo/ui";

export function Example() {
  return <Badge>公開中</Badge>;
}`
        : `import { Badge } from "@gunjo/ui";

export function Example() {
  return <Badge>Live</Badge>;
}`;

    const usageCode = locale === "ja"
        ? `import { Badge } from "@gunjo/ui";

export function StatusBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>公開中</Badge>
      <Badge variant="secondary">下書き</Badge>
      <Badge variant="outline">審査中</Badge>
      <Badge variant="destructive">要対応</Badge>
    </div>
  );
}`
        : `import { Badge } from "@gunjo/ui";

export function StatusBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Live</Badge>
      <Badge variant="secondary">Draft</Badge>
      <Badge variant="outline">Review</Badge>
      <Badge variant="destructive">Action needed</Badge>
    </div>
  );
}`;

    const propsData = [
        {
            name: "variant",
            type: '"default" | "secondary" | "destructive" | "outline" | "info" | "success" | "warning"',
            default: '"default"',
            description: locale === "ja" ? "バッジの視覚的な種類を指定します。" : "The visual style of the badge.",
        },
        {
            name: "icon",
            type: "ReactNode",
            description: locale === "ja"
                ? "先頭に表示するアイコン（Tabler 等の svg）。サイズと余白は自動。色だけに頼らないステータスピルを1プロパティで作れます。装飾扱い（aria-hidden）で、意味はラベルが担います。"
                : "Leading glyph (a Tabler/svg node), sized and spaced for you — a status pill that doesn't rely on color alone, in one prop. Decorative (aria-hidden); the text label carries the meaning.",
        },
        {
            name: "children",
            type: "ReactNode",
            description: locale === "ja" ? "バッジ内に表示する短いラベルです。" : "Short label rendered inside the badge.",
        },
    ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Badge", href: "/docs/components/badge" },
            ]}
            relatedComponents={[
                { name: "Tag", href: "/docs/components/tag" },
                { name: "TagInput", href: "/docs/components/tag-input" },
                { name: "FilterButton", href: "/docs/components/filter-button" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/badge" code={code} codeBlock={<CodeBlock code={code} />}>
                <Badge>{locale === "ja" ? "公開中" : "Live"}</Badge>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === "ja"
                        ? "バッジは短い状態や分類を伝えるための表示です。色だけに頼らず、ラベルで意味が伝わるようにします。"
                        : "Badges communicate short status or category labels. The text should carry the meaning without relying on color alone."}
                </p>
                <BadgeVariantSummary locale={locale} />
                <ComponentDemoStates
                    states={[
                        {
                            key: "with-icon",
                            title: locale === "ja" ? "アイコン付き" : "With icon",
                            description: locale === "ja"
                                ? "状態の意味が重要な場合は、短いラベルにアイコンを添えて認識しやすくします。"
                                : "Add an icon when the status meaning needs to be recognized quickly.",
                            preview: (
                                <Badge variant="success" icon={<IconCheck />}>
                                    {locale === "ja" ? "確認済み" : "Verified"}
                                </Badge>
                            ),
                            code: locale === "ja"
                                ? `import { Badge } from "@gunjo/ui";
import { IconCheck } from "@tabler/icons-react";

export function VerifiedBadge() {
  return (
    <Badge variant="success" icon={<IconCheck />}>
      確認済み
    </Badge>
  );
}`
                                : `import { Badge } from "@gunjo/ui";
import { IconCheck } from "@tabler/icons-react";

export function VerifiedBadge() {
  return (
    <Badge variant="success" icon={<IconCheck />}>
      Verified
    </Badge>
  );
}`,
                        },
                        {
                            key: "removable",
                            title: locale === "ja" ? "削除できるタグ" : "Removable tag",
                            description: locale === "ja"
                                ? "フィルター条件やタグ入力では、Badge と小さな Button を組み合わせて削除操作を表します。この例では最後の 1 件は残します。"
                                : "For filters and tag inputs, compose Badge with a small Button for removal.",
                            preview: <RemovableBadgePreview locale={locale} />,
                            code: locale === "ja"
                                ? `import { Badge, Button, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";

export function RemovableTags() {
  const [tags, setTags] = useState(["react", "design-system", "docs"]);

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1.5 pr-1">
          {tag}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 rounded-full"
                  aria-label={\`\${tag} を削除\`}
                  disabled={tags.length <= 1}
                  onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                >
                  <IconX className="h-3 w-3" />
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {tags.length <= 1 ? "最後の 1 件は残します" : "削除します"}
            </TooltipContent>
          </Tooltip>
        </Badge>
      ))}
    </div>
  );
}`
                                : `import { Badge, Button, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";

export function RemovableTags() {
  const [tags, setTags] = useState(["react", "design-system", "docs"]);

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1.5 pr-1">
          {tag}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 rounded-full"
                  aria-label={\`Remove \${tag}\`}
                  disabled={tags.length <= 1}
                  onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                >
                  <IconX className="h-3 w-3" />
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {tags.length <= 1 ? "Keep at least one tag" : "Remove this tag"}
            </TooltipContent>
          </Tooltip>
        </Badge>
      ))}
    </div>
  );
}`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description: locale === "ja"
                                ? "選択済みでも操作できない状態は、aria-disabled と薄い表示で伝えます。無効理由は周辺の説明やツールチップで補足します。"
                                : "Use aria-disabled and muted styling when a badge-like control cannot be changed.",
                            preview: <DisabledBadgePreview locale={locale} />,
                            code: locale === "ja"
                                ? `import { Badge, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

<Tooltip>
  <TooltipTrigger asChild>
    <span className="inline-flex">
      <Badge variant="secondary" aria-disabled="true" className="cursor-not-allowed opacity-55">
        固定タグ
      </Badge>
    </span>
  </TooltipTrigger>
  <TooltipContent>このタグはシステムで固定されているため変更できません。</TooltipContent>
</Tooltip>`
                                : `import { Badge, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";

<Tooltip>
  <TooltipTrigger asChild>
    <span className="inline-flex">
      <Badge variant="secondary" aria-disabled="true" className="cursor-not-allowed opacity-55">
        Locked tag
      </Badge>
    </span>
  </TooltipTrigger>
  <TooltipContent>This tag is locked by the system and cannot be changed.</TooltipContent>
</Tooltip>`,
                        },
                        {
                            key: "addable",
                            title: locale === "ja" ? "追加できるバッジ" : "Addable badge",
                            description: locale === "ja"
                                ? "フィルターやタグの追加トリガーは、点線のアウトラインと + アイコンで未追加の操作だと分かるようにします。"
                                : "Use a dashed outline and plus icon for a badge-shaped add trigger.",
                            preview: <AddableBadgePreview locale={locale} />,
                            code: locale === "ja"
                                ? `import { Badge, Button, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

export function AddableTags() {
  const [tags, setTags] = useState<string[]>([]);
  const canAdd = tags.length < 3;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
      {canAdd ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-6 rounded-full border-dashed px-2.5 text-xs font-semibold"
              onClick={() => setTags((current) => [...current, \`テスト\${current.length + 1}\`])}
            >
              <IconPlus className="h-3 w-3" />
              タグを追加
            </Button>
          </TooltipTrigger>
          <TooltipContent>クリックするとテストバッジを追加します。最大 3 件まで追加できます。</TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  );
}`
                                : `import { Badge, Button, Tooltip, TooltipContent, TooltipTrigger } from "@gunjo/ui";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

export function AddableTags() {
  const [tags, setTags] = useState<string[]>([]);
  const canAdd = tags.length < 3;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
      {canAdd ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-6 rounded-full border-dashed px-2.5 text-xs font-semibold"
              onClick={() => setTags((current) => [...current, \`Test \${current.length + 1}\`])}
            >
              <IconPlus className="h-3 w-3" />
              Add tag
            </Button>
          </TooltipTrigger>
          <TooltipContent>Click to add a test badge. You can add up to 3.</TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  );
}`,
                        },
                        {
                            key: "selectable",
                            title: locale === "ja" ? "選べるバッジ" : "Selectable badge",
                            description: locale === "ja"
                                ? "右側のシェブロンで選択肢を開く場合は、Badge そのものではなく Badge 形状の Button として扱います。候補の表示は DropdownMenu や FilterButton の責務です。"
                                : "When a chevron opens choices, treat it as a badge-shaped Button. The option list belongs to DropdownMenu or FilterButton.",
                            preview: <SelectableBadgePreview locale={locale} />,
                            code: locale === "ja"
                                ? `import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@gunjo/ui";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";

export function SelectableBadge() {
  const options = ["低", "中", "高"];
  const [selected, setSelected] = useState("中");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" className="h-6 rounded-full px-2.5 text-xs font-semibold">
          優先度: {selected}
          <IconChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {options.map((option) => (
          <DropdownMenuItem key={option} onSelect={() => setSelected(option)} className="gap-2">
            <span className="flex h-4 w-4 items-center justify-center">
              {selected === option ? <IconCheck className="h-3 w-3" /> : null}
            </span>
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`
                                : `import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@gunjo/ui";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";

export function SelectableBadge() {
  const options = ["Low", "Medium", "High"];
  const [selected, setSelected] = useState("Medium");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" className="h-6 rounded-full px-2.5 text-xs font-semibold">
          Priority: {selected}
          <IconChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {options.map((option) => (
          <DropdownMenuItem key={option} onSelect={() => setSelected(option)} className="gap-2">
            <span className="flex h-4 w-4 items-center justify-center">
              {selected === option ? <IconCheck className="h-3 w-3" /> : null}
            </span>
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`,
                        },
                        {
                            key: "cluster",
                            title: locale === "ja" ? "複数の状態ラベル" : "Status cluster",
                            description: locale === "ja"
                                ? "課題管理や一覧では、状態、種別、優先度をまとめて小さく表示できます。"
                                : "In issue or list rows, combine status, type, and priority labels in a compact row.",
                            preview: (
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="gap-1">
                                        <IconSparkles className="h-3 w-3" />
                                        {locale === "ja" ? "新規" : "New"}
                                    </Badge>
                                    <Badge>{locale === "ja" ? "進行中" : "In progress"}</Badge>
                                    <Badge variant="destructive">{locale === "ja" ? "不具合" : "Bug"}</Badge>
                                    <Badge variant="secondary">P2</Badge>
                                </div>
                            ),
                            code: usageCode,
                        },
                    ]}
                />
                <div className="rounded-md border border-border/70 bg-muted/20 p-4">
                    <h3 className="text-sm font-semibold">
                        {locale === "ja" ? "入力して追加する場合" : "When users need to type new tags"}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {locale === "ja" ? (
                            <>
                                Badge は追加済みの状態や分類を表示する部品です。自由入力でタグを追加する場合は{" "}
                                <a className="font-medium text-foreground underline underline-offset-4" href="/docs/components/tag-input">
                                    TagInput
                                </a>{" "}
                                を使い、候補から選ぶ場合は FilterButton や Combobox と組み合わせます。
                            </>
                        ) : (
                            <>
                                Badge represents an existing status or category. Use{" "}
                                <a className="font-medium text-foreground underline underline-offset-4" href="/docs/components/tag-input">
                                    TagInput
                                </a>{" "}
                                when users need to type new tags, or pair badges with FilterButton or Combobox when users choose from predefined options.
                            </>
                        )}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">{locale === "ja" ? "プロパティ" : "Props"}</h2>
                <PropsTable data={propsData} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">{locale === "ja" ? "使い方" : "Usage"}</h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <CodeBlock code={usageCode} />
            </div>
        </ComponentLayout>
    );
}
