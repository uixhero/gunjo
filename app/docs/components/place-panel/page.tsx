"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { MapDemoSurface } from "@/components/doc/MapDemoSurface";
import { PlaceRowsFigure } from "@/components/doc/MapPartsFigures";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import overlayMetadata from "@design/overlay-metadata.json";
import { Button, DocNote, Label, PlacePanel, Switch, type PlacePanelField } from "@gunjo/ui";

type Locale = "ja" | "en";

type Weather = { temp: string; feel: string; humidity: string; wind: string; cloud: string };

/** Fixed values: the page must render the same on the server. */
const WEATHER: Weather = { temp: "22.4°C", feel: "24.8°C", humidity: "80%", wind: "5.8 km/h", cloud: "67%" };

/**
 * Every row from the first frame. `undefined` = still loading, `null` =
 * could not be fetched. Values that need no request (coordinates, local solar
 * time) are there at once.
 */
function placeFields(isJa: boolean, weather: Weather | null | undefined): PlacePanelField[] {
    const w = (key: keyof Weather) => (weather === undefined ? undefined : weather === null ? null : weather[key]);
    return [
        { id: "feel", label: isJa ? "体感" : "Feels like", value: w("feel") },
        { id: "humidity", label: isJa ? "湿度" : "Humidity", value: w("humidity") },
        { id: "wind", label: isJa ? "風" : "Wind", value: w("wind") },
        { id: "cloud", label: isJa ? "雲量" : "Cloud cover", value: w("cloud") },
        { id: "coords", label: isJa ? "座標" : "Position", value: "N35.69° E139.75°" },
        { id: "solar", label: isJa ? "地方太陽時" : "Solar time", value: "11:27" },
    ];
}

function PlacePanelDemo({ locale }: { locale: Locale }) {
    const isJa = locale === "ja";
    const [open, setOpen] = React.useState(true);
    const [title, setTitle] = React.useState<string | undefined>(undefined);
    const [weather, setWeather] = React.useState<Weather | null | undefined>(undefined);
    const [fail, setFail] = React.useState(false);
    const timers = React.useRef<number[]>([]);

    const pick = React.useCallback(() => {
        timers.current.forEach((t) => window.clearTimeout(t));
        setOpen(true);
        setTitle(undefined);
        setWeather(undefined);
        timers.current = [
            window.setTimeout(() => setTitle(isJa ? "千代田区・東京都・日本" : "Chiyoda, Tokyo, Japan"), 700),
            window.setTimeout(() => setWeather(fail ? null : WEATHER), 1600),
        ];
    }, [fail, isJa]);

    React.useEffect(() => {
        pick();
        return () => timers.current.forEach((t) => window.clearTimeout(t));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isJa]);

    return (
        <div className="flex w-full flex-col gap-4">
            <MapDemoSurface ratio="square">
                {open ? (
                    <PlacePanel
                        className="absolute inset-x-0 bottom-0"
                        titleAs="h3"
                        label={isJa ? "地点の詳細" : "Place details"}
                        closeLabel={isJa ? "閉じる" : "Close"}
                        title={title}
                        headline={{
                            value: weather === undefined ? undefined : weather === null ? null : weather.temp,
                            caption: weather === undefined ? undefined : weather === null ? null : isJa ? "薄曇り" : "Light cloud",
                        }}
                        fields={placeFields(isJa, weather)}
                        onClose={() => setOpen(false)}
                    />
                ) : null}
            </MapDemoSurface>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <Button variant="outline" size="sm" onClick={pick}>
                    {isJa ? "地点を選び直す" : "Pick the place again"}
                </Button>
                <div className="flex items-center gap-2">
                    <Switch id="place-panel-fail" checked={fail} onCheckedChange={setFail} />
                    <Label htmlFor="place-panel-fail">{isJa ? "天気の取得に失敗する" : "Weather lookup fails"}</Label>
                </div>
            </div>
        </div>
    );
}

export default function PlacePanelDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const content = getDocContent("components/place-panel", locale);
    const metadata = overlayMetadata as Record<string, { title?: string; description?: string }>;
    const title = content?.title ?? metadata.placePanel.title ?? "PlacePanel";
    const description = content?.description ?? metadata.placePanel.description ?? "";

    const usageCode = isJa
        ? `import * as React from "react";
import { PlacePanel } from "@gunjo/ui";

type Current = { temperature_2m?: number; relative_humidity_2m?: number };

export function PickedPlace() {
  const [name, setName] = React.useState<string | null | undefined>(undefined);
  const [now, setNow] = React.useState<Current | null | undefined>(undefined);

  React.useEffect(() => {
    setName("千代田区・東京都・日本");
    fetch("https://api.open-meteo.com/v1/forecast?latitude=35.69&longitude=139.75&current=temperature_2m,relative_humidity_2m")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => setNow(j.current ?? null))
      // 取れなかったら null。骨組みは「—」で止まります
      .catch(() => setNow(null));
  }, []);

  // undefined は読み込み中、null は取れなかった
  const pick = <T,>(v: T | undefined) => (now === undefined ? undefined : v ?? null);

  return (
    <div className="relative h-[32rem] overflow-hidden rounded-lg bg-muted">
      <PlacePanel
        className="absolute inset-x-0 bottom-0"
        label="地点の詳細"
        closeLabel="閉じる"
        title={name}
        headline={{ value: pick(now?.temperature_2m != null ? \`\${now.temperature_2m}°C\` : undefined) }}
        fields={[
          { id: "hum", label: "湿度", value: pick(now?.relative_humidity_2m != null ? \`\${now.relative_humidity_2m}%\` : undefined) },
          { id: "pos", label: "座標", value: "N35.69° E139.75°" },
        ]}
        onClose={() => setName(undefined)}
      />
    </div>
  );
}`
        : `import * as React from "react";
import { PlacePanel } from "@gunjo/ui";

type Current = { temperature_2m?: number; relative_humidity_2m?: number };

export function PickedPlace() {
  const [name, setName] = React.useState<string | null | undefined>(undefined);
  const [now, setNow] = React.useState<Current | null | undefined>(undefined);

  React.useEffect(() => {
    setName("Chiyoda, Tokyo, Japan");
    fetch("https://api.open-meteo.com/v1/forecast?latitude=35.69&longitude=139.75&current=temperature_2m,relative_humidity_2m")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => setNow(j.current ?? null))
      // On failure pass null: the skeletons settle to "—"
      .catch(() => setNow(null));
  }, []);

  // undefined = loading, null = could not be fetched
  const pick = <T,>(v: T | undefined) => (now === undefined ? undefined : v ?? null);

  return (
    <div className="relative h-[32rem] overflow-hidden rounded-lg bg-muted">
      <PlacePanel
        className="absolute inset-x-0 bottom-0"
        title={name}
        headline={{ value: pick(now?.temperature_2m != null ? \`\${now.temperature_2m}°C\` : undefined) }}
        fields={[
          { id: "hum", label: "Humidity", value: pick(now?.relative_humidity_2m != null ? \`\${now.relative_humidity_2m}%\` : undefined) },
          { id: "pos", label: "Position", value: "N35.69° E139.75°" },
        ]}
        onClose={() => setName(undefined)}
      />
    </div>
  );
}`;

    const stateCode = {
        loading: isJa
            ? `import { PlacePanel } from "@gunjo/ui";

export function Loading() {
  return (
    <PlacePanel
      title={undefined}
      headline={{ value: undefined, caption: undefined }}
      fields={[
        { id: "feel", label: "体感", value: undefined },
        { id: "hum", label: "湿度", value: undefined },
        { id: "pos", label: "座標", value: "N35.69° E139.75°" },
      ]}
    />
  );
}`
            : `import { PlacePanel } from "@gunjo/ui";

export function Loading() {
  return (
    <PlacePanel
      title={undefined}
      headline={{ value: undefined, caption: undefined }}
      fields={[
        { id: "feel", label: "Feels like", value: undefined },
        { id: "hum", label: "Humidity", value: undefined },
        { id: "pos", label: "Position", value: "N35.69° E139.75°" },
      ]}
    />
  );
}`,
        ready: isJa
            ? `import { PlacePanel } from "@gunjo/ui";

export function Filled() {
  return (
    <PlacePanel
      title="千代田区・東京都・日本"
      headline={{ value: "22.4°C", caption: "薄曇り" }}
      fields={[
        { id: "feel", label: "体感", value: "24.8°C" },
        { id: "hum", label: "湿度", value: "80%" },
        { id: "pos", label: "座標", value: "N35.69° E139.75°" },
      ]}
    />
  );
}`
            : `import { PlacePanel } from "@gunjo/ui";

export function Filled() {
  return (
    <PlacePanel
      title="Chiyoda, Tokyo, Japan"
      headline={{ value: "22.4°C", caption: "Light cloud" }}
      fields={[
        { id: "feel", label: "Feels like", value: "24.8°C" },
        { id: "hum", label: "Humidity", value: "80%" },
        { id: "pos", label: "Position", value: "N35.69° E139.75°" },
      ]}
    />
  );
}`,
        failed: isJa
            ? `import { PlacePanel } from "@gunjo/ui";

export function CouldNotFetch() {
  return (
    <PlacePanel
      title="千代田区・東京都・日本"
      headline={{ value: null, caption: null }}
      fields={[
        { id: "feel", label: "体感", value: null },
        { id: "hum", label: "湿度", value: null },
        { id: "pos", label: "座標", value: "N35.69° E139.75°" },
      ]}
    />
  );
}`
            : `import { PlacePanel } from "@gunjo/ui";

export function CouldNotFetch() {
  return (
    <PlacePanel
      title="Chiyoda, Tokyo, Japan"
      headline={{ value: null, caption: null }}
      fields={[
        { id: "feel", label: "Feels like", value: null },
        { id: "hum", label: "Humidity", value: null },
        { id: "pos", label: "Position", value: "N35.69° E139.75°" },
      ]}
    />
  );
}`,
    };

    const stateFields = (state: "loading" | "ready" | "failed"): PlacePanelField[] => {
        const v = (x: string) => (state === "loading" ? undefined : state === "failed" ? null : x);
        return [
            { id: "feel", label: isJa ? "体感" : "Feels like", value: v("24.8°C") },
            { id: "hum", label: isJa ? "湿度" : "Humidity", value: v("80%") },
            { id: "pos", label: isJa ? "座標" : "Position", value: "N35.69° E139.75°" },
        ];
    };
    const statePanel = (state: "loading" | "ready" | "failed") => {
        const v = (x: string) => (state === "loading" ? undefined : state === "failed" ? null : x);
        return (
            <PlacePanel
                className="w-full max-w-md"
                titleAs="h3"
                label={isJa ? "地点の詳細" : "Place details"}
                title={state === "loading" ? undefined : isJa ? "千代田区・東京都・日本" : "Chiyoda, Tokyo, Japan"}
                headline={{ value: v("22.4°C"), caption: v(isJa ? "薄曇り" : "Light cloud") }}
                fields={stateFields(state)}
            />
        );
    };

    const propsData = [
        { name: "title", type: "ReactNode | null | undefined", description: isJa ? "地点の名前。調べているあいだは undefined、取れなかったら null。" : "The place's name; undefined while looked up, null if it could not be." },
        {
            name: "headline",
            type: "{ value, caption? }",
            description: isJa ? "大きく出す1つの値と、横の一言。" : "One large value and a few words beside it.",
        },
        { name: "fields", type: "PlacePanelField[]", description: isJa ? "出す値の全部。最初から全部渡します。" : "Every value, all passed from the first render." },
        { name: "fields[].value", type: "ReactNode | null | undefined", description: isJa ? "undefined は読み込み中、null は取れなかった。" : "undefined loading, null could not be fetched." },
        { name: "columns", type: "1 | 2", default: "2", description: isJa ? "値の列数。狭いときは1列になります。" : "Columns; one when narrow." },
        { name: "onClose", type: "() => void", description: isJa ? "閉じるボタン。渡さなければ出ません。" : "The close button; omitted when not passed." },
        { name: "closeLabel", type: "string", default: '"Close"', description: isJa ? "閉じるボタンの読み上げ名。" : "The close button's name." },
        { name: "label", type: "string", default: '"Place details"', description: isJa ? "欄の読み上げ名。" : "The panel's accessible name." },
        { name: "titleAs", type: '"h2" | "h3" | "h4"', default: '"h2"', description: isJa ? "地点の名前を、どの階層の見出し（h2〜h4）にするか。" : "Heading level of the title." },
    ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[{ name: "Skeleton", href: "/docs/components/skeleton" }]}
            relatedComponents={[
                {
                    name: "Sheet",
                    href: "/docs/components/sheet",
                    boundary: isJa ? "画面の手前に重なり、そのあいだ後ろの地図を操作できなくする。" : "Modal: the map behind it stops responding.",
                },
                {
                    name: "Drawer",
                    href: "/docs/components/drawer",
                    boundary: isJa ? "指で下へ払って閉じる手前の面。これも後ろを操作できなくする。" : "Modal too, with drag to dismiss.",
                },
                {
                    name: "Skeleton",
                    href: "/docs/components/skeleton",
                    boundary: isJa ? "読み込み中の仮の枠だけ。この欄の値の場所に使っている。" : "The loading shape alone; used for the values here.",
                },
                {
                    name: "MetadataList",
                    href: "/docs/components/metadata-list",
                    boundary: isJa ? "項目と値の並び。読み込み中の状態を持たない。" : "Label–value pairs with no loading state.",
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
                <PlacePanelDemo locale={locale as Locale} />
            </ComponentPreview>

            <DocNote
                variant="warning"
                heading={isJa ? "値が届くたびに行を足しません" : "Every row from the start — and a failed value settles to “—”"}
            >
                {isJa
                    ? "足すたびに行の数が変わり、欄がガタつき、上の地図まで上下に動きます。取れなかった値に明滅する骨組みを残すと、もう届かない値を「まだ来る」と言い続けることになります。"
                    : "Adding rows as each value lands changes the row count, shakes the panel and moves the map above it. Headings and labels are drawn at once and only the values wait as skeletons. A value that could not be fetched settles to “—”; a skeleton left pulsing keeps promising a value that will never come."}
            </DocNote>

            <PlaceRowsFigure locale={locale as Locale} />

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {isJa ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "loading",
                            title: isJa ? "骨組み" : "Skeleton",
                            description: isJa
                                ? "調べているあいだ。項目名と、すぐに分かる値（座標）は出ていて、届くのを待つ値だけが骨組みです。aria-busy が付きます。端末で「動きを減らす」設定をオンにしている人には明滅しません。"
                                : "While looking up. Labels and values that need no request (position) are there; only the pending values are skeletons. aria-busy is set.",
                            preview: statePanel("loading"),
                            code: stateCode.loading,
                        },
                        {
                            key: "ready",
                            title: isJa ? "値が入った" : "Filled",
                            description: isJa
                                ? "値が入った状態です。"
                                : "Values in. Neither the row count nor the height changes.",
                            preview: statePanel("ready"),
                            code: stateCode.ready,
                        },
                        {
                            key: "failed",
                            title: isJa ? "取れなかった" : "Could not fetch",
                            description: isJa
                                ? "取得に失敗した値は「—」で確定し、明滅をやめます。"
                                : "Failed values settle to “—” and stop pulsing.",
                            preview: statePanel("failed"),
                            code: stateCode.failed,
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
                            <strong>Sheet にしていません。</strong>
                            地図を見る人は、欄を出したまま地図を動かしたいので、この欄は後ろの操作を止めません。
                        </li>
                        <li>
                            <strong>3つの状態を、値の中身だけで区別します。</strong>
                            状態を別の prop にすると、値と状態が食い違う組み合わせが作れてしまいます。
                        </li>
                        <li>
                            <strong>2列にするかは、欄の幅で決めます。</strong>
                            広い画面で地図の横の細い欄に置いたときも、1列に戻ります。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Not a Sheet.</strong> A Sheet is modal and stops the map behind it. A map reader
                            wants to keep panning with the panel up, so this one stops nothing, and the caller places it
                            (the bottom edge on a phone, beside the map on a wide screen).
                        </li>
                        <li>
                            <strong>Three states, told by the value alone.</strong> undefined is loading, null is could
                            not fetch, anything else is the value. A separate status prop would allow a value and a
                            status that disagree.
                        </li>
                        <li>
                            <strong>Two columns by the panel&rsquo;s width,</strong> not the screen&rsquo;s. Placed in
                            a narrow pane beside the map, it goes back to one column.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
