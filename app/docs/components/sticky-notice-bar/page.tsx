"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import {
    CodeCopyButton,
    ComponentLayout,
    ComponentPreview,
} from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
    StickyNoticeBarContainedDemo,
    StickyNoticeBarViewportDemo,
} from "@/components/demos/StickyNoticeBarDemo";
import feedbackMetadata from "@design/feedback-metadata.json";
import { DocNote } from "@gunjo/ui";

const topCodeByLocale = {
    ja: `import * as React from "react"
import { Button, StickyNoticeBar, TextLink } from "@gunjo/ui"
import { IconSpeakerphone as Speakerphone } from "@tabler/icons-react"

export function SiteAnnouncement() {
  const [visible, setVisible] = React.useState(true)

  return (
    <main className="h-screen overflow-hidden bg-background text-foreground">
      {visible ? (
        <StickyNoticeBar
          edge="top"
          icon={<Speakerphone className="h-5 w-5" />}
          action={<TextLink href="#release-notes">変更点を見る</TextLink>}
          dismissLabel="告知を閉じる"
          onDismiss={() => setVisible(false)}
        >
          デザインレビュー用チェックリストを更新しました。長い告知は狭い画面で折り返します。
        </StickyNoticeBar>
      ) : null}

      <div className="h-full overflow-y-auto px-6 pb-24 pt-28">
        {!visible ? (
          <Button size="touch" onClick={() => setVisible(true)}>
            告知をもう一度表示
          </Button>
        ) : null}
        <section id="release-notes" className="mt-[36rem] scroll-mt-28">
          <h2>変更点</h2>
        </section>
      </div>
    </main>
  )
}`,
    en: `import * as React from "react"
import { Button, StickyNoticeBar, TextLink } from "@gunjo/ui"
import { IconSpeakerphone as Speakerphone } from "@tabler/icons-react"

export function SiteAnnouncement() {
  const [visible, setVisible] = React.useState(true)

  return (
    <main className="h-screen overflow-hidden bg-background text-foreground">
      {visible ? (
        <StickyNoticeBar
          edge="top"
          icon={<Speakerphone className="h-5 w-5" />}
          action={<TextLink href="#release-notes">View changes</TextLink>}
          dismissLabel="Dismiss announcement"
          onDismiss={() => setVisible(false)}
        >
          The design review checklist has been updated. Long announcements wrap on narrow screens.
        </StickyNoticeBar>
      ) : null}

      <div className="h-full overflow-y-auto px-6 pb-24 pt-28">
        {!visible ? (
          <Button size="touch" onClick={() => setVisible(true)}>
            Show announcement again
          </Button>
        ) : null}
        <section id="release-notes" className="mt-[36rem] scroll-mt-28">
          <h2>Changes</h2>
        </section>
      </div>
    </main>
  )
}`,
};

const bottomCodeByLocale = {
    ja: `import * as React from "react"
import { StickyNoticeBar, TextLink } from "@gunjo/ui"
import { IconSpeakerphone as Speakerphone } from "@tabler/icons-react"

export function ContainedAnnouncement() {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null)
  const [visible, setVisible] = React.useState(true)

  return (
    <div ref={setContainer} className="relative h-72 overflow-hidden rounded-lg border">
      {container && visible ? (
        <StickyNoticeBar
          edge="bottom"
          placement="container"
          portalContainer={container}
          icon={<Speakerphone className="h-5 w-5" />}
          action={<TextLink href="#details">変更点を見る</TextLink>}
          dismissLabel="告知を閉じる"
          onDismiss={() => setVisible(false)}
        >
          デザインレビュー用チェックリストを更新しました。
        </StickyNoticeBar>
      ) : null}
      <div className="h-full overflow-y-auto pb-32">
        <section id="details">変更点</section>
      </div>
    </div>
  )
}`,
    en: `import * as React from "react"
import { StickyNoticeBar, TextLink } from "@gunjo/ui"
import { IconSpeakerphone as Speakerphone } from "@tabler/icons-react"

export function ContainedAnnouncement() {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null)
  const [visible, setVisible] = React.useState(true)

  return (
    <div ref={setContainer} className="relative h-72 overflow-hidden rounded-lg border">
      {container && visible ? (
        <StickyNoticeBar
          edge="bottom"
          placement="container"
          portalContainer={container}
          icon={<Speakerphone className="h-5 w-5" />}
          action={<TextLink href="#details">View changes</TextLink>}
          dismissLabel="Dismiss announcement"
          onDismiss={() => setVisible(false)}
        >
          The design review checklist has been updated.
        </StickyNoticeBar>
      ) : null}
      <div className="h-full overflow-y-auto pb-32">
        <section id="details">Changes</section>
      </div>
    </div>
  )
}`,
};

const viewportCodeByLocale = {
    ja: `import * as React from "react"
import { StickyNoticeBar, TextLink } from "@gunjo/ui"
import { IconSpeakerphone as Speakerphone } from "@tabler/icons-react"

export function TopAnnouncement() {
  const [visible, setVisible] = React.useState(true)

  if (!visible) return null

  return (
    // placement は既定の viewport＝body へ portal して fixed で置きます。
    // 祖先の overflow に影響されないので、どこから呼んでも画面の上端に付きます。
    <StickyNoticeBar
      edge="top"
      icon={<Speakerphone className="h-5 w-5" />}
      action={<TextLink href="#release-notes">変更点を見る</TextLink>}
      dismissLabel="告知を閉じる"
      onDismiss={() => setVisible(false)}
    >
      デザインレビュー用チェックリストを更新しました。
    </StickyNoticeBar>
  )
}`,
    en: `import * as React from "react"
import { StickyNoticeBar, TextLink } from "@gunjo/ui"
import { IconSpeakerphone as Speakerphone } from "@tabler/icons-react"

export function TopAnnouncement() {
  const [visible, setVisible] = React.useState(true)

  if (!visible) return null

  return (
    // placement defaults to viewport: portalled to body and positioned fixed,
    // so an ancestor with overflow cannot clip it wherever it is called from.
    <StickyNoticeBar
      edge="top"
      icon={<Speakerphone className="h-5 w-5" />}
      action={<TextLink href="#release-notes">View changes</TextLink>}
      dismissLabel="Dismiss announcement"
      onDismiss={() => setVisible(false)}
    >
      The design review checklist has been updated.
    </StickyNoticeBar>
  )
}`,
};

const longCopyCodeByLocale = {
    ja: `import * as React from "react"
import { StickyNoticeBar, TextLink } from "@gunjo/ui"
import { IconSpeakerphone as Speakerphone } from "@tabler/icons-react"

const MESSAGE =
  "デザインレビュー用チェックリストを更新しました。長い告知も省略せず、狭い画面では折り返して表示します。"

export function LongAnnouncement() {
  const [visible, setVisible] = React.useState(true)

  if (!visible) return null

  return (
    // 本文は省略しません。狭い画面では本文が折り返し、
    // リンクと閉じるボタンが次の行に落ちます（sm 未満は縦積み）。
    <StickyNoticeBar
      edge="top"
      icon={<Speakerphone className="h-5 w-5" />}
      action={<TextLink href="#release-notes">変更点を見る</TextLink>}
      dismissLabel="告知を閉じる"
      onDismiss={() => setVisible(false)}
    >
      {MESSAGE}
    </StickyNoticeBar>
  )
}`,
    en: `import * as React from "react"
import { StickyNoticeBar, TextLink } from "@gunjo/ui"
import { IconSpeakerphone as Speakerphone } from "@tabler/icons-react"

const MESSAGE =
  "The design review checklist has been updated. Long announcements wrap instead of being truncated on narrow screens."

export function LongAnnouncement() {
  const [visible, setVisible] = React.useState(true)

  if (!visible) return null

  return (
    // The copy is never truncated. On a narrow screen it wraps and the link
    // and dismiss control drop to their own row (stacked below sm).
    <StickyNoticeBar
      edge="top"
      icon={<Speakerphone className="h-5 w-5" />}
      action={<TextLink href="#release-notes">View changes</TextLink>}
      dismissLabel="Dismiss announcement"
      onDismiss={() => setVisible(false)}
    >
      {MESSAGE}
    </StickyNoticeBar>
  )
}`,
};

export default function StickyNoticeBarPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variations";

    const usageCode = topCodeByLocale[locale];

    const bottomCode = bottomCodeByLocale[locale];

    const propsData = [
        {
            name: "edge",
            type: "'top' | 'bottom'",
            required: true,
            description: isJa
                ? "表示する端です。既定値はなく、必ず一方を選びます。"
                : "Required edge. There is intentionally no default.",
        },
        {
            name: "children",
            type: "React.ReactNode",
            required: true,
            description: isJa
                ? "告知本文です。長文は省略せず折り返します。"
                : "Announcement content. Long copy wraps instead of truncating.",
        },
        {
            name: "icon",
            type: "React.ReactNode",
            description: isJa ? "装飾扱いの先頭アイコンです。" : "Optional decorative leading icon.",
        },
        {
            name: "action",
            type: "React.ReactNode",
            description: isJa
                ? "閉じるボタンより前に置くリンクまたはボタンです。"
                : "Link or button rendered before the dismiss control.",
        },
        {
            name: "onDismiss",
            type: "() => void",
            description: isJa
                ? "指定すると44pxの閉じるボタンを表示します。表示状態は利用側で管理します。"
                : "Shows a 44px dismiss control. The consumer owns visibility state.",
        },
        {
            name: "dismissLabel",
            type: "string",
            default: "'Dismiss announcement'",
            description: isJa
                ? "閉じるボタンの aria-label とツールチップです。"
                : "aria-label and tooltip for the dismiss button.",
        },
        {
            name: "placement",
            type: "'viewport' | 'container'",
            default: "'viewport'",
            description: isJa
                ? "通常は fixed。疑似ブラウザ内では container を使います。"
                : "Fixed by default; use container for a contained fake viewport.",
        },
        {
            name: "portalContainer",
            type: "HTMLElement | null",
            description: isJa
                ? "container 配置の portal 先です。位置決めの基準を持つ要素を渡します。"
                : "Portal target for container placement; it must establish positioning.",
        },
    ];

    return (
        <ComponentLayout
            title={feedbackMetadata.stickyNoticeBar.title}
            description={feedbackMetadata.stickyNoticeBar.description}
            usedComponents={[
                { name: "StickyNoticeBar", href: "/docs/components/sticky-notice-bar" },
                { name: "TextLink", href: "/docs/components/text-link" },
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
            ]}
            relatedComponents={[
                { name: "Banner", href: "/docs/components/banner" },
                { name: "ToastProvider", href: "/docs/components/toast-provider" },
                { name: "BottomActionBar", href: "/docs/components/bottom-action-bar" },
            ]}
            sectionLabels={sectionLabels}
        >
            <ComponentPreview
                embedSrc="/embed/sticky-notice-bar"
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                previewHeight={420}
                previewBodyWidth="xl"
                sectionLabels={sectionLabels}
            >
                <StickyNoticeBarViewportDemo locale={locale} />
            </ComponentPreview>

            <DocNote variant="note" heading={isJa ? "単一スロットと配置の契約" : "Single-slot and positioning contract"}>
                <div className="space-y-2 text-sm leading-relaxed">
                    <p>
                        {isJa
                            ? "edge は必須で既定値がありません。同じ document に複数 mount すると先着1件だけを表示し、後着は描画せず hidden な data-sticky-notice-bar-suppressed=\"true\" を残して、すべてのビルドで console.error を記録します。上下を同時に使う運用はできません。"
                            : "edge is required with no default. When multiple instances mount in one document, only the first renders; later instances remain hidden, leave data-sticky-notice-bar-suppressed=\"true\", and log console.error in every build. Top and bottom cannot be used together."}
                    </p>
                    <p>
                        {isJa
                            ? "viewport 配置は body portal + fixed です。祖先 overflow の影響を避け、z-40 で標準 overlay より下、装飾層より前に置きます。透明な外枠は pointer-events-none、実バーだけ pointer-events-auto です。"
                            : "Viewport placement uses a body portal and fixed positioning to avoid ancestor overflow. It sits at z-40 below standard overlays; only the visible bar accepts pointer events."}
                    </p>
                    <p>
                        {isJa
                            ? "上下のセーフエリアを反映し、出入りのアニメーションは付けていないため reduced-motion で追加対応が必要な動きはありません。"
                            : "Top and bottom safe areas are respected. There is no enter/exit animation, so the component introduces no motion that needs a reduced-motion override."}
                    </p>
                </div>
            </DocNote>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "bottom-contained",
                            title: isJa ? "下端・疑似ブラウザ内" : "Bottom edge in a contained viewport",
                            description: isJa
                                ? "下端はホームインジケータ用の safe-area-inset-bottom を含みます。"
                                : "The bottom edge includes safe-area-inset-bottom for home indicators.",
                            preview: <StickyNoticeBarContainedDemo locale={locale} />,
                            previewBodyWidth: "xl",
                            code: bottomCode,
                        },
                        {
                            key: "top-viewport",
                            title: isJa ? "上端・画面いっぱい" : "Top edge across the viewport",
                            description: isJa
                                ? "既定の placement は viewport で、body へ portal して fixed で置きます。祖先の overflow に切られないので、どの画面から呼んでも上端に付きます。上端は safe-area-inset-top を含みます。"
                                : "The default placement is viewport: portalled to body and fixed, so no ancestor overflow can clip it. The top edge includes safe-area-inset-top.",
                            preview: <StickyNoticeBarViewportDemo locale={locale} />,
                            embedSrc: "/embed/sticky-notice-bar",
                            previewHeight: 420,
                            previewBodyWidth: "xl",
                            code: viewportCodeByLocale[locale],
                        },
                        {
                            key: "long-copy-narrow",
                            title: isJa ? "長い告知を狭い画面で読む" : "Long copy on a narrow screen",
                            description: isJa
                                ? "本文は省略しません。狭い画面では本文が折り返し、リンクと閉じるボタンが次の行に落ちます。1行に収めるために文章を削らなくて済みます。"
                                : "The copy is never truncated. On a narrow screen it wraps and the link and dismiss control drop to their own row, so the message does not have to be cut to fit one line.",
                            preview: <StickyNoticeBarViewportDemo locale={locale} />,
                            embedSrc: "/embed/sticky-notice-bar",
                            previewHeight: 420,
                            previewBodyWidth: "sm",
                            fitViewport: "mobile",
                            code: longCopyCodeByLocale[locale],
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="props">
                    {sectionLabels.props ?? "Props"}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-center justify-between gap-4 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="usage">
                        {sectionLabels.usage ?? "Usage"}
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
