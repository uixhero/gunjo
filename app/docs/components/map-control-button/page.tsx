"use client";

import * as React from "react";
import { IconCircleDot, IconMapPin, IconMinus, IconPlus } from "@tabler/icons-react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { MapDemoSurface } from "@/components/doc/MapDemoSurface";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";
import { DocNote, Label, MapControlButton, ScaleBar, Switch, type MapControlButtonStatus } from "@gunjo/ui";

type Locale = "ja" | "en";

/**
 * The column the component was designed for: zoom, the picked place, my
 * location. "Picked place" stays disabled until a place is picked; "my
 * location" goes busy, then either on or a brief failure mark.
 */
function MapColumnDemo({ locale }: { locale: Locale }) {
    const isJa = locale === "ja";
    const [zoom, setZoom] = React.useState(3);
    const [picked, setPicked] = React.useState(false);
    const [following, setFollowing] = React.useState(false);
    const [status, setStatus] = React.useState<MapControlButtonStatus>("idle");
    const [fail, setFail] = React.useState(false);
    const timer = React.useRef<number | null>(null);
    React.useEffect(() => () => {
        if (timer.current !== null) window.clearTimeout(timer.current);
    }, []);

    const locate = () => {
        if (following) {
            setFollowing(false);
            return;
        }
        setStatus("busy");
        timer.current = window.setTimeout(() => {
            if (fail) {
                setStatus("error");
                timer.current = window.setTimeout(() => setStatus("idle"), 1600);
            } else {
                setStatus("idle");
                setFollowing(true);
            }
        }, 1200);
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <MapDemoSurface ratio="square">
                <div className="absolute bottom-3 left-3">
                    <ScaleBar metersPerPixel={2 ** (6 - zoom) * 50} label={isJa ? "縮尺" : "Scale"} />
                </div>
                <div className="absolute bottom-3 right-3 flex flex-col items-center gap-2">
                    <MapControlButton
                        label={isJa ? "拡大" : "Zoom in"}
                        onClick={() => setZoom((z) => Math.min(6, z + 1))}
                        disabled={zoom >= 6}
                        disabledReason={isJa ? "これ以上は拡大できません" : "Already at the closest zoom"}
                    >
                        <IconPlus />
                    </MapControlButton>
                    <MapControlButton
                        label={isJa ? "縮小" : "Zoom out"}
                        onClick={() => setZoom((z) => Math.max(0, z - 1))}
                        disabled={zoom <= 0}
                        disabledReason={isJa ? "これ以上は縮小できません" : "Already at the widest zoom"}
                    >
                        <IconMinus />
                    </MapControlButton>
                    <MapControlButton
                        label={isJa ? "選んだ地点へ" : "Go to the picked place"}
                        disabled={!picked}
                        disabledReason={isJa ? "先に地図で地点を選んでください" : "Pick a place on the map first"}
                    >
                        <IconCircleDot />
                    </MapControlButton>
                    <MapControlButton
                        label={isJa ? "現在地へ" : "Go to my location"}
                        pressed={following}
                        status={status}
                        statusLabel={
                            status === "busy"
                                ? isJa
                                    ? "現在地を取得しています"
                                    : "Finding your location"
                                : isJa
                                  ? "現在地を取得できませんでした"
                                  : "Could not find your location"
                        }
                        onClick={locate}
                    >
                        <IconMapPin />
                    </MapControlButton>
                </div>
            </MapDemoSurface>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center gap-2">
                    <Switch id="mcb-picked" checked={picked} onCheckedChange={setPicked} />
                    <Label htmlFor="mcb-picked">{isJa ? "地点を選んである" : "A place is picked"}</Label>
                </div>
                <div className="flex items-center gap-2">
                    <Switch id="mcb-fail" checked={fail} onCheckedChange={setFail} />
                    <Label htmlFor="mcb-fail">{isJa ? "現在地の取得に失敗する" : "Location lookup fails"}</Label>
                </div>
            </div>
        </div>
    );
}

function OnMap({ children }: { children: React.ReactNode }) {
    return (
        <MapDemoSurface className="aspect-auto">
            <div className="relative flex min-h-24 items-center justify-center gap-3 p-6">{children}</div>
        </MapDemoSurface>
    );
}

export default function MapControlButtonDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const content = getDocContent("components/map-control-button", locale);
    const metadata = inputsMetadata as Record<string, { title?: string; description?: string }>;
    const title = content?.title ?? metadata.mapControlButton.title ?? "MapControlButton";
    const description = content?.description ?? metadata.mapControlButton.description ?? "";

    const usageCode = isJa
        ? `"use client";

import * as React from "react";
import { MapControlButton } from "@gunjo/ui";
import { IconCircleDot, IconMapPin, IconMinus, IconPlus } from "@tabler/icons-react";

export function MapColumn() {
  const [zoom, setZoom] = React.useState(3);
  const [following, setFollowing] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "busy" | "error">("idle");
  const picked = null; // 地点を選ぶまでは null

  const locate = () => {
    if (following) return setFollowing(false);
    setStatus("busy");
    navigator.geolocation.getCurrentPosition(
      () => {
        setStatus("idle");
        setFollowing(true);
      },
      () => {
        setStatus("error");
        // 失敗の印は短く。消すのは呼び出し側です
        window.setTimeout(() => setStatus("idle"), 1600);
      },
    );
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <MapControlButton label="拡大" onClick={() => setZoom(zoom + 1)}>
        <IconPlus />
      </MapControlButton>
      <MapControlButton label="縮小" onClick={() => setZoom(zoom - 1)}>
        <IconMinus />
      </MapControlButton>
      {/* 選んだ地点は ◎。現在地のピンと混ぜません */}
      <MapControlButton
        label="選んだ地点へ"
        disabled={picked === null}
        disabledReason="先に地図で地点を選んでください"
      >
        <IconCircleDot />
      </MapControlButton>
      <MapControlButton
        label="現在地へ"
        pressed={following}
        status={status}
        statusLabel={status === "busy" ? "現在地を取得しています" : "現在地を取得できませんでした"}
        onClick={locate}
      >
        <IconMapPin />
      </MapControlButton>
    </div>
  );
}`
        : `"use client";

import * as React from "react";
import { MapControlButton } from "@gunjo/ui";
import { IconCircleDot, IconMapPin, IconMinus, IconPlus } from "@tabler/icons-react";

export function MapColumn() {
  const [zoom, setZoom] = React.useState(3);
  const [following, setFollowing] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "busy" | "error">("idle");
  const picked = null; // null until a place is picked

  const locate = () => {
    if (following) return setFollowing(false);
    setStatus("busy");
    navigator.geolocation.getCurrentPosition(
      () => {
        setStatus("idle");
        setFollowing(true);
      },
      () => {
        setStatus("error");
        // Keep the failure mark brief; the caller clears it
        window.setTimeout(() => setStatus("idle"), 1600);
      },
    );
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <MapControlButton label="Zoom in" onClick={() => setZoom(zoom + 1)}>
        <IconPlus />
      </MapControlButton>
      <MapControlButton label="Zoom out" onClick={() => setZoom(zoom - 1)}>
        <IconMinus />
      </MapControlButton>
      {/* The picked place is a ring with a dot; never the location pin */}
      <MapControlButton
        label="Go to the picked place"
        disabled={picked === null}
        disabledReason="Pick a place on the map first"
      >
        <IconCircleDot />
      </MapControlButton>
      <MapControlButton
        label="Go to my location"
        pressed={following}
        status={status}
        statusLabel={status === "busy" ? "Finding your location" : "Could not find your location"}
        onClick={locate}
      >
        <IconMapPin />
      </MapControlButton>
    </div>
  );
}`;

    const propsData = [
        {
            name: "label",
            type: "string",
            description: isJa ? "何をするボタンか。読み上げの名前とツールチップを兼ねます。" : "What the button does: the accessible name and the tooltip.",
        },
        {
            name: "children",
            type: "ReactNode",
            description: isJa ? "アイコン。" : "The glyph.",
        },
        {
            name: "pressed",
            type: "boolean",
            description: isJa ? "オン・オフを切り替えるボタンで、いまオンか。渡さなければ切り替えのボタンになりません。" : "On or off, for a toggle. Omit it for a one-shot action.",
        },
        {
            name: "status",
            type: '"idle" | "busy" | "error"',
            default: '"idle"',
            description: isJa ? "取得中か、失敗したか。" : "In flight, or just failed.",
        },
        {
            name: "statusLabel",
            type: "string",
            description: isJa ? "取得中・失敗のときに読み上げ、ツールチップに出す言葉。" : "Announced, and shown as the tooltip, while busy or failed.",
        },
        {
            name: "disabledReason",
            type: "string",
            description: isJa ? "押せない理由。押せないあいだのツールチップになります。" : "Why it cannot be pressed; the tooltip while disabled.",
        },
        {
            name: "size",
            type: '"default" | "sm" | "lg"',
            default: '"default"',
            description: isJa ? "44px／34px（下限）／48px。" : "44px / 34px (the floor) / 48px.",
        },
        {
            name: "tooltipSide",
            type: '"top" | "right" | "bottom" | "left"',
            default: '"left"',
            description: isJa ? "ツールチップを出す向き。" : "Where the tooltip opens.",
        },
    ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[{ name: "Tooltip", href: "/docs/components/tooltip" }]}
            relatedComponents={[
                {
                    name: "Button",
                    href: "/docs/components/button",
                    boundary: isJa ? "ふつうのページに置くボタン。後ろに地図はありません。" : "A button on a page, not on imagery.",
                },
                {
                    name: "TooltipButton",
                    href: "/docs/components/tooltip-button",
                    boundary: isJa ? "ふつうのページに置く、アイコンだけのボタン。取得中・失敗の状態は持たない。" : "Icon-only on a page; no busy or failed state.",
                },
                {
                    name: "LayerMenu",
                    href: "/docs/components/layer-menu",
                    boundary: isJa ? "このボタンから開く、地図に重ねて出すもの（雲・雨など）の選択。" : "The layer picker this button opens.",
                },
                {
                    name: "ScaleBar",
                    href: "/docs/components/scale-bar",
                    boundary: isJa ? "同じ地図の上で、いまの縮尺を見せる物差し。" : "The ruler that sits on the same map.",
                },
            ]}
        >
            <ComponentPreview
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                sectionLabels={sectionLabels}
                previewHeight="auto"
                previewBodyWidth="md"
            >
                <MapColumnDemo locale={locale as Locale} />
            </ComponentPreview>

            <DocNote
                variant="warning"
                heading={isJa ? "34px を割りません。現在地と選んだ地点は別のアイコンで描きます" : "Never below 34px — and keep the two place glyphs apart"}
            >
                {isJa
                    ? "現在地はピン、地図で選んだ地点は輪と点（◎）で描き分けます。どちらも「そこへ動く」ボタンなので、同じ印にすると、押す前にどちらへ飛ぶのか分かりません。"
                    : "My location is a pin, the picked place is a ring with a dot. Both move the map somewhere, and with one glyph for both the reader cannot tell where it will go before pressing."}
            </DocNote>

            <section className="space-y-4">
                <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {isJa ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "sizes",
                            title: isJa ? "大きさ" : "Sizes",
                            description: isJa
                                ? "sm は 34px（下限）、default は 44px、lg は 48px。スマートフォンでボタンを縦にいくつも並べるときは sm、タブレットは lg。"
                                : "sm is 34px (the floor), default 44px, lg 48px. sm for a dense phone column, lg for tablets.",
                            preview: (
                                <OnMap>
                                    <MapControlButton size="sm" label={isJa ? "拡大" : "Zoom in"}><IconPlus /></MapControlButton>
                                    <MapControlButton label={isJa ? "拡大" : "Zoom in"}><IconPlus /></MapControlButton>
                                    <MapControlButton size="lg" label={isJa ? "拡大" : "Zoom in"}><IconPlus /></MapControlButton>
                                </OnMap>
                            ),
                            code: isJa
                                ? `import { MapControlButton } from "@gunjo/ui";
import { IconPlus } from "@tabler/icons-react";

export function Sizes() {
  return (
    <div className="flex items-center gap-3">
      <MapControlButton size="sm" label="拡大"><IconPlus /></MapControlButton>
      <MapControlButton label="拡大"><IconPlus /></MapControlButton>
      <MapControlButton size="lg" label="拡大"><IconPlus /></MapControlButton>
    </div>
  );
}`
                                : `import { MapControlButton } from "@gunjo/ui";
import { IconPlus } from "@tabler/icons-react";

export function Sizes() {
  return (
    <div className="flex items-center gap-3">
      <MapControlButton size="sm" label="Zoom in"><IconPlus /></MapControlButton>
      <MapControlButton label="Zoom in"><IconPlus /></MapControlButton>
      <MapControlButton size="lg" label="Zoom in"><IconPlus /></MapControlButton>
    </div>
  );
}`,
                        },
                        {
                            key: "pressed",
                            title: isJa ? "オン" : "On",
                            description: isJa
                                ? "オン・オフを切り替えるボタン（現在地を追う など）がオンのとき。ボタン全体が塗られます。読み上げには aria-pressed で伝わります。"
                                : "A toggle that is on (following my location). The button fills; assistive tech hears aria-pressed.",
                            preview: (
                                <OnMap>
                                    <MapControlButton label={isJa ? "現在地を追う" : "Follow my location"} pressed={false}><IconMapPin /></MapControlButton>
                                    <MapControlButton label={isJa ? "現在地を追う" : "Follow my location"} pressed><IconMapPin /></MapControlButton>
                                </OnMap>
                            ),
                            code: isJa
                                ? `"use client";

import * as React from "react";
import { MapControlButton } from "@gunjo/ui";
import { IconMapPin } from "@tabler/icons-react";

export function FollowToggle() {
  const [on, setOn] = React.useState(true);
  return (
    <MapControlButton label="現在地を追う" pressed={on} onClick={() => setOn(!on)}>
      <IconMapPin />
    </MapControlButton>
  );
}`
                                : `"use client";

import * as React from "react";
import { MapControlButton } from "@gunjo/ui";
import { IconMapPin } from "@tabler/icons-react";

export function FollowToggle() {
  const [on, setOn] = React.useState(true);
  return (
    <MapControlButton label="Follow my location" pressed={on} onClick={() => setOn(!on)}>
      <IconMapPin />
    </MapControlButton>
  );
}`,
                        },
                        {
                            key: "disabled",
                            title: isJa ? "使えない" : "Disabled",
                            description: isJa
                                ? "まだ地点を選んでいないなど。薄くなり、理由がツールチップに出ます。"
                                : "No place picked yet, for example. The button fades and the reason shows as the tooltip, keyboard included.",
                            preview: (
                                <OnMap>
                                    <MapControlButton
                                        label={isJa ? "選んだ地点へ" : "Go to the picked place"}
                                        disabled
                                        disabledReason={isJa ? "先に地図で地点を選んでください" : "Pick a place on the map first"}
                                    >
                                        <IconCircleDot />
                                    </MapControlButton>
                                </OnMap>
                            ),
                            code: isJa
                                ? `import { MapControlButton } from "@gunjo/ui";
import { IconCircleDot } from "@tabler/icons-react";

export function NothingPicked() {
  return (
    <MapControlButton
      label="選んだ地点へ"
      disabled
      disabledReason="先に地図で地点を選んでください"
    >
      <IconCircleDot />
    </MapControlButton>
  );
}`
                                : `import { MapControlButton } from "@gunjo/ui";
import { IconCircleDot } from "@tabler/icons-react";

export function NothingPicked() {
  return (
    <MapControlButton
      label="Go to the picked place"
      disabled
      disabledReason="Pick a place on the map first"
    >
      <IconCircleDot />
    </MapControlButton>
  );
}`,
                        },
                        {
                            key: "busy",
                            title: isJa ? "取得中" : "Busy",
                            description: isJa
                                ? "押して始めた処理（現在地の取得など）の終わりを待っているあいだ。アイコンが明滅し、aria-busy が付きます。端末で「動きを減らす」設定をオンにしている人には明滅しません。"
                                : "Waiting on what the press started. The glyph pulses and aria-busy is set; no pulse under reduced motion.",
                            preview: (
                                <OnMap>
                                    <MapControlButton
                                        label={isJa ? "現在地へ" : "Go to my location"}
                                        status="busy"
                                        statusLabel={isJa ? "現在地を取得しています" : "Finding your location"}
                                    >
                                        <IconMapPin />
                                    </MapControlButton>
                                </OnMap>
                            ),
                            code: isJa
                                ? `import { MapControlButton } from "@gunjo/ui";
import { IconMapPin } from "@tabler/icons-react";

export function Locating() {
  return (
    <MapControlButton label="現在地へ" status="busy" statusLabel="現在地を取得しています">
      <IconMapPin />
    </MapControlButton>
  );
}`
                                : `import { MapControlButton } from "@gunjo/ui";
import { IconMapPin } from "@tabler/icons-react";

export function Locating() {
  return (
    <MapControlButton label="Go to my location" status="busy" statusLabel="Finding your location">
      <IconMapPin />
    </MapControlButton>
  );
}`,
                        },
                        {
                            key: "error",
                            title: isJa ? "失敗" : "Failed",
                            description: isJa
                                ? "取得に失敗したとき。注意の色の縁と「!」の印が付き、statusLabel が読み上げられます。"
                                : "The lookup failed: a warning ring and a “!” mark, and statusLabel is announced. Show it briefly; the caller clears it.",
                            preview: (
                                <OnMap>
                                    <MapControlButton
                                        label={isJa ? "現在地へ" : "Go to my location"}
                                        status="error"
                                        statusLabel={isJa ? "現在地を取得できませんでした" : "Could not find your location"}
                                    >
                                        <IconMapPin />
                                    </MapControlButton>
                                </OnMap>
                            ),
                            code: isJa
                                ? `import { MapControlButton } from "@gunjo/ui";
import { IconMapPin } from "@tabler/icons-react";

export function LocateFailed() {
  return (
    <MapControlButton label="現在地へ" status="error" statusLabel="現在地を取得できませんでした">
      <IconMapPin />
    </MapControlButton>
  );
}`
                                : `import { MapControlButton } from "@gunjo/ui";
import { IconMapPin } from "@tabler/icons-react";

export function LocateFailed() {
  return (
    <MapControlButton label="Go to my location" status="error" statusLabel="Could not find your location">
      <IconMapPin />
    </MapControlButton>
  );
}`,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <div className="flex items-start justify-between gap-3 pb-2">
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
                <div className="pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {isJa ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {isJa ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Button の変種にしていません。</strong>
                            ふつうのボタンの後ろは、ページの無地の背景です。このボタンの後ろにあるのは海・街・雲の写真です。
                            どの上でも読めるように、半透明の背景色・後ろのぼかし・細い縁を、コンポーネントの側で持ちます。
                        </li>
                        <li>
                            <strong>状態を色だけに載せません。</strong>
                            オンのときはボタン全体を塗り、取得中はアイコンが明滅し、失敗には「!」の印が付きます。
                        </li>
                        <li>
                            <strong>失敗の印を、時間が来たら自動で消す仕組みは持ちません。</strong>
                            どれだけ出しておくかは画面ごとに違うので、status を戻すのは、このコンポーネントを使う側のコードです。
                        </li>
                        <li>
                            <strong>押せないボタンにも理由を言わせます。</strong>
                            ボタン自体は、押してもキーボードで移動しても反応しません。代わりにボタンを包む枠がキーボードのフォーカスを受け、理由をツールチップに出します。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Not a Button variant.</strong> A button on a page has the page behind it; this one has
                            a photo of sea, city and cloud. It carries its own translucent surface, backdrop blur and
                            hairline border so it reads on any of them.
                        </li>
                        <li>
                            <strong>No state is colour alone.</strong> On fills the button, busy pulses the glyph, and a
                            failure adds a “!” mark — each readable without the colour.
                        </li>
                        <li>
                            <strong>No timer for the failure mark.</strong> How long it should stay differs by screen, so
                            the caller sets status back.
                        </li>
                        <li>
                            <strong>A disabled button still says why.</strong> A disabled button takes no pointer or
                            keyboard focus, so a wrapper takes focus in its place and shows the reason as the tooltip.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
