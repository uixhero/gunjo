import * as React from "react";

/**
 * Explanatory figures for the map-overlay component pages (figure-review,
 * 2026-09-19). Each one answers a question a reader could not answer from the
 * text and the live preview alone; the one-line "what" above each figure is
 * its acceptance criterion.
 *
 * Fixed diagrams, not data: the shapes never change with user input, so inline
 * SVG is the right tool here (CLAUDE.md's chart rule is about variable data).
 * Colours are token classes so both themes work, and the SVG scales with its
 * box; the wrapper scrolls sideways on a phone rather than shrinking the
 * labels below legibility.
 */

type Locale = "ja" | "en";

function FigureFrame({
    label,
    caption,
    minWidth,
    children,
}: {
    label: string;
    caption: string;
    minWidth: number;
    children: React.ReactNode;
}) {
    return (
        <figure className="space-y-2">
            <div className="overflow-x-auto rounded-lg border border-border bg-card p-4">
                <div style={{ minWidth }} role="img" aria-label={label}>
                    {children}
                </div>
            </div>
            <figcaption className="text-sm text-muted-foreground">{caption}</figcaption>
        </figure>
    );
}

function Arrow({ id }: { id: string }) {
    return (
        <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fill-foreground" />
        </marker>
    );
}

/* what: 「すべて」（と長押し）は、何か出ていれば全部消して組み合わせを覚え、
   全部消えていれば覚えた組み合わせに戻す。 */
export function LayerAllFigure({ locale }: { locale: Locale }) {
    const ja = locale === "ja";
    const t = ja
        ? {
              label: "「すべて」を押したときの状態の移り方。すべて表示と一部だけのどちらからも、押すとすべて非表示になり、そのとき出ていた組み合わせを覚える。すべて非表示で押すと、覚えた組み合わせに戻る。覚えていなければすべて表示になる。行を1つ押すと、覚えた組み合わせは忘れる。",
              caption: "消したあと、戻す前に行を1つでも切り替えると、覚えた組み合わせは消えます。",
              on: "すべて表示",
              mixed: "一部だけ",
              off: "すべて非表示",
              press: "「すべて」を押す",
              rememberAll: "すべてを覚える",
              rememberSome: "この組み合わせを覚える",
              back: "覚えた組み合わせに戻す",
              toOn: "すべてを覚えていた／最初から非表示だった",
              toMixed: "一部を覚えていた",
          }
        : {
              label: "How the All row moves between states. From all on or some on, a press hides everything and remembers what was showing. From all off, a press restores what was remembered, or turns everything on if nothing was. Pressing a single row forgets the remembered set.",
              caption: "Pressing a single row in between forgets the remembered set.",
              on: "All on",
              mixed: "Some on",
              off: "All off",
              press: "Press All",
              rememberAll: "remembers: all",
              rememberSome: "remembers: this set",
              back: "back to the remembered set",
              toOn: "remembered all, or was off from the start",
              toMixed: "remembered some",
          };
    return (
        <FigureFrame label={t.label} caption={t.caption} minWidth={560}>
            <svg viewBox="0 0 700 300" className="h-auto w-full" aria-hidden>
                <defs>
                    <Arrow id="lm-arrow" />
                </defs>
                {/* boxes */}
                <rect x="20" y="20" width="170" height="54" rx="10" className="fill-primary-subtle stroke-primary-border" strokeWidth="1.5" />
                <text x="105" y="53" textAnchor="middle" className="fill-foreground text-[15px] font-semibold">{t.on}</text>
                <rect x="20" y="220" width="170" height="54" rx="10" className="fill-primary-subtle stroke-primary-border" strokeWidth="1.5" />
                <text x="105" y="253" textAnchor="middle" className="fill-foreground text-[15px] font-semibold">{t.mixed}</text>
                <rect x="500" y="120" width="170" height="54" rx="10" className="fill-muted stroke-border" strokeWidth="1.5" />
                <text x="585" y="153" textAnchor="middle" className="fill-foreground text-[15px] font-semibold">{t.off}</text>

                {/* forward: hide + remember */}
                <path d="M190 47 C 420 47, 585 47, 585 116" fill="none" className="stroke-foreground" strokeWidth="1.5" markerEnd="url(#lm-arrow)" />
                <text x="340" y="24" textAnchor="middle" className="fill-foreground text-[12px]">{t.press}</text>
                <text x="340" y="40" textAnchor="middle" className="fill-muted-foreground text-[11px]">{t.rememberAll}</text>
                <path d="M190 247 C 420 247, 585 247, 585 178" fill="none" className="stroke-foreground" strokeWidth="1.5" markerEnd="url(#lm-arrow)" />
                <text x="340" y="272" textAnchor="middle" className="fill-foreground text-[12px]">{t.press}</text>
                <text x="340" y="288" textAnchor="middle" className="fill-muted-foreground text-[11px]">{t.rememberSome}</text>

                {/* back: restore */}
                <path d="M500 147 L 290 147" fill="none" className="stroke-foreground" strokeWidth="1.5" strokeDasharray="5 4" />
                <path d="M290 147 C 240 147, 215 100, 150 78" fill="none" className="stroke-foreground" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#lm-arrow)" />
                <path d="M290 147 C 240 147, 215 194, 150 216" fill="none" className="stroke-foreground" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#lm-arrow)" />
                <text x="395" y="122" textAnchor="middle" className="fill-foreground text-[12px]">{t.press}</text>
                <text x="395" y="138" textAnchor="middle" className="fill-muted-foreground text-[11px]">{t.back}</text>
                <text x="232" y="92" textAnchor="start" className="fill-muted-foreground text-[11px]">{t.toOn}</text>
                <text x="232" y="204" textAnchor="start" className="fill-muted-foreground text-[11px]">{t.toMixed}</text>
            </svg>
        </FigureFrame>
    );
}

/* what: 行を後から足すと欄の高さが変わって地図が動く。最初から全部出せば、
   値が届いても高さは変わらない。 */
export function PlaceRowsFigure({ locale }: { locale: Locale }) {
    const ja = locale === "ja";
    const t = ja
        ? {
              label: "値が届く順に3つの時点を並べた比較。上の段は値が届くたびに行を足す作り方で、欄が伸びるたびに上の地図が押し上げられる。下の段は最初から全行を出す作り方で、仮の枠が値に置き換わるだけなので、欄の高さも地図の位置も変わらない。",
              caption: "上は値が届くたびに行を足す作り方、下は最初から全部の行を出す作り方です。",
              cols: ["選んだ直後", "地名が届く", "天気が届く"],
              bad: "行を後から足す",
              good: "最初から全部出す",
              moved: "地点がずれる",
              still: "地点はずれない",
              map: "地図",
          }
        : {
              label: "A comparison across three moments as values arrive. Top row: rows are added as each value lands, and each time the panel grows it pushes the map up. Bottom row: every row is drawn from the start, placeholders are swapped for values, and neither the panel height nor the map moves.",
              caption: "Top: rows added as values arrive. Bottom: every row there from the start.",
              cols: ["Just picked", "Name arrives", "Weather arrives"],
              bad: "Rows added later",
              good: "All rows from the start",
              moved: "point shifts up",
              still: "point stays put",
              map: "Map",
          };

    const phoneW = 120;
    const phoneH = 170;
    const colX = [150, 310, 470];
    const rowY = [20, 225];

    const phone = (x: number, y: number, panelRows: number, filled: number, fixed: boolean, key: string) => {
        const rowH = 14;
        const panelH = fixed ? 20 + 6 * rowH : 20 + panelRows * rowH;
        const panelY = y + phoneH - panelH;
        return (
            <g key={key}>
                <clipPath id={`pp-clip-${key}`}>
                    <rect x={x} y={y} width={phoneW} height={phoneH} rx="10" />
                </clipPath>
                <g clipPath={`url(#pp-clip-${key})`}>
                <rect x={x} y={y} width={phoneW} height={phoneH} className="fill-gunjo-deep" />
                <text x={x + phoneW / 2} y={y + 22} textAnchor="middle" className="fill-gunjo-light text-[11px]">{t.map}</text>
                <circle cx={x + phoneW / 2} cy={panelY - 22} r="5" className="fill-dawn-sun" />
                <rect x={x} y={panelY} width={phoneW} height={panelH} className="fill-card stroke-border" strokeWidth="1" />
                <rect x={x + 10} y={panelY + 7} width="60" height="6" rx="3" className={filled >= 1 ? "fill-primary" : "fill-muted-foreground/40"} />
                {Array.from({ length: fixed ? 6 : panelRows }).map((_, i) => (
                    <g key={i}>
                        <rect x={x + 10} y={panelY + 22 + i * rowH} width="34" height="6" rx="3" className="fill-muted-foreground/60" />
                        <rect
                            x={x + 70}
                            y={panelY + 22 + i * rowH}
                            width="40"
                            height="6"
                            rx="3"
                            className={!fixed || filled >= 2 || i >= 4 ? "fill-foreground" : "fill-muted-foreground/25"}
                        />
                    </g>
                ))}
                </g>
                <rect x={x} y={y} width={phoneW} height={phoneH} rx="10" fill="none" className="stroke-border" strokeWidth="1.5" />
            </g>
        );
    };

    return (
        <FigureFrame label={t.label} caption={t.caption} minWidth={600}>
            <svg viewBox="0 0 620 420" className="h-auto w-full" aria-hidden>
                {t.cols.map((c, i) => (
                    <text key={c} x={colX[i] + phoneW / 2} y="12" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">
                        {c}
                    </text>
                ))}
                <text x="10" y={rowY[0] + phoneH / 2} className="fill-foreground text-[12px] font-semibold">{t.bad}</text>
                <text x="10" y={rowY[0] + phoneH / 2 + 18} className="fill-destructive text-[11px]">{t.moved}</text>
                <text x="10" y={rowY[1] + 10 + phoneH / 2} className="fill-foreground text-[12px] font-semibold">{t.good}</text>
                <text x="10" y={rowY[1] + 10 + phoneH / 2 + 18} className="fill-success text-[11px]">{t.still}</text>
                {phone(colX[0], rowY[0] + 6, 2, 0, false, "b0")}
                {phone(colX[1], rowY[0] + 6, 2, 1, false, "b1")}
                {phone(colX[2], rowY[0] + 6, 6, 2, false, "b2")}
                {phone(colX[0], rowY[1] + 10, 6, 0, true, "g0")}
                {phone(colX[1], rowY[1] + 10, 6, 1, true, "g1")}
                {phone(colX[2], rowY[1] + 10, 6, 2, true, "g2")}
            </svg>
        </FigureFrame>
    );
}

/* what: 拡大していくと線は目安の長さまで伸び、表示する距離が一段変わる瞬間に
   短く戻る（のこぎりの歯の形）。 */
export function ScaleSawtoothFigure({ locale }: { locale: Locale }) {
    const ja = locale === "ja";
    const t = ja
        ? {
              label: "拡大の度合いを横軸、線の長さを縦軸にしたグラフ。拡大していくと線は96pxまで伸び続ける。表示する距離が50 km、20 km、10 km、5 kmと一段変わる瞬間に、48px（半分になるとき）か38.4px（5分の2になるとき）まで短く戻る。これを繰り返すのこぎりの歯の形になる。",
              caption: "拡大していくと、線は上限（既定 96px）まで伸びます。表示する距離が一段変わる瞬間に、線は短く戻ります。戻るときは 0.2 秒かけて縮みます。",
              x: "拡大していく",
              y: "線の長さ（px）",
              target: "96px を超えない範囲で、いちばん長く",
          }
        : {
              label: "A graph with zoom on the horizontal axis and line length on the vertical axis. Zooming in, the line grows up to the 96px target, then snaps back each time the distance steps from 50 km to 20 km, 10 km and 5 km — to 48px when the distance halves, 38.4px when it drops to two fifths. A sawtooth.",
              caption: "Zooming in, the line grows up to the target length (96px by default). Each time the distance steps down, the line snaps back shorter, easing over 0.2 seconds.",
              x: "Zoom in",
              y: "Line length (px)",
              target: "as long as possible, never past 96px",
          };
    // Segments between label changes: the line grows from 96/ratio to 96.
    // Each segment starts where the previous distance reached 96px, so its
    // first length is 96 × (this distance ÷ the previous one): 100→50 km and
    // 20→10→5 km halve (48px), 50→20 km drops to 2/5 (38.4px). Widths are the
    // zoom it takes to grow back to 96px (log of the ratio), so the axis is
    // zoom on a log scale.
    const segs = [
        { label: "50 km", from: 48 },
        { label: "20 km", from: 38.4 },
        { label: "10 km", from: 48 },
        { label: "5 km", from: 48 },
    ];
    const unit = 120 / Math.log(2);
    const widths = segs.map((seg) => Math.log(96 / seg.from) * unit);
    const starts = widths.map((_, i) => widths.slice(0, i).reduce((a, b) => a + b, 0));
    const total = widths.reduce((a, b) => a + b, 0);
    const x0 = 70;
    const yOf = (px: number) => 200 - px * 1.6;
    return (
        <FigureFrame label={t.label} caption={t.caption} minWidth={520}>
            <svg viewBox="0 0 670 240" className="h-auto w-full" aria-hidden>
                <defs>
                    <Arrow id="sb-arrow" />
                </defs>
                <line x1={x0} y1="200" x2={x0 + total + 20} y2="200" className="stroke-foreground" strokeWidth="1.5" markerEnd="url(#sb-arrow)" />
                <text x={x0 - 8} y="204" textAnchor="end" className="fill-muted-foreground text-[11px]">0</text>
                <text x={x0 - 8} y={yOf(48) + 4} textAnchor="end" className="fill-muted-foreground text-[11px]">48</text>
                <text x={x0 - 8} y={yOf(38.4) + 8} textAnchor="end" className="fill-muted-foreground text-[11px]">38.4</text>
                <text x={x0 - 8} y={yOf(96) + 4} textAnchor="end" className="fill-muted-foreground text-[11px]">96</text>
                <line x1={x0} y1="200" x2={x0} y2="20" className="stroke-foreground" strokeWidth="1.5" markerEnd="url(#sb-arrow)" />
                <text x={x0 + total + 20} y="222" textAnchor="end" className="fill-muted-foreground text-[12px]">{t.x}</text>
                <text x={x0 - 8} y="16" textAnchor="start" className="fill-muted-foreground text-[12px]">{t.y}</text>
                <line x1={x0} y1={yOf(96)} x2={x0 + total} y2={yOf(96)} className="stroke-primary" strokeWidth="1" strokeDasharray="5 4" />
                <text x={x0 + total} y={yOf(96) - 6} textAnchor="end" className="fill-primary text-[11px]">{t.target}</text>
                {segs.map((s, i) => {
                    const xa = x0 + starts[i];
                    const xb = xa + widths[i];
                    return (
                        <g key={s.label}>
                            {/* On a log zoom axis the length grows exponentially within a segment. */}
                            <polyline
                                points={Array.from({ length: 13 }, (_, k) => {
                                    const x = xa + (widths[i] * k) / 12;
                                    const px = s.from * Math.exp((x - xa) / unit);
                                    return `${x.toFixed(1)},${yOf(px).toFixed(1)}`;
                                }).join(" ")}
                                fill="none"
                                className="stroke-foreground"
                                strokeWidth="2.5"
                            />
                            {i < segs.length - 1 ? (
                                <line x1={xb} y1={yOf(96)} x2={xb} y2={yOf(segs[i + 1].from)} className="stroke-foreground" strokeWidth="1" strokeDasharray="3 3" />
                            ) : null}
                            <text x={(xa + xb) / 2} y={176} textAnchor="middle" className="fill-foreground font-mono text-[12px]">
                                {s.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </FigureFrame>
    );
}
