"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PassPathFigure } from "@/components/doc/PatternFigures";
import { PropsTable } from "@/components/doc/PropsTable";
import { DirectionFinderDemo } from "@/components/demos/DirectionFinderPatternDemo";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DocNote, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gunjo/ui";

type Locale = "ja" | "en";

/* Pattern page, not a component page: nothing here is exported from
   @gunjo/ui (KeEem, 2026-09-19). The page follows the component-page layout
   so readers find the same sections in the same order. */

const HELPERS_JA = `// 方角の差を -180〜180 に畳む（359° と 1° の差は 2°）
function turnDelta(target: number, heading: number) {
  return ((target - heading + 540) % 360) - 180;
}`;

const HELPERS_EN = `// Fold the difference into -180..180 (359° to 1° is 2°)
function turnDelta(target: number, heading: number) {
  return ((target - heading + 540) % 360) - 180;
}`;

const USAGE_JA = `"use client";

import * as React from "react";
import { Label, Slider } from "@gunjo/ui";

// 方角の差を -180〜180 に畳む（359° と 1° の差は 2°）
function turnDelta(target: number, heading: number) {
  return ((target - heading + 540) % 360) - 180;
}

const TARGET = { az: 247, el: 10 }; // 目標の方位と、地平線からの高さ
const HIT = 8; // 合ったとみなす差
const KEEP = 12; // 高さは、いったん合ったらこの差まで合ったまま

// 震えは順に出す。同時に出すと1回に感じる
let freeAt = 0;
function buzz(pattern: number[]) {
  const now = performance.now();
  const at = Math.max(now, freeAt);
  freeAt = at + pattern.reduce((a, b) => a + b, 0) + 350;
  setTimeout(() => navigator.vibrate?.(pattern), at - now);
}

export function DirectionGuide() {
  // 実機では DeviceOrientationEvent から入れる
  const [heading, setHeading] = React.useState(271);
  const [pitch, setPitch] = React.useState(2);

  const delta = turnDelta(TARGET.az, heading);
  const onAz = Math.abs(delta) < HIT;
  const dEl = TARGET.el - pitch;
  const [onEl, setOnEl] = React.useState(false);
  const nextOnEl = Math.abs(dEl) < (onEl ? KEEP : HIT);
  if (nextOnEl !== onEl) setOnEl(nextOnEl);

  const azRef = React.useRef<boolean | null>(null);
  const elRef = React.useRef(false);
  React.useEffect(() => {
    if (azRef.current !== null && onAz !== azRef.current) {
      buzz(onAz ? [30] : [10, 90, 10]); // 重く1回／軽く2回
    }
    azRef.current = onAz;
    if (!elRef.current && onEl) buzz([12, 33, 12, 33, 12]); // 小刻みに3回
    elRef.current = onEl;
  }, [onAz, onEl]);

  return (
    <div className="space-y-4">
      <p className="text-2xl font-bold">
        {onAz ? "そこです" : \`\${delta > 0 ? "右" : "左"}へ \${Math.round(Math.abs(delta))} 度\`}
      </p>
      <p>
        {onEl ? "その高さです" : \`いまの構えから\${dEl > 0 ? "上" : "下"}へ \${Math.round(Math.abs(dEl))}度\`}
      </p>
      <Label htmlFor="heading">端末の向き</Label>
      <Slider id="heading" min={0} max={359} value={heading} onValueChange={setHeading} />
      <Label htmlFor="pitch">端末の上端の角度</Label>
      <Slider id="pitch" min={-30} max={90} value={pitch} onValueChange={setPitch} />
    </div>
  );
}`;

const USAGE_EN = `"use client";

import * as React from "react";
import { Label, Slider } from "@gunjo/ui";

// Fold the difference into -180..180 (359° to 1° is 2°)
function turnDelta(target: number, heading: number) {
  return ((target - heading + 540) % 360) - 180;
}

const TARGET = { az: 247, el: 10 }; // target bearing and height above the horizon
const HIT = 8; // difference that counts as on target
const KEEP = 12; // once on target, height stays on until this gap

// Queue vibrations; two at once feel like one
let freeAt = 0;
function buzz(pattern: number[]) {
  const now = performance.now();
  const at = Math.max(now, freeAt);
  freeAt = at + pattern.reduce((a, b) => a + b, 0) + 350;
  setTimeout(() => navigator.vibrate?.(pattern), at - now);
}

export function DirectionGuide() {
  // On a device these come from DeviceOrientationEvent
  const [heading, setHeading] = React.useState(271);
  const [pitch, setPitch] = React.useState(2);

  const delta = turnDelta(TARGET.az, heading);
  const onAz = Math.abs(delta) < HIT;
  const dEl = TARGET.el - pitch;
  const [onEl, setOnEl] = React.useState(false);
  const nextOnEl = Math.abs(dEl) < (onEl ? KEEP : HIT);
  if (nextOnEl !== onEl) setOnEl(nextOnEl);

  const azRef = React.useRef<boolean | null>(null);
  const elRef = React.useRef(false);
  React.useEffect(() => {
    if (azRef.current !== null && onAz !== azRef.current) {
      buzz(onAz ? [30] : [10, 90, 10]); // one heavy / two light
    }
    azRef.current = onAz;
    if (!elRef.current && onEl) buzz([12, 33, 12, 33, 12]); // three quick
    elRef.current = onEl;
  }, [onAz, onEl]);

  return (
    <div className="space-y-4">
      <p className="text-2xl font-bold">
        {onAz ? "There it is" : \`Turn \${delta > 0 ? "right" : "left"} \${Math.round(Math.abs(delta))}°\`}
      </p>
      <p>
        {onEl ? "That's the height" : \`Tilt \${dEl > 0 ? "up" : "down"} \${Math.round(Math.abs(dEl))}°\`}
      </p>
      <Label htmlFor="heading">Device heading</Label>
      <Slider id="heading" min={0} max={359} value={heading} onValueChange={setHeading} />
      <Label htmlFor="pitch">Angle of the top edge</Label>
      <Slider id="pitch" min={-30} max={90} value={pitch} onValueChange={setPitch} />
    </div>
  );
}`;

function stateCode(ja: boolean, name: string, body: string) {
    return `${ja ? HELPERS_JA : HELPERS_EN}

export function ${name}() {
${body}
}`;
}

export default function DirectionFinderPatternPage() {
    const { locale, sectionLabels } = useLocale();
    const ja = locale === "ja";
    const l = locale as Locale;
    const usageCode = ja ? USAGE_JA : USAGE_EN;

    const title = ja ? "方角と高さの案内" : "Direction finder";
    const description = ja
        ? "端末を、空の決まった方角と高さへ向けてもらう画面の事例です。上の文字盤で方角を、下の弧で見上げる高さを案内します。状態ごとに何をどう伝えるかをまとめた事例です。"
        : "A pattern for guiding a device to a set direction and height in the sky. The dial above gives the direction; the arc below gives how high to look. It sets out what to say in each state.";

    const propsData = ja
        ? [
              { name: "方角の合う差", type: "°", default: "8", description: "差がこれ未満で「そこです」。以上で外れ。" },
              { name: "高さの合う差", type: "°", default: "8", description: "差がこれ未満で「その高さです」。" },
              { name: "高さの外れる差", type: "°", default: "12", description: "いったん合ったら、差がこれを超えるまで合ったまま。" },
              { name: "誤差の一言を出す幅", type: "°", default: "±20", description: "方位の誤差がこれを超えたときだけ出す。" },
              { name: "震えのあいだ", type: "秒", default: "0.35", description: "方角と高さが同時に合ったとき、2つめまで待つ時間。" },
              { name: "こぶし1つ", type: "°", default: "10", description: "腕を伸ばしたこぶし1つの幅。高さを言葉にするときに使う。" },
          ]
        : [
              { name: "Direction hit", type: "°", default: "8", description: "Under this, “There it is”. At or over, lost." },
              { name: "Height hit", type: "°", default: "8", description: "Under this, “That's the height”." },
              { name: "Height release", type: "°", default: "12", description: "Once on, height stays on until the gap exceeds this." },
              { name: "Compass warning", type: "°", default: "±20", description: "Show the note only when the error exceeds this." },
              { name: "Vibration gap", type: "s", default: "0.35", description: "Wait between two vibrations that fire together." },
              { name: "One fist", type: "°", default: "10", description: "A fist at arm's length; used to put height into words." },
          ];

    const haptics = ja
        ? [
              ["方角が合った", "重く1回"],
              ["方角から外れた", "軽く2回"],
              ["高さが合った", "小刻みに3回"],
          ]
        : [
              ["Direction on target", "One heavy tap"],
              ["Direction lost", "Two light taps"],
              ["Height on target", "Three quick taps"],
          ];

    return (
        <ComponentLayout
            title={title}
            description={description}
            sectionLabels={sectionLabels}
            uixheroLinks={[
                {
                    label: ja ? "方角と高さの案内の記事（#1001）" : "Article on the direction finder (#1001)",
                    href: "https://github.com/uixhero/gunjo/issues/1001",
                    relation: "unwritten",
                },
            ]}
            usedComponents={[
                { name: "Slider", href: "/docs/components/slider" },
                { name: "SegmentedControl", href: "/docs/components/segmented-control" },
                { name: "Toggle", href: "/docs/components/toggle" },
                { name: "Button", href: "/docs/components/button" },
                { name: "Icon", href: "/docs/components/icon" },
            ]}
            relatedComponents={[
                {
                    name: "MapControlButton",
                    href: "/docs/components/map-control-button",
                    boundary: ja ? "地図の上の丸いボタン。端末の向きは案内しない。" : "Round buttons on a map; no guidance on where to point.",
                },
                {
                    name: "ScaleBar",
                    href: "/docs/components/scale-bar",
                    boundary: ja ? "地図の縮尺を見せる。空の方角や高さは扱わない。" : "Shows map scale, not a bearing or a height.",
                },
                {
                    name: "Toast",
                    href: "/docs/components/toast",
                    boundary: ja ? "一瞬で消える知らせ。合ったことは字と震えで出し続ける。" : "A passing notice; here the hit stays in words and vibration.",
                },
            ]}
        >
            <ComponentPreview
                code={usageCode}
                codeBlock={<CodeBlock code={usageCode} />}
                sectionLabels={sectionLabels}
                embedSrc="/embed/direction-finder"
                previewBodyWidth="lg"
            >
                <DirectionFinderDemo locale={l} />
            </ComponentPreview>

            <DocNote variant="note" heading={ja ? "どこで使えるか" : "Where it applies"}>
                {ja
                    ? "端末を実物の向きに合わせる作業なら、どれにも使えます。たとえば、衛星や星を探す、アンテナやパラボラの向きを合わせる、太陽光パネルの角度を決める、方位を合わせて写真を撮る、といった作業です。この例では、夜空を横切る ISS（国際宇宙ステーション）を探します。"
                    : "Any task where a device is lined up with a real direction: finding a satellite or a star, pointing an antenna or a dish, setting a solar panel's angle, lining up a photo by bearing. The example looks for the ISS (the International Space Station) crossing the night sky."}
            </DocNote>

            <section className="space-y-4">
                <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {ja ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "searching",
                            title: ja ? "探している" : "Searching",
                            description: ja
                                ? "文字盤は、端末がいま向いている方角を上にして回ります。矢印は目標の方角を指し、下に「左へ 24 度」と、回る向きと角度を言葉で出します。高さは「いまの構えから上へ 8度」と出します。"
                                : "The dial turns so the device's heading is at the top. The arrow points at the target, and the words say which way and how far: “Turn left 24°”. Height reads “Tilt up 8°”.",
                            preview: <DirectionFinderDemo locale={l} controls={false} phase="in-sky" heading={324} pitch={41} />,
                            previewHeight: "auto",
                            code: stateCode(
                                ja,
                                "Searching",
                                ja
                                    ? `  const delta = turnDelta(300, 324); // 目標は西北西、端末は北西
  const n = Math.round(Math.abs(delta));
  return <p className="text-2xl font-bold">{delta > 0 ? "右" : "左"}へ {n} 度</p>;`
                                    : `  const delta = turnDelta(300, 324); // target WNW, device facing NW
  const n = Math.round(Math.abs(delta));
  return <p className="text-2xl font-bold">Turn {delta > 0 ? "right" : "left"} {n}°</p>;`
                            ),
                        },
                        {
                            key: "on-target",
                            title: ja ? "合った" : "On target",
                            description: ja
                                ? "方角の差が 8° 未満になると「そこです」と出し、矢印と文字盤の外周を緑にします。高さは差が 8° 未満で「その高さです」と出し、弧の線を緑にします。高さだけは、いったん合ったら差が 12° を超えるまで合ったままとします。構えた手の揺れで、合う・外れるを細かく繰り返さないためです。方角と高さは別々に判定し、別々の行に出します。1つの緑で両方を表すと、どちらが合ったのか分からなくなるためです。"
                                : "Under 8° off, it says “There it is” and the arrow and the dial's rim turn green. Height under 8° off says “That's the height” and its line turns green. Height alone, once on, stays on until the gap passes 12°, so a shaky hand doesn't flick it on and off. Direction and height are judged and shown separately; one green for both would not say which one is right.",
                            preview: <DirectionFinderDemo locale={l} controls={false} phase="in-sky" heading={302} pitch={47} />,
                            previewHeight: "auto",
                            code: stateCode(
                                ja,
                                "OnTarget",
                                ja
                                    ? `  const onAz = Math.abs(turnDelta(300, 302)) < 8;
  const onEl = Math.abs(49 - 47) < 8;
  return (
    <div className="text-center text-success">
      <p className="text-2xl font-bold">{onAz ? "そこです" : ""}</p>
      <p>{onEl ? "その高さです" : ""}</p>
    </div>
  );`
                                    : `  const onAz = Math.abs(turnDelta(300, 302)) < 8;
  const onEl = Math.abs(49 - 47) < 8;
  return (
    <div className="text-center text-success">
      <p className="text-2xl font-bold">{onAz ? "There it is" : ""}</p>
      <p>{onEl ? "That's the height" : ""}</p>
    </div>
  );`
                            ),
                        },
                        {
                            key: "before",
                            title: ja ? "目標が昇る前" : "Before it rises",
                            description: ja
                                ? "画面上部の見出しに残り時間を「あと 8分39秒」と出します。1時間より先なら「9/21 18:40 ごろ（2日後）」のように、日時と、あと何時間か何日かを出します。矢印と弧は、目標が最初に見えてくる方角と高さを指します。そこへ端末を向けて待てば、出てきた目標をそのまま追えます。いちばん高く昇るときの高さは、弧に薄い線と「最高 60°」で添えるだけにします。"
                                : "The heading at the top counts down: “In 8 min 39 s”. More than an hour out, it gives the date and time and how many hours or days away. The arrow and arc point where the target first appears; aim there and wait, and you can follow it as soon as it shows. The highest point is only a faint line on the arc, marked “Highest 60°”.",
                            preview: <DirectionFinderDemo locale={l} controls={false} />,
                            previewHeight: "auto",
                            code: stateCode(
                                ja,
                                "Countdown",
                                ja
                                    ? `  const rise = Date.now() + 519_000; // 目標が見え始める時刻
  const sec = Math.round((rise - Date.now()) / 1000);
  const label =
    sec > 86_400 ? \`\${Math.round(sec / 86_400)}日後\`
    : sec > 3_600 ? \`\${Math.round(sec / 3_600)}時間後\`
    : \`あと \${Math.floor(sec / 60)}分\${String(sec % 60).padStart(2, "0")}秒\`;
  return <p className="text-xl font-bold">{label}</p>;`
                                    : `  const rise = Date.now() + 519_000; // when the target first appears
  const sec = Math.round((rise - Date.now()) / 1000);
  const label =
    sec > 86_400 ? \`in \${Math.round(sec / 86_400)} days\`
    : sec > 3_600 ? \`in \${Math.round(sec / 3_600)} hours\`
    : \`In \${Math.floor(sec / 60)} min \${sec % 60} s\`;
  return <p className="text-xl font-bold">{label}</p>;`
                            ),
                        },
                        {
                            key: "inaccurate",
                            title: ja ? "方位の誤差が大きい" : "Poor compass reading",
                            description: ja
                                ? "端末が返す方位の誤差が ±20° を超えたときだけ、下に一言出します。「端末を大きく8の字に動かしてください。磁石の付いたカバーやペンが近いとずれます」。ふだんでも 10〜15° の誤差はあるので、いつも出すと誰も読まなくなります。"
                                : "Only when the reported error passes ±20° does a line appear: move the device in a large figure eight; magnets in a case or a pen throw it off. An error of 10–15° is normal, and a note that is always there stops being read.",
                            preview: <DirectionFinderDemo locale={l} controls={false} compass="inaccurate" />,
                            previewHeight: "auto",
                            code: stateCode(
                                ja,
                                "CompassNote",
                                ja
                                    ? `  // iOS Safari は DeviceOrientationEvent の webkitCompassAccuracy に誤差を入れる（負なら取れていない）
  const accuracy = 35;
  if (accuracy >= 0 && accuracy <= 20) return null;
  return (
    <p className="text-sm text-warning-subtle-foreground">
      端末を大きく8の字に動かしてください。磁石の付いたカバーやペンが近いとずれます。
    </p>
  );`
                                    : `  // iOS Safari reports it as webkitCompassAccuracy on DeviceOrientationEvent (negative = unknown)
  const accuracy = 35;
  if (accuracy >= 0 && accuracy <= 20) return null;
  return (
    <p className="text-sm text-warning-subtle-foreground">
      Move the device in a large figure eight. Magnets in a case or a pen nearby throw it off.
    </p>
  );`
                            ),
                        },
                        {
                            key: "no-compass",
                            title: ja ? "方位を測れない端末" : "No compass",
                            description: ja
                                ? "パソコンのように方位を測れない端末では、文字盤を北が上の図にして、「西南西の方角（図は北が上）」と言葉で伝えます。端末の向きが分からないので、「合った」はありません。"
                                : "On a device with no compass, such as a laptop, the dial becomes a north-up map and the words give the bearing: “Towards WSW (north is up)”. With no heading there is no “on target”.",
                            preview: <DirectionFinderDemo locale={l} controls={false} compass="none" />,
                            previewHeight: "auto",
                            code: stateCode(
                                ja,
                                "NorthUp",
                                ja
                                    ? `  const dirs = ["北", "北北東", "北東", "東北東", "東", "東南東", "南東", "南南東",
                "南", "南南西", "南西", "西南西", "西", "西北西", "北西", "北北西"];
  const dir = dirs[Math.round(247 / 22.5) % 16]; // 247° = WSW
  return <p className="text-2xl font-bold">{dir}の方角（図は北が上）</p>;`
                                    : `  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const dir = dirs[Math.round(247 / 22.5) % 16]; // 247° = WSW
  return <p className="text-2xl font-bold">Towards {dir} (north is up)</p>;`
                            ),
                        },
                    ]}
                />
                <PassPathFigure locale={l} />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight" id="haptics">
                    {ja ? "触覚" : "Haptics"}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {ja
                        ? "外では画面より空を見ています。合ったかどうかを、端末の震え方だけで分かるようにします。"
                        : "Outside, eyes are on the sky, not the screen. The vibration alone should say whether you are on target."}
                </p>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{ja ? "いつ" : "When"}</TableHead>
                            <TableHead>{ja ? "震え方" : "Vibration"}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {haptics.map(([when, how]) => (
                            <TableRow key={when}>
                                <TableCell>{when}</TableCell>
                                <TableCell>{how}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                    {(ja
                        ? [
                              "震わせるのは、合った瞬間と外れた瞬間だけです。画面は1秒に60回描き直すので、そのたびに震わせると1本の長い震えになります。",
                              "強さは手で持っていると区別しにくいので、回数で見分けられるようにします。",
                              "方角と高さが同時に合ったら、0.35 秒あけて順に震わせます。同時に出すと、1回の震えと区別できません。",
                              "高さは、外れたときには震わせません。手の揺れで何度も震えるのを避けるためです。",
                          ]
                        : [
                              "Vibrate only at the moment it goes on or off target. The screen redraws 60 times a second; vibrating on each would blur into one long buzz.",
                              "Strength is hard to tell apart in the hand, so the count carries the meaning.",
                              "If direction and height land together, the second waits 0.35 s. Two at once feel like one.",
                              "Losing the height is silent, or a shaky hand would set it off again and again.",
                          ]
                    ).map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight" id="outdoors">
                    {ja ? "外で使う前提" : "Built for outdoors"}
                </h2>
                <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                    {(ja
                        ? [
                              "画面を暗くするボタンと、震えのボタンを、下の左右の隅に置きます。端末を持った手の親指で押せる位置です。",
                              "暗くする設定は、開くたびにオフから始めます。暗いまま閉じると、次に明るい場所で開いたとき何も見えません。震えの設定は覚えます。",
                              "探しているあいだは、画面が自動で消えないようにします（ブラウザでは Screen Wake Lock API）。閉じるときは、画面の明るさを暗くする前に戻します。",
                              "高さは度数だけでなく、「地平線から、腕を伸ばしてこぶし 5 つぶん上」とも言います。腕を伸ばしたこぶし1つの幅が、およそ 10° です。",
                              "閉じるボタンは × だけにせず、「閉じる」と書いて大きく取ります。暗い屋外で押すためです。",
                          ]
                        : [
                              "The dim and vibration buttons sit in the bottom corners, where the thumb of the holding hand reaches.",
                              "Dimming starts off every time it opens. Closed while dim, it would open to a black screen somewhere bright. The vibration setting is remembered.",
                              "While searching, the screen does not sleep (Screen Wake Lock API in a browser). On close, the brightness goes back to what it was.",
                              "Height is given in fists as well as degrees: “5 fists up from the horizon at arm's length”. A fist at arm's length is about 10°.",
                              "Close is a large button that says “Close”, not just ×, because it is pressed in the dark.",
                          ]
                    ).map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
                    {ja ? "決めている値" : "Values"}
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
                        {ja ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                    {(ja
                        ? [
                              "方角は文字盤、高さは弧と、絵を分けています。空を上から見た地図に両方を載せると、見る人が頭の中で向きを合わせ直す必要があります。",
                              "高さの絵には、地面に立つ人・地平線（0°）・真上（90°）を描きます。数字だけだと、目線からの角度か、端末の傾きかが分かりません。",
                              "文字盤の上を北にしないのは、外では自分の体の向きが基準になるためです。",
                          ]
                        : [
                              "Direction and height are two pictures: a dial and an arc. Putting both on a top-down sky map makes the reader rotate it in their head.",
                              "The height picture shows a standing person, the horizon (0°) and overhead (90°). A bare number leaves it unclear whether it is from the eye line or the device's tilt.",
                              "The dial is not north-up because outdoors the body's own facing is the reference.",
                          ]
                    ).map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>
        </ComponentLayout>
    );
}
