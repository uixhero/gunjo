"use client";

import { CodeCopyButton, ComponentLayout } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ChartPreviewWithControls } from "@/components/doc/ChartPreviewWithControls";
import { useLocale } from "@/components/providers/LocaleProvider";
import { tokyoIncidentMarkers, tokyoWardBoundaries } from "@/components/demos/tokyo-ward-boundaries";
import displayMetadata from "@design/display-metadata.json";
import { ChoroplethMap } from "@gunjo/ui";
import type { ChoroplethMapMarker, ChoroplethMapRegion } from "@gunjo/ui";

const tokyoMarkerLabelsJa: Record<string, string> = {
    "marker-shinjuku": "新宿駅",
    "marker-shibuya": "渋谷交差点",
    "marker-tokyo": "東京駅",
    "marker-roppongi": "六本木",
    "marker-ueno": "上野",
    "marker-toyosu": "豊洲",
    "marker-sangenjaya": "三軒茶屋",
};

function getDemoRegions(locale: "en" | "ja"): ChoroplethMapRegion[] {
    return tokyoWardBoundaries.map((region) => ({
        ...region,
        label: locale === "ja" ? region.nameJa : region.label,
        description: locale === "ja"
            ? `${region.nameJa} / 平均 ${(region.value / 20).toFixed(1)}件/日`
            : `${region.label} / Avg ${(region.value / 20).toFixed(1)}/day`,
    }));
}

function getDemoMarkers(locale: "en" | "ja"): ChoroplethMapMarker[] {
    return tokyoIncidentMarkers.map((marker) => ({
        ...marker,
        label: locale === "ja" && marker.id
            ? tokyoMarkerLabelsJa[marker.id] ?? marker.label
            : marker.label,
    }));
}

function getSingleToneRegions(regions: ChoroplethMapRegion[]): ChoroplethMapRegion[] {
    return regions.map(({ color: _color, ...region }) => region);
}

const codeByLocale = {
    en: `import { useState } from "react";
import { ChoroplethMap } from "@gunjo/ui";

const regions = [
    {
        id: "shinjuku",
        label: "Shinjuku",
        value: 92,
        geometry: {
            type: "Polygon",
            coordinates: [[
                [139.686, 35.707],
                [139.704, 35.714],
                [139.721, 35.702],
                [139.716, 35.683],
                [139.697, 35.676],
                [139.681, 35.690],
            ]],
        },
    },
    {
        id: "shibuya",
        label: "Shibuya",
        value: 84,
        geometry: {
            type: "Polygon",
            coordinates: [[
                [139.671, 35.680],
                [139.697, 35.676],
                [139.716, 35.683],
                [139.712, 35.655],
                [139.690, 35.638],
                [139.666, 35.652],
            ]],
        },
    },
];

const markers = [
    { id: "station", label: "Shinjuku station", regionId: "shinjuku", value: 92, coordinate: [139.7006, 35.6909] },
    { id: "crossing", label: "Shibuya crossing", regionId: "shibuya", value: 84, coordinate: [139.7004, 35.6595] },
];

export function TokyoIncidentMap() {
    const [selectedId, setSelectedId] = useState("shinjuku");

    return (
        <ChoroplethMap
            regions={regions}
            markers={markers}
            selectedId={selectedId}
            showRanking
            onRegionSelect={(region) => setSelectedId(region.id ?? region.label)}
            onMarkerSelect={(marker) => marker.regionId && setSelectedId(marker.regionId)}
            aria-label="Tokyo incident density by ward"
        />
    );
}`,
    ja: `import { useState } from "react";
import { ChoroplethMap } from "@gunjo/ui";

const regions = [
    {
        id: "shinjuku",
        label: "新宿",
        value: 92,
        geometry: {
            type: "Polygon",
            coordinates: [[
                [139.686, 35.707],
                [139.704, 35.714],
                [139.721, 35.702],
                [139.716, 35.683],
                [139.697, 35.676],
                [139.681, 35.690],
            ]],
        },
    },
    {
        id: "shibuya",
        label: "渋谷",
        value: 84,
        geometry: {
            type: "Polygon",
            coordinates: [[
                [139.671, 35.680],
                [139.697, 35.676],
                [139.716, 35.683],
                [139.712, 35.655],
                [139.690, 35.638],
                [139.666, 35.652],
            ]],
        },
    },
];

const markers = [
    { id: "station", label: "新宿駅", regionId: "shinjuku", value: 92, coordinate: [139.7006, 35.6909] },
    { id: "crossing", label: "渋谷交差点", regionId: "shibuya", value: 84, coordinate: [139.7004, 35.6595] },
];

export function TokyoIncidentMap() {
    const [selectedId, setSelectedId] = useState("shinjuku");

    return (
        <ChoroplethMap
            regions={regions}
            markers={markers}
            selectedId={selectedId}
            showRanking
            onRegionSelect={(region) => setSelectedId(region.id ?? region.label)}
            onMarkerSelect={(marker) => marker.regionId && setSelectedId(marker.regionId)}
            aria-label="区ごとのインシデント密度"
        />
    );
}`,
} as const;

const usageCodeByLocale = {
    en: `import { ChoroplethMap } from "@gunjo/ui";

const regions = [
    {
        id: "shinjuku",
        label: "Shinjuku",
        value: 92,
        geometry: {
            type: "Polygon",
            coordinates: [[[139.686, 35.707], [139.704, 35.714], [139.721, 35.702], [139.716, 35.683], [139.697, 35.676], [139.681, 35.690]]],
        },
    },
    {
        id: "shibuya",
        label: "Shibuya",
        value: 84,
        geometry: {
            type: "Polygon",
            coordinates: [[[139.686, 35.675], [139.704, 35.683], [139.716, 35.668], [139.708, 35.651], [139.688, 35.646], [139.676, 35.661]]],
        },
    },
];

const markers = [
    { label: "Shinjuku Station", x: 42, y: 32, value: 92 },
    { label: "Shibuya Crossing", x: 48, y: 58, value: 84 },
];

<ChoroplethMap regions={regions} />
<ChoroplethMap regions={regions} markers={markers} selectedId="shinjuku" />
<ChoroplethMap regions={regions} onRegionSelect={(region) => console.log(region.id ?? region.label)} />
<ChoroplethMap regions={regions} variant="compact" rankingLimit={4} />
<ChoroplethMap regions={regions} showRanking={false} showSelectedRegion={false} />
<ChoroplethMap regions={regions} selectedLabel="Selected" rankLabel="Rank" />`,
    ja: `import { ChoroplethMap } from "@gunjo/ui";

const regions = [
    {
        id: "shinjuku",
        label: "新宿",
        value: 92,
        geometry: {
            type: "Polygon",
            coordinates: [[[139.686, 35.707], [139.704, 35.714], [139.721, 35.702], [139.716, 35.683], [139.697, 35.676], [139.681, 35.690]]],
        },
    },
    {
        id: "shibuya",
        label: "渋谷",
        value: 84,
        geometry: {
            type: "Polygon",
            coordinates: [[[139.686, 35.675], [139.704, 35.683], [139.716, 35.668], [139.708, 35.651], [139.688, 35.646], [139.676, 35.661]]],
        },
    },
];

const markers = [
    { label: "新宿駅", x: 42, y: 32, value: 92 },
    { label: "渋谷交差点", x: 48, y: 58, value: 84 },
];

<ChoroplethMap regions={regions} />
<ChoroplethMap regions={regions} markers={markers} selectedId="shinjuku" />
<ChoroplethMap regions={regions} onRegionSelect={(region) => console.log(region.id ?? region.label)} />
<ChoroplethMap regions={regions} variant="compact" rankingLimit={4} />
<ChoroplethMap regions={regions} showRanking={false} showSelectedRegion={false} />
<ChoroplethMap regions={regions} selectedLabel="選択中" rankLabel="順位" />`,
} as const;

const stateCodeByLocale = {
    en: {
        default: `<ChoroplethMap
  regions={regions}
  selectedId="shinjuku"
  selectedLabel="Selected"
  rankLabel="Rank"
/>`,
        markers: `<ChoroplethMap
  regions={regions}
  markers={markers}
  selectedId="shibuya"
  onRegionSelect={(region) => setSelectedId(region.id ?? region.label)}
  onMarkerSelect={(marker) => marker.regionId && setSelectedId(marker.regionId)}
/>`,
        compact: `<ChoroplethMap
  regions={regions}
  variant="compact"
  rankingLimit={4}
  showSelectedRegion={false}
/>`,
        alternateColor: `<ChoroplethMap
  regions={regions.map(({ color, ...region }) => region)}
  color="info"
  selectedId="minato"
  selectedLabel="Selected"
/>`,
        mapOnly: `<ChoroplethMap
  regions={regions}
  markers={markers}
  selectedId="shinjuku"
  showRanking={false}
  showSelectedRegion={false}
  className="mx-auto max-w-xl"
/>`,
    },
    ja: {
        default: `<ChoroplethMap
  regions={regions}
  selectedId="shinjuku"
  selectedLabel="選択中"
  rankLabel="順位"
/>`,
        markers: `<ChoroplethMap
  regions={regions}
  markers={markers}
  selectedId="shibuya"
  onRegionSelect={(region) => setSelectedId(region.id ?? region.label)}
  onMarkerSelect={(marker) => marker.regionId && setSelectedId(marker.regionId)}
/>`,
        compact: `<ChoroplethMap
  regions={regions}
  variant="compact"
  rankingLimit={4}
  showSelectedRegion={false}
/>`,
        alternateColor: `<ChoroplethMap
  regions={regions.map(({ color, ...region }) => region)}
  color="info"
  selectedId="minato"
  selectedLabel="選択中"
/>`,
        mapOnly: `<ChoroplethMap
  regions={regions}
  markers={markers}
  selectedId="shinjuku"
  showRanking={false}
  showSelectedRegion={false}
  className="mx-auto max-w-xl"
/>`,
    },
} as const;

const propsDataByLocale = {
    en: [
    {
        name: "regions",
        type: "{ id?: string; label: string; value: number; geometry: Polygon | MultiPolygon; color?: ChartColor; description?: ReactNode }[]",
        description: "Map regions with GeoJSON-style polygon coordinates, colored by value.",
    },
    {
        name: "markers",
        type: "{ id?: string; label: string; regionId?: string; coordinate?: [number, number]; x?: number; y?: number; value?: number; color?: ChartColor }[]",
        description: "Optional incident or location markers plotted by coordinates or normalized percentages.",
    },
    {
        name: "variant",
        type: "\"compact\" | \"default\"",
        default: "\"default\"",
        description: "Registered SSOT variant for map height.",
    },
    {
        name: "max",
        type: "number",
        description: "Explicit maximum used to normalize region fill strength and marker size.",
    },
    {
        name: "color",
        type: "ChartColor",
        description: "Token-driven fallback color for regions.",
    },
    {
        name: "selectedId",
        type: "string",
        description: "Highlights the active region and matching ranking row.",
    },
    {
        name: "showRanking",
        type: "boolean",
        default: "true",
        description: "Shows a ranked region list alongside the map.",
    },
    {
        name: "rankingLimit",
        type: "number",
        default: "6",
        description: "Limits the number of ranked regions displayed.",
    },
    {
        name: "showSelectedRegion",
        type: "boolean",
        default: "true",
        description: "Shows the active region detail card below the map.",
    },
    {
        name: "preserveAspectRatio",
        type: "boolean",
        default: "true",
        description: "Keeps geographic coordinate data from stretching to the panel ratio.",
    },
    {
        name: "formatValue",
        type: "(value: number) => ReactNode",
        description: "Formats region, marker, ranking, and selected-region values. Function prop — pass only from a Client Component; from a Server Component it breaks next build. Use valueFormat for RSC-safe formatting.",
    },
    { name: "valueFormat", type: "\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions", description: "Serializable numeric format — the RSC-safe alternative to formatValue. Ignored when formatValue is set. Fixed en-US locale. (#338)" },
    {
        name: "selectedLabel",
        type: "ReactNode",
        default: "\"Selected\"",
        description: "Label shown above the active region detail card.",
    },
    {
        name: "rankLabel",
        type: "ReactNode",
        default: "\"Rank\"",
        description: "Accessible label prefix for ranking numbers.",
    },
    {
        name: "onRegionSelect",
        type: "(region: ChoroplethMapRegion, id: string) => void",
        description: "Called when a map region or ranking row is clicked.",
    },
    {
        name: "onMarkerSelect",
        type: "(marker: ChoroplethMapMarker, id: string) => void",
        description: "Called when a marker is clicked.",
    },
    ],
    ja: [
        { name: "regions", type: "{ id?: string; label: string; value: number; geometry: Polygon | MultiPolygon; color?: ChartColor; description?: ReactNode }[]", description: "GeoJSON 風のポリゴン座標と値を持つ地図領域です。値に応じて塗り分けます。" },
        { name: "markers", type: "{ id?: string; label: string; regionId?: string; coordinate?: [number, number]; x?: number; y?: number; value?: number; color?: ChartColor }[]", description: "座標または正規化済みパーセント位置に表示する任意の地点マーカーです。" },
        { name: "variant", type: "\"compact\" | \"default\"", default: "\"default\"", description: "地図の高さを切り替える SSOT 登録済みバリアントです。" },
        { name: "max", type: "number", description: "領域の塗り強度とマーカーサイズを正規化する明示的な最大値です。" },
        { name: "color", type: "ChartColor", description: "領域のフォールバックに使うトークンカラーです。" },
        { name: "selectedId", type: "string", description: "選択中の領域と一致するランキング行を強調します。" },
        { name: "showRanking", type: "boolean", default: "true", description: "地図の横に領域ランキングを表示します。" },
        { name: "rankingLimit", type: "number", default: "6", description: "表示するランキング領域数を制限します。" },
        { name: "showSelectedRegion", type: "boolean", default: "true", description: "地図の下に選択中領域の詳細カードを表示します。" },
        { name: "preserveAspectRatio", type: "boolean", default: "true", description: "地理座標データがパネル比率に合わせて引き伸ばされないようにします。" },
        { name: "formatValue", type: "(value: number) => ReactNode", description: "領域、マーカー、ランキング、選択中領域の値を整形します。 関数propのため Client Component からのみ渡すこと（Server Component から渡すと next build が落ちる）。RSC 安全な整形には valueFormat を使う。" },
        { name: "valueFormat", type: "\"number\" | \"compact\" | \"integer\" | Intl.NumberFormatOptions", description: "シリアライズ可能な数値フォーマット＝formatValue の RSC 安全な代替。formatValue 指定時は無視。en-US ロケール固定。(#338)" },
        { name: "selectedLabel", type: "ReactNode", default: "\"Selected\"", description: "選択中領域の詳細カード上部に表示するラベルです。" },
        { name: "rankLabel", type: "ReactNode", default: "\"Rank\"", description: "ランキング番号のアクセシブルラベル接頭辞です。" },
        { name: "onRegionSelect", type: "(region: ChoroplethMapRegion, id: string) => void", description: "地図領域またはランキング行がクリックされたときに呼ばれます。" },
        { name: "onMarkerSelect", type: "(marker: ChoroplethMapMarker, id: string) => void", description: "マーカーがクリックされたときに呼ばれます。" },
    ],
} as const;

export default function ChoroplethMapPage() {
    const meta = displayMetadata as Record<string, { title: string; description: string }>;
    const { locale, sectionLabels } = useLocale();
    const stateCodeData = usageCodeByLocale[locale]
        .split("\n\n<ChoroplethMap")[0]
        .replace('import { ChoroplethMap } from "@gunjo/ui";\n\n', "");
    const withStateCodeData = (nextCode: string) => `${stateCodeData}\n\n${nextCode}`;
    const code = codeByLocale[locale];
    const usageCode = usageCodeByLocale[locale];
    const regions = getDemoRegions(locale);
    const markers = getDemoMarkers(locale);
    const singleToneRegions = getSingleToneRegions(regions);

    return (
        <ComponentLayout
            title={meta.choroplethMap.title}
            description={meta.choroplethMap.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "ChoroplethMap", href: "/docs/components/choropleth-map" },
                { name: "Tooltip", href: "/docs/components/tooltip" },
            ]}
            relatedComponents={[
                { name: "HeatmapChart", href: "/docs/components/heatmap-chart" },
                { name: "QuadrantMatrix", href: "/docs/components/quadrant-matrix" },
                { name: "AnalyticsCard", href: "/docs/components/analytics-card" },
                { name: "ChartLegend", href: "/docs/components/chart-legend" },
            ]}
        >
            <ChartPreviewWithControls
                code={code}
                demo="choropleth-map"
                embedBase="/embed/choropleth-map"
                previewHeight={660}
            />

            <div className="space-y-4">
                <h2 id="states" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "default",
                            title: locale === "ja" ? "標準表示" : "Default",
                            description: locale === "ja"
                                ? "地図、ランキング、選択中領域の詳細をまとめて表示する標準の SSOT variant です。"
                                : "The default registered SSOT variant with map, ranking, and selected-region detail.",
                            preview: (
                                <ChoroplethMap
                                    regions={regions}
                                    selectedId="shinjuku"
                                    selectedLabel={locale === "ja" ? "選択中" : "Selected"}
                                    rankLabel={locale === "ja" ? "順位" : "Rank"}
                                />
                            ),
                            previewBodyWidth: "2xl",
                            code: withStateCodeData(stateCodeByLocale[locale].default),
                        },
                        {
                            key: "markers",
                            title: locale === "ja" ? "地点マーカーと選択" : "Markers and selection",
                            description: locale === "ja"
                                ? "領域の塗り分けに地点マーカーと選択状態を重ねるデータ状態です。"
                                : "A data state that overlays point markers and selected-region emphasis on the choropleth.",
                            preview: (
                                <ChoroplethMap
                                    regions={regions}
                                    markers={markers}
                                    selectedId="shibuya"
                                    selectedLabel={locale === "ja" ? "選択中" : "Selected"}
                                    rankLabel={locale === "ja" ? "順位" : "Rank"}
                                    onRegionSelect={() => undefined}
                                    onMarkerSelect={() => undefined}
                                />
                            ),
                            previewBodyWidth: "2xl",
                            code: withStateCodeData(stateCodeByLocale[locale].markers),
                        },
                        {
                            key: "compact",
                            title: locale === "ja" ? "コンパクト" : "Compact",
                            description: locale === "ja"
                                ? "狭いカードやサイドパネルで高さを抑える SSOT variant です。"
                                : "A registered SSOT variant that reduces map height for narrow cards or side panels.",
                            preview: (
                                <ChoroplethMap
                                    regions={regions}
                                    variant="compact"
                                    rankingLimit={4}
                                    showSelectedRegion={false}
                                    rankLabel={locale === "ja" ? "順位" : "Rank"}
                                />
                            ),
                            previewBodyWidth: "2xl",
                            code: withStateCodeData(stateCodeByLocale[locale].compact),
                        },
                        {
                            key: "alternate-color",
                            title: locale === "ja" ? "別色" : "Alternate color",
                            description: locale === "ja"
                                ? "領域ごとの color を持たないデータに、全体のフォールバックカラーを適用する状態です。"
                                : "Applies a fallback map color when individual regions do not provide their own color.",
                            preview: (
                                <ChoroplethMap
                                    regions={singleToneRegions}
                                    color="info"
                                    selectedId="minato"
                                    selectedLabel={locale === "ja" ? "選択中" : "Selected"}
                                    rankLabel={locale === "ja" ? "順位" : "Rank"}
                                />
                            ),
                            previewBodyWidth: "2xl",
                            code: withStateCodeData(stateCodeByLocale[locale].alternateColor),
                        },
                        {
                            key: "map-only",
                            title: locale === "ja" ? "地図のみ" : "Map only",
                            description: locale === "ja"
                                ? "ランキングや詳細カードを上位レイアウト側に置く場合の表示状態です。"
                                : "A display state for layouts where ranking or details are handled by a parent view.",
                            preview: (
                                <ChoroplethMap
                                    regions={regions}
                                    markers={markers}
                                    selectedId="shinjuku"
                                    showRanking={false}
                                    showSelectedRegion={false}
                                    className="mx-auto max-w-xl"
                                />
                            ),
                            previewBodyWidth: "2xl",
                            code: withStateCodeData(stateCodeByLocale[locale].mapOnly),
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <h2 id="props" className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">{sectionLabels.props}</h2>
                <PropsTable data={propsDataByLocale[locale]} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h2 id="usage" className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">{sectionLabels.usage}</h2>
                    <CodeCopyButton code={usageCode} />
                </div>
                <CodeBlock code={usageCode} />
            </div>
        </ComponentLayout>
    );
}
