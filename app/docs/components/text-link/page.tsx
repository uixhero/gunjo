"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import navigationMetadata from "@design/navigation-metadata.json";
import {
    Button,
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
    TextLink,
    useToast,
} from "@gunjo/ui";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { useState } from "react";

function buildNavigationMessage(isJa: boolean, label: string, href: string) {
    return isJa
        ? `${label}（${href}）への遷移をプレビュー内で確認しました。`
        : `Previewed navigation to ${label} (${href}).`;
}

function TextLinkPreview({ variant = "default" }: { variant?: "default" | "muted" }) {
    const { locale } = useLocale();
    const { showToast } = useToast();
    const isJa = locale === "ja";
    const label = isJa ? "DocNote を見る" : "View DocNote";
    const href = "/docs/components/doc-note";

    const handleNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        showToast(buildNavigationMessage(isJa, label, href), "success", 1800);
    };

    return (
        <div className="flex w-full max-w-md justify-center">
            <TextLink href={href} variant={variant} onClick={handleNavigation}>
                {label}
            </TextLink>
        </div>
    );
}

function ExternalTextLinkPreview() {
    const { locale } = useLocale();
    const { showToast } = useToast();
    const isJa = locale === "ja";
    const label = "W3C WAI: Decorative Images";
    const href = "https://www.w3.org/WAI/tutorials/images/decorative/";

    const handleNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        showToast(buildNavigationMessage(isJa, label, href), "success", 1800);
    };

    return (
        <div className="flex w-full max-w-md justify-center">
            <TextLink
                href={href}
                target="_blank"
                newTabLabel={isJa ? "新しいタブで開きます" : "opens in a new tab"}
                onClick={handleNavigation}
            >
                {label}
            </TextLink>
        </div>
    );
}

function TextLinkMetadataPreview() {
    const { locale } = useLocale();
    const { showToast } = useToast();
    const isJa = locale === "ja";
    const [open, setOpen] = useState(false);
    const href = "/docs/components/doc-note";
    const label = "DocNote";
    const openPreview = () => setOpen(true);
    const handlePreviewPointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        openPreview();
    };
    const handlePreviewOpen = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        openPreview();
    };
    const handlePreviewKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openPreview();
    };
    const handlePreviewNavigation = () => {
        showToast(buildNavigationMessage(isJa, label, href), "success", 1800);
        setOpen(false);
    };

    return (
        <div className="flex w-full max-w-md flex-col items-center gap-4">
            <HoverCard open={open} onOpenChange={setOpen} openDelay={150}>
                <HoverCardTrigger asChild>
                    <span className="inline-flex">
                        <TextLink
                            href={href}
                            onPointerDown={handlePreviewPointerDown}
                            onClick={handlePreviewOpen}
                            onKeyDown={handlePreviewKeyDown}
                        >
                            {isJa ? "DocNote の概要を見る" : "Preview DocNote"}
                        </TextLink>
                    </span>
                </HoverCardTrigger>
                <HoverCardContent className="items-start text-left">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold">DocNote</p>
                        <p className="text-xs leading-5 text-muted-foreground">
                            {isJa
                                ? "本文に補足説明や参考リンクを添えるための注釈コンポーネントです。"
                                : "A note component for supplemental text and reference links inside documentation."}
                        </p>
                    </div>
                    <Button type="button" size="sm" variant="secondary" onClick={handlePreviewNavigation}>
                        {isJa ? "DocNote へ移動" : "Go to DocNote"}
                    </Button>
                </HoverCardContent>
            </HoverCard>
        </div>
    );
}

const codeByLocale = {
    ja: `import { TextLink, useToast } from "@gunjo/ui";
import type { MouseEvent } from "react";

export function Example() {
  const { showToast } = useToast();
  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    showToast("DocNote を見る（/docs/components/doc-note）への遷移をプレビュー内で確認しました。", "success", 1800);
  };

  return (
    <TextLink href="/docs/components/doc-note" onClick={handleNavigation}>
      DocNote を見る
    </TextLink>
  );
}`,
    en: `import { TextLink, useToast } from "@gunjo/ui";
import type { MouseEvent } from "react";

export function Example() {
  const { showToast } = useToast();
  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    showToast("Previewed navigation to View DocNote (/docs/components/doc-note).", "success", 1800);
  };

  return (
    <TextLink href="/docs/components/doc-note" onClick={handleNavigation}>
      View DocNote
    </TextLink>
  );
}`,
} as const;

const newTabCodeByLocale = {
    ja: `import { TextLink, useToast } from "@gunjo/ui";
import type { MouseEvent } from "react";

export function ExternalReference() {
  const { showToast } = useToast();
  const href = "https://www.w3.org/WAI/tutorials/images/decorative/";
  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    showToast(\`W3C WAI: Decorative Images（\${href}）への遷移をプレビュー内で確認しました。\`, "success", 1800);
  };

  return (
    <TextLink href={href} target="_blank" newTabLabel="新しいタブで開きます" onClick={handleNavigation}>
      W3C WAI: Decorative Images
    </TextLink>
  );
}`,
    en: `import { TextLink, useToast } from "@gunjo/ui";
import type { MouseEvent } from "react";

export function ExternalReference() {
  const { showToast } = useToast();
  const href = "https://www.w3.org/WAI/tutorials/images/decorative/";
  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    showToast(\`Previewed navigation to W3C WAI: Decorative Images (\${href}).\`, "success", 1800);
  };

  return (
    <TextLink href={href} target="_blank" onClick={handleNavigation}>
      W3C WAI: Decorative Images
    </TextLink>
  );
}`,
} as const;

const mutedCodeByLocale = {
    ja: `import { TextLink } from "@gunjo/ui";

export function MutedLink() {
  return (
    <TextLink href="/docs/components/doc-note" variant="muted" onClick={(event) => event.preventDefault()}>
      DocNote を見る
    </TextLink>
  );
}`,
    en: `import { TextLink } from "@gunjo/ui";

export function MutedLink() {
  return (
    <TextLink href="/docs/components/doc-note" variant="muted" onClick={(event) => event.preventDefault()}>
      View DocNote
    </TextLink>
  );
}`,
} as const;

const previewCodeByLocale = {
    ja: `import {
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  TextLink,
  useToast,
} from "@gunjo/ui";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { useState } from "react";

export function TextLinkWithPreview() {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const href = "/docs/components/doc-note";
  const openPreview = () => setOpen(true);

  const handlePointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    openPreview();
  };
  const handleOpen = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    openPreview();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openPreview();
  };
  const handleNavigation = () => {
    showToast("DocNote（/docs/components/doc-note）への遷移をプレビュー内で確認しました。", "success", 1800);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <HoverCard open={open} onOpenChange={setOpen} openDelay={150}>
        <HoverCardTrigger asChild>
          <span className="inline-flex">
            <TextLink
              href={href}
              onPointerDown={handlePointerDown}
              onClick={handleOpen}
              onKeyDown={handleKeyDown}
            >
              DocNote の概要を見る
            </TextLink>
          </span>
        </HoverCardTrigger>
        <HoverCardContent className="items-start text-left">
          <div className="space-y-1">
            <p className="text-sm font-semibold">DocNote</p>
            <p className="text-xs leading-5 text-muted-foreground">
              本文に補足説明や参考リンクを添えるための注釈コンポーネントです。
            </p>
          </div>
          <Button type="button" size="sm" variant="secondary" onClick={handleNavigation}>
            DocNote へ移動
          </Button>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}`,
    en: `import {
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  TextLink,
  useToast,
} from "@gunjo/ui";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { useState } from "react";

export function TextLinkWithPreview() {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const href = "/docs/components/doc-note";
  const openPreview = () => setOpen(true);

  const handlePointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    openPreview();
  };
  const handleOpen = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    openPreview();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openPreview();
  };
  const handleNavigation = () => {
    showToast("Previewed navigation to DocNote (/docs/components/doc-note).", "success", 1800);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <HoverCard open={open} onOpenChange={setOpen} openDelay={150}>
        <HoverCardTrigger asChild>
          <span className="inline-flex">
            <TextLink
              href={href}
              onPointerDown={handlePointerDown}
              onClick={handleOpen}
              onKeyDown={handleKeyDown}
            >
              Preview DocNote
            </TextLink>
          </span>
        </HoverCardTrigger>
        <HoverCardContent className="items-start text-left">
          <div className="space-y-1">
            <p className="text-sm font-semibold">DocNote</p>
            <p className="text-xs leading-5 text-muted-foreground">
              A note component for supplemental text and reference links inside documentation.
            </p>
          </div>
          <Button type="button" size="sm" variant="secondary" onClick={handleNavigation}>
            Go to DocNote
          </Button>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}`,
} as const;

const propsByLocale = {
    ja: [
        { name: "href", type: "string", description: "リンク先です。" },
        { name: "target", type: "HTMLAttributeAnchorTarget", description: "`_blank` の場合は外部タブアイコンを自動で表示します。" },
        { name: "variant", type: "\"default\" | \"muted\"", default: "\"default\"", description: "本文中の強調度に合わせた見た目です。" },
        { name: "external", type: "boolean", default: "false", description: "新しいタブではない外部リンクにも外部リンクアイコンを表示します。" },
        { name: "newTabLabel", type: "string", default: "\"opens in a new tab\"", description: "新しいタブで開くことを支援技術に伝える非表示の補足ラベルです。表示される説明が必要な場合は HoverCard や Tooltip と合成します。" },
        { name: "children", type: "ReactNode", required: true, description: "リンクテキストです。" },
    ],
    en: [
        { name: "href", type: "string", description: "Link destination." },
        { name: "target", type: "HTMLAttributeAnchorTarget", description: "When `_blank`, the external-tab icon is shown automatically." },
        { name: "variant", type: "\"default\" | \"muted\"", default: "\"default\"", description: "Visual emphasis for inline text contexts." },
        { name: "external", type: "boolean", default: "false", description: "Shows the external icon for external links that do not open a new tab." },
        { name: "newTabLabel", type: "string", default: "\"opens in a new tab\"", description: "Hidden assistive label for links that open a new tab. Compose HoverCard or Tooltip when visible help is needed." },
        { name: "children", type: "ReactNode", required: true, description: "Link text." },
    ],
} as const;

export default function TextLinkPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/text-link", locale);
    const meta = navigationMetadata as Record<string, { title: string; description: string }>;
    const code = codeByLocale[locale];
    const newTabCode = newTabCodeByLocale[locale];
    const mutedCode = mutedCodeByLocale[locale];
    const previewCode = previewCodeByLocale[locale];

    return (
        <ComponentLayout
            title={content?.title ?? meta.textLink.title}
            description={content?.description ?? meta.textLink.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "TextLink", href: "/docs/components/text-link" },
                { name: "Button", href: "/docs/components/button" },
                { name: "HoverCard", href: "/docs/components/hover-card" },
                { name: "ToastProvider", href: "/docs/components/toast-provider" },
            ]}
            relatedComponents={[
                { name: "DocNote", href: "/docs/components/doc-note" },
                { name: "MarkdownRenderer", href: "/docs/components/markdown-renderer" },
                { name: "Breadcrumb", href: "/docs/components/breadcrumb" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewBodyWidth="sm" previewHeight="auto">
                <TextLinkPreview />
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
                                ? "同じサイト内や同じタブで移動する通常のテキストリンクです。外部タブアイコンは表示しません。"
                                : "Use for normal text links that navigate in the same tab. No external-tab icon is shown.",
                            preview: (
                                <TextLinkPreview />
                            ),
                            code,
                        },
                        {
                            key: "new-tab",
                            title: locale === "ja" ? "新しいタブ" : "New tab",
                            description: locale === "ja"
                                ? "target=\"_blank\" のリンクには外部タブアイコンを必ず併記します。"
                                : "Links with target=\"_blank\" always include the external-tab icon.",
                            preview: (
                                <ExternalTextLinkPreview />
                            ),
                            code: newTabCode,
                        },
                        {
                            key: "muted",
                            title: locale === "ja" ? "控えめ" : "Muted",
                            description: locale === "ja"
                                ? "注釈や補足テキスト内で、本文になじませたいリンクに使います。"
                                : "Use for links that should sit quietly inside notes or supporting text.",
                            preview: (
                                <TextLinkPreview variant="muted" />
                            ),
                            code: mutedCode,
                        },
                        {
                            key: "metadata-preview",
                            title: locale === "ja" ? "概要プレビュー付き" : "With metadata preview",
                            description: locale === "ja"
                                ? "リンク先のタイトルや説明を HoverCard で合成するバリエーションです。タップでも概要を開き、カード内のボタンで遷移を確認できます。"
                                : "Compose HoverCard when a text link needs metadata such as title and description. Tap opens the preview on touch devices and the card includes an explicit navigation action.",
                            preview: <TextLinkMetadataPreview />,
                            code: previewCode,
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
                    <CodeCopyButton code={code} />
                </div>
                <CodeBlock code={code} />
            </div>
        </ComponentLayout>
    );
}
