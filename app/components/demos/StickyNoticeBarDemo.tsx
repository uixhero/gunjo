"use client";

import * as React from "react";
import { Button, StickyNoticeBar, TextLink } from "@gunjo/ui";
import { IconSpeakerphone as Speakerphone } from "@tabler/icons-react";

type Locale = "ja" | "en";

const copy = {
    ja: {
        message: "デザインレビュー用チェックリストを更新しました。長い告知も省略せず、狭い画面では折り返して表示します。",
        action: "変更点を見る",
        dismiss: "告知を閉じる",
        restore: "告知をもう一度表示",
        heading: "スクロールして追従を確認",
        body: "この領域をスクロールしても、告知バーは選択した端に残ります。",
        details: "変更点",
        detailsBody: "レビュー項目にアクセシビリティとダークモードの確認を追加しました。",
    },
    en: {
        message: "The design review checklist has been updated. Long announcements wrap instead of being truncated on narrow screens.",
        action: "View changes",
        dismiss: "Dismiss announcement",
        restore: "Show announcement again",
        heading: "Scroll to verify the fixed position",
        body: "The notice stays at the selected edge while this viewport scrolls.",
        details: "Changes",
        detailsBody: "Accessibility and dark-theme checks were added to the review checklist.",
    },
} satisfies Record<Locale, Record<string, string>>;

export function StickyNoticeBarViewportDemo({ locale = "en" }: { locale?: Locale }) {
    const labels = copy[locale];
    const [visible, setVisible] = React.useState(true);

    return (
        <main className="h-screen min-h-[420px] overflow-hidden bg-background text-foreground">
            {visible ? (
                <StickyNoticeBar
                    edge="top"
                    icon={<Speakerphone className="h-5 w-5" />}
                    action={<TextLink href="#sticky-notice-details">{labels.action}</TextLink>}
                    dismissLabel={labels.dismiss}
                    onDismiss={() => setVisible(false)}
                >
                    {labels.message}
                </StickyNoticeBar>
            ) : null}

            <div className="h-full overflow-y-auto px-6 pb-24 pt-28">
                <div className="mx-auto flex max-w-2xl flex-col gap-72">
                    {!visible ? (
                        <Button size="touch" onClick={() => setVisible(true)}>
                            {labels.restore}
                        </Button>
                    ) : null}
                    <section className="space-y-3 rounded-xl border bg-card p-6">
                        <h1 className="text-2xl font-semibold">{labels.heading}</h1>
                        <p className="text-sm text-muted-foreground">{labels.body}</p>
                    </section>
                    <section id="sticky-notice-details" className="scroll-mt-28 space-y-3 rounded-xl border bg-card p-6">
                        <h2 className="text-xl font-semibold">{labels.details}</h2>
                        <p className="text-sm text-muted-foreground">{labels.detailsBody}</p>
                    </section>
                </div>
            </div>
        </main>
    );
}

export function StickyNoticeBarContainedDemo({ locale = "en" }: { locale?: Locale }) {
    const labels = copy[locale];
    const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
    const [visible, setVisible] = React.useState(true);

    return (
        <div
            ref={setContainer}
            className="relative h-72 w-full overflow-hidden rounded-lg border bg-background text-foreground"
        >
            {container && visible ? (
                <StickyNoticeBar
                    edge="bottom"
                    placement="container"
                    portalContainer={container}
                    icon={<Speakerphone className="h-5 w-5" />}
                    action={<TextLink href="#contained-notice-details">{labels.action}</TextLink>}
                    dismissLabel={labels.dismiss}
                    onDismiss={() => setVisible(false)}
                >
                    {labels.message}
                </StickyNoticeBar>
            ) : null}
            <div className="h-full overflow-y-auto px-6 pb-32 pt-6">
                <div className="space-y-48">
                    <section className="space-y-3">
                        <h3 className="text-lg font-semibold">{labels.heading}</h3>
                        <p className="text-sm text-muted-foreground">{labels.body}</p>
                        {!visible ? (
                            <Button size="touch" onClick={() => setVisible(true)}>
                                {labels.restore}
                            </Button>
                        ) : null}
                    </section>
                    <section id="contained-notice-details" className="space-y-2">
                        <h4 className="font-semibold">{labels.details}</h4>
                        <p className="text-sm text-muted-foreground">{labels.detailsBody}</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
