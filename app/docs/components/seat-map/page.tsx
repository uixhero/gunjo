"use client";

import * as React from "react";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import displayMetadata from "@design/display-metadata.json";
import { SeatMap, type Seat, type SeatMapLabels } from "@gunjo/ui";

type Locale = "ja" | "en";

const columns = ["A", "B", "C", null, "D", "E", "F"];

function seatLabels(locale: Locale): SeatMapLabels | undefined {
  return locale === "ja"
    ? undefined
    : {
        available: "Available",
        occupied: "Occupied",
        held: "Held",
        blocked: "Blocked",
        selected: "Selected",
        selectedReason: "This seat is selected.",
        window: "Window",
        aisle: "Aisle",
        middle: "Middle",
        specialSeat: "Special seat",
        seatName: (seat) => `Seat ${seat.row}${seat.col}`,
      };
}

function seats(locale: Locale): Seat[] {
  const special = locale === "ja" ? "非常口座席" : "Exit row";
  const extra = locale === "ja" ? "足元ゆったり" : "Extra legroom";
  return [
    {
      id: "12A",
      row: 12,
      col: "A",
      position: "window",
      type: special,
      fee: 1500,
      reason: (_seat, context) =>
        locale === "ja"
          ? context.selected
            ? "選択中です。非常口座席のため、緊急時の補助に同意できる利用者だけ選択できます。"
            : "非常口座席のため、緊急時の補助に同意できる利用者だけ選択できます。"
          : context.selected
            ? "This seat is selected. Exit-row seats require the passenger to accept emergency-assistance duties."
            : "Exit-row seats require the passenger to accept emergency-assistance duties.",
    },
    { id: "12B", row: 12, col: "B", state: "occupied", reason: locale === "ja" ? "すでに予約済みのため選択できません。" : "This seat is already booked and cannot be selected." },
    { id: "12C", row: 12, col: "C", position: "aisle" },
    { id: "12D", row: 12, col: "D", position: "aisle", type: extra, fee: 1200, reason: locale === "ja" ? "足元ゆったり席です。追加料金がかかります。" : "Extra-legroom seat. An additional fee applies." },
    { id: "12E", row: 12, col: "E", state: "held", reason: locale === "ja" ? "別の利用者が決済手続き中のため、数分間選択できません。" : "Another passenger is checking out with this seat, so it is temporarily held." },
    { id: "12F", row: 12, col: "F", position: "window" },
    { id: "13A", row: 13, col: "A", position: "window" },
    { id: "13B", row: 13, col: "B" },
    { id: "13C", row: 13, col: "C", position: "aisle" },
    { id: "13D", row: 13, col: "D", position: "aisle" },
    { id: "13E", row: 13, col: "E" },
    { id: "13F", row: 13, col: "F", position: "window", state: "occupied", reason: locale === "ja" ? "すでに予約済みのため選択できません。" : "This seat is already booked and cannot be selected." },
  ];
}

function SeatMapPreview({ locale, mode = "default" }: { locale: Locale; mode?: "default" | "compact" | "legendless" }) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>(["12A"]);
  const copy = locale === "ja"
    ? { label: "座席表", selected: "選択中", none: "未選択" }
    : { label: "Seat map", selected: "Selected", none: "None" };

  React.useEffect(() => {
    setSelectedIds(["12A"]);
  }, [locale]);

  const toggle = (seatId: string) => {
    setSelectedIds((current) => current.includes(seatId) ? current.filter((id) => id !== seatId) : [...current, seatId].slice(0, 2));
  };

  return (
    <div className="flex w-full max-w-lg flex-col gap-3 rounded-lg border bg-card p-4">
      <SeatMap
        columns={mode === "compact" ? ["A", "B", null, "C", "D"] : columns}
        seats={seats(locale).filter((seat) => mode !== "compact" || ["A", "B", "C", "D"].includes(seat.col))}
        selectedIds={selectedIds}
        maxSelectable={2}
        onToggle={toggle}
        label={copy.label}
        labels={seatLabels(locale)}
        formatFee={(fee) => locale === "ja" ? `¥${fee.toLocaleString("ja-JP")}` : `$${Math.round(fee / 150).toLocaleString("en-US")}`}
        hideLegend={mode === "legendless"}
      />
      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground" aria-live="polite">
        {copy.selected}: <span className="font-medium text-foreground">{selectedIds.join(", ") || copy.none}</span>
      </p>
    </div>
  );
}

export default function SeatMapDocPage() {
  const { locale, sectionLabels } = useLocale();
  const content = getDocContent("components/seat-map", locale);
  const metadata = displayMetadata as Record<string, { title?: string; description?: string }>;
  const title = content?.title ?? metadata.seatMap.title ?? "SeatMap";
  const description = content?.description ?? metadata.seatMap.description ?? "";

  const usageCode = locale === "ja"
    ? `import * as React from "react";
	import { SeatMap, type Seat } from "@gunjo/ui";

	const columns = ["A", "B", "C", null, "D", "E", "F"];
	const seats: Seat[] = [
	  {
	    id: "12A",
	    row: 12,
	    col: "A",
	    position: "window",
	    type: "非常口座席",
	    fee: 1500,
	    reason: (_seat, context) =>
	      context.selected
	        ? "選択中です。非常口座席のため、緊急時の補助に同意できる利用者だけ選択できます。"
	        : "非常口座席のため、緊急時の補助に同意できる利用者だけ選択できます。",
	  },
	  { id: "12B", row: 12, col: "B", state: "occupied", reason: "すでに予約済みのため選択できません。" },
	  { id: "12C", row: 12, col: "C", position: "aisle" },
	  { id: "12D", row: 12, col: "D", position: "aisle", type: "足元ゆったり", fee: 1200, reason: "足元ゆったり席です。追加料金がかかります。" },
	  { id: "12E", row: 12, col: "E", state: "held", reason: "別の利用者が決済手続き中のため、数分間選択できません。" },
	  { id: "12F", row: 12, col: "F", position: "window" },
	  { id: "13A", row: 13, col: "A", position: "window" },
	  { id: "13B", row: 13, col: "B" },
	  { id: "13C", row: 13, col: "C", position: "aisle" },
	  { id: "13D", row: 13, col: "D", position: "aisle" },
	  { id: "13E", row: 13, col: "E" },
	  { id: "13F", row: 13, col: "F", position: "window", state: "occupied", reason: "すでに予約済みのため選択できません。" },
	];

export function SeatPicker() {
  const [selectedIds, setSelectedIds] = React.useState(["12A"]);
  const toggle = (seatId: string) =>
    setSelectedIds((current) => current.includes(seatId) ? current.filter((id) => id !== seatId) : [...current, seatId].slice(0, 2));

  return (
    <div className="flex w-full max-w-lg flex-col gap-3 rounded-lg border bg-card p-4">
      <SeatMap
        columns={columns}
        seats={seats}
        selectedIds={selectedIds}
        maxSelectable={2}
        onToggle={toggle}
        label="座席表"
        formatFee={(fee) => \`¥\${fee.toLocaleString("ja-JP")}\`}
      />
      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground" aria-live="polite">
        選択中: {selectedIds.join(", ") || "未選択"}
      </p>
    </div>
  );
}`
    : `import * as React from "react";
import { SeatMap, type Seat, type SeatMapLabels } from "@gunjo/ui";

	const columns = ["A", "B", "C", null, "D", "E", "F"];
	const seats: Seat[] = [
	  {
	    id: "12A",
	    row: 12,
	    col: "A",
	    position: "window",
	    type: "Exit row",
	    fee: 1500,
	    reason: (_seat, context) =>
	      context.selected
	        ? "This seat is selected. Exit-row seats require the passenger to accept emergency-assistance duties."
	        : "Exit-row seats require the passenger to accept emergency-assistance duties.",
	  },
	  { id: "12B", row: 12, col: "B", state: "occupied", reason: "This seat is already booked and cannot be selected." },
	  { id: "12C", row: 12, col: "C", position: "aisle" },
	  { id: "12D", row: 12, col: "D", position: "aisle", type: "Extra legroom", fee: 1200, reason: "Extra-legroom seat. An additional fee applies." },
	  { id: "12E", row: 12, col: "E", state: "held", reason: "Another passenger is checking out with this seat, so it is temporarily held." },
	  { id: "12F", row: 12, col: "F", position: "window" },
	  { id: "13A", row: 13, col: "A", position: "window" },
	  { id: "13B", row: 13, col: "B" },
	  { id: "13C", row: 13, col: "C", position: "aisle" },
	  { id: "13D", row: 13, col: "D", position: "aisle" },
	  { id: "13E", row: 13, col: "E" },
	  { id: "13F", row: 13, col: "F", position: "window", state: "occupied", reason: "This seat is already booked and cannot be selected." },
	];
const labels: SeatMapLabels = {
  available: "Available",
	  occupied: "Occupied",
	  held: "Held",
	  blocked: "Blocked",
		  selected: "Selected",
		  selectedReason: "This seat is selected.",
	  window: "Window",
	  aisle: "Aisle",
	  middle: "Middle",
	  specialSeat: "Special seat",
	  seatName: (seat) => \`Seat \${seat.row}\${seat.col}\`,
	};

export function SeatPicker() {
  const [selectedIds, setSelectedIds] = React.useState(["12A"]);
  const toggle = (seatId: string) =>
    setSelectedIds((current) => current.includes(seatId) ? current.filter((id) => id !== seatId) : [...current, seatId].slice(0, 2));

  return (
    <div className="flex w-full max-w-lg flex-col gap-3 rounded-lg border bg-card p-4">
      <SeatMap columns={columns} seats={seats} selectedIds={selectedIds} maxSelectable={2} onToggle={toggle} label="Seat map" labels={labels} formatFee={(fee) => \`$\${Math.round(fee / 150)}\`} />
      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground" aria-live="polite">
        Selected: {selectedIds.join(", ") || "None"}
      </p>
    </div>
  );
}`;

  const propsData = [
    { name: "columns", type: "(string | null)[]", description: locale === "ja" ? "列IDの並びです。null は通路として空けます。" : "Column order. null creates an aisle gap." },
    { name: "seats", type: "Seat[]", description: locale === "ja" ? "座席データです。id/row/col/state/type/position/fee を持ちます。" : "Seat data with id, row, col, state, type, position, and fee." },
    { name: "Seat.reason", type: "ReactNode | function", description: locale === "ja" ? "特別席、予約済、確保中、選択中など、座席状態の理由や補足をホバー/フォーカスで表示します。" : "Explanation shown on hover/focus for special, occupied, held, or selected seats." },
    { name: "selectedIds", type: "string[]", description: locale === "ja" ? "選択中の座席IDです。" : "Controlled selected seat ids." },
    { name: "maxSelectable", type: "number", description: locale === "ja" ? "選択上限です。" : "Maximum selectable seats." },
    { name: "onToggle", type: "(seatId: string) => void", description: locale === "ja" ? "操作可能な空席を選択/解除した時に呼ばれます。" : "Called when an interactive available seat is toggled." },
    { name: "formatFee", type: "(fee: number) => string", description: locale === "ja" ? "アクセシブル名に含める料金表示です。" : "Formats fees included in accessible names." },
    { name: "labels", type: "SeatMapLabels", description: locale === "ja" ? "状態、位置、凡例、座席名をローカライズします。" : "Localizes states, position names, legend copy, and composed seat names." },
    { name: "showHeaders / hideLegend", type: "boolean", description: locale === "ja" ? "列/行ヘッダーと凡例の表示を制御します。" : "Controls column/row headers and built-in legend visibility." },
  ];

  return (
    <ComponentLayout title={title} description={description} sectionLabels={sectionLabels} usedComponents={[{ name: "SeatMap", href: "/docs/components/seat-map" }]} relatedComponents={[{ name: "RadioCard", href: "/docs/components/radio-card" }, { name: "ScheduleGrid", href: "/docs/components/schedule-grid" }]}>
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <SeatMapPreview locale={locale} />
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">{locale === "ja" ? "状態とバリエーション" : "States and variants"}</h2>
        <ComponentDemoStates
          states={[
            { key: "selectable", title: locale === "ja" ? "選択可能" : "Selectable", description: locale === "ja" ? "空席を選択すると selectedIds が更新されます。特別席、予約済、確保中、選択中は Tooltip で理由を示します。" : "Selecting an available seat updates selectedIds. Special, occupied, held, and selected seats are explained by tooltips.", preview: <SeatMapPreview locale={locale} />, code: usageCode, previewBodyWidth: "md" },
            { key: "compact", title: locale === "ja" ? "小さい座席表" : "Compact map", description: locale === "ja" ? "通路の位置と列数を変えて小型の配置にも対応します。" : "Change columns and aisle placement for smaller layouts.", preview: <SeatMapPreview locale={locale} mode="compact" />, code: usageCode, previewBodyWidth: "md" },
            { key: "legendless", title: locale === "ja" ? "凡例なし" : "Hidden legend", description: locale === "ja" ? "周囲に凡例がある画面では hideLegend を使えます。状態の説明は周囲のUIに置く前提です。" : "Use hideLegend only when the surrounding screen already explains states.", preview: <SeatMapPreview locale={locale} mode="legendless" />, code: usageCode, previewBodyWidth: "md" },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">{sectionLabels.props}</h2>
        <PropsTable data={propsData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-3 border-b pb-2">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0" id="usage">{sectionLabels.usage}</h2>
          <CodeCopyButton code={usageCode} />
        </div>
        <div className="max-h-[350px] overflow-auto rounded-md border bg-muted font-mono text-sm">
          <CodeBlock code={usageCode} />
        </div>
      </section>
    </ComponentLayout>
  );
}
