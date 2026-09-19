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

/* what: RangeBar は全体の幅に1本のグラデーションを描き、区間の窓から見せるので、
   同じ 20° はどの行でも同じ色になる。区間ごとにやり直すと、行ごとに色が変わる。 */
export function RangeBarRampFigure({ locale }: { locale: Locale }) {
    const ja = locale === "ja";
    const t = ja
        ? {
              label: "気温の範囲 14〜22° と 20〜28° を示す横棒2本を、2通りの塗り方で比べた図。上の組は全体（10〜35°）にグラデーションを1本描き、区間の部分だけを窓のように見せる。20° の縦線が2行とも同じ色の所を通る。下の組は区間ごとにグラデーションをやり直す塗り方で、20° は1行目では暖かい色、2行目では冷たい色になる。",
              caption: "上が RangeBar の塗り方です。下のように区間ごとにやり直すと、同じ 20° が行ごとに違う色になります。",
              whole: "全体に敷く",
              wholeSub: "RangeBar の gradient",
              local: "区間ごとにやり直す",
              localSub: "比べるための例（使わない）",
              same: "同じ色",
              diff: "違う色",
              scale: "全体（10〜35°）",
          }
        : {
              label: "Two rows, 14–22° and 20–28°, painted two ways. Top pair: one ramp laid across the whole scale (10–35°), each range shown through a window; the 20° line crosses the same colour on both rows. Bottom pair: the ramp restarts inside each range, so 20° is warm on the first row and cool on the second.",
              caption: "The top pair is how RangeBar paints. Restarting the ramp in each range (bottom) gives the same 20° a different colour on every row.",
              whole: "Across the scale",
              wholeSub: "RangeBar gradient",
              local: "Restarted per range",
              localSub: "for comparison only",
              same: "same colour",
              diff: "different colours",
              scale: "Whole scale (10–35°)",
          };
    const x0 = 170;
    const x1 = 590;
    const at = (v: number) => x0 + ((v - 10) / 25) * (x1 - x0);
    const rows: Array<[number, number]> = [
        [14, 22],
        [20, 28],
    ];
    const trackH = 10;
    const bar = (y: number, lo: number, hi: number, fill: string, key: string) => (
        <g key={key}>
            <rect x={x0} y={y} width={x1 - x0} height={trackH} rx={trackH / 2} className="fill-muted" />
            <rect x={at(lo)} y={y} width={at(hi) - at(lo)} height={trackH} rx={trackH / 2} fill={fill} />
            <text x={at(lo) - 8} y={y + 9} textAnchor="end" className="fill-muted-foreground text-[11px]">{lo}°</text>
            <text x={at(hi) + 8} y={y + 9} className="fill-muted-foreground text-[11px]">{hi}°</text>
        </g>
    );
    return (
        <FigureFrame label={t.label} caption={t.caption} minWidth={560}>
            <svg viewBox="0 0 640 290" className="h-auto w-full" aria-hidden>
                <defs>
                    <linearGradient id="rb-ramp-whole" gradientUnits="userSpaceOnUse" x1={x0} x2={x1} y1="0" y2="0">
                        <stop offset="0" style={{ stopColor: "hsl(var(--primary))" }} />
                        <stop offset="0.5" style={{ stopColor: "hsl(var(--info))" }} />
                        <stop offset="1" style={{ stopColor: "hsl(var(--warning))" }} />
                    </linearGradient>
                    <linearGradient id="rb-ramp-local" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0" style={{ stopColor: "hsl(var(--primary))" }} />
                        <stop offset="0.5" style={{ stopColor: "hsl(var(--info))" }} />
                        <stop offset="1" style={{ stopColor: "hsl(var(--warning))" }} />
                    </linearGradient>
                </defs>
                {/* the whole ramp, for reference */}
                <text x="10" y="28" className="fill-foreground text-[12px] font-semibold">{t.scale}</text>
                <rect x={x0} y="18" width={x1 - x0} height={trackH} rx={trackH / 2} fill="url(#rb-ramp-whole)" />
                <text x={x0} y="46" textAnchor="middle" className="fill-muted-foreground text-[11px]">10°</text>
                <text x={x1} y="46" textAnchor="middle" className="fill-muted-foreground text-[11px]">35°</text>

                <text x="10" y="92" className="fill-foreground text-[12px] font-semibold">{t.whole}</text>
                <text x="10" y="108" className="fill-muted-foreground text-[11px]">{t.wholeSub}</text>
                {rows.map(([lo, hi], i) => bar(78 + i * 26, lo, hi, "url(#rb-ramp-whole)", `w${i}`))}

                <text x="10" y="202" className="fill-foreground text-[12px] font-semibold">{t.local}</text>
                <text x="10" y="218" className="fill-muted-foreground text-[11px]">{t.localSub}</text>
                {rows.map(([lo, hi], i) => bar(188 + i * 26, lo, hi, "url(#rb-ramp-local)", `l${i}`))}

                {/* the 20° line */}
                <line x1={at(20)} x2={at(20)} y1="12" y2="250" className="stroke-foreground" strokeWidth="1.5" strokeDasharray="4 3" />
                <text x={at(20)} y="268" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">20°</text>
                <text x={at(20) + 10} y="140" className="fill-success text-[11px]">{t.same}</text>
                <text x={at(20) + 10} y="250" className="fill-destructive text-[11px]">{t.diff}</text>
            </svg>
        </FigureFrame>
    );
}

/* what: 同じ細い幅で、左右2列の flex は行を押し出して語を途中で割るが、float なら
   入りきらない行が左上の見出しの下へ回り、startInset の幅（方位磁針の場所）は空いたまま残る。 */
export function MapCornerFlowFigure({ locale }: { locale: Locale }) {
    const ja = locale === "ja";
    const t = ja
        ? {
              label: "幅の細い地図の上端を2つ並べた比較。左は左右2列の flex。右の列は左上の見出しの横に残った幅（点線の枠）しか使えないので、「地形 Sentinel-2 z10」が2行に割れ、「雨 気象庁 11:00 実況」の最後の「況」だけが次の行に落ちる。右は MapStatusCorner の float で、この図では見出しの横に並ぶのは最初の2行だけ。残りの行は見出しの下に回る。そのとき左端の startInset の幅は空いたまま残り（見出しの下に置く方位磁針の場所）、各行は右寄せで1行ずつ並ぶ。",
              caption: "左は2列の flex（点線が右の列の幅）、右は MapStatusCorner（float）です。網掛けが startInset で空けた幅です。",
              flex: "左右2列（flex）",
              float: "MapStatusCorner（float＝回り込み）",
              lead: "EARTH · 昼夜",
              lines: ["現在地", "日本は昼", "雲 最新", "地形 Sentinel-2 z10", "雨 気象庁 11:00 実況", "×123.4"],
              flexLines: ["現在地", "日本は昼", "雲 最新", "地形 Sentinel-2", "z10", "雨 気象庁 11:00 実", "況", "×123.4"],
              broken: [4, 6],
              inset: "startInset",
              column: "右の列の幅",
              broke: "折り返された所",
              compass: "方位磁針",
          }
        : {
              label: "Two narrow map tops side by side. Left, a two-column flex: the right column only gets the width left beside the words (dashed box), 'Terrain Sentinel-2 z10' splits over two lines and the last letters of 'observed' drop to their own line. Right, MapStatusCorner's float: only the first two lines sit beside the words on the left; the rest move below them, stay right-aligned on one line each, and the startInset strip on the left (where the compass is) stays clear.",
              caption: "Left: a two-column flex (the dashed box is the right column). Right: MapStatusCorner (float). The hatched strip is the room kept by startInset.",
              flex: "Two-column flex",
              float: "MapStatusCorner (float)",
              lead: "EARTH · DAY & NIGHT",
              lines: ["Here", "Day in Japan", "Clouds latest", "Terrain Sentinel-2 z10", "Rain JMA 11:00 observed", "×123.4"],
              flexLines: ["Here", "Day in Japan", "Clouds latest", "Terrain Sentinel-2", "z10", "Rain JMA 11:00 obser", "ved", "×123.4"],
              broken: [4, 6],
              inset: "startInset",
              column: "right column",
              broke: "broken here",
              compass: "compass",
          };
    const W = 250;
    const H = 190;
    const lh = 15;
    const panel = (x: number, title: string, body: React.ReactNode, key: string) => (
        <g key={key}>
            <text x={x + W / 2} y="16" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">{title}</text>
            <clipPath id={`mc-clip-${key}`}>
                <rect x={x} y="28" width={W} height={H} rx="10" />
            </clipPath>
            <g clipPath={`url(#mc-clip-${key})`}>
                <rect x={x} y="28" width={W} height={H} className="fill-gunjo-deep" />
                {body}
            </g>
            <rect x={x} y="28" width={W} height={H} rx="10" fill="none" className="stroke-border" strokeWidth="1.5" />
        </g>
    );
    const mono = "font-mono text-[10.5px]";
    const leftX = 20;
    const rightX = 370;
    return (
        <FigureFrame label={t.label} caption={t.caption} minWidth={560}>
            <svg viewBox="0 0 640 230" className="h-auto w-full" aria-hidden>
                <defs>
                    <pattern id="mc-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <line x1="0" y1="0" x2="0" y2="6" className="stroke-gunjo-light" strokeWidth="1.5" opacity="0.45" />
                    </pattern>
                </defs>
                {panel(
                    leftX,
                    t.flex,
                    <>
                        <text x={leftX + 10} y={50} className={`fill-palette-white/90 ${mono}`}>{t.lead}</text>
                        {/* the right column: only the width left beside the lead */}
                        <rect x={leftX + 128} y={36} width={W - 134} height={H - 16} rx="4" fill="none" className="stroke-gunjo-light" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
                        <text x={leftX + 128 + (W - 134) / 2} y={H + 12} textAnchor="middle" className="fill-palette-white/80 text-[10px]">{t.column}</text>
                        <text x={leftX + 10} y={H + 12} className="fill-warning text-[10px] font-bold">■ {t.broke}</text>
                        {t.flexLines.map((line, i) => (
                            <text
                                key={i}
                                x={leftX + W - 10}
                                y={50 + i * lh}
                                textAnchor="end"
                                className={`${t.broken.includes(i) ? "fill-warning font-bold" : "fill-palette-white/90"} ${mono}`}
                            >
                                {line}
                            </text>
                        ))}
                        <circle cx={leftX + 36} cy={96} r="22" fill="none" className="stroke-gunjo-light" strokeWidth="1.2" opacity="0.8" />
                        <text x={leftX + 36} y={132} textAnchor="middle" className="fill-palette-white/80 text-[9px]">{t.compass}</text>
                    </>,
                    "flex"
                )}
                {panel(
                    rightX,
                    t.float,
                    <>
                        <rect x={rightX} y={62} width={70} height={H - 34} fill="url(#mc-hatch)" />
                        <rect x={rightX} y={62} width={70} height={H - 34} fill="none" className="stroke-gunjo-light" strokeWidth="1" strokeDasharray="4 3" />
                        <rect x={rightX + 6} y={H + 1} width={58} height={15} rx="3" className="fill-gunjo-deep" />
                        <text x={rightX + 35} y={H + 12} textAnchor="middle" className="fill-palette-white/90 text-[10px]">{t.inset}</text>
                        <text x={rightX + 10} y={50} className={`fill-palette-white/90 ${mono}`}>{t.lead}</text>
                        {t.lines.map((line, i) => (
                            <text key={i} x={rightX + W - 10} y={50 + i * lh} textAnchor="end" className={`fill-palette-white/90 ${mono}`}>
                                {line}
                            </text>
                        ))}
                        <circle cx={rightX + 36} cy={96} r="22" fill="none" className="stroke-gunjo-light" strokeWidth="1.2" opacity="0.8" />
                        <text x={rightX + 36} y={132} textAnchor="middle" className="fill-palette-white/80 text-[9px]">{t.compass}</text>
                    </>,
                    "float"
                )}
                <path d={`M${leftX + W + 20} 120 L ${rightX - 20} 120`} className="stroke-muted-foreground" strokeWidth="1.5" markerEnd="url(#mc-arrow)" />
                <defs>
                    <Arrow id="mc-arrow" />
                </defs>
            </svg>
        </FigureFrame>
    );
}
