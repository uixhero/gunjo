"use client";

import * as React from "react";
import {
    ActionProgress,
    Badge,
    Button,
    FormActionProgress,
    Input,
    Label,
    ProgressDialog,
    RouteProgress,
    Switch,
} from "@gunjo/ui";
import { useLocale } from "@/components/providers/LocaleProvider";

/**
 * Demos for ProgressDialog / ActionProgress / RouteProgress (#996).
 * They run inside /embed/* iframes, so each modal covers the iframe viewport
 * the same way it covers a real page. The copyable code on each docs page
 * mirrors these functions.
 */

/** Flips the app-level reduce-motion hook the components read (`data-motion="reduce"`). */
export function ReduceMotionSwitch({
    id,
    checked,
    onCheckedChange,
}: {
    id: string;
    checked?: boolean;
    onCheckedChange?: (value: boolean) => void;
}) {
    const { locale } = useLocale();
    const [own, setOwn] = React.useState(false);
    const reduce = checked ?? own;
    const setReduce = onCheckedChange ?? setOwn;

    React.useEffect(() => {
        const root = document.documentElement;
        if (reduce) root.dataset.motion = "reduce";
        else delete root.dataset.motion;
        return () => {
            delete root.dataset.motion;
        };
    }, [reduce]);

    return (
        <div className="flex items-center gap-2">
            <Switch id={id} checked={reduce} onCheckedChange={setReduce} />
            <Label htmlFor={id}>{locale === "ja" ? "動きを減らす" : "Reduce motion"}</Label>
        </div>
    );
}

/** Sample scenes for ProgressDialog (copied from the generation-splash SVG samples, #762). */
const SCENE = {
    minutes: "/demos/progress-dialog/meeting-minutes.svg",
    minutesStill: "/demos/progress-dialog/meeting-minutes-still.svg",
    trip: "/demos/progress-dialog/trip-plan.svg",
    tripStill: "/demos/progress-dialog/trip-plan-still.svg",
};

/** An animated scene that swaps to its still frame under reduced motion (OS setting, or `still`). */
function Scene({ src, stillSrc, still = false }: { src: string; stillSrc: string; still?: boolean }) {
    return (
        <picture>
            <source media="(prefers-reduced-motion: reduce)" srcSet={stillSrc} />
            <img src={still ? stillSrc : src} alt="" />
        </picture>
    );
}

export type ProgressDialogDemoVariant = "default" | "aside" | "known" | "no-cancel";

/** Mirrors the usage snippet: caller-driven steps, a cancel, and a result line. */
function ProgressDialogStepsDemo({ still = false, autoStart = true }: { still?: boolean; autoStart?: boolean }) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const steps = isJa
        ? ["会議の前提を読み取っています", "発言を要点に分けています", "議事録の形に整えています"]
        : ["Reading the meeting context", "Sorting remarks into points", "Shaping the minutes"];

    const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
    const [open, setOpen] = React.useState(false);
    const [step, setStep] = React.useState(0);
    const [result, setResult] = React.useState("");
    const timer = React.useRef<number | null>(null);

    const stop = React.useCallback(() => {
        if (timer.current !== null) window.clearInterval(timer.current);
        timer.current = null;
    }, []);

    const start = React.useCallback(() => {
        stop();
        setStep(0);
        setResult("");
        setOpen(true);
        let current = 0;
        timer.current = window.setInterval(() => {
            current += 1;
            if (current >= steps.length) {
                stop();
                setOpen(false);
                setResult(isJa ? "議事録ができました。" : "The minutes are ready.");
                return;
            }
            setStep(current);
        }, 2200);
    }, [isJa, steps.length, stop]);

    // Open from the start; the dialog is what this demo shows.
    React.useEffect(() => {
        if (autoStart) start();
        return stop;
    }, [autoStart, start, stop]);

    const cancel = () => {
        stop();
        setOpen(false);
        setResult(isJa ? "作成をやめました。入力内容は残っています。" : "Stopped. Your input is still here.");
    };

    return (
        <div ref={setContainer} className="relative w-full">
            {open ? null : (
                <div className="flex flex-col items-center gap-4 text-center">
                    <Button onClick={start}>
                        {autoStart || result ? (isJa ? "もう一度作る" : "Create again") : isJa ? "議事録を作る" : "Create minutes"}
                    </Button>
                    <p className="text-sm text-muted-foreground" role="status">{result}</p>
                </div>
            )}
            <ProgressDialog
                portalContainer={container}
                variant="overlay"
                open={open}
                badge={<Badge variant="secondary">{isJa ? "AIで作成中" : "Generating with AI"}</Badge>}
                title={isJa ? "会議を議事録にまとめています" : "Turning the meeting into minutes"}
                description={
                    isJa
                        ? "数十秒かかることがあります。この画面のままお待ちください。"
                        : "This can take a few dozen seconds. Please keep this screen open."
                }
                media={<Scene src={SCENE.minutes} stillSrc={SCENE.minutesStill} still={still} />}
                statusLabel={isJa ? "いまの作業" : "Now"}
                status={steps[step]}
                onCancel={cancel}
                cancelLabel={isJa ? "作成をやめる" : "Stop"}
                cancelNote={isJa ? "やめても入力内容はこの画面に残ります。" : "Your input stays on this screen if you stop."}
            />
        </div>
    );
}

/** Opens for `ms`, then the caller closes it. */
function useTimedOpen(ms: number) {
    const [open, setOpen] = React.useState(true);
    React.useEffect(() => {
        if (!open) return;
        const timer = window.setTimeout(() => setOpen(false), ms);
        return () => window.clearTimeout(timer);
    }, [open, ms]);
    return [open, setOpen] as const;
}

function ProgressDialogAsideDemo() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
    const [open, setOpen] = useTimedOpen(6000);

    return (
        <div ref={setContainer} className="relative flex w-full justify-center">
            {open ? null : <Button onClick={() => setOpen(true)}>{isJa ? "もう一度作る" : "Plan again"}</Button>}
            <ProgressDialog
                portalContainer={container}
                variant="overlay"
                open={open}
                badge={<Badge variant="secondary">{isJa ? "AIで作成中" : "Generating with AI"}</Badge>}
                title={isJa ? "旅の計画を組み立てています" : "Putting the trip plan together"}
                media={<Scene src={SCENE.trip} stillSrc={SCENE.tripStill} />}
                statusLabel={isJa ? "いまの作業" : "Now"}
                status={isJa ? "移動の順番を考えています" : "Working out the order of stops"}
                aside={
                    <div className="rounded-md border p-4 text-left text-sm">
                        <p className="font-medium">{isJa ? "待っているあいだに" : "While you wait"}</p>
                        <p className="mt-1 text-muted-foreground">
                            {isJa
                                ? "できあがった計画は、あとから一覧でも開けます。"
                                : "You can reopen the finished plan from the list later."}
                        </p>
                    </div>
                }
                onCancel={() => setOpen(false)}
                cancelLabel={isJa ? "作成をやめる" : "Stop"}
            />
        </div>
    );
}

function ProgressDialogKnownDemo() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const TOTAL = 5;
    const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
    const [open, setOpen] = React.useState(true);
    const [done, setDone] = React.useState(0);

    React.useEffect(() => {
        if (!open) return;
        const timer = window.setInterval(() => {
            setDone((n) => {
                if (n + 1 >= TOTAL) {
                    window.clearInterval(timer);
                    setOpen(false);
                    return 0;
                }
                return n + 1;
            });
        }, 2200);
        return () => window.clearInterval(timer);
    }, [open]);

    return (
        <div ref={setContainer} className="relative flex w-full justify-center">
            {open ? null : <Button onClick={() => setOpen(true)}>{isJa ? "もう一度読み込む" : "Import again"}</Button>}
            <ProgressDialog
                portalContainer={container}
                open={open}
                title={isJa ? "録音を読み込んでいます" : "Importing recordings"}
                media={<Scene src={SCENE.minutes} stillSrc={SCENE.minutesStill} />}
                statusLabel={isJa ? "いまの作業" : "Now"}
                status={isJa ? `${done + 1} 件目の録音を読み込んでいます` : `Reading recording ${done + 1}`}
                value={done}
                max={TOTAL}
                valueText={isJa ? `${TOTAL} 件中 ${done} 件完了` : `${done} of ${TOTAL} recordings done`}
                onCancel={() => setOpen(false)}
                cancelLabel={isJa ? "読み込みをやめる" : "Stop"}
            />
        </div>
    );
}

function ProgressDialogNoCancelDemo() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
    const [open, setOpen] = useTimedOpen(4500);

    return (
        <div ref={setContainer} className="relative flex w-full justify-center">
            {open ? null : <Button onClick={() => setOpen(true)}>{isJa ? "もう一度作る" : "Create again"}</Button>}
            <ProgressDialog
                portalContainer={container}
                open={open}
                title={isJa ? "会議を議事録にまとめています" : "Turning the meeting into minutes"}
                media={<Scene src={SCENE.minutes} stillSrc={SCENE.minutesStill} />}
                status={isJa ? "議事録の形に整えています" : "Shaping the minutes"}
            />
        </div>
    );
}

export function ProgressDialogDemo({
    variant = "default",
    motionToggle = false,
}: {
    variant?: ProgressDialogDemoVariant;
    motionToggle?: boolean;
}) {
    const [reduce, setReduce] = React.useState(false);
    const demo =
        variant === "aside" ? (
            <ProgressDialogAsideDemo />
        ) : variant === "known" ? (
            <ProgressDialogKnownDemo />
        ) : variant === "no-cancel" ? (
            <ProgressDialogNoCancelDemo />
        ) : (
            <ProgressDialogStepsDemo still={motionToggle && reduce} autoStart={!motionToggle} />
        );

    return (
        <div className="flex w-full flex-col items-center gap-2">
            {demo}
            {motionToggle ? (
                <ReduceMotionSwitch id="progress-dialog-reduce-motion" checked={reduce} onCheckedChange={setReduce} />
            ) : null}
        </div>
    );
}

export type ActionProgressDemoVariant = "default" | "just-after" | "form";

export function ActionProgressDemo({
    variant = "default",
    motionToggle = false,
}: {
    variant?: ActionProgressDemoVariant;
    motionToggle?: boolean;
}) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
    const [pending, setPending] = React.useState(false);
    const [saved, setSaved] = React.useState(0);

    const save = (ms: number) => {
        if (pending) return;
        setPending(true);
        window.setTimeout(() => {
            setPending(false);
            setSaved((n) => n + 1);
        }, ms);
    };

    const title = isJa ? "保存しています" : "Saving";
    const description = isJa ? "終わるとこの画面に戻ります。" : "You will return to this screen when it is done.";

    if (variant === "form") {
        return (
            <div ref={setContainer} className="relative flex w-full flex-col items-center gap-4">
                <form
                    className="flex w-full max-w-sm flex-col gap-3 text-left"
                    action={async () => {
                        await new Promise((resolve) => window.setTimeout(resolve, 1500));
                        setSaved((n) => n + 1);
                    }}
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="action-progress-name">{isJa ? "表示名" : "Display name"}</Label>
                        <Input id="action-progress-name" name="name" defaultValue={isJa ? "青木" : "Aoki"} />
                    </div>
                    <Button type="submit">{isJa ? "送信する" : "Submit"}</Button>
                    <FormActionProgress
                        portalContainer={container}
                        title={isJa ? "送信しています" : "Sending"}
                        description={description}
                    />
                </form>
                <p className="text-sm text-muted-foreground" role="status">
                    {saved > 0 ? (isJa ? `送信しました（${saved} 回）` : `Sent (${saved})`) : ""}
                </p>
            </div>
        );
    }

    return (
        <div ref={setContainer} className="relative flex w-full flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-2">
                {variant === "just-after" ? (
                    <Button onClick={() => save(450)}>
                        {isJa ? "0.45秒で終わる保存" : "Save (0.45 s)"}
                    </Button>
                ) : (
                    <>
                        <Button onClick={() => save(2000)}>
                            {isJa ? "保存する（2秒）" : "Save (2 s)"}
                        </Button>
                        <Button variant="outline" onClick={() => save(200)}>
                            {isJa ? "保存する（0.2秒）" : "Save (0.2 s)"}
                        </Button>
                    </>
                )}
            </div>
            <p className="text-sm text-muted-foreground" role="status">
                {pending
                    ? isJa
                        ? "保存しています"
                        : "Saving"
                    : saved > 0
                      ? isJa
                          ? `保存しました（${saved} 回）`
                          : `Saved (${saved})`
                      : ""}
            </p>
            {motionToggle ? <ReduceMotionSwitch id="action-progress-reduce-motion" /> : null}
            <ActionProgress portalContainer={container} open={pending} title={title} description={description} />
        </div>
    );
}

export type RouteProgressDemoVariant = "viewport" | "container" | "boundary";

export function RouteProgressDemo({
    variant = "viewport",
    motionToggle = false,
}: {
    variant?: RouteProgressDemoVariant;
    motionToggle?: boolean;
}) {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const [loading, setLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);

    const go = () => {
        if (loading) return;
        setLoading(true);
        window.setTimeout(() => {
            setLoading(false);
            setPage((n) => n + 1);
        }, 2500);
    };

    const label = isJa ? "ページを読み込み中" : "Loading page";

    // What a loading boundary renders: just the bar, for as long as it is mounted.
    if (variant === "boundary") {
        return (
            <>
                <RouteProgress label={label} />
                <p className="p-6 text-sm text-muted-foreground">
                    {isJa ? "ページを読み込んでいます。" : "Loading the page."}
                </p>
            </>
        );
    }

    if (variant === "container") {
        return (
            <div className="w-full max-w-md">
                <div className="relative overflow-hidden rounded-lg border p-4" aria-busy={loading}>
                    {loading ? <RouteProgress placement="container" label={label} /> : null}
                    <p className="text-sm font-medium">{isJa ? `一覧 ${page} ページ目` : `List, page ${page}`}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {isJa ? "この枠の中だけが読み込み直されます。" : "Only this panel reloads."}
                    </p>
                    <Button className="mt-4" size="sm" onClick={go}>
                        {isJa ? "次のページ" : "Next page"}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col items-center gap-4">
            {loading ? <RouteProgress label={label} /> : null}
            <p className="text-sm font-medium">{isJa ? `いまは ${page} ページ目` : `You are on page ${page}`}</p>
            <Button onClick={go}>
                {isJa ? "次のページへ移る" : "Go to next page"}
            </Button>
            {motionToggle ? <ReduceMotionSwitch id="route-progress-reduce-motion" /> : null}
        </div>
    );
}

/**
 * Figure for the ActionProgress page: when the dialog is visible, for work
 * that ends before the wait, just after it, and long after it. Fixed diagram,
 * drawn with HTML/CSS so it follows the theme. Scale: 0–2.2 s.
 */
export function ActionProgressTimingFigure() {
    const { locale } = useLocale();
    const isJa = locale === "ja";
    const SCALE = 2200;
    const pct = (ms: number) => `${(Math.min(ms, SCALE) / SCALE) * 100}%`;
    const rows = [
        { label: isJa ? "0.2秒で終わる" : "Ends at 0.2 s", work: 200, dialog: null as null | [number, number] },
        { label: isJa ? "0.45秒で終わる" : "Ends at 0.45 s", work: 450, dialog: [350, 850] as [number, number] },
        { label: isJa ? "2秒で終わる" : "Ends at 2 s", work: 2000, dialog: [350, 2000] as [number, number] },
    ];

    return (
        <figure className="space-y-3 rounded-lg border p-4">
            <div className="space-y-4">
                {rows.map((row) => (
                    <div key={row.label} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 text-xs">
                        <span className="font-medium">{row.label}</span>
                        <div className="relative h-7">
                            <div className="absolute inset-y-0 w-px bg-foreground/40" style={{ left: pct(350) }} aria-hidden="true" />
                            <div className="absolute top-0 h-2.5 rounded-full bg-muted-foreground/40" style={{ left: 0, width: pct(row.work) }} />
                            {row.dialog ? (
                                <div
                                    className="absolute bottom-0 h-2.5 rounded-full bg-primary"
                                    style={{ left: pct(row.dialog[0]), width: `calc(${pct(row.dialog[1])} - ${pct(row.dialog[0])})` }}
                                />
                            ) : (
                                <span className="absolute bottom-0 left-0 text-muted-foreground">
                                    {isJa ? "出ない" : "never shown"}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
                <div className="grid grid-cols-[6.5rem_1fr] gap-3 text-xs text-muted-foreground">
                    <span />
                    <div className="relative h-4">
                        <span className="absolute left-0">0</span>
                        <span className="absolute -translate-x-1/2" style={{ left: pct(350) }}>350ms</span>
                        <span className="absolute -translate-x-1/2" style={{ left: pct(2000) }}>2s</span>
                    </div>
                </div>
            </div>
            <figcaption className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-5 rounded-full bg-muted-foreground/40" aria-hidden="true" />
                    {isJa ? "処理中" : "Work in progress"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-5 rounded-full bg-primary" aria-hidden="true" />
                    {isJa ? "ダイアログが出ている" : "Dialog visible"}
                </span>
                <span>
                    {isJa
                        ? "350ms より前に終われば出ず、出たら 500ms は消えません。"
                        : "Ends before 350ms: never shown. Once shown: at least 500ms."}
                </span>
            </figcaption>
        </figure>
    );
}
