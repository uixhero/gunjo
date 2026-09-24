"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { MapDemoSurface } from "@/components/doc/MapDemoSurface";
import { MapCornerFlowFigure } from "@/components/doc/MapPartsFigures";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { Label, LiveBadge, MapStatusCorner, Slider } from "@gunjo/ui";

type Locale = "ja" | "en";

const LINES = {
    ja: ["現在地", "日本は昼", "雲 最新", "地形 Sentinel-2 z10", "雨 気象庁 11:00 実況", "×123.4"],
    en: ["Here", "Day in Japan", "Clouds latest", "Terrain Sentinel-2 z10", "Rain JMA 11:00 observed", "×123.4"],
};

function Lead({ locale }: { locale: Locale }) {
    return (
        <span className="inline-flex items-center gap-2">
            EARTH · {locale === "ja" ? "昼夜" : "DAY & NIGHT"}
            <LiveBadge live size="sm" />
        </span>
    );
}

/** A stand-in for a compass in the top-left corner, under the lead. */
function CompassSpot() {
    return (
        <span
            aria-hidden
            className="absolute left-4 top-9 h-14 w-14 rounded-full border border-foreground/30 bg-background/40"
        />
    );
}

function CornerDemo({ locale }: { locale: Locale }) {
    const isJa = locale === "ja";
    const [width, setWidth] = React.useState(320);
    return (
        <div className="flex w-full flex-col gap-4">
            <div className="mx-auto w-full" style={{ maxWidth: width }}>
                <MapDemoSurface ratio="square">
                    <CompassSpot />
                    <MapStatusCorner
                        className="absolute inset-x-0 top-0"
                        lead={<Lead locale={locale} />}
                        items={LINES[locale]}
                        startInset={78}
                        label={isJa ? "地図の状態" : "Map status"}
                    />
                </MapDemoSurface>
            </div>
            <div className="space-y-2">
                <Label htmlFor="map-status-corner-width">{isJa ? "地図の幅" : "Map width"}</Label>
                <Slider id="map-status-corner-width" min={260} max={640} step={10} value={width} onValueChange={setWidth} />
                <p className="text-xs tabular-nums text-muted-foreground">{width}px</p>
            </div>
        </div>
    );
}

function OnMap({ children }: { children: React.ReactNode }) {
    return (
        <div className="mx-auto w-full max-w-[340px]">
            <MapDemoSurface ratio="wide">{children}</MapDemoSurface>
        </div>
    );
}

export default function MapStatusCornerDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const content = getDocContent("components/map-status-corner", locale);
    const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
    const title = content?.title ?? metadata.mapStatusCorner.title ?? "MapStatusCorner";
    const description = content?.description ?? metadata.mapStatusCorner.description ?? "";
    const lines = LINES[locale as Locale];

    const usageCode = isJa
        ? `import { LiveBadge, MapStatusCorner } from "@gunjo/ui";

const LINES = ["現在地", "日本は昼", "雲 最新", "地形 Sentinel-2 z10", "雨 気象庁 11:00 実況", "×123.4"];

export function MapWithStatus() {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
      {/* 左上の文字の下に方位磁針を置くので、左を 78px 空けます */}
      <MapStatusCorner
        className="absolute inset-x-0 top-0"
        lead={
          <span className="inline-flex items-center gap-2">
            EARTH · 昼夜 <LiveBadge live size="sm" />
          </span>
        }
        items={LINES}
        startInset={78}
        label="地図の状態"
      />
    </div>
  );
}`
        : `import { LiveBadge, MapStatusCorner } from "@gunjo/ui";

const LINES = ["Here", "Day in Japan", "Clouds latest", "Terrain Sentinel-2 z10", "Rain JMA 11:00 observed", "×123.4"];

export function MapWithStatus() {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
      {/* A compass sits under the words on the left, so keep 78px free there */}
      <MapStatusCorner
        className="absolute inset-x-0 top-0"
        lead={
          <span className="inline-flex items-center gap-2">
            EARTH · DAY & NIGHT <LiveBadge live size="sm" />
          </span>
        }
        items={LINES}
        startInset={78}
        label="Map status"
      />
    </div>
  );
}`;

    const propsData = [
        { name: "items", type: "ReactNode[]", required: true, description: isJa ? "上から順の短い行。null / false は飛ばします。" : "Short lines, top to bottom; null / false are skipped." },
        { name: "lead", type: "ReactNode", description: isJa ? "左上の見出し。左へ寄せて浮かせます（float）。" : "Words in the top-left; floated left." },
        { name: "startInset", type: "number", default: "0", description: isJa ? "すべての行の左に空けておく幅（px）。行が見出しの下へ回ったとき、見出しの下の方位磁針に重ならないように。" : "Room kept free left of every line, in px, so none runs into a compass under lead." },
        { name: "scrim", type: "boolean", default: "true", description: isJa ? "上から下へ薄くなる陰を敷きます。" : "A top-down shade behind the words." },
        { name: "label", type: "string", default: '"Map status"', description: isJa ? "行のまとまり全体に付ける、スクリーンリーダー用の名前。" : "Accessible name of the list." },
    ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[]}
            relatedComponents={[
                {
                    name: "LiveBadge",
                    href: "/docs/components/live-badge",
                    boundary: isJa ? "「いまの値」だと示す小さなラベル。lead の中に置く。" : "One ‘this is live’ pill; it goes in lead.",
                },
                {
                    name: "ScaleBar",
                    href: "/docs/components/scale-bar",
                    boundary: isJa ? "同じ地図の左下に置く、距離の物差し。" : "The distance ruler in the same map’s corner.",
                },
                {
                    name: "StatusBar",
                    href: "/docs/components/status-bar",
                    boundary: isJa ? "ページの上の状態の帯。地図の上には重ねない。" : "A status strip on the page, not on imagery.",
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
                <CornerDemo locale={locale as Locale} />
            </ComponentPreview>

            <MapCornerFlowFigure locale={locale as Locale} />

            <section className="space-y-4">
                <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {isJa ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "lines-only",
                            title: isJa ? "左上の見出しが無い" : "No lead",
                            description: isJa
                                ? "lead を渡さなければ、行は右上に右寄せで並ぶだけです。"
                                : "Without lead, the lines simply stack right-aligned in the corner.",
                            preview: (
                                <OnMap>
                                    <MapStatusCorner className="absolute inset-x-0 top-0" items={lines.slice(0, 3)} />
                                </OnMap>
                            ),
                            code: isJa
                                ? `import { MapStatusCorner } from "@gunjo/ui";

export function CornerOnly() {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted">
      <MapStatusCorner className="absolute inset-x-0 top-0" items={["現在地", "日本は昼", "雲 最新"]} />
    </div>
  );
}`
                                : `import { MapStatusCorner } from "@gunjo/ui";

export function CornerOnly() {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted">
      <MapStatusCorner className="absolute inset-x-0 top-0" items={["Here", "Day in Japan", "Clouds latest"]} />
    </div>
  );
}`,
                        },
                        {
                            key: "changing-lines",
                            title: isJa ? "行が出たり消えたりする" : "Lines that come and go",
                            description: isJa
                                ? "地図に雨雲を表示していないときは雨の行を出さない、のように、行は null で消せます。配列を作り直さなくて済みます。"
                                : "A line can be null while it does not apply (no rain layer, no rain line), so the array keeps its shape.",
                            preview: (
                                <OnMap>
                                    <MapStatusCorner
                                        className="absolute inset-x-0 top-0"
                                        lead={<Lead locale={locale as Locale} />}
                                        items={[lines[0], lines[1], null, lines[5]]}
                                    />
                                </OnMap>
                            ),
                            code: isJa
                                ? `import { LiveBadge, MapStatusCorner } from "@gunjo/ui";

const SHOW_RAIN = false;

export function CornerWithoutRain() {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted">
      <MapStatusCorner
        className="absolute inset-x-0 top-0"
        lead={<span className="inline-flex items-center gap-2">EARTH <LiveBadge live size="sm" /></span>}
        items={["現在地", "日本は昼", SHOW_RAIN ? "雨 気象庁 11:00 実況" : null, "×123.4"]}
      />
    </div>
  );
}`
                                : `import { LiveBadge, MapStatusCorner } from "@gunjo/ui";

const SHOW_RAIN = false;

export function CornerWithoutRain() {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted">
      <MapStatusCorner
        className="absolute inset-x-0 top-0"
        lead={<span className="inline-flex items-center gap-2">EARTH <LiveBadge live size="sm" /></span>}
        items={["Here", "Day in Japan", SHOW_RAIN ? "Rain JMA 11:00 observed" : null, "×123.4"]}
      />
    </div>
  );
}`,
                        },
                        {
                            key: "no-scrim",
                            title: isJa ? "陰を敷かない" : "Without the shade",
                            description: isJa
                                ? "地図の上端がもともと暗いときは scrim={false} で陰を外せます。文字の縁取りは残るので、明るい所でも読めます。"
                                : "Over imagery that is already dark, scrim={false} drops the shade. The halo around the words stays.",
                            preview: (
                                <OnMap>
                                    <MapStatusCorner className="absolute inset-x-0 top-0" items={lines.slice(0, 3)} scrim={false} />
                                </OnMap>
                            ),
                            code: isJa
                                ? `import { MapStatusCorner } from "@gunjo/ui";

export function CornerNoShade() {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted">
      <MapStatusCorner className="absolute inset-x-0 top-0" items={["現在地", "日本は昼", "雲 最新"]} scrim={false} />
    </div>
  );
}`
                                : `import { MapStatusCorner } from "@gunjo/ui";

export function CornerNoShade() {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted">
      <MapStatusCorner className="absolute inset-x-0 top-0" items={["Here", "Day in Japan", "Clouds latest"]} scrim={false} />
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
                <div className="max-h-[350px] overflow-auto rounded-md border border-transparent contrast-more:border-border forced-colors:border-[CanvasText] bg-muted font-mono text-sm">
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
                            <strong>左上の見出しは float で浮かせ、各行は途中で改行しない1つのまとまり（white-space: nowrap）にしました。</strong>
                            左右2列の flex だと、細い画面で行のまとまりがまるごと見出しの下へ押し出されたり、語の最後の1字だけが次の行に落ちたりします。float なら、入りきらない行が見出しの下へ回ります。
                        </li>
                        <li>
                            <strong>行の入れ物に flex・grid・overflow を付けていません。</strong>
                            どれか1つでも付けると、行が float の周りを回り込まなくなります。
                        </li>
                        <li>
                            <strong>文字サイズは、地図の上に重ねる文字専用のサイズ（<code>text-canvas-2xs</code>、9.5px）です。</strong>
                            ふだんの最小の 12px では、地図を覆う面が広すぎるためです（特例のページ /docs/exceptions）。
                        </li>
                        <li>
                            <strong>ポインタを受けません。</strong>
                            右上に文字があっても、その下の地図はそのまま動かせます。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>The lead floats; each line is one unbreakable run.</strong> A two-column flex row
                            pushes whole lines down on a narrow screen, or drops the last character of a word. With a
                            float, a line that does not fit moves below the lead, so only the first line or two sit
                            beside it.
                        </li>
                        <li>
                            <strong>No flex, grid or overflow on the list.</strong> Any of them stops the lines from
                            flowing around the float.
                        </li>
                        <li>
                            <strong>The canvas type tier.</strong> <code>text-canvas-2xs</code> is 9.5px; the usual 12px
                            floor would cover too much map (see /docs/exceptions).
                        </li>
                        <li>
                            <strong>It ignores the pointer.</strong> The map under the words still drags.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
