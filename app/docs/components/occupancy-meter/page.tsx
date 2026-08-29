"use client";

import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import { OccupancyMeter } from "@gunjo/ui";

const usageCode = `import { OccupancyMeter } from "@gunjo/ui";

// A caption row (label + "2 / 7卓") above a neutral Meter bar.
<OccupancyMeter label="満席率" value={2} max={7} unit="卓" target={6} />`;

export default function OccupancyMeterDocPage() {
  const { locale, sectionLabels } = useLocale();
  const isJa = locale === "ja";

  const propsData = isJa
    ? [
        { name: "label", type: "ReactNode", description: "キャプションのラベル（満席率 / 稼働率 など）。文字列なら meter のアクセシブル名にもなります。" },
        { name: "value / max", type: "number", description: "現在値と上限。" },
        { name: "unit", type: "string", description: "readout の単位（卓・% など）。" },
        { name: "caption", type: "ReactNode", description: "右側の readout を差し替え。既定は value / max。" },
        { name: "target", type: "number", description: "目標マーカー。" },
        { name: "direction", type: "MeterProps['direction']", default: '"neutral"', description: "Meter に転送。既定は neutral（低い値を赤にしない）。" },
        { name: "tone / formatValue / size", type: "—", description: "Meter にそのまま転送。" },
      ]
    : [
        { name: "label", type: "ReactNode", description: "Caption label (満席率 / occupancy). Also the meter's accessible name when a string." },
        { name: "value / max", type: "number", description: "Current value and upper bound." },
        { name: "unit", type: "string", description: "Readout unit (卓, %, …)." },
        { name: "caption", type: "ReactNode", description: "Override the right-side readout. Defaults to value / max." },
        { name: "target", type: "number", description: "Goal marker." },
        { name: "direction", type: "MeterProps['direction']", default: '"neutral"', description: "Forwarded to Meter. Defaults to neutral (a low reading isn't red)." },
        { name: "tone / formatValue / size", type: "—", description: "Forwarded to Meter." },
      ];

  return (
    <ComponentLayout
      title={displayMetadata.occupancyMeter.title}
      description={displayMetadata.occupancyMeter.description}
      sectionLabels={sectionLabels}
      usedComponents={[{ name: "OccupancyMeter", href: "/docs/components/occupancy-meter" }, { name: "Meter", href: "/docs/components/meter" }]}
      relatedComponents={[{ name: "Meter", href: "/docs/components/meter" }, { name: "ReferenceValue", href: "/docs/components/reference-value" }]}
    >
      <ComponentPreview code={usageCode} codeBlock={<CodeBlock code={usageCode} />} sectionLabels={sectionLabels} previewHeight="auto" previewBodyWidth="md">
        <div className="w-full max-w-md">
          <OccupancyMeter label={isJa ? "満席率" : "Occupancy"} value={2} max={7} unit={isJa ? "卓" : ""} target={6} />
        </div>
      </ComponentPreview>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
          {isJa ? "状態とバリエーション" : "States and variants"}
        </h2>
        <ComponentDemoStates
          states={[
            {
              key: "occupancy",
              title: isJa ? "満席率（中立）" : "Occupancy (neutral)",
              description: isJa ? "既定 direction=neutral。低い値でも赤にならず、target はマーカー。" : "Defaults to direction=neutral: a low reading stays primary, target is a marker.",
              preview: (
                <div className="w-full max-w-md">
                  <OccupancyMeter label={isJa ? "満席率" : "Occupancy"} value={2} max={7} unit={isJa ? "卓" : ""} target={6} />
                </div>
              ),
              code: usageCode,
              previewBodyWidth: "md",
            },
            {
              key: "direction",
              title: isJa ? "満ちると困るものは direction を変える" : "Flip direction when filling up is bad",
              description: isJa
                ? "同時に作れる品数のように「上限に近づくほど困る」ゲージは higher-is-worse にします。8割で警告、上限に届くと危険色になります。"
                : "A gauge where approaching the cap is bad — concurrent kitchen slots — uses higher-is-worse: warning at 80%, destructive at the cap.",
              preview: (
                <div className="flex w-full max-w-md flex-col gap-4">
                  <OccupancyMeter
                    label={isJa ? "11:30 の調理枠" : "Kitchen slots 11:30"}
                    value={5}
                    max={14}
                    unit={isJa ? "品" : ""}
                    direction="higher-is-worse"
                  />
                  <OccupancyMeter
                    label={isJa ? "12:15 の調理枠" : "Kitchen slots 12:15"}
                    value={12}
                    max={14}
                    unit={isJa ? "品" : ""}
                    direction="higher-is-worse"
                  />
                  <OccupancyMeter
                    label={isJa ? "12:45 の調理枠" : "Kitchen slots 12:45"}
                    value={14}
                    max={14}
                    unit={isJa ? "品" : ""}
                    direction="higher-is-worse"
                  />
                </div>
              ),
              previewBodyWidth: "md",
              code: isJa
                ? `import { OccupancyMeter } from "@gunjo/ui";

const SLOTS = [
  { time: "11:30", cooking: 5 },
  { time: "12:15", cooking: 12 },
  { time: "12:45", cooking: 14 },
];

export function KitchenSlots() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {SLOTS.map((slot) => (
        <OccupancyMeter
          key={slot.time}
          label={\`\${slot.time} の調理枠\`}
          value={slot.cooking}
          max={14}
          unit="品"
          direction="higher-is-worse"
        />
      ))}
    </div>
  );
}`
                : `import { OccupancyMeter } from "@gunjo/ui";

const SLOTS = [
  { time: "11:30", cooking: 5 },
  { time: "12:15", cooking: 12 },
  { time: "12:45", cooking: 14 },
];

export function KitchenSlots() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {SLOTS.map((slot) => (
        <OccupancyMeter
          key={slot.time}
          label={\`Kitchen slots \${slot.time}\`}
          value={slot.cooking}
          max={14}
          unit=""
          direction="higher-is-worse"
        />
      ))}
    </div>
  );
}`,
            },
            {
              key: "caption",
              title: isJa ? "読み出しを言葉に差し替える" : "Replace the readout with words",
              description: isJa
                ? "既定の読み出しは「2 / 7卓」です。現場が数えたいのが残りなら caption で差し替えます。バーの位置は value のままです。"
                : "The default readout reads 2 / 7. When the floor counts what is left instead, caption replaces it — the bar still tracks value.",
              preview: (
                <div className="w-full max-w-md">
                  <OccupancyMeter
                    label={isJa ? "満席率" : "Occupancy"}
                    value={5}
                    max={7}
                    unit={isJa ? "卓" : ""}
                    target={6}
                    caption={isJa ? "残り2卓（5 / 7卓）" : "2 tables left (5 / 7)"}
                  />
                </div>
              ),
              previewBodyWidth: "md",
              code: isJa
                ? `import { OccupancyMeter } from "@gunjo/ui";

const SEATED = 5;
const TABLES = 7;

export function TablesLeft() {
  return (
    <div className="w-full max-w-md">
      <OccupancyMeter
        label="満席率"
        value={SEATED}
        max={TABLES}
        unit="卓"
        target={6}
        caption={\`残り\${TABLES - SEATED}卓（\${SEATED} / \${TABLES}卓）\`}
      />
    </div>
  );
}`
                : `import { OccupancyMeter } from "@gunjo/ui";

const SEATED = 5;
const TABLES = 7;

export function TablesLeft() {
  return (
    <div className="w-full max-w-md">
      <OccupancyMeter
        label="Occupancy"
        value={SEATED}
        max={TABLES}
        target={6}
        caption={\`\${TABLES - SEATED} tables left (\${SEATED} / \${TABLES})\`}
      />
    </div>
  );
}`,
            },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="props">
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
        <CodeBlock code={usageCode} />
      </section>
    </ComponentLayout>
  );
}
