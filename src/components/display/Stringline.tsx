"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

/** A stop on the route — its `distance` sets the vertical position (origin at top). */
export interface StringlineStop {
  id: string
  label: React.ReactNode
  /** Position along the route (km-post / cumulative distance / index). Drives the y axis. */
  distance: number
}

/** One (stop, time) sample of a run. `time` is in the same numeric unit as the axis (default: minutes from midnight). */
export interface StringlineRunPoint {
  stopId: string
  time: number
  /** Mark this sample as a pass-through (no dwell) vs a stop — currently informational. */
  pass?: boolean
}

export type StringlineTone =
  | "default"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "muted"

export interface StringlineRun {
  id: string | number
  label?: React.ReactNode
  /** Direction along the route. Sets a default tone when `tone` is omitted (down→primary, up→info). */
  direction?: "down" | "up"
  tone?: StringlineTone
  /** Planned schedule samples — the run's diagonal line. */
  points: StringlineRunPoint[]
  /** Optional realized samples. When present, `points` renders dashed (planned) and `actual` solid. */
  actual?: StringlineRunPoint[]
  /** Make the run focusable/clickable (opens detail). */
  onSelect?: () => void
}

export interface StringlineProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Route stops (the distance axis), ordered origin→terminus. */
  stops: StringlineStop[]
  /** The runs (trains / buses / vehicles) drawn as diagonal time–distance lines. */
  runs: StringlineRun[]
  /** Time-axis domain, same unit as run point `time` (default unit: minutes from midnight). */
  startTime: number
  endTime: number
  /** Optional "now" time → a vertical now-line. SSR-safe: pass it in, never read the clock here. */
  now?: number
  /** Spacing of vertical time gridlines/labels, in time units. Default 60 (hourly when unit = minutes). */
  tickInterval?: number
  /** Format a time value for axis labels. Default renders minutes-from-midnight as HH:MM. */
  formatTime?: (time: number) => string
  /** Highlight one run (others dim). */
  selectedRunId?: string | number
  /** Plot height in px. Default 320. */
  height?: number
  /** Accessible name for the diagram. */
  ariaLabel?: string
  /** Localized labels used in generated accessible names. */
  labels?: { diagram?: string; stops?: string; runs?: string; run?: string; up?: string; down?: string }
}

const TONE_STROKE: Record<StringlineTone, string> = {
  default: "hsl(var(--foreground))",
  primary: "hsl(var(--primary))",
  info: "hsl(var(--info))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  danger: "hsl(var(--destructive))",
  muted: "hsl(var(--muted-foreground))",
}

const PAD = { top: 10, right: 16, bottom: 4, left: 4 }

function defaultFormatTime(time: number): string {
  const t = ((Math.round(time) % 1440) + 1440) % 1440
  const h = Math.floor(t / 60)
  const m = t % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

function toneFor(run: StringlineRun): string {
  if (run.tone) return TONE_STROKE[run.tone]
  if (run.direction === "up") return TONE_STROKE.info
  if (run.direction === "down") return TONE_STROKE.primary
  return TONE_STROKE.default
}

function useElementWidth<T extends HTMLElement>() {
  const [node, setNode] = React.useState<T | null>(null)
  const [width, setWidth] = React.useState(0)
  React.useEffect(() => {
    if (!node) return undefined
    const update = () => setWidth(node.getBoundingClientRect().width)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [node])
  return [setNode, width] as const
}

/**
 * Stringline — the time × distance run diagram (運行図表 / ダイヤグラム / Marey / string-line chart):
 * the route's stops on the distance (y) axis, time on the x axis, and each run a *diagonal* polyline
 * across the stops over time. Slope = speed, a horizontal kink = a dwell, and two lines converging =
 * a meet / overtake / bunching (続行・だんご). Supports bidirectional runs (up/down), an optional
 * now-line, planned-vs-actual pairs (planned dashed + actual solid with the leading edge dotted),
 * and focusable runs. The transport-ops view a Gantt structurally cannot draw (Gantt = resource
 * rows × horizontal bars; this transposes the same time engine onto a continuous distance axis).
 * SSR-safe: pass `now` in rather than reading the clock.
 */
export const Stringline = React.forwardRef<HTMLDivElement, StringlineProps>(
  (
    {
      className,
      stops,
      runs,
      startTime,
      endTime,
      now,
      tickInterval = 60,
      formatTime = defaultFormatTime,
      selectedRunId,
      height = 320,
      ariaLabel,
      labels,
      ...props
    },
    ref
  ) => {
    const [setPlotNode, measured] = useElementWidth<HTMLDivElement>()
    const width = measured || 640

    const distances = stops.map((s) => s.distance)
    const minDist = distances.length ? Math.min(...distances) : 0
    const maxDist = distances.length ? Math.max(...distances) : 1
    const distSpan = maxDist - minDist || 1
    const timeSpan = endTime - startTime || 1

    const plotW = Math.max(1, width - PAD.left - PAD.right)
    const plotH = Math.max(1, height - PAD.top - PAD.bottom)

    const xOf = (time: number) => PAD.left + ((time - startTime) / timeSpan) * plotW
    const yOf = (distance: number) => PAD.top + ((distance - minDist) / distSpan) * plotH

    const distanceById = React.useMemo(() => {
      const m = new Map<string, number>()
      for (const s of stops) m.set(s.id, s.distance)
      return m
    }, [stops])

    const polyOf = (pts: StringlineRunPoint[]) =>
      pts
        .map((p) => {
          const d = distanceById.get(p.stopId)
          if (d === undefined) return null
          return `${Number(xOf(p.time).toFixed(2))},${Number(yOf(d).toFixed(2))}`
        })
        .filter(Boolean)
        .join(" ")

    // Vertical time ticks.
    const ticks: number[] = []
    const firstTick = Math.ceil(startTime / tickInterval) * tickInterval
    for (let t = firstTick; t <= endTime; t += tickInterval) ticks.push(t)

    const nowX = now !== undefined && now >= startTime && now <= endTime ? xOf(now) : null

    return (
      <div
        ref={ref}
        role="img"
        aria-label={
          ariaLabel ??
          `${labels?.diagram ?? "Stringline diagram"}: ${stops.length} ${labels?.stops ?? "stops"}, ${runs.length} ${labels?.runs ?? "runs"}, ${formatTime(startTime)}-${formatTime(endTime)}`
        }
        className={cn("flex w-full min-w-0 gap-2", className)}
        {...props}
      >
        {/* distance (stop) axis */}
        <div className="relative shrink-0" style={{ height, width: 96 }} aria-hidden="true">
          {stops.map((s) => (
            <span
              key={s.id}
              className="absolute right-1 -translate-y-1/2 truncate text-right text-[11px] leading-tight text-muted-foreground"
              style={{ top: yOf(s.distance), maxWidth: 92 }}
            >
              {s.label}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div ref={setPlotNode} className="relative" style={{ height }}>
            <svg
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox={`0 0 ${Number(width.toFixed(2))} ${height}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* horizontal gridlines per stop */}
              {stops.map((s) => (
                <line
                  key={`h-${s.id}`}
                  x1={PAD.left}
                  x2={Number(width.toFixed(2)) - PAD.right}
                  y1={Number(yOf(s.distance).toFixed(2))}
                  y2={Number(yOf(s.distance).toFixed(2))}
                  stroke="hsl(var(--border) / 0.6)"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {/* vertical time gridlines */}
              {ticks.map((t) => (
                <line
                  key={`v-${t}`}
                  x1={Number(xOf(t).toFixed(2))}
                  x2={Number(xOf(t).toFixed(2))}
                  y1={PAD.top}
                  y2={height - PAD.bottom}
                  stroke="hsl(var(--border) / 0.45)"
                  strokeDasharray="3 3"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {/* now-line */}
              {nowX !== null ? (
                <line
                  x1={Number(nowX.toFixed(2))}
                  x2={Number(nowX.toFixed(2))}
                  y1={PAD.top}
                  y2={height - PAD.bottom}
                  stroke="hsl(var(--destructive))"
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                />
              ) : null}
              {/* runs */}
              {runs.map((run) => {
                const stroke = toneFor(run)
                const dim = selectedRunId !== undefined && selectedRunId !== run.id
                const hasActual = run.actual != null && run.actual.length > 0
                const planned = polyOf(run.points)
                const actual = hasActual ? polyOf(run.actual!) : null
                return (
                  <g key={run.id} opacity={dim ? 0.25 : 1}>
                    <polyline
                      points={planned}
                      fill="none"
                      stroke={stroke}
                      strokeWidth={hasActual ? 1.25 : 2}
                      strokeDasharray={hasActual ? "4 3" : undefined}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                    {actual ? (
                      <polyline
                        points={actual}
                        fill="none"
                        stroke={stroke}
                        strokeWidth={2.25}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    ) : null}
                  </g>
                )
              })}
            </svg>

            {/* focusable run hit-targets (positioned at each run's mid-sample) */}
            {runs.map((run) => {
              if (!run.onSelect) return null
              const samples = run.actual && run.actual.length ? run.actual : run.points
              const mid = samples[Math.floor(samples.length / 2)]
              const d = mid ? distanceById.get(mid.stopId) : undefined
              if (!mid || d === undefined) return null
              const selected = selectedRunId === run.id
              return (
                <button
                  key={`hit-${run.id}`}
                  type="button"
                  onClick={run.onSelect}
                  aria-label={`${labels?.run ?? "Run"} ${typeof run.label === "string" ? run.label : run.id}${
                    run.direction === "up" ? `, ${labels?.up ?? "up"}` : run.direction === "down" ? `, ${labels?.down ?? "down"}` : ""
                  }`}
                  aria-pressed={selected}
                  className="absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={{ left: `${(xOf(mid.time) / width) * 100}%`, top: `${yOf(d)}px` }}
                />
              )
            })}
          </div>

          {/* time axis */}
          <div className="relative mt-1 h-4" aria-hidden="true">
            {ticks.map((t) => (
              <span
                key={`t-${t}`}
                className="absolute -translate-x-1/2 text-[11px] tabular-nums text-muted-foreground"
                style={{ left: `${(xOf(t) / width) * 100}%` }}
              >
                {formatTime(t)}
              </span>
            ))}
            {nowX !== null ? (
              <span
                className="absolute -translate-x-1/2 text-[11px] font-medium tabular-nums text-destructive"
                style={{ left: `${(nowX / width) * 100}%` }}
              >
                {formatTime(now!)}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
)
Stringline.displayName = "Stringline"
