"use client";

import * as React from "react";
import { IconEye } from "@tabler/icons-react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { MapDemoSurface } from "@/components/doc/MapDemoSurface";
import { LayerAllFigure } from "@/components/doc/MapPartsFigures";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";
import { DocNote, LayerMenu, layerMenuAllState, type LayerMenuGroup } from "@gunjo/ui";

type Locale = "ja" | "en";

function layerGroups(isJa: boolean, zoomedIn: boolean): LayerMenuGroup[] {
    return [
        {
            id: "weather",
            label: isJa ? "天気" : "Weather",
            items: [
                { id: "cloud", label: isJa ? "雲" : "Clouds" },
                { id: "storm", label: isJa ? "熱帯低気圧" : "Tropical storms" },
                {
                    id: "rain",
                    label: isJa ? "雨" : "Rain",
                    note: isJa ? "拡大すると出る" : "When zoomed in",
                    disabledReason: zoomedIn ? undefined : isJa ? "もっと拡大すると使えます" : "Zoom in to use",
                },
                { id: "night", label: isJa ? "夜景" : "City lights", note: isJa ? "夜側の街明かり" : "Night side" },
            ],
        },
        {
            id: "position",
            label: isJa ? "位置" : "Position",
            items: [
                { id: "iss", label: "ISS" },
                { id: "plane", label: isJa ? "航空機" : "Aircraft" },
                { id: "sun", label: isJa ? "太陽と月" : "Sun and Moon", note: isJa ? "画面の端に" : "At the edge" },
            ],
        },
        {
            id: "map",
            label: isJa ? "地図" : "Map",
            items: [{ id: "border", label: isJa ? "国境・県境" : "Borders" }],
        },
    ];
}

function LayerMenuDemo({ locale }: { locale: Locale }) {
    const isJa = locale === "ja";
    const groups = layerGroups(isJa, false);
    const [value, setValue] = React.useState(["cloud", "storm", "night", "iss", "sun", "border"]);
    const state = layerMenuAllState(groups, value);
    const stateText = {
        on: isJa ? "すべて表示" : "All on",
        off: isJa ? "すべて非表示" : "All off",
        mixed: isJa ? "一部だけ表示" : "Some on",
    }[state];

    return (
        <div className="flex w-full flex-col gap-3">
            <MapDemoSurface>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                        <LayerMenu
                            groups={groups}
                            value={value}
                            onValueChange={setValue}
                            icon={<IconEye />}
                            label={isJa ? "重ねるものを選ぶ（長押しでまとめて消す）" : "Choose layers (hold to hide all)"}
                            allLabel={isJa ? "すべて" : "All"}
                        />
                </div>
            </MapDemoSurface>
            <p className="text-sm text-muted-foreground" aria-live="polite">
                {isJa ? "いま：" : "Now: "}
                {stateText}（{isJa ? `${value.length}件表示中` : `${value.length} shown`}）
            </p>
        </div>
    );
}

function OpenMenu({ locale, value, zoomedIn = true }: { locale: Locale; value: string[]; zoomedIn?: boolean }) {
    const isJa = locale === "ja";
    const [v, setV] = React.useState(value);
    return (
        <LayerMenu
            inline
            groups={layerGroups(isJa, zoomedIn)}
            value={v}
            onValueChange={setV}
            icon={<IconEye />}
            label={isJa ? "重ねるもの" : "Layers"}
            allLabel={isJa ? "すべて" : "All"}
        />
    );
}

export default function LayerMenuDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const content = getDocContent("components/layer-menu", locale);
    const metadata = inputsMetadata as Record<string, { title?: string; description?: string }>;
    const title = content?.title ?? metadata.layerMenu.title ?? "LayerMenu";
    const description = content?.description ?? metadata.layerMenu.description ?? "";

    const usageCode = isJa
        ? `import * as React from "react";
import { LayerMenu, type LayerMenuGroup } from "@gunjo/ui";
import { IconEye } from "@tabler/icons-react";

const GROUPS: LayerMenuGroup[] = [
  {
    id: "weather",
    label: "天気",
    items: [
      { id: "cloud", label: "雲" },
      // 使えないあいだは理由を一言。状態はそのまま残ります
      { id: "rain", label: "雨", disabledReason: "もっと拡大すると使えます" },
      { id: "night", label: "夜景", note: "夜側の街明かり" },
    ],
  },
  {
    id: "map",
    label: "地図",
    items: [{ id: "border", label: "国境・県境" }],
  },
];

export function MapLayers() {
  const [value, setValue] = React.useState(["cloud", "night", "border"]);

  return (
    <LayerMenu
      groups={GROUPS}
      value={value}
      onValueChange={setValue}
      icon={<IconEye />}
      // 長押しで何が起きるかも、名前に書いておきます
      label="重ねるものを選ぶ（長押しでまとめて消す）"
      allLabel="すべて"
      onLongPress={() => navigator.vibrate?.(10)}
    />
  );
}`
        : `import * as React from "react";
import { LayerMenu, type LayerMenuGroup } from "@gunjo/ui";
import { IconEye } from "@tabler/icons-react";

const GROUPS: LayerMenuGroup[] = [
  {
    id: "weather",
    label: "Weather",
    items: [
      { id: "cloud", label: "Clouds" },
      // While it cannot be switched, say why; its state is kept
      { id: "rain", label: "Rain", disabledReason: "Zoom in to use" },
      { id: "night", label: "City lights", note: "Night side" },
    ],
  },
  {
    id: "map",
    label: "Map",
    items: [{ id: "border", label: "Borders" }],
  },
];

export function MapLayers() {
  const [value, setValue] = React.useState(["cloud", "night", "border"]);

  return (
    <LayerMenu
      groups={GROUPS}
      value={value}
      onValueChange={setValue}
      icon={<IconEye />}
      // Put what the long press does into the name as well
      label="Choose layers (hold to hide all)"
      allLabel="All"
      onLongPress={() => navigator.vibrate?.(10)}
    />
  );
}`;

    const propsData = [
        { name: "groups", type: "LayerMenuGroup[]", description: isJa ? "組と、その中の重ねるもの。" : "Layers in labelled groups." },
        { name: "value", type: "string[]", description: isJa ? "表示中のものの id。" : "Ids of the layers that are on." },
        { name: "onValueChange", type: "(value: string[]) => void", description: isJa ? "表示・非表示が変わったとき。" : "Called when layers change." },
        { name: "icon", type: "ReactNode", description: isJa ? "メニューを開くボタンのアイコン。" : "The glyph on the button." },
        {
            name: "label",
            type: "string",
            description: isJa ? "ボタンの名前とツールチップ。長押しで何が起きるかも、この文字列に含めます。" : "The button's name and tooltip; mention the long press.",
        },
        { name: "allLabel", type: "ReactNode", default: '"All"', description: isJa ? "先頭の「すべて」の行の言葉。" : "The first row's text." },
        {
            name: "longPressMs",
            type: "number",
            default: "450",
            description: isJa ? "長押しとみなす長さ（ms）。0 で長押しなし。" : "Long-press length in ms; 0 turns it off.",
        },
        { name: "onLongPress", type: "() => void", description: isJa ? "長押しで切り替えたあと（端末を振動させて知らせる、などに）。" : "After a long press (for a haptic tick)." },
        { name: "size", type: '"default" | "sm" | "lg"', default: '"default"', description: isJa ? "ボタンの大きさ。" : "Trigger size." },
        { name: "side / align", type: "string", default: '"top" / "center"', description: isJa ? "メニューを開く位置。" : "Where the menu opens." },
        { name: "portalContainer", type: "HTMLElement | null", description: isJa ? "メニューを描く先（全画面の地図の中など）。" : "Where to render the menu." },
        { name: "inline", type: "boolean", default: "false", description: isJa ? "ボタンを出さず、一覧だけを描く（広い画面の横の欄に）。" : "The list alone, no button (for a side pane)." },
        { name: "open / onOpenChange", type: "boolean / (open) => void", description: isJa ? "開閉の状態を、使う側のコードで管理するとき。" : "Controlled open state." },
    ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "MapControlButton", href: "/docs/components/map-control-button" },
                { name: "Popover", href: "/docs/components/popover" },
            ]}
            relatedComponents={[
                {
                    name: "DropdownMenu",
                    href: "/docs/components/dropdown-menu",
                    boundary: isJa ? "操作を選ぶと閉じるメニュー。長押しも3つの状態も無い。" : "Actions that close on select; no long press.",
                },
                {
                    name: "Checkbox",
                    href: "/docs/components/checkbox",
                    boundary: isJa ? "地図の上ではなく、ふつうのページのフォームで使う入力。" : "A form field on a page.",
                },
                {
                    name: "FilterChips",
                    href: "/docs/components/filter-chips",
                    boundary: isJa ? "一覧を絞り込む。重ねて描くものは選ばない。" : "Narrows a list; draws nothing on top.",
                },
                {
                    name: "MapControlButton",
                    href: "/docs/components/map-control-button",
                    boundary: isJa ? "このメニューを開くボタンそのもの。" : "The button that opens this menu.",
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
                <LayerMenuDemo locale={locale as Locale} />
            </ComponentPreview>

            <DocNote
                variant="warning"
                heading={isJa ? "画面が大きく変わる操作は、タップに割り当てません" : "Tap opens; a long press hides everything"}
            >
                {isJa
                    ? "タップは、メニューを開いて「このボタンは何をするのか」を確かめるための操作です。そこで地図が塗り替わると、確かめられなくなります。長押しを知らない人やキーボードの人のために、同じ働きをメニューの先頭の「すべて」に置いています。"
                    : "The action that repaints the whole map is not on the tap. A tap is how people find out what a button does, and a repainted map makes that impossible. The same action sits in the first row, “All”, for readers who never find the long press and for keyboards."}
            </DocNote>

            <LayerAllFigure locale={locale as Locale} />

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {isJa ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "mixed",
                            title: isJa ? "「すべて」が一部だけ" : "“All” partly on",
                            description: isJa
                                ? "一部だけ表示しているとき、「すべて」の印は横棒になります（aria-pressed=\"mixed\"）。"
                                : "With some layers on, “All” shows a dash (aria-pressed=\"mixed\"). One press hides everything; another brings the previous set back.",
                            preview: <OpenMenu locale={locale as Locale} value={["cloud", "iss", "border"]} />,
                            code: isJa
                                ? `import * as React from "react";
import { LayerMenu } from "@gunjo/ui";
import { IconEye } from "@tabler/icons-react";

const GROUPS = [
  { id: "weather", label: "天気", items: [{ id: "cloud", label: "雲" }, { id: "rain", label: "雨" }] },
  { id: "map", label: "地図", items: [{ id: "border", label: "国境・県境" }] },
];

export function PartlyOn() {
  const [value, setValue] = React.useState(["cloud"]);
  return (
    <LayerMenu inline groups={GROUPS} value={value} onValueChange={setValue}
      icon={<IconEye />} label="重ねるもの" allLabel="すべて" />
  );
}`
                                : `import * as React from "react";
import { LayerMenu } from "@gunjo/ui";
import { IconEye } from "@tabler/icons-react";

const GROUPS = [
  { id: "weather", label: "Weather", items: [{ id: "cloud", label: "Clouds" }, { id: "rain", label: "Rain" }] },
  { id: "map", label: "Map", items: [{ id: "border", label: "Borders" }] },
];

export function PartlyOn() {
  const [value, setValue] = React.useState(["cloud"]);
  return (
    <LayerMenu inline groups={GROUPS} value={value} onValueChange={setValue}
      icon={<IconEye />} label="Layers" allLabel="All" />
  );
}`,
                        },
                        {
                            key: "all-on",
                            title: isJa ? "すべて表示" : "All on",
                            description: isJa
                                ? "全部表示しているとき、「すべて」にもほかの行と同じチェックが付きます。"
                                : "Everything on: “All” carries the same check as the other rows. It is never the one row without a mark.",
                            preview: (
                                <OpenMenu
                                    locale={locale as Locale}
                                    value={["cloud", "storm", "rain", "night", "iss", "plane", "sun", "border"]}
                                />
                            ),
                            code: isJa
                                ? `import * as React from "react";
import { LayerMenu } from "@gunjo/ui";
import { IconEye } from "@tabler/icons-react";

const GROUPS = [
  { id: "weather", label: "天気", items: [{ id: "cloud", label: "雲" }, { id: "rain", label: "雨" }] },
];

export function AllOn() {
  const [value, setValue] = React.useState(["cloud", "rain"]);
  return (
    <LayerMenu inline groups={GROUPS} value={value} onValueChange={setValue}
      icon={<IconEye />} label="重ねるもの" allLabel="すべて" />
  );
}`
                                : `import * as React from "react";
import { LayerMenu } from "@gunjo/ui";
import { IconEye } from "@tabler/icons-react";

const GROUPS = [
  { id: "weather", label: "Weather", items: [{ id: "cloud", label: "Clouds" }, { id: "rain", label: "Rain" }] },
];

export function AllOn() {
  const [value, setValue] = React.useState(["cloud", "rain"]);
  return (
    <LayerMenu inline groups={GROUPS} value={value} onValueChange={setValue}
      icon={<IconEye />} label="Layers" allLabel="All" />
  );
}`,
                        },
                        {
                            key: "all-off",
                            title: isJa ? "すべて非表示" : "All off",
                            description: isJa
                                ? "全部消えているとき、「すべて」の印は空になります。メニューを開くボタンも、背景色が薄くなります。"
                                : "Everything off: the button's surface fades and “All” shows an empty box.",
                            preview: <OpenMenu locale={locale as Locale} value={[]} />,
                            code: isJa
                                ? `import * as React from "react";
import { LayerMenu } from "@gunjo/ui";
import { IconEye } from "@tabler/icons-react";

const GROUPS = [
  { id: "weather", label: "天気", items: [{ id: "cloud", label: "雲" }, { id: "rain", label: "雨" }] },
];

export function AllOff() {
  const [value, setValue] = React.useState<string[]>([]);
  return (
    <LayerMenu inline groups={GROUPS} value={value} onValueChange={setValue}
      icon={<IconEye />} label="重ねるもの" allLabel="すべて" />
  );
}`
                                : `import * as React from "react";
import { LayerMenu } from "@gunjo/ui";
import { IconEye } from "@tabler/icons-react";

const GROUPS = [
  { id: "weather", label: "Weather", items: [{ id: "cloud", label: "Clouds" }, { id: "rain", label: "Rain" }] },
];

export function AllOff() {
  const [value, setValue] = React.useState<string[]>([]);
  return (
    <LayerMenu inline groups={GROUPS} value={value} onValueChange={setValue}
      icon={<IconEye />} label="Layers" allLabel="All" />
  );
}`,
                        },
                        {
                            key: "disabled",
                            title: isJa ? "使えない理由" : "Why it is unavailable",
                            description: isJa
                                ? "地図の拡大が足りないなど、いま切り替えられないものは、行と状態を残したまま理由を一言出します。「すべて」を押しても、この行の状態は変わりません。"
                                : "A layer that cannot be switched now keeps its row and state and says why in a few words. “All” leaves it alone too.",
                            preview: <OpenMenu locale={locale as Locale} value={["cloud", "rain", "iss"]} zoomedIn={false} />,
                            code: isJa
                                ? `import * as React from "react";
import { LayerMenu } from "@gunjo/ui";
import { IconEye } from "@tabler/icons-react";

export function ZoomToUse() {
  const [zoom] = React.useState(3);
  const [value, setValue] = React.useState(["cloud", "rain"]);
  const groups = [
    {
      id: "weather",
      label: "天気",
      items: [
        { id: "cloud", label: "雲" },
        { id: "rain", label: "雨", disabledReason: zoom < 6 ? "もっと拡大すると使えます" : undefined },
      ],
    },
  ];
  return (
    <LayerMenu inline groups={groups} value={value} onValueChange={setValue}
      icon={<IconEye />} label="重ねるもの" allLabel="すべて" />
  );
}`
                                : `import * as React from "react";
import { LayerMenu } from "@gunjo/ui";
import { IconEye } from "@tabler/icons-react";

export function ZoomToUse() {
  const [zoom] = React.useState(3);
  const [value, setValue] = React.useState(["cloud", "rain"]);
  const groups = [
    {
      id: "weather",
      label: "Weather",
      items: [
        { id: "cloud", label: "Clouds" },
        { id: "rain", label: "Rain", disabledReason: zoom < 6 ? "Zoom in to use" : undefined },
      ],
    },
  ];
  return (
    <LayerMenu inline groups={groups} value={value} onValueChange={setValue}
      icon={<IconEye />} label="Layers" allLabel="All" />
  );
}`,
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
                            <strong>行を押してもメニューは閉じません。</strong>
                            チェックが変わるところを見て確かめられるようにするためです。外を押すか Esc で閉じます。
                        </li>
                        <li>
                            <strong>「すべて」で戻る先は、消す前の組み合わせです。</strong>
                            一度消して見比べ、元の見え方に戻すためです。覚えた組み合わせが無ければ、すべて表示になります。
                        </li>
                        <li>
                            <strong>使えない行を消さないのは、</strong>
                            地図を拡大したときに何が出てくるかを、先に見せておくためです。
                        </li>
                        <li>
                            <strong>組の見出しと、右端の補足（「拡大すると出る」など）は、地図の上に重ねる文字専用の小さなサイズです。</strong>
                            <code>text-canvas-sm</code>（11px）を使います。地図の外に置く inline では、ふつうの 12px に戻します。項目の名前はしっかり読む文字なので、どちらでも 14px です。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>A row press does not close the menu.</strong> The reader sees the marks change. It
                            closes on an outside press or Escape.
                        </li>
                        <li>
                            <strong>“All” brings back the previous set,</strong> not every layer. The point is to hide
                            everything, compare, and return to the view you had. Only when nothing was remembered (everything was off from the start) does it turn every layer on.
                        </li>
                        <li>
                            <strong>An unavailable layer keeps its row and state.</strong> Removing it would hide what
                            will appear once you zoom in.
                        </li>
                        <li>
                            <strong>Group headings and notes use the canvas type tier</strong> (
                            <code>text-canvas-sm</code>, 11px) over the map, and go back to 12px in the inline list off the map. Layer names are read, so they stay at 14px.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
