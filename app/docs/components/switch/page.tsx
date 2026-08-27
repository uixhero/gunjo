"use client";

import { DisabledReasonTooltip } from "@/components/doc/DisabledReasonTooltip";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDocContent } from "@/lib/docs-content";
import inputsMetadata from "@design/inputs-metadata.json";
import { Label, Switch } from "@gunjo/ui";

function SwitchRow({ checked, disabled }: { checked?: boolean; disabled?: boolean }) {
    const { locale } = useLocale();
    const control = <Switch id={disabled ? "switch-managed" : "switch-autosave"} defaultChecked={checked} checked={disabled ? true : undefined} disabled={disabled} />;

    return (
        <div className="flex items-center gap-2">
            {disabled ? (
                <DisabledReasonTooltip reason={locale === "ja" ? "組織設定で固定されています。" : "This setting is managed by your organization."}>
                    {control}
                </DisabledReasonTooltip>
            ) : (
                control
            )}
            <Label htmlFor={disabled ? "switch-managed" : "switch-autosave"} className={disabled ? "text-muted-foreground" : undefined}>
                {disabled ? (locale === "ja" ? "組織設定で固定" : "Managed by organization") : locale === "ja" ? "自動保存" : "Auto-save"}
            </Label>
        </div>
    );
}

export default function SwitchPage() {
    const { locale, sectionLabels } = useLocale();
    const content = getDocContent("components/switch", locale);
    const isJa = locale === "ja";
    const code = isJa
        ? `import { Label, Switch } from "@gunjo/ui";

export function EmailNotificationSwitch() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="notifications" defaultChecked />
      <Label htmlFor="notifications">メール通知</Label>
    </div>
  );
}`
        : `import { Label, Switch } from "@gunjo/ui";

export function EmailNotificationSwitch() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="notifications" defaultChecked />
      <Label htmlFor="notifications">Email notifications</Label>
    </div>
  );
}`;

    const usageCode = isJa
        ? `import * as React from "react";
import { Label, Switch } from "@gunjo/ui";

export function NotificationSettingSwitch() {
  const [enabled, setEnabled] = React.useState(true);

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="notifications"
        checked={enabled}
        onCheckedChange={setEnabled}
      />
      <Label htmlFor="notifications">メール通知</Label>
    </div>
  );
}`
        : `import * as React from "react";
import { Label, Switch } from "@gunjo/ui";

export function NotificationSettingSwitch() {
  const [enabled, setEnabled] = React.useState(true);

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="notifications"
        checked={enabled}
        onCheckedChange={setEnabled}
      />
      <Label htmlFor="notifications">Email notifications</Label>
    </div>
  );
}`;

    const propsData = [
        { name: "checked", type: "boolean", description: locale === "ja" ? "外部から制御するオン/オフ状態です。" : "Controlled checked state." },
        { name: "defaultChecked", type: "boolean", description: locale === "ja" ? "初期状態です。" : "Initial checked state for uncontrolled usage." },
        { name: "onCheckedChange", type: "(checked: boolean) => void", description: locale === "ja" ? "状態が変わった時に呼ばれます。" : "Called when the state changes." },
        { name: "disabled", type: "boolean", default: "false", description: locale === "ja" ? "切り替えできない状態にします。理由はツールチップで補足します。" : "Disables toggling. Explain the reason with a tooltip." },
    ];

    return (
        <ComponentLayout
            title={content?.title ?? inputsMetadata.switch.title}
            description={content?.description ?? inputsMetadata.switch.description}
            sectionLabels={sectionLabels}
            usedComponents={[
                { name: "Switch", href: "/docs/components/switch" },
                { name: "Label", href: "/docs/components/label" },
            ]}
            relatedComponents={[
                { name: "Checkbox", href: "/docs/components/checkbox" },
                { name: "Toggle", href: "/docs/components/toggle" },
                { name: "ToggleGroup", href: "/docs/components/toggle-group" },
                { name: "Form", href: "/docs/components/form" },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} sectionLabels={sectionLabels} previewHeight="auto">
                <div className="flex items-center gap-2">
                    <Switch id="notifications-preview" defaultChecked />
                    <Label htmlFor="notifications-preview">
                        {locale === "ja" ? "メール通知" : "Email notifications"}
                    </Label>
                </div>
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" id="states">
                    {locale === "ja" ? "状態とバリエーション" : "States and variants"}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "off",
                            title: locale === "ja" ? "オフ" : "Off",
                            description: locale === "ja" ? "機能が無効な状態です。単一設定のオン/オフに使います。" : "The setting is off. Use switches for a single on/off decision.",
                            preview: <SwitchRow />,
                            code: isJa
                                ? `import { Label, Switch } from "@gunjo/ui";

export function AutoSaveSwitchOff() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="autosave" />
      <Label htmlFor="autosave">自動保存</Label>
    </div>
  );
}`
                                : `import { Label, Switch } from "@gunjo/ui";

export function AutoSaveSwitchOff() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="autosave" />
      <Label htmlFor="autosave">Auto-save</Label>
    </div>
  );
}`,
                        },
                        {
                            key: "on",
                            title: locale === "ja" ? "オン" : "On",
                            description: locale === "ja" ? "初期値として有効にする場合は defaultChecked を使います。" : "Use defaultChecked when the setting should start on.",
                            preview: <SwitchRow checked />,
                            code: isJa
                                ? `import { Label, Switch } from "@gunjo/ui";

export function AutoSaveSwitchOn() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="autosave" defaultChecked />
      <Label htmlFor="autosave">自動保存</Label>
    </div>
  );
}`
                                : `import { Label, Switch } from "@gunjo/ui";

export function AutoSaveSwitchOn() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="autosave" defaultChecked />
      <Label htmlFor="autosave">Auto-save</Label>
    </div>
  );
}`,
                        },
                        {
                            key: "disabled",
                            title: locale === "ja" ? "無効化" : "Disabled",
                            description: locale === "ja" ? "切り替えできない理由はツールチップとラベルで示します。" : "Explain why the switch is disabled with a tooltip and label.",
                            preview: <SwitchRow disabled />,
                            code: isJa
                                ? `import {
  Label,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gunjo/ui";

export function ManagedAutoSaveSwitch() {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0}>
            <Switch id="switch-managed" checked disabled />
          </span>
        </TooltipTrigger>
        <TooltipContent>組織設定で固定されています。</TooltipContent>
      </Tooltip>
      <Label htmlFor="switch-managed" className="text-muted-foreground">
        組織設定で固定
      </Label>
    </div>
  );
}`
                                : `import {
  Label,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gunjo/ui";

export function ManagedAutoSaveSwitch() {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0}>
            <Switch id="switch-managed" checked disabled />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          This setting is managed by your organization.
        </TooltipContent>
      </Tooltip>
      <Label htmlFor="switch-managed" className="text-muted-foreground">
        Managed by organization
      </Label>
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
                <div className="rounded-md border bg-muted font-mono text-sm max-h-[350px] overflow-auto">
                    <CodeBlock code={usageCode} />
                </div>
            </section>
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {locale === "ja" ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {locale === "ja" ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>役割を素の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">button</code> に自分で付けた。</strong>資料は「見た目がスイッチでも役割が無ければ、読み上げは単なるボタンとしか言わない」を崩れた形に挙げています。GUNJO は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">button</code> に <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">role</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-checked</code> を付けています。チェックボックスの入力欄を使わなかったのは、つまみの動きを <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">justify-start</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">justify-end</code> の入れ替えで作っているためで、チェックと入り切りの意味の違いもここではっきりします。
                        </li>
                        <li>
                            <strong>ラベルを部品の中に入れて、名前を必ず持たせた。</strong>資料は「ラベルの無いスイッチ単体」を禁止に挙げています。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">label</code> を渡すと <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-labelledby</code> で結んだ文字が横に出て、その文字を押しても切り替わります。<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">description</code> は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-describedby</code> で結びます。何も渡さなければ素のスイッチだけを返すので、その場合は呼ぶ側で名前を付けることになります。
                        </li>
                        <li>
                            <strong>待っている間の状態は持っていません。</strong>資料は「通信が終わるまでは待機の見た目にして、連打を防ぐ」を挙げています。GUNJO の <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Switch</code> に待機はなく、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">disabled</code> で止めるところまでです。入りと切りの2つは設計の元データから生成された <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SwitchVariantKey</code> なので、3つ目の状態を足すには元データの側から変えることになります。
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/switch"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: スイッチ（Switch）
                            </a>
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>The role is applied by hand to a plain <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">button</code>.</strong> The article lists a missing role as a classic failure: it looks like a switch but a screen reader only says button. GUNJO puts the switch role and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-checked</code> on a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">button</code>. A checkbox input was not used because the knob is animated by swapping <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">justify-start</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">justify-end</code>, and the button also keeps the meaning distinct from a checkbox.
                        </li>
                        <li>
                            <strong>The label is inside the component, so a name always exists.</strong> The article forbids a bare switch with no label. Pass <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">label</code> and the text renders beside the control, tied with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-labelledby</code>, and clicking that text toggles too; <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">description</code> is tied with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-describedby</code>. Pass neither and you get the bare control, and naming it becomes the responsibility of the caller.
                        </li>
                        <li>
                            <strong>There is no pending state.</strong> The article asks for a loading state while an asynchronous change is in flight, to stop repeated presses. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Switch</code> has none; <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">disabled</code> is as far as it goes. Checked and unchecked are the two keys of <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">SwitchVariantKey</code>, generated from the design source, so a third state would have to start there.
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://www.uixhero.com/resources/ui-components/switch"
                                target="_blank"
                                rel="noreferrer"
                            >
                                UIXHERO: Switch (in Japanese)
                            </a>
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
