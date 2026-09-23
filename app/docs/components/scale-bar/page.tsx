"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { MapDemoSurface } from "@/components/doc/MapDemoSurface";
import { ScaleSawtoothFigure } from "@/components/doc/MapPartsFigures";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { DocNote, Label, ScaleBar, Slider, niceScale } from "@gunjo/ui";

type Locale = "ja" | "en";

/** Zoom level 0..10 to metres per CSS pixel: each step halves the distance. */
function metersAt(zoom: number) {
    return 40_000 / 2 ** zoom;
}

function ScaleBarDemo({ locale }: { locale: Locale }) {
    const isJa = locale === "ja";
    const [zoom, setZoom] = React.useState(6);
    const mpp = metersAt(zoom);
    const scale = niceScale(mpp);

    return (
        <div className="flex w-full flex-col gap-4">
            <MapDemoSurface>
                <div className="absolute bottom-3 left-3">
                    <ScaleBar metersPerPixel={mpp} label={isJa ? "縮尺" : "Scale"} />
                </div>
            </MapDemoSurface>
            <div className="space-y-2">
                <Label htmlFor="scale-bar-zoom">
                    {isJa ? "拡大・縮小" : "Zoom"}
                </Label>
                <Slider
                    id="scale-bar-zoom"
                    min={0}
                    max={10}
                    step={0.25}
                    value={zoom}
                    onValueChange={setZoom}
                />
                <p className="text-xs text-muted-foreground tabular-nums">
                    {isJa ? "1px あたり" : "Per pixel:"} {mpp < 1000 ? `${mpp.toFixed(0)} m` : `${(mpp / 1000).toFixed(1)} km`}
                    {" · "}
                    {isJa ? "線の長さ" : "Line"} {scale?.px ?? 0}px
                </p>
            </div>
        </div>
    );
}

function OnMap({ children }: { children: React.ReactNode }) {
    return (
        <MapDemoSurface className="aspect-auto">
            <div className="relative flex min-h-20 items-end gap-8 p-4">{children}</div>
        </MapDemoSurface>
    );
}

export default function ScaleBarDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const content = getDocContent("components/scale-bar", locale);
    const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
    const title = content?.title ?? metadata.scaleBar.title ?? "ScaleBar";
    const description = content?.description ?? metadata.scaleBar.description ?? "";

    const usageCode = isJa
        ? `import { ScaleBar } from "@gunjo/ui";

// 画面の中心で、1px が何メートルか。地図のライブラリが知っています。
// 地球儀なら「地球の半径 6,371km ÷ 描いている半径(px)」です。
const EARTH_RADIUS_M = 6_371_000;
const GLOBE_RADIUS_PX = 320_000;

export function MapScale() {
  return (
    <div className="relative h-80 overflow-hidden rounded-lg bg-muted">
      <div className="absolute bottom-3 left-3">
        <ScaleBar metersPerPixel={EARTH_RADIUS_M / GLOBE_RADIUS_PX} label="縮尺" />
      </div>
    </div>
  );
}`
        : `import { ScaleBar } from "@gunjo/ui";

// How many metres one pixel covers at the centre of the view. Your map
// library knows it; for a globe it is the Earth's radius over the radius
// you draw it at.
const EARTH_RADIUS_M = 6_371_000;
const GLOBE_RADIUS_PX = 320_000;

export function MapScale() {
  return (
    <div className="relative h-80 overflow-hidden rounded-lg bg-muted">
      <div className="absolute bottom-3 left-3">
        <ScaleBar metersPerPixel={EARTH_RADIUS_M / GLOBE_RADIUS_PX} label="Scale" />
      </div>
    </div>
  );
}`;

    const propsData = [
        {
            name: "metersPerPixel",
            type: "number | null",
            description: isJa ? "画面の中心で 1px が何メートルか。まだ無ければ null。" : "Metres per CSS pixel at the centre; null while unknown.",
        },
        {
            name: "targetWidth",
            type: "number",
            default: "96",
            description: isJa ? "線の長さの上限（px）。刻みが 1・2・5 なので、線はこの 40〜100% の長さになります。" : "The longest the line may be, in px. With 1-2-5 steps the line is 40–100% of it.",
        },
        {
            name: "minWidth",
            type: "number",
            default: "24",
            description: isJa ? "線をこれより短くしない下限（px）。" : "A floor: the line is never drawn shorter, in px.",
        },
        {
            name: "label",
            type: "string",
            default: '"Scale"',
            description: isJa ? "読み上げの頭に付ける語。label=\"縮尺\" なら「縮尺: 20 km」と読まれます。" : "Prefix of the accessible name: “Scale: 20 km”.",
        },
    ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[]}
            relatedComponents={[
                {
                    name: "MapControlButton",
                    href: "/docs/components/map-control-button",
                    boundary: isJa ? "同じ地図の上に置く、拡大・縮小のボタン。" : "The zoom buttons on the same map.",
                },
                {
                    name: "Meter",
                    href: "/docs/components/meter",
                    boundary: isJa ? "全体のうちどれだけか。距離の物差しではない。" : "A share of a whole, not a ruler.",
                },
                {
                    name: "Slider",
                    href: "/docs/components/slider",
                    boundary: isJa ? "値を選ぶ入力。縮尺バーは見せるだけ。" : "An input; the scale bar only shows.",
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
                <ScaleBarDemo locale={locale as Locale} />
            </ComponentPreview>

            <DocNote
                variant="warning"
                heading={isJa ? "倍率（×250）は出しません" : "No zoom factor (×250)"}
            >
                {isJa
                    ? "「×250」（倍率）と書いても、何の250倍かが分かりません。「20 km」と、その長さの線なら、読み手は地図に当てて距離を測れます。"
                    : "“×250” leaves the reader asking “250 times what?”. “20 km” and a line of that length is a ruler they can hold against the map."}
            </DocNote>

            <ScaleSawtoothFigure locale={locale as Locale} />

            <section className="space-y-4">
                <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {isJa ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "rounding",
                            title: isJa ? "きりのいい長さ" : "Round numbers",
                            description: isJa
                                ? "表示する距離は 1・2・5 × 10ⁿ のきりのいい値にそろえます。そろえた分のずれは、線の長さを変えて合わせます。"
                                : "The distance rounds to 1, 2 or 5 × 10ⁿ. The words stay short; the line takes the remainder.",
                            preview: (
                                <OnMap>
                                    <ScaleBar metersPerPixel={9} label={isJa ? "縮尺" : "Scale"} />
                                    <ScaleBar metersPerPixel={180} label={isJa ? "縮尺" : "Scale"} />
                                    <ScaleBar metersPerPixel={42_000} label={isJa ? "縮尺" : "Scale"} />
                                </OnMap>
                            ),
                            code: isJa
                                ? `import { ScaleBar } from "@gunjo/ui";

export function ThreeScales() {
  return (
    <div className="flex items-end gap-8">
      <ScaleBar metersPerPixel={9} label="縮尺" />
      <ScaleBar metersPerPixel={180} label="縮尺" />
      <ScaleBar metersPerPixel={42_000} label="縮尺" />
    </div>
  );
}`
                                : `import { ScaleBar } from "@gunjo/ui";

export function ThreeScales() {
  return (
    <div className="flex items-end gap-8">
      <ScaleBar metersPerPixel={9} label="Scale" />
      <ScaleBar metersPerPixel={180} label="Scale" />
      <ScaleBar metersPerPixel={42_000} label="Scale" />
    </div>
  );
}`,
                        },
                        {
                            key: "unknown",
                            title: isJa ? "まだ分からない" : "Not known yet",
                            description: isJa
                                ? "metersPerPixel が null のあいだは「—」だけを出し、線は出しません。推測した線は、無い線より悪いためです。"
                                : "While metersPerPixel is null it shows “—” and no line. A guessed line is worse than none.",
                            preview: (
                                <OnMap>
                                    <ScaleBar metersPerPixel={null} label={isJa ? "縮尺" : "Scale"} />
                                </OnMap>
                            ),
                            code: isJa
                                ? `import { ScaleBar } from "@gunjo/ui";

export function BeforeTheFirstFrame() {
  return <ScaleBar metersPerPixel={null} label="縮尺" />;
}`
                                : `import { ScaleBar } from "@gunjo/ui";

export function BeforeTheFirstFrame() {
  return <ScaleBar metersPerPixel={null} label="Scale" />;
}`,
                        },
                        {
                            key: "width",
                            title: isJa ? "線の長さの上限" : "Line length",
                            description: isJa
                                ? "targetWidth で線の長さの上限を変えます。狭い画面では短く、広い画面では長く。"
                                : "targetWidth sets roughly how long the line is: shorter on a narrow screen, longer on a wide one.",
                            preview: (
                                <OnMap>
                                    <ScaleBar metersPerPixel={180} targetWidth={56} label={isJa ? "縮尺" : "Scale"} />
                                    <ScaleBar metersPerPixel={180} targetWidth={160} label={isJa ? "縮尺" : "Scale"} />
                                </OnMap>
                            ),
                            code: isJa
                                ? `import { ScaleBar } from "@gunjo/ui";

export function ShortAndLong() {
  return (
    <div className="flex items-end gap-8">
      <ScaleBar metersPerPixel={180} targetWidth={56} label="縮尺" />
      <ScaleBar metersPerPixel={180} targetWidth={160} label="縮尺" />
    </div>
  );
}`
                                : `import { ScaleBar } from "@gunjo/ui";

export function ShortAndLong() {
  return (
    <div className="flex items-end gap-8">
      <ScaleBar metersPerPixel={180} targetWidth={56} label="Scale" />
      <ScaleBar metersPerPixel={180} targetWidth={160} label="Scale" />
    </div>
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
                            <strong>丸めの計算は、純粋な関数 <code>niceScale()</code> として外から呼べます。</strong>
                            サーバー側でも、テストでも、画面を描き直すたびにでも使えます。
                        </li>
                        <li>
                            <strong>文字は、地図の上に重ねる文字専用の小さなサイズ（<code>text-canvas-2xs</code>、9.5px）です。</strong>
                            ふつうの文字サイズ（12px 以上）では、地図を隠してしまいます。
                        </li>
                        <li>
                            <strong>文字の周りに、ページの背景色で縁取りを付けています。</strong>
                            海の上でも街の上でも読めるようにするためです。
                        </li>
                        <li>
                            <strong>線の長さが変わるとき、なめらかに動かします。</strong>
                            端末で「動きを減らす」設定をオンにしている人には、すぐに切り替わります。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>The rounding is a function you can call.</strong> <code>niceScale()</code> is pure:
                            the same number always gives the same length and words, on the server, in a test, or every
                            frame.
                        </li>
                        <li>
                            <strong>The words use the canvas type tier.</strong> <code>text-canvas-2xs</code> is 9.5px;
                            the body scale (12px and up) would cover the map. The tier is for maps and canvases only,
                            and CI stops it anywhere else.
                        </li>
                        <li>
                            <strong>A halo in the page colour.</strong> It keeps the words readable over sea and city
                            alike.
                        </li>
                        <li>
                            <strong>The line eases between lengths.</strong> A pinch reads as one motion. Under reduced
                            motion it changes at once.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
