import type { ChartTone } from "../components/display/chart-utils"
import type { MeterTone } from "../components/display/Meter"
import type { BadgeVariantKey } from "../components/display/generated/variant-keys"

/**
 * The canonical semantic-status scale for Gunjo UI.
 *
 * Most tone-driven components (ScheduleGrid, Leaderboard, KanbanBoard, Gantt, …)
 * already accept exactly this union, so a `SemanticTone` value can be passed to
 * their `tone` prop directly. A handful of components use a **superset** or a
 * **different spelling** — pass those through the converters below instead of
 * hand-rolling a per-screen `Record` map (the recurring papercut in #294).
 *
 * ```ts
 * const status: SemanticTone = over ? "destructive" : near ? "warning" : "success"
 * <ScheduleGrid cells={[{ tone: status }]} />          // shared union — direct
 * <Badge variant={toBadgeVariant(status)} />           // superset — convert
 * <Meter tone={toMeterTone(status)} />
 * <DistributionBar segments={[{ tone: toChartTone(status) }]} />
 * ```
 */
export type SemanticTone =
    | "default"
    | "muted"
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "destructive"

/** Every {@link SemanticTone}, in canonical order. Handy for demos and pickers. */
export const SEMANTIC_TONES = [
    "default",
    "muted",
    "primary",
    "info",
    "success",
    "warning",
    "destructive",
] as const satisfies readonly SemanticTone[]

/** Narrowing type guard for {@link SemanticTone}. */
export function isSemanticTone(value: unknown): value is SemanticTone {
    return typeof value === "string" && (SEMANTIC_TONES as readonly string[]).includes(value)
}

/**
 * `SemanticTone` → chart vocabulary ({@link ChartTone}). Charts have no
 * `default`; it maps to the neutral `muted`. (Charts also add `accent`, which is
 * chart-only and not reachable from the canonical scale.)
 */
export function toChartTone(tone: SemanticTone): ChartTone {
    return tone === "default" ? "muted" : tone
}

/**
 * `SemanticTone` → {@link MeterTone}. Meter has no `default`; it maps to the
 * neutral `muted`.
 */
export function toMeterTone(tone: SemanticTone): MeterTone {
    return tone === "default" ? "muted" : tone
}

/**
 * `SemanticTone` → Badge `variant` ({@link BadgeVariantKey}). Badge has no
 * `primary`/`muted`: `primary` maps to the emphasized `default`, and `muted`
 * maps to the quiet `secondary`.
 */
export function toBadgeVariant(tone: SemanticTone): BadgeVariantKey {
    switch (tone) {
        case "primary":
            return "default"
        case "muted":
            return "secondary"
        default:
            // "default" | "info" | "success" | "warning" | "destructive" all exist verbatim
            return tone
    }
}

/**
 * The tone spelling used by components that name the error tone `danger` instead
 * of `destructive` (StatusBoard, Stringline).
 */
export type SemanticToneDanger =
    | "default"
    | "muted"
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "danger"

/**
 * `SemanticTone` → the `danger`-spelled vocabulary used by StatusBoard and
 * Stringline. Only `destructive` differs; everything else is identical.
 */
export function toDangerTone(tone: SemanticTone): SemanticToneDanger {
    return tone === "destructive" ? "danger" : tone
}
