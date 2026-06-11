"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Avatar, AvatarFallback, AvatarImage } from "@gunjo/ui";

export default function AvatarPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/avatar", locale);
    const title = content?.title ?? displayMetadata.avatar.title;
    const description = content?.description ?? displayMetadata.avatar.description;

    const code = locale === "ja"
        ? `import { Avatar, AvatarFallback, AvatarImage } from "@gunjo/ui";

export function Example() {
  return (
    <Avatar aria-label="青井 花" tooltip="青井 花">
      <AvatarImage src="/samples/avatar-aoi.svg" alt="" />
      <AvatarFallback>青</AvatarFallback>
    </Avatar>
  );
}`
        : `import { Avatar, AvatarFallback, AvatarImage } from "@gunjo/ui";

export function Example() {
  return (
    <Avatar aria-label="Aoi Hana" tooltip="Aoi Hana">
      <AvatarImage src="/samples/avatar-aoi.svg" alt="" />
      <AvatarFallback>AH</AvatarFallback>
    </Avatar>
  );
}`;

    const usageCode = locale === "ja"
        ? `import { Avatar, AvatarFallback, AvatarImage } from "@gunjo/ui";

export function UserAvatar() {
  return (
    <Avatar
      aria-label="青井 花"
      tooltip="青井 花"
      presence="online"
      presenceLabel="オンライン"
    >
      <AvatarImage src="/samples/avatar-aoi.svg" alt="" />
      <AvatarFallback>青</AvatarFallback>
    </Avatar>
  );
}`
        : `import { Avatar, AvatarFallback, AvatarImage } from "@gunjo/ui";

export function UserAvatar() {
  return (
    <Avatar
      aria-label="Aoi Hana"
      tooltip="Aoi Hana"
      presence="online"
      presenceLabel="Online"
    >
      <AvatarImage src="/samples/avatar-aoi.svg" alt="" />
      <AvatarFallback>AH</AvatarFallback>
    </Avatar>
  );
}`;

    const propsData = [
        {
            name: "Avatar",
            type: "React.ComponentProps<typeof AvatarPrimitive.Root>",
            description: locale === "ja" ? "画像とフォールバックを包むルート要素です。" : "Root wrapper for image and fallback content.",
        },
        {
            name: "AvatarImage.src",
            type: "string",
            description: locale === "ja" ? "表示する画像の URL です。" : "Image URL to render.",
        },
        {
            name: "AvatarImage.alt",
            type: "string",
            description: locale === "ja" ? "画像自体が意味を持つ場合の代替テキストです。" : "Alternative text when the image itself carries meaning.",
        },
        {
            name: "Avatar.tooltip",
            type: "ReactNode",
            description: locale === "ja" ? "ホバー時に表示する名前や補足情報です。" : "Name or supporting information shown on hover.",
        },
        {
            name: "Avatar.tooltipPortalContainer",
            type: "HTMLElement | null",
            description: locale === "ja" ? "パターンの擬似ブラウザ内など、ツールチップを描画するコンテナです。" : "Container used to render the tooltip, such as a fake browser viewport in patterns.",
        },
        {
            name: "Avatar.presence",
            type: '"online" | "away" | "busy" | "offline"',
            description: locale === "ja" ? "在席状態を示す小さなステータス点です。" : "Small status dot for presence state.",
        },
        {
            name: "Avatar.presenceLabel",
            type: "ReactNode",
            description: locale === "ja" ? "在席状態をツールチップや支援技術へ伝えるラベルです。" : "Presence label for tooltip content and assistive technology.",
        },
        {
            name: "AvatarFallback.children",
            type: "ReactNode",
            description: locale === "ja" ? "画像が読み込めない時に表示する文字やアイコンです。" : "Text or icon shown when the image cannot be loaded.",
        },
    ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Avatar", href: "/docs/components/avatar" },
            ]}
            relatedComponents={[
                { name: "AvatarGroup", href: "/docs/components/avatar-group" },
                { name: "HoverCard", href: "/docs/components/hover-card" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
        >
            <ComponentPreview embedSrc="/embed/avatar" code={code} codeBlock={<CodeBlock code={code} />}>
                <Avatar
                    aria-label={locale === "ja" ? "青井 花" : "Aoi Hana"}
                    tooltip={locale === "ja" ? "青井 花" : "Aoi Hana"}
                >
                    <AvatarImage src="/samples/avatar-aoi.svg" alt="" />
                    <AvatarFallback>{locale === "ja" ? "青" : "AH"}</AvatarFallback>
                </Avatar>
            </ComponentPreview>

            <div className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "image",
                            title: locale === "ja" ? "画像あり" : "With image",
                            description: locale === "ja"
                                ? "プロフィール画像がある場合は AvatarImage を表示し、読み込み失敗時にフォールバックへ戻します。"
                                : "Render AvatarImage when a profile image is available, with fallback for failed loads.",
                            preview: (
                                <Avatar
                                    aria-label={locale === "ja" ? "青井 花" : "Aoi Hana"}
                                    tooltip={locale === "ja" ? "青井 花" : "Aoi Hana"}
                                >
                                    <AvatarImage src="/samples/avatar-aoi.svg" alt="" />
                                    <AvatarFallback>{locale === "ja" ? "青" : "AH"}</AvatarFallback>
                                </Avatar>
                            ),
                            code,
                        },
                        {
                            key: "fallback",
                            title: locale === "ja" ? "フォールバック" : "Fallback",
                            description: locale === "ja"
                                ? "画像がない場合でも、イニシャルやアイコンで誰の情報か判断できるようにします。"
                                : "Use initials or an icon so the user remains identifiable without an image.",
                            preview: (
                                <Avatar
                                    aria-label={locale === "ja" ? "田中 空" : "Sora Tanaka"}
                                    tooltip={locale === "ja" ? "田中 空" : "Sora Tanaka"}
                                >
                                    <AvatarImage src="" alt="" />
                                    <AvatarFallback>{locale === "ja" ? "田" : "ST"}</AvatarFallback>
                                </Avatar>
                            ),
                            code: locale === "ja"
                                ? `import { Avatar, AvatarFallback, AvatarImage } from "@gunjo/ui";

export function FallbackAvatar() {
  return (
    <Avatar aria-label="田中 空" tooltip="田中 空">
      <AvatarImage src="" alt="" />
      <AvatarFallback>田</AvatarFallback>
    </Avatar>
  );
}`
                                : `import { Avatar, AvatarFallback, AvatarImage } from "@gunjo/ui";

export function FallbackAvatar() {
  return (
    <Avatar aria-label="Sora Tanaka" tooltip="Sora Tanaka">
      <AvatarImage src="" alt="" />
      <AvatarFallback>ST</AvatarFallback>
    </Avatar>
  );
}`,
                        },
                        {
                            key: "presence",
                            title: locale === "ja" ? "在席表示との合成" : "Composed with presence",
                            description: locale === "ja"
                                ? "在席状態を付ける場合は、色だけでなくツールチップでも状態を確認できるようにします。"
                                : "When presence is shown, include the status in the tooltip instead of relying on color alone.",
                            preview: (
                                <Avatar
                                    aria-label={locale === "ja" ? "青井 花" : "Aoi Hana"}
                                    tooltip={
                                        <span className="grid gap-0.5 text-left">
                                            <span>{locale === "ja" ? "青井 花" : "Aoi Hana"}</span>
                                            <span className="text-xs text-muted-foreground">{locale === "ja" ? "オンライン" : "Online"}</span>
                                        </span>
                                    }
                                    presence="online"
                                    presenceLabel={locale === "ja" ? "オンライン" : "Online"}
                                >
                                    <AvatarImage src="/samples/avatar-aoi.svg" alt="" />
                                    <AvatarFallback>{locale === "ja" ? "青" : "AH"}</AvatarFallback>
                                </Avatar>
                            ),
                            code: locale === "ja"
                                ? `import { Avatar, AvatarFallback, AvatarImage } from "@gunjo/ui";

export function PresenceAvatar() {
  return (
    <Avatar
      aria-label="青井 花"
      tooltip="青井 花 / オンライン"
      presence="online"
      presenceLabel="オンライン"
    >
      <AvatarImage src="/samples/avatar-aoi.svg" alt="" />
      <AvatarFallback>青</AvatarFallback>
    </Avatar>
  );
}`
                                : `import { Avatar, AvatarFallback, AvatarImage } from "@gunjo/ui";

export function PresenceAvatar() {
  return (
    <Avatar
      aria-label="Aoi Hana"
      tooltip="Aoi Hana / Online"
      presence="online"
      presenceLabel="Online"
    >
      <AvatarImage src="/samples/avatar-aoi.svg" alt="" />
      <AvatarFallback>AH</AvatarFallback>
    </Avatar>
  );
}`,
                        },
                    ]}
                />
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
