"use client";

import * as React from "react";
import {
    IconBrightnessDown,
    IconDeviceMobileVibration,
    IconMan,
} from "@tabler/icons-react";
import { Button, Icon, Label, SegmentedControl, Slider, Toggle, cn } from "@gunjo/ui";

/**
 * Pattern demo: direction finder (docs/patterns/direction-finder).
 *
 * Guides a device towards a direction (azimuth) and a height (elevation).
 * The dial and the height arc are HTML/CSS (CLAUDE.md: variable data is not
 * drawn in SVG). The sensors are replaced by sliders so a reviewer can walk
 * through every state: searching, on target, before the target rises, a
 * poor compass reading, and a device with no compass.
 */

type Locale = "ja" | "en";
export type FinderCompass = "ok" | "inaccurate" | "none";
export type FinderPhase = "before" | "in-sky";

/** Where the target is. Before it rises, both point at the spot it first appears. */
const TARGET: Record<FinderPhase, { az: number; el: number; max: number }> = {
    before: { az: 247, el: 10, max: 60 },
    "in-sky": { az: 300, el: 49, max: 60 },
};

/** Azimuth difference that counts as on target. */
const HIT_AZ = 8;
/** Elevation: enter under 8°, stay on target until the gap exceeds 12°. */
const HIT_EL_IN = 8;
const HIT_EL_OUT = 12;

const DIRS: Record<Locale, string[]> = {
    ja: ["北", "北北東", "北東", "東北東", "東", "東南東", "南東", "南南東", "南", "南南西", "南西", "西南西", "西", "西北西", "北西", "北北西"],
    en: ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"],
};

export function dir16(az: number, locale: Locale) {
    return DIRS[locale][Math.round((((az % 360) + 360) % 360) / 22.5) % 16];
}

/** Signed difference folded into -180..180 (359° to 1° is 2°, not 358°). */
export function turnDelta(target: number, heading: number) {
    return ((target - heading + 540) % 360) - 180;
}

/** A fist at arm's length is about 10° wide. */
function fistWords(el: number, locale: Locale) {
    const n = Math.round(el / 10);
    if (el >= 80) return locale === "ja" ? "ほぼ真上" : "almost straight up";
    if (n <= 0) return locale === "ja" ? "地平線のすぐ上" : "just above the horizon";
    return locale === "ja"
        ? `腕を伸ばして、こぶし ${n} つぶん上`
        : `${n} ${n === 1 ? "fist" : "fists"} up at arm's length`;
}

const COPY = {
    ja: {
        title: "ISS を探す",
        close: "閉じる",
        countdown: "あと 8分39秒",
        inSky: "いま出ています",
        onTarget: "そこです",
        turn: (right: boolean, n: number) => `${right ? "右" : "左"}へ ${n} 度`,
        northUp: (dir: string) => `${dir}の方角（図は北が上）`,
        height: (before: boolean, el: number, fists: string) =>
            before ? `現れるのは地平線から ${el}°、${fists}` : `地平線から ${el}°、${fists}`,
        heightHit: "その高さです",
        tilt: (up: boolean, n: number) => `いまの構えから${up ? "上" : "下"}へ ${n}度`,
        zenith: "真上 90°",
        horizon: "地平線 0°",
        aim: "いまの構え",
        max: (n: number) => `最高 ${n}°`,
        foot: "現在地から。またたかない明るい点が、空を動いていきます。見えるのは約7分。",
        accuracy: "方位の誤差が大きくなっています（±35°）。端末を大きく8の字に動かしてください。磁石の付いたカバーやペンが近いとずれます。",
        dim: "暗く",
        dimLabel: "画面を暗くする",
        haptics: "ふるえ",
        hapticsLabel: "ふるえで知らせる",
        dialLabel: (target: string, heading: string) => `目標は${target}。端末は${heading}を向いています`,
        dialNorthUp: (target: string) => `目標は${target}。図は北が上です`,
        arcLabel: (el: number) => `目標の高さは地平線から ${el}°`,
        heading: "端末の向き",
        pitch: "端末の上端の角度",
        phase: "時刻",
        phaseBefore: "昇る前",
        phaseInSky: "見えている",
        compass: "方位",
        compassOk: "取れている",
        compassBad: "誤差が大きい",
        compassNone: "方位の無い端末",
        log: "触覚の記録",
        logEmpty: "向きや角度を合わせると、ここに震え方が出ます。",
        logAzIn: "方角が合った：重く1回",
        logAzOut: "方角から外れた：軽く2回",
        logElIn: "高さが合った：小刻みに3回",
        logQueued: "（0.35 秒あけて）",
        logOff: "ふるえがオフなので、震わせません。",
    },
    en: {
        title: "Find the ISS",
        close: "Close",
        countdown: "In 8 min 39 s",
        inSky: "Visible now",
        onTarget: "There it is",
        turn: (right: boolean, n: number) => `Turn ${right ? "right" : "left"} ${n}°`,
        northUp: (dir: string) => `Towards ${dir} (north is up)`,
        height: (before: boolean, el: number, fists: string) =>
            before ? `Appears ${el}° above the horizon, ${fists}` : `${el}° above the horizon, ${fists}`,
        heightHit: "That's the height",
        tilt: (up: boolean, n: number) => `Tilt ${up ? "up" : "down"} ${n}°`,
        zenith: "Overhead 90°",
        horizon: "Horizon 0°",
        aim: "Your aim",
        max: (n: number) => `Highest ${n}°`,
        foot: "From where you are. A bright point that doesn't twinkle, moving across the sky. Visible for about 7 minutes.",
        accuracy: "The compass is off by about ±35°. Move the device in a large figure eight. Magnets in a case or a pen nearby throw it off.",
        dim: "Dim",
        dimLabel: "Dim the screen",
        haptics: "Haptics",
        hapticsLabel: "Tell me by vibration",
        dialLabel: (target: string, heading: string) => `Target to the ${target}. The device faces ${heading}`,
        dialNorthUp: (target: string) => `Target to the ${target}. North is up`,
        arcLabel: (el: number) => `Target ${el}° above the horizon`,
        heading: "Device heading",
        pitch: "Angle of the top edge",
        phase: "Time",
        phaseBefore: "Before it rises",
        phaseInSky: "Visible",
        compass: "Compass",
        compassOk: "Good",
        compassBad: "Large error",
        compassNone: "No compass",
        log: "Haptics log",
        logEmpty: "Line up the direction or the height to see the vibration here.",
        logAzIn: "Direction on target: one heavy tap",
        logAzOut: "Direction lost: two light taps",
        logElIn: "Height on target: three quick taps",
        logQueued: " (0.35 s later)",
        logOff: "Haptics are off, so nothing vibrates.",
    },
} as const;

/* ---------- dial (direction) ---------- */

const DIAL = 224;
const DIAL_R = DIAL / 2 - 14;

function Dial({
    up,
    arrow,
    hit,
    locale,
    label,
}: {
    /** Bearing shown at the top of the dial (the device heading, or 0 for north-up). */
    up: number;
    /** Arrow angle relative to the top of the dial. */
    arrow: number;
    hit: boolean;
    locale: Locale;
    label: string;
}) {
    const cardinals = locale === "ja" ? ["北", "東", "南", "西"] : ["N", "E", "S", "W"];
    return (
        <div className="relative mx-auto shrink-0" style={{ width: DIAL, height: DIAL }} role="img" aria-label={label}>
            <div
                className={cn(
                    "absolute inset-[14px] rounded-full border",
                    hit ? "border-success" : "border-border"
                )}
            />
            {hit ? <div className="absolute inset-[9px] rounded-full border-2 border-success" /> : null}
            <div className="absolute inset-0" style={{ transform: `rotate(${-up}deg)` }}>
                {Array.from({ length: 24 }, (_, i) => {
                    const a = i * 15;
                    const major = a % 90 === 0;
                    return (
                        <span
                            key={a}
                            className={cn(
                                "absolute left-1/2 top-[14px]",
                                major ? "-ml-px h-[11px] w-[2px] bg-foreground/70" : "h-[5px] w-px bg-muted-foreground/60"
                            )}
                            style={{ transform: `rotate(${a}deg)`, transformOrigin: `50% ${DIAL_R}px` }}
                        />
                    );
                })}
                {cardinals.map((name, i) => (
                    <span
                        key={name}
                        className={cn(
                            "absolute left-1/2 top-1/2 text-xs font-semibold",
                            i === 0 ? "text-foreground" : "text-muted-foreground"
                        )}
                        style={{
                            transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(${-(DIAL_R - 24)}px) rotate(${-i * 90 + up}deg)`,
                        }}
                    >
                        {name}
                    </span>
                ))}
            </div>
            <div className="absolute inset-0" style={{ transform: `rotate(${arrow}deg)` }}>
                <span
                    className={cn("absolute left-1/2 -ml-[13px] h-[26px] w-[26px]", hit ? "bg-success" : "bg-warning")}
                    style={{ top: 18, clipPath: "polygon(50% 0, 100% 100%, 50% 74%, 0 100%)" }}
                />
                <span
                    className={cn("absolute left-1/2 -ml-[1.5px] w-[3px] rounded-full", hit ? "bg-success" : "bg-warning")}
                    style={{ top: 40, height: DIAL / 2 - 48 }}
                />
            </div>
        </div>
    );
}

/* ---------- arc (height) ---------- */

const ARC_W = 300;
const ARC_H = 170;
const OY = ARC_H - 26;
const R = Math.min(ARC_W - 90, OY - 24);
const OX = Math.round((ARC_W - R) / 2);

function point(deg: number, r = R) {
    const th = (Math.max(0, Math.min(90, deg)) * Math.PI) / 180;
    return { x: OX + Math.cos(th) * r, y: OY - Math.sin(th) * r };
}

function Ray({ deg, className, dashed }: { deg: number; className: string; dashed?: boolean }) {
    return (
        <span
            className={cn("absolute rounded-full", dashed ? "h-0 border-t-2 border-dashed" : "h-[3px]", className)}
            style={{
                left: OX,
                top: dashed ? OY - 1 : OY - 1.5,
                width: R,
                transformOrigin: "0 50%",
                transform: `rotate(${-Math.max(0, Math.min(90, deg))}deg)`,
            }}
        />
    );
}

function HeightArc({
    target,
    aim,
    max,
    hit,
    copy,
}: {
    target: number;
    aim: number | null;
    max: number | null;
    hit: boolean;
    copy: (typeof COPY)[Locale];
}) {
    const t = point(target);
    const m = max != null ? point(max) : null;
    const a = aim != null ? point(aim) : null;
    return (
        <div className="relative mx-auto" style={{ width: ARC_W, height: ARC_H }} role="img" aria-label={copy.arcLabel(target)}>
            <span
                className="absolute border-r border-t border-border"
                style={{ left: OX, top: OY - R, width: R, height: R, borderTopRightRadius: R }}
            />
            <span className="absolute h-px bg-muted-foreground/60" style={{ left: OX - 16, top: OY, width: R + 24 }} />
            <span className="absolute -translate-x-1/2 text-xs text-muted-foreground" style={{ left: OX, top: OY - R - 20 }}>
                {copy.zenith}
            </span>
            <span className="absolute -translate-x-full text-xs text-muted-foreground" style={{ left: OX + R + 8, top: OY + 6 }}>
                {copy.horizon}
            </span>
            <span className="absolute -translate-x-1/2 text-muted-foreground" style={{ left: OX, top: OY + 2 }}>
                <Icon icon={IconMan} size="sm" />
            </span>
            {m && max != null && max - target >= 4 ? (
                <>
                    <Ray deg={max} className="bg-warning/40" />
                    <span className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-warning/60" style={{ left: m.x, top: m.y }} />
                    <span className="absolute -translate-x-1/2 text-xs text-muted-foreground" style={{ left: m.x, top: m.y - 22 }}>
                        {copy.max(max)}
                    </span>
                </>
            ) : null}
            {a && aim != null ? (
                <>
                    <Ray deg={aim} dashed className="border-foreground/70" />
                    {Math.abs(aim - target) >= HIT_EL_IN ? (
                        <span className="absolute whitespace-nowrap text-xs text-foreground/80" style={{ left: a.x + 6, top: a.y - 8 }}>
                            {copy.aim}
                        </span>
                    ) : null}
                </>
            ) : null}
            <Ray deg={target} className={hit ? "bg-success" : "bg-warning"} />
            <span
                className={cn("absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full", hit ? "bg-success" : "bg-warning")}
                style={{ left: t.x, top: t.y }}
            />
            <span
                className={cn("absolute text-sm font-bold tabular-nums", hit ? "text-success" : "text-foreground")}
                style={{ left: t.x + 8, top: t.y - 22 }}
            >
                {target}°
            </span>
        </div>
    );
}

/* ---------- the screen ---------- */

export interface DirectionFinderDemoProps {
    locale: Locale;
    /** Show the sliders that stand in for the sensors. */
    controls?: boolean;
    heading?: number;
    pitch?: number;
    phase?: FinderPhase;
    compass?: FinderCompass;
}

export function DirectionFinderDemo({
    locale,
    controls = true,
    heading: initialHeading = 271,
    pitch: initialPitch = 2,
    phase: initialPhase = "before",
    compass: initialCompass = "ok",
}: DirectionFinderDemoProps) {
    const copy = COPY[locale];
    const [heading, setHeading] = React.useState(initialHeading);
    const [pitch, setPitch] = React.useState(initialPitch);
    const [phase, setPhase] = React.useState<FinderPhase>(initialPhase);
    const [compass, setCompass] = React.useState<FinderCompass>(initialCompass);
    // Dim always starts off (a dimmed screen opened in daylight shows nothing).
    const [dim, setDim] = React.useState(false);
    const [haptics, setHaptics] = React.useState(true);
    const [log, setLog] = React.useState<string[]>([]);

    const target = TARGET[phase];
    const hasCompass = compass !== "none";
    const delta = hasCompass ? turnDelta(target.az, heading) : target.az;
    const hitAz = hasCompass && Math.abs(delta) < HIT_AZ;
    const aim = hasCompass ? pitch : null;
    const dEl = aim == null ? null : target.el - aim;

    // Elevation keeps a memory: once on target it stays until the gap exceeds 12°.
    const [hitEl, setHitEl] = React.useState(false);
    const nextHitEl = dEl == null ? false : Math.abs(dEl) < (hitEl ? HIT_EL_OUT : HIT_EL_IN);
    if (nextHitEl !== hitEl) setHitEl(nextHitEl);

    // Haptics fire on change only, never every frame.
    const prevAz = React.useRef<boolean | null>(null);
    const prevEl = React.useRef<boolean | null>(null);
    React.useEffect(() => {
        const events: string[] = [];
        if (prevAz.current !== null && hasCompass && hitAz !== prevAz.current) {
            events.push(hitAz ? copy.logAzIn : copy.logAzOut);
        }
        prevAz.current = hasCompass ? hitAz : null;
        // Losing the height is silent: a hand-held aim wobbles in and out.
        if (prevEl.current === false && hitEl) events.push(copy.logElIn + (events.length ? copy.logQueued : ""));
        prevEl.current = dEl == null ? null : hitEl;
        if (events.length) {
            setLog((old) => [...(haptics ? events : [copy.logOff]), ...old].slice(0, 3));
        }
    }, [hitAz, hitEl, dEl, hasCompass, haptics, copy]);

    const say = !hasCompass
        ? copy.northUp(dir16(target.az, locale))
        : hitAz
          ? copy.onTarget
          : copy.turn(delta > 0, Math.round(Math.abs(delta)));

    return (
        <div className="flex w-full flex-col items-center gap-5 md:flex-row md:items-start md:justify-center">
            <div
                className="relative flex w-full max-w-[360px] shrink-0 flex-col items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card px-4 pb-4 pt-3 text-card-foreground transition-[filter]"
                style={dim ? { filter: "brightness(0.4)" } : undefined}
            >
                <div className="flex w-full items-center justify-between">
                    <span className="text-sm text-muted-foreground">{copy.title}</span>
                    <Button variant="outline" size="sm" className="rounded-full">
                        {copy.close}
                    </Button>
                </div>
                <p className="text-xl font-bold tabular-nums">{phase === "before" ? copy.countdown : copy.inSky}</p>
                <Dial
                    up={hasCompass ? heading : 0}
                    arrow={delta}
                    hit={hitAz}
                    locale={locale}
                    label={
                        hasCompass
                            ? copy.dialLabel(dir16(target.az, locale), dir16(heading, locale))
                            : copy.dialNorthUp(dir16(target.az, locale))
                    }
                />
                <p className={cn("text-2xl font-bold tabular-nums", hitAz && "text-success")} aria-live="polite">
                    {say}
                </p>
                <div className="h-px w-4/5 bg-border" />
                <HeightArc
                    target={target.el}
                    aim={aim}
                    max={phase === "before" ? target.max : target.max > target.el ? target.max : null}
                    hit={hitEl}
                    copy={copy}
                />
                <div className="space-y-1 text-center">
                    <p className="text-sm">{copy.height(phase === "before", target.el, fistWords(target.el, locale))}</p>
                    {dEl != null ? (
                        <p className={cn("text-sm", hitEl ? "font-semibold text-success" : "text-muted-foreground")}>
                            {hitEl ? copy.heightHit : copy.tilt(dEl > 0, Math.round(Math.abs(dEl)))}
                        </p>
                    ) : null}
                </div>
                <p className="px-2 text-center text-xs leading-relaxed text-muted-foreground">
                    {copy.foot}
                    {compass === "inaccurate" ? (
                        <span className="mt-1 block font-medium text-warning-subtle-foreground">{copy.accuracy}</span>
                    ) : null}
                </p>
                <div className="flex w-full items-end justify-between">
                    <Toggle
                        pressed={dim}
                        onPressedChange={setDim}
                        aria-label={copy.dimLabel}
                        variant="outline"
                        className="h-14 w-14 flex-col gap-0.5 rounded-full text-[11px]"
                    >
                        <Icon icon={IconBrightnessDown} size="sm" />
                        {copy.dim}
                    </Toggle>
                    <Toggle
                        pressed={haptics}
                        onPressedChange={setHaptics}
                        aria-label={copy.hapticsLabel}
                        variant="outline"
                        className="h-14 w-14 flex-col gap-0.5 rounded-full text-[11px]"
                    >
                        <Icon icon={IconDeviceMobileVibration} size="sm" />
                        {copy.haptics}
                    </Toggle>
                </div>
            </div>

            {controls ? (
                <div className="w-full max-w-[320px] space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="direction-finder-heading">{copy.heading}</Label>
                        <Slider
                            id="direction-finder-heading"
                            min={0}
                            max={359}
                            value={heading}
                            onValueChange={setHeading}
                            disabled={!hasCompass}
                            showValue
                            formatValue={(v) => (locale === "ja" ? `${v}°（${dir16(v, locale)}）` : `${v}° ${dir16(v, locale)}`)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="direction-finder-pitch">{copy.pitch}</Label>
                        <Slider
                            id="direction-finder-pitch"
                            min={-30}
                            max={90}
                            value={pitch}
                            onValueChange={setPitch}
                            disabled={!hasCompass}
                            showValue
                            formatValue={(v) => `${v}°`}
                        />
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium">{copy.phase}</p>
                        <SegmentedControl
                            aria-label={copy.phase}
                            size="sm"
                            value={phase}
                            onValueChange={(v) => setPhase(v as FinderPhase)}
                            options={[
                                { value: "before", label: copy.phaseBefore },
                                { value: "in-sky", label: copy.phaseInSky },
                            ]}
                        />
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium">{copy.compass}</p>
                        <SegmentedControl
                            aria-label={copy.compass}
                            size="sm"
                            value={compass}
                            onValueChange={(v) => setCompass(v as FinderCompass)}
                            options={[
                                { value: "ok", label: copy.compassOk },
                                { value: "inaccurate", label: copy.compassBad },
                                { value: "none", label: copy.compassNone },
                            ]}
                        />
                    </div>
                    <div className="space-y-1 rounded-lg bg-muted/50 p-3" aria-live="polite">
                        <p className="text-xs font-medium text-muted-foreground">{copy.log}</p>
                        {log.length ? (
                            <ul className="space-y-0.5 text-sm">
                                {log.map((line, i) => (
                                    <li key={`${i}-${line}`} className={i === 0 ? "text-foreground" : "text-muted-foreground"}>
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">{copy.logEmpty}</p>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
