"use client";

import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Avatar, AvatarFallback, AvatarImage } from "@gunjo/ui";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

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
        {
            name: "AvatarFallback.colorSeed",
            type: "string",
            description: locale === "ja"
                ? "任意。名前などのシードをハッシュして、コントラスト安全なトーン対の1つに決定的に着色します（同じシード＝同じ色）。名簿など密な一覧の走査性向上に。既定はグレー。色は装飾（状態ではない）。(#331)"
                : "Optional. Hashes a seed (e.g. the name) to one of a few contrast-safe tone pairs, deterministically (same seed = same color) — for scannable dense directories. Defaults to gray. The hue is decorative, not status. (#331)",
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
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: アバター（Avatar）" : "UIXHERO: Avatar (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/avatar`,
                },
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
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {locale === "ja" ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {locale === "ja" ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>色は身元の目印であって、状態ではない。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">AvatarFallback</code> の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">colorSeed</code> に名前などを渡すと、決まった計算で同じ色に落ちます。同じ名前なら常に同じ色です。頭文字が並んだときに全部同じ灰色になるのを避けるためのもので、色は身元の手がかりであって良し悪しを意味しません（#331）。色は背景と文字の組でトークンから取るので、明るいテーマでも暗いテーマでも読めます。
                        </li>
                        <li>
                            <strong>在席の点は、文言を渡したときだけ読み上げに乗る。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">presence</code> の点は色だけの表現です。そこで <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">presenceLabel</code> を渡したときは点に <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-label</code> が付き、渡さないときは <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-hidden</code> になります。色が見えない人にも伝えたいなら文言を渡す、という分かれ道を明示にしてあります。見本では <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tooltip</code> にも名前と在席を一緒に入れています。
                        </li>
                        <li>
                            <strong>丸だけで誰か分からないときは、名前を添えられるようにする。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tooltip</code> を渡すと、アバター全体がツールチップのトリガーになります。画像が読めなかったときに頭文字へ落とす切り替えは Radix の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Avatar</code> が持っているので、こちらでは書いていません。頭文字を何文字にするか、並べるときの上限をいくつにするかは資料に書いてあります。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Colour is an identity cue, not a status.</strong> Pass a name to <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">colorSeed</code> on <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">AvatarFallback</code> and it hashes to one fixed tone; the same name always lands on the same colour. It exists so a dense column of initials is scannable instead of a wall of identical grey. The hue says who, not how good (#331). Each tone is a background and foreground pair from the token set, so it stays readable in both themes.
                        </li>
                        <li>
                            <strong>The presence dot reaches a screen reader only when you label it.</strong> The <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">presence</code> dot is colour on its own. Pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">presenceLabel</code> and the dot gets an <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-label</code>; leave it out and the dot becomes <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-hidden</code>. The fork is deliberate and explicit. The demo also folds the name and the presence into the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tooltip</code>.
                        </li>
                        <li>
                            <strong>A bare circle can carry a name.</strong> Passing <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tooltip</code> turns the whole avatar into a tooltip trigger. Falling back from image to initials is handled by the Radix <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Avatar</code>, so it is not reimplemented here. How many initials to show, and the cap for a stacked group, are covered in the article.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
