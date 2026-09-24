import * as React from "react";

/**
 * Explanatory figures for the pattern pages under /docs/apps/earthmoon
 * (figure-review, 2026-09-19). Each answers a question a context-free reader
 * got stuck on; the one-line "what" above each figure is its acceptance
 * criterion.
 *
 * Fixed diagrams, not data: the shapes never change with user input, so
 * inline SVG is fine here (CLAUDE.md's chart rule is about variable data).
 * Colours are token classes so both themes work. The wrapper scrolls
 * sideways on a phone rather than shrinking the labels.
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
            <div className="overflow-x-auto rounded-lg border border-transparent contrast-more:border-border forced-colors:border-[CanvasText] bg-card p-4">
                <div style={{ minWidth }} role="img" aria-label={label}>
                    {children}
                </div>
            </div>
            <figcaption className="text-sm text-muted-foreground">{caption}</figcaption>
        </figure>
    );
}

/* what: 昇る前、矢印と弧が指すのは、目標が最初に見えてくる点（低い）。
   いちばん高い点は、弧に薄い線で添えるだけ。 */
export function PassPathFigure({ locale }: { locale: Locale }) {
    const ja = locale === "ja";
    const t = ja
        ? {
              label: "目標が空を横切る道筋を、横軸を時刻、縦軸を地平線からの高さにして描いた図。道筋は地平線から昇って高さ60°で最も高くなり、また沈む。昇り始めはまだ見えず、高さ10°の点で初めて見えてくる。昇る前の案内は、この見え始めの点を指す。いちばん高い60°の点は、案内の画面では薄く添えるだけ。",
              caption: "昇る前は、見え始めの点に端末を向けて待ちます。目標が出てきたら、そのまま矢印と弧で追います。",
              time: "時刻",
              height: "目標の高さ（地平線から）",
              hidden: "まだ見えない",
              gone: "もう見えない",
              first: "見え始め 10°",
              firstNote: "昇る前の案内はここを指す",
              max: "最高 60°",
              maxNote: "案内の画面では薄く添えるだけ",
              horizon: "地平線 0°",
          }
        : {
              label: "The target's path across the sky, with time along the bottom and height above the horizon up the side. It rises from the horizon, peaks at 60°, and sets again. Early on it is not yet visible; it first appears at 10°. Before it rises, the guide points at that first point. The 60° peak is only shown faintly on the guide screen.",
              caption: "Before it rises, aim at the first point and wait. When the target appears, follow it with the arrow and the arc.",
              time: "Time",
              height: "Target height (above the horizon)",
              hidden: "not visible yet",
              gone: "no longer visible",
              first: "First seen 10°",
              firstNote: "the guide points here before it rises",
              max: "Highest 60°",
              maxNote: "shown only faintly on the guide screen",
              horizon: "Horizon 0°",
          };
    const y = (deg: number) => 210 - (deg / 60) * 130;
    return (
        <FigureFrame label={t.label} caption={t.caption} minWidth={560}>
            <svg viewBox="0 0 660 250" className="h-auto w-full" aria-hidden>
                <line x1="60" y1="210" x2="630" y2="210" className="stroke-muted-foreground" strokeWidth="1.5" />
                <line x1="60" y1="210" x2="60" y2="40" className="stroke-border" strokeWidth="1" />
                <text x="630" y="200" textAnchor="end" className="fill-muted-foreground text-[12px]">{t.time}</text>
                <text x="66" y="44" className="fill-muted-foreground text-[12px]">{t.height}</text>
                <text x="54" y="214" textAnchor="end" className="fill-muted-foreground text-[11px]">{t.horizon}</text>

                {/* hidden part of the rise */}
                <path d={`M90 210 Q 110 ${y(6)} 130 ${y(10)}`} fill="none" className="stroke-muted-foreground" strokeWidth="2" strokeDasharray="4 5" />
                <text x="96" y="236" className="fill-muted-foreground text-[11px]">{t.hidden}</text>
                {/* visible path */}
                <path d={`M130 ${y(10)} C 210 ${y(50)}, 280 ${y(60)}, 350 ${y(60)} S 540 ${y(30)}, 575 ${y(10)}`} fill="none" className="stroke-foreground" strokeWidth="2" />

                <path d={`M575 ${y(10)} Q 590 ${y(5)} 600 210`} fill="none" className="stroke-muted-foreground" strokeWidth="2" strokeDasharray="4 5" />

                <text x="600" y="236" textAnchor="end" className="fill-muted-foreground text-[11px]">{t.gone}</text>

                {/* first point */}
                <circle cx="130" cy={y(10)} r="7" className="fill-warning" />
                <text x="146" y={y(10) + 2} className="fill-foreground text-[13px] font-semibold">{t.first}</text>
                <text x="146" y={y(10) + 18} className="fill-muted-foreground text-[11px]">{t.firstNote}</text>

                {/* peak */}
                <line x1="350" y1={y(60)} x2="350" y2="210" className="stroke-warning/50" strokeWidth="1.5" strokeDasharray="3 4" />
                <circle cx="350" cy={y(60)} r="5" className="fill-warning/60" />
                <text x="364" y={y(60) - 24} className="fill-foreground text-[13px] font-semibold">{t.max}</text>
                <text x="364" y={y(60) - 8} className="fill-muted-foreground text-[11px]">{t.maxNote}</text>
            </svg>
        </FigureFrame>
    );
}

/* what: 0時から朝5時の発表までは、前の日の予報の1列目（もう昨日）を外して2列で出す。
   発表が出ると3列に戻る。 */
export function MidnightColumnsFigure({ locale }: { locale: Locale }) {
    const ja = locale === "ja";
    const t = ja
        ? {
              label: "時刻の順に3つの場面を並べた図。9月19日夕方の発表のあとは、今日9/19・あす9/20・月曜9/21の3列。9月20日の0時を過ぎると、同じ予報の1列目9/19はもう昨日なので外し、9/20を今日、9/21をあすと呼び直して2列で出す。9月20日朝5時の発表が出ると、今日9/20・あす9/21・火曜9/22の3列に戻る。",
              caption: "0時から朝5時の発表までのあいだだけ、列が2つになります。",
              scenes: ["9/19 夕方の予報が出たあと", "9/20 0時すぎ", "9/20 朝5時の予報が出たあと"],
              removed: "外す",
              cols: [
                  [["今日", "9/19（土）", "sat"], ["あす", "9/20（日）", "sun"], ["月曜", "9/21（月）", ""]],
                  [["今日", "9/20（日）", "sun"], ["あす", "9/21（月）", ""]],
                  [["今日", "9/20（日）", "sun"], ["あす", "9/21（月）", ""], ["火曜", "9/22（火）", ""]],
              ],
              gone: ["9/19（土）", "sat"],
          }
        : {
              label: "Three moments in time order. After the evening forecast on 19 September: Today 9/19, Tomorrow 9/20, Mon 9/21. After midnight on the 20th, the same forecast's first column, 9/19, is now yesterday and is removed; 9/20 becomes Today and 9/21 Tomorrow, in two columns. When the 5 am forecast on the 20th arrives, it is three columns again: Today 9/20, Tomorrow 9/21, Tue 9/22.",
              caption: "Only between midnight and the 5 am forecast are there two columns.",
              scenes: ["9/19 after the evening forecast", "9/20 just after midnight", "9/20 after the 5 am forecast"],
              removed: "removed",
              cols: [
                  [["Today", "Sat 9/19", "sat"], ["Tomorrow", "Sun 9/20", "sun"], ["Mon", "Mon 9/21", ""]],
                  [["Today", "Sun 9/20", "sun"], ["Tomorrow", "Mon 9/21", ""]],
                  [["Today", "Sun 9/20", "sun"], ["Tomorrow", "Mon 9/21", ""], ["Tue", "Tue 9/22", ""]],
              ],
              gone: ["Sat 9/19", "sat"],
          };
    const panelX = [4, 246, 488];
    const colW = 68;
    const tone = (k: string) => (k === "sat" ? "fill-info" : k === "sun" ? "fill-destructive" : "fill-foreground");
    return (
        <FigureFrame label={t.label} caption={t.caption} minWidth={620}>
            <svg viewBox="0 0 700 120" className="h-auto w-full" aria-hidden>
                {t.scenes.map((scene, i) => (
                    <text key={scene} x={panelX[i] + 104} y="18" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">
                        {scene}
                    </text>
                ))}
                {t.cols.map((cols, p) => {
                    const offset = p === 1 ? colW + 4 : 4;
                    return (
                        <g key={p}>
                            <rect x={panelX[p]} y="32" width="208" height="80" rx="8" className="fill-muted/40 stroke-border" strokeWidth="1" />
                            {p === 1 ? (
                                <g>
                                    <rect x={panelX[p] + 4} y="38" width={colW - 4} height="68" rx="6" fill="none" className="stroke-muted-foreground" strokeWidth="1" strokeDasharray="4 4" />
                                    <text x={panelX[p] + 4 + (colW - 4) / 2} y="66" textAnchor="middle" className={`${tone(t.gone[1])} text-[11px] opacity-50`}>
                                        {t.gone[0]}
                                    </text>
                                    <text x={panelX[p] + 4 + (colW - 4) / 2} y="86" textAnchor="middle" className="fill-muted-foreground text-[11px]">
                                        {t.removed}
                                    </text>
                                </g>
                            ) : null}
                            {cols.map(([name, date, k], c) => (
                                <g key={date}>
                                    <rect x={panelX[p] + offset + c * colW} y="38" width={colW - 4} height="68" rx="6" className="fill-card stroke-border" strokeWidth="1" />
                                    <text x={panelX[p] + offset + c * colW + (colW - 4) / 2} y="64" textAnchor="middle" className={`${tone(k)} text-[12px] font-semibold`}>
                                        {name}
                                    </text>
                                    <text x={panelX[p] + offset + c * colW + (colW - 4) / 2} y="84" textAnchor="middle" className={`${tone(k)} text-[11px]`}>
                                        {date}
                                    </text>
                                </g>
                            ))}
                        </g>
                    );
                })}
            </svg>
        </FigureFrame>
    );
}
