"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";
import { DocNote, Label, SegmentedControl, Switch, TimeTransport } from "@gunjo/ui";

type Locale = "ja" | "en";

/**
 * ⚠️ A fixed instant, not `Date.now()`. The demo owns the clock (that is the
 * point of the component), but the FIRST frame has to be the same on the server
 * and on the client, so the real clock is only read inside the effect below.
 * 2026-09-12 12:00 JST.
 */
const DEMO_EPOCH = Date.UTC(2026, 8, 12, 3, 0, 0);

const HOUR = 3_600_000;
const DAY = 86_400_000;

/** Explicit time zone: without it the server and the client format differently. */
const CLOCK_FORMAT = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
});
const DATE_FORMAT = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

type PresetKey = "clock" | "replay";

function presetsFor(locale: Locale) {
    const isJa = locale === "ja";
    return {
        clock: {
            label: isJa ? "時刻を送る" : "Clock",
            speeds: [
                { value: 1, label: "1×" },
                { value: 60, label: isJa ? "1分/秒" : "1m/s" },
                { value: 600, label: isJa ? "10分/秒" : "10m/s" },
                { value: 3600, label: isJa ? "1時間/秒" : "1h/s" },
                { value: 21600, label: isJa ? "6時間/秒" : "6h/s" },
                { value: 86400, label: isJa ? "1日/秒" : "1d/s" },
            ],
            jumps: [
                { offset: -DAY, label: isJa ? "1日" : "1d" },
                { offset: -HOUR, label: isJa ? "1時間" : "1h" },
                { offset: HOUR, label: isJa ? "1時間" : "1h" },
                { offset: DAY, label: isJa ? "1日" : "1d" },
            ],
        },
        replay: {
            label: isJa ? "ログを再生する" : "Log replay",
            speeds: [
                { value: 1, label: "1×" },
                { value: 2, label: "2×" },
                { value: 5, label: "5×" },
                { value: 10, label: "10×" },
            ],
            jumps: [
                { offset: -60_000, label: isJa ? "1分" : "1m" },
                { offset: -10_000, label: isJa ? "10秒" : "10s" },
                { offset: 10_000, label: isJa ? "10秒" : "10s" },
                { offset: 60_000, label: isJa ? "1分" : "1m" },
            ],
        },
    } satisfies Record<PresetKey, unknown> as Record<
        PresetKey,
        {
            label: string;
            speeds: { value: number; label: string }[];
            jumps: { offset: number; label: string }[];
        }
    >;
}

function labelsFor(locale: Locale) {
    if (locale !== "ja") return undefined;
    return {
        group: "時間の操作",
        play: "再生",
        pause: "一時停止",
        speed: "再生の速さ",
        returnToNow: "いまへ戻る",
        live: "実時間",
        detached: "いまではない",
        jumpBack: (label: string) => `${label}戻す`,
        jumpForward: (label: string) => `${label}進める`,
    };
}

/**
 * The demo owns the ticking — `TimeTransport` never does. Everything the
 * component shows is state held here and handed back down.
 */
function TimeTransportDemo({
    locale,
    preset = "clock",
    withJumps = true,
    disabled = false,
}: {
    locale: Locale;
    preset?: PresetKey;
    withJumps?: boolean;
    disabled?: boolean;
}) {
    const isJa = locale === "ja";
    const presets = presetsFor(locale);
    const active = presets[preset];

    const [now, setNow] = React.useState(DEMO_EPOCH);
    const [value, setValue] = React.useState(DEMO_EPOCH);
    const [following, setFollowing] = React.useState(true);
    const [playing, setPlaying] = React.useState(false);
    const [speed, setSpeed] = React.useState(active.speeds[1]?.value ?? 1);

    // Keep the selected speed valid when the preset changes under it.
    React.useEffect(() => {
        setSpeed((current) =>
            active.speeds.some((s) => s.value === current) ? current : (active.speeds[1]?.value ?? 1)
        );
    }, [active]);

    React.useEffect(() => {
        if (disabled) return;
        let last = Date.now();
        const id = window.setInterval(() => {
            const t = Date.now();
            const elapsed = t - last;
            last = t;
            setNow(t);
            setValue((v) => (playing ? v + elapsed * speed : following ? t : v));
        }, 200);
        return () => window.clearInterval(id);
    }, [playing, speed, following, disabled]);

    const detach = (next: number) => {
        setFollowing(false);
        setValue(next);
    };

    return (
        <TimeTransport
            value={value}
            now={now}
            onValueChange={detach}
            onReturnToNow={() => {
                setFollowing(true);
                setPlaying(false);
                setValue(now);
            }}
            playing={playing}
            onPlayingChange={(next) => {
                if (next) setFollowing(false);
                setPlaying(next);
            }}
            speeds={active.speeds}
            speed={speed}
            onSpeedChange={(next) => {
                setFollowing(false);
                setSpeed(next);
            }}
            jumps={withJumps ? active.jumps : undefined}
            disabled={disabled}
            labels={labelsFor(locale)}
            formatValue={(v) => CLOCK_FORMAT.format(new Date(v))}
            secondary={`${DATE_FORMAT.format(new Date(value))} JST${
                playing ? (isJa ? " ・再生中" : " · playing") : ""
            }`}
        />
    );
}

/** The preview at the top: the demo plus controls a reviewer can actually turn. */
function TimeTransportPlayground({ locale }: { locale: Locale }) {
    const isJa = locale === "ja";
    const presets = presetsFor(locale);
    const [preset, setPreset] = React.useState<PresetKey>("clock");
    const [withJumps, setWithJumps] = React.useState(true);
    const [disabled, setDisabled] = React.useState(false);

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-[var(--radius)] border border-dashed border-border p-3">
                <div className="text-xs font-medium text-muted-foreground">
                    {isJa
                        ? "この見本は書き換えて試せます（速さの段と飛ばし幅が入れ替わります）"
                        : "Edit this demo — the speed steps and jump sizes swap with the preset."}
                </div>
                <SegmentedControl
                    aria-label={isJa ? "見本の種類" : "Demo preset"}
                    size="sm"
                    value={preset}
                    onValueChange={(next) => setPreset(next as PresetKey)}
                    options={[
                        { value: "clock", label: presets.clock.label },
                        { value: "replay", label: presets.replay.label },
                    ]}
                />
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2">
                        <Switch id="tt-jumps" checked={withJumps} onCheckedChange={setWithJumps} />
                        <Label htmlFor="tt-jumps" className="text-xs font-normal">
                            {isJa ? "飛ばしボタンを出す" : "Show jump buttons"}
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch id="tt-disabled" checked={disabled} onCheckedChange={setDisabled} />
                        <Label htmlFor="tt-disabled" className="text-xs font-normal">
                            {isJa ? "操作できない状態" : "Disabled"}
                        </Label>
                    </div>
                </div>
            </div>
            <TimeTransportDemo
                locale={locale}
                preset={preset}
                withJumps={withJumps}
                disabled={disabled}
            />
        </div>
    );
}

/** A still frame — no clock at all, so the state is exactly what is passed in. */
function StaticFrame({
    locale,
    value,
    now,
    playing = false,
    jumps = true,
    disabled = false,
}: {
    locale: Locale;
    value: number;
    now: number;
    playing?: boolean;
    jumps?: boolean;
    disabled?: boolean;
}) {
    const presets = presetsFor(locale);
    return (
        <TimeTransport
            value={value}
            now={now}
            onValueChange={() => {}}
            playing={playing}
            onPlayingChange={() => {}}
            speeds={presets.clock.speeds}
            speed={60}
            onSpeedChange={() => {}}
            jumps={jumps ? presets.clock.jumps : undefined}
            disabled={disabled}
            labels={labelsFor(locale)}
            formatValue={(v) => CLOCK_FORMAT.format(new Date(v))}
            secondary={`${DATE_FORMAT.format(new Date(value))} JST`}
        />
    );
}

export default function TimeTransportDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const content = getDocContent("components/time-transport", locale);
    const metadata = inputsMetadata as Record<string, { title?: string; description?: string }>;
    const title = content?.title ?? metadata.timeTransport.title ?? "TimeTransport";
    const description = content?.description ?? metadata.timeTransport.description ?? "";

    const usageCode = isJa
        ? `import { TimeTransport } from "@gunjo/ui";

// ⭐ 時計は TimeTransport の外。進めるのは呼び出し側です。
// サーバと最初の1フレームを合わせるため、時刻は effect の中で読みます。
export function Replay() {
  const [now, setNow] = React.useState(BASE);
  const [value, setValue] = React.useState(BASE);
  const [following, setFollowing] = React.useState(true);
  const [playing, setPlaying] = React.useState(false);
  const [speed, setSpeed] = React.useState(60);

  React.useEffect(() => {
    let last = Date.now();
    const id = window.setInterval(() => {
      const t = Date.now();
      const elapsed = t - last;
      last = t;
      setNow(t);
      setValue((v) => (playing ? v + elapsed * speed : following ? t : v));
    }, 200);
    return () => window.clearInterval(id);
  }, [playing, speed, following]);

  return (
    <TimeTransport
      value={value}
      now={now}
      onValueChange={(next) => { setFollowing(false); setValue(next); }}
      onReturnToNow={() => { setFollowing(true); setPlaying(false); setValue(now); }}
      playing={playing}
      onPlayingChange={setPlaying}
      // 速さの段には呼び出し側が名前をつけます。1× が1秒なのか1日なのかは
      // 部品には分かりません。
      speeds={[
        { value: 1, label: "1×" },
        { value: 60, label: "1分/秒" },
        { value: 3600, label: "1時間/秒" },
        { value: 86400, label: "1日/秒" },
      ]}
      speed={speed}
      onSpeedChange={setSpeed}
      // offset は符号つき。向きはアイコンが示すので、ラベルは大きさだけ。
      jumps={[
        { offset: -86400000, label: "1日" },
        { offset: -3600000, label: "1時間" },
        { offset: 3600000, label: "1時間" },
        { offset: 86400000, label: "1日" },
      ]}
      formatValue={(v) => formatClock(v)}
      secondary="2026-09-12 JST"
    />
  );
}`
        : `import { TimeTransport } from "@gunjo/ui";

// ⭐ The clock lives outside TimeTransport. The caller owns the ticking.
// Read the real clock in an effect so the server and the first client
// frame render the same thing.
export function Replay() {
  const [now, setNow] = React.useState(BASE);
  const [value, setValue] = React.useState(BASE);
  const [following, setFollowing] = React.useState(true);
  const [playing, setPlaying] = React.useState(false);
  const [speed, setSpeed] = React.useState(60);

  React.useEffect(() => {
    let last = Date.now();
    const id = window.setInterval(() => {
      const t = Date.now();
      const elapsed = t - last;
      last = t;
      setNow(t);
      setValue((v) => (playing ? v + elapsed * speed : following ? t : v));
    }, 200);
    return () => window.clearInterval(id);
  }, [playing, speed, following]);

  return (
    <TimeTransport
      value={value}
      now={now}
      onValueChange={(next) => { setFollowing(false); setValue(next); }}
      onReturnToNow={() => { setFollowing(true); setPlaying(false); setValue(now); }}
      playing={playing}
      onPlayingChange={setPlaying}
      // The caller names the speed steps — the component cannot know
      // whether 1x means a second or a day.
      speeds={[
        { value: 1, label: "1x" },
        { value: 60, label: "1m/s" },
        { value: 3600, label: "1h/s" },
        { value: 86400, label: "1d/s" },
      ]}
      speed={speed}
      onSpeedChange={setSpeed}
      // offset is signed. The icon shows direction, so the label
      // carries the magnitude only.
      jumps={[
        { offset: -86400000, label: "1d" },
        { offset: -3600000, label: "1h" },
        { offset: 3600000, label: "1h" },
        { offset: 86400000, label: "1d" },
      ]}
      formatValue={(v) => formatClock(v)}
      secondary="2026-09-12 JST"
    />
  );
}`;

    const propsData = [
        {
            name: "value",
            type: "number",
            required: true,
            description: isJa
                ? "いまの位置。エポックミリ秒が普通ですが、フレーム番号やシミュレーションの刻みでも同じように動きます。"
                : "The current position. Epoch milliseconds is the common case, but a frame index or a simulation tick works the same.",
        },
        {
            name: "onValueChange",
            type: "(next: number) => void",
            description: isJa
                ? "飛ばしボタンやスクラブで位置が動いたときに、次の位置を返します。"
                : "Fires with the next position when a jump or the scrubber moves it.",
        },
        {
            name: "now",
            type: "number",
            description: isJa
                ? "「いま」の位置。渡すと実時間かどうかの札と「いまへ戻る」が出ます。渡さなければどちらも出ません（部品は推測しません）。⚠️ 時刻は effect の中で読んでください。"
                : "The live edge. Pass it to get the live/detached chip and the return-to-now button; omit it and neither renders. ⚠️ Read your clock in an effect, not during render.",
        },
        {
            name: "live",
            type: "boolean",
            description: isJa
                ? "実時間かどうかを now から導かずに直接指定します。2つの数の差では言えない「実時間」（バッファのある配信など）に使います。"
                : "Force the live/detached state instead of deriving it from now — for cases the distance between two numbers cannot express.",
        },
        {
            name: "liveTolerance",
            type: "number",
            defaultValue: "1000",
            description: isJa
                ? "now からどれだけ離れるまでを実時間とみなすか。既定はエポックミリ秒での1秒です。"
                : "How close to now still counts as live. Default 1000 (one second at epoch ms).",
        },
        {
            name: "onReturnToNow",
            type: "() => void",
            description: isJa
                ? "「いまへ戻る」を押したとき。省略すると now と onValueChange から onValueChange(now) が既定で使われます。"
                : "Called by the return-to-now button. Defaults to onValueChange(now) when both are available.",
        },
        {
            name: "playing",
            type: "boolean",
            defaultValue: "false",
            description: isJa
                ? "再生中かどうか。制御されている値です（進めるのは呼び出し側）。"
                : "Whether playback is running. Controlled — the caller owns the ticking.",
        },
        {
            name: "onPlayingChange",
            type: "(playing: boolean) => void",
            description: isJa
                ? "再生・一時停止を押したとき。省略すると再生ボタンが出ません。"
                : "Fires with the requested play state. Omit to hide the play/pause button.",
        },
        {
            name: "speeds",
            type: "TimeTransportSpeed[]",
            description: isJa
                ? "速さの段。{ value, label } の配列で、名前は呼び出し側がつけます。省略すると速さの選択が出ません。"
                : "Named speed steps, { value, label }. Omit to hide the speed picker.",
        },
        {
            name: "speed / onSpeedChange",
            type: "number / (speed: number) => void",
            description: isJa
                ? "選ばれている速さと、その変更。speeds[].value と突き合わせます。"
                : "The selected speed and its change handler, matched against speeds[].value.",
        },
        {
            name: "jumps",
            type: "TimeTransportJump[]",
            description: isJa
                ? "決まった幅の飛ばし。offset は符号つきで、負が戻る方向です。負は左・正は右に並び、向きはアイコンが示します（ラベルは大きさだけ）。省略すると出ません。"
                : "Fixed jumps. offset is signed — negative goes back. Negatives render left, positives right, direction shown by icon; the label carries magnitude only. Omit to hide.",
        },
        {
            name: "formatValue",
            type: "(value: number) => ReactNode",
            description: isJa
                ? "大きい表示の書式。既定は String(value) なので、時刻として出すなら渡してください。"
                : "Formats the large readout. Defaults to String(value) — pass a formatter for dates.",
        },
        {
            name: "secondary",
            type: "ReactNode",
            description: isJa
                ? "表示の下の2行目（日付・タイムゾーン・経過など）。"
                : "The second line under the readout (a date, a time zone, an elapsed count).",
        },
        {
            name: "scrubber",
            type: "ReactNode",
            description: isJa
                ? "掴んで動かす面のスロット。表示と操作段のあいだに全幅で入ります（いちにちの帯はここに入ります）。"
                : "The scrub surface slot, rendered full width between the readout and the transport row.",
        },
        {
            name: "labels",
            type: "TimeTransportLabels",
            description: isJa
                ? "組み込みの文字列の差し替え（group / play / pause / speed / returnToNow / live / detached / jumpBack / jumpForward）。既定は英語です。"
                : "Overrides for every built-in string. Defaults are English.",
        },
        {
            name: "disabled",
            type: "boolean",
            defaultValue: "false",
            description: isJa ? "操作全体を無効にします。" : "Disable the whole transport.",
        },
    ];

    const nowRef = DEMO_EPOCH;

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Button", href: "/docs/components/button" },
                { name: "SegmentedControl", href: "/docs/components/segmented-control" },
                { name: "Switch", href: "/docs/components/switch" },
                { name: "Label", href: "/docs/components/label" },
            ]}
            relatedComponents={[
                { name: "Slider", href: "/docs/components/slider" },
                { name: "TimePicker", href: "/docs/components/time-picker" },
                { name: "Stringline", href: "/docs/components/stringline" },
                { name: "Timeline", href: "/docs/components/timeline" },
            ]}
        >
            <ComponentPreview
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                sectionLabels={sectionLabels}
                previewHeight="auto"
                previewBodyWidth="md"
            >
                <TimeTransportPlayground locale={locale as Locale} />
            </ComponentPreview>

            <DocNote
                variant="warning"
                heading={isJa ? "時計は持ちません。進めるのは呼び出し側です" : "It holds no clock — the caller owns the ticking"}
            >
                {isJa
                    ? "この部品の中に setInterval も requestAnimationFrame もありません。位置は value で受け取り、変化は onValueChange で返すだけです。時計を内側に持つと、サーバの描画と最初のクライアント描画が食い違い、試験でも時間を止められなくなります（Stringline と同じ決まり）。⚠️ 呼び出し側でも Date.now() は描画中ではなく effect の中で読んでください。"
                    : "There is no setInterval and no requestAnimationFrame inside this component. Position comes in through value and changes go out through onValueChange. A clock on the inside makes the server render and the first client render disagree, and makes time impossible to hold still in a test (the same rule as Stringline). ⚠️ In your own code, read Date.now() inside an effect, not during render."}
            </DocNote>

            <DocNote
                variant="note"
                heading={isJa ? "似た部品との境界" : "Where the neighbours stop"}
            >
                {isJa ? (
                    <ul className="ml-4 list-disc space-y-1">
                        <li>
                            <strong>Slider・RangeSlider</strong> — 値は選べますが、再生・速さ・いまへ戻るがありません。
                            単に値を1つ選ぶだけならこちらです。
                        </li>
                        <li>
                            <strong>TimePicker・DatePicker・Calendar</strong> — <strong>絶対の時刻を選ぶ</strong>もの。
                            「いまから相対に動かす」「動かし続ける」は表せません。
                        </li>
                        <li>
                            <strong>Timeline・Stringline・Gantt・SegmentTimelineCard</strong> — 時間を<strong>見せる</strong>
                            もので、操作は受け取りません。
                        </li>
                        <li>
                            <strong>SegmentedControl</strong> — 速さの段だけなら、これ単体で足ります。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-1">
                        <li>
                            <strong>Slider / RangeSlider</strong> — pick a value, but no playback, no speed, no return to
                            live. Use those when all you need is one value.
                        </li>
                        <li>
                            <strong>TimePicker / DatePicker / Calendar</strong> — pick an <strong>absolute</strong>{" "}
                            instant. They cannot express relative motion or continuous play.
                        </li>
                        <li>
                            <strong>Timeline / Stringline / Gantt / SegmentTimelineCard</strong> —{" "}
                            <strong>display</strong> time and take no input.
                        </li>
                        <li>
                            <strong>SegmentedControl</strong> — enough on its own if the speed steps are all you need.
                        </li>
                    </ul>
                )}
            </DocNote>

            <section className="space-y-4">
                <h2
                    className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0"
                    id="states"
                >
                    {isJa ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "live",
                            title: isJa ? "実時間" : "Live",
                            description: isJa
                                ? "value が now と同じとき。札が success の色と「実時間」の文字で出て、「いまへ戻る」は押せません（もう戻っているため）。"
                                : "value sits at now. The chip states it in words on the success tone, and return-to-now is disabled because there is nowhere to return to.",
                            preview: (
                                <StaticFrame locale={locale as Locale} value={nowRef} now={nowRef} />
                            ),
                            code: `<TimeTransport value={now} now={now} … />`,
                        },
                        {
                            key: "detached",
                            title: isJa ? "いまから外れている" : "Detached",
                            description: isJa
                                ? "value が now から離れているとき。札が warning の色と文字に変わり、「いまへ戻る」が押せるようになります。⭐ 大きい表示の色は変えていません（下の「設計の判断」）。"
                                : "value is away from now. The chip switches to the warning tone and wording, and return-to-now becomes available. ⭐ The readout itself is not recoloured (see Design decisions).",
                            preview: (
                                <StaticFrame
                                    locale={locale as Locale}
                                    value={nowRef - 5 * HOUR}
                                    now={nowRef}
                                />
                            ),
                            code: `<TimeTransport value={now - 5 * HOUR} now={now} … />`,
                        },
                        {
                            key: "playing",
                            title: isJa ? "再生中" : "Playing",
                            description: isJa
                                ? "再生ボタンが primary で押された状態（aria-pressed=\"true\"）になり、一時停止のアイコンに替わります。"
                                : "The play button is primary and pressed (aria-pressed=\"true\"), showing the pause icon.",
                            preview: (
                                <StaticFrame
                                    locale={locale as Locale}
                                    value={nowRef - 2 * HOUR}
                                    now={nowRef}
                                    playing
                                />
                            ),
                            code: `<TimeTransport playing onPlayingChange={setPlaying} … />`,
                        },
                        {
                            key: "no-jumps",
                            title: isJa ? "飛ばしなし" : "Without jumps",
                            description: isJa
                                ? "jumps を渡さなければ飛ばしボタンの列は出ません。速さと再生だけの、いちばん小さい形です。"
                                : "Omit jumps and the row disappears. The smallest useful shape is speed plus play.",
                            preview: (
                                <StaticFrame
                                    locale={locale as Locale}
                                    value={nowRef}
                                    now={nowRef}
                                    jumps={false}
                                />
                            ),
                            code: `<TimeTransport value={now} now={now} speeds={SPEEDS} … />`,
                        },
                        {
                            key: "disabled",
                            title: isJa ? "操作できない" : "Disabled",
                            description: isJa
                                ? "全体が無効。読み取り専用の盤や、まだ再生するものが決まっていないときに使います。"
                                : "The whole transport is off — a read-only board, or nothing selected to play yet.",
                            preview: (
                                <StaticFrame
                                    locale={locale as Locale}
                                    value={nowRef}
                                    now={nowRef}
                                    disabled
                                />
                            ),
                            code: `<TimeTransport disabled … />`,
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2
                    className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0"
                    id="props"
                >
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
                            <strong>速さは連続値ではなく、名前のついた段。</strong>
                            出どころの実装は 1× から 10⁷× の対数の連続値でしたが、それは天文のアプリ固有の刻みです。
                            部品は <code>speeds[]</code> で受け取ります。1× が1秒なのか1日なのかは、部品には分かりません。
                        </li>
                        <li>
                            <strong>大きい表示の色を、実時間かどうかで変えていません。</strong>
                            意味を示す3色は、カードの背景に文字色として置くとコントラストの基準に届きません（未解決の課題として
                            記録済み）。状態は札が文字で言っているので、色に頼る必要がありません。
                        </li>
                        <li>
                            <strong>向きはアイコンで、ラベルは大きさだけ。</strong>
                            <code>offset</code> の符号で左右に振り分け、向きはアイコンが示します。
                            ラベルに向きを書かせないので、そのまま多言語に出せます。
                        </li>
                        <li>
                            <strong>実時間かどうかが分からないときは、出さない。</strong>
                            <code>now</code> も <code>live</code> も渡されていなければ、札も「いまへ戻る」も出ません。
                            推測して間違った状態を見せるより、黙っているほうが正しいためです。
                        </li>
                        <li>
                            <strong>触れるところは 44px を割りません。</strong>
                            再生・飛ばし・いまへ戻るは、いずれも高さ 44px です。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Speeds are named steps, not a continuous range.</strong> The implementation this came
                            from used a logarithmic 1x–10⁷x range, but that scale belongs to one astronomy app. The
                            component takes <code>speeds[]</code> instead: it cannot know whether 1x means a second or a
                            day.
                        </li>
                        <li>
                            <strong>The readout is not recoloured when detached.</strong> The semantic tones do not reach
                            contrast as text on a card background (tracked as an open issue). The chip already states the
                            state in words, so nothing needs to lean on colour.
                        </li>
                        <li>
                            <strong>Direction is an icon; the label is the magnitude.</strong> The sign of{" "}
                            <code>offset</code> decides which side a jump lands on and which icon it gets, so labels
                            translate without carrying direction words.
                        </li>
                        <li>
                            <strong>When liveness is unknowable, nothing is shown.</strong> With neither{" "}
                            <code>now</code> nor <code>live</code>, the chip and the return button both stay out. Silence
                            beats a guessed state.
                        </li>
                        <li>
                            <strong>Touch targets stay at 44px.</strong> Play, the jumps and return-to-now are all 44px
                            tall.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
