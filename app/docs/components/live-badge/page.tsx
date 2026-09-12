"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { DocNote, Label, LiveBadge, Statistic, Switch, TimeTransport } from "@gunjo/ui";

type Locale = "ja" | "en";

/** ⚠️ Constants, not a clock: the page must render the same on the server. */
const SNAPSHOT_TIME = "09:40";
const DEMO_NOW = Date.UTC(2026, 8, 12, 3, 0, 0);
const HOUR = 3_600_000;

/**
 * The pair the badge is designed for: while the feed is live the badge says so;
 * when it is not, the same spot answers "then when is this from?".
 */
function LiveBadgeDemo({ locale }: { locale: Locale }) {
    const isJa = locale === "ja";
    const [live, setLive] = React.useState(true);

    return (
        <div className="flex w-full flex-col gap-5">
            <Statistic
                label={
                    <span className="inline-flex items-center gap-2">
                        {isJa ? "待ち時間" : "Wait time"}
                        <LiveBadge
                            live={live}
                            detached={isJa ? `${SNAPSHOT_TIME} 時点` : `as of ${SNAPSHOT_TIME}`}
                        >
                            {isJa ? "LIVE" : "LIVE"}
                        </LiveBadge>
                    </span>
                }
                value={isJa ? "12分" : "12 min"}
                hint={
                    live
                        ? isJa
                            ? "10秒ごとに更新しています"
                            : "Updating every 10 seconds"
                        : isJa
                          ? "更新は止まっています"
                          : "Updates are paused"
                }
            />

            <div className="flex items-center gap-2">
                <Switch id="live-badge-live" checked={live} onCheckedChange={setLive} />
                <Label htmlFor="live-badge-live">
                    {isJa ? "いまの値を受け取っている" : "Receiving live values"}
                </Label>
            </div>
        </div>
    );
}

/** The transport renders its own live state with this badge. */
function TransportDemo({ locale }: { locale: Locale }) {
    const isJa = locale === "ja";
    const [value, setValue] = React.useState(DEMO_NOW - 3 * HOUR);
    const format = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return (
        <TimeTransport
            value={value}
            now={DEMO_NOW}
            onValueChange={setValue}
            jumps={[
                { offset: -HOUR, label: isJa ? "1時間" : "1h" },
                { offset: HOUR, label: isJa ? "1時間" : "1h" },
            ]}
            formatValue={(v) => format.format(new Date(v))}
            secondary={isJa ? "2026-09-12 JST" : "12 Sep 2026, JST"}
            labels={
                isJa
                    ? {
                          group: "時間の操作",
                          returnToNow: "いまへ戻る",
                          live: "実時間",
                          detached: "いまではない",
                          jumpBack: (label: string) => `${label}戻す`,
                          jumpForward: (label: string) => `${label}進める`,
                      }
                    : undefined
            }
        />
    );
}

export default function LiveBadgeDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const content = getDocContent("components/live-badge", locale);
    const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
    const title = content?.title ?? metadata.liveBadge.title ?? "LiveBadge";
    const description = content?.description ?? metadata.liveBadge.description ?? "";

    const usageCode = isJa
        ? `import { LiveBadge } from "@gunjo/ui";

// ⭐ live かどうかは呼び出し側が決めます。札は時計も持たず、比較もしません。
export function WaitTime({ value, connected, receivedAt }) {
  return (
    <Statistic
      label={
        <span className="inline-flex items-center gap-2">
          待ち時間
          {/* 実時間から外れたら、札の代わりに「いつの値か」を出します */}
          <LiveBadge live={connected} detached={\`\${receivedAt} 時点\`}>
            LIVE
          </LiveBadge>
        </span>
      }
      value={value}
    />
  );
}

// detached を渡さなければ、外れているとき札そのものが消えます（推測しません）
<LiveBadge live={false} />

// 変化そのものが知らせたいことなら、読み上げ領域は呼び出し側で付けます
<LiveBadge live={connected} detached={receivedAt} role="status" />`
        : `import { LiveBadge } from "@gunjo/ui";

// ⭐ Liveness is the caller's decision. The badge holds no clock and
// compares nothing.
export function WaitTime({ value, connected, receivedAt }) {
  return (
    <Statistic
      label={
        <span className="inline-flex items-center gap-2">
          Wait time
          {/* Off the live edge, the badge states WHEN instead */}
          <LiveBadge live={connected} detached={\`as of \${receivedAt}\`}>
            LIVE
          </LiveBadge>
        </span>
      }
      value={value}
    />
  );
}

// With no detached content the badge disappears entirely — it will not guess
<LiveBadge live={false} />

// When the change itself is the news, the caller adds the live region
<LiveBadge live={connected} detached={receivedAt} role="status" />`;

    const propsData = [
        {
            name: "live",
            type: "boolean",
            defaultValue: "true",
            description: isJa
                ? "隣の値がいまの値かどうか。決めるのは呼び出し側です。札は時計を持たず、何も比較しません。"
                : "Whether the value beside the badge is the current one. The caller decides — the badge holds no clock and compares nothing.",
        },
        {
            name: "children",
            type: "ReactNode",
            defaultValue: '"LIVE"',
            description: isJa
                ? "live のときの札の文字。⚠️ 必ず言葉にしてください。明滅する点は飾りで、点だけに載せた状態は半分の読み手に届きません。"
                : "The word on the badge while live. ⚠️ Keep it a word — the pulsing dot is decoration, and a state carried by a dot alone reaches only half the readers.",
        },
        {
            name: "detached",
            type: "ReactNode",
            description: isJa
                ? "live でないときに、札の代わりに出すもの＝「ではいつの値か」の答え（日付・時刻・「09:40 時点」）。渡さなければ何も描きません（部品は推測しません）。"
                : "What to show instead when live is false — the answer to “then when is this from?”. Omit it and the badge renders nothing at all.",
        },
        {
            name: "size",
            type: '"sm" | "default" | "lg"',
            defaultValue: '"default"',
            description: isJa ? "大きさ。Badge と同じ段です。" : "Pill size, the same scale as Badge.",
        },
        {
            name: "as",
            type: '"span" | "div"',
            defaultValue: '"span"',
            description: isJa
                ? "描く要素。既定は span で、文の中にも置けます。"
                : "The element to render. Defaults to span, so it is valid inside flow content.",
        },
    ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Badge", href: "/docs/components/badge" },
                { name: "Statistic", href: "/docs/components/statistic" },
                { name: "TimeTransport", href: "/docs/components/time-transport" },
                { name: "Switch", href: "/docs/components/switch" },
                { name: "Label", href: "/docs/components/label" },
            ]}
            relatedComponents={[
                { name: "Badge", href: "/docs/components/badge" },
                { name: "ExpiryBadge", href: "/docs/components/expiry-badge" },
                { name: "TimeTransport", href: "/docs/components/time-transport" },
                { name: "DayBand", href: "/docs/components/day-band" },
            ]}
        >
            <ComponentPreview
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                sectionLabels={sectionLabels}
                previewHeight="auto"
                previewBodyWidth="md"
            >
                <LiveBadgeDemo locale={locale as Locale} />
            </ComponentPreview>

            <DocNote
                variant="warning"
                heading={
                    isJa
                        ? "色と点だけに載せません。動きを減らす設定では明滅しません"
                        : "Never the dot or the colour alone — and no pulse under reduced motion"
                }
            >
                {isJa
                    ? "札には必ず言葉（既定は LIVE）が乗ります。明滅する点は「何かがまだ届いている」を添えるだけの飾りで、それだけで状態を伝えることはありません。動きを減らす設定（prefers-reduced-motion: reduce）では、点は残したまま明滅だけが止まります。消してしまうと理由もなく手がかりが1つ減るためです。"
                    : "The badge always carries a word (LIVE by default). The pulsing dot only adds “something is still arriving”; it never carries the state on its own. Under prefers-reduced-motion: reduce the dot stays put and simply stops breathing — removing it would take away a cue for no reason."}
            </DocNote>

            <DocNote variant="note" heading={isJa ? "似た部品との境界" : "Where the neighbours stop"}>
                {isJa ? (
                    <ul className="ml-4 list-disc space-y-1">
                        <li>
                            <strong>Badge</strong> — 鮮度の話ではない状態（下書き・承認済み・重要）はこちら。
                            LiveBadge はその Badge を組んで作っています。
                        </li>
                        <li>
                            <strong>ExpiryBadge</strong> — <strong>締切</strong>までの残り。こちらは「いまの値かどうか」で、
                            期限とは別の軸です。
                        </li>
                        <li>
                            <strong>TimeTransport</strong> — 読み手が値を<strong>動かす</strong>ときの操作盤。
                            その中の実時間の札は、この部品が描いています。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-1">
                        <li>
                            <strong>Badge</strong> — for a state that is not about freshness (draft, approved,
                            priority). LiveBadge is built from it.
                        </li>
                        <li>
                            <strong>ExpiryBadge</strong> — time left before a <strong>deadline</strong>. This badge is
                            about whether a value is current, which is a different axis.
                        </li>
                        <li>
                            <strong>TimeTransport</strong> — the transport for when the reader also needs to{" "}
                            <strong>move</strong> the value. Its live chip is this badge.
                        </li>
                    </ul>
                )}
            </DocNote>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {isJa ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "live",
                            title: isJa ? "いまの値" : "Live",
                            description: isJa
                                ? "success の色・枠・言葉と、ゆっくり明滅する点。点は飾りで、状態を言っているのは文字です。"
                                : "The success tone, a border, a word — and a dot that pulses slowly. The dot is decoration; the word carries the state.",
                            preview: <LiveBadge>LIVE</LiveBadge>,
                            code: `<LiveBadge>LIVE</LiveBadge>`,
                        },
                        {
                            key: "detached",
                            title: isJa ? "いつの値か" : "The “when” instead",
                            description: isJa
                                ? "実時間から外れたら、札は LIVE を名乗らず、その場所で「いつの値か」を答えます。色も warning に替わりますが、言っているのは文字です。"
                                : "Off the live edge the badge stops claiming LIVE and answers when the value is from. The tone changes to warning, but the words do the telling.",
                            preview: <LiveBadge live={false} detached={isJa ? "09:40 時点" : "as of 09:40"} />,
                            code: `<LiveBadge live={false} detached="09:40 時点" />`,
                        },
                        {
                            key: "empty",
                            title: isJa ? "何も出さない" : "Nothing at all",
                            description: isJa
                                ? "live でなく、detached も渡されていないとき、札は何も描きません。いつの値か分からないのに札を残すと、古い値が現在の値に見えます。（下のプレビューは空です）"
                                : "Not live and no detached content: the badge renders nothing. Leaving a badge up without knowing when the value is from makes a stale number look current. (The preview below is empty.)",
                            preview: (
                                <div className="text-sm text-muted-foreground">
                                    <LiveBadge live={false} />
                                    {isJa ? "（札は描かれていません）" : "(no badge is rendered)"}
                                </div>
                            ),
                            code: `<LiveBadge live={false} />`,
                        },
                        {
                            key: "sizes",
                            title: isJa ? "大きさ" : "Sizes",
                            description: isJa
                                ? "Badge と同じ段（sm / default / lg）。密な盤では sm、見出しの横では lg。"
                                : "The Badge scale: sm / default / lg. sm for a dense board, lg beside a heading.",
                            preview: (
                                <div className="flex flex-wrap items-center gap-3">
                                    <LiveBadge size="sm">LIVE</LiveBadge>
                                    <LiveBadge>LIVE</LiveBadge>
                                    <LiveBadge size="lg">LIVE</LiveBadge>
                                </div>
                            ),
                            code: `<LiveBadge size="sm">LIVE</LiveBadge>`,
                        },
                        {
                            key: "wording",
                            title: isJa ? "言葉を差し替える" : "Other wording",
                            description: isJa
                                ? "「LIVE」でなければならない理由はありません。実況・受信中・自動更新中など、その画面の言葉にします。"
                                : "Nothing requires the word LIVE. Use the wording of the screen it sits on.",
                            preview: (
                                <div className="flex flex-wrap items-center gap-3">
                                    <LiveBadge>{isJa ? "実況中" : "ON AIR"}</LiveBadge>
                                    <LiveBadge>{isJa ? "受信中" : "STREAMING"}</LiveBadge>
                                    <LiveBadge size="sm">{isJa ? "自動更新" : "AUTO"}</LiveBadge>
                                </div>
                            ),
                            code: `<LiveBadge>実況中</LiveBadge>`,
                        },
                        {
                            key: "transport",
                            title: isJa ? "TimeTransport の中" : "Inside TimeTransport",
                            description: isJa
                                ? "操作盤の実時間の札は、この部品が描いています。時刻を動かすと札は「いつの値か」の側に替わります（同じ形を2か所に作り置きしません）。"
                                : "The transport's live chip is this badge. Move the value and it switches to the “when” side — one implementation, not two lookalikes.",
                            preview: <TransportDemo locale={locale as Locale} />,
                            code: `<TimeTransport value={value} now={now} … />`,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">
                        {sectionLabels.usage}
                    </h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
                    <CodeBlock code={usageCode} />
                </div>
            </section>

            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {isJa ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {isJa ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>「LIVE」を独立した札にしています。</strong>
                            出どころでは <code>EARTH · TERMINATOR LIVE</code> と一続きの文字で出していて、
                            触ってもらった人に「どういう意味？」と聞かれました。枠で囲って言葉を独立させると、
                            それが状態の札だと分かります。
                        </li>
                        <li>
                            <strong>読み上げ領域には、既定ではしていません。</strong>
                            <code>role=&quot;status&quot;</code> を既定で付けると、再接続のたびに読み上げへ割り込みます。
                            多くの画面でこの札は環境音なので、割り込むべき画面でだけ呼び出し側が付けます。
                        </li>
                        <li>
                            <strong>外れているときに「古い」とは言いません。</strong>
                            言うのは<strong>いつの値か</strong>です。読み手が必要としているのは評価ではなく時刻で、
                            それが分からないなら札は出しません。
                        </li>
                        <li>
                            <strong>時計を持たず、何も比較しません。</strong>
                            「いまの値か」は締切・再接続・バッファなど画面ごとの事情で決まります。
                            2つの数の差では言えないので、判断は呼び出し側に置いています（
                            <code>TimeTransport</code> と同じ決まり）。
                        </li>
                        <li>
                            <strong>Badge を組んで作っています。</strong>
                            枠・色・大きさの段はすでにあるので、足したのは明滅する点と、live / 外れているの対だけです。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>LIVE is its own pill.</strong> The implementation this came from ran it together
                            with the stamp — <code>EARTH · TERMINATOR LIVE</code> — and a tester asked what the phrase
                            meant. Boxing the word makes it read as a state.
                        </li>
                        <li>
                            <strong>It is not a live region by default.</strong> A default{" "}
                            <code>role=&quot;status&quot;</code> would interrupt a screen reader on every reconnection.
                            On most screens this badge is ambient, so the caller adds the region where the change really
                            is the news.
                        </li>
                        <li>
                            <strong>Detached does not say &quot;stale&quot;.</strong> It says <strong>when</strong>. The
                            reader needs a timestamp, not a verdict — and if there is no timestamp, the badge stays out.
                        </li>
                        <li>
                            <strong>No clock, no comparison.</strong> Whether a value is current depends on cut-offs,
                            reconnections and buffering, which the distance between two numbers cannot express, so the
                            decision stays with the caller (the <code>TimeTransport</code> rule).
                        </li>
                        <li>
                            <strong>Composed from Badge.</strong> The border, the tones and the size scale already
                            existed; the only new parts are the pulsing dot and the live/detached pair.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
